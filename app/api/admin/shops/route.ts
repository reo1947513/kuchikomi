export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { getSessionForRole } from "@/lib/auth";
import { prisma } from "@/lib/db";
import bcrypt from "bcryptjs";

export async function GET(request: NextRequest) {
  const session = getSessionForRole("super");
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (session.role !== "super") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search") ?? "";
  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));
  const limit = Math.min(50, parseInt(searchParams.get("limit") ?? "20", 10));
  const sortKey = searchParams.get("sortKey") ?? "";
  const sortDir = searchParams.get("sortDir") === "desc" ? "desc" : "asc";

  const where = {
    role: "admin" as const,
    ...(search
      ? {
          OR: [
            { shopName: { contains: search } },
            { name: { contains: search } },
          ],
        }
      : {}),
  };

  const needsPostSort = sortKey === "sessionCount" || sortKey === "contractDays";
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let orderBy: any = { createdAt: "desc" };
  if (sortKey === "shopName") orderBy = { shopName: sortDir };
  else if (sortKey === "name") orderBy = { name: sortDir };
  else if (sortKey === "contractDays") orderBy = { contractEnd: sortDir };

  if (needsPostSort) {
    const [total, allShops] = await Promise.all([
      prisma.user.count({ where }),
      prisma.user.findMany({
        where,
        select: {
          id: true, name: true, email: true, loginId: true, shopName: true,
          address: true, industry: true, agencyId: true,
          contractStart: true, contractEnd: true, noContractLimit: true,
          stripeSubscriptionId: true, planType: true,
          agency: { select: { id: true, name: true } },
          createdAt: true,
          surveys: {
            select: { id: true, googleBusinessUrl: true, monthlyReviewLimit: true, _count: { select: { sessions: true } } },
            orderBy: { createdAt: "asc" as const },
            take: 1,
          },
          _count: { select: { surveys: true } },
        },
        orderBy: { createdAt: "desc" },
      }),
    ]);

    const mapped = allShops.map((s) => ({
      ...s,
      firstSurveyId: s.surveys[0]?.id ?? null,
      googleBusinessUrl: s.surveys[0]?.googleBusinessUrl ?? null,
      monthlyReviewLimit: s.surveys[0]?.monthlyReviewLimit ?? 100,
      sessionCount: s.surveys.reduce((sum: number, sv: { _count: { sessions: number } }) => sum + sv._count.sessions, 0),
      surveys: undefined,
    }));

    const dir = sortDir === "asc" ? 1 : -1;
    if (sortKey === "sessionCount") {
      mapped.sort((a, b) => (a.sessionCount - b.sessionCount) * dir);
    } else if (sortKey === "contractDays") {
      const getDays = (s: typeof mapped[0]) => {
        if (s.noContractLimit) return 999999;
        if (!s.contractEnd) return -1;
        return Math.ceil((new Date(s.contractEnd).getTime() - Date.now()) / 86400000);
      };
      mapped.sort((a, b) => (getDays(a) - getDays(b)) * dir);
    }

    const paginated = mapped.slice((page - 1) * limit, page * limit);
    return NextResponse.json({ shops: paginated, total, page, totalPages: Math.max(1, Math.ceil(total / limit)) });
  }

  const [total, shops] = await Promise.all([
    prisma.user.count({ where }),
    prisma.user.findMany({
      where,
      select: {
        id: true, name: true, email: true, loginId: true, shopName: true,
        address: true, industry: true, agencyId: true,
        contractStart: true, contractEnd: true, noContractLimit: true,
        agency: { select: { id: true, name: true } },
        createdAt: true,
        surveys: {
          select: { id: true, googleBusinessUrl: true, monthlyReviewLimit: true, _count: { select: { sessions: true } } },
          orderBy: { createdAt: "asc" as const },
          take: 1,
        },
        _count: { select: { surveys: true } },
      },
      orderBy,
      skip: (page - 1) * limit,
      take: limit,
    }),
  ]);

  return NextResponse.json({
    shops: shops.map((s) => ({
      ...s,
      firstSurveyId: s.surveys[0]?.id ?? null,
      googleBusinessUrl: s.surveys[0]?.googleBusinessUrl ?? null,
      monthlyReviewLimit: s.surveys[0]?.monthlyReviewLimit ?? 100,
      sessionCount: s.surveys.reduce((sum: number, sv: { _count: { sessions: number } }) => sum + sv._count.sessions, 0),
      surveys: undefined,
    })),
    total, page, totalPages: Math.max(1, Math.ceil(total / limit)),
  });
}

export async function POST(request: NextRequest) {
  const session = getSessionForRole("super");
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (session.role !== "super") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  let body: {
    name: string; email?: string; loginId?: string; password: string;
    shopName?: string; address?: string; phone?: string; industry?: string; agencyId?: string;
    monthlyReviewLimit?: number; contractStart?: string; contractEnd?: string; noContractLimit?: boolean;
  };
  try { body = await request.json(); } catch { return NextResponse.json({ error: "Invalid JSON" }, { status: 400 }); }

  const { name, email, loginId, password, shopName, address, phone, industry, agencyId, monthlyReviewLimit, contractStart, contractEnd, noContractLimit } = body;

  if (!name || typeof name !== "string" || name.trim() === "") {
    return NextResponse.json({ error: "name is required" }, { status: 400 });
  }
  if (!password || typeof password !== "string" || password.length < 1) {
    return NextResponse.json({ error: "password is required" }, { status: 400 });
  }

  let finalLoginId = loginId?.trim() || null;
  if (!finalLoginId) {
    const lastUser = await prisma.user.findFirst({
      where: { loginId: { startsWith: "AG-" } },
      orderBy: { loginId: "desc" },
      select: { loginId: true },
    });
    const lastNum = lastUser?.loginId ? parseInt(lastUser.loginId.replace("AG-", ""), 10) : 0;
    finalLoginId = "AG-" + String(lastNum + 1).padStart(6, "0");
  }

  const hashedPassword = await bcrypt.hash(password, 12);
  const user = await prisma.user.create({
    data: {
      name: name.trim(), email: email?.trim() ?? null, loginId: finalLoginId,
      password: hashedPassword, role: "admin",
      shopName: shopName?.trim() ?? null, address: address?.trim() ?? null, phone: phone?.trim() ?? null,
      industry: industry?.trim() ?? null, agencyId: agencyId ?? null,
      contractStart: contractStart ? new Date(contractStart) : null,
      contractEnd: contractEnd ? new Date(contractEnd) : null,
      noContractLimit: noContractLimit ?? false,
      surveys: monthlyReviewLimit !== undefined
        ? { create: [{ title: shopName?.trim() ?? name.trim(), monthlyReviewLimit }] }
        : undefined,
    },
    select: {
      id: true, name: true, email: true, loginId: true, shopName: true,
      address: true, industry: true, agencyId: true,
      agency: { select: { id: true, name: true } },
      createdAt: true, _count: { select: { surveys: true } },
    },
  });
  return NextResponse.json(user, { status: 201 });
}
