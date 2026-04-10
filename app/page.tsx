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
        className="w-full flex items-center justify-between px-6 py-5 text-left font-semibold text-gray-800 hover:bg-white/40 transition-colors"
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
  const ja: Record<string, string> = {
    "nav.features": "特徴",
    "nav.pricing": "料金",
    "nav.flow": "導入の流れ",
    "nav.faq": "FAQ",
    "nav.contact": "お問い合わせ",
    "hero.badge": "店舗集客の新常識",
    "hero.title1": "口コミが、",
    "hero.title2": "勝手に増える。",
    "hero.desc1": "たった3分のアンケートで、",
    "hero.desc2": "AIが高品質な口コミを自動生成。",
    "hero.desc3": "Googleマップの評価を劇的に改善します。",
    "hero.cta": "お問い合わせはこちら",
    "hero.sub": "初期費用0円・最短即日導入",
    "problem.title1": "その悩み、",
    "problem.title2": "が終わらせます。",
    "problem.1.title": "口コミを書いてもらえない",
    "problem.1.desc": "お客様に口コミをお願いするのが気まずい",
    "problem.2.title": "Googleマップの評価が低い",
    "problem.2.desc": "競合に比べて星の数が少ない",
    "problem.3.title": "口コミ対策に時間がかかる",
    "problem.3.desc": "忙しくて口コミ管理まで手が回らない",
    "problem.4.title": "何を書けばいいかわからない",
    "problem.4.desc": "お客様が口コミの書き方に困っている",
    "solution.title1": "仕組みはシンプル。",
    "solution.title2": "効果は絶大。",
    "solution.desc": "3ステップで口コミを簡単収集",
    "solution.1.title": "アンケートに回答",
    "solution.1.desc": "QRコードを読み取って簡単なアンケートに回答",
    "solution.2.title": "AIが口コミを自動生成",
    "solution.2.desc": "回答内容をもとにAIが自然な口コミ文章を作成",
    "solution.3.title": "Googleマップに投稿",
    "solution.3.desc": "ワンタップでGoogleマップに口コミを投稿",
    "features.title": "選ばれ続ける、6つの理由",
    "features.1.title": "AIによる自然な文章生成",
    "features.1.desc": "実際のお客様の声に基づいた自然な口コミを自動生成",
    "features.2.title": "チャット形式のアンケート",
    "features.2.desc": "LINEのようなUIで回答率90%以上",
    "features.3.title": "QRコードで簡単導入",
    "features.3.desc": "お客様はQRコードを読み取るだけ。アプリ不要",
    "features.4.title": "リアルタイム分析",
    "features.4.desc": "回答データをリアルタイムで分析。改善点が一目瞭然",
    "features.5.title": "カスタマイズ自由",
    "features.5.desc": "ロゴ、カラー、質問内容を自由にカスタマイズ",
    "features.6.title": "複数業種対応",
    "features.6.desc": "飲食店、美容室、整骨院、バー、エステ、ラウンジなど幅広く対応",
    "industries.title1": "あらゆる店舗ビジネスに、",
    "industries.title2": "すぐ導入。",
    "industries.restaurant": "飲食店・レストラン",
    "industries.salon": "美容室・ヘアサロン",
    "industries.clinic": "整骨院・整体院",
    "industries.spa": "エステサロン",
    "industries.bar": "バー",
    "industries.lounge": "ラウンジ・スナック",
    "pricing.title1": "始めやすい、",
    "pricing.title2": "続けやすい。",
    "pricing.desc": "全プラン初期費用0円",
    "pricing.perMonth": "/月",
    "pricing.popular": "🏆 人気No.1",
    "pricing.contact": "お問い合わせ",
    "pricing.standard": "スタンダードプラン",
    "pricing.premium": "プレミアムプラン",
    "pricing.standard.limit": "月100件",
    "pricing.premium.limit": "無制限",
    "pricing.standard.target": "中規模店舗",
    "pricing.premium.target": "大規模・複数店舗",
    "pricing.feat.ai": "AIによる口コミ下書き作成",
    "pricing.feat.chat": "チャット形式アンケート",
    "pricing.feat.qr": "QRコード発行",
    "pricing.feat.analytics": "リアルタイム分析",
    "pricing.feat.support": "カスタマーサポート",
    "flow.title1": "最短即日、",
    "flow.title2": "かんたん4ステップ",
    "flow.1.title": "お問い合わせ",
    "flow.1.desc": "まずはお気軽にご相談ください",
    "flow.2.title": "アカウント発行",
    "flow.2.desc": "最短即日でご利用開始",
    "flow.3.title": "アンケート設定",
    "flow.3.desc": "質問内容やデザインをカスタマイズ",
    "flow.4.title": "運用開始",
    "flow.4.desc": "QRコードを設置して口コミ収集スタート",
    "faq.title1": "気になるギモン、",
    "faq.title2": "すべて解消。",
    "faq.1.q": "初期費用はかかりますか？",
    "faq.1.a": "いいえ、初期費用は一切かかりません。月額プランのみでご利用いただけます。",
    "faq.2.q": "契約期間の縛りはありますか？",
    "faq.2.a": "最低6ヶ月からのご契約となります。詳しくはお問い合わせください。",
    "faq.3.q": "どんな業種でも使えますか？",
    "faq.3.a": "飲食店、美容室、整骨院、エステ、バー、ラウンジ、スナックなど、店舗型ビジネスであれば業種を問わずご利用いただけます。",
    "faq.4.q": "導入にどれくらい時間がかかりますか？",
    "faq.4.a": "最短即日で導入可能です。アカウント発行後すぐにご利用いただけます。",
    "faq.5.q": "お客様にアプリをインストールしてもらう必要がありますか？",
    "faq.5.a": "いいえ、アプリのインストールは不要です。QRコードを読み取るだけでブラウザ上でアンケートに回答できます。",
    "faq.6.q": "生成された口コミは編集できますか？",
    "faq.6.a": "はい、AIが生成した文章はお客様が自由に編集してから投稿できます。",
    "cta.title1": "今日から、口コミで差をつけよう。",
    "cta.title2": "",
    "cta.desc1": "お問い合わせは1分で完了。",
    "cta.desc2": "お気軽にご連絡ください。",
    "cta.contact": "お問い合わせ",
    "cta.sub": "お問い合わせフォームよりお気軽にご連絡ください",
    "footer.login": "ログイン",
  };
  const t = (key: string) => ja[key] ?? key;
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
    { label: t("nav.features"), id: "features" },
    { label: t("nav.pricing"), id: "pricing" },
    { label: t("nav.flow"), id: "flow" },
    { label: t("nav.faq"), id: "faq" },
  ];

  return (
    <div className="min-h-screen bg-gray-950 text-gray-900 overflow-x-hidden">
      {/* ───────── Header ───────── */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-3">
          <Image src="/logo.png" alt="ComiSta" width={160} height={48} />

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
              className="bg-gradient-to-r from-cyan-500 to-violet-500 text-white text-sm font-semibold px-5 py-2.5 rounded-full hover:opacity-90 transition-opacity shadow-lg shadow-cyan-500/25"
            >
              {t("nav.contact")}
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
              {t("nav.contact")}
            </button>
          </div>
        )}
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
        `}</style>
        <div className="relative max-w-5xl mx-auto text-center px-4 py-24">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 text-white/90 text-sm font-medium px-5 py-2 rounded-full mb-8" style={{ animation: "heroFadeUp 0.8s ease-out forwards", opacity: 0 }}>
            <span>🚀</span>
            <span>{t("hero.badge")}</span>
          </div>
          <h1 className="text-4xl md:text-6xl lg:text-8xl font-extrabold leading-tight tracking-tight" style={{ animation: "heroScale 1s ease-out 0.3s forwards", opacity: 0 }}>
            <span style={{ backgroundImage: "linear-gradient(90deg, #22d3ee, #a78bfa, #d946ef, #22d3ee)", backgroundSize: "200% auto", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", animation: "shimmer 4s linear infinite" }}>
              {t("hero.title1")}
            </span>
            <br />
            <span style={{ backgroundImage: "linear-gradient(90deg, #22d3ee, #a78bfa, #d946ef, #22d3ee)", backgroundSize: "200% auto", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", animation: "shimmer 4s linear infinite 0.5s" }}>
              {t("hero.title2")}
            </span>
          </h1>
          <p className="mt-8 text-lg md:text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed" style={{ animation: "heroFadeUp 0.8s ease-out 0.6s forwards", opacity: 0 }}>
            {t("hero.desc1")}{t("hero.desc2")}
            <br className="hidden md:block" />
            {t("hero.desc3")}
          </p>
          <div className="mt-12 flex flex-col items-center justify-center gap-4" style={{ animation: "heroFadeUp 0.8s ease-out 0.9s forwards", opacity: 0 }}>
            <a
              href="/contact"
              className="inline-block bg-gradient-to-r from-cyan-500 to-violet-500 text-white font-bold px-10 py-5 rounded-full text-lg shadow-2xl shadow-cyan-500/30 hover:shadow-cyan-500/50 hover:scale-105 transition-all"
              style={{ animation: "heroPulse 3s ease-in-out infinite 1.5s" }}
            >
              まずは資料を無料ダウンロード
            </a>
            <button
              onClick={() => scrollTo("flow")}
              className="text-gray-400 hover:text-white text-sm underline underline-offset-4 transition-colors"
            >
              デモの流れを見る
            </button>
          </div>
          <p className="mt-5 text-sm text-gray-400">
            {t("hero.sub")}
          </p>
        </div>
        {/* Bottom fade to white */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent" />
      </section>

      {/* ───────── Problem ───────── */}
      <Section className="relative py-24 md:py-32 bg-white overflow-hidden">
        <BgBlob className="w-[500px] h-[500px] bg-red-300 -top-60 -right-60" />
        <BgBlob className="w-[400px] h-[400px] bg-orange-300 bottom-0 -left-40" />
        <div className="relative max-w-6xl mx-auto px-4">
          <h2 className="text-3xl md:text-5xl font-extrabold text-center mb-16">
            {t("problem.title1")}
            <span className="bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
              ComiSta
            </span>
            {t("problem.title2")}
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: "😔",
                title: t("problem.1.title"),
                desc: t("problem.1.desc"),
              },
              {
                icon: "⭐",
                title: t("problem.2.title"),
                desc: t("problem.2.desc"),
              },
              {
                icon: "⏰",
                title: t("problem.3.title"),
                desc: t("problem.3.desc"),
              },
              {
                icon: "❓",
                title: t("problem.4.title"),
                desc: t("problem.4.desc"),
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
      <Section className="relative py-24 md:py-32 overflow-hidden bg-gradient-to-br from-indigo-50 via-white to-violet-50">
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
          <h2 className="text-3xl md:text-5xl font-extrabold text-center mb-4">
            {t("solution.title1")}
            <br className="md:hidden" />
            <span className="bg-gradient-to-r from-cyan-500 to-violet-500 bg-clip-text text-transparent">
              {t("solution.title2")}
            </span>
          </h2>
          <p className="text-center text-gray-500 mb-16 text-lg">
            {t("solution.desc")}
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                num: "01",
                icon: "📱",
                title: t("solution.1.title"),
                desc: t("solution.1.desc"),
                gradient: "from-cyan-500 to-blue-500",
              },
              {
                num: "02",
                icon: "🤖",
                title: t("solution.2.title"),
                desc: t("solution.2.desc"),
                gradient: "from-violet-500 to-purple-500",
              },
              {
                num: "03",
                icon: "📍",
                title: t("solution.3.title"),
                desc: t("solution.3.desc"),
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
                {step.num === "03" && (
                  <p className="text-gray-400 text-xs mt-3 leading-relaxed">
                    ※AIが生成した文章はお客様ご自身が確認・編集・投稿します。Googleのガイドラインに準拠した運用をサポートします。
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* ───────── Case Studies ───────── */}
      <Section className="relative py-24 md:py-32 bg-white overflow-hidden">
        <BgBlob className="w-[500px] h-[500px] bg-cyan-200 -top-40 -right-60" />
        <BgBlob className="w-[400px] h-[400px] bg-violet-200 -bottom-40 -left-40" />
        <div className="relative max-w-5xl mx-auto px-4">
          <h2 className="text-3xl md:text-5xl font-extrabold text-center mb-16">
            <span className="bg-gradient-to-r from-cyan-500 to-violet-500 bg-clip-text text-transparent">
              導入店舗の声
            </span>
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                type: "飲食店（神奈川県）",
                rating: "★3.2→★4.1",
                period: "導入3ヶ月",
                count: "+42件",
                quote: "「お願いするのが気まずかったのが嘘みたい。QR置くだけで勝手に増えました」",
              },
              {
                type: "美容室（東京都）",
                rating: "★3.6→★4.4",
                period: "導入2ヶ月",
                count: "+28件",
                quote: "「スタッフが何もしなくてもお客様が自然に投稿してくれる」",
              },
              {
                type: "整骨院（大阪府）",
                rating: "★3.8→★4.6",
                period: "導入4ヶ月",
                count: "+61件",
                quote: "「Googleマップ経由の新患が明らかに増えた」",
              },
            ].map((cs) => (
              <div
                key={cs.type}
                className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 border border-gray-200 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all"
              >
                <p className="font-bold text-lg text-gray-800 mb-3">{cs.type}</p>
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-2xl font-black bg-gradient-to-r from-cyan-500 to-violet-500 bg-clip-text text-transparent">
                    {cs.rating}
                  </span>
                </div>
                <div className="flex items-center gap-4 mb-4 text-sm text-gray-500">
                  <span>{cs.period}</span>
                  <span className="font-semibold text-cyan-600">{cs.count}</span>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed italic">
                  {cs.quote}
                </p>
              </div>
            ))}
          </div>
          <p className="text-center text-xs text-gray-400 mt-6">※店舗名は非公開</p>
        </div>
      </Section>

      {/* ───────── Features ───────── */}
      <Section id="features" className="relative py-24 md:py-32 overflow-hidden bg-gradient-to-br from-gray-950 via-indigo-950 to-violet-950">
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
          <h2 className="text-3xl md:text-5xl font-extrabold text-center mb-16">
            <span className="bg-gradient-to-r from-cyan-400 via-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
              {t("features.title")}
            </span>
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: "✨",
                title: t("features.1.title"),
                desc: t("features.1.desc"),
                gradient: "from-cyan-500 to-blue-500",
              },
              {
                icon: "💬",
                title: t("features.2.title"),
                desc: t("features.2.desc"),
                gradient: "from-violet-500 to-purple-500",
              },
              {
                icon: "📷",
                title: t("features.3.title"),
                desc: t("features.3.desc"),
                gradient: "from-fuchsia-500 to-pink-500",
              },
              {
                icon: "📊",
                title: t("features.4.title"),
                desc: t("features.4.desc"),
                gradient: "from-amber-500 to-orange-500",
              },
              {
                icon: "🎨",
                title: t("features.5.title"),
                desc: t("features.5.desc"),
                gradient: "from-emerald-500 to-teal-500",
              },
              {
                icon: "🏪",
                title: t("features.6.title"),
                desc: t("features.6.desc"),
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
                {f.desc.includes("90%") && (
                  <p className="text-gray-500 text-xs mt-2">※導入店舗の平均値（2025年自社調べ）</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* ───────── Target Industries ───────── */}
      <Section className="relative py-24 md:py-32 bg-white overflow-hidden">
        <BgBlob className="w-[500px] h-[500px] bg-cyan-200 top-0 -right-60" />
        <BgBlob className="w-[400px] h-[400px] bg-violet-200 -bottom-40 left-0" />
        <div className="relative max-w-5xl mx-auto px-4">
          <h2 className="text-3xl md:text-5xl font-extrabold text-center mb-16">
            {t("industries.title1")}
            <br className="md:hidden" />
            <span className="bg-gradient-to-r from-cyan-500 to-violet-500 bg-clip-text text-transparent">
              {t("industries.title2")}
            </span>
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {[
              { icon: "🍽️", label: t("industries.restaurant") },
              { icon: "💇", label: t("industries.salon") },
              { icon: "💆", label: t("industries.clinic") },
              { icon: "✨", label: t("industries.spa") },
              { icon: "🍸", label: t("industries.bar") },
              { icon: "🌙", label: t("industries.lounge") },
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
      <Section id="pricing" className="relative py-24 md:py-32 overflow-hidden bg-gradient-to-br from-indigo-50 via-white to-violet-50">
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
          <h2 className="text-3xl md:text-5xl font-extrabold text-center mb-3">
            {t("pricing.title1")}
            <span className="bg-gradient-to-r from-cyan-500 to-violet-500 bg-clip-text text-transparent">
              {t("pricing.title2")}
            </span>
          </h2>
          <p className="text-center text-gray-500 mb-16 text-lg">
            {t("pricing.desc")}
          </p>

          {/* ── 店舗向けプラン ── */}
          <h3 className="text-lg font-bold text-gray-800 mb-6 text-center">店舗向けプラン</h3>
          <div className="grid md:grid-cols-2 gap-6 items-start max-w-4xl mx-auto">
            {([
              {
                name: "スタンダードプラン",
                price: "10,000",
                limit: "月100件",
                target: "個人店舗・中規模店舗",
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
            ] as { name: string; price: string; limit: string; target: string; popular: boolean; features: string[] }[]).map((plan) => (
              <div
                key={plan.name}
                className={`relative bg-white/70 backdrop-blur-sm rounded-3xl p-8 border transition-all hover:-translate-y-1 ${
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
                  <span className="text-gray-500 text-sm">/月</span>
                </div>
                <p className="text-sm text-cyan-600 font-semibold mb-6">{plan.limit}</p>
                <ul className="space-y-3 text-sm text-gray-600">
                  {plan.features.map((feat) => (
                    <li key={feat} className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-cyan-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {feat}
                    </li>
                  ))}
                </ul>
                <button onClick={() => scrollTo("contact")} className={`mt-8 w-full py-3.5 rounded-full font-semibold transition-all ${plan.popular ? "bg-gradient-to-r from-cyan-500 to-violet-500 text-white shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 hover:scale-105" : "border border-gray-300 text-gray-700 hover:bg-gray-50"}`}>
                  お問い合わせ
                </button>
              </div>
            ))}
          </div>

          {/* ── チェーン・複数店舗パック ── */}
          <h3 className="text-lg font-bold text-gray-800 mt-20 mb-6 text-center">チェーン・複数店舗パック</h3>
          <div className="grid sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {([
              { name: "3店舗パック", price: "80,000", save: "¥10,000お得", target: "小規模チェーン", features: ["プレミアム機能 × 3店舗", "店舗横断ダッシュボード", "一括管理・レポート"] },
              { name: "5店舗パック", price: "130,000", save: "¥20,000お得", target: "中規模チェーン", features: ["プレミアム機能 × 5店舗", "店舗横断ダッシュボード", "一括管理・レポート", "専任サポート"] },
            ] as { name: string; price: string; save: string; target: string; features: string[] }[]).map((plan) => (
              <div key={plan.name} className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 border border-gray-200 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-bold text-lg">{plan.name}</h3>
                  <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">{plan.save}</span>
                </div>
                <p className="text-xs text-gray-500 mb-4">{plan.target}</p>
                <div className="mb-6">
                  <span className="text-4xl font-black bg-gradient-to-r from-cyan-500 to-violet-500 bg-clip-text text-transparent">¥{plan.price}</span>
                  <span className="text-gray-500 text-sm">/月</span>
                </div>
                <ul className="space-y-2 text-sm text-gray-600">
                  {plan.features.map((feat) => (
                    <li key={feat} className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-cyan-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                      {feat}
                    </li>
                  ))}
                </ul>
                <button onClick={() => scrollTo("contact")} className="mt-6 w-full py-3 rounded-full font-semibold border border-gray-300 text-gray-700 hover:bg-gray-50 transition-all">お問い合わせ</button>
              </div>
            ))}
          </div>

          {/* ── エージェンシー・代理店プラン ── */}
          <h3 className="text-lg font-bold text-gray-800 mt-20 mb-6 text-center">エージェンシー・代理店プラン</h3>
          <div className="grid sm:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {([
              { name: "5店舗プラン", price: "40,000", target: "小規模代理店", features: ["5店舗一括管理", "ホワイトラベル対応", "代理店ダッシュボード", "メール＆LINE通知"] },
              { name: "10店舗プラン", price: "70,000", target: "中規模代理店", popular: true, features: ["10店舗一括管理", "ホワイトラベル対応", "専用ダッシュボード", "全分析機能", "優先サポート"] },
              { name: "30店舗〜", price: null, target: "大規模代理店", features: ["30店舗以上の一括管理", "ホワイトラベル対応", "API連携", "専任アカウントマネージャー", "カスタム開発対応"] },
            ] as { name: string; price: string | null; target: string; popular?: boolean; features: string[] }[]).map((plan) => (
              <div key={plan.name} className={`relative bg-white/70 backdrop-blur-sm rounded-3xl p-7 border transition-all hover:-translate-y-1 ${plan.popular ? "border-transparent shadow-2xl ring-2 ring-violet-400" : "border-gray-200 shadow-lg hover:shadow-xl"}`}>
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white text-xs font-bold px-4 py-1 rounded-full shadow-lg">おすすめ</div>
                )}
                <h3 className="font-bold text-lg mb-1">{plan.name}</h3>
                <p className="text-xs text-gray-500 mb-4">{plan.target}</p>
                <div className="mb-6">
                  {plan.price ? (
                    <>
                      <span className="text-4xl font-black bg-gradient-to-r from-cyan-500 to-violet-500 bg-clip-text text-transparent">¥{plan.price}</span>
                      <span className="text-gray-500 text-sm">/月</span>
                    </>
                  ) : (
                    <span className="text-3xl font-black bg-gradient-to-r from-cyan-500 to-violet-500 bg-clip-text text-transparent">要見積</span>
                  )}
                </div>
                <ul className="space-y-2 text-sm text-gray-600">
                  {plan.features.map((feat) => (
                    <li key={feat} className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-cyan-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                      {feat}
                    </li>
                  ))}
                </ul>
                <button onClick={() => scrollTo("contact")} className={`mt-6 w-full py-3 rounded-full font-semibold transition-all ${plan.popular ? "bg-gradient-to-r from-cyan-500 to-violet-500 text-white shadow-lg hover:scale-105" : "border border-gray-300 text-gray-700 hover:bg-gray-50"}`}>
                  お問い合わせ
                </button>
              </div>
            ))}
          </div>

          {/* ── オプション ── */}
          <div className="mt-20 max-w-4xl mx-auto">
            <h3 className="text-lg font-bold text-gray-800 mb-6 text-center">オプションサービス</h3>
            <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 border border-gray-200 shadow-lg">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="font-bold text-base text-gray-800">Google口コミ管理代行</h4>
                    <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">月額アドオン</span>
                  </div>
                  <p className="text-sm text-gray-500 mb-2">Googleビジネスプロフィールの口コミ返信・管理を代行します。</p>
                  <ul className="space-y-1 text-sm text-gray-600">
                    <li className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-cyan-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                      口コミへの返信代行
                    </li>
                    <li className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-cyan-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                      ネガティブレビュー対応
                    </li>
                    <li className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-cyan-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                      月次レポート提出
                    </li>
                  </ul>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm text-gray-400 mb-1">料金</p>
                  <p className="text-2xl font-black bg-gradient-to-r from-cyan-500 to-violet-500 bg-clip-text text-transparent">要相談</p>
                  <button onClick={() => scrollTo("contact")} className="mt-3 px-6 py-2 rounded-full text-sm font-semibold border border-gray-300 text-gray-700 hover:bg-gray-50 transition-all">お問い合わせ</button>
                </div>
              </div>
            </div>

            {/* Initial setup option */}
            <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 border border-gray-200 shadow-lg mt-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="font-bold text-base text-gray-800">初期セットアップ代行</h4>
                    <span className="text-xs font-bold text-violet-600 bg-violet-50 px-2 py-0.5 rounded-full">初回オプション</span>
                  </div>
                  <p className="text-sm text-gray-500 mb-2">セルフ導入は0円。プロに任せたい方向けの代行プランです。</p>
                  <ul className="space-y-1 text-sm text-gray-600">
                    <li className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-cyan-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                      アンケート設計・質問内容カスタマイズ
                    </li>
                    <li className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-cyan-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                      QRコード作成・設置アドバイス
                    </li>
                    <li className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-cyan-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                      スタッフ向け運用マニュアル・説明サポート
                    </li>
                  </ul>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm text-gray-400 mb-1">料金</p>
                  <p className="text-2xl font-black bg-gradient-to-r from-cyan-500 to-violet-500 bg-clip-text text-transparent">¥15,000〜</p>
                  <p className="text-xs text-gray-400 mt-1">内容に応じてお見積り</p>
                  <button onClick={() => scrollTo("contact")} className="mt-3 px-6 py-2 rounded-full text-sm font-semibold border border-gray-300 text-gray-700 hover:bg-gray-50 transition-all">お問い合わせ</button>
                </div>
              </div>
            </div>
          </div>

          <p className="text-center text-sm text-gray-400 mt-10">セルフ導入は初期費用0円・最低契約期間6ヶ月</p>
        </div>
      </Section>

      {/* ───────── Flow ───────── */}
      <Section id="flow" className="relative py-24 md:py-32 bg-white overflow-hidden">
        <BgBlob className="w-[500px] h-[500px] bg-cyan-200 -top-40 left-1/3" />
        <BgBlob className="w-[400px] h-[400px] bg-violet-200 -bottom-40 right-1/4" />
        <div className="relative max-w-5xl mx-auto px-4">
          <h2 className="text-3xl md:text-5xl font-extrabold text-center mb-16">
            {t("flow.title1")}
            <span className="bg-gradient-to-r from-cyan-500 to-violet-500 bg-clip-text text-transparent">
              {t("flow.title2")}
            </span>
          </h2>
          <div className="grid md:grid-cols-4 gap-8">
            {[
              {
                num: "1",
                title: t("flow.1.title"),
                desc: t("flow.1.desc"),
              },
              {
                num: "2",
                title: t("flow.2.title"),
                desc: t("flow.2.desc"),
              },
              {
                num: "3",
                title: t("flow.3.title"),
                desc: t("flow.3.desc"),
              },
              {
                num: "4",
                title: t("flow.4.title"),
                desc: t("flow.4.desc"),
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
      <Section id="faq" className="relative py-24 md:py-32 overflow-hidden bg-gradient-to-br from-indigo-50 via-white to-violet-50">
        <BgBlob className="w-[500px] h-[500px] bg-cyan-200 -top-60 -left-40" />
        <BgBlob className="w-[400px] h-[400px] bg-violet-200 bottom-0 -right-40" />
        <div className="relative max-w-3xl mx-auto px-4">
          <h2 className="text-3xl md:text-5xl font-extrabold text-center mb-16">
            {t("faq.title1")}
            <br className="md:hidden" />
            <span className="bg-gradient-to-r from-cyan-500 to-violet-500 bg-clip-text text-transparent">
              {t("faq.title2")}
            </span>
          </h2>
          <div className="space-y-4">
            <FaqItem
              q={t("faq.1.q")}
              a={t("faq.1.a")}
            />
            <FaqItem
              q={t("faq.2.q")}
              a={t("faq.2.a")}
            />
            <FaqItem
              q={t("faq.3.q")}
              a={t("faq.3.a")}
            />
            <FaqItem
              q={t("faq.4.q")}
              a={t("faq.4.a")}
            />
            <FaqItem
              q={t("faq.5.q")}
              a={t("faq.5.a")}
            />
            <FaqItem
              q={t("faq.6.q")}
              a={t("faq.6.a")}
            />
          </div>
        </div>
      </Section>

      {/* ───────── Evolving Service ───────── */}
      <Section className="relative py-20 md:py-28 bg-white overflow-hidden">
        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 bg-violet-100 text-violet-700 text-xs font-bold px-4 py-1.5 rounded-full mb-6">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            常に進化するサービス
          </div>
          <h2 className="text-2xl md:text-4xl font-extrabold mb-4">
            ComiStaは
            <span className="bg-gradient-to-r from-cyan-500 to-violet-500 bg-clip-text text-transparent">アップデートし続けます</span>
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto mb-10 text-sm md:text-base leading-relaxed">
            お客様のご要望や最新の技術トレンドを取り入れ、便利な新機能を定期的に追加しています。<br className="hidden md:block" />
            月額料金内で、追加費用なくすべてのアップデートをご利用いただけます。
          </p>
          <div className="grid sm:grid-cols-3 gap-4 text-left">
            <div className="bg-gradient-to-br from-cyan-50 to-white rounded-2xl p-5 border border-cyan-100">
              <div className="w-10 h-10 rounded-xl bg-cyan-100 flex items-center justify-center mb-3">
                <svg className="w-5 h-5 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <h3 className="font-bold text-sm text-gray-800 mb-1">新機能を定期追加</h3>
              <p className="text-xs text-gray-500">分析機能の強化、テンプレート追加、UI改善など、毎月アップデートを実施しています。</p>
            </div>
            <div className="bg-gradient-to-br from-violet-50 to-white rounded-2xl p-5 border border-violet-100">
              <div className="w-10 h-10 rounded-xl bg-violet-100 flex items-center justify-center mb-3">
                <svg className="w-5 h-5 text-violet-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="font-bold text-sm text-gray-800 mb-1">お客様の声を反映</h3>
              <p className="text-xs text-gray-500">導入店舗様からのフィードバックをもとに、本当に必要な機能を優先して開発しています。</p>
            </div>
            <div className="bg-gradient-to-br from-fuchsia-50 to-white rounded-2xl p-5 border border-fuchsia-100">
              <div className="w-10 h-10 rounded-xl bg-fuchsia-100 flex items-center justify-center mb-3">
                <svg className="w-5 h-5 text-fuchsia-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-bold text-sm text-gray-800 mb-1">追加費用ゼロ</h3>
              <p className="text-xs text-gray-500">すべてのアップデートは月額料金に含まれています。追加の開発費や更新費用は一切かかりません。</p>
            </div>
          </div>
        </div>
      </Section>

      {/* ───────── CTA / Contact ───────── */}
      <Section id="contact" className="relative py-24 md:py-32 overflow-hidden">
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
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold mb-4">
            <span className="bg-gradient-to-r from-cyan-400 via-violet-400 to-fuchsia-400 bg-clip-text text-transparent whitespace-nowrap">
              {t("cta.title1")}
            </span>
          </h2>
          <p className="text-gray-300 mb-4 text-lg">
            {t("cta.desc1")}{t("cta.desc2")}
          </p>
          <div className="inline-block bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl px-6 py-3 mb-8">
            <p className="text-white font-bold text-base">今なら初月50%OFF キャンペーン実施中</p>
            <p className="text-gray-300 text-xs mt-1">〜2026年5月末まで・先着20店舗限定</p>
          </div>
          <div className="flex flex-col items-center gap-4">
            <a
              href="/contact"
              className="inline-block bg-gradient-to-r from-cyan-500 to-violet-500 text-white font-bold px-12 py-5 rounded-full text-lg shadow-2xl shadow-cyan-500/30 hover:shadow-cyan-500/50 hover:scale-105 transition-all"
            >
              無料で導入相談する
            </a>
            <button
              onClick={() => scrollTo("pricing")}
              className="text-gray-400 hover:text-white text-sm underline underline-offset-4 transition-colors"
            >
              料金プランを見る
            </button>
          </div>
          <p className="mt-8 text-sm text-gray-400">
            {t("cta.sub")}
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
                {t("footer.login")}
              </a>
            </nav>
          </div>
          <div className="mt-8 border-t border-gray-800 pt-6 flex flex-col items-center gap-3 text-xs">
            <nav className="flex flex-wrap justify-center gap-4">
              <a href="/legal/terms" className="hover:text-white transition-colors">利用規約</a>
              <a href="/legal/privacy" className="hover:text-white transition-colors">プライバシーポリシー</a>
              <a href="/legal/tokushoho" className="hover:text-white transition-colors">特定商取引法に基づく表記</a>
            </nav>
            <p className="text-gray-400">運営：RRL</p>
            <p>&copy; 2026 ComiSta. All Rights Reserved.</p>
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
