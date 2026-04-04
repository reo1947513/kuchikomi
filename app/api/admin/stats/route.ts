export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET(request: NextRequest) {
  const session = getSession();
  if (!session || session.role !== "super") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const now = new Date();
  const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);

  const [totalShops, totalReviews, recentSessions, industryGroups] = await Promise.all([
    prisma.user.count({ where: { role: "admin" } }),
    prisma.reviewSession.count({ where: { status: "completed" } }),
    prisma.reviewSession.findMany({
      where: { status: "completed", createdAt: { gte: sixMonthsAgo } },
      select: { createdAt: true },
    }),
    prisma.user.groupBy({
      by: ["industry"],
      where: { role: "admin" },
      _count: { id: true },
    }),
  ]);

  // Build monthly map (last 6 months, fill zeros)
  const monthlyMap: Record<string, number> = {};
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    monthlyMap[`${d.getFullYear()}年${d.getMonth() + 1}月`] = 0;
  }
  recentSessions.forEach((s) => {
    const key = `${s.createdAt.getFullYear()}年${s.createdAt.getMonth() + 1}月`;
    if (key in monthlyMap) monthlyMap[key]++;
  });

  return NextResponse.json({
    totalShops,
    totalReviews,
    monthlyReviews: Object.entries(monthlyMap).map(([month, count]) => ({ month, count })),
    industryDistribution: industryGroups.map((g) => ({
      industry: g.industry ?? "その他",
      count: g._count.id,
    })),
  });
}
