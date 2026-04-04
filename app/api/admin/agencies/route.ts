export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET(request: NextRequest) {
  const session = getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (session.role !== "super") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const agencies = await prisma.agency.findMany({
    include: {
      _count: { select: { users: true } },
      users: { select: { role: true } },
    },
    orderBy: { name: "asc" },
  });

  return NextResponse.json(
    agencies.map((a) => ({
      id: a.id,
      name: a.name,
      createdAt: a.createdAt,
      shopCount: a.users.filter((u) => u.role === "admin").length,
    }))
  );
}

export async function POST(request: NextRequest) {
  const session = getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (session.role !== "super") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  let body: { name: string };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { name } = body;

  if (!name || typeof name !== "string" || name.trim() === "") {
    return NextResponse.json({ error: "name is required" }, { status: 400 });
  }

  const agency = await prisma.agency.create({
    data: { name: name.trim() },
    include: {
      _count: { select: { users: true } },
    },
  });

  return NextResponse.json(agency, { status: 201 });
}
