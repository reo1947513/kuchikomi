export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { sendRenewalReminderEmail } from "@/lib/mail";

const planLabels: Record<string, string> = {
  light: "ライトプラン",
  standard: "スタンダードプラン",
  premium: "プレミアムプラン",
  lifetime_light: "永年ライセンス ライト",
  lifetime_standard: "永年ライセンス スタンダード",
  lifetime_premium: "永年ライセンス プレミアム",
};

export async function GET(request: NextRequest) {
  // Verify cron secret (header or query param)
  const authHeader = request.headers.get("authorization");
  const querySecret = new URL(request.url).searchParams.get("secret");
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret && authHeader !== `Bearer ${cronSecret}` && querySecret !== cronSecret) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const now = new Date();
  const oneMonthLater = new Date(now.getFullYear(), now.getMonth() + 1, now.getDate());
  const oneMonthLaterEnd = new Date(oneMonthLater);
  oneMonthLaterEnd.setDate(oneMonthLaterEnd.getDate() + 1);

  // Find users whose contract ends in exactly 1 month (± 1 day)
  const users = await prisma.user.findMany({
    where: {
      role: "admin",
      noContractLimit: false,
      contractEnd: {
        gte: oneMonthLater,
        lt: oneMonthLaterEnd,
      },
      email: { not: null },
    },
    select: {
      id: true,
      email: true,
      shopName: true,
      name: true,
      planType: true,
      contractEnd: true,
    },
  });

  let sent = 0;
  const errors: string[] = [];

  for (const user of users) {
    if (!user.email) continue;
    try {
      const renewalDate = new Date(user.contractEnd!).toLocaleDateString("ja-JP", {
        year: "numeric", month: "long", day: "numeric",
      });
      const planName = planLabels[user.planType ?? ""] || "現在のプラン";

      await sendRenewalReminderEmail(
        user.email,
        user.shopName || user.name,
        renewalDate,
        planName
      );

      // Send LINE notification if configured
      const lineToken = process.env.LINE_CHANNEL_ACCESS_TOKEN;
      const lineAdminUserId = process.env.LINE_ADMIN_USER_ID;
      if (lineToken && lineAdminUserId) {
        await fetch("https://api.line.me/v2/bot/message/push", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${lineToken}`,
          },
          body: JSON.stringify({
            to: lineAdminUserId,
            messages: [{
              type: "text",
              text: `【契約更新通知】\n${user.shopName || user.name}\nプラン: ${planName}\n更新日: ${renewalDate}\n\nメールでも通知済みです。`,
            }],
          }),
        });
      }

      sent++;
    } catch (e) {
      errors.push(`${user.id}: ${e instanceof Error ? e.message : "unknown"}`);
    }
  }

  return NextResponse.json({
    checked: users.length,
    sent,
    errors: errors.length > 0 ? errors : undefined,
  });
}
