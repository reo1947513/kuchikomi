import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET() {
  const session = getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: { id: true, name: true, shopName: true },
  });

  const survey = await prisma.survey.findFirst({
    where: { userId: session.userId },
    include: {
      questions: {
        include: { choices: { orderBy: { order: "asc" } } },
        orderBy: { order: "asc" },
      },
    },
    orderBy: { createdAt: "asc" },
  });

  if (!survey) {
    return NextResponse.json({ user, survey: null, monthlyCounts: [], recentSessions: [], adviceCount: 0, adviceList: [] });
  }

  // Last 12 months of sessions
  const twelveMonthsAgo = new Date();
  twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 11);
  twelveMonthsAgo.setDate(1);
  twelveMonthsAgo.setHours(0, 0, 0, 0);

  const allSessions = await prisma.reviewSession.findMany({
    where: { surveyId: survey.id, status: "completed", createdAt: { gte: twelveMonthsAgo } },
    select: { id: true, createdAt: true },
    orderBy: { createdAt: "asc" },
  });

  // Build monthly counts for last 12 months
  const now = new Date();
  const monthlyCounts: { label: string; count: number }[] = [];
  for (let i = 11; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const label = `${d.getMonth() + 1}月`;
    const count = allSessions.filter((s) => {
      const sd = new Date(s.createdAt);
      return sd.getFullYear() === d.getFullYear() && sd.getMonth() === d.getMonth();
    }).length;
    monthlyCounts.push({ label, count });
  }

  // Recent completed sessions
  const recentSessions = await prisma.reviewSession.findMany({
    where: { surveyId: survey.id, status: "completed" },
    select: { id: true, reviewText: true, createdAt: true },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  // AI advice this month
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const adviceCount = await prisma.advice.count({
    where: { surveyId: survey.id, createdAt: { gte: startOfMonth } },
  });
  const adviceList = await prisma.advice.findMany({
    where: { surveyId: survey.id },
    orderBy: { createdAt: "desc" },
    take: 5,
    select: { id: true, content: true, dateFrom: true, dateTo: true, createdAt: true },
  });

  return NextResponse.json({ user, survey, monthlyCounts, recentSessions, adviceCount, adviceList });
}
