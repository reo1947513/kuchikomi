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
 * Polling page for the no-params case (LINE in-app browser prefetch).
 *
 * The LINE in-app browser loads the callback URL without parameters before
 * the actual OAuth callback fires. The actual callback (with params) may
 * process in the background via a separate HTTP request, saving lineUserId.
 *
 * This page polls /api/auth/me to detect when linking completes, then
 * redirects to the dashboard with a success message.
 */
function pollingPage(dashboardUrl: string): NextResponse {
  return new NextResponse(
    `<!DOCTYPE html>
<html><head><meta charset="utf-8"><title>LINE連携処理中</title><meta name="robots" content="noindex">
<style>@keyframes spin{to{transform:rotate(360deg)}}</style></head>
<body style="display:flex;justify-content:center;align-items:center;height:100vh;font-family:sans-serif;color:#555;margin:0;">
<div style="text-align:center;">
<div style="width:40px;height:40px;border:3px solid #e5e7eb;border-top-color:#06C755;border-radius:50%;animation:spin 1s linear infinite;margin:0 auto;"></div>
<p style="margin-top:16px;font-size:15px;">LINE連携処理中...</p>
<p style="font-size:12px;color:#999;margin-top:8px;">しばらくお待ちください</p>
</div>
<script>
var a=0;
function c(){
  fetch("/api/auth/me",{credentials:"include"})
    .then(function(r){return r.json()})
    .then(function(d){
      if(d.lineUserId){
        window.location.href="${escapeHtml(dashboardUrl)}?line=success";
      }else if(++a<15){
        setTimeout(c,1000);
      }else{
        window.location.href="${escapeHtml(dashboardUrl)}";
      }
    })
    .catch(function(){
      if(++a<15){setTimeout(c,1000)}
      else{window.location.href="${escapeHtml(dashboardUrl)}";}
    });
}
setTimeout(c,1000);
</script>
</body></html>`,
    { status: 200, headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store" } }
  );
}

/**
 * JS redirect page — used instead of 302 to avoid prefetch issues.
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
  // Return a polling page that checks /api/auth/me for lineUserId.
  // The actual OAuth callback may process in the background.
  if (!code || !state) {
    return pollingPage(dashboardUrl);
  }

  // Has code and state — process OAuth token exchange server-side.
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
