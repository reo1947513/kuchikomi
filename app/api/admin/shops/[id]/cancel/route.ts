export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { getSessionForRole } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { stripe } from "@/lib/stripe";

export async function POST(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = getSessionForRole("super");
  if (!session || session.role !== "super") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const user = await prisma.user.findUnique({
    where: { id: params.id },
    select: { stripeSubscriptionId: true, planType: true },
  });

  if (!user) {
    return NextResponse.json({ error: "ユーザーが見つかりません" }, { status: 404 });
  }

  // Cancel Stripe subscription immediately
  if (user.stripeSubscriptionId) {
    try {
      await stripe.subscriptions.cancel(user.stripeSubscriptionId);
    } catch (e) {
      console.error("Stripe cancel error:", e);
    }
  }

  // Clear plan and subscription data
  await prisma.user.update({
    where: { id: params.id },
    data: {
      planType: null,
      stripeSubscriptionId: null,
      stripePriceId: null,
      planReviewLimit: 0,
      contractEnd: new Date(),
    },
  });

  return NextResponse.json({ ok: true });
}
