import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

function getSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET environment variable is required");
  return secret;
}

export function signToken(payload: { userId: string; role: string }): string {
  return jwt.sign(payload, getSecret(), { expiresIn: "7d", algorithm: "HS256" });
}

export function verifyToken(token: string): { userId: string; role: string } | null {
  try {
    const decoded = jwt.verify(token, getSecret(), { algorithms: ["HS256"] }) as unknown as { userId: string; role: string };
    return decoded;
  } catch {
    return null;
  }
}

// Single cookie name for all roles
const AUTH_COOKIE = "auth_token";

export function cookieNameForRole(_role: string): string {
  return AUTH_COOKIE;
}

// Get the current session (single cookie, single session)
export function getSession(): { userId: string; role: string } | null {
  const jar = cookies();
  const token = jar.get(AUTH_COOKIE)?.value;
  if (token) {
    return verifyToken(token);
  }
  // Fallback: check legacy cookies for backward compat (one-time migration)
  const legacySuper = jar.get("auth_token_super")?.value;
  if (legacySuper) return verifyToken(legacySuper);
  const legacyShop = jar.get("auth_token_shop")?.value;
  if (legacyShop) return verifyToken(legacyShop);
  return null;
}

// Get session only if the role matches
export function getSessionForRole(preferredRole: "super" | "admin"): { userId: string; role: string } | null {
  const session = getSession();
  if (!session) return null;
  if (preferredRole === "super" && session.role === "super") return session;
  if (preferredRole === "admin" && session.role !== "super") return session;
  return null;
}
