export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import crypto from "crypto";

export async function GET() {
  const session = getSession();
  if (!session) {
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://comista-kuchikomi.com";
    return NextResponse.redirect(`${appUrl}/login?redirect=/api/line/auth`);
  }

  const channelId = process.env.LINE_LOGIN_CHANNEL_ID;
  if (!channelId) {
    return NextResponse.json({ error: "LINE Login is not configured" }, { status: 500 });
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://comista-kuchikomi.com";
  const redirectUri = `${appUrl}/api/line/callback`;
  const state = crypto.randomBytes(16).toString("hex") + ":" + session.userId;

  const params = new URLSearchParams({
    response_type: "code",
    client_id: channelId,
    redirect_uri: redirectUri,
    state,
    scope: "profile openid",
    bot_prompt: "aggressive",
  });

  const lineAuthUrl = `https://access.line.me/oauth2/v2.1/authorize?${params.toString()}`;

  return NextResponse.redirect(lineAuthUrl);
}
