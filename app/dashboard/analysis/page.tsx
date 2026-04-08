"use client";

import { useState, useEffect } from "react";
import { useToast, Toast } from "@/components/Toast";
import { PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

const COLORS = ["#06B6D4", "#8B5CF6", "#F59E0B", "#EF4444", "#10B981", "#EC4899", "#6366F1", "#14B8A6"];

type ChartItem = { question: string; data: { name: string; value: number }[] };
type MonthlyItem = { month: string; access: number; completed: number; googleClick: number };
type AnalysisData = {
  totalSessions: number;
  chartData: ChartItem[];
  monthlyData: MonthlyItem[];
};

const LOCKED_PLANS = [null, "light", "lifetime_light"];
const PREMIUM_PLANS = ["premium", "lifetime_premium"];

export default function AnalysisPage() {
  const [data, setData] = useState<AnalysisData | null>(null);
  const [loading, setLoading] = useState(true);
  const [analysisText, setAnalysisText] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const [planType, setPlanType] = useState<string | null>(null);
  const [planLoaded, setPlanLoaded] = useState(false);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((d) => setPlanType(d.planType ?? null))
      .catch(() => {})
      .finally(() => setPlanLoaded(true));

    fetch("/api/dashboard/analysis")
      .then((r) => r.json())
      .then((d) => setData(d))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const runAnalysis = async () => {
    setAnalyzing(true);
    setAnalysisError(null);
    try {
      const res = await fetch("/api/dashboard/analysis", { method: "POST" });
      const d = await res.json();
      if (!res.ok) throw new Error(d.error ?? "分析に失敗しました");
      setAnalysisText(d.analysisText);
    } catch (e) {
      setAnalysisError(e instanceof Error ? e.message : "エラー");
    } finally {
      setAnalyzing(false);
    }
  };

  const isPremium = PREMIUM_PLANS.includes(planType ?? "");

  if (planLoaded && LOCKED_PLANS.includes(planType)) {
    return <LockedAnalysis />;
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-4 border-violet-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!data || !data.chartData) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-8 text-center text-gray-400 text-sm">
        分析に必要なデータがありません
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg sm:text-2xl font-bold text-gray-900">アンケート分析</h1>
          <p className="text-sm text-gray-500 mt-1">回答データに基づくグラフとAI分析レポート</p>
        </div>
        <AnalysisCsvButton />
      </div>

      {/* Summary */}
      <div className="bg-white rounded-xl shadow-sm p-3 sm:p-5">
        <p className="text-sm text-gray-700">総回答数: <span className="text-lg font-bold text-violet-600">{data.totalSessions}</span>件</p>
      </div>

      {/* Monthly trend chart */}
      <div className="bg-white rounded-xl shadow-sm p-3 sm:p-5">
        <h2 className="text-sm font-semibold text-gray-800 mb-1">月別推移</h2>
        <p className="text-xs text-gray-400 mb-4">アクセス数・回答完了数・口コミ投稿数の推移</p>
        <div className="h-56 sm:h-72" style={{ minWidth: 0, minHeight: 0 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data.monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" fontSize={11} />
              <YAxis allowDecimals={false} fontSize={11} />
              <Tooltip />
              <Legend fontSize={12} />
              <Line type="monotone" dataKey="access" name="アクセス数" stroke="#06B6D4" strokeWidth={2} dot={{ fill: "#06B6D4", r: 3 }} activeDot={{ r: 5 }} />
              <Line type="monotone" dataKey="completed" name="回答完了数" stroke="#8B5CF6" strokeWidth={2} dot={{ fill: "#8B5CF6", r: 3 }} activeDot={{ r: 5 }} />
              <Line type="monotone" dataKey="googleClick" name="口コミ投稿数" stroke="#10B981" strokeWidth={2} dot={{ fill: "#10B981", r: 3 }} activeDot={{ r: 5 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Pie charts for each question */}
      {data.chartData.map((item, idx) => (
        <div key={idx} className="bg-white rounded-xl shadow-sm p-3 sm:p-5">
          <h2 className="text-sm font-semibold text-gray-800 mb-4">{item.question}</h2>
          {item.data.every((d) => d.value === 0) ? (
            <p className="text-sm text-gray-400 text-center py-8">回答データがありません</p>
          ) : (
            <div className="h-64 sm:h-72" style={{ minWidth: 0, minHeight: 0 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
                  <Pie
                    data={item.data.filter((d) => d.value > 0)}
                    cx="50%"
                    cy="45%"
                    innerRadius="30%"
                    outerRadius="50%"
                    paddingAngle={2}
                    dataKey="value"
                    label={({ name, percent }: any) => `${name} ${(percent * 100).toFixed(0)}%`}
                    labelLine={false}
                    fontSize={10}
                  >
                    {item.data.filter((d) => d.value > 0).map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      ))}

      {/* AI Analysis */}
      <div className="bg-white rounded-xl shadow-sm p-3 sm:p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-sm font-semibold text-gray-800">AI分析レポート</h2>
            <p className="text-xs text-gray-400 mt-0.5">
              {isPremium ? "月1回のみ実行可能です" : "プレミアムプラン限定機能です"}
            </p>
          </div>
          <button
            onClick={runAnalysis}
            disabled={analyzing || !isPremium}
            className={`w-full sm:w-auto px-4 py-2 text-sm font-semibold rounded-xl shadow transition-colors disabled:opacity-60 ${isPremium ? "bg-gradient-to-r from-cyan-500 to-violet-500 hover:from-cyan-600 hover:to-violet-600 text-white" : "bg-gray-200 text-gray-500 cursor-not-allowed"}`}
          >
            {analyzing ? "分析中..." : "AI分析を実行"}
          </button>
        </div>
        {analysisError && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">{analysisError}</div>
        )}
        {analysisText && (
          <div className="p-4 bg-violet-50 border border-violet-200 rounded-xl">
            <p className="text-sm text-gray-800 whitespace-pre-wrap leading-relaxed">{analysisText}</p>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── CSV Export Button for Analysis ─── */
function AnalysisCsvButton() {
  const [pt, setPt] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast, showToast } = useToast();

  useEffect(() => {
    fetch("/api/auth/me").then((r) => r.json()).then((d) => setPt(d.planType ?? null)).catch(() => {});
  }, []);

  const isPremium = pt === "premium" || pt === "lifetime_premium";

  const handleExport = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/dashboard/export");
      if (!res.ok) {
        const d = await res.json();
        showToast(d.error || "エクスポートに失敗しました", "error");
        return;
      }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `kuchikomi-export-${new Date().toISOString().slice(0, 10)}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      showToast("エクスポートに失敗しました", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleExport}
      disabled={!isPremium || loading}
      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors disabled:opacity-40 disabled:cursor-not-allowed border-gray-300 text-gray-600 hover:bg-gray-50"
      title={isPremium ? undefined : "プレミアムプランでご利用いただけます"}
    >
      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
      {loading ? "出力中..." : "CSV出力"}
    </button>
  );
}

/* ─── Locked state for free / light plan ─── */
function LockedAnalysis() {
  const [showPreview, setShowPreview] = useState(false);

  const features = [
    {
      icon: "📈",
      title: "月別回答数の推移",
      desc: "月ごとの回答数をグラフで可視化。繁忙期やキャンペーンの効果を一目で把握できます。",
    },
    {
      icon: "📊",
      title: "質問ごとの回答分布",
      desc: "各質問の回答をパイチャートで表示。お客様の傾向をデータで確認できます。",
    },
    {
      icon: "🤖",
      title: "AI分析レポート",
      desc: "蓄積されたアンケートデータをAIが分析し、改善提案を含むレポートを自動生成します。（プレミアムプラン）",
    },
    {
      icon: "🔢",
      title: "総回答数・統計",
      desc: "アンケートの総回答数やトレンドを一画面でまとめて確認できます。",
    },
  ];

  return (
    <div className="space-y-6">
      <style>{`
        @keyframes lockFadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes lockPulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        @keyframes lockIconFloat {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }
        @keyframes modalSlideUp {
          from { opacity: 0; transform: translateY(40px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes featureSlideIn {
          from { opacity: 0; transform: translateX(-20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes overlayFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes shimmerBtn {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
      `}</style>
      <div>
        <h1 className="text-lg sm:text-2xl font-bold text-gray-900">アンケート分析</h1>
      </div>
      <div className="relative bg-white rounded-xl shadow-sm p-8 sm:p-12 text-center overflow-hidden" style={{ animation: "lockFadeIn 0.6s ease-out" }}>
        <div className="absolute inset-0 bg-gray-100/80 backdrop-blur-[2px]" />
        <div className="relative z-10 flex flex-col items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center" style={{ animation: "lockIconFloat 3s ease-in-out infinite" }}>
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h2 className="text-lg font-bold text-gray-700" style={{ animation: "lockFadeIn 0.6s ease-out 0.2s both" }}>分析機能はスタンダードプラン以上でご利用いただけます</h2>
          <p className="text-sm text-gray-500 max-w-md" style={{ animation: "lockFadeIn 0.6s ease-out 0.4s both" }}>アンケートの回答データを可視化し、店舗改善に役立つインサイトを得られます。</p>
          <div className="flex flex-col sm:flex-row gap-3 mt-2" style={{ animation: "lockFadeIn 0.6s ease-out 0.6s both" }}>
            <button
              onClick={() => setShowPreview(true)}
              className="px-5 py-2.5 border-2 border-violet-400 text-violet-600 font-bold text-sm rounded-xl hover:bg-violet-50 transition-all hover:scale-105"
              style={{ animation: "lockPulse 2s ease-in-out infinite 1s" }}
            >
              どんな分析ができる？
            </button>
            <a
              href="/dashboard/billing"
              className="px-6 py-2.5 text-white font-bold text-sm rounded-xl shadow premium-shimmer-btn premium-pulse hover:scale-105 transition-transform"
            >
              プランをアップグレード
            </a>
          </div>
        </div>
      </div>

      {/* Preview modal */}
      {showPreview && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4" style={{ animation: "overlayFadeIn 0.2s ease-out" }} onClick={() => setShowPreview(false)}>
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto" style={{ animation: "modalSlideUp 0.4s ease-out" }} onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 bg-gradient-to-r from-cyan-500 to-violet-500 rounded-t-2xl px-5 py-4 flex items-center justify-between">
              <span className="text-white font-bold">スタンダード以上で使える分析機能</span>
              <button onClick={() => setShowPreview(false)} className="text-white/80 hover:text-white">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <div className="p-5 space-y-4">
              {features.map((f, i) => (
                <div key={f.title} className="flex gap-4 p-4 bg-gray-50 rounded-xl hover:bg-violet-50 transition-colors" style={{ animation: `featureSlideIn 0.4s ease-out ${i * 0.1}s both` }}>
                  <span className="text-3xl shrink-0">{f.icon}</span>
                  <div>
                    <h3 className="font-bold text-sm text-gray-800 mb-1">{f.title}</h3>
                    <p className="text-xs text-gray-500 leading-relaxed">{f.desc}</p>
                  </div>
                </div>
              ))}
              <a
                href="/dashboard/billing"
                className="block w-full text-center px-6 py-3 text-white font-bold text-sm rounded-xl shadow premium-shimmer-btn premium-pulse"
              >
                プランをアップグレード
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
