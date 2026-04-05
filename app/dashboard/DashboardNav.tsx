"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  { href: "/dashboard/surveys", label: "ダッシュボード" },
  { href: "/dashboard/survey-settings", label: "アンケート設定" },
  { href: "/dashboard/analysis", label: "分析" },
  { href: "/dashboard/faq", label: "Q&A" },
  { href: "/dashboard/billing", label: "プラン・お支払い" },
];

export default function DashboardNav() {
  const pathname = usePathname();
  return (
    <div className="bg-white border-b border-gray-200 sticky top-14 z-10">
      <div className="max-w-4xl mx-auto px-3 md:px-6 flex gap-0 overflow-x-auto scrollbar-hide">
        {items.map((item) => (
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
        ))}
      </div>
    </div>
  );
}
