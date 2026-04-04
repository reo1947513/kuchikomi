export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET() {
  const session = getSession();
  if (!session || session.role !== "super") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const faqs = await prisma.faq.findMany({ orderBy: { order: "asc" } });
  return NextResponse.json(faqs);
}

export async function POST(request: NextRequest) {
  const session = getSession();
  if (!session || session.role !== "super") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await request.json();
  const { question, answer } = body;

  if (!question?.trim() || !answer?.trim()) {
    return NextResponse.json({ error: "質問と回答を入力してください" }, { status: 400 });
  }

  const count = await prisma.faq.count();
  const faq = await prisma.faq.create({
    data: { question: question.trim(), answer: answer.trim(), order: count },
  });

  return NextResponse.json(faq, { status: 201 });
}
