export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic();

const DEFAULT_PROMPT_TEMPLATE = `以下のアンケート回答をもとに、Googleビジネスプロフィールに投稿する口コミ文章を作成してください。

口調: {tone}
キーワード（可能であれば含める）: {keywords}

アンケート回答:
{formattedResponses}

ガイドライン:
- 100文字程度の自然な文章
- 実際のお客様が書いたような口語的な表現
- 冒頭の表現を毎回変える
- アンケート回答に基づく具体的な内容のみ（架空の情報は禁止）
- 文章構成を毎回変える
- ポジティブな内容（ネガティブな回答は温かく改善点として表現）

口コミ文章のみ出力してください。`;

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const sessionId = params.id;

  const session = await prisma.reviewSession.findUnique({
    where: { id: sessionId },
    include: {
      survey: {
        include: {
          tones: { where: { isActive: true }, orderBy: { order: "asc" } },
        },
      },
      answers: {
        include: {
          question: {
            include: {
              choices: {
                orderBy: { order: "asc" },
              },
            },
          },
        },
      },
    },
  });

  if (!session) {
    return NextResponse.json({ error: "Session not found" }, { status: 404 });
  }

  // Check monthly review limit (0 = unlimited, e.g. premium plan)
  if (session.survey.monthlyReviewLimit > 0 && session.survey.monthlyReviewCount >= session.survey.monthlyReviewLimit) {
    return NextResponse.json(
      { error: "今月の口コミ生成上限に達しました。プランのアップグレードまたは追加レビューの購入をご検討ください。" },
      { status: 429 }
    );
  }

  if (session.answers.length === 0) {
    return NextResponse.json(
      { error: "No answers found for this session" },
      { status: 400 }
    );
  }

  // Sort answers by question order
  const sortedAnswers = session.answers.sort(
    (a, b) => a.question.order - b.question.order
  );

  // Build Q&A lines for the prompt
  const qaLines = sortedAnswers.map((answer) => {
    let answerText = "";
    if (answer.question.type === "choice" && answer.choiceId) {
      const choice = answer.question.choices.find(
        (c) => c.id === answer.choiceId
      );
      answerText = choice ? choice.text : "不明";
    } else if (answer.textValue) {
      answerText = answer.textValue;
    } else {
      answerText = "回答なし";
    }

    return `- 質問: ${answer.question.text}\n  回答: ${answerText}`;
  });

  const formattedResponses = qaLines.join("\n");

  // Select tone: randomly pick one active tone, or fall back to default
  const activeTones = session.survey.tones;
  let toneName = "敬体（です・ます調）";
  if (activeTones.length > 0) {
    const randomIndex = Math.floor(Math.random() * activeTones.length);
    toneName = activeTones[randomIndex].name;
  }

  // Build prompt from template or use default
  const template = session.survey.promptTemplate || DEFAULT_PROMPT_TEMPLATE;
  const keywords = session.survey.keywords ?? "";

  const prompt = template
    .replace("{tone}", toneName)
    .replace("{keywords}", keywords)
    .replace("{formattedResponses}", formattedResponses);

  let reviewText: string;

  try {
    const message = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 1024,
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const content = message.content[0];
    if (content.type !== "text") {
      throw new Error("Unexpected response type from Claude");
    }
    reviewText = content.text.trim();
  } catch (error) {
    console.error("Claude API error:", error);
    return NextResponse.json(
      { error: "Failed to generate review text" },
      { status: 500 }
    );
  }

  // Save the review text, mark session as completed, and increment monthly count
  await Promise.all([
    prisma.reviewSession.update({
      where: { id: sessionId },
      data: {
        reviewText,
        status: "completed",
      },
    }),
    prisma.survey.update({
      where: { id: session.survey.id },
      data: {
        monthlyReviewCount: { increment: 1 },
      },
    }),
  ]);

  return NextResponse.json({
    reviewText,
    googleBusinessUrl: session.survey.googleBusinessUrl ?? null,
    completionMessage: session.survey.completionMessage ?? null,
  });
}
