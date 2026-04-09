export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

/**
 * Cron job: Suspend plans for users with payment failures older than 3 days.
 * Runs daily. Users receive notifications when payment first fails (via webhook).
 * After 3 days grace period, planType is set to null (free) and features are locked.
 */
export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000);

  // Find users with payment failures older than 3 days who still have an active plan
  const users = await prisma.user.findMany({
    where: {
      paymentFailedAt: { lte: threeDaysAgo },
      planType: { not: null },
    },
    select: { id: true, name: true, email: true, shopName: true, lineUserId: true, planType: true },
  });

  let suspended = 0;

  for (const user of users) {
    // Suspend plan
    await prisma.user.update({
      where: { id: user.id },
      data: {
        planType: null,
        planReviewLimit: 0,
        paymentFailedAt: null,
      },
    });
    suspended++;

    // Notify user
    if (user.email) {
      try {
        const { Resend } = await import("resend");
        const resend = new Resend(process.env.RESEND_API_KEY);
        const fromEmail = process.env.RESEND_FROM_EMAIL || "noreply@comista-kuchikomi.com";
        const dashboardUrl = process.env.NEXT_PUBLIC_APP_URL || "https://comista-kuchikomi.com";
        await resend.emails.send({
          from: `ComiSta <${fromEmail}>`,
          to: user.email,
          subject: "【ComiSta】プランが停止されました",
          html: `
            <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; padding: 24px;">
              <h2 style="color: #ef4444;">プランが停止されました</h2>
              <p style="color: #4b5563; line-height: 1.8;">${user.shopName || user.name} 様</p>
              <p style="color: #4b5563; line-height: 1.8;">お支払いの確認が取れなかったため、ご利用中のプランが停止されました。サービスを再開するには、お支払い方法を更新してプランを再購入してください。</p>
              <div style="text-align: center; margin: 32px 0;">
                <a href="${dashboardUrl}/dashboard/billing" style="background: linear-gradient(to right, #06b6d4, #8b5cf6); color: white; padding: 12px 32px; border-radius: 8px; text-decoration: none; font-weight: bold; display: inline-block;">
                  プランを再開する
                </a>
              </div>
              <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 24px 0;" />
              <p style="color: #9ca3af; font-size: 12px; text-align: center;">© 2026 ComiSta</p>
            </div>
          `,
        });
      } catch (e) {
        console.error("Payment suspension email failed:", e);
      }
    }

    if (user.lineUserId) {
      try {
        const { pushMessage } = await import("@/lib/line");
        await pushMessage(user.lineUserId, [{
          type: "text",
          text: `【ComiSta】お支払いの確認が取れなかったため、プランが停止されました。サービスを再開するには、お支払い方法を更新してください。\n\nhttps://comista-kuchikomi.com/dashboard/billing`,
        }]);
      } catch (e) {
        console.error("Payment suspension LINE failed:", e);
      }
    }
  }

  return NextResponse.json({ suspended, checked: users.length });
}
