import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(request: NextRequest) {
  let body: { surveyId: string };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { surveyId } = body;

  if (!surveyId || typeof surveyId !== "string") {
    return NextResponse.json(
      { error: "surveyId is required" },
      { status: 400 }
    );
  }

  const survey = await prisma.survey.findUnique({
    where: { id: surveyId },
    include: {
      questions: {
        include: {
          choices: {
            orderBy: { order: "asc" },
          },
        },
        orderBy: { order: "asc" },
      },
    },
  });

  if (!survey) {
    return NextResponse.json({ error: "Survey not found" }, { status: 404 });
  }

  if (!survey.isActive) {
    return NextResponse.json({ error: "Survey is not active" }, { status: 403 });

  // Check owner contract status
  const owner = await prisma.user.findUnique({
    where: { id: survey.userId },
    select: { contractEnd: true, noContractLimit: true },
  });
  if (owner && !owner.noContractLimit && owner.contractEnd && new Date() > new Date(owner.contractEnd)) {
    return NextResponse.json({ error: "このアンケートは現在ご利用いただけません" }, { status: 403 });
  }
  }

  const session = await prisma.reviewSession.create({
    data: {
      surveyId,
    },
    include: {
      survey: {
        include: {
          questions: {
            include: {
              choices: {
                orderBy: { order: "asc" },
              },
            },
            orderBy: { order: "asc" },
          },
        },
      },
      answers: true,
    },
  });

  return NextResponse.json(session, { status: 201 });
}
