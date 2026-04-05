export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { z } from "zod";

const contactSchema = z.object({
  category: z.string().min(1),
  contractStatus: z.string().min(1),
  companyName: z.string().min(1),
  lastName: z.string().min(1),
  firstName: z.string().min(1),
  email: z.string().email(),
  phone: z.string().min(1),
  content: z.string().min(1),
  source: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = contactSchema.parse(body);
    const contact = await prisma.contact.create({ data: { ...data, source: data.source || "dashboard" } });
    return NextResponse.json(contact, { status: 201 });
  } catch (e) {
    if (e instanceof z.ZodError) {
      return NextResponse.json({ error: "入力内容に不備があります", details: e.errors }, { status: 400 });
    }
    console.error("Contact API error:", e); return NextResponse.json({ error: "送信に失敗しました" }, { status: 500 });
  }
}
