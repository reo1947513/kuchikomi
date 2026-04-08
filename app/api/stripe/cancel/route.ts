export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { stripe } from "@/lib/stripe";

export async function POST() {
  const session = getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: {
      stripeSubscriptionId: true,
      contractEnd: true,
      noContractLimit: true,
    },
  });

  if (!user) {
    return NextResponse.json({ error: "ユーザーが見つかりません" }, { status: 404 });
  }

  // Check if cancellation is allowed (1 month before contract end)
  if (!user.contractEnd || user.noContractLimit) {
    return NextResponse.json({ error: "解約対象の契約がありません" }, { status: 400 });
  }

  const end = new Date(user.contractEnd);
  const oneMonthBefore = new Date(end);
  oneMonthBefore.setMonth(oneMonthBefore.getMonth() - 1);

  if (new Date() < oneMonthBefore) {
    return NextResponse.json({ error: "契約終了日の1ヶ月前から解約手続きが可能です" }, { status: 400 });
  }

  // Cancel Stripe subscription at period end
  if (user.stripeSubscriptionId) {
    try {
      await stripe.subscriptions.update(user.stripeSubscriptionId, {
        cancel_at_period_end: true,
      });
    } catch (e) {
      console.error("Stripe cancel error:", e);
      return NextResponse.json({ error: "Stripeの解約処理に失敗しました" }, { status: 500 });
    }
  }

  // Mark contract as ending (don't extend)
  await prisma.user.update({
    where: { id: session.userId },
    data: { noContractLimit: false },
  });

  return NextResponse.json({ ok: true });
}
