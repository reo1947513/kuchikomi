export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { getSessionForRole } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET() {
  const session = getSessionForRole("super");
  if (!session || session.role !== "super") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const campaigns = await prisma.campaign.findMany({
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(campaigns);
}

export async function POST(request: NextRequest) {
  const session = getSessionForRole("super");
  if (!session || session.role !== "super") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await request.json();
  const { title, content, target, startAt, endAt, scheduledSendAt } = body;

  if (!title?.trim() || !content?.trim()) {
    return NextResponse.json({ error: "タイトルと内容を入力してください" }, { status: 400 });
  }

  const campaign = await prisma.campaign.create({
    data: {
      title: title.trim(),
      content: content.trim(),
      target: target || "all",
      startAt: startAt ? new Date(startAt) : new Date(),
      endAt: endAt ? new Date(endAt) : null,
      scheduledSendAt: scheduledSendAt ? new Date(scheduledSendAt) : null,
    },
  });

  return NextResponse.json(campaign, { status: 201 });
}
