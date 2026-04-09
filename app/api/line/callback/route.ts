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
 * Returns a 200 HTML page with JS redirect instead of 302.
 * LINE in-app browser prefetches callback URLs; a 302 response to
 * prefetch causes navigation, but a 200 HTML response does not.
 */
function jsRedirectPage(url: string): NextResponse {
  return new NextResponse(
    `<!DOCTYPE html>
<html><head><meta charset="utf-8"><meta http-equiv="refresh" content="0;url=${escapeHtml(url)}">
<title>リダイレクト中</title></head>
<body><script>window.location.href="${escapeHtml(url)}";</script></body></html>`,
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
    return jsRedirectPage(`${dashboardUrl}?line=error`);
  }

  // No code/state = prefetch or direct navigation.
  // Return 200 HTML (not 302) to prevent prefetch from hijacking navigation.
  // The settings page will auto-detect LINE linking via visibilitychange.
  if (!code || !state) {
    return jsRedirectPage(dashboardUrl);
  }

  // Process OAuth callback server-side
  const parts = state.split(":");
  const userId = parts[1];
  if (!userId) {
    return jsRedirectPage(`${dashboardUrl}?line=error`);
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
      return jsRedirectPage(`${dashboardUrl}?line=error`);
    }

    const tokenData = await tokenRes.json();
    const accessToken = tokenData.access_token;

    const profileRes = await fetch("https://api.line.me/v2/profile", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!profileRes.ok) {
      console.error("LINE profile fetch failed:", await profileRes.text());
      return jsRedirectPage(`${dashboardUrl}?line=error`);
    }

    const profile = await profileRes.json();
    const lineUserId = profile.userId;

    await prisma.user.update({
      where: { id: userId },
      data: { lineUserId },
    });

    return jsRedirectPage(`${dashboardUrl}?line=success`);
  } catch (e) {
    console.error("LINE callback error:", e);
    return jsRedirectPage(`${dashboardUrl}?line=error`);
  }
}
