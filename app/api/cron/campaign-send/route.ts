export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { Resend } from "resend";

export async function GET(request: NextRequest) {
  // Verify cron secret
  const authHeader = request.headers.get("authorization");
  const querySecret = new URL(request.url).searchParams.get("secret");
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret && authHeader !== `Bearer ${cronSecret}` && querySecret !== cronSecret) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const now = new Date();

  // Find campaigns with scheduled send time that has passed and not yet sent
  const campaigns = await prisma.campaign.findMany({
    where: {
      emailSent: false,
      scheduledSendAt: { not: null, lte: now },
    },
  });

  if (campaigns.length === 0) {
    return NextResponse.json({ message: "No campaigns to send", processed: 0 });
  }

  const resend = new Resend(process.env.RESEND_API_KEY);
  const fromEmail = process.env.RESEND_FROM_EMAIL || "noreply@comista-kuchikomi.com";
  const dashboardUrl = process.env.NEXT_PUBLIC_APP_URL || "https://comista-kuchikomi.com";

  const results: { campaignId: string; title: string; sent: number; total: number }[] = [];

  for (const campaign of campaigns) {
    // Build target filter
    const BLOCKED_DOMAINS = ["kuchikomi.jp"];
    const targetFilter: Record<string, unknown> = { role: "admin", email: { not: null } };
    if (campaign.target === "free") {
      targetFilter.planType = null;
    } else if (campaign.target === "paid") {
      targetFilter.planType = { not: null };
    } else if (campaign.target === "cancelled") {
      targetFilter.planType = null;
      targetFilter.contractEnd = { lt: now };
    }

    const users = await prisma.user.findMany({
      where: targetFilter,
      select: { email: true, shopName: true, name: true, lineUserId: true },
    });

    let sent = 0;
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
      } catch {
        // Continue sending to other users
      }
    }

    // Send LINE notifications (scheduled campaigns default to "linked" mode – per-user push)
    const lineToken = process.env.LINE_CHANNEL_ACCESS_TOKEN;
    if (lineToken) {
      const contentPreview = campaign.content.slice(0, 200) + (campaign.content.length > 200 ? "..." : "");
      const lineText = `【ComiStaキャンペーン】\n${campaign.title}\n\n${contentPreview}`;
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
            console.error(`LINE push failed for ${user.lineUserId}:`, res.status, text);
          }
        } catch {
          // Continue sending to other users
        }
      }
    }

    await prisma.campaign.update({
      where: { id: campaign.id },
      data: { emailSent: true, emailSentAt: new Date() },
    });

    results.push({ campaignId: campaign.id, title: campaign.title, sent, total: users.length });
  }

  return NextResponse.json({ message: "Campaign emails sent", processed: results.length, results });
}
