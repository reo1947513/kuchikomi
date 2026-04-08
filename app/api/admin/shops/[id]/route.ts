export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { getSessionForRole } from "@/lib/auth";
import { prisma } from "@/lib/db";
import bcrypt from "bcryptjs";

type Params = { params: { id: string } };

export async function GET(request: NextRequest, { params }: Params) {
  const session = getSessionForRole("super");
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (session.role !== "super") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const shop = await prisma.user.findUnique({
    where: { id: params.id },
    select: {
      id: true,
      name: true,
      email: true,
      loginId: true,
      shopName: true,
      address: true,
      industry: true,
      agencyId: true,
      contractStart: true,
      contractEnd: true,
      noContractLimit: true,
      agency: { select: { id: true, name: true } },
      createdAt: true,
      updatedAt: true,
      surveys: {
        include: {
          questions: { include: { choices: true }, orderBy: { order: "asc" } },
          tones: { orderBy: { order: "asc" } },
        },
        orderBy: { createdAt: "desc" },
      },
      _count: { select: { surveys: true } },
    },
  });

  if (!shop) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(shop);
}

export async function PUT(request: NextRequest, { params }: Params) {
  const session = getSessionForRole("super");
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (session.role !== "super") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const existing = await prisma.user.findUnique({
    where: { id: params.id },
    select: { id: true },
  });

  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  let body: {
    name?: string;
    email?: string;
    loginId?: string;
    password?: string;
    shopName?: string;
    address?: string;
    phone?: string;
    industry?: string;
    agencyId?: string;
    googleBusinessUrl?: string;
    monthlyReviewLimit?: number;
    contractStart?: string | null;
    contractEnd?: string | null;
    noContractLimit?: boolean;
  };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { name, email, loginId, password, shopName, address, phone, industry, agencyId, googleBusinessUrl, monthlyReviewLimit, contractStart, contractEnd, noContractLimit } = body;

  const updateData: Record<string, unknown> = {};
  if (name !== undefined) updateData.name = typeof name === "string" ? name.trim() : name;
  if (email !== undefined) updateData.email = typeof email === "string" && email.trim() ? email.trim() : null;
  if (loginId !== undefined) updateData.loginId = typeof loginId === "string" && loginId.trim() ? loginId.trim() : null;
  if (shopName !== undefined) updateData.shopName = typeof shopName === "string" && shopName.trim() ? shopName.trim() : null;
  if (address !== undefined) updateData.address = typeof address === "string" && address.trim() ? address.trim() : null;
  if (phone !== undefined) updateData.phone = typeof phone === "string" && phone.trim() ? phone.trim() : null;
  if (industry !== undefined) updateData.industry = typeof industry === "string" && industry.trim() ? industry.trim() : null;
  if (agencyId !== undefined) updateData.agencyId = agencyId || null;
  if (contractStart !== undefined) updateData.contractStart = contractStart ? new Date(contractStart) : null;
  if (contractEnd !== undefined) updateData.contractEnd = contractEnd ? new Date(contractEnd) : null;
  if (noContractLimit !== undefined) updateData.noContractLimit = noContractLimit;
  if (password && password.length > 0) {
    updateData.password = await bcrypt.hash(password, 12);
  }

  // Update first survey's googleBusinessUrl and monthlyReviewLimit if provided
  if (googleBusinessUrl !== undefined || monthlyReviewLimit !== undefined) {
    const firstSurvey = await prisma.survey.findFirst({
      where: { userId: params.id },
      orderBy: { createdAt: "asc" },
    });
    if (firstSurvey) {
      await prisma.survey.update({
        where: { id: firstSurvey.id },
        data: {
          ...(googleBusinessUrl !== undefined && { googleBusinessUrl: typeof googleBusinessUrl === "string" && googleBusinessUrl.trim() ? googleBusinessUrl.trim() : null }),
          ...(monthlyReviewLimit !== undefined && { monthlyReviewLimit }),
        },
      });
    }
  }

  try {
    const updated = await prisma.user.update({
      where: { id: params.id },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        loginId: true,
        shopName: true,
        address: true,
        industry: true,
        agencyId: true,
        agency: { select: { id: true, name: true } },
        createdAt: true,
        updatedAt: true,
        _count: { select: { surveys: true } },
      },
    });

    return NextResponse.json(updated);
  } catch (e: unknown) {
    if (typeof e === "object" && e !== null && "code" in e && (e as { code: string }).code === "P2002") {
      const target = (e as { meta?: { target?: string[] } }).meta?.target;
      if (target?.includes("email")) {
        return NextResponse.json({ error: "このメールアドレスは既に使用されています" }, { status: 409 });
      }
      if (target?.includes("loginId")) {
        return NextResponse.json({ error: "このログインIDは既に使用されています" }, { status: 409 });
      }
      return NextResponse.json({ error: "入力内容が他のユーザーと重複しています" }, { status: 409 });
    }
    console.error("Shop update error:", e);
    return NextResponse.json({ error: "更新に失敗しました" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: Params) {
  const session = getSessionForRole("super");
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (session.role !== "super") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const existing = await prisma.user.findUnique({
    where: { id: params.id },
    select: { id: true },
  });

  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  // Delete in dependency order to avoid FK constraint errors
  const surveys = await prisma.survey.findMany({
    where: { userId: params.id },
    select: { id: true },
  });
  const surveyIds = surveys.map((s) => s.id);

  const sessions = await prisma.reviewSession.findMany({
    where: { surveyId: { in: surveyIds } },
    select: { id: true },
  });
  const sessionIds = sessions.map((s) => s.id);

  const questions = await prisma.question.findMany({
    where: { surveyId: { in: surveyIds } },
    select: { id: true },
  });
  const questionIds = questions.map((q) => q.id);

  await prisma.answer.deleteMany({ where: { sessionId: { in: sessionIds } } });
  await prisma.reviewSession.deleteMany({ where: { id: { in: sessionIds } } });
  await prisma.choice.deleteMany({ where: { questionId: { in: questionIds } } });
  await prisma.question.deleteMany({ where: { id: { in: questionIds } } });
  await prisma.advice.deleteMany({ where: { surveyId: { in: surveyIds } } });
  await prisma.tone.deleteMany({ where: { surveyId: { in: surveyIds } } });
  await prisma.survey.deleteMany({ where: { id: { in: surveyIds } } });
  await prisma.user.delete({ where: { id: params.id } });

  return NextResponse.json({ success: true });
}
