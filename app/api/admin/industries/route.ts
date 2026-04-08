export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSessionForRole } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const session = getSessionForRole("super");
  if (!session || session.role !== "super") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const industries = await prisma.industry.findMany({ orderBy: [{ order: "asc" }, { name: "asc" }] });
  return NextResponse.json(industries);
}

export async function POST(req: NextRequest) {
  const session = getSessionForRole("super");
  if (!session || session.role !== "super") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { name } = await req.json();
  if (!name?.trim()) {
    return NextResponse.json({ error: "業種名を入力してください" }, { status: 400 });
  }
  try {
    const maxOrder = await prisma.industry.aggregate({ _max: { order: true } });
    const industry = await prisma.industry.create({ data: { name: name.trim(), order: (maxOrder._max.order ?? -1) + 1 } });
    return NextResponse.json(industry);
  } catch {
    return NextResponse.json({ error: "すでに存在する業種名です" }, { status: 400 });
  }
}

// PATCH: reorder industries
export async function PATCH(req: NextRequest) {
  const session = getSessionForRole("super");
  if (!session || session.role !== "super") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { order } = await req.json() as { order: string[] };
  if (!Array.isArray(order)) {
    return NextResponse.json({ error: "Invalid order" }, { status: 400 });
  }
  await Promise.all(order.map((id, i) => prisma.industry.update({ where: { id }, data: { order: i } })));
  return NextResponse.json({ ok: true });
}
