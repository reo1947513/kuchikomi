export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { getSessionForRole } from "@/lib/auth";
import { generateInviteToken } from "@/lib/invite";

export async function GET() {
  const session = getSessionForRole("super");
  if (!session || session.role !== "super") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const token = generateInviteToken();
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://comista-kuchikomi.com";
  const url = `${baseUrl}/signup?invite=${token}`;

  return NextResponse.json({ token, url });
}
