import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";

type Params = { params: { id: string } };

export async function GET(request: NextRequest, { params }: Params) {
  const session = getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const survey = await prisma.survey.findUnique({
    where: { id: params.id },
    include: {
      questions: {
        include: {
          choices: { orderBy: { order: "asc" } },
        },
        orderBy: { order: "asc" },
      },
      tones: { orderBy: { order: "asc" } },
      user: { select: { id: true, name: true, email: true } },
    },
  });

  if (!survey) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  if (session.role !== "super" && session.role !== "admin" && survey.userId !== session.userId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  return NextResponse.json(survey);
}

export async function PUT(request: NextRequest, { params }: Params) {
  const session = getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const survey = await prisma.survey.findUnique({
    where: { id: params.id },
  });

  if (!survey) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  if (session.role !== "super" && session.role !== "admin" && survey.userId !== session.userId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  let body: {
    title?: string;
    openingMessage?: string;
    closingMessage?: string;
    completionMessage?: string;
    keywords?: string;
    promptTemplate?: string;
    googleBusinessUrl?: string;
    logoUrl?: string;
    couponImageUrl?: string;
    couponEnabled?: boolean;
    themeMainColor?: string;
    themeUserColor?: string;
    themeTextColor?: string;
    maxRandomQuestions?: number;
    monthlyReviewLimit?: number;
    isActive?: boolean;
    tones?: Array<{ name: string; order: number; isActive?: boolean }>;
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
    couponImageUrl,
    couponEnabled,
    themeMainColor,
    themeUserColor,
    themeTextColor,
    maxRandomQuestions,
    monthlyReviewLimit,
    isActive,
    tones,
  } = body;

  // If tones are provided, replace all existing tones
  if (tones !== undefined) {
    await prisma.tone.deleteMany({ where: { surveyId: params.id } });
  }

  const updated = await prisma.survey.update({
    where: { id: params.id },
    data: {
      ...(title !== undefined && { title: title.trim() }),
      ...(openingMessage !== undefined && { openingMessage: openingMessage.trim() || null }),
      ...(closingMessage !== undefined && { closingMessage: closingMessage.trim() || null }),
      ...(completionMessage !== undefined && { completionMessage: completionMessage.trim() || null }),
      ...(keywords !== undefined && { keywords: keywords.trim() || null }),
      ...(promptTemplate !== undefined && { promptTemplate: promptTemplate.trim() || null }),
      ...(googleBusinessUrl !== undefined && { googleBusinessUrl: googleBusinessUrl.trim() || null }),
      ...(logoUrl !== undefined && { logoUrl: logoUrl.trim() || null }),
      ...(couponImageUrl !== undefined && { couponImageUrl: couponImageUrl.trim() || null }),
      ...(couponEnabled !== undefined && { couponEnabled }),
      ...(themeMainColor !== undefined && { themeMainColor: themeMainColor || null }),
      ...(themeUserColor !== undefined && { themeUserColor: themeUserColor || null }),
      ...(themeTextColor !== undefined && { themeTextColor: themeTextColor || null }),
      ...(maxRandomQuestions !== undefined && { maxRandomQuestions }),
      ...(monthlyReviewLimit !== undefined && { monthlyReviewLimit }),
      ...(isActive !== undefined && { isActive }),
      ...(tones !== undefined && {
        tones: {
          create: tones.map((t) => ({
            name: t.name,
            order: t.order,
            isActive: t.isActive ?? true,
          })),
        },
      }),
    },
    include: {
      questions: {
        include: { choices: { orderBy: { order: "asc" } } },
        orderBy: { order: "asc" },
      },
      tones: { orderBy: { order: "asc" } },
      user: { select: { id: true, name: true, email: true } },
    },
  });

  return NextResponse.json(updated);
}

export async function DELETE(request: NextRequest, { params }: Params) {
  const session = getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const survey = await prisma.survey.findUnique({
    where: { id: params.id },
  });

  if (!survey) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  if (session.role !== "super" && session.role !== "admin" && survey.userId !== session.userId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  await prisma.survey.delete({ where: { id: params.id } });

  return NextResponse.json({ success: true });
}
