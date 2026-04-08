"use client";

import Image from "next/image";
import { useState, useEffect } from "react";

/* ─── FAQ Accordion Item ─── */
function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="bg-white/60 backdrop-blur-sm border border-white/40 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-6 py-5 text-left font-semibold text-gray-800 hover:bg-white/40 transition-colors"
      >
        <span>{q}</span>
        <svg
          className={`w-5 h-5 shrink-0 transition-transform duration-300 ${open ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      <div className={`grid transition-all duration-300 ${open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
        <div className="overflow-hidden">
          <p className="px-6 pb-5 text-gray-600 leading-relaxed">{a}</p>
        </div>
      </div>
    </div>
  );
}

/* ─── Check icon ─── */
function Check() {
  return (
    <svg className="w-5 h-5 text-cyan-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  );
}

/* ─── Dash icon ─── */
function Dash() {
  return <span className="text-gray-300 text-lg">—</span>;
}

export default function PricingPage() {
  const ja: Record<string, string> = {
    "pricing.page.title": "料金プラン",
    "pricing.page.subtitle": "ComiStaの料金プランをご紹介します。すべてのプランで初期費用は無料です。",
    "pricing.page.taxNote": "※ 表示価格はすべて税別です。",
    "pricing.page.contactNote": "プランの詳細やお見積もりについてはお気軽にお問い合わせください。",
    "pricing.page.cta": "まずは相談してみる",
    "pricing.page.ctaSub": "初期費用0円 ・ 最短即日導入 ・ 1店舗から利用可能",
    "pricing.standard": "スタンダードプラン",
    "pricing.premium": "プレミアムプラン",
    "pricing.standard.limit": "月100件",
    "pricing.premium.limit": "無制限",
    "pricing.standard.target": "中規模店舗",
    "pricing.premium.target": "大規模・複数店舗",
    "pricing.perMonth": "/月",
    "pricing.popular": "🏆 人気No.1",
    "pricing.contact": "お問い合わせ",
    "pricing.feat.ai": "AIによる口コミ下書き作成",
    "pricing.feat.chat": "チャット形式アンケート",
    "pricing.feat.qr": "QRコード発行",
    "pricing.feat.analytics": "リアルタイム分析",
    "pricing.feat.support": "カスタマーサポート",
    "pricing.compare.title": "プラン機能比較",
    "pricing.compare.feature": "機能",
    "pricing.compare.monthlyLimit": "月間レビュー生成数",
    "pricing.compare.aiDraft": "AIによる口コミ下書き作成",
    "pricing.compare.chatSurvey": "チャット形式アンケート",
    "pricing.compare.qrCode": "QRコード発行",
    "pricing.compare.analytics": "回答データ分析",
    "pricing.compare.customDesign": "アンケートデザインカスタマイズ",
    "pricing.compare.support": "カスタマーサポート",
    "pricing.compare.email": "メールサポート",
    "pricing.compare.priority": "優先サポート",
    "pricing.compare.multiStore": "複数店舗管理",
    "pricing.compare.unlimited": "無制限",
    "pricing.compare.100": "月100件",
    "pricing.fit.title": "どのプランが最適？",
    "pricing.fit.standard.title": "スタンダードプランがおすすめの方",
    "pricing.fit.standard.1": "1店舗で口コミ運用を始めたい方",
    "pricing.fit.standard.2": "月間の来店数が100名程度までの店舗",
    "pricing.fit.standard.3": "まずは手軽に導入してみたい方",
    "pricing.fit.premium.title": "プレミアムプランがおすすめの方",
    "pricing.fit.premium.1": "複数店舗を運営されている方",
    "pricing.fit.premium.2": "月間の来店数が多い店舗",
    "pricing.fit.premium.3": "優先サポートが必要な方",
    "pricing.faq.title": "料金に関するよくある質問",
    "pricing.faq.1.q": "初期費用はかかりますか？",
    "pricing.faq.1.a": "いいえ、すべてのプランで初期費用は無料です。月額料金のみでご利用いただけます。",
    "pricing.faq.2.q": "契約期間の縛りはありますか？",
    "pricing.faq.2.a": "最低6ヶ月からのご契約となります。詳しくはお問い合わせください。",
    "pricing.faq.3.q": "途中でプラン変更できますか？",
    "pricing.faq.3.a": "はい、プランのアップグレード・ダウングレードは随時可能です。次回請求時から新しいプランが適用されます。",
    "pricing.faq.4.q": "月間レビュー生成数の上限を超えた場合はどうなりますか？",
    "pricing.faq.4.a": "上限に達した場合、追加レビューパックをご購入いただくか、翌月のリセットをお待ちいただくことになります。",
    "pricing.faq.5.q": "支払い方法を教えてください。",
    "pricing.faq.5.a": "クレジットカード（Visa、Mastercard、JCBなど）でのお支払いに対応しています。請求書払いについてはお問い合わせください。",
    "pricing.faq.6.q": "解約はいつでもできますか？",
    "pricing.faq.6.a": "契約期間中はご利用いただき、契約期間満了後に解約が可能です。詳しくはお問い合わせください。",
    "nav.contact": "お問い合わせ",
    "nav.features": "特徴",
    "nav.flow": "導入の流れ",
    "nav.faq": "FAQ",
    "footer.login": "ログイン",
  };
  const t = (key: string) => ja[key] ?? key;
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 400);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navLinks = [
    { label: t("pricing.page.title"), href: "#plans" },
    { label: t("pricing.compare.title"), href: "#comparison" },
    { label: t("pricing.fit.title"), href: "#fit" },
    { label: t("pricing.faq.title"), href: "#faq" },
  ];

  const plans = [
    {
      name: t("pricing.standard"),
      price: "10,000",
      limit: t("pricing.standard.limit"),
      target: t("pricing.standard.target"),
      popular: true,
      features: [
        t("pricing.feat.ai"),
        t("pricing.feat.chat"),
        t("pricing.feat.qr"),
        "分析ページ（グラフ）",
        "メール通知",
        t("pricing.feat.support"),
      ],
    },
    {
      name: t("pricing.premium"),
      price: "20,000",
      limit: t("pricing.premium.limit"),
      target: t("pricing.premium.target"),
      popular: false,
      features: [
        t("pricing.feat.ai"),
        t("pricing.feat.chat"),
        t("pricing.feat.qr"),
        "分析ページ（グラフ）",
        "AI分析レポート",
        "CSVエクスポート",
        "AIプロンプト編集",
        "複数店舗管理",
        "メール通知",
        "優先サポート",
      ],
    },
  ];

  const comparisonRows: { label: string; standard: React.ReactNode; premium: React.ReactNode }[] = [
    { label: t("pricing.compare.monthlyLimit"), standard: t("pricing.compare.100"), premium: t("pricing.compare.unlimited") },
    { label: t("pricing.compare.aiDraft"), standard: <Check />, premium: <Check /> },
    { label: t("pricing.compare.chatSurvey"), standard: <Check />, premium: <Check /> },
    { label: t("pricing.compare.qrCode"), standard: <Check />, premium: <Check /> },
    { label: t("pricing.compare.analytics"), standard: <Check />, premium: <Check /> },
    { label: "AI分析レポート", standard: <Dash />, premium: <Check /> },
    { label: "CSVエクスポート", standard: <Dash />, premium: <Check /> },
    { label: "AIプロンプト編集", standard: <Dash />, premium: <Check /> },
    { label: t("pricing.compare.customDesign"), standard: <Check />, premium: <Check /> },
    { label: t("pricing.compare.support"), standard: t("pricing.compare.email"), premium: t("pricing.compare.priority") },
    { label: t("pricing.compare.multiStore"), standard: <Dash />, premium: <Check /> },
    { label: "メール通知", standard: <Check />, premium: <Check /> },
  ];

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 overflow-x-hidden">
      {/* ───────── Header ───────── */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-3">
          <a href="/">
            <Image src="/logo.png" alt="ComiSta" width={160} height={48} />
          </a>
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
              >
                {l.label}
              </a>
            ))}
            <a
              href="/contact"
              className="bg-gradient-to-r from-cyan-500 to-violet-500 text-white text-sm font-semibold px-5 py-2.5 rounded-full hover:opacity-90 transition-opacity shadow-lg shadow-cyan-500/25"
            >
              {t("nav.contact")}
            </a>
          </nav>
        </div>
      </header>

      {/* ───────── Hero ───────── */}
      <section className="pt-32 pb-16 bg-gradient-to-br from-indigo-50 via-white to-violet-50">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-5xl font-extrabold mb-4">
            <span className="bg-gradient-to-r from-cyan-500 to-violet-500 bg-clip-text text-transparent">
              {t("pricing.page.title")}
            </span>
          </h1>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto">
            {t("pricing.page.subtitle")}
          </p>
        </div>
      </section>

      {/* ───────── Plan Cards ───────── */}
      <section id="plans" className="py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-6 items-start">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`relative bg-white rounded-3xl p-8 border transition-all hover:-translate-y-1 ${
                  plan.popular
                    ? "border-transparent shadow-2xl shadow-violet-500/20 ring-2 ring-violet-400 md:scale-105"
                    : "border-gray-200 shadow-lg hover:shadow-xl"
                }`}
              >
                {plan.popular && (
                  <>
                    <div className="absolute -inset-[2px] rounded-3xl bg-gradient-to-r from-cyan-500 via-violet-500 to-fuchsia-500 opacity-20 blur-md -z-10" />
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-cyan-500 to-violet-500 text-white text-xs font-bold px-5 py-1.5 rounded-full shadow-lg">
                      {t("pricing.popular")}
                    </div>
                  </>
                )}
                <h3 className="font-bold text-lg mb-1">{plan.name}</h3>
                <p className="text-xs text-gray-500 mb-4">{plan.target}</p>
                <div className="mb-6">
                  <span className="text-5xl font-black bg-gradient-to-r from-cyan-500 to-violet-500 bg-clip-text text-transparent">
                    ¥{plan.price}
                  </span>
                  <span className="text-gray-500 text-sm">{t("pricing.perMonth")}</span>
                </div>
                <p className="text-sm text-cyan-600 font-semibold mb-6">{plan.limit}</p>
                <ul className="space-y-3 text-sm text-gray-600">
                  {plan.features.map((feat) => (
                    <li key={feat} className="flex items-center gap-2">
                      <Check />
                      {feat}
                    </li>
                  ))}
                </ul>
                <a
                  href="/contact"
                  className={`mt-8 block w-full py-3.5 rounded-full font-semibold text-center transition-all ${
                    plan.popular
                      ? "bg-gradient-to-r from-cyan-500 to-violet-500 text-white shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 hover:scale-105"
                      : "border border-gray-300 text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {t("pricing.contact")}
                </a>
              </div>
            ))}
          </div>
          <p className="text-center text-sm text-gray-400 mt-8">{t("pricing.page.taxNote")}</p>
        </div>
      </section>

      {/* ───────── Feature Comparison Table ───────── */}
      <section id="comparison" className="py-16 md:py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl md:text-4xl font-extrabold text-center mb-12">
            <span className="bg-gradient-to-r from-cyan-500 to-violet-500 bg-clip-text text-transparent">
              {t("pricing.compare.title")}
            </span>
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="text-left py-4 px-4 font-semibold text-gray-700 w-2/5">
                    {t("pricing.compare.feature")}
                  </th>
                  <th className="text-center py-4 px-4 font-bold text-gray-900 w-[30%]">
                    <div className="inline-flex flex-col items-center">
                      <span>{t("pricing.standard")}</span>
                      <span className="text-xs font-normal text-gray-400 mt-0.5">¥10,000{t("pricing.perMonth")}</span>
                    </div>
                  </th>
                  <th className="text-center py-4 px-4 font-bold text-gray-900 w-[30%]">
                    <div className="inline-flex flex-col items-center">
                      <span className="bg-gradient-to-r from-cyan-500 to-violet-500 bg-clip-text text-transparent">{t("pricing.premium")}</span>
                      <span className="text-xs font-normal text-gray-400 mt-0.5">¥20,000{t("pricing.perMonth")}</span>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {comparisonRows.map((row, i) => (
                  <tr key={row.label} className={`border-b border-gray-100 ${i % 2 === 0 ? "bg-gray-50/50" : ""}`}>
                    <td className="py-4 px-4 text-gray-700 font-medium">{row.label}</td>
                    <td className="py-4 px-4 text-center">
                      <div className="flex items-center justify-center">{row.standard}</div>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <div className="flex items-center justify-center">{row.premium}</div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ───────── Which Plan Is Right ───────── */}
      <section id="fit" className="py-16 md:py-24 bg-gradient-to-br from-indigo-50 via-white to-violet-50">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl md:text-4xl font-extrabold text-center mb-12">
            <span className="bg-gradient-to-r from-cyan-500 to-violet-500 bg-clip-text text-transparent">
              {t("pricing.fit.title")}
            </span>
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {/* Standard fit */}
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200">
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-violet-100 text-violet-600 text-sm font-black">S</span>
                {t("pricing.fit.standard.title")}
              </h3>
              <ul className="space-y-3 text-sm text-gray-600">
                {[t("pricing.fit.standard.1"), t("pricing.fit.standard.2"), t("pricing.fit.standard.3")].map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <Check />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            {/* Premium fit */}
            <div className="bg-white rounded-2xl p-8 shadow-lg border-2 border-violet-200">
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-r from-cyan-500 to-violet-500 text-white text-sm font-black">P</span>
                {t("pricing.fit.premium.title")}
              </h3>
              <ul className="space-y-3 text-sm text-gray-600">
                {[t("pricing.fit.premium.1"), t("pricing.fit.premium.2"), t("pricing.fit.premium.3")].map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <Check />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ───────── Pricing FAQ ───────── */}
      <section id="faq" className="py-16 md:py-24 bg-white">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-2xl md:text-4xl font-extrabold text-center mb-12">
            <span className="bg-gradient-to-r from-cyan-500 to-violet-500 bg-clip-text text-transparent">
              {t("pricing.faq.title")}
            </span>
          </h2>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <FaqItem key={i} q={t(`pricing.faq.${i}.q`)} a={t(`pricing.faq.${i}.a`)} />
            ))}
          </div>
        </div>
      </section>

      {/* ───────── CTA ───────── */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-gray-950 via-indigo-950 to-violet-950">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-4xl font-extrabold mb-4">
            <span className="bg-gradient-to-r from-cyan-400 via-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
              {t("pricing.page.contactNote")}
            </span>
          </h2>
          <div className="mt-8">
            <a
              href="/contact"
              className="inline-block bg-gradient-to-r from-cyan-500 to-violet-500 text-white font-bold px-12 py-5 rounded-full text-lg shadow-2xl shadow-cyan-500/30 hover:shadow-cyan-500/50 hover:scale-105 transition-all"
            >
              {t("pricing.page.cta")}
            </a>
          </div>
          <p className="mt-6 text-sm text-gray-400">{t("pricing.page.ctaSub")}</p>
        </div>
      </section>

      {/* ───────── Footer ───────── */}
      <footer className="bg-gray-950 text-gray-400 py-12 border-t border-white/5">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <a href="/">
              <Image src="/logo.png" alt="ComiSta" width={100} height={30} />
            </a>
            <nav className="flex flex-wrap items-center justify-center gap-6 text-sm">
              <a href="/" className="hover:text-white transition-colors">
                {"トップ"}
              </a>
              <a href="/#features" className="hover:text-white transition-colors">
                {t("nav.features")}
              </a>
              <a href="/#flow" className="hover:text-white transition-colors">
                {t("nav.flow")}
              </a>
              <a href="/#faq" className="hover:text-white transition-colors">
                {t("nav.faq")}
              </a>
              <a href="/contact" className="hover:text-white transition-colors">
                {t("nav.contact")}
              </a>
              <a href="/login" className="hover:text-white transition-colors">
                {t("footer.login")}
              </a>
            </nav>
          </div>
          <div className="mt-8 border-t border-gray-800 pt-6 text-center text-xs">
            &copy; 2026 ComiSta. All Rights Reserved.
          </div>
        </div>
      </footer>

      {/* ───────── Back to Top ───────── */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className={`fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full bg-gradient-to-r from-cyan-500 to-violet-500 text-white shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-110 ${showTop ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"}`}
        aria-label="Back to top"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 15l7-7 7 7" />
        </svg>
      </button>
    </div>
  );
}
