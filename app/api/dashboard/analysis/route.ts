export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { getSessionForRole } from "@/lib/auth";
import { prisma } from "@/lib/db";
import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic();

export async function GET() {
  const session = getSessionForRole("admin") || getSessionForRole("super");
  if (!session || session.role === "super") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const survey = await prisma.survey.findFirst({
    where: { userId: session.userId },
    select: {
      id: true,
      title: true,
      questions: {
        select: { id: true, text: true, type: true, choices: { select: { id: true, text: true, score: true } } },
        orderBy: { order: "asc" },
      },
      sessions: {
        where: { status: "completed" },
        select: {
          id: true,
          createdAt: true,
          answers: { select: { questionId: true, choiceId: true, textValue: true } },
        },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!survey) {
    return NextResponse.json({ error: "Survey not found" }, { status: 404 });
  }

  const chartData = survey.questions
    .filter((q) => q.type === "choice")
    .map((q) => {
      const counts: Record<string, number> = {};
      q.choices.forEach((c) => { counts[c.text] = 0; });
      survey.sessions.forEach((s) => {
        const answer = s.answers.find((a) => a.questionId === q.id);
        if (answer?.choiceId) {
          const choice = q.choices.find((c) => c.id === answer.choiceId);
          if (choice) counts[choice.text] = (counts[choice.text] || 0) + 1;
        }
      });
      return {
        question: q.text,
        data: Object.entries(counts).map(([name, value]) => ({ name, value })),
      };
    });

  const now = new Date();
  const monthlySessions: { month: string; count: number }[] = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const start = new Date(d.getFullYear(), d.getMonth(), 1);
    const end = new Date(d.getFullYear(), d.getMonth() + 1, 1);
    const count = survey.sessions.filter(
      (s) => new Date(s.createdAt) >= start && new Date(s.createdAt) < end
    ).length;
    monthlySessions.push({ month: `${d.getFullYear()}/${d.getMonth() + 1}`, count });
  }

  return NextResponse.json({ totalSessions: survey.sessions.length, chartData, monthlySessions });
}

const PREMIUM_PLANS = ["premium", "lifetime_premium"];

export async function POST() {
  const session = getSessionForRole("admin") || getSessionForRole("super");
  if (!session || session.role === "super") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: { lastAnalysisAt: true, planType: true },
  });

  // AI analysis report is premium-only
  if (!user || !PREMIUM_PLANS.includes(user.planType ?? "")) {
    return NextResponse.json({ error: "AI分析レポートはプレミアムプランでのみご利用いただけます" }, { status: 403 });
  }

  if (user?.lastAnalysisAt) {
    const last = new Date(user.lastAnalysisAt);
    const now = new Date();
    if (last.getFullYear() === now.getFullYear() && last.getMonth() === now.getMonth()) {
      return NextResponse.json({ error: "今月のAI分析は既に実行済みです。来月またご利用ください。" }, { status: 429 });
    }
  }

  const survey = await prisma.survey.findFirst({
    where: { userId: session.userId },
    select: {
      title: true,
      questions: {
        select: { id: true, text: true, type: true, choices: { select: { id: true, text: true } } },
        orderBy: { order: "asc" },
      },
      sessions: {
        where: { status: "completed" },
        select: { answers: { select: { questionId: true, choiceId: true, textValue: true } } },
        take: 100,
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!survey || survey.sessions.length === 0) {
    return NextResponse.json({ error: "分析に必要なデータがありません" }, { status: 400 });
  }

  const summary = survey.questions.map((q) => {
    if (q.type === "choice") {
      const counts: Record<string, number> = {};
      q.choices.forEach((c) => { counts[c.text] = 0; });
      survey.sessions.forEach((s) => {
        const a = s.answers.find((ans) => ans.questionId === q.id);
        if (a?.choiceId) {
          const ch = q.choices.find((c) => c.id === a.choiceId);
          if (ch) counts[ch.text] = (counts[ch.text] || 0) + 1;
        }
      });
      const detail = Object.entries(counts).map(([k, v]) => `${k}: ${v}件`).join(", ");
      return `質問「${q.text}」: ${detail}`;
    }
    const texts = survey.sessions
      .map((s) => s.answers.find((a) => a.questionId === q.id)?.textValue)
      .filter(Boolean)
      .slice(0, 10);
    return `質問「${q.text}」(テキスト回答例): ${texts.join(" / ")}`;
  }).join("\n");

  const message = await anthropic.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 600,
    messages: [
      {
        role: "user",
        content: `あなたは店舗経営コンサルタントです。以下のアンケート結果を分析し、改善提案を含むレポートを400文字程度で作成してください。\n\n店舗名: ${survey.title}\n総回答数: ${survey.sessions.length}件\n\n${summary}`,
      },
    ],
  });

  const analysisText = message.content[0]?.type === "text" ? message.content[0].text : "分析結果を生成できませんでした。";

  await prisma.user.update({
    where: { id: session.userId },
    data: { lastAnalysisAt: new Date() },
  });

  return NextResponse.json({ analysisText });
}
