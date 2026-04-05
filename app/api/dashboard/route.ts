export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { getSessionForRole } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET() {
  const session = getSessionForRole("admin") || getSessionForRole("super");
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
    return NextResponse.json({
      user, survey: null, monthlyCounts: [], recentSessions: [],
      adviceCount: 0, adviceList: [],
      lastMonthCount: 0, totalSessionCount: 0, totalAccessCount: 0,
    });
  }

  const now = new Date();
  const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const twelveMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 11, 1);

  // All sessions (completed, non-test) in last 12 months
  const allSessions = await prisma.reviewSession.findMany({
    where: { surveyId: survey.id, status: "completed", isTest: false, createdAt: { gte: twelveMonthsAgo } },
    select: { id: true, createdAt: true },
    orderBy: { createdAt: "asc" },
  });

  const thisMonthCount = allSessions.filter((s) => new Date(s.createdAt) >= startOfThisMonth).length;
  const lastMonthCount = allSessions.filter((s) => {
    const d = new Date(s.createdAt);
    return d >= startOfLastMonth && d < startOfThisMonth;
  }).length;

  // Total completed sessions (all time, non-test)
  const totalSessionCount = await prisma.reviewSession.count({
    where: { surveyId: survey.id, status: "completed", isTest: false },
  });

  // Total access count (all sessions including in_progress, non-test)
  const totalAccessCount = await prisma.reviewSession.count({
    where: { surveyId: survey.id, isTest: false },
  });

  // Monthly counts for chart
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

  // Recent completed sessions (non-test) with answers
  const recentSessions = await prisma.reviewSession.findMany({
    where: { surveyId: survey.id, status: "completed", isTest: false },
    select: {
      id: true, reviewText: true, createdAt: true,
      answers: { select: { questionId: true, choiceId: true, textValue: true } },
    },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  // Google review click count (non-test)
  const googleClickCount = await prisma.reviewSession.count({
    where: { surveyId: survey.id, status: "completed", isTest: false, googleClickedAt: { not: null } },
  });

  // AI advice
  const adviceCount = await prisma.advice.count({
    where: { surveyId: survey.id, createdAt: { gte: startOfThisMonth } },
  });
  const adviceList = await prisma.advice.findMany({
    where: { surveyId: survey.id },
    orderBy: { createdAt: "desc" },
    take: 5,
    select: { id: true, content: true, dateFrom: true, dateTo: true, createdAt: true },
  });

  const surveyWithCount = { ...survey, monthlyReviewCount: thisMonthCount };

  return NextResponse.json({
    user, survey: surveyWithCount, monthlyCounts, recentSessions,
    adviceCount, adviceList,
    lastMonthCount, totalSessionCount, totalAccessCount, googleClickCount,
  });
}
