export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { getSessionForRole } from "@/lib/auth";
import crypto from "crypto";

// Simple HMAC-based invite token (no DB needed)
const INVITE_SECRET = process.env.JWT_SECRET || "fallback-secret";

export function generateInviteToken(): string {
  const payload = `invite:${Date.now()}`;
  const hmac = crypto.createHmac("sha256", INVITE_SECRET).update(payload).digest("hex").slice(0, 16);
  return `${Buffer.from(payload).toString("base64url")}.${hmac}`;
}

export function verifyInviteToken(token: string): boolean {
  try {
    const [payloadB64, hmac] = token.split(".");
    if (!payloadB64 || !hmac) return false;
    const payload = Buffer.from(payloadB64, "base64url").toString();
    const expected = crypto.createHmac("sha256", INVITE_SECRET).update(payload).digest("hex").slice(0, 16);
    if (hmac !== expected) return false;
    // Token valid for 30 days
    const timestamp = parseInt(payload.split(":")[1], 10);
    return Date.now() - timestamp < 30 * 24 * 60 * 60 * 1000;
  } catch {
    return false;
  }
}

export async function GET() {
  const session = getSessionForRole("super");
  if (!session || session.role !== "super") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const token = generateInviteToken();
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://comista-kuchikomi.com";
  const url = `${baseUrl}/signup?invite=${token}`;

  return NextResponse.json({ token, url });
}
