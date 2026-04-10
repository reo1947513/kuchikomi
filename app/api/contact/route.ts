export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";
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
    const source = data.source || "dashboard";
    // Only attach userId for dashboard contacts, not HP (public) contacts
    const session = source === "dashboard" ? getSession() : null;
    const userId = session?.userId || null;
    const contact = await prisma.contact.create({ data: { ...data, source, userId } });

    // Send LINE notification to admin
    const lineToken = process.env.LINE_CHANNEL_ACCESS_TOKEN;
    const lineUserId = process.env.LINE_ADMIN_USER_ID;
    if (lineToken && lineUserId) {
      try {
        const lineRes = await fetch("https://api.line.me/v2/bot/message/push", {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${lineToken}` },
          body: JSON.stringify({
            to: lineUserId,
            messages: [{
              type: "text",
              text: `【新規お問い合わせ】\n${data.category}\n${data.companyName}\n${data.lastName} ${data.firstName}\n${data.email}\n${data.phone}\n経由: ${source === "line" ? "LINE" : source === "hp" ? "HP" : "管理画面"}\n\n${data.content.slice(0, 200)}`,
            }],
          }),
        });
        if (!lineRes.ok) {
          console.error("LINE notification failed:", lineRes.status, await lineRes.text());
        }
      } catch (e) {
        console.error("LINE notification error:", e);
      }
    }

    return NextResponse.json(contact, { status: 201 });
  } catch (e) {
    if (e instanceof z.ZodError) {
      return NextResponse.json({ error: "入力内容に不備があります", details: e.errors }, { status: 400 });
    }
    console.error("Contact API error:", e); return NextResponse.json({ error: "送信に失敗しました" }, { status: 500 });
  }
}
