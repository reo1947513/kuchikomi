export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET() {
  const session = getSession();
  if (!session) return NextResponse.json([]);

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: { planType: true, contractEnd: true },
  });

  const now = new Date();

  // Determine user category
  let userCategory: string;
  if (!user?.planType) {
    if (user?.contractEnd && new Date(user.contractEnd) < now) {
      userCategory = "cancelled";
    } else {
      userCategory = "free";
    }
  } else {
    userCategory = "paid";
  }

  const campaigns = await prisma.campaign.findMany({
    where: {
      isPublished: true,
      startAt: { lte: now },
      OR: [{ endAt: null }, { endAt: { gte: now } }],
      target: { in: ["all", userCategory] },
    },
    orderBy: { startAt: "desc" },
    take: 5,
  });

  return NextResponse.json(campaigns);
}
