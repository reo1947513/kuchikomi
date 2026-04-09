export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { getSessionForRole } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { Resend } from "resend";
import { pushMessage, broadcastMessage } from "@/lib/line";

type LineMode = "linked" | "broadcast" | "none";

type Params = { params: { id: string } };

export async function POST(request: NextRequest, { params }: Params) {
  const session = getSessionForRole("super");
  if (!session || session.role !== "super") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  // Parse optional lineMode from request body
  let lineMode: LineMode = "linked";
  try {
    const body = await request.json();
    if (body.lineMode && ["linked", "broadcast", "none"].includes(body.lineMode)) {
      lineMode = body.lineMode;
    }
  } catch {
    // No body or invalid JSON – use default "linked"
  }

  const announcement = await prisma.announcement.findUnique({ where: { id: params.id } });
  if (!announcement) {
    return NextResponse.json({ error: "お知らせが見つかりません" }, { status: 404 });
  }
  if (announcement.emailSent) {
    return NextResponse.json({ error: "このお知らせは既に送信済みです" }, { status: 400 });
  }

  // Exclude emails with known non-deliverable domains
  const BLOCKED_DOMAINS = ["kuchikomi.jp"];

  const users = await prisma.user.findMany({
    where: {
      role: "admin",
      OR: [
        { email: { not: null } },
        { lineUserId: { not: null } },
      ],
    },
    select: { email: true, name: true, shopName: true, lineUserId: true },
  });

  const resend = new Resend(process.env.RESEND_API_KEY);
  const fromEmail = process.env.RESEND_FROM_EMAIL || "noreply@comista-kuchikomi.com";
  const dashboardUrl = process.env.NEXT_PUBLIC_APP_URL || "https://comista-kuchikomi.com";

  let sent = 0;
  const errors: string[] = [];

  for (const user of users) {
    // Send email to users with email (skip blocked domains)
    const emailDomain = user.email?.split("@")[1]?.toLowerCase();
    if (user.email && !(emailDomain && BLOCKED_DOMAINS.includes(emailDomain))) {
      try {
        await resend.emails.send({
          from: `ComiSta <${fromEmail}>`,
          to: user.email,
          subject: `【ComiSta】${announcement.title}`,
          html: `
            <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; padding: 24px;">
              <p style="color: #6b7280; font-size: 13px; margin-bottom: 4px;">${announcement.category}</p>
              <h2 style="color: #1f2937;">${announcement.title}</h2>
              <p style="color: #4b5563; line-height: 1.8; white-space: pre-wrap;">${announcement.content}</p>
              <div style="text-align: center; margin: 32px 0;">
                <a href="${dashboardUrl}" style="background: linear-gradient(to right, #06b6d4, #8b5cf6); color: white; padding: 12px 32px; border-radius: 8px; text-decoration: none; font-weight: bold; display: inline-block;">
                  ダッシュボードを開く
                </a>
              </div>
              <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 24px 0;" />
              <p style="color: #9ca3af; font-size: 12px; text-align: center;">&copy; 2026 ComiSta</p>
            </div>
          `,
        });
        sent++;
      } catch (e) {
        errors.push(`email:${user.email}: ${e instanceof Error ? e.message : "unknown"}`);
      }
    }
  }

  // Send LINE notifications based on lineMode
  if (lineMode === "broadcast") {
    // Broadcast to ALL LINE friends
    try {
      const contentPreview = announcement.content.length > 200
        ? announcement.content.slice(0, 200) + "..."
        : announcement.content;
      const text =
        `【ComiStaお知らせ】\n` +
        `[${announcement.category}] ${announcement.title}\n\n` +
        contentPreview;
      await broadcastMessage([{ type: "text", text }]);
    } catch (e) {
      errors.push(`LINE broadcast: ${e instanceof Error ? e.message : "unknown"}`);
    }
  } else if (lineMode === "linked") {
    // Push to individual users with lineUserId
    for (const user of users) {
      if (!user.lineUserId) continue;
      try {
        const contentPreview = announcement.content.length > 200
          ? announcement.content.slice(0, 200) + "..."
          : announcement.content;
        const text =
          `【ComiStaお知らせ】\n` +
          `[${announcement.category}] ${announcement.title}\n\n` +
          contentPreview;
        await pushMessage(user.lineUserId, [{ type: "text", text }]);
        sent++;
      } catch (e) {
        errors.push(`line:${user.lineUserId}: ${e instanceof Error ? e.message : "unknown"}`);
      }
    }
  }
  // lineMode === "none": skip LINE entirely

  // Mark announcement as sent
  await prisma.announcement.update({
    where: { id: params.id },
    data: { emailSent: true, emailSentAt: new Date() },
  });

  return NextResponse.json({ sent, total: users.length, errors: errors.length > 0 ? errors : undefined });
}
