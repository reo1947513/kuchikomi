export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { getSessionForRole } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET() {
  const session = getSessionForRole("super");
  if (!session || session.role !== "super") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const announcements = await prisma.announcement.findMany({
    orderBy: { publishedAt: "desc" },
  });
  return NextResponse.json(announcements);
}

export async function POST(request: NextRequest) {
  const session = getSessionForRole("super");
  if (!session || session.role !== "super") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await request.json();
  const { title, content, category, isPublished, publishedAt } = body;

  if (!title?.trim() || !content?.trim()) {
    return NextResponse.json({ error: "タイトルと内容を入力してください" }, { status: 400 });
  }

  const announcement = await prisma.announcement.create({
    data: {
      title: title.trim(),
      content: content.trim(),
      category: category || "お知らせ",
      isPublished: isPublished ?? true,
      publishedAt: publishedAt ? new Date(publishedAt) : new Date(),
    },
  });

  return NextResponse.json(announcement, { status: 201 });
}
