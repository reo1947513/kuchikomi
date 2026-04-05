"use client";

import Image from "next/image";
import { useState, useEffect, useRef, useCallback } from "react";

/* ─── Scroll‑reveal hook ─── */
function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return { ref, visible };
}

function Section({
  children,
  className = "",
  id,
}: {
  children: React.ReactNode;
  className?: string;
  id?: string;
}) {
  const { ref, visible } = useReveal();
  return (
    <section
      id={id}
      ref={ref}
      className={`transition-all duration-700 ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      } ${className}`}
    >
      {children}
    </section>
  );
}

/* ─── Smooth scroll helper ─── */
function scrollTo(id: string) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth" });
}

/* ─── FAQ Accordion Item ─── */
function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-6 py-5 text-left font-semibold text-gray-800 hover:bg-gray-50 transition-colors"
      >
        <span>{q}</span>
        <svg
          className={`w-5 h-5 shrink-0 transition-transform duration-300 ${
            open ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>
      <div
        className={`grid transition-all duration-300 ${
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        <div className="overflow-hidden">
          <p className="px-6 pb-5 text-gray-600 leading-relaxed">{a}</p>
        </div>
      </div>
    </div>
  );
}

/* ─── Main Page ─── */
export default function LpPage() {
  const [menuOpen, setMenuOpen] = useState(false);

  const handleNav = useCallback((id: string) => {
    setMenuOpen(false);
    setTimeout(() => scrollTo(id), 100);
  }, []);

  const navLinks = [
    { label: "特徴", id: "features" },
    { label: "料金", id: "pricing" },
    { label: "導入の流れ", id: "flow" },
    { label: "FAQ", id: "faq" },
  ];

  return (
    <div className="min-h-screen bg-white text-gray-900 overflow-x-hidden">
      {/* ───────── Header ───────── */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-3">
          <Image src="/logo.png" alt="ComiSta" width={120} height={36} />

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((l) => (
              <button
                key={l.id}
                onClick={() => scrollTo(l.id)}
                className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
              >
                {l.label}
              </button>
            ))}
            <button
              onClick={() => scrollTo("contact")}
              className="bg-gradient-to-r from-cyan-500 to-violet-500 text-white text-sm font-semibold px-5 py-2.5 rounded-full hover:opacity-90 transition-opacity"
            >
              無料相談する
            </button>
          </nav>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="メニュー"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {menuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden bg-white border-t border-gray-100 px-4 pb-4">
            {navLinks.map((l) => (
              <button
                key={l.id}
                onClick={() => handleNav(l.id)}
                className="block w-full text-left py-3 text-gray-600 hover:text-gray-900"
              >
                {l.label}
              </button>
            ))}
            <button
              onClick={() => handleNav("contact")}
              className="mt-2 w-full bg-gradient-to-r from-cyan-500 to-violet-500 text-white font-semibold py-3 rounded-full"
            >
              無料相談する
            </button>
          </div>
        )}
      </header>

      {/* ───────── Hero ───────── */}
      <section className="relative py-24 md:py-36 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-50 via-white to-violet-50" />
        <div className="relative max-w-4xl mx-auto text-center px-4">
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight">
            <span className="bg-gradient-to-r from-cyan-500 to-violet-500 bg-clip-text text-transparent">
              たった3分のアンケートで
            </span>
            <br />
            高品質な口コミを自動生成
          </h1>
          <p className="mt-6 text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            AIが自動でお客様の声を口コミに。Googleマップの評価アップで集客力を高めます。
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => scrollTo("contact")}
              className="bg-gradient-to-r from-cyan-500 to-violet-500 text-white font-bold px-8 py-4 rounded-full text-lg shadow-lg hover:shadow-xl hover:scale-105 transition-all"
            >
              まずは無料相談
            </button>
          </div>
          <p className="mt-4 text-sm text-gray-500">
            初期費用0円・最短即日導入
          </p>
        </div>
      </section>

      {/* ───────── Problem ───────── */}
      <Section className="py-20 md:py-28 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl md:text-4xl font-bold text-center mb-14">
            こんなお悩みありませんか？
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: "😔",
                title: "口コミを書いてもらえない",
                desc: "お客様に口コミをお願いするのが気まずい",
              },
              {
                icon: "⭐",
                title: "Googleマップの評価が低い",
                desc: "競合に比べて星の数が少ない",
              },
              {
                icon: "⏰",
                title: "口コミ対策に時間がかかる",
                desc: "忙しくて口コミ管理まで手が回らない",
              },
              {
                icon: "❓",
                title: "何を書けばいいかわからない",
                desc: "お客様が口コミの書き方に困っている",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 text-center"
              >
                <div className="text-4xl mb-4">{item.icon}</div>
                <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                <p className="text-gray-500 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* ───────── Solution ───────── */}
      <Section className="py-20 md:py-28">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-2xl md:text-4xl font-bold text-center mb-4">
            <span className="bg-gradient-to-r from-cyan-500 to-violet-500 bg-clip-text text-transparent">
              ComiSta
            </span>
            が全て解決します
          </h2>
          <p className="text-center text-gray-500 mb-14">
            3ステップで口コミを簡単収集
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                num: "01",
                icon: "📱",
                title: "アンケートに回答",
                desc: "QRコードを読み取って簡単なアンケートに回答",
              },
              {
                num: "02",
                icon: "🤖",
                title: "AIが口コミを自動生成",
                desc: "回答内容をもとにAIが自然な口コミ文章を作成",
              },
              {
                num: "03",
                icon: "📍",
                title: "Googleマップに投稿",
                desc: "ワンタップでGoogleマップに口コミを投稿",
              },
            ].map((step) => (
              <div key={step.num} className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-50 to-violet-50 text-3xl mb-4">
                  {step.icon}
                </div>
                <div className="text-xs font-bold text-cyan-500 tracking-widest mb-2">
                  STEP {step.num}
                </div>
                <h3 className="font-bold text-lg mb-2">{step.title}</h3>
                <p className="text-gray-500 text-sm">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* ───────── Features ───────── */}
      <Section id="features" className="py-20 md:py-28 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl md:text-4xl font-bold text-center mb-14">
            ComiStaが選ばれる理由
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: "✨",
                title: "AIによる自然な文章生成",
                desc: "実際のお客様の声に基づいた自然な口コミを自動生成",
              },
              {
                icon: "💬",
                title: "チャット形式のアンケート",
                desc: "LINEのようなUIで回答率90%以上",
              },
              {
                icon: "📷",
                title: "QRコードで簡単導入",
                desc: "お客様はQRコードを読み取るだけ。アプリ不要",
              },
              {
                icon: "📊",
                title: "リアルタイム分析",
                desc: "回答データをリアルタイムで分析。改善点が一目瞭然",
              },
              {
                icon: "🎨",
                title: "カスタマイズ自由",
                desc: "ロゴ、カラー、質問内容を自由にカスタマイズ",
              },
              {
                icon: "🏪",
                title: "複数業種対応",
                desc: "飲食店、美容室、整骨院、バー、エステ、ラウンジなど幅広く対応",
              },
            ].map((f) => (
              <div
                key={f.title}
                className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
              >
                <div className="text-3xl mb-4">{f.icon}</div>
                <h3 className="font-bold text-lg mb-2">{f.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* ───────── Target Industries ───────── */}
      <Section className="py-20 md:py-28">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-2xl md:text-4xl font-bold text-center mb-14">
            幅広い業種に対応
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {[
              { icon: "🍽️", label: "飲食店・レストラン" },
              { icon: "💇", label: "美容室・ヘアサロン" },
              { icon: "💆", label: "整骨院・整体院" },
              { icon: "✨", label: "エステサロン" },
              { icon: "🍸", label: "バー" },
              { icon: "🌙", label: "ラウンジ・スナック" },
            ].map((ind) => (
              <div
                key={ind.label}
                className="flex items-center gap-3 bg-gradient-to-br from-cyan-50 to-violet-50 rounded-xl p-5 border border-gray-100"
              >
                <span className="text-2xl">{ind.icon}</span>
                <span className="font-semibold text-sm">{ind.label}</span>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* ───────── Pricing ───────── */}
      <Section id="pricing" className="py-20 md:py-28 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl md:text-4xl font-bold text-center mb-2">
            シンプルな料金プラン
          </h2>
          <p className="text-center text-gray-500 mb-14">全プラン初期費用0円</p>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                name: "ライトプラン",
                price: "6,000",
                limit: "月50件",
                target: "小規模店舗",
                popular: false,
              },
              {
                name: "スタンダードプラン",
                price: "10,000",
                limit: "月100件",
                target: "中規模店舗",
                popular: true,
              },
              {
                name: "プレミアムプラン",
                price: "20,000",
                limit: "月300件",
                target: "大規模・複数店舗",
                popular: false,
              },
            ].map((plan) => (
              <div
                key={plan.name}
                className={`relative bg-white rounded-2xl p-8 shadow-sm border ${
                  plan.popular
                    ? "border-cyan-400 ring-2 ring-cyan-400/30"
                    : "border-gray-100"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-cyan-500 to-violet-500 text-white text-xs font-bold px-4 py-1 rounded-full">
                    POPULAR
                  </div>
                )}
                <h3 className="font-bold text-lg mb-1">{plan.name}</h3>
                <p className="text-xs text-gray-500 mb-4">{plan.target}</p>
                <div className="mb-6">
                  <span className="text-4xl font-extrabold">
                    ¥{plan.price}
                  </span>
                  <span className="text-gray-500 text-sm">/月</span>
                </div>
                <p className="text-sm text-cyan-600 font-semibold mb-6">
                  {plan.limit}
                </p>
                <ul className="space-y-3 text-sm text-gray-600">
                  {[
                    "AIによる口コミ自動生成",
                    "チャット形式アンケート",
                    "QRコード発行",
                    "リアルタイム分析",
                    "カスタマーサポート",
                  ].map((feat) => (
                    <li key={feat} className="flex items-center gap-2">
                      <svg
                        className="w-4 h-4 text-cyan-500 shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      {feat}
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => scrollTo("contact")}
                  className={`mt-8 w-full py-3 rounded-full font-semibold transition-all ${
                    plan.popular
                      ? "bg-gradient-to-r from-cyan-500 to-violet-500 text-white hover:opacity-90"
                      : "border border-gray-300 text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  無料相談する
                </button>
              </div>
            ))}
          </div>
          <p className="text-center text-sm text-gray-500 mt-8">
            永年ライセンスもご用意しています。詳しくはお問い合わせください。
          </p>
        </div>
      </Section>

      {/* ───────── Flow ───────── */}
      <Section id="flow" className="py-20 md:py-28">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-2xl md:text-4xl font-bold text-center mb-14">
            導入の流れ
          </h2>
          <div className="grid md:grid-cols-4 gap-8">
            {[
              {
                num: "1",
                title: "お問い合わせ",
                desc: "まずはお気軽にご相談ください",
              },
              {
                num: "2",
                title: "アカウント発行",
                desc: "最短即日でご利用開始",
              },
              {
                num: "3",
                title: "アンケート設定",
                desc: "質問内容やデザインをカスタマイズ",
              },
              {
                num: "4",
                title: "運用開始",
                desc: "QRコードを設置して口コミ収集スタート",
              },
            ].map((s, i) => (
              <div key={s.num} className="text-center relative">
                {i < 3 && (
                  <div className="hidden md:block absolute top-6 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-cyan-200 to-violet-200" />
                )}
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-cyan-500 to-violet-500 text-white font-bold text-lg mb-4 relative z-10">
                  {s.num}
                </div>
                <h3 className="font-bold mb-2">{s.title}</h3>
                <p className="text-gray-500 text-sm">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* ───────── FAQ ───────── */}
      <Section id="faq" className="py-20 md:py-28 bg-gray-50">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-2xl md:text-4xl font-bold text-center mb-14">
            よくある質問
          </h2>
          <div className="space-y-4">
            <FaqItem
              q="初期費用はかかりますか？"
              a="いいえ、初期費用は一切かかりません。月額プランのみでご利用いただけます。"
            />
            <FaqItem
              q="契約期間の縛りはありますか？"
              a="最低契約期間は6ヶ月です。6ヶ月以降はいつでも解約可能です。"
            />
            <FaqItem
              q="どんな業種でも使えますか？"
              a="飲食店、美容室、整骨院、エステ、バー、ラウンジ、スナックなど、店舗型ビジネスであれば業種を問わずご利用いただけます。"
            />
            <FaqItem
              q="導入にどれくらい時間がかかりますか？"
              a="最短即日で導入可能です。アカウント発行後すぐにご利用いただけます。"
            />
            <FaqItem
              q="お客様にアプリをインストールしてもらう必要がありますか？"
              a="いいえ、アプリのインストールは不要です。QRコードを読み取るだけでブラウザ上でアンケートに回答できます。"
            />
            <FaqItem
              q="生成された口コミは編集できますか？"
              a="はい、AIが生成した文章はお客様が自由に編集してから投稿できます。"
            />
          </div>
        </div>
      </Section>

      {/* ───────── CTA / Contact ───────── */}
      <Section id="contact" className="py-20 md:py-28">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-4xl font-bold mb-4">
            まずは無料相談から
          </h2>
          <p className="text-gray-500 mb-10">
            ComiStaの導入についてお気軽にご相談ください
          </p>
          <a
            href="mailto:conestkawakami@gmail.com"
            className="inline-block bg-gradient-to-r from-cyan-500 to-violet-500 text-white font-bold px-10 py-4 rounded-full text-lg shadow-lg hover:shadow-xl hover:scale-105 transition-all"
          >
            無料相談する
          </a>
          <p className="mt-6 text-sm text-gray-500">
            メールアドレス:{" "}
            <a
              href="mailto:conestkawakami@gmail.com"
              className="underline hover:text-gray-700"
            >
              conestkawakami@gmail.com
            </a>
          </p>
        </div>
      </Section>

      {/* ───────── Footer ───────── */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <Image src="/logo.png" alt="ComiSta" width={100} height={30} />
            <nav className="flex flex-wrap items-center justify-center gap-6 text-sm">
              {navLinks.map((l) => (
                <button
                  key={l.id}
                  onClick={() => scrollTo(l.id)}
                  className="hover:text-white transition-colors"
                >
                  {l.label}
                </button>
              ))}
              <a
                href="/login"
                className="hover:text-white transition-colors"
              >
                ログイン
              </a>
            </nav>
          </div>
          <div className="mt-8 border-t border-gray-800 pt-6 text-center text-xs">
            &copy; 2026 ComiSta. All Rights Reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
