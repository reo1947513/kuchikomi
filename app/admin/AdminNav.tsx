"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  { href: "/admin", label: "ダッシュボード" },
  { href: "/admin/shops", label: "ショップ管理" },
  { href: "/admin/agencies", label: "代理店管理" },
  { href: "/admin/industries", label: "業種管理" },
  { href: "/admin/faqs", label: "質問管理" },
  { href: "/admin/contacts", label: "お問い合わせ" },
  { href: "/admin/announcements", label: "お知らせ" },
  { href: "/admin/payments", label: "入金管理" },
  { href: "/admin/feedback", label: "フィードバック" },
  { href: "/admin/case-studies", label: "導入事例" },
];

export default function AdminNav() {
  const pathname = usePathname();
  return (
    <div className="bg-white border-b border-gray-200 sticky top-14 z-10">
      <div className="max-w-7xl mx-auto px-3 md:px-6 flex gap-0 overflow-x-auto scrollbar-hide">
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
      <style>{`.scrollbar-hide::-webkit-scrollbar{display:none}.scrollbar-hide{-ms-overflow-style:none;scrollbar-width:none}`}</style>
    </div>
  );
}
