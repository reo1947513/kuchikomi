export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { getSessionForRole } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET() {
  const session = getSessionForRole("super");
  if (!session || session.role !== "super") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const items = await prisma.caseStudy.findMany({ orderBy: { order: "asc" } });
  return NextResponse.json(items);
}

export async function POST(request: NextRequest) {
  const session = getSessionForRole("super");
  if (!session || session.role !== "super") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const body = await request.json();
  const { shopName, industry, title, content, result, rating } = body;
  if (!shopName?.trim() || !title?.trim() || !content?.trim() || !result?.trim()) {
    return NextResponse.json({ error: "必須項目を入力してください" }, { status: 400 });
  }
  const count = await prisma.caseStudy.count();
  const item = await prisma.caseStudy.create({
    data: { shopName: shopName.trim(), industry: industry?.trim() || "", title: title.trim(), content: content.trim(), result: result.trim(), rating: rating ?? 5, order: count },
  });
  return NextResponse.json(item, { status: 201 });
}
