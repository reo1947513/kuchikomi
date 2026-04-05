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
    <div className="bg-white/60 backdrop-blur-sm border border-white/40 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 sm:px-6 py-4 sm:py-5 text-left text-sm sm:text-base font-semibold text-gray-800 hover:bg-white/40 transition-colors"
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
          <p className="px-4 sm:px-6 pb-4 sm:pb-5 text-sm sm:text-base text-gray-600 leading-relaxed">{a}</p>
        </div>
      </div>
    </div>
  );
}

/* ─── Floating decoration blobs ─── */
function BgBlob({
  className,
}: {
  className: string;
}) {
  return (
    <div
      className={`absolute rounded-full blur-3xl opacity-20 pointer-events-none ${className}`}
    />
  );
}

/* ─── Main Page ─── */
export default function LpPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";
    window.scrollTo(0, 0);
    const onScroll = () => setShowTop(window.scrollY > 400);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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
    <div className="min-h-screen bg-gray-950 text-gray-900 overflow-x-hidden">
      {/* ───────── Header ───────── */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-3">
          <Image src="/logo.png" alt="ComiSta" width={120} height={36} className="sm:w-[160px]" />

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
              onClick={() => window.location.href = "/contact"}
              className="bg-gradient-to-r from-cyan-500 to-violet-500 text-white text-sm font-semibold px-5 py-2.5 rounded-full hover:opacity-90 transition-opacity shadow-lg shadow-cyan-500/25"
            >
              お問い合わせ
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

        {/* Mobile menu overlay */}
        {menuOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            onClick={() => setMenuOpen(false)}
          />
        )}
        {/* Mobile menu drawer */}
        <div className={`fixed top-0 right-0 h-full w-72 bg-white z-50 shadow-2xl transition-transform duration-300 ease-out md:hidden ${menuOpen ? "translate-x-0" : "translate-x-full"}`}>
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <span className="text-sm font-bold text-gray-800">メニュー</span>
            <button onClick={() => setMenuOpen(false)} className="p-1 text-gray-400 hover:text-gray-600">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <nav className="px-5 py-4 space-y-1">
            {navLinks.map((l) => (
              <button
                key={l.id}
                onClick={() => handleNav(l.id)}
                className="block w-full text-left py-3 px-3 text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-lg transition-colors"
              >
                {l.label}
              </button>
            ))}
          </nav>
          <div className="px-5 mt-2">
            <button
              onClick={() => window.location.href = "/contact"}
              className="w-full bg-gradient-to-r from-cyan-500 to-violet-500 text-white font-semibold py-3 rounded-full"
            >
              お問い合わせ
            </button>
          </div>
        </div>
      </header>

      {/* ───────── Hero ───────── */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-950 via-indigo-950 to-violet-950" />
        {/* Decorative blobs with animation */}
        <BgBlob className="w-[600px] h-[600px] bg-cyan-500 -top-40 -left-40 opacity-30 animate-[float_8s_ease-in-out_infinite]" />
        <BgBlob className="w-[500px] h-[500px] bg-violet-500 top-1/3 -right-40 opacity-25 animate-[float_10s_ease-in-out_infinite_1s]" />
        <BgBlob className="w-[400px] h-[400px] bg-fuchsia-500 bottom-0 left-1/3 opacity-20 animate-[float_12s_ease-in-out_infinite_2s]" />
        {/* Dot grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "radial-gradient(circle, white 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />
        <style>{`
          @keyframes float {
            0%, 100% { transform: translateY(0) scale(1); }
            50% { transform: translateY(-30px) scale(1.05); }
          }
          @keyframes heroFadeUp {
            from { opacity: 0; transform: translateY(40px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes heroScale {
            from { opacity: 0; transform: scale(0.8); }
            to { opacity: 1; transform: scale(1); }
          }
          @keyframes heroPulse {
            0%, 100% { box-shadow: 0 0 0 0 rgba(6,182,212,0.4); }
            50% { box-shadow: 0 0 40px 10px rgba(6,182,212,0.2); }
          }
          @keyframes shimmer {
            0% { background-position: -200% center; }
            100% { background-position: 200% center; }
          }
          @keyframes glowPulse {
            0%, 100% { opacity: 0.2; transform: scale(1); }
            50% { opacity: 0.35; transform: scale(1.02); }
          }
          @keyframes popularPulse {
            0%, 100% { box-shadow: 0 25px 50px -12px rgba(139,92,246,0.2); }
            50% { box-shadow: 0 25px 60px -8px rgba(139,92,246,0.35); }
          }
          @keyframes badgeBounce {
            0%, 100% { transform: translateX(-50%) translateY(0); }
            50% { transform: translateX(-50%) translateY(-3px); }
          }
        `}</style>
        <div className="relative max-w-5xl mx-auto text-center px-4 py-24">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 text-white/90 text-sm font-medium px-5 py-2 rounded-full mb-8" style={{ animation: "heroFadeUp 0.8s ease-out forwards", opacity: 0 }}>
            <span>🚀</span>
            <span>店舗集客の新常識</span>
          </div>
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold leading-tight tracking-tight" style={{ animation: "heroScale 1s ease-out 0.3s forwards", opacity: 0 }}>
            <span style={{ backgroundImage: "linear-gradient(90deg, #22d3ee, #a78bfa, #d946ef, #22d3ee)", backgroundSize: "200% auto", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", animation: "shimmer 4s linear infinite" }}>
              口コミが、
            </span>
            <br />
            <span style={{ backgroundImage: "linear-gradient(90deg, #22d3ee, #a78bfa, #d946ef, #22d3ee)", backgroundSize: "200% auto", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", animation: "shimmer 4s linear infinite 0.5s" }}>
              勝手に増える。
            </span>
          </h1>
          <p className="mt-6 sm:mt-8 text-base sm:text-lg md:text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed px-2" style={{ animation: "heroFadeUp 0.8s ease-out 0.6s forwards", opacity: 0 }}>
            たった3分のアンケートで、
            <br className="sm:hidden" />
            AIが高品質な口コミを自動生成。
            <br />
            Googleマップの評価を劇的に改善します。
          </p>
          <div className="mt-8 sm:mt-12 flex flex-col sm:flex-row items-center justify-center gap-4" style={{ animation: "heroFadeUp 0.8s ease-out 0.9s forwards", opacity: 0 }}>
            <button
              onClick={() => scrollTo("contact")}
              className="bg-gradient-to-r from-cyan-500 to-violet-500 text-white font-bold px-8 sm:px-10 py-4 sm:py-5 rounded-full text-base sm:text-lg shadow-2xl shadow-cyan-500/30 hover:shadow-cyan-500/50 hover:scale-105 transition-all"
              style={{ animation: "heroPulse 3s ease-in-out infinite 1.5s" }}
            >
              お問い合わせはこちら
            </button>
          </div>
          <p className="mt-5 text-sm text-gray-400">
            初期費用0円・最短即日導入
          </p>
        </div>
        {/* Bottom fade to white */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent" />
      </section>

      {/* ───────── Problem ───────── */}
      <Section className="relative py-16 sm:py-24 md:py-32 bg-white overflow-hidden">
        <BgBlob className="w-[500px] h-[500px] bg-red-300 -top-60 -right-60" />
        <BgBlob className="w-[400px] h-[400px] bg-orange-300 bottom-0 -left-40" />
        <div className="relative max-w-6xl mx-auto px-4">
          <h2 className="text-2xl sm:text-3xl md:text-5xl font-extrabold text-center mb-10 sm:mb-16 px-2">
            その悩み、
            <br className="sm:hidden" />
            <span className="bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
              ComiSta
            </span>
            が終わらせます。
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
                className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-red-100 text-center hover:shadow-xl hover:-translate-y-1 transition-all"
              >
                <div className="text-5xl mb-4">{item.icon}</div>
                <h3 className="font-bold text-lg mb-2 text-gray-900">
                  {item.title}
                </h3>
                <p className="text-gray-500 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* ───────── Solution ───────── */}
      <Section className="relative py-16 sm:py-24 md:py-32 overflow-hidden bg-gradient-to-br from-indigo-50 via-white to-violet-50">
        <BgBlob className="w-[500px] h-[500px] bg-cyan-300 top-20 -left-60" />
        <BgBlob className="w-[400px] h-[400px] bg-violet-300 -bottom-40 -right-40" />
        {/* Dot grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "radial-gradient(circle, #6366f1 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />
        <div className="relative max-w-5xl mx-auto px-4">
          <h2 className="text-2xl sm:text-3xl md:text-5xl font-extrabold text-center mb-4 px-2">
            仕組みはシンプル。
            <br className="sm:hidden" />
            <span className="bg-gradient-to-r from-cyan-500 to-violet-500 bg-clip-text text-transparent">
              効果は絶大。
            </span>
          </h2>
          <p className="text-center text-gray-500 mb-10 sm:mb-16 text-base sm:text-lg">
            3ステップで口コミを簡単収集
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                num: "01",
                icon: "📱",
                title: "アンケートに回答",
                desc: "QRコードを読み取って簡単なアンケートに回答",
                gradient: "from-cyan-500 to-blue-500",
              },
              {
                num: "02",
                icon: "🤖",
                title: "AIが口コミを自動生成",
                desc: "回答内容をもとにAIが自然な口コミ文章を作成",
                gradient: "from-violet-500 to-purple-500",
              },
              {
                num: "03",
                icon: "📍",
                title: "Googleマップに投稿",
                desc: "ワンタップでGoogleマップに口コミを投稿",
                gradient: "from-fuchsia-500 to-pink-500",
              },
            ].map((step) => (
              <div
                key={step.num}
                className="text-center bg-white/60 backdrop-blur-sm rounded-3xl p-8 border border-white/60 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all"
              >
                <div className={`inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br ${step.gradient} text-4xl mb-5 shadow-lg`}>
                  {step.icon}
                </div>
                <div className={`text-5xl font-black bg-gradient-to-r ${step.gradient} bg-clip-text text-transparent mb-3`}>
                  {step.num}
                </div>
                <h3 className="font-bold text-xl mb-2">{step.title}</h3>
                <p className="text-gray-500 text-sm">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* ───────── Features ───────── */}
      <Section id="features" className="relative py-16 sm:py-24 md:py-32 overflow-hidden bg-gradient-to-br from-gray-950 via-indigo-950 to-violet-950">
        <BgBlob className="w-[600px] h-[600px] bg-cyan-500 -top-40 -right-60 opacity-15" />
        <BgBlob className="w-[500px] h-[500px] bg-violet-500 bottom-0 -left-40 opacity-15" />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "radial-gradient(circle, white 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />
        <div className="relative max-w-6xl mx-auto px-4">
          <h2 className="text-2xl sm:text-3xl md:text-5xl font-extrabold text-center mb-10 sm:mb-16 px-2">
            <span className="bg-gradient-to-r from-cyan-400 via-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
              選ばれ続ける、6つの理由
            </span>
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: "✨",
                title: "AIによる自然な文章生成",
                desc: "実際のお客様の声に基づいた自然な口コミを自動生成",
                gradient: "from-cyan-500 to-blue-500",
              },
              {
                icon: "💬",
                title: "チャット形式のアンケート",
                desc: "LINEのようなUIで回答率90%以上",
                gradient: "from-violet-500 to-purple-500",
              },
              {
                icon: "📷",
                title: "QRコードで簡単導入",
                desc: "お客様はQRコードを読み取るだけ。アプリ不要",
                gradient: "from-fuchsia-500 to-pink-500",
              },
              {
                icon: "📊",
                title: "リアルタイム分析",
                desc: "回答データをリアルタイムで分析。改善点が一目瞭然",
                gradient: "from-amber-500 to-orange-500",
              },
              {
                icon: "🎨",
                title: "カスタマイズ自由",
                desc: "ロゴ、カラー、質問内容を自由にカスタマイズ",
                gradient: "from-emerald-500 to-teal-500",
              },
              {
                icon: "🏪",
                title: "複数業種対応",
                desc: "飲食店、美容室、整骨院、バー、エステ、ラウンジなど幅広く対応",
                gradient: "from-rose-500 to-red-500",
              },
            ].map((f) => (
              <div
                key={f.title}
                className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:bg-white/10 hover:-translate-y-1 transition-all group"
              >
                <div className={`inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br ${f.gradient} text-2xl mb-4 shadow-lg`}>
                  {f.icon}
                </div>
                <h3 className="font-bold text-lg mb-2 text-white">
                  {f.title}
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* ───────── Target Industries ───────── */}
      <Section className="relative py-16 sm:py-24 md:py-32 bg-white overflow-hidden">
        <BgBlob className="w-[500px] h-[500px] bg-cyan-200 top-0 -right-60" />
        <BgBlob className="w-[400px] h-[400px] bg-violet-200 -bottom-40 left-0" />
        <div className="relative max-w-5xl mx-auto px-4">
          <h2 className="text-2xl sm:text-3xl md:text-5xl font-extrabold text-center mb-10 sm:mb-16 px-2">
            あらゆる店舗ビジネスに、
            <br className="sm:hidden" />
            <span className="bg-gradient-to-r from-cyan-500 to-violet-500 bg-clip-text text-transparent">
              すぐ導入。
            </span>
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
                className="flex items-center gap-3 bg-white/70 backdrop-blur-sm rounded-2xl p-5 border border-gray-200 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all"
              >
                <span className="text-3xl">{ind.icon}</span>
                <span className="font-bold text-sm">{ind.label}</span>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* ───────── Pricing ───────── */}
      <Section id="pricing" className="relative py-16 sm:py-24 md:py-32 overflow-hidden bg-gradient-to-br from-indigo-50 via-white to-violet-50">
        <BgBlob className="w-[600px] h-[600px] bg-cyan-300 -top-60 -left-60" />
        <BgBlob className="w-[500px] h-[500px] bg-violet-300 bottom-0 -right-60" />
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage:
              "radial-gradient(circle, #6366f1 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />
        <div className="relative max-w-6xl mx-auto px-4">
          <h2 className="text-2xl sm:text-3xl md:text-5xl font-extrabold text-center mb-3 px-2">
            始めやすい、
            <span className="bg-gradient-to-r from-cyan-500 to-violet-500 bg-clip-text text-transparent">
              続けやすい。
            </span>
          </h2>
          <p className="text-center text-gray-500 mb-10 sm:mb-16 text-base sm:text-lg">
            全プラン初期費用0円
          </p>
          <div className="grid md:grid-cols-3 gap-6 items-start">
            {[
              {
                name: "ライトプラン",
                price: "6,000",
                limit: "月20件",
                target: "小規模店舗",
                popular: false,
                features: [
                  "AIによる口コミ自動生成",
                  "チャット形式アンケート",
                  "QRコード発行",
                ],
              },
              {
                name: "スタンダードプラン",
                price: "10,000",
                limit: "月50件",
                target: "中規模店舗",
                popular: true,
                features: [
                  "AIによる口コミ自動生成",
                  "チャット形式アンケート",
                  "QRコード発行",
                  "リアルタイム分析",
                  "メール通知",
                  "カスタマーサポート",
                ],
              },
              {
                name: "プレミアムプラン",
                price: "20,000",
                limit: "無制限",
                target: "大規模・複数店舗",
                popular: false,
                features: [
                  "AIによる口コミ自動生成",
                  "チャット形式アンケート",
                  "QRコード発行",
                  "リアルタイム分析",
                  "AI分析レポート",
                  "CSVデータエクスポート",
                  "カスタムプロンプト",
                  "メール通知",
                  "口コミ生成 無制限",
                ],
              },
            ].map((plan) => (
              <div
                key={plan.name}
                className={`relative bg-white/70 backdrop-blur-sm rounded-3xl p-8 border transition-all hover:-translate-y-1 ${
                  plan.popular
                    ? "border-transparent shadow-2xl shadow-violet-500/25 ring-2 ring-violet-400 md:scale-[1.06] animate-[popularPulse_4s_ease-in-out_infinite]"
                    : "border-gray-200 shadow-lg hover:shadow-xl"
                }`}
              >
                {plan.popular && (
                  <>
                    {/* Animated glow effect */}
                    <div className="absolute -inset-[3px] rounded-3xl bg-gradient-to-r from-cyan-500 via-violet-500 to-fuchsia-500 opacity-25 blur-lg -z-10 animate-[glowPulse_3s_ease-in-out_infinite]" />
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-cyan-500 to-violet-500 text-white text-xs font-bold px-5 py-1.5 rounded-full shadow-lg animate-[badgeBounce_2s_ease-in-out_infinite]">
                      🏆 人気No.1
                    </div>
                  </>
                )}
                <h3 className="font-bold text-lg mb-1">{plan.name}</h3>
                <p className="text-xs text-gray-500 mb-4">{plan.target}</p>
                <div className="mb-6">
                  <span className="text-4xl sm:text-5xl font-black bg-gradient-to-r from-cyan-500 to-violet-500 bg-clip-text text-transparent">
                    ¥{plan.price}
                  </span>
                  <span className="text-gray-500 text-sm">/月</span>
                </div>
                <p className="text-sm text-cyan-600 font-semibold mb-6">
                  {plan.limit}
                </p>
                <ul className="space-y-3 text-sm text-gray-600">
                  {plan.features.map((feat) => (
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
                  className={`mt-8 w-full py-3.5 rounded-full font-semibold transition-all ${
                    plan.popular
                      ? "bg-gradient-to-r from-cyan-500 to-violet-500 text-white shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 hover:scale-105"
                      : "border border-gray-300 text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  お問い合わせ
                </button>
              </div>
            ))}
          </div>
          {/* Lifetime Licenses */}
          <h3 className="text-xl sm:text-2xl font-extrabold text-center mt-16 mb-3 px-2">
            永年ライセンス
            <span className="text-base sm:text-lg font-medium text-gray-500 ml-2">（買い切り）</span>
          </h3>
          <p className="text-center text-sm text-gray-500 mb-8">月額不要・一括払いでずっと使える</p>
          <div className="grid md:grid-cols-3 gap-6 items-start">
            {[
              { name: "ライト", price: "90,000", limit: "月20件", features: ["AIによる口コミ自動生成", "チャット形式アンケート", "QRコード発行"] },
              { name: "スタンダード", price: "150,000", limit: "月50件", features: ["AIによる口コミ自動生成", "チャット形式アンケート", "QRコード発行", "リアルタイム分析", "メール通知", "カスタマーサポート"] },
              { name: "プレミアム", price: "250,000", limit: "無制限", features: ["AIによる口コミ自動生成", "チャット形式アンケート", "QRコード発行", "リアルタイム分析", "AI分析レポート", "CSVデータエクスポート", "カスタムプロンプト", "メール通知", "口コミ生成 無制限"] },
            ].map((plan) => (
              <div key={plan.name} className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 border border-amber-200 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all">
                <h3 className="font-bold text-lg mb-1">{plan.name}</h3>
                <div className="mb-6">
                  <span className="text-3xl sm:text-4xl font-black bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">¥{plan.price}</span>
                  <span className="text-gray-500 text-sm ml-1">一括</span>
                </div>
                <p className="text-sm text-amber-600 font-semibold mb-6">{plan.limit}</p>
                <ul className="space-y-2.5 text-sm text-gray-600">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-amber-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {f}
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => scrollTo("contact")}
                  className="mt-8 w-full py-3.5 rounded-full font-semibold border border-amber-400 text-amber-700 hover:bg-amber-50 transition-all"
                >
                  お問い合わせ
                </button>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* ───────── Flow ───────── */}
      <Section id="flow" className="relative py-16 sm:py-24 md:py-32 bg-white overflow-hidden">
        <BgBlob className="w-[500px] h-[500px] bg-cyan-200 -top-40 left-1/3" />
        <BgBlob className="w-[400px] h-[400px] bg-violet-200 -bottom-40 right-1/4" />
        <div className="relative max-w-5xl mx-auto px-4">
          <h2 className="text-2xl sm:text-3xl md:text-5xl font-extrabold text-center mb-10 sm:mb-16 px-2">
            最短即日、
            <span className="bg-gradient-to-r from-cyan-500 to-violet-500 bg-clip-text text-transparent">
              かんたん4ステップ
            </span>
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
                  <div className="hidden md:block absolute top-8 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-cyan-300 to-violet-300" />
                )}
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-cyan-500 to-violet-500 text-white font-black text-2xl mb-4 relative z-10 shadow-lg shadow-violet-500/25">
                  {s.num}
                </div>
                <h3 className="font-bold text-lg mb-2">{s.title}</h3>
                <p className="text-gray-500 text-sm">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* ───────── FAQ ───────── */}
      <Section id="faq" className="relative py-16 sm:py-24 md:py-32 overflow-hidden bg-gradient-to-br from-indigo-50 via-white to-violet-50">
        <BgBlob className="w-[500px] h-[500px] bg-cyan-200 -top-60 -left-40" />
        <BgBlob className="w-[400px] h-[400px] bg-violet-200 bottom-0 -right-40" />
        <div className="relative max-w-3xl mx-auto px-4">
          <h2 className="text-2xl sm:text-3xl md:text-5xl font-extrabold text-center mb-10 sm:mb-16 px-2">
            気になるギモン、
            <br className="sm:hidden" />
            <span className="bg-gradient-to-r from-cyan-500 to-violet-500 bg-clip-text text-transparent">
              すべて解消。
            </span>
          </h2>
          <div className="space-y-4">
            <FaqItem
              q="初期費用はかかりますか？"
              a="いいえ、初期費用は一切かかりません。月額プランのみでご利用いただけます。"
            />
            <FaqItem
              q="契約期間の縛りはありますか？"
              a="最低6ヶ月からのご契約となります。詳しくはお問い合わせください。"
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
      <Section id="contact" className="relative py-16 sm:py-24 md:py-32 overflow-hidden">
        {/* Dark gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-950 via-indigo-950 to-violet-950" />
        <BgBlob className="w-[600px] h-[600px] bg-cyan-500 -top-60 -left-40 opacity-25" />
        <BgBlob className="w-[500px] h-[500px] bg-fuchsia-500 -bottom-40 -right-40 opacity-20" />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "radial-gradient(circle, white 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />
        <div className="relative max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-2xl sm:text-3xl md:text-5xl font-extrabold mb-4 px-2">
            <span className="bg-gradient-to-r from-cyan-400 via-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
              今日から、
              <br className="sm:hidden" />
              口コミで差をつけよう。
            </span>
          </h2>
          <p className="text-gray-300 mb-6 text-base sm:text-lg px-2">
            お問い合わせは1分で完了。
            <br className="sm:hidden" />
            お気軽にご連絡ください。
          </p>
          {/* Urgency badge */}
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500/20 to-red-500/20 border border-orange-400/30 text-orange-300 font-bold text-sm px-5 py-2.5 rounded-full mb-10">
            <span>🔥</span>
            <span>今なら初月50%OFF キャンペーン実施中</span>
          </div>
          <div className="block">
            <a
              href="/contact"
              className="inline-block bg-gradient-to-r from-cyan-500 to-violet-500 text-white font-bold px-8 sm:px-12 py-4 sm:py-5 rounded-full text-base sm:text-lg shadow-2xl shadow-cyan-500/30 hover:shadow-cyan-500/50 hover:scale-105 transition-all"
            >
              お問い合わせ
            </a>
          </div>
          <p className="mt-8 text-sm text-gray-400">
            お問い合わせフォームよりお気軽にご連絡ください
          </p>
        </div>
      </Section>

      {/* ───────── Footer ───────── */}
      <footer className="bg-gray-950 text-gray-400 py-12 border-t border-white/5">
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

      {/* ───────── Back to Top ───────── */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className={`fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full bg-gradient-to-r from-cyan-500 to-violet-500 text-white shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-110 ${showTop ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"}`}
        aria-label="トップへ戻る"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 15l7-7 7 7" />
        </svg>
      </button>
    </div>
  );
}
