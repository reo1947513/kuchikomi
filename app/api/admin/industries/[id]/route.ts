export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const session = getSession();
  if (!session || session.role !== "super") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { name } = await req.json();
  if (!name?.trim()) {
    return NextResponse.json({ error: "業種名を入力してください" }, { status: 400 });
  }
  try {
    const industry = await prisma.industry.update({
      where: { id: params.id },
      data: { name: name.trim() },
    });
    return NextResponse.json(industry);
  } catch {
    return NextResponse.json({ error: "更新に失敗しました" }, { status: 400 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const session = getSession();
  if (!session || session.role !== "super") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  await prisma.industry.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
