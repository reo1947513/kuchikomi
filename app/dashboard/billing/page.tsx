"use client";

import { useState, useEffect, useCallback } from "react";

interface UserData {
  id: string;
  name: string;
  planType: string | null;
  planReviewLimit: number;
  additionalReviews: number;
  stripeSubscriptionId: string | null;
  stripeCustomerId: string | null;
}

interface PlanCard {
  name: string;
  priceLabel: string;
  reviews: number;
  priceId: string;
  mode: "subscription" | "payment";
  planType: string;
}

const subscriptionPlans: PlanCard[] = [
  {
    name: "ライトプラン",
    priceLabel: "¥6,000/月",
    reviews: 20,
    priceId: "", // Will be set from Stripe
    mode: "subscription",
    planType: "light",
  },
  {
    name: "スタンダードプラン",
    priceLabel: "¥10,000/月",
    reviews: 50,
    priceId: "",
    mode: "subscription",
    planType: "standard",
  },
  {
    name: "プレミアムプラン",
    priceLabel: "¥20,000/月",
    reviews: 0, // 0 = unlimited
    priceId: "",
    mode: "subscription",
    planType: "premium",
  },
];

const lifetimePlans: PlanCard[] = [
  {
    name: "永年ライセンス ライト",
    priceLabel: "¥90,000（一括）",
    reviews: 20,
    priceId: "",
    mode: "payment",
    planType: "lifetime_light",
  },
  {
    name: "永年ライセンス スタンダード",
    priceLabel: "¥150,000（一括）",
    reviews: 50,
    priceId: "",
    mode: "payment",
    planType: "lifetime_standard",
  },
  {
    name: "永年ライセンス プレミアム",
    priceLabel: "¥250,000（一括）",
    reviews: 300,
    priceId: "",
    mode: "payment",
    planType: "lifetime_premium",
  },
];

const additionalPacks = [
  {
    name: "追加20件",
    priceLabel: "¥2,000",
    reviews: 20,
    priceId: "",
    mode: "payment" as const,
  },
  {
    name: "追加50件",
    priceLabel: "¥5,000",
    reviews: 50,
    priceId: "",
    mode: "payment" as const,
  },
];

const planLabels: Record<string, string> = {
  light: "ライトプラン",
  standard: "スタンダードプラン",
  premium: "プレミアムプラン",
  lifetime_light: "永年ライセンス ライト",
  lifetime_standard: "永年ライセンス スタンダード",
  lifetime_premium: "永年ライセンス プレミアム",
};

export default function BillingPage() {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [checkoutLoading, setCheckoutLoading] = useState<string | null>(null);
  const [prices, setPrices] = useState<{ subscriptions: PlanCard[]; lifetime: PlanCard[]; additional: typeof additionalPacks }>({
    subscriptions: subscriptionPlans,
    lifetime: lifetimePlans,
    additional: additionalPacks,
  });

  const fetchUser = useCallback(async () => {
    try {
      const res = await fetch("/api/auth/me");
      if (res.ok) {
        const data = await res.json();
        setUser(data);
      }
    } catch (err) {
      console.error("Failed to fetch user:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchPrices = useCallback(async () => {
    try {
      const res = await fetch("/api/stripe/prices");
      if (res.ok) {
        const data = await res.json();
        if (data.subscriptions) setPrices(data);
      }
    } catch {
      // Prices endpoint is optional; use defaults
    }
  }, []);

  useEffect(() => {
    fetchUser();
    fetchPrices();
  }, [fetchUser, fetchPrices]);

  const handleCheckout = async (priceId: string, mode: "subscription" | "payment") => {
    if (!user || !priceId) return;
    setCheckoutLoading(priceId);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priceId, mode, userId: user.id }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (err) {
      console.error("Checkout error:", err);
    } finally {
      setCheckoutLoading(null);
    }
  };

  const handlePortal = async () => {
    try {
      const res = await fetch("/api/stripe/portal");
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (err) {
      console.error("Portal error:", err);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="text-gray-500">読み込み中...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex justify-center py-20">
        <div className="text-red-500">認証エラーが発生しました</div>
      </div>
    );
  }

  const isLifetime = user.planType?.startsWith("lifetime_");
  const hasSubscription = !!user.stripeSubscriptionId;
  const hasPlan = !!user.planType;

  const planRank: Record<string, number> = {
    light: 1, lifetime_light: 1,
    standard: 2, lifetime_standard: 2,
    premium: 3, lifetime_premium: 3,
  };
  const currentRank = planRank[user.planType ?? ""] ?? 0;

  return (
    <div className="space-y-8">
      <h1 className="text-lg sm:text-2xl font-bold text-gray-900">プラン・お支払い</h1>

      {/* Success/Cancel messages from URL params */}
      <SuccessMessage />

      {/* Current Plan */}
      <section className="bg-white rounded-lg shadow p-4 sm:p-6">
        <h2 className="text-base sm:text-lg font-semibold text-gray-800 mb-4">現在のプラン</h2>
        {hasPlan ? (
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-violet-100 text-violet-800">
                {planLabels[user.planType!] || user.planType}
              </span>
              {isLifetime && (
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-amber-100 text-amber-800">
                  永年
                </span>
              )}
            </div>
            <div className="text-sm text-gray-600">
              <p>月間レビュー上限: <strong>{user.planReviewLimit}件</strong></p>
              <p>追加レビュー残: <strong>{user.additionalReviews}件</strong></p>
            </div>
            {hasSubscription && (
              <button
                onClick={handlePortal}
                className="mt-3 px-4 py-2 text-sm font-medium text-violet-700 bg-violet-50 border border-violet-200 rounded-lg hover:bg-violet-100 transition-colors"
              >
                サブスクリプション管理
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-700">
                無料プラン
              </span>
            </div>
            <div className="text-sm text-gray-600">
              <p>月間レビュー上限: <strong>{user.planReviewLimit}件</strong></p>
              <p>追加レビュー残: <strong>{user.additionalReviews}件</strong></p>
            </div>
            <p className="text-xs text-gray-400">有料プランにアップグレードすると、より多くのレビューを生成できます。</p>
          </div>
        )}
      </section>

      {/* Subscription Plans */}
      <section>
        <h2 className="text-base sm:text-lg font-semibold text-gray-800 mb-4">月額サブスクリプション</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {prices.subscriptions.map((plan) => {
            const isCurrent = user.planType === plan.planType;
            return (
              <div
                key={plan.planType}
                className={`bg-white rounded-lg shadow p-6 border-2 ${
                  isCurrent ? "border-violet-500" : "border-transparent"
                }`}
              >
                <h3 className="text-base font-semibold text-gray-900">{plan.name}</h3>
                <p className="text-xl sm:text-2xl font-bold text-gray-900 mt-2">{plan.priceLabel}</p>
                <p className="text-sm text-gray-500 mt-1">{plan.reviews === 0 ? "無制限" : `月間 ${plan.reviews}件 まで`}</p>
                <button
                  onClick={() => handleCheckout(plan.priceId, plan.mode)}
                  disabled={!plan.priceId || isCurrent || isLifetime || (planRank[plan.planType] ?? 0) <= currentRank || !!checkoutLoading}
                  className="mt-4 w-full px-4 py-2.5 text-sm font-medium text-white bg-violet-600 rounded-lg hover:bg-violet-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors min-h-[44px]"
                >
                  {checkoutLoading === plan.priceId
                    ? "処理中..."
                    : isCurrent
                    ? "現在のプラン"
                    : isLifetime
                    ? "永年ライセンス利用中"
                    : (planRank[plan.planType] ?? 0) < currentRank
                    ? "ダウングレード不可"
                    : hasPlan
                    ? "アップグレード"
                    : "申し込む"}
                </button>
              </div>
            );
          })}
        </div>
      </section>

      {/* Lifetime Licenses */}
      <section>
        <h2 className="text-base sm:text-lg font-semibold text-gray-800 mb-4">永年ライセンス（買い切り）</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {prices.lifetime.map((plan) => {
            const isCurrent = user.planType === plan.planType;
            return (
              <div
                key={plan.planType}
                className={`bg-white rounded-lg shadow p-6 border-2 ${
                  isCurrent ? "border-amber-500" : "border-transparent"
                }`}
              >
                <h3 className="text-base font-semibold text-gray-900">{plan.name}</h3>
                <p className="text-xl sm:text-2xl font-bold text-gray-900 mt-2">{plan.priceLabel}</p>
                <p className="text-sm text-gray-500 mt-1">{plan.reviews === 0 ? "無制限" : `月間 ${plan.reviews}件 まで`}</p>
                <button
                  onClick={() => handleCheckout(plan.priceId, plan.mode)}
                  disabled={!plan.priceId || isCurrent || (planRank[plan.planType] ?? 0) <= currentRank || !!checkoutLoading}
                  className="mt-4 w-full px-4 py-2.5 text-sm font-medium text-white bg-amber-600 rounded-lg hover:bg-amber-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors min-h-[44px]"
                >
                  {checkoutLoading === plan.priceId
                    ? "処理中..."
                    : isCurrent
                    ? "現在のプラン"
                    : (planRank[plan.planType] ?? 0) < currentRank
                    ? "ダウングレード不可"
                    : "購入する"}
                </button>
              </div>
            );
          })}
        </div>
      </section>

      {/* Additional Reviews - hide for premium (unlimited) */}
      {user.planType !== "premium" && user.planType !== "lifetime_premium" && (
      <section>
        <h2 className="text-base sm:text-lg font-semibold text-gray-800 mb-4">追加レビュー購入</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {prices.additional.map((pack) => (
            <div key={pack.name} className="bg-white rounded-lg shadow p-6">
              <h3 className="text-base font-semibold text-gray-900">{pack.name}</h3>
              <p className="text-xl sm:text-2xl font-bold text-gray-900 mt-2">{pack.priceLabel}</p>
              <p className="text-sm text-gray-500 mt-1">レビュー {pack.reviews}件 追加</p>
              <button
                onClick={() => handleCheckout(pack.priceId, pack.mode)}
                disabled={!pack.priceId || !!checkoutLoading}
                className="mt-4 w-full px-4 py-2.5 text-sm font-medium text-white bg-cyan-600 rounded-lg hover:bg-cyan-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors min-h-[44px]"
              >
                {checkoutLoading === pack.priceId ? "処理中..." : "購入する"}
              </button>
            </div>
          ))}
        </div>
      </section>
      )}
    </div>
  );
}

function SuccessMessage() {
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("success") === "true") {
      setMessage("お支払いが完了しました。プラン情報が反映されるまで少々お待ちください。");
    } else if (params.get("canceled") === "true") {
      setMessage("お支払いがキャンセルされました。");
    }
  }, []);

  if (!message) return null;

  const isSuccess = message.includes("完了");
  return (
    <div
      className={`rounded-lg p-4 text-sm ${
        isSuccess ? "bg-green-50 text-green-800 border border-green-200" : "bg-yellow-50 text-yellow-800 border border-yellow-200"
      }`}
    >
      {message}
    </div>
  );
}
