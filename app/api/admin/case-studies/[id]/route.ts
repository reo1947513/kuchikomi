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
  const { shopName, industry, title, content, result, rating, isPublished } = body;
  const updated = await prisma.caseStudy.update({
    where: { id: params.id },
    data: {
      ...(shopName !== undefined && { shopName: shopName.trim() }),
      ...(industry !== undefined && { industry: industry.trim() }),
      ...(title !== undefined && { title: title.trim() }),
      ...(content !== undefined && { content: content.trim() }),
      ...(result !== undefined && { result: result.trim() }),
      ...(rating !== undefined && { rating }),
      ...(isPublished !== undefined && { isPublished }),
    },
  });
  return NextResponse.json(updated);
}

export async function DELETE(_request: NextRequest, { params }: Params) {
  const session = getSessionForRole("super");
  if (!session || session.role !== "super") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  await prisma.caseStudy.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
