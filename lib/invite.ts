import crypto from "crypto";

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
    const timestamp = parseInt(payload.split(":")[1], 10);
    return Date.now() - timestamp < 30 * 24 * 60 * 60 * 1000;
  } catch {
    return false;
  }
}
