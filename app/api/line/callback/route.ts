export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const error = searchParams.get("error");

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://comista-kuchikomi.com";
  const dashboardUrl = `${appUrl}/dashboard/settings`;

  // LINE sent an explicit error
  if (error) {
    console.error("LINE callback error param:", error);
    return NextResponse.redirect(`${dashboardUrl}?line=error`);
  }

  // No code/state = prefetch or direct navigation, just redirect without error
  if (!code || !state) {
    return NextResponse.redirect(dashboardUrl);
  }

  // Extract userId from state
  const parts = state.split(":");
  const userId = parts[1];
  if (!userId) {
    console.error("LINE callback: userId not found in state:", state);
    return NextResponse.redirect(`${dashboardUrl}?line=error`);
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
      const errText = await tokenRes.text();
      console.error("LINE token exchange failed:", tokenRes.status, errText);
      return NextResponse.redirect(`${dashboardUrl}?line=error`);
    }

    const tokenData = await tokenRes.json();
    const accessToken = tokenData.access_token;

    const profileRes = await fetch("https://api.line.me/v2/profile", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!profileRes.ok) {
      console.error("LINE profile fetch failed:", await profileRes.text());
      return NextResponse.redirect(`${dashboardUrl}?line=error`);
    }

    const profile = await profileRes.json();
    const lineUserId = profile.userId;

    await prisma.user.update({
      where: { id: userId },
      data: { lineUserId },
    });

    return NextResponse.redirect(`${dashboardUrl}?line=success`);
  } catch (e) {
    console.error("LINE callback error:", e);
    return NextResponse.redirect(`${dashboardUrl}?line=error`);
  }
}
