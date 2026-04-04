export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { getSessionForRole } from "@/lib/auth";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { randomUUID } from "crypto";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/svg+xml"];
const MAX_SIZE = 5 * 1024 * 1024; // 5MB

export async function POST(request: NextRequest) {
  const session = getSessionForRole("admin");
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "ファイルが見つかりません" }, { status: 400 });
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json({ error: "JPEG・PNG・WebP・GIF・SVGのみアップロード可能です" }, { status: 400 });
    }

    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: "ファイルサイズは5MB以下にしてください" }, { status: 400 });
    }

    const ext = file.name.split(".").pop() ?? "png";
    const filename = `${randomUUID()}.${ext}`;
    const uploadDir = join(process.cwd(), "public", "uploads");

    // Create directory if it doesn't exist
    await mkdir(uploadDir, { recursive: true });

    const buffer = Buffer.from(await file.arrayBuffer());
    await writeFile(join(uploadDir, filename), buffer);

    return NextResponse.json({ url: `/uploads/${filename}` });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "アップロードに失敗しました" }, { status: 500 });
  }
}
