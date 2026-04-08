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

export function cookieNameForRole(role: string): string {
  return role === "super" ? "auth_token_super" : "auth_token_shop";
}

// Check both cookies, return whichever is valid
export function getSession(): { userId: string; role: string } | null {
  const jar = cookies();

  // Try super admin cookie
  const superToken = jar.get("auth_token_super")?.value;
  if (superToken) {
    const session = verifyToken(superToken);
    if (session) return session;
  }

  // Try shop admin cookie
  const shopToken = jar.get("auth_token_shop")?.value;
  if (shopToken) {
    const session = verifyToken(shopToken);
    if (session) return session;
  }

  // Fallback: old auth_token cookie (backward compat)
  const oldToken = jar.get("auth_token")?.value;
  if (oldToken) {
    const session = verifyToken(oldToken);
    if (session) return session;
  }

  return null;
}

// Get session for a specific role context - NO fallback
export function getSessionForRole(preferredRole: "super" | "admin"): { userId: string; role: string } | null {
  const jar = cookies();
  const cookieName = preferredRole === "super" ? "auth_token_super" : "auth_token_shop";

  const token = jar.get(cookieName)?.value;
  if (token) {
    return verifyToken(token);
  }

  return null;
}
