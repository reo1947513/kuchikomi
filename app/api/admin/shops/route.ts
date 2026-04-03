import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import bcrypt from "bcryptjs";

export async function GET(request: NextRequest) {
  const session = getSession();
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

  const [total, shops] = await Promise.all([
    prisma.user.count({ where }),
    prisma.user.findMany({
      where,
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
        surveys: {
          select: { id: true, googleBusinessUrl: true, monthlyReviewLimit: true, _count: { select: { sessions: true } } },
          orderBy: { createdAt: "asc" },
          take: 1,
        },
        _count: { select: { surveys: true } },
      },
      orderBy: { createdAt: "desc" },
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
    total,
    page,
    totalPages: Math.max(1, Math.ceil(total / limit)),
  });
}

export async function POST(request: NextRequest) {
  const session = getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (session.role !== "super") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  let body: {
    name: string;
    email?: string;
    loginId?: string;
    password: string;
    shopName?: string;
    address?: string;
    industry?: string;
    agencyId?: string;
    monthlyReviewLimit?: number;
    contractStart?: string;
    contractEnd?: string;
    noContractLimit?: boolean;
  };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const {
    name,
    email,
    loginId,
    password,
    shopName,
    address,
    industry,
    agencyId,
    monthlyReviewLimit,
    contractStart,
    contractEnd,
    noContractLimit,
  } = body;

  if (!name || typeof name !== "string" || name.trim() === "") {
    return NextResponse.json({ error: "name is required" }, { status: 400 });
  }

  if (!password || typeof password !== "string" || password.length < 1) {
    return NextResponse.json({ error: "password is required" }, { status: 400 });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      name: name.trim(),
      email: email?.trim() ?? null,
      loginId: loginId?.trim() ?? null,
      password: hashedPassword,
      role: "admin",
      shopName: shopName?.trim() ?? null,
      address: address?.trim() ?? null,
      industry: industry?.trim() ?? null,
      agencyId: agencyId ?? null,
      contractStart: contractStart ? new Date(contractStart) : null,
      contractEnd: contractEnd ? new Date(contractEnd) : null,
      noContractLimit: noContractLimit ?? false,
      surveys: monthlyReviewLimit !== undefined
        ? {
            create: [
              {
                title: shopName?.trim() ?? name.trim(),
                monthlyReviewLimit,
              },
            ],
          }
        : undefined,
    },
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
      _count: { select: { surveys: true } },
    },
  });

  return NextResponse.json(user, { status: 201 });
}
