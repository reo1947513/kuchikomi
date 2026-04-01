import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import bcrypt from "bcryptjs";

export async function GET(request: NextRequest) {
  const session = await getSession(request);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (session.role !== "super") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const shops = await prisma.user.findMany({
    where: { role: "admin" },
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
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(shops);
}

export async function POST(request: NextRequest) {
  const session = await getSession(request);
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
