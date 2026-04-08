export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { sendLineMonthlyReport } from "@/lib/line";

export async function GET(request: NextRequest) {
  // Verify cron secret
  const authHeader = request.headers.get("authorization");
  const querySecret = new URL(request.url).searchParams.get("secret");
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret && authHeader !== `Bearer ${cronSecret}` && querySecret !== cronSecret) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const now = new Date();
  // 先月の範囲を計算
  const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59);
  const monthLabel = `${lastMonthStart.getFullYear()}年${lastMonthStart.getMonth() + 1}月`;

  // LINE連携済み＋有料プランのユーザーを取得
  const users = await prisma.user.findMany({
    where: {
      lineUserId: { not: null },
      planType: { not: null },
      role: "admin",
    },
    select: {
      id: true,
      lineUserId: true,
      shopName: true,
      name: true,
      surveys: {
        select: {
          id: true,
          title: true,
          sessions: {
            where: {
              status: "completed",
              isTest: false,
              createdAt: { gte: lastMonthStart, lte: lastMonthEnd },
            },
            select: {
              reviewText: true,
              answers: {
                select: {
                  question: { select: { text: true } },
                  choiceId: true,
                  textValue: true,
                },
              },
            },
          },
        },
      },
    },
  });

  let sent = 0;
  const errors: string[] = [];

  for (const user of users) {
    if (!user.lineUserId) continue;

    // 全アンケートのセッションを集計
    let totalReviews = 0;
    const allKeywords: string[] = [];

    for (const survey of user.surveys) {
      totalReviews += survey.sessions.length;

      // 選択肢IDからテキストを取得してキーワードに追加
      const choiceIds = survey.sessions
        .flatMap((s) => s.answers.map((a) => a.choiceId))
        .filter((id): id is string => !!id);

      if (choiceIds.length > 0) {
        const choices = await prisma.choice.findMany({
          where: { id: { in: choiceIds } },
          select: { id: true, text: true },
        });
        const choiceMap = new Map(choices.map((c) => [c.id, c.text]));
        for (const s of survey.sessions) {
          for (const a of s.answers) {
            if (a.choiceId && choiceMap.has(a.choiceId)) {
              allKeywords.push(choiceMap.get(a.choiceId)!);
            }
          }
        }
      }
    }

    if (totalReviews === 0) continue; // レビューがなければスキップ

    // 頻出キーワードTop3
    const keywordCounts = new Map<string, number>();
    for (const kw of allKeywords) {
      keywordCounts.set(kw, (keywordCounts.get(kw) || 0) + 1);
    }
    const topKeywords = Array.from(keywordCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([k]) => k);

    try {
      await sendLineMonthlyReport(user.lineUserId, user.shopName || user.name, {
        totalReviews,
        averageRating: 0, // 現在の仕様にはレーティングデータなし
        topKeywords,
        month: monthLabel,
      });
      sent++;
    } catch (e) {
      errors.push(`${user.id}: ${e instanceof Error ? e.message : "unknown"}`);
    }
  }

  return NextResponse.json({
    message: "Monthly report sent",
    month: monthLabel,
    sent,
    errors: errors.length > 0 ? errors : undefined,
  });
}
