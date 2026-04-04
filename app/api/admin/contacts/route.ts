export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { getSessionForRole } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET() {
  const session = getSessionForRole("super");
  if (!session || session.role !== "super") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const contacts = await prisma.contact.findMany({
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(contacts);
}
