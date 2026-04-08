export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { getSessionForRole } from "@/lib/auth";
import { prisma } from "@/lib/db";

const PREMIUM_PLANS = ["premium", "lifetime_premium"];

export async function GET() {
  const session = getSessionForRole("admin") || getSessionForRole("super");
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // Check plan - premium only
  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: { planType: true },
  });

  if (!user || !PREMIUM_PLANS.includes(user.planType ?? "")) {
    return NextResponse.json({ error: "この機能はプレミアムプランでのみご利用いただけます" }, { status: 403 });
  }

  const survey = await prisma.survey.findFirst({
    where: { userId: session.userId },
    orderBy: { createdAt: "asc" },
  });

  if (!survey) {
    return NextResponse.json({ error: "アンケートが見つかりません" }, { status: 404 });
  }

  const sessions = await prisma.reviewSession.findMany({
    where: { surveyId: survey.id, status: "completed" },
    include: {
      answers: {
        include: {
          question: { include: { choices: true } },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  // Build CSV
  const rows: string[][] = [];

  // Header
  const questions = await prisma.question.findMany({
    where: { surveyId: survey.id },
    orderBy: { order: "asc" },
  });
  const header = ["回答日時", ...questions.map((q) => q.text), "生成された口コミ", "Google投稿"];
  rows.push(header);

  for (const s of sessions) {
    const row: string[] = [
      new Date(s.createdAt).toLocaleString("ja-JP"),
    ];
    for (const q of questions) {
      const answer = s.answers.find((a) => a.questionId === q.id);
      if (!answer) {
        row.push("");
      } else if (answer.choiceId) {
        const choice = answer.question.choices.find((c: any) => c.id === answer.choiceId);
        row.push(choice?.text ?? "");
      } else {
        row.push(answer.textValue ?? "");
      }
    }
    row.push(s.reviewText ?? "");
    row.push(s.googleClickedAt ? "済" : "未");
    rows.push(row);
  }

  const bom = "\uFEFF";
  const csv = bom + rows.map((r) => r.map((c) => `"${c.replace(/"/g, '""')}"`).join(",")).join("\n");

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="kuchikomi-export-${new Date().toISOString().slice(0, 10)}.csv"`,
    },
  });
}
