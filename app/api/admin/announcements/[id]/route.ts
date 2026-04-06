export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { getSessionForRole } from "@/lib/auth";
import { prisma } from "@/lib/db";

type Params = { params: { id: string } };

export async function PUT(request: NextRequest, { params }: Params) {
  const session = getSessionForRole("super");
  if (!session || session.role !== "super") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await request.json();
  const { title, content, category, isPublished, publishedAt } = body;

  const updated = await prisma.announcement.update({
    where: { id: params.id },
    data: {
      ...(title !== undefined && { title: title.trim() }),
      ...(content !== undefined && { content: content.trim() }),
      ...(category !== undefined && { category }),
      ...(isPublished !== undefined && { isPublished }),
      ...(publishedAt !== undefined && { publishedAt: new Date(publishedAt) }),
    },
  });

  return NextResponse.json(updated);
}

export async function DELETE(_request: NextRequest, { params }: Params) {
  const session = getSessionForRole("super");
  if (!session || session.role !== "super") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  await prisma.announcement.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
