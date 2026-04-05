"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

const items = [
  { href: "/dashboard/surveys", label: "ダッシュボード", locked: false },
  { href: "/dashboard/survey-settings", label: "アンケート設定", locked: false },
  { href: "/dashboard/analysis", label: "分析", locked: true },
  { href: "/dashboard/faq", label: "Q&A", locked: false },
  { href: "/dashboard/billing", label: "プラン・お支払い", locked: false },
];

const LOCKED_PLANS = [null, "light", "lifetime_light"];

export default function DashboardNav() {
  const pathname = usePathname();
  const [planType, setPlanType] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((d) => setPlanType(d.planType ?? null))
      .catch(() => {})
      .finally(() => setLoaded(true));
  }, []);

  if (pathname === "/dashboard/contact") return null;

  const isLocked = loaded && LOCKED_PLANS.includes(planType);

  return (
    <div className="bg-white border-b border-gray-200 sticky top-14 z-10">
      <div className="max-w-4xl mx-auto px-3 md:px-6 flex gap-0 overflow-x-auto scrollbar-hide">
        {items.map((item) => {
          const locked = item.locked && isLocked;
          if (locked) {
            return (
              <Link
                key={item.href}
                href={item.href}
                className="px-3 md:px-5 py-3 text-xs md:text-sm font-medium border-b-2 border-transparent text-gray-300 whitespace-nowrap flex items-center gap-1"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                {item.label}
              </Link>
            );
          }
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`px-3 md:px-5 py-3 text-xs md:text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                pathname === item.href
                  ? "border-violet-500 text-gray-900"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
