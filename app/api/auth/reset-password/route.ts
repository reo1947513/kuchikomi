export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { sendPasswordResetEmail } from "@/lib/mail";
import crypto from "crypto";
import bcrypt from "bcryptjs";

// POST /api/auth/reset-password — request reset (send email)
export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: "メールアドレスを入力してください" }, { status: 400 });
    }

    const user = await prisma.user.findFirst({
      where: { email: email.trim().toLowerCase() },
    });

    // Always return success to prevent email enumeration
    if (!user) {
      return NextResponse.json({ ok: true });
    }

    // Generate token
    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await prisma.passwordReset.create({
      data: { userId: user.id, token, expiresAt },
    });

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://comista-kuchikomi.com";
    const resetUrl = `${baseUrl}/reset-password?token=${token}`;

    await sendPasswordResetEmail(user.email!, resetUrl);

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Password reset error:", error instanceof Error ? error.message : "Unknown error");
    return NextResponse.json({ error: "送信に失敗しました" }, { status: 500 });
  }
}

// PUT /api/auth/reset-password — set new password with token
export async function PUT(request: NextRequest) {
  try {
    const { token, password } = await request.json();

    if (!token || !password) {
      return NextResponse.json({ error: "無効なリクエストです" }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ error: "パスワードは6文字以上で設定してください" }, { status: 400 });
    }

    const resetRecord = await prisma.passwordReset.findUnique({
      where: { token },
      include: { user: true },
    });

    if (!resetRecord || resetRecord.usedAt || resetRecord.expiresAt < new Date()) {
      return NextResponse.json({ error: "このリンクは無効または期限切れです" }, { status: 400 });
    }

    const hashed = await bcrypt.hash(password, 12);

    await Promise.all([
      prisma.user.update({
        where: { id: resetRecord.userId },
        data: { password: hashed },
      }),
      prisma.passwordReset.update({
        where: { id: resetRecord.id },
        data: { usedAt: new Date() },
      }),
    ]);

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Password reset confirm error:", error instanceof Error ? error.message : "Unknown error");
    return NextResponse.json({ error: "パスワードの再設定に失敗しました" }, { status: 500 });
  }
}
