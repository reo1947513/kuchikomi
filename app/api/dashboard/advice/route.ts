export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { getSessionForRole } from "@/lib/auth";
import { prisma } from "@/lib/db";
import Anthropic from "@anthropic-ai/sdk";

const MONTHLY_ADVICE_LIMIT = 5;

export async function POST(request: NextRequest) {
  const session = getSessionForRole("admin");
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const survey = await prisma.survey.findFirst({
    where: { userId: session.userId },
    include: {
      questions: { include: { choices: { orderBy: { order: "asc" } } }, orderBy: { order: "asc" } },
    },
    orderBy: { createdAt: "asc" },
  });

  if (!survey) return NextResponse.json({ error: "Survey not found" }, { status: 404 });

  // Check monthly limit
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const usedCount = await prisma.advice.count({
    where: { surveyId: survey.id, createdAt: { gte: startOfMonth } },
  });
  if (usedCount >= MONTHLY_ADVICE_LIMIT) {
    return NextResponse.json({ error: "今月の利用上限に達しました" }, { status: 429 });
  }

  // Get date range from body
  let dateFrom: string | undefined, dateTo: string | undefined;
  try {
    const body = await request.json();
    dateFrom = body.dateFrom;
    dateTo = body.dateTo;
  } catch { /* no body */ }

  // Fetch recent answers for analysis
  const whereDate = dateFrom && dateTo ? {
    createdAt: { gte: new Date(dateFrom), lte: new Date(dateTo + "T23:59:59") },
  } : {};

  const sessions = await prisma.reviewSession.findMany({
    where: { surveyId: survey.id, status: "completed", ...whereDate },
    include: {
      answers: {
        include: {
          question: { include: { choices: true } },
        },
      },
    },
    orderBy: { createdAt: "desc" },
    take: 30,
  });

  if (sessions.length === 0) {
    return NextResponse.json({ error: "分析できる回答データがありません" }, { status: 400 });
  }

  // Build summary of answers
  const questionSummary = survey.questions.map((q) => {
    const answers = sessions.flatMap((s) =>
      s.answers.filter((a) => a.questionId === q.id)
    );
    if (q.type === "choice") {
      const counts: Record<string, number> = {};
      answers.forEach((a) => {
        if (a.choiceId) {
          const choice = q.choices.find((c) => c.id === a.choiceId);
          const label = choice?.text ?? "不明";
          counts[label] = (counts[label] ?? 0) + 1;
        }
      });
      return `Q: ${q.text}\n回答分布: ${Object.entries(counts).map(([k, v]) => `${k}(${v}件)`).join(", ")}`;
    } else {
      const texts = answers.map((a) => a.textValue).filter(Boolean).slice(0, 10);
      return `Q: ${q.text}\n自由回答例: ${texts.join(" / ")}`;
    }
  }).join("\n\n");

  const prompt = `以下はお客様アンケートの集計データです（${sessions.length}件）。
店舗のサービス改善に役立つ具体的なアドバイスを3〜5点、箇条書きで日本語で提供してください。

${questionSummary}

アドバイスは実用的かつ具体的にしてください。`;

  const client = new Anthropic();
  const message = await client.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 1024,
    messages: [{ role: "user", content: prompt }],
  });

  const content = message.content[0];
  if (content.type !== "text") {
    return NextResponse.json({ error: "AI応答エラー" }, { status: 500 });
  }

  const advice = await prisma.advice.create({
    data: {
      surveyId: survey.id,
      content: content.text.trim(),
      dateFrom: dateFrom ?? null,
      dateTo: dateTo ?? null,
    },
    select: { id: true, content: true, dateFrom: true, dateTo: true, createdAt: true },
  });

  return NextResponse.json({ advice, remaining: MONTHLY_ADVICE_LIMIT - usedCount - 1 });
}
