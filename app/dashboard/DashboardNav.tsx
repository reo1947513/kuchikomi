"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  { href: "/dashboard/surveys", label: "ダッシュボード" },
  { href: "/dashboard/survey-settings", label: "アンケート設定" },
  { href: "/dashboard/contact", label: "お問い合わせ" },
];

export default function DashboardNav() {
  const pathname = usePathname();
  return (
    <div className="bg-white border-b border-gray-200">
      <div className="max-w-4xl mx-auto px-6 flex gap-0">
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`px-5 py-3 text-sm font-medium border-b-2 transition-colors ${
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
