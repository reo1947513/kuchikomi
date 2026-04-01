import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";

type Params = { params: { id: string; questionId: string } };

export async function DELETE(request: NextRequest, { params }: Params) {
  const session = getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const survey = await prisma.survey.findUnique({ where: { id: params.id } });
  if (!survey) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  if (session.role !== "super" && session.role !== "admin" && survey.userId !== session.userId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const question = await prisma.question.findFirst({
    where: { id: params.questionId, surveyId: params.id },
  });
  if (!question) {
    return NextResponse.json({ error: "Question not found" }, { status: 404 });
  }

  await prisma.question.delete({ where: { id: params.questionId } });

  return NextResponse.json({ success: true });
}
