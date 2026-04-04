export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET(request: NextRequest) {
  const session = getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const surveys = await prisma.survey.findMany({
    where: session.role === "super" || session.role === "admin" ? {} : { userId: session.userId },
    include: {
      questions: { include: { choices: true }, orderBy: { order: "asc" } },
      tones: { orderBy: { order: "asc" } },
      user: { select: { id: true, name: true, email: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(surveys);
}

export async function POST(request: NextRequest) {
  const session = getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: {
    title: string;
    openingMessage?: string;
    closingMessage?: string;
    completionMessage?: string;
    keywords?: string;
    promptTemplate?: string;
    googleBusinessUrl?: string;
    logoUrl?: string;
    couponEnabled?: boolean;
    maxRandomQuestions?: number;
    monthlyReviewLimit?: number;
    questions?: Array<{
      text: string;
      order: number;
      type?: "choice" | "text";
      isRandom?: boolean;
      choices?: Array<{ text: string; order: number; score: number }>;
    }>;
    tones?: Array<{ name: string; order: number }>;
  };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const {
    title,
    openingMessage,
    closingMessage,
    completionMessage,
    keywords,
    promptTemplate,
    googleBusinessUrl,
    logoUrl,
    couponEnabled,
    maxRandomQuestions,
    monthlyReviewLimit,
    questions = [],
    tones = [],
  } = body;

  if (!title || typeof title !== "string" || title.trim() === "") {
    return NextResponse.json(
      { error: "タイトルは必須です" },
      { status: 400 }
    );
  }

  const survey = await prisma.survey.create({
    data: {
      title: title.trim(),
      openingMessage: openingMessage?.trim() ?? null,
      closingMessage: closingMessage?.trim() ?? null,
      completionMessage: completionMessage?.trim() ?? null,
      keywords: keywords?.trim() ?? null,
      promptTemplate: promptTemplate?.trim() ?? null,
      googleBusinessUrl: googleBusinessUrl?.trim() ?? null,
      logoUrl: logoUrl?.trim() ?? null,
      couponEnabled: couponEnabled ?? false,
      maxRandomQuestions: maxRandomQuestions ?? 0,
      monthlyReviewLimit: monthlyReviewLimit ?? 100,
      userId: session.userId,
      questions: {
        create: questions.map((q) => ({
          text: q.text,
          order: q.order,
          type: q.type ?? "choice",
          isRandom: q.isRandom ?? false,
          choices: {
            create: (q.choices ?? []).map((c) => ({
              text: c.text,
              order: c.order,
              score: c.score ?? 0,
            })),
          },
        })),
      },
      tones: {
        create: tones.map((t) => ({
          name: t.name,
          order: t.order,
        })),
      },
    },
    include: {
      questions: { include: { choices: true }, orderBy: { order: "asc" } },
      tones: { orderBy: { order: "asc" } },
      user: { select: { id: true, name: true, email: true } },
    },
  });

  return NextResponse.json(survey, { status: 201 });
}
