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
    select: { userId: true },
  });

  if (!survey) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  if (session.role !== "super" && session.role !== "admin" && survey.userId !== session.userId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const tones = await prisma.tone.findMany({
    where: { surveyId: params.id },
    orderBy: { order: "asc" },
  });

  return NextResponse.json(tones);
}

export async function POST(request: NextRequest, { params }: Params) {
  const session = getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const survey = await prisma.survey.findUnique({
    where: { id: params.id },
    select: { userId: true },
  });

  if (!survey) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  if (session.role !== "super" && session.role !== "admin" && survey.userId !== session.userId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  let body: { name: string; order: number };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { name, order } = body;

  if (!name || typeof name !== "string" || name.trim() === "") {
    return NextResponse.json({ error: "name is required" }, { status: 400 });
  }

  const tone = await prisma.tone.create({
    data: {
      name: name.trim(),
      order: order ?? 0,
      surveyId: params.id,
    },
  });

  return NextResponse.json(tone, { status: 201 });
}

export async function DELETE(request: NextRequest, { params }: Params) {
  const session = getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const survey = await prisma.survey.findUnique({
    where: { id: params.id },
    select: { userId: true },
  });

  if (!survey) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  if (session.role !== "super" && session.role !== "admin" && survey.userId !== session.userId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const toneId = searchParams.get("toneId");

  if (!toneId) {
    return NextResponse.json({ error: "toneId query param is required" }, { status: 400 });
  }

  const tone = await prisma.tone.findUnique({
    where: { id: toneId },
  });

  if (!tone || tone.surveyId !== params.id) {
    return NextResponse.json({ error: "Tone not found" }, { status: 404 });
  }

  await prisma.tone.delete({ where: { id: toneId } });

  return NextResponse.json({ success: true });
}
