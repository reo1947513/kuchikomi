export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/db";
import Stripe from "stripe";

// Map price IDs to plan info. These will be matched at runtime from the Stripe event data.
function getPlanFromPrice(priceId: string, amount: number | null, interval: string | null): {
  planType: string;
  planReviewLimit: number;
  isAdditional?: boolean;
  additionalAmount?: number;
} | null {
  // Subscription plans (recurring)
  if (interval === "month") {
    if (amount === 6000) return { planType: "light", planReviewLimit: 50 };
    if (amount === 10000) return { planType: "standard", planReviewLimit: 100 };
    if (amount === 20000) return { planType: "premium", planReviewLimit: 300 };
  }

  // One-time: lifetime licenses
  if (!interval || interval === null) {
    if (amount === 90000) return { planType: "lifetime_light", planReviewLimit: 50 };
    if (amount === 150000) return { planType: "lifetime_standard", planReviewLimit: 100 };
    if (amount === 250000) return { planType: "lifetime_premium", planReviewLimit: 300 };

    // Additional reviews
    if (amount === 2000) return { planType: "", planReviewLimit: 0, isAdditional: true, additionalAmount: 20 };
    if (amount === 5000) return { planType: "", planReviewLimit: 0, isAdditional: true, additionalAmount: 50 };
  }

  return null;
}

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "No signature" }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    if (webhookSecret) {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } else {
      // For development without webhook secret
      event = JSON.parse(body) as Stripe.Event;
    }
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.userId;
        if (!userId) break;

        if (session.mode === "subscription") {
          const subscription = await stripe.subscriptions.retrieve(session.subscription as string);
          const item = subscription.items.data[0];
          const priceId = item.price.id;
          const amount = item.price.unit_amount;
          const interval = item.price.recurring?.interval || null;
          const plan = getPlanFromPrice(priceId, amount, interval);

          if (plan) {
            await prisma.user.update({
              where: { id: userId },
              data: {
                stripeCustomerId: session.customer as string,
                stripeSubscriptionId: subscription.id,
                stripePriceId: priceId,
                planType: plan.planType,
                planReviewLimit: plan.planReviewLimit,
              },
            });
          }
        } else if (session.mode === "payment") {
          // One-time payment: lifetime or additional reviews
          const lineItems = await stripe.checkout.sessions.listLineItems(session.id);
          const item = lineItems.data[0];
          if (item) {
            const amount = item.amount_total;
            const plan = getPlanFromPrice("", amount, null);

            if (plan?.isAdditional) {
              await prisma.user.update({
                where: { id: userId },
                data: {
                  stripeCustomerId: session.customer as string,
                  additionalReviews: { increment: plan.additionalAmount! },
                },
              });
            } else if (plan) {
              await prisma.user.update({
                where: { id: userId },
                data: {
                  stripeCustomerId: session.customer as string,
                  planType: plan.planType,
                  planReviewLimit: plan.planReviewLimit,
                  stripeSubscriptionId: null,
                  stripePriceId: null,
                },
              });
            }
          }
        }
        break;
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;
        const user = await prisma.user.findUnique({
          where: { stripeCustomerId: customerId },
        });
        if (!user) break;

        const item = subscription.items.data[0];
        const priceId = item.price.id;
        const amount = item.price.unit_amount;
        const interval = item.price.recurring?.interval || null;
        const plan = getPlanFromPrice(priceId, amount, interval);

        if (plan) {
          await prisma.user.update({
            where: { id: user.id },
            data: {
              stripeSubscriptionId: subscription.id,
              stripePriceId: priceId,
              planType: plan.planType,
              planReviewLimit: plan.planReviewLimit,
            },
          });
        }
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;
        const user = await prisma.user.findUnique({
          where: { stripeCustomerId: customerId },
        });
        if (!user) break;

        await prisma.user.update({
          where: { id: user.id },
          data: {
            stripeSubscriptionId: null,
            stripePriceId: null,
            planType: null,
            planReviewLimit: 0,
          },
        });
        break;
      }

      case "invoice.payment_succeeded": {
        const invoice = event.data.object as Stripe.Invoice;
        const customerId = typeof invoice.customer === "string" ? invoice.customer : invoice.customer?.id;
        if (!customerId) break;
        const subDetails = invoice.parent?.subscription_details?.subscription;
        const subscriptionId = typeof subDetails === "string" ? subDetails : subDetails?.id;
        if (!subscriptionId) break;

        const user = await prisma.user.findUnique({
          where: { stripeCustomerId: customerId },
        });
        if (!user) break;

        // Reset additional reviews on renewal if needed
        // The subscription is already active, just confirm the plan is up to date
        const subscription = await stripe.subscriptions.retrieve(subscriptionId);
        const item = subscription.items.data[0];
        const amount = item.price.unit_amount;
        const interval = item.price.recurring?.interval || null;
        const plan = getPlanFromPrice(item.price.id, amount, interval);

        if (plan) {
          await prisma.user.update({
            where: { id: user.id },
            data: {
              planType: plan.planType,
              planReviewLimit: plan.planReviewLimit,
            },
          });
        }
        break;
      }
    }
  } catch (error) {
    console.error("Webhook handler error:", error);
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
