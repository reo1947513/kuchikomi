import { describe, it, expect, beforeEach, vi } from "vitest";

// Mock next/headers before importing auth
vi.mock("next/headers", () => ({
  cookies: vi.fn(() => ({
    get: vi.fn(() => undefined),
  })),
}));

import { signToken, verifyToken } from "../lib/auth";

describe("auth", () => {
  describe("signToken / verifyToken", () => {
    it("returns a valid token that can be decoded", () => {
      const payload = { userId: "user-123", role: "admin" };
      const token = signToken(payload);
      expect(typeof token).toBe("string");
      expect(token.split(".")).toHaveLength(3); // JWT has 3 parts
    });

    it("verifyToken returns correct payload", () => {
      const payload = { userId: "user-abc", role: "super" };
      const token = signToken(payload);
      const decoded = verifyToken(token);
      expect(decoded).not.toBeNull();
      expect(decoded?.userId).toBe("user-abc");
      expect(decoded?.role).toBe("super");
    });

    it("verifyToken returns null for invalid token", () => {
      expect(verifyToken("not.a.valid.token")).toBeNull();
    });

    it("verifyToken returns null for empty string", () => {
      expect(verifyToken("")).toBeNull();
    });

    it("verifyToken returns null for tampered token", () => {
      const token = signToken({ userId: "u1", role: "admin" });
      const tampered = token.slice(0, -5) + "XXXXX";
      expect(verifyToken(tampered)).toBeNull();
    });

    it("preserves role through sign/verify cycle", () => {
      for (const role of ["super", "admin", "agent"]) {
        const token = signToken({ userId: "u", role });
        const decoded = verifyToken(token);
        expect(decoded?.role).toBe(role);
      }
    });
  });
});
