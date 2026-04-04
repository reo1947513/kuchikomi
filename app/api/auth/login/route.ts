export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";
import { signToken } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { identifier, password } = body as { identifier: string; password: string };

    if (!identifier || !password) {
      return NextResponse.json(
        { error: "メールアドレス/ログインIDとパスワードを入力してください" },
        { status: 400 }
      );
    }

    // Find user by email OR loginId
    const user = await prisma.user.findFirst({
      where: {
        OR: [{ email: identifier }, { loginId: identifier }],
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "メールアドレス/ログインIDまたはパスワードが正しくありません" },
        { status: 401 }
      );
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return NextResponse.json(
        { error: "メールアドレス/ログインIDまたはパスワードが正しくありません" },
        { status: 401 }
      );
    }

    const token = signToken({ userId: user.id, role: user.role });

    const response = NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        role: user.role,
      },
    });

    response.cookies.set("auth_token", token, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days in seconds
    });

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "サーバーエラーが発生しました" },
      { status: 500 }
    );
  }
}
