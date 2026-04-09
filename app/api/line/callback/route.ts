export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/**
 * Returns an HTML page instead of a 302 redirect.
 * LINE in-app browser prefetches the callback URL without parameters.
 * A 302 redirect in response to prefetch causes the browser to navigate away
 * before the actual OAuth callback arrives. Returning 200 HTML prevents this.
 */
function waitingPage(redirectUrl: string): NextResponse {
  return new NextResponse(
    `<!DOCTYPE html>
<html><head><meta charset="utf-8"><title>LINE連携</title><meta name="robots" content="noindex"></head>
<body style="display:flex;justify-content:center;align-items:center;height:100vh;font-family:sans-serif;color:#555;">
<div style="text-align:center;">
<p>LINE連携処理中...</p>
<p style="font-size:12px;color:#999;margin-top:8px;">自動的にページが切り替わります</p>
</div>
<script>setTimeout(function(){window.location.href="${escapeHtml(redirectUrl)}";},3000);</script>
</body></html>`,
    { status: 200, headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store" } }
  );
}

/**
 * Returns an HTML page that auto-submits the OAuth code/state via POST.
 * Since prefetch doesn't execute JavaScript, the form will never submit
 * during prefetch — only during actual user navigation.
 */
function processingPage(code: string, state: string): NextResponse {
  return new NextResponse(
    `<!DOCTYPE html>
<html><head><meta charset="utf-8"><title>LINE連携処理中</title><meta name="robots" content="noindex">
<style>@keyframes spin{to{transform:rotate(360deg)}}</style></head>
<body style="display:flex;justify-content:center;align-items:center;height:100vh;font-family:sans-serif;color:#555;">
<div style="text-align:center;">
<div style="width:40px;height:40px;border:3px solid #e5e7eb;border-top-color:#06C755;border-radius:50%;animation:spin 1s linear infinite;margin:0 auto;"></div>
<p style="margin-top:16px;">LINE連携処理中...</p>
</div>
<form id="f" method="POST" action="/api/line/callback">
<input type="hidden" name="code" value="${escapeHtml(code)}"/>
<input type="hidden" name="state" value="${escapeHtml(state)}"/>
</form>
<script>document.getElementById("f").submit();</script>
</body></html>`,
    { status: 200, headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store" } }
  );
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const error = searchParams.get("error");

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://comista-kuchikomi.com";
  const dashboardUrl = `${appUrl}/dashboard/settings`;

  if (error) {
    return NextResponse.redirect(`${dashboardUrl}?line=error`);
  }

  // No code/state = prefetch or direct navigation.
  // Return HTML (200) instead of redirect (302) to prevent LINE in-app
  // browser prefetch from hijacking navigation.
  if (!code || !state) {
    return waitingPage(dashboardUrl);
  }

  // Has code and state — return an HTML page that auto-submits via POST.
  // Prefetch won't execute JS, so the authorization code is safe.
  return processingPage(code, state);
}

/**
 * POST handler — performs the actual OAuth token exchange.
 * Only reachable via the auto-submitted form from the GET handler,
 * which requires JavaScript execution (unreachable by prefetch).
 */
export async function POST(request: NextRequest) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://comista-kuchikomi.com";
  const dashboardUrl = `${appUrl}/dashboard/settings`;

  let code: string | null = null;
  let state: string | null = null;

  try {
    const formData = await request.formData();
    code = formData.get("code") as string;
    state = formData.get("state") as string;
  } catch {
    return NextResponse.redirect(`${dashboardUrl}?line=error`, 303);
  }

  if (!code || !state) {
    return NextResponse.redirect(`${dashboardUrl}?line=error`, 303);
  }

  const parts = state.split(":");
  const userId = parts[1];
  if (!userId) {
    return NextResponse.redirect(`${dashboardUrl}?line=error`, 303);
  }

  try {
    const channelId = process.env.LINE_LOGIN_CHANNEL_ID;
    const channelSecret = process.env.LINE_LOGIN_CHANNEL_SECRET;
    const redirectUri = `${appUrl}/api/line/callback`;

    const tokenRes = await fetch("https://api.line.me/oauth2/v2.1/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        code,
        redirect_uri: redirectUri,
        client_id: channelId || "",
        client_secret: channelSecret || "",
      }),
    });

    if (!tokenRes.ok) {
      console.error("LINE token exchange failed:", tokenRes.status, await tokenRes.text());
      return NextResponse.redirect(`${dashboardUrl}?line=error`, 303);
    }

    const tokenData = await tokenRes.json();
    const accessToken = tokenData.access_token;

    const profileRes = await fetch("https://api.line.me/v2/profile", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!profileRes.ok) {
      console.error("LINE profile fetch failed:", await profileRes.text());
      return NextResponse.redirect(`${dashboardUrl}?line=error`, 303);
    }

    const profile = await profileRes.json();
    const lineUserId = profile.userId;

    await prisma.user.update({
      where: { id: userId },
      data: { lineUserId },
    });

    return NextResponse.redirect(`${dashboardUrl}?line=success`, 303);
  } catch (e) {
    console.error("LINE callback error:", e);
    return NextResponse.redirect(`${dashboardUrl}?line=error`, 303);
  }
}
