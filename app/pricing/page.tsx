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
  return <span className="text-gray-300 text-lg">&mdash;</span>;
}

export default function PricingPage() {
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 400);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navLinks = [
    { label: "店舗向けプラン", href: "#plans" },
    { label: "チェーン・複数店舗", href: "#chain" },
    { label: "エージェンシー", href: "#agency" },
    { label: "オプション", href: "#options" },
    { label: "機能比較", href: "#comparison" },
    { label: "FAQ", href: "#faq" },
  ];

  /* ── Store Plans ── */
  const storePlans = [
    {
      name: "スタンダードプラン",
      price: "10,000",
      limit: "月100件",
      target: "中規模店舗",
      popular: true,
      features: [
        "AIによる口コミ下書き作成",
        "チャット形式アンケート",
        "QRコード発行",
        "分析ページ（グラフ）",
        "メール通知",
        "カスタマーサポート",
      ],
    },
    {
      name: "プレミアムプラン",
      price: "30,000",
      limit: "無制限",
      target: "大規模・複数店舗",
      popular: false,
      features: [
        "AIによる口コミ下書き作成",
        "チャット形式アンケート",
        "QRコード発行",
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

  /* ── Chain Packs ── */
  const chainPacks = [
    {
      name: "チェーン3店舗パック",
      price: "80,000",
      save: "¥10,000お得",
      target: "小規模チェーン",
      features: ["プレミアム機能 × 3店舗", "店舗横断ダッシュボード", "一括管理・レポート"],
    },
    {
      name: "チェーン5店舗パック",
      price: "130,000",
      save: "¥20,000お得",
      target: "中規模チェーン",
      features: ["プレミアム機能 × 5店舗", "店舗横断ダッシュボード", "一括管理・レポート", "専任サポート"],
    },
  ];

  /* ── Agency Plans ── */
  const agencyPlans = [
    { name: "エージェンシー5店舗", price: "40,000", target: "小規模代理店" },
    { name: "エージェンシー10店舗", price: "70,000", target: "中規模代理店" },
    { name: "エージェンシー30店舗〜", price: null, label: "要見積", target: "大規模代理店" },
  ];

  /* ── Options ── */
  const options = [
    { name: "Google口コミ管理代行", price: null, label: "要相談", desc: "口コミ返信の代行や評価改善のコンサルティング" },
    { name: "初期セットアップ代行", price: "15,000〜", desc: "アカウント作成からQRコード設置まで完全代行" },
  ];

  /* ── Comparison Table ── */
  const comparisonRows: { label: string; standard: React.ReactNode; premium: React.ReactNode }[] = [
    { label: "月間レビュー生成数", standard: "月100件", premium: "無制限" },
    { label: "AIによる口コミ下書き作成", standard: <Check />, premium: <Check /> },
    { label: "チャット形式アンケート", standard: <Check />, premium: <Check /> },
    { label: "QRコード発行", standard: <Check />, premium: <Check /> },
    { label: "回答データ分析", standard: <Check />, premium: <Check /> },
    { label: "AI分析レポート", standard: <Dash />, premium: <Check /> },
    { label: "CSVエクスポート", standard: <Dash />, premium: <Check /> },
    { label: "AIプロンプト編集", standard: <Dash />, premium: <Check /> },
    { label: "アンケートデザインカスタマイズ", standard: <Check />, premium: <Check /> },
    { label: "カスタマーサポート", standard: "メールサポート", premium: "優先サポート" },
    { label: "複数店舗管理", standard: <Dash />, premium: <Check /> },
    { label: "メール通知", standard: <Check />, premium: <Check /> },
  ];

  /* ── FAQ ── */
  const faqs = [
    { q: "初期費用はかかりますか？", a: "いいえ、すべてのプランで初期費用は無料です。月額料金のみでご利用いただけます。" },
    { q: "契約期間の縛りはありますか？", a: "最低6ヶ月からのご契約となります。詳しくはお問い合わせください。" },
    { q: "途中でプラン変更できますか？", a: "はい、プランのアップグレード・ダウングレードは随時可能です。次回請求時から新しいプランが適用されます。" },
    { q: "月間レビュー生成数の上限を超えた場合はどうなりますか？", a: "上限に達した場合、追加レビューパックをご購入いただくか、翌月のリセットをお待ちいただくことになります。" },
    { q: "支払い方法を教えてください。", a: "クレジットカード（Visa、Mastercard、JCBなど）でのお支払いに対応しています。請求書払いについてはお問い合わせください。" },
    { q: "解約はいつでもできますか？", a: "契約期間中はご利用いただき、契約期間満了後に解約が可能です。詳しくはお問い合わせください。" },
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
              お問い合わせ
            </a>
          </nav>
        </div>
      </header>

      {/* ───────── Hero ───────── */}
      <section className="pt-32 pb-16 bg-gradient-to-br from-indigo-50 via-white to-violet-50">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-5xl font-extrabold mb-4">
            <span className="bg-gradient-to-r from-cyan-500 to-violet-500 bg-clip-text text-transparent">
              料金プラン
            </span>
          </h1>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto">
            ComiStaの料金プランをご紹介します。すべてのプランで初期費用は無料です。
          </p>
        </div>
      </section>

      {/* ───────── Store Plan Cards ───────── */}
      <section id="plans" className="py-16 md:py-24">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-2xl md:text-4xl font-extrabold text-center mb-4">
            <span className="bg-gradient-to-r from-cyan-500 to-violet-500 bg-clip-text text-transparent">
              店舗向けプラン
            </span>
          </h2>
          <p className="text-center text-gray-500 mb-12">1店舗から導入できるベーシックなプラン</p>
          <div className="grid md:grid-cols-2 gap-6 items-start max-w-4xl mx-auto">
            {storePlans.map((plan) => (
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
                      人気No.1
                    </div>
                  </>
                )}
                <h3 className="font-bold text-lg mb-1">{plan.name}</h3>
                <p className="text-xs text-gray-500 mb-4">{plan.target}</p>
                <div className="mb-6">
                  <span className="text-5xl font-black bg-gradient-to-r from-cyan-500 to-violet-500 bg-clip-text text-transparent">
                    &yen;{plan.price}
                  </span>
                  <span className="text-gray-500 text-sm">/月</span>
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
                  お問い合わせ
                </a>
              </div>
            ))}
          </div>
          <p className="text-center text-sm text-gray-400 mt-8">※ 表示価格はすべて税別です。</p>
        </div>
      </section>

      {/* ───────── Chain / Multi-Store Packs ───────── */}
      <section id="chain" className="py-16 md:py-24 bg-gradient-to-br from-indigo-50 via-white to-violet-50">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-2xl md:text-4xl font-extrabold text-center mb-4">
            <span className="bg-gradient-to-r from-cyan-500 to-violet-500 bg-clip-text text-transparent">
              チェーン・複数店舗パック
            </span>
          </h2>
          <p className="text-center text-gray-500 mb-12">複数店舗をまとめて導入するとお得なパックプラン</p>
          <div className="grid sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {chainPacks.map((pack) => (
              <div
                key={pack.name}
                className="relative bg-white/70 backdrop-blur-sm rounded-3xl p-8 border border-gray-200 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all"
              >
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-bold text-lg">{pack.name}</h3>
                  <span className="text-xs bg-gradient-to-r from-emerald-400 to-cyan-400 text-white px-3 py-0.5 rounded-full font-semibold">
                    {pack.save}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mb-4">{pack.target}</p>
                <div className="mb-6">
                  <span className="text-4xl font-black bg-gradient-to-r from-cyan-500 to-violet-500 bg-clip-text text-transparent">
                    &yen;{pack.price}
                  </span>
                  <span className="text-gray-500 text-sm">/月</span>
                </div>
                <ul className="space-y-3 text-sm text-gray-600">
                  {pack.features.map((feat) => (
                    <li key={feat} className="flex items-center gap-2">
                      <Check />
                      {feat}
                    </li>
                  ))}
                </ul>
                <a
                  href="/contact"
                  className="mt-8 block w-full py-3.5 rounded-full font-semibold text-center border border-gray-300 text-gray-700 hover:bg-gray-50 transition-all"
                >
                  お問い合わせ
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───────── Agency Plans ───────── */}
      <section id="agency" className="py-16 md:py-24">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-2xl md:text-4xl font-extrabold text-center mb-4">
            <span className="bg-gradient-to-r from-cyan-500 to-violet-500 bg-clip-text text-transparent">
              エージェンシープラン
            </span>
          </h2>
          <p className="text-center text-gray-500 mb-12">代理店・コンサル企業向けのプラン</p>
          <div className="grid sm:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {agencyPlans.map((plan) => (
              <div
                key={plan.name}
                className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 border border-gray-200 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all text-center"
              >
                <h3 className="font-bold text-lg mb-1">{plan.name}</h3>
                <p className="text-xs text-gray-500 mb-6">{plan.target}</p>
                <div className="mb-6">
                  {plan.price ? (
                    <>
                      <span className="text-4xl font-black bg-gradient-to-r from-cyan-500 to-violet-500 bg-clip-text text-transparent">
                        &yen;{plan.price}
                      </span>
                      <span className="text-gray-500 text-sm">/月</span>
                    </>
                  ) : (
                    <span className="text-3xl font-black bg-gradient-to-r from-cyan-500 to-violet-500 bg-clip-text text-transparent">
                      {plan.label}
                    </span>
                  )}
                </div>
                <a
                  href="/contact"
                  className="block w-full py-3.5 rounded-full font-semibold text-center border border-gray-300 text-gray-700 hover:bg-gray-50 transition-all"
                >
                  お問い合わせ
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───────── Options ───────── */}
      <section id="options" className="py-16 md:py-24 bg-gradient-to-br from-indigo-50 via-white to-violet-50">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl md:text-4xl font-extrabold text-center mb-4">
            <span className="bg-gradient-to-r from-cyan-500 to-violet-500 bg-clip-text text-transparent">
              オプション
            </span>
          </h2>
          <p className="text-center text-gray-500 mb-12">プランに追加できるオプションサービス</p>
          <div className="grid sm:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {options.map((opt) => (
              <div
                key={opt.name}
                className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 border border-gray-200 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all"
              >
                <h3 className="font-bold text-lg mb-2">{opt.name}</h3>
                <p className="text-sm text-gray-500 mb-4">{opt.desc}</p>
                <div className="mb-2">
                  {opt.price ? (
                    <>
                      <span className="text-3xl font-black bg-gradient-to-r from-cyan-500 to-violet-500 bg-clip-text text-transparent">
                        &yen;{opt.price}
                      </span>
                    </>
                  ) : (
                    <span className="text-2xl font-black bg-gradient-to-r from-cyan-500 to-violet-500 bg-clip-text text-transparent">
                      {opt.label}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───────── Feature Comparison Table ───────── */}
      <section id="comparison" className="py-16 md:py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl md:text-4xl font-extrabold text-center mb-12">
            <span className="bg-gradient-to-r from-cyan-500 to-violet-500 bg-clip-text text-transparent">
              プラン機能比較
            </span>
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="text-left py-4 px-4 font-semibold text-gray-700 w-2/5">
                    機能
                  </th>
                  <th className="text-center py-4 px-4 font-bold text-gray-900 w-[30%]">
                    <div className="inline-flex flex-col items-center">
                      <span>スタンダードプラン</span>
                      <span className="text-xs font-normal text-gray-400 mt-0.5">&yen;10,000/月</span>
                    </div>
                  </th>
                  <th className="text-center py-4 px-4 font-bold text-gray-900 w-[30%]">
                    <div className="inline-flex flex-col items-center">
                      <span className="bg-gradient-to-r from-cyan-500 to-violet-500 bg-clip-text text-transparent">プレミアムプラン</span>
                      <span className="text-xs font-normal text-gray-400 mt-0.5">&yen;30,000/月</span>
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
      <section className="py-16 md:py-24 bg-gradient-to-br from-indigo-50 via-white to-violet-50">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl md:text-4xl font-extrabold text-center mb-12">
            <span className="bg-gradient-to-r from-cyan-500 to-violet-500 bg-clip-text text-transparent">
              どのプランが最適？
            </span>
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {/* Standard fit */}
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200">
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-violet-100 text-violet-600 text-sm font-black">S</span>
                スタンダードプランがおすすめの方
              </h3>
              <ul className="space-y-3 text-sm text-gray-600">
                {["1店舗で口コミ運用を始めたい方", "月間の来店数が100名程度までの店舗", "まずは手軽に導入してみたい方"].map((item) => (
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
                プレミアムプランがおすすめの方
              </h3>
              <ul className="space-y-3 text-sm text-gray-600">
                {["複数店舗を運営されている方", "月間の来店数が多い店舗", "優先サポートが必要な方"].map((item) => (
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
              料金に関するよくある質問
            </span>
          </h2>
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <FaqItem key={i} q={faq.q} a={faq.a} />
            ))}
          </div>
        </div>
      </section>

      {/* ───────── CTA ───────── */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-gray-950 via-indigo-950 to-violet-950">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-4xl font-extrabold mb-4">
            <span className="bg-gradient-to-r from-cyan-400 via-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
              プランの詳細やお見積もりについてはお気軽にお問い合わせください。
            </span>
          </h2>
          <div className="mt-8">
            <a
              href="/contact"
              className="inline-block bg-gradient-to-r from-cyan-500 to-violet-500 text-white font-bold px-12 py-5 rounded-full text-lg shadow-2xl shadow-cyan-500/30 hover:shadow-cyan-500/50 hover:scale-105 transition-all"
            >
              まずは相談してみる
            </a>
          </div>
          <p className="mt-6 text-sm text-gray-400">初期費用0円 ・ 最短即日導入 ・ 1店舗から利用可能</p>
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
              <a href="/" className="hover:text-white transition-colors">トップ</a>
              <a href="/#features" className="hover:text-white transition-colors">特徴</a>
              <a href="/#flow" className="hover:text-white transition-colors">導入の流れ</a>
              <a href="/#faq" className="hover:text-white transition-colors">FAQ</a>
              <a href="/contact" className="hover:text-white transition-colors">お問い合わせ</a>
              <a href="/login" className="hover:text-white transition-colors">ログイン</a>
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
