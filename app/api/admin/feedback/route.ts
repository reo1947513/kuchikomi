export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { getSessionForRole } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET() {
  const session = getSessionForRole("super");
  if (!session || session.role !== "super") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const survey = await prisma.survey.findUnique({
    where: { id: "feedback-survey" },
    include: {
      questions: {
        include: { choices: { orderBy: { order: "asc" } } },
        orderBy: { order: "asc" },
      },
    },
  });

  if (!survey) {
    return NextResponse.json({ survey: null, sessions: [], stats: null });
  }

  const sessions = await prisma.reviewSession.findMany({
    where: { surveyId: "feedback-survey", status: "completed" },
    include: {
      answers: { select: { questionId: true, choiceId: true, textValue: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  // Build stats per question
  const stats = survey.questions.map((q) => {
    if (q.type === "choice") {
      const counts: Record<string, number> = {};
      q.choices.forEach((c) => { counts[c.text] = 0; });
      sessions.forEach((s) => {
        const a = s.answers.find((a) => a.questionId === q.id);
        if (a?.choiceId) {
          const choice = q.choices.find((c) => c.id === a.choiceId);
          if (choice) counts[choice.text] = (counts[choice.text] || 0) + 1;
        }
      });
      return { question: q.text, type: "choice", data: Object.entries(counts).map(([name, value]) => ({ name, value })) };
    } else {
      const texts = sessions
        .map((s) => {
          const a = s.answers.find((a) => a.questionId === q.id);
          return a?.textValue || null;
        })
        .filter(Boolean) as string[];
      return { question: q.text, type: "text", texts };
    }
  });

  return NextResponse.json({
    survey: { id: survey.id, title: survey.title },
    totalResponses: sessions.length,
    stats,
    sessions: sessions.map((s) => ({
      id: s.id,
      createdAt: s.createdAt,
      answers: s.answers,
    })),
  });
}
