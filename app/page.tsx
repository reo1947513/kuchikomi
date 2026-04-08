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
    "cta.title1": "今日から、",
    "cta.title2": "口コミで差をつけよう。",
    "cta.desc1": "お問い合わせは1分で完了。",
    "cta.desc2": "お気軽にご連絡ください。",
    "cta.campaign": "今なら初月50%OFF キャンペーン実施中",
    "cta.contact": "お問い合わせ",
    "cta.sub": "お問い合わせフォームよりお気軽にご連絡ください",
    "footer.login": "ログイン",
  };
  const t = (key: string) => ja[key] ?? key;
  const [menuOpen, setMenuOpen] = useState(false);
  const [showTop, setShowTop] = useState(false);
  const [announcements, setAnnouncements] = useState<{ id: string; title: string; content: string; category: string; publishedAt: string }[]>([]);

  useEffect(() => {
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";
    window.scrollTo(0, 0);
    const onScroll = () => setShowTop(window.scrollY > 400);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    fetch("/api/announcements")
      .then((r) => r.json())
      .then((data) => { if (Array.isArray(data)) setAnnouncements(data.slice(0, 5)); })
      .catch(() => {});
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
          <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4" style={{ animation: "heroFadeUp 0.8s ease-out 0.9s forwards", opacity: 0 }}>
            <button
              onClick={() => scrollTo("contact")}
              className="bg-gradient-to-r from-cyan-500 to-violet-500 text-white font-bold px-10 py-5 rounded-full text-lg shadow-2xl shadow-cyan-500/30 hover:shadow-cyan-500/50 hover:scale-105 transition-all"
              style={{ animation: "heroPulse 3s ease-in-out infinite 1.5s" }}
            >
              {t("hero.cta")}
            </button>
          </div>
          <p className="mt-5 text-sm text-gray-400">
            {t("hero.sub")}
          </p>
        </div>
        {/* Bottom fade to white */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent" />
      </section>

      {/* ───────── Announcements ───────── */}
      <section className="bg-white py-10">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-violet-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
            </svg>
            お知らせ
          </h2>
          {announcements.length > 0 ? (
            <div className="space-y-3">
              {announcements.map((a) => {
                const catColor = a.category === "新機能" ? "bg-cyan-100 text-cyan-700" : a.category === "重要" ? "bg-red-100 text-red-700" : a.category === "メンテナンス" ? "bg-amber-100 text-amber-700" : "bg-gray-100 text-gray-600";
                return (
                  <div key={a.id} className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl border border-gray-100">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium shrink-0 mt-0.5 ${catColor}`}>
                      {a.category}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-semibold text-gray-800">{a.title}</span>
                        <span className="text-xs text-gray-400">{new Date(a.publishedAt).toLocaleDateString("ja-JP")}</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1 line-clamp-2">{a.content}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-sm text-gray-400 text-center py-4">現在お知らせはありません</p>
          )}
        </div>
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
              </div>
            ))}
          </div>
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
          <div className="grid md:grid-cols-2 gap-6 items-start max-w-4xl mx-auto">
            {[
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
            ].map((plan) => (
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
                    {/* Glow effect */}
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
                  {t("pricing.contact")}
                </button>
              </div>
            ))}
          </div>
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
          <h2 className="text-3xl md:text-5xl font-extrabold mb-4">
            <span className="bg-gradient-to-r from-cyan-400 via-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
              {t("cta.title1")}{t("cta.title2")}
            </span>
          </h2>
          <p className="text-gray-300 mb-6 text-lg">
            {t("cta.desc1")}{t("cta.desc2")}
          </p>
          {/* Urgency badge */}
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500/20 to-red-500/20 border border-orange-400/30 text-orange-300 font-bold text-sm px-5 py-2.5 rounded-full mb-10">
            <span>🔥</span>
            <span>{t("cta.campaign")}</span>
          </div>
          <div className="block">
            <a
              href="/contact"
              className="inline-block bg-gradient-to-r from-cyan-500 to-violet-500 text-white font-bold px-12 py-5 rounded-full text-lg shadow-2xl shadow-cyan-500/30 hover:shadow-cyan-500/50 hover:scale-105 transition-all"
            >
              {t("cta.contact")}
            </a>
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
