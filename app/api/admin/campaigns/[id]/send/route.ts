export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { getSessionForRole } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { Resend } from "resend";
import { broadcastMessage } from "@/lib/line";

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

  const campaign = await prisma.campaign.findUnique({ where: { id: params.id } });
  if (!campaign) {
    return NextResponse.json({ error: "キャンペーンが見つかりません" }, { status: 404 });
  }
  if (campaign.emailSent) {
    return NextResponse.json({ error: "このキャンペーンは既にメール送信済みです" }, { status: 400 });
  }

  // Build target filter
  // Exclude emails with known non-deliverable domains
  const BLOCKED_DOMAINS = ["kuchikomi.jp"];
  const targetFilter: Record<string, unknown> = {
    role: "admin",
    email: { not: null },
  };
  if (campaign.target === "free") {
    targetFilter.planType = null;
  } else if (campaign.target === "paid") {
    targetFilter.planType = { not: null };
  } else if (campaign.target === "cancelled") {
    targetFilter.planType = null;
    targetFilter.contractEnd = { lt: new Date() };
  }

  const users = await prisma.user.findMany({
    where: targetFilter,
    select: { email: true, shopName: true, name: true, lineUserId: true },
  });

  const resend = new Resend(process.env.RESEND_API_KEY);
  const fromEmail = process.env.RESEND_FROM_EMAIL || "noreply@comista-kuchikomi.com";
  const dashboardUrl = process.env.NEXT_PUBLIC_APP_URL || "https://comista-kuchikomi.com";

  let sent = 0;
  const errors: string[] = [];

  for (const user of users) {
    if (!user.email) continue;
    const domain = user.email.split("@")[1]?.toLowerCase();
    if (domain && BLOCKED_DOMAINS.includes(domain)) continue;
    try {
      await resend.emails.send({
        from: `ComiSta <${fromEmail}>`,
        to: user.email,
        subject: `【ComiSta】${campaign.title}`,
        html: `
          <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; padding: 24px;">
            <h2 style="color: #1f2937;">${campaign.title}</h2>
            <p style="color: #4b5563; line-height: 1.8; white-space: pre-wrap;">${campaign.content}</p>
            <div style="text-align: center; margin: 32px 0;">
              <a href="${dashboardUrl}" style="background: linear-gradient(to right, #06b6d4, #8b5cf6); color: white; padding: 12px 32px; border-radius: 8px; text-decoration: none; font-weight: bold; display: inline-block;">
                ダッシュボードを開く
              </a>
            </div>
            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 24px 0;" />
            <p style="color: #9ca3af; font-size: 12px; text-align: center;">© 2026 ComiSta</p>
          </div>
        `,
      });
      sent++;
    } catch (e) {
      errors.push(`${user.email}: ${e instanceof Error ? e.message : "unknown"}`);
    }
  }

  // Send LINE notifications based on lineMode
  const lineToken = process.env.LINE_CHANNEL_ACCESS_TOKEN;
  if (lineToken && lineMode !== "none") {
    const contentPreview = campaign.content.slice(0, 200) + (campaign.content.length > 200 ? "..." : "");
    const lineText = `【ComiStaキャンペーン】\n${campaign.title}\n\n${contentPreview}`;

    if (lineMode === "broadcast") {
      // Broadcast to ALL LINE friends
      try {
        await broadcastMessage([{ type: "text", text: lineText }]);
      } catch (e) {
        errors.push(`LINE broadcast: ${e instanceof Error ? e.message : "unknown"}`);
      }
    } else {
      // "linked" mode: push to individual users with lineUserId
      for (const user of users) {
        if (!user.lineUserId) continue;
        try {
          const res = await fetch("https://api.line.me/v2/bot/message/push", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${lineToken}`,
            },
            body: JSON.stringify({
              to: user.lineUserId,
              messages: [{ type: "text", text: lineText }],
            }),
          });
          if (!res.ok) {
            const text = await res.text();
            errors.push(`LINE ${user.lineUserId}: ${res.status} ${text}`);
          }
        } catch (e) {
          errors.push(`LINE ${user.lineUserId}: ${e instanceof Error ? e.message : "unknown"}`);
        }
      }
    }
  }

  // Mark as sent
  await prisma.campaign.update({
    where: { id: params.id },
    data: { emailSent: true, emailSentAt: new Date() },
  });

  return NextResponse.json({ sent, total: users.length, errors: errors.length > 0 ? errors : undefined });
}
