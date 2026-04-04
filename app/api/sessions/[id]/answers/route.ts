export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const sessionId = params.id;

  let body: { questionId: string; choiceId?: string; textValue?: string };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { questionId, choiceId, textValue } = body;

  if (!questionId || typeof questionId !== "string") {
    return NextResponse.json(
      { error: "questionId is required" },
      { status: 400 }
    );
  }

  const session = await prisma.reviewSession.findUnique({
    where: { id: sessionId },
  });

  if (!session) {
    return NextResponse.json({ error: "Session not found" }, { status: 404 });
  }

  if (session.status === "completed") {
    return NextResponse.json(
      { error: "Session is already completed" },
      { status: 400 }
    );
  }

  // Upsert: replace existing answer for the same question if it exists
  const existingAnswer = await prisma.answer.findFirst({
    where: { sessionId, questionId },
  });

  if (existingAnswer) {
    await prisma.answer.update({
      where: { id: existingAnswer.id },
      data: {
        choiceId: choiceId ?? null,
        textValue: textValue ?? null,
      },
    });
  } else {
    await prisma.answer.create({
      data: {
        sessionId,
        questionId,
        choiceId: choiceId ?? null,
        textValue: textValue ?? null,
      },
    });
  }

  const updatedSession = await prisma.reviewSession.findUnique({
    where: { id: sessionId },
    include: {
      answers: true,
    },
  });

  return NextResponse.json({
    sessionId,
    answerCount: updatedSession?.answers.length ?? 0,
    status: updatedSession?.status,
  });
}
