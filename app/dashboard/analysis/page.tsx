"use client";

import { useState, useEffect } from "react";
import { PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

const COLORS = ["#06B6D4", "#8B5CF6", "#F59E0B", "#EF4444", "#10B981", "#EC4899", "#6366F1", "#14B8A6"];

type ChartItem = { question: string; data: { name: string; value: number }[] };
type MonthlySession = { month: string; count: number };
type AnalysisData = {
  totalSessions: number;
  chartData: ChartItem[];
  monthlySessions: MonthlySession[];
};

const LOCKED_PLANS = [null, "light", "lifetime_light"];

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

  if (planLoaded && LOCKED_PLANS.includes(planType)) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-lg sm:text-2xl font-bold text-gray-900">アンケート分析</h1>
        </div>
        <div className="relative bg-white rounded-xl shadow-sm p-8 sm:p-12 text-center overflow-hidden">
          <div className="absolute inset-0 bg-gray-100/80 backdrop-blur-[2px]" />
          <div className="relative z-10 flex flex-col items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h2 className="text-lg font-bold text-gray-700">分析機能はスタンダードプラン以上でご利用いただけます</h2>
            <p className="text-sm text-gray-500 max-w-md">リアルタイム分析、月別回答数の推移、質問ごとの回答分布グラフ、AI分析レポートなどの機能をご利用いただけます。</p>
            <a
              href="/dashboard/billing"
              className="mt-2 inline-block px-6 py-3 bg-gradient-to-r from-cyan-500 to-violet-500 hover:from-cyan-600 hover:to-violet-600 text-white font-bold text-sm rounded-xl shadow transition-colors"
            >
              プランをアップグレード
            </a>
          </div>
        </div>
      </div>
    );
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
      <div>
        <h1 className="text-lg sm:text-2xl font-bold text-gray-900">アンケート分析</h1>
        <p className="text-sm text-gray-500 mt-1">回答データに基づくグラフとAI分析レポート</p>
      </div>

      {/* Summary */}
      <div className="bg-white rounded-xl shadow-sm p-3 sm:p-5">
        <p className="text-sm text-gray-700">総回答数: <span className="text-lg font-bold text-violet-600">{data.totalSessions}</span>件</p>
      </div>

      {/* Monthly bar chart */}
      <div className="bg-white rounded-xl shadow-sm p-3 sm:p-5">
        <h2 className="text-sm font-semibold text-gray-800 mb-4">月別回答数</h2>
        <div className="h-48 sm:h-64 overflow-x-auto" style={{ minWidth: 0, minHeight: 0 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data.monthlySessions}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" fontSize={12} />
              <YAxis allowDecimals={false} fontSize={12} />
              <Tooltip />
              <Line type="monotone" dataKey="count" name="回答数" stroke="#8B5CF6" strokeWidth={2} dot={{ fill: "#8B5CF6", r: 4 }} activeDot={{ r: 6 }} />
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
            <div className="h-48 sm:h-64" style={{ minWidth: 0, minHeight: 0 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={item.data.filter((d) => d.value > 0)}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={90}
                    paddingAngle={2}
                    dataKey="value"
                    label={({ name, percent }: any) => `${name} ${(percent * 100).toFixed(0)}%`}
                    labelLine={false}
                    fontSize={11}
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
            <p className="text-xs text-gray-400 mt-0.5">月1回のみ実行可能です</p>
          </div>
          <button
            onClick={runAnalysis}
            disabled={analyzing}
            className="w-full sm:w-auto px-4 py-2 bg-gradient-to-r from-cyan-500 to-violet-500 hover:from-cyan-600 hover:to-violet-600 text-white text-sm font-semibold rounded-xl shadow transition-colors disabled:opacity-60"
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
