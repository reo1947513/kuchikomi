export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import bcrypt from "bcryptjs";

export async function GET(request: NextRequest) {
  const session = getSession();

  if (!session) {
    return NextResponse.json({ error: "認証が必要です" }, { status: 401 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: session.userId },
      select: {
        id: true,
        name: true,
        email: true,
        loginId: true,
        shopName: true,
        address: true,
        industry: true,
        role: true,
        contractStart: true,
        contractEnd: true,
        noContractLimit: true,
        createdAt: true,
        stripeCustomerId: true,
        stripeSubscriptionId: true,
        stripePriceId: true,
        planType: true,
        planReviewLimit: true,
        additionalReviews: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "ユーザーが見つかりません" }, { status: 401 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error("Me endpoint error:", error instanceof Error ? error.message : "Unknown error");
    return NextResponse.json({ error: "サーバーエラーが発生しました" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  const session = getSession();
  if (!session) {
    return NextResponse.json({ error: "認証が必要です" }, { status: 401 });
  }

  let body: {
    name?: string;
    shopName?: string;
    address?: string;
    industry?: string;
    currentPassword?: string;
    newPassword?: string;
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { name, shopName, address, industry, currentPassword, newPassword } = body;

  // Password change
  if (newPassword) {
    if (!currentPassword) {
      return NextResponse.json({ error: "現在のパスワードを入力してください" }, { status: 400 });
    }
    const user = await prisma.user.findUnique({ where: { id: session.userId } });
    if (!user) {
      return NextResponse.json({ error: "ユーザーが見つかりません" }, { status: 404 });
    }
    const valid = await bcrypt.compare(currentPassword, user.password);
    if (!valid) {
      return NextResponse.json({ error: "現在のパスワードが正しくありません" }, { status: 400 });
    }
    const hashed = await bcrypt.hash(newPassword, 12);
    await prisma.user.update({ where: { id: session.userId }, data: { password: hashed } });
    return NextResponse.json({ success: true });
  }

  // Profile update
  const updated = await prisma.user.update({
    where: { id: session.userId },
    data: {
      ...(name !== undefined && { name: name.trim() }),
      ...(shopName !== undefined && { shopName: shopName.trim() || null }),
      ...(address !== undefined && { address: address.trim() || null }),
      ...(industry !== undefined && { industry: industry.trim() || null }),
    },
    select: { id: true, name: true, email: true, loginId: true, shopName: true, address: true, industry: true, role: true },
  });

  return NextResponse.json(updated);
}
