import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const session = getSession();
  if (!session || session.role !== "super") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const industries = await prisma.industry.findMany({ orderBy: [{ order: "asc" }, { createdAt: "asc" }] });
  return NextResponse.json(industries);
}

export async function POST(req: NextRequest) {
  const session = getSession();
  if (!session || session.role !== "super") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { name } = await req.json();
  if (!name?.trim()) {
    return NextResponse.json({ error: "業種名を入力してください" }, { status: 400 });
  }
  try {
    const industry = await prisma.industry.create({ data: { name: name.trim() } });
    return NextResponse.json(industry);
  } catch {
    return NextResponse.json({ error: "すでに存在する業種名です" }, { status: 400 });
  }
}
