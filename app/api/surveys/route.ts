import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET(request: NextRequest) {
  const session = await getSession(request);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const surveys = await prisma.survey.findMany({
    where: session.role === "admin" ? {} : { userId: session.userId },
    include: {
      questions: {
        include: {
          choices: true,
        },
        orderBy: { order: "asc" },
      },
      user: {
        select: { id: true, name: true, email: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(surveys);
}

export async function POST(request: NextRequest) {
  const session = await getSession(request);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: {
    title: string;
    description?: string;
    googleBusinessUrl?: string;
    questions?: Array<{
      text: string;
      order: number;
      type: "choice" | "text";
      choices?: Array<{ text: string; order: number; score: number }>;
    }>;
  };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { title, description, googleBusinessUrl, questions = [] } = body;

  if (!title || typeof title !== "string" || title.trim() === "") {
    return NextResponse.json(
      { error: "タイトルは必須です" },
      { status: 400 }
    );
  }

  const survey = await prisma.survey.create({
    data: {
      title: title.trim(),
      description: description?.trim() ?? null,
      googleBusinessUrl: googleBusinessUrl?.trim() ?? null,
      userId: session.userId,
      questions: {
        create: questions.map((q) => ({
          text: q.text,
          order: q.order,
          type: q.type ?? "choice",
          choices: {
            create: (q.choices ?? []).map((c) => ({
              text: c.text,
              order: c.order,
              score: c.score ?? 0,
            })),
          },
        })),
      },
    },
    include: {
      questions: {
        include: { choices: true },
        orderBy: { order: "asc" },
      },
    },
  });

  return NextResponse.json(survey, { status: 201 });
}
