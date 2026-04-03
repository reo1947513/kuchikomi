"use client";

import { useState, useEffect } from "react";

// ---- Types ----
type Choice = { id: string; text: string; order: number };
type Question = { id: string; text: string; type: "choice" | "text"; order: number; isRandom: boolean; choices: Choice[] };
type Survey = {
  id: string; title: string; monthlyReviewLimit: number; monthlyReviewCount: number;
  questions: Question[];
};
type Session = { id: string; reviewText: string | null; createdAt: string };
type MonthlyCount = { label: string; count: number };
type AdviceItem = { id: string; content: string; dateFrom: string | null; dateTo: string | null; createdAt: string };
type DashboardData = {
  user: { shopName: string | null; name: string } | null;
  survey: Survey | null;
  monthlyCounts: MonthlyCount[];
  recentSessions: Session[];
  adviceCount: number;
  adviceList: AdviceItem[];
};

const ADVICE_LIMIT = 5;
function ContractBanner() {
  const [days, setDays] = useState<number | null>(null);
  useEffect(() => {
    fetch("/api/auth/me").then(r => r.json()).then(d => {
      if (d.noContractLimit || !d.contractEnd) return;
      const end = new Date(d.contractEnd);
      const now = new Date();
      const diff = Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      setDays(diff);
    }).catch(() => {});
  }, []);
  if (days === null) return null;
  const color = days <= 7 ? "bg-red-50 border-red-200 text-red-700" : days <= 30 ? "bg-yellow-50 border-yellow-200 text-yellow-700" : "bg-blue-50 border-blue-200 text-blue-700";
  return (
    <div className={`rounded-xl border p-4 mb-6 flex items-center gap-3 ${color}`}>
      <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
      <div>
        <p className="text-sm font-medium">{days > 0 ? `ご契約の残り日数: ${days}日` : "ご契約期間が終了しました"}</p>
        {days <= 7 && days > 0 && <p className="text-xs mt-0.5">契約更新についてはお問い合わせください</p>}
      </div>
    </div>
  );
}


// ---- Circular Progress ----
function CircularProgress({ limit, count }: { limit: number; count: number }) {
  const remaining = Math.max(0, limit - count);
  const progress = limit > 0 ? count / limit : 0;
  const r = 60;
  const circ = 2 * Math.PI * r;
  const offset = circ * (1 - progress);
  const color = remaining === 0 ? "#ef4444" : remaining < limit * 0.2 ? "#f59e0b" : "#22c55e";

  const now = new Date();
  const nextReset = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  const resetLabel = `${nextReset.getFullYear()}年${String(nextReset.getMonth() + 1).padStart(2, "0")}月${String(nextReset.getDate()).padStart(2, "0")}日`;

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 flex flex-col items-center gap-3">
      <p className="text-sm font-semibold text-gray-700">今月の残りレビュー生成回数</p>
      <svg width={160} height={160} viewBox="0 0 160 160">
        <circle cx={80} cy={80} r={r} fill="none" stroke="#e5e7eb" strokeWidth={12} />
        <circle
          cx={80} cy={80} r={r} fill="none"
          stroke={color} strokeWidth={12}
          strokeDasharray={circ} strokeDashoffset={offset}
          strokeLinecap="round"
          transform="rotate(-90 80 80)"
          style={{ transition: "stroke-dashoffset 0.6s ease" }}
        />
        <text x={80} y={74} textAnchor="middle" fontSize={13} fill="#6b7280">あと</text>
        <text x={80} y={100} textAnchor="middle" fontSize={28} fontWeight="bold" fill="#111827">{remaining}</text>
        <text x={80} y={118} textAnchor="middle" fontSize={13} fill="#6b7280">回</text>
      </svg>
      <p className="text-xs text-gray-400">次回更新日: {resetLabel}</p>
    </div>
  );
}

// ---- Monthly Line Chart ----
function LineChart({ data }: { data: MonthlyCount[] }) {
  const W = 700; const H = 180; const padL = 40; const padB = 30; const padT = 16; const padR = 16;
  const chartW = W - padL - padR;
  const chartH = H - padT - padB;
  const maxVal = Math.max(...data.map((d) => d.count), 1);
  const yMax = Math.ceil(maxVal / Math.pow(10, Math.floor(Math.log10(maxVal || 1)))) * Math.pow(10, Math.floor(Math.log10(maxVal || 1)));
  const safeY = yMax > 0 ? yMax : 4;
  const n = data.length;
  const px = (i: number) => padL + (n <= 1 ? chartW / 2 : (i / (n - 1)) * chartW);
  const py = (v: number) => padT + chartH - (v / safeY) * chartH;
  const yTicks = [0, Math.round(safeY / 4), Math.round(safeY / 2), Math.round((safeY * 3) / 4), safeY];
  const polyline = data.map((d, i) => `${px(i)},${py(d.count)}`).join(" ");

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6">
      <h3 className="text-sm font-bold text-gray-800 mb-4 flex items-center gap-2">
        <svg className="w-4 h-4 text-violet-500" fill="currentColor" viewBox="0 0 20 20">
          <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zm6-4a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zm6-3a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
        </svg>
        月毎の回答件数
      </h3>
      <div className="w-full overflow-x-auto">
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ minWidth: 320 }}>
          {yTicks.map((t) => (
            <g key={t}>
              <line x1={padL} y1={py(t)} x2={W - padR} y2={py(t)} stroke="#e5e7eb" strokeWidth={0.8} strokeDasharray="4 3" />
              <text x={padL - 6} y={py(t) + 4} textAnchor="end" fontSize={10} fill="#9ca3af">{t}</text>
            </g>
          ))}
          {data.map((d, i) => (
            <text key={i} x={px(i)} y={H - 4} textAnchor="middle" fontSize={10} fill="#9ca3af">{d.label}</text>
          ))}
          <polyline points={polyline} fill="none" stroke="#2563eb" strokeWidth={2} strokeLinejoin="round" />
          {data.map((d, i) => (
            <circle key={i} cx={px(i)} cy={py(d.count)} r={3.5} fill="#2563eb" stroke="white" strokeWidth={1.5} />
          ))}
        </svg>
      </div>
    </div>
  );
}

// ---- AI Advice Section ----
function AdviceSection({ initialCount, initialList }: { initialCount: number; initialList: AdviceItem[] }) {
  const [usedCount, setUsedCount] = useState(initialCount);
  const [list, setList] = useState(initialList);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const remaining = ADVICE_LIMIT - usedCount;

  const generate = async () => {
    setGenerating(true); setError(null);
    try {
      const res = await fetch("/api/dashboard/advice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dateFrom: dateFrom || undefined, dateTo: dateTo || undefined }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "生成失敗");
      setList((prev) => [data.advice, ...prev].slice(0, 5));
      setUsedCount((c) => c + 1);
    } catch (e) { setError(e instanceof Error ? e.message : "エラー"); }
    finally { setGenerating(false); }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold text-gray-800 flex items-center gap-2">
          <span className="text-violet-500">💡</span> AI改善アドバイス
        </h3>
        <span className="text-xs text-gray-500">今月あと{remaining}回</span>
      </div>
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <span className="text-xs text-gray-600">参考期間:</span>
        <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-violet-400" />
        <span className="text-xs text-gray-400">〜</span>
        <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-violet-400" />
        <button onClick={generate} disabled={generating || remaining <= 0}
          className="px-4 py-1.5 bg-gradient-to-r from-cyan-500 to-violet-500 hover:from-cyan-600 hover:to-violet-600 text-white text-xs font-semibold rounded-lg transition-colors disabled:opacity-50">
          {generating ? "生成中..." : "アドバイスを生成"}
        </button>
      </div>
      {error && <p className="text-xs text-red-500 mb-3">{error}</p>}
      {list.length === 0 ? (
        <p className="text-sm text-gray-400 text-center py-6">
          まだアドバイスはありません。「アドバイスを生成」ボタンを押して、アンケート回答からAIアドバイスを受けましょう。
        </p>
      ) : (
        <div className="space-y-3">
          {list.map((a) => (
            <div key={a.id} className="bg-violet-50 border border-violet-200 rounded-xl p-4">
              <p className="text-xs text-gray-400 mb-2">
                {a.dateFrom && a.dateTo ? `${a.dateFrom} 〜 ${a.dateTo} | ` : ""}
                {new Date(a.createdAt).toLocaleDateString("ja-JP")}
              </p>
              <p className="text-sm text-gray-700 whitespace-pre-line">{a.content}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ---- Recent Sessions ----
function RecentSessions({ sessions, shopName }: { sessions: Session[]; shopName: string }) {
  const [sort, setSort] = useState<"newest" | "oldest">("newest");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [expanded, setExpanded] = useState<string | null>(null);

  const filtered = sessions.filter((s) => {
    const d = new Date(s.createdAt);
    if (dateFrom && d < new Date(dateFrom)) return false;
    if (dateTo && d > new Date(dateTo + "T23:59:59")) return false;
    return true;
  });
  const sorted = [...filtered].sort((a, b) => {
    const diff = new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    return sort === "newest" ? diff : -diff;
  });

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <select value={sort} onChange={(e) => setSort(e.target.value as "newest" | "oldest")}
          className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400 bg-white">
          <option value="newest">新しい順</option>
          <option value="oldest">古い順</option>
        </select>
        <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400" />
        <span className="text-sm text-gray-400">〜</span>
        <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400" />
      </div>
      {sorted.length === 0 ? (
        <p className="text-sm text-gray-400 text-center py-8">回答データがありません</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {sorted.map((s) => {
            const d = new Date(s.createdAt);
            const dateStr = `${d.getFullYear()}/${String(d.getMonth() + 1).padStart(2, "0")}/${String(d.getDate()).padStart(2, "0")} ${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
            return (
              <div key={s.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                <p className="font-medium text-gray-800 text-sm">{shopName}</p>
                <p className="text-xs text-gray-400 mt-0.5">回答日時: {dateStr}</p>
                {s.reviewText && (
                  <button onClick={() => setExpanded(expanded === s.id ? null : s.id)}
                    className="mt-2 text-xs font-medium text-violet-600 hover:text-violet-500 underline">
                    関連する口コミ: 1件
                  </button>
                )}
                {expanded === s.id && s.reviewText && (
                  <div className="mt-2 p-3 bg-violet-50 border border-violet-200 rounded-lg text-xs text-gray-700 whitespace-pre-line">
                    {s.reviewText}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ---- Main Page ----
export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/dashboard")
      .then((r) => r.json())
      .then(setData)
      .catch(() => setError("データの取得に失敗しました"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex items-center justify-center py-24 text-gray-400 text-sm">読み込み中...</div>;
  if (error) return <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">{error}</div>;
  if (!data) return null;

  const shopName = data.user?.shopName ?? data.user?.name ?? "ショップ";

  return (
    <div className="space-y-6">
      <ContractBanner />
      <h1 className="text-2xl font-bold text-gray-900">{shopName}</h1>

      {data.survey ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <CircularProgress limit={data.survey.monthlyReviewLimit} count={data.survey.monthlyReviewCount} />
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm p-6">
            <h3 className="text-sm font-bold text-gray-800 mb-4 flex items-center gap-2">
              <svg className="w-4 h-4 text-violet-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              設問リスト
            </h3>
            <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
              {data.survey.questions.map((q, i) => (
                <div key={q.id} className="border border-gray-100 rounded-xl p-3">
                  <div className="flex items-start gap-2">
                    <span className="text-xs font-bold text-violet-600 shrink-0 pt-0.5">Q{i + 1}</span>
                    <div className="min-w-0">
                      <p className="text-sm text-gray-800">{q.text}</p>
                      <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
                        <span className="px-1.5 py-0.5 bg-gray-100 text-gray-600 text-xs rounded">
                          {q.type === "choice" ? "選択式" : "記述式"}
                        </span>
                        {q.isRandom && (
                          <span className="px-1.5 py-0.5 bg-orange-100 text-orange-600 text-xs rounded font-medium">ランダム</span>
                        )}
                        {q.choices.slice(0, 4).map((c) => (
                          <span key={c.id} className="px-2 py-0.5 border border-gray-200 text-gray-600 text-xs rounded-full">{c.text}</span>
                        ))}
                        {q.choices.length > 4 && <span className="text-xs text-gray-400">+{q.choices.length - 4}</span>}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
          <p className="text-gray-400 text-sm mb-4">アンケートがまだ作成されていません</p>
          <a href="/dashboard/surveys/new"
            className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-500 to-violet-500 hover:from-cyan-600 hover:to-violet-600 text-white font-semibold rounded-xl shadow text-sm">
            + 新規作成
          </a>
        </div>
      )}

      {data.monthlyCounts.length > 0 && <LineChart data={data.monthlyCounts} />}

      {data.survey && <AdviceSection initialCount={data.adviceCount} initialList={data.adviceList} />}

      {data.survey && <RecentSessions sessions={data.recentSessions} shopName={shopName} />}
    </div>
  );
}
