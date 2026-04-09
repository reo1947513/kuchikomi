export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";

/**
 * Warm keep endpoint - called by Vercel Cron every 5 minutes (Hobby plan: 1/day only)
 * Pings key API routes to keep serverless functions warm and avoid cold starts.
 */
export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://comista-kuchikomi.com";

  // Ping key endpoints to warm them up
  const endpoints = [
    "/api/auth/me",
    "/api/announcements",
    "/api/health",
  ];

  const results: { endpoint: string; status: number; ms: number }[] = [];

  for (const endpoint of endpoints) {
    const start = Date.now();
    try {
      const res = await fetch(`${appUrl}${endpoint}`, {
        headers: { "Cache-Control": "no-cache" },
      });
      results.push({ endpoint, status: res.status, ms: Date.now() - start });
    } catch {
      results.push({ endpoint, status: 0, ms: Date.now() - start });
    }
  }

  return NextResponse.json({ warmed: results.length, results });
}
