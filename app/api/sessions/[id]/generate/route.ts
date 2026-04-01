import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic();

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const sessionId = params.id;

  const session = await prisma.reviewSession.findUnique({
    where: { id: sessionId },
    include: {
      survey: true,
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

  const surveyTitle = session.survey.title;
  const surveyDescription = session.survey.description ?? "";

  const prompt = `以下のアンケート回答をもとに、Googleビジネスプロフィールに投稿する口コミ文章を作成してください。

店舗・サービス情報:
- 店舗名: ${surveyTitle}
${surveyDescription ? `- 説明: ${surveyDescription}` : ""}

アンケート回答:
${qaLines.join("\n")}

口コミ文章の条件:
- 3〜5文程度の自然な文章
- 実際のお客様が書いたような口語的な表現
- ポジティブな内容（回答がネガティブな場合は、改善点として温かく述べる）
- Googleビジネスプロフィールへの投稿に適した内容

口コミ文章のみ出力してください。`;

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

  // Save the review text and mark session as completed
  await prisma.reviewSession.update({
    where: { id: sessionId },
    data: {
      reviewText,
      status: "completed",
    },
  });

  return NextResponse.json({
    reviewText,
    googleBusinessUrl: session.survey.googleBusinessUrl ?? null,
  });
}
