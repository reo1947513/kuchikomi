"use client";

import { useState, useEffect, useRef } from "react";

// ---- Types ----
type Choice = { id: string; text: string; order: number };
type Question = { id: string; text: string; type: "choice" | "text"; order: number; isRandom: boolean; choices: Choice[] };
type Survey = {
  id: string; title: string; monthlyReviewLimit: number; monthlyReviewCount: number;
  questions: Question[];
};
type Answer = { questionId: string; choiceId: string | null; textValue: string | null };
type Session = { id: string; reviewText: string | null; createdAt: string; answers: Answer[] };
type MonthlyCount = { label: string; count: number };
type AdviceItem = { id: string; content: string; dateFrom: string | null; dateTo: string | null; createdAt: string };
type DashboardData = {
  user: { shopName: string | null; name: string } | null;
  survey: Survey | null;
  monthlyCounts: MonthlyCount[];
  recentSessions: Session[];
  adviceCount: number;
  adviceList: AdviceItem[];
  lastMonthCount: number;
  totalSessionCount: number;
  totalAccessCount: number;
  googleClickCount: number;
};

// ---- Animated Number ----
function AnimatedNumber({ value, duration = 1200 }: { value: number; duration?: number }) {
  const [display, setDisplay] = useState(0);
  const ref = useRef<number>(0);

  useEffect(() => {
    const start = ref.current;
    const diff = value - start;
    if (diff === 0) return;
    const startTime = performance.now();
    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(start + diff * eased);
      setDisplay(current);
      if (progress < 1) requestAnimationFrame(animate);
      else ref.current = value;
    };
    requestAnimationFrame(animate);
  }, [value, duration]);

  return <>{display}</>;
}

// ---- Contract Banner ----
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
    <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-sm border border-white/50 p-3 sm:p-6">
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
          <polyline points={polyline} fill="none" stroke="#8B5CF6" strokeWidth={2.5} strokeLinejoin="round" />
          {data.map((d, i) => (
            <circle key={i} cx={px(i)} cy={py(d.count)} r={3.5} fill="#8B5CF6" stroke="white" strokeWidth={1.5} />
          ))}
        </svg>
      </div>
    </div>
  );
}

// ---- Announcement Banner ----
type AnnouncementItem = { id: string; title: string; content: string; category: string; publishedAt: string };

function AnnouncementBanner() {
  const [items, setItems] = useState<AnnouncementItem[]>([]);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());

  useEffect(() => {
    // Load dismissed IDs from localStorage
    const stored = localStorage.getItem("dismissedAnnouncements");
    if (stored) setDismissed(new Set(JSON.parse(stored)));

    fetch("/api/announcements")
      .then((r) => r.json())
      .then((d) => setItems(Array.isArray(d) ? d : []))
      .catch(() => {});
  }, []);

  const dismiss = (id: string) => {
    const next = new Set(dismissed);
    next.add(id);
    setDismissed(next);
    localStorage.setItem("dismissedAnnouncements", JSON.stringify(Array.from(next)));
  };

  const visible = items.filter((i) => !dismissed.has(i.id));
  if (visible.length === 0) return null;

  const categoryColor = (c: string) => {
    if (c === "新機能") return "bg-cyan-500";
    if (c === "重要") return "bg-red-500";
    if (c === "メンテナンス") return "bg-amber-500";
    return "bg-violet-500";
  };

  return (
    <div className="space-y-2">
      {visible.slice(0, 3).map((item) => (
        <div key={item.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="flex items-center gap-3 px-4 py-3 cursor-pointer" onClick={() => setExpanded(expanded === item.id ? null : item.id)}>
            <span className={`shrink-0 w-2 h-2 rounded-full ${categoryColor(item.category)}`} />
            <span className={`shrink-0 px-2 py-0.5 rounded text-xs font-medium text-white ${categoryColor(item.category)}`}>{item.category}</span>
            <span className="flex-1 text-sm font-medium text-gray-800 truncate">{item.title}</span>
            <span className="text-xs text-gray-400 shrink-0">{new Date(item.publishedAt).toLocaleDateString("ja-JP", { month: "short", day: "numeric" })}</span>
            <button onClick={(e) => { e.stopPropagation(); dismiss(item.id); }} className="shrink-0 text-gray-300 hover:text-gray-500">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
          {expanded === item.id && (
            <div className="px-4 pb-3 pt-0">
              <p className="text-sm text-gray-600 whitespace-pre-wrap leading-relaxed">{item.content}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// ---- Premium Feature Shortcuts ----
function PremiumShortcuts({ surveyId }: { surveyId: string }) {
  const [planType, setPlanType] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/auth/me").then((r) => r.json()).then((d) => setPlanType(d.planType ?? null)).catch(() => {});
  }, []);

  const isPremium = planType === "premium" || planType === "lifetime_premium";
  const isStandardPlus = isPremium || planType === "standard" || planType === "lifetime_standard";

  const shortcuts = [
    {
      label: "AI分析レポート",
      desc: "AIがアンケートデータを分析",
      href: "/dashboard/analysis",
      icon: "M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",
      available: isPremium,
      badge: "Premium",
      color: "from-violet-500 to-purple-500",
    },
    {
      label: "カスタムプロンプト",
      desc: "AI口コミ生成を自由にカスタマイズ",
      href: `/dashboard/surveys/${surveyId}/settings`,
      icon: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z",
      available: isPremium,
      badge: "Premium",
      color: "from-fuchsia-500 to-pink-500",
    },
    {
      label: "リアルタイム分析",
      desc: "回答データをグラフで可視化",
      href: "/dashboard/analysis",
      icon: "M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z",
      available: isStandardPlus,
      badge: "Standard+",
      color: "from-cyan-500 to-blue-500",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
      {shortcuts.map((s) => (
        <a
          key={s.label}
          href={s.available ? s.href : "/dashboard/billing"}
          className={`relative rounded-xl p-4 transition-all hover:-translate-y-0.5 ${s.available ? "bg-white shadow-sm border border-gray-100 hover:shadow-md" : "bg-gray-50 border border-dashed border-gray-200"}`}
        >
          <div className="flex items-start gap-3">
            <div className={`shrink-0 w-10 h-10 rounded-lg flex items-center justify-center bg-gradient-to-br ${s.available ? s.color : "from-gray-300 to-gray-400"}`}>
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={s.icon} />
              </svg>
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <p className={`text-sm font-bold ${s.available ? "text-gray-800" : "text-gray-400"}`}>{s.label}</p>
                <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${s.available ? "bg-violet-100 text-violet-600" : "bg-gray-200 text-gray-400"}`}>{s.badge}</span>
              </div>
              <p className={`text-xs mt-0.5 ${s.available ? "text-gray-500" : "text-gray-300"}`}>{s.available ? s.desc : "プランをアップグレード"}</p>
            </div>
          </div>
          {!s.available && (
            <svg className="absolute top-3 right-3 w-4 h-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          )}
        </a>
      ))}
    </div>
  );
}

// ---- CSV Export Button ----
function CsvExportButton() {
  const [planType, setPlanType] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/api/auth/me").then((r) => r.json()).then((d) => setPlanType(d.planType ?? null)).catch(() => {});
  }, []);

  const isPremium = planType === "premium" || planType === "lifetime_premium";

  const handleExport = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/dashboard/export");
      if (!res.ok) {
        const d = await res.json();
        alert(d.error || "エクスポートに失敗しました");
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
      alert("エクスポートに失敗しました");
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

// ---- Recent Sessions ----
function RecentSessions({ sessions, shopName, questions }: { sessions: Session[]; shopName: string; questions: Question[] }) {
  const PER_PAGE = 12;
  const [sort, setSort] = useState<"newest" | "oldest">("newest");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [expanded, setExpanded] = useState<string | null>(null);
  const [page, setPage] = useState(1);

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
  const totalPages = Math.max(1, Math.ceil(sorted.length / PER_PAGE));
  const paginated = sorted.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <select value={sort} onChange={(e) => { setSort(e.target.value as "newest" | "oldest"); setPage(1); }}
          className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400 bg-white">
          <option value="newest">新しい順</option>
          <option value="oldest">古い順</option>
        </select>
        <input type="date" value={dateFrom} onChange={(e) => { setDateFrom(e.target.value); setPage(1); }}
          className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400" />
        <span className="text-sm text-gray-400">〜</span>
        <input type="date" value={dateTo} onChange={(e) => { setDateTo(e.target.value); setPage(1); }}
          className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400" />
      </div>
      {paginated.length === 0 ? (
        <p className="text-sm text-gray-400 text-center py-8">回答データがありません</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {paginated.map((s) => {
            const d = new Date(s.createdAt);
            const dateStr = `${d.getFullYear()}/${String(d.getMonth() + 1).padStart(2, "0")}/${String(d.getDate()).padStart(2, "0")} ${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
            return (
              <div key={s.id} className="bg-white/70 backdrop-blur-sm rounded-xl shadow-sm border border-white/50 p-4">
                <p className="font-medium text-gray-800 text-sm">{shopName}</p>
                <p className="text-xs text-gray-400 mt-0.5">回答日時: {dateStr}</p>
                <div className="mt-2 flex gap-2">
                  {s.answers?.length > 0 && (
                    <button onClick={() => setExpanded(expanded === s.id + "-ans" ? null : s.id + "-ans")}
                      className={`text-xs font-medium px-2 py-1 rounded-lg transition-colors ${expanded === s.id + "-ans" ? "bg-cyan-100 text-cyan-700" : "bg-gray-100 text-gray-500 hover:bg-gray-200"}`}>
                      アンケート回答
                    </button>
                  )}
                  {s.reviewText && (
                    <button onClick={() => setExpanded(expanded === s.id + "-rev" ? null : s.id + "-rev")}
                      className={`text-xs font-medium px-2 py-1 rounded-lg transition-colors ${expanded === s.id + "-rev" ? "bg-violet-100 text-violet-700" : "bg-gray-100 text-gray-500 hover:bg-gray-200"}`}>
                      口コミ
                    </button>
                  )}
                </div>
                {expanded === s.id + "-ans" && s.answers && (
                  <div className="mt-2 p-3 bg-cyan-50 border border-cyan-200 rounded-lg text-xs space-y-2">
                    {questions.map((q) => {
                      const ans = s.answers.find((a) => a.questionId === q.id);
                      if (!ans) return null;
                      const ansText = ans.choiceId
                        ? q.choices.find((c) => c.id === ans.choiceId)?.text || "—"
                        : ans.textValue || "—";
                      return (
                        <div key={q.id}>
                          <p className="text-gray-500">{q.text}</p>
                          <p className="font-medium text-gray-800">{ansText}</p>
                        </div>
                      );
                    })}
                  </div>
                )}
                {expanded === s.id + "-rev" && s.reviewText && (
                  <div className="mt-2 p-3 bg-violet-50 border border-violet-200 rounded-lg text-xs text-gray-700 whitespace-pre-line">
                    {s.reviewText}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 mt-4">
          <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page <= 1}
            className="px-4 py-2.5 text-sm border border-gray-300 rounded-lg disabled:opacity-40 hover:bg-gray-50 transition-colors min-h-[44px]">前へ</button>
          <span className="text-sm text-gray-600">{page} / {totalPages}</span>
          <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page >= totalPages}
            className="px-4 py-2.5 text-sm border border-gray-300 rounded-lg disabled:opacity-40 hover:bg-gray-50 transition-colors min-h-[44px]">次へ</button>
        </div>
      )}
    </div>
  );
}

// ---- AI Advice Section ----
function AdviceSection({ initialCount, initialList }: { initialCount: number; initialList: AdviceItem[] }) {
  const ADVICE_LIMIT = 5;
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
    <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-sm border border-white/50 p-3 sm:p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold text-gray-800 flex items-center gap-2">
          AI改善アドバイス
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
        <p className="text-sm text-gray-400 text-center py-6">まだアドバイスはありません。</p>
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

// ---- Main Page ----
export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showLimitPopup, setShowLimitPopup] = useState(false);
  const [limitPopupType, setLimitPopupType] = useState<"reached" | "warning">("reached");

  useEffect(() => {
    fetch("/api/dashboard")
      .then((r) => r.json())
      .then((d) => {
        setData(d);
        // Show limit popup up to 5 times
        if (d.survey) {
          const limit = d.survey.monthlyReviewLimit;
          const count = d.survey.monthlyReviewCount ?? 0;
          if (limit > 0) {
            const remaining = limit - count;
            if (remaining <= 0) {
              // Limit reached
              const key = "limitReachedPopupCount";
              const shown = parseInt(sessionStorage.getItem(key) || "0", 10);
              if (shown < 5) {
                setLimitPopupType("reached");
                setShowLimitPopup(true);
                sessionStorage.setItem(key, String(shown + 1));
              }
            } else if (remaining <= Math.max(3, Math.ceil(limit * 0.1))) {
              // Warning: 10% or 3 remaining, whichever is larger
              const key = "limitWarningPopupCount";
              const shown = parseInt(sessionStorage.getItem(key) || "0", 10);
              if (shown < 5) {
                setLimitPopupType("warning");
                setShowLimitPopup(true);
                sessionStorage.setItem(key, String(shown + 1));
              }
            }
          }
        }
      })
      .catch(() => setError("データの取得に失敗しました"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex items-center justify-center py-24 text-gray-400 text-sm">読み込み中...</div>;
  if (error) return <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">{error}</div>;
  if (!data) return null;

  const shopName = data.user?.shopName ?? data.user?.name ?? "ショップ";
  const thisMonthCount = data.survey?.monthlyReviewCount ?? 0;
  const lastMonthCount = data.lastMonthCount ?? 0;
  const totalSessions = data.totalSessionCount ?? 0;
  const totalAccess = data.totalAccessCount ?? 0;
  const questionCount = data.survey?.questions?.length ?? 0;
  const usageRate = data.survey ? Math.round((thisMonthCount / data.survey.monthlyReviewLimit) * 100) : 0;
  const completionRate = totalAccess > 0 ? Math.round((totalSessions / totalAccess) * 100) : 0;
  const googleClickCount = data.googleClickCount ?? 0;
  const googleClickRate = totalSessions > 0 ? Math.round((googleClickCount / totalSessions) * 100) : 0;

  const monthDiff = thisMonthCount - lastMonthCount;
  const monthDiffLabel = monthDiff > 0 ? `+${monthDiff}` : `${monthDiff}`;

  const statCards = [
    { label: "今月の生成数", value: thisMonthCount, suffix: "件", sub: lastMonthCount > 0 || thisMonthCount > 0 ? `前月比 ${monthDiffLabel}` : undefined, subColor: monthDiff >= 0 ? "text-green-600" : "text-red-500", icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" },
    { label: "総回答数", value: totalSessions, suffix: "件", icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" },
    { label: "アクセス数", value: totalAccess, suffix: "回", icon: "M15 12a3 3 0 11-6 0 3 3 0 016 0z" },
    { label: "設問数", value: questionCount, suffix: "問", icon: "M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" },
    { label: "月間利用率", value: usageRate, suffix: "%", icon: "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" },
    { label: "回答完了率", value: completionRate, suffix: "%", icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" },
    { label: "口コミ投稿率", value: googleClickRate, suffix: "%", sub: `${googleClickCount}/${totalSessions}件`, subColor: "text-gray-500", icon: "M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.518 4.674h4.914c.969 0 1.371 1.24.588 1.81l-3.976 2.888 1.518 4.674c.3.921-.755 1.688-1.538 1.118L12 15.203l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674-3.976-2.888c-.783-.57-.38-1.81.588-1.81h4.914l1.518-4.674z" },
  ];

  return (
    <div className="space-y-6">
      <style>{`
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-slide-up {
          animation: fadeSlideUp 0.5s ease-out forwards;
          opacity: 0;
        }
      `}</style>

      <ContractBanner />

      {/* Announcements */}
      <AnnouncementBanner />

      {/* Welcome Card */}
      <div className="rounded-2xl bg-gradient-to-r from-cyan-500 to-violet-500 p-4 md:p-6 text-white shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm opacity-90">ようこそ</p>
            <h1 className="text-lg md:text-2xl font-bold mt-1">{shopName}</h1>
            <p className="text-sm opacity-80 mt-2">
              今月の生成数: <span className="font-bold text-base md:text-lg">{thisMonthCount}</span> / {data.survey?.monthlyReviewLimit ?? 0}件
            </p>
          </div>
          <div className="hidden sm:block">
            <svg className="w-20 h-20 opacity-20" fill="currentColor" viewBox="0 0 24 24">
              <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
      </div>

      {/* Stat Cards */}
      {data.survey && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {statCards.map((card, i) => (
            <div
              key={card.label}
              className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-sm border border-white/50 p-4 animate-fade-slide-up"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-violet-500 flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={card.icon} />
                  </svg>
                </div>
                <span className="text-xs text-gray-500">{card.label}</span>
              </div>
              <p className="text-xl md:text-2xl font-bold text-gray-900">
                <AnimatedNumber value={card.value} /><span className="text-sm font-normal text-gray-500 ml-1">{card.suffix}</span>
              </p>
              {card.sub && (
                <p className={`text-xs mt-1 font-medium ${card.subColor}`}>{card.sub}</p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Premium Feature Shortcuts */}
      {data.survey && (
        <PremiumShortcuts surveyId={data.survey.id} />
      )}

      {!data.survey && (
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-sm border border-white/50 p-12 text-center">
          <p className="text-gray-400 text-sm mb-4">アンケートがまだ作成されていません</p>
          <a href="/dashboard/surveys/new"
            className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-500 to-violet-500 hover:from-cyan-600 hover:to-violet-600 text-white font-semibold rounded-xl shadow text-sm">
            + 新規作成
          </a>
        </div>
      )}

      {data.survey && (
        <>
          <div className="flex items-center justify-between">
            <h2 className="text-base sm:text-lg font-bold text-gray-900">回答履歴</h2>
            <CsvExportButton />
          </div>
          <RecentSessions sessions={data.recentSessions} shopName={shopName} questions={data.survey.questions} />
        </>
      )}

      {/* Limit warning/reached popup */}
      {showLimitPopup && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4" onClick={() => setShowLimitPopup(false)}>
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className={`px-5 py-4 ${limitPopupType === "reached" ? "bg-gradient-to-r from-red-500 to-orange-500" : "bg-gradient-to-r from-amber-500 to-orange-400"}`}>
              <h3 className="text-white font-bold flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                {limitPopupType === "reached" ? "口コミ生成の上限に達しました" : "口コミ生成の上限が近づいています"}
              </h3>
            </div>
            <div className="p-5 space-y-4">
              <p className="text-sm text-gray-600">
                {limitPopupType === "reached"
                  ? `今月の口コミ生成数が上限（${data.survey?.monthlyReviewLimit}件）に達しています。アンケートからの口コミ生成が一時停止中です。`
                  : `今月の口コミ生成数が ${thisMonthCount}/${data.survey?.monthlyReviewLimit}件 です。上限に達すると口コミの自動生成が停止します。`}
              </p>
              <div className="flex flex-col gap-2">
                <a
                  href="/dashboard/billing"
                  className="w-full text-center py-2.5 bg-gradient-to-r from-cyan-500 to-violet-500 text-white font-bold text-sm rounded-xl"
                >
                  プランをアップグレード
                </a>
                <a
                  href="/dashboard/billing"
                  className="w-full text-center py-2.5 border border-gray-300 text-gray-700 font-medium text-sm rounded-xl hover:bg-gray-50"
                >
                  追加レビューを購入
                </a>
                <button
                  onClick={() => setShowLimitPopup(false)}
                  className="text-xs text-gray-400 hover:text-gray-600 mt-1"
                >
                  閉じる
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
