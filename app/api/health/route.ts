export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  // Ping DB to keep Supabase alive
  const count = await prisma.user.count();
  return NextResponse.json({ status: "ok", users: count });
}
