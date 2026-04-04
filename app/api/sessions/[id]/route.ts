import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await prisma.reviewSession.findUnique({
    where: { id: params.id },
    include: {
      survey: {
        select: {
          id: true,
          completionMessage: true,
          googleBusinessUrl: true,
          logoUrl: true,
          couponImageUrl: true,
          couponExpiry: true,
          couponEnabled: true,
        },
      },
    },
  });

  if (!session) {
    return NextResponse.json({ error: "Session not found" }, { status: 404 });
  }

  if (!session.reviewText) {
    return NextResponse.json({ error: "Review not yet generated" }, { status: 404 });
  }

  return NextResponse.json({
    id: session.id,
    reviewText: session.reviewText,
    createdAt: session.createdAt,
    surveyId: session.survey.id,
    completionMessage: session.survey.completionMessage ?? null,
    googleBusinessUrl: session.survey.googleBusinessUrl ?? null,
    logoUrl: session.survey.logoUrl ?? null,
    couponImageUrl: session.survey.couponEnabled ? (session.survey.couponImageUrl ?? null) : null,
    couponExpiry: session.survey.couponEnabled ? (session.survey.couponExpiry ?? null) : null,
  });
}
