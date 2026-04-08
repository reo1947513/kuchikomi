export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";

// Map Stripe amounts to plan config
const SUBSCRIPTION_AMOUNTS: Record<number, { name: string; planType: string; reviews: number; priceLabel: string }> = {
  10000: { name: "スタンダードプラン", planType: "standard", reviews: 100, priceLabel: "¥10,000/月" },
  20000: { name: "プレミアムプラン", planType: "premium", reviews: 300, priceLabel: "¥20,000/月" },
};

const ADDITIONAL_AMOUNTS: Record<number, { name: string; reviews: number; priceLabel: string }> = {
  2000: { name: "追加20件", reviews: 20, priceLabel: "¥2,000" },
  5000: { name: "追加50件", reviews: 50, priceLabel: "¥5,000" },
};

export async function GET() {
  try {
    const prices = await stripe.prices.list({
      active: true,
      limit: 100,
      expand: ["data.product"],
    });

    const subscriptions: Array<{
      name: string;
      priceLabel: string;
      reviews: number;
      priceId: string;
      mode: "subscription";
      planType: string;
    }> = [];

    const additional: Array<{
      name: string;
      priceLabel: string;
      reviews: number;
      priceId: string;
      mode: "payment";
    }> = [];

    for (const price of prices.data) {
      const amount = price.unit_amount;
      if (!amount) continue;

      if (price.recurring?.interval === "month") {
        const config = SUBSCRIPTION_AMOUNTS[amount];
        if (config) {
          subscriptions.push({
            ...config,
            priceId: price.id,
            mode: "subscription",
          });
        }
      } else if (!price.recurring) {
        const additionalConfig = ADDITIONAL_AMOUNTS[amount];
        if (additionalConfig) {
          additional.push({
            ...additionalConfig,
            priceId: price.id,
            mode: "payment",
          });
        }
      }
    }

    // Sort by review count
    subscriptions.sort((a, b) => a.reviews - b.reviews);
    additional.sort((a, b) => a.reviews - b.reviews);

    return NextResponse.json({ subscriptions, additional });
  } catch (error) {
    console.error("Failed to fetch Stripe prices:", error instanceof Error ? error.message : "Unknown error");
    return NextResponse.json(
      { error: "Failed to fetch prices" },
      { status: 500 }
    );
  }
}
