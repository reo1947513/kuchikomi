export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await prisma.reviewSession.findUnique({
    where: { id: params.id },
  });

  if (!session) {
    return NextResponse.json({ error: "Session not found" }, { status: 404 });
  }

  if (!session.googleClickedAt) {
    await prisma.reviewSession.update({
      where: { id: params.id },
      data: { googleClickedAt: new Date() },
    });
  }

  return NextResponse.json({ ok: true });
}
