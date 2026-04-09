export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";

type Params = { params: { id: string } };

type BranchQuestionInput = {
  text: string;
  order: number;
  type: "choice" | "text";
  triggerChoiceId?: string | null;
  choices?: Array<{ text: string; order: number; score: number }>;
};

type QuestionInput = {
  text: string;
  order: number;
  type: "choice" | "text";
  isRandom?: boolean;
  groupName?: string | null;
  choices?: Array<{ text: string; order: number; score: number }>;
  branchQuestions?: BranchQuestionInput[];
};

async function checkSurveyAccess(surveyId: string, userId: string, role: string) {
  const survey = await prisma.survey.findUnique({ where: { id: surveyId } });
  if (!survey) return null;
  if (role === "super") return survey;
  if (role !== "admin" && survey.userId !== userId) return null;
  return survey;
}

// POST: add a single question to the survey
export async function POST(request: NextRequest, { params }: Params) {
  const session = getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const survey = await checkSurveyAccess(params.id, session.userId, session.role);
  if (!survey) {
    return NextResponse.json({ error: "Not found or Forbidden" }, { status: 404 });
  }

  let body: QuestionInput;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { text, order, type, isRandom, groupName, choices = [] } = body;

  if (!text || typeof text !== "string" || text.trim() === "") {
    return NextResponse.json({ error: "質問文は必須です" }, { status: 400 });
  }

  const question = await prisma.question.create({
    data: {
      text: text.trim(),
      order: order ?? 0,
      type: type ?? "choice",
      isRandom: isRandom ?? false,
      groupName: groupName ?? null,
      surveyId: params.id,
      choices: {
        create: choices.map((c) => ({
          text: c.text,
          order: c.order,
          score: c.score ?? 0,
        })),
      },
    },
    include: { choices: { orderBy: { order: "asc" } } },
  });

  return NextResponse.json(question, { status: 201 });
}

// PUT: replace ALL questions for the survey (delete existing, create new)
export async function PUT(request: NextRequest, { params }: Params) {
  const session = getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const survey = await checkSurveyAccess(params.id, session.userId, session.role);
  if (!survey) {
    return NextResponse.json({ error: "Not found or Forbidden" }, { status: 404 });
  }

  let body: { questions: QuestionInput[] };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { questions = [] } = body;

  // Replace all questions in a transaction
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const updatedQuestions = await prisma.$transaction(async (tx: any) => {
    // Delete answers, choices, then questions (branch questions cascade via onDelete)
    const qIds = (await tx.question.findMany({ where: { surveyId: params.id }, select: { id: true } })).map((q: {id: string}) => q.id);
    await tx.answer.deleteMany({ where: { questionId: { in: qIds } } });
    await tx.choice.deleteMany({ where: { questionId: { in: qIds } } });
    // Delete branch questions first, then parent questions
    await tx.question.deleteMany({ where: { surveyId: params.id, parentQuestionId: { not: null } } });
    await tx.question.deleteMany({ where: { surveyId: params.id } });

    // Create new questions (parent first, then branches)
    const created = [];
    for (const q of questions) {
      const parent = await tx.question.create({
        data: {
          text: q.text,
          order: q.order,
          type: q.type ?? "choice",
          isRandom: q.isRandom ?? false,
          groupName: q.groupName ?? null,
          surveyId: params.id,
          choices: {
            create: (q.choices ?? []).map((c) => ({
              text: c.text,
              order: c.order,
              score: c.score ?? 0,
            })),
          },
        },
        include: { choices: { orderBy: { order: "asc" } } },
      });

      // Create branch questions if any
      const branches = [];
      if (q.branchQuestions && q.branchQuestions.length > 0) {
        // Map old triggerChoiceId (index-based) to new choice IDs
        for (const bq of q.branchQuestions) {
          let resolvedTriggerChoiceId: string | null = null;
          if (bq.triggerChoiceId && parent.choices.length > 0) {
            const idx = parseInt(bq.triggerChoiceId, 10);
            if (!isNaN(idx) && idx >= 0 && idx < parent.choices.length) {
              resolvedTriggerChoiceId = parent.choices[idx].id;
            }
            // Invalid index or non-numeric → leave as null (skip broken reference)
          }

          const branch = await tx.question.create({
            data: {
              text: bq.text,
              order: bq.order,
              type: bq.type ?? "choice",
              isRandom: false,
              surveyId: params.id,
              parentQuestionId: parent.id,
              triggerChoiceId: resolvedTriggerChoiceId,
              choices: {
                create: (bq.choices ?? []).map((c) => ({
                  text: c.text,
                  order: c.order,
                  score: c.score ?? 0,
                })),
              },
            },
            include: { choices: { orderBy: { order: "asc" } } },
          });
          branches.push(branch);
        }
      }

      created.push({ ...parent, branchQuestions: branches });
    }

    return created;
  });

  return NextResponse.json(updatedQuestions);
}
