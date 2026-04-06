export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import bcrypt from "bcryptjs";
import { verifyInviteToken } from "@/lib/invite";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { inviteToken, shopName, name, email, password, address, industry, phone } = body;

    // Verify invite token
    if (!inviteToken || !verifyInviteToken(inviteToken)) {
      return NextResponse.json({ error: "無効または期限切れの招待リンクです" }, { status: 403 });
    }

    // Validate required fields
    if (!shopName?.trim()) return NextResponse.json({ error: "店舗名を入力してください" }, { status: 400 });
    if (!name?.trim()) return NextResponse.json({ error: "担当者名を入力してください" }, { status: 400 });
    if (!email?.trim()) return NextResponse.json({ error: "メールアドレスを入力してください" }, { status: 400 });
    if (!password || password.length < 6) return NextResponse.json({ error: "パスワードは6文字以上で設定してください" }, { status: 400 });

    // Check email uniqueness
    const existing = await prisma.user.findFirst({ where: { email: email.trim().toLowerCase() } });
    if (existing) {
      return NextResponse.json({ error: "このメールアドレスは既に登録されています" }, { status: 409 });
    }

    // Generate login ID
    const lastUser = await prisma.user.findFirst({
      where: { loginId: { startsWith: "AG-" } },
      orderBy: { loginId: "desc" },
      select: { loginId: true },
    });
    const lastNum = lastUser?.loginId ? parseInt(lastUser.loginId.replace("AG-", ""), 10) : 0;
    const loginId = "AG-" + String(lastNum + 1).padStart(6, "0");

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        loginId,
        password: hashedPassword,
        role: "admin",
        shopName: shopName.trim(),
        address: address?.trim() || null,
        industry: industry?.trim() || null,
        surveys: {
          create: [{ title: shopName.trim(), monthlyReviewLimit: 0 }],
        },
      },
      select: { id: true, loginId: true, name: true },
    });

    return NextResponse.json({ ok: true, loginId: user.loginId }, { status: 201 });
  } catch (error) {
    console.error("Signup error:", error instanceof Error ? error.message : "Unknown error");
    return NextResponse.json({ error: "アカウント作成に失敗しました" }, { status: 500 });
  }
}
