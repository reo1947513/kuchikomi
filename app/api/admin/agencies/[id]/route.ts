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

  let body: { name: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (!body.name?.trim()) {
    return NextResponse.json({ error: "代理店名を入力してください" }, { status: 400 });
  }

  const agency = await prisma.agency.update({
    where: { id: params.id },
    data: { name: body.name.trim() },
  });

  return NextResponse.json(agency);
}

export async function DELETE(request: NextRequest, { params }: Params) {
  const session = getSessionForRole("super");
  if (!session || session.role !== "super") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const userCount = await prisma.user.count({ where: { agencyId: params.id } });
  if (userCount > 0) {
    return NextResponse.json(
      { error: "この代理店にはユーザーが存在するため削除できません" },
      { status: 400 }
    );
  }

  await prisma.agency.delete({ where: { id: params.id } });
  return NextResponse.json({ success: true });
}
