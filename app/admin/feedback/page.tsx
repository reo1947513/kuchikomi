"use client";

import { useState, useEffect } from "react";
import { useToast, Toast } from "@/components/Toast";

type ChoiceStat = { question: string; type: "choice"; data: { name: string; value: number }[] };
type TextStat = { question: string; type: "text"; texts: string[] };
type Stat = ChoiceStat | TextStat;

type FeedbackData = {
  survey: { id: string; title: string } | null;
  totalResponses: number;
  stats: Stat[];
};

const COLORS = ["#06B6D4", "#8B5CF6", "#F59E0B", "#EF4444", "#10B981"];

export default function FeedbackPage() {
  const [data, setData] = useState<FeedbackData | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast, showToast } = useToast();

  useEffect(() => {
    fetch("/api/admin/feedback")
      .then((r) => r.json())
      .then(setData)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="text-center py-12 text-gray-400 text-sm">読み込み中...</div>;

  if (!data?.survey) {
    return (
      <div className="space-y-6">
        <h1 className="text-xl md:text-2xl font-bold text-gray-900">フィードバック</h1>
        <div className="bg-white rounded-xl shadow-sm p-8 text-center text-gray-400 text-sm">
          <p>フィードバックアンケートがまだ作成されていません</p>
          <p className="text-xs mt-2">Supabaseでフィードバック用SQLを実行してください</p>
        </div>
      </div>
    );
  }

  const surveyUrl = typeof window !== "undefined"
    ? `${window.location.origin}/survey/feedback-survey`
    : "/survey/feedback-survey";

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-gray-900">フィードバック</h1>
          <p className="text-sm text-gray-500 mt-1">ComiStaへのユーザーフィードバック結果</p>
        </div>
        <button
          onClick={() => { navigator.clipboard.writeText(surveyUrl); showToast("アンケートURLをコピーしました", "success"); }}
          className="flex items-center gap-2 px-4 py-2 border border-violet-400 text-violet-600 font-semibold rounded-xl hover:bg-violet-50 transition-colors text-sm"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
          </svg>
          アンケートURLをコピー
        </button>
      </div>

      {/* Summary */}
      <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6">
        <p className="text-sm text-gray-700">総回答数: <span className="text-2xl font-bold text-violet-600">{data.totalResponses}</span>件</p>
      </div>

      {/* Stats */}
      {data.stats.map((stat, i) => (
        <div key={i} className="bg-white rounded-xl shadow-sm p-4 sm:p-6">
          <h3 className="text-sm font-semibold text-gray-800 mb-4">{stat.question}</h3>
          {stat.type === "choice" ? (
            <div className="space-y-2">
              {(stat as ChoiceStat).data.map((d, j) => {
                const total = (stat as ChoiceStat).data.reduce((s, x) => s + x.value, 0);
                const pct = total > 0 ? Math.round((d.value / total) * 100) : 0;
                return (
                  <div key={d.name} className="flex items-center gap-3">
                    <span className="text-xs text-gray-600 w-32 sm:w-40 truncate">{d.name}</span>
                    <div className="flex-1 h-6 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{ width: `${pct}%`, backgroundColor: COLORS[j % COLORS.length] }}
                      />
                    </div>
                    <span className="text-xs font-medium text-gray-500 w-16 text-right">{d.value}件 ({pct}%)</span>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {(stat as TextStat).texts.length === 0 ? (
                <p className="text-sm text-gray-400">回答なし</p>
              ) : (
                (stat as TextStat).texts.map((t, j) => (
                  <div key={j} className="bg-gray-50 rounded-lg p-3 text-sm text-gray-700">{t}</div>
                ))
              )}
            </div>
          )}
        </div>
      ))}
      <Toast toast={toast} />
    </div>
  );
}
