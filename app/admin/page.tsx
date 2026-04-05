"use client";

import { useEffect, useRef, useState } from "react";

type Stats = {
  totalShops: number;
  totalReviews: number;
  monthlyReviews: { month: string; count: number }[];
  industryDistribution: { industry: string; count: number }[];
};

const PIE_COLORS = ["#06B6D4", "#8B5CF6", "#7C3AED", "#22D3EE", "#A78BFA", "#C4B5FD"];

function polar(cx: number, cy: number, r: number, deg: number) {
  const rad = ((deg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function slicePath(cx: number, cy: number, r: number, start: number, end: number) {
  const s = polar(cx, cy, r, start);
  const e = polar(cx, cy, r, end);
  const large = end - start > 180 ? 1 : 0;
  return `M${cx},${cy} L${s.x.toFixed(2)},${s.y.toFixed(2)} A${r},${r} 0 ${large} 1 ${e.x.toFixed(2)},${e.y.toFixed(2)} Z`;
}

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

  return <>{display.toLocaleString()}</>;
}

export default function SuperAdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [tooltip, setTooltip] = useState<{ text: string; x: number; y: number } | null>(null);
  const chartRef = useRef<HTMLDivElement>(null);

  const showTooltip = (e: React.MouseEvent, text: string) => {
    const rect = chartRef.current?.getBoundingClientRect();
    if (!rect) return;
    setTooltip({ text, x: e.clientX - rect.left, y: e.clientY - rect.top - 40 });
  };

  useEffect(() => {
    fetch("/api/admin/stats")
      .then((r) => r.json())
      .then(setStats)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24 text-gray-400 text-sm">
        読み込み中...
      </div>
    );
  }

  if (!stats) return null;

  const monthlyReviews = stats.monthlyReviews ?? [];
  const industryDistribution = stats.industryDistribution ?? [];

  const maxCount = Math.max(...monthlyReviews.map((m: { count: number }) => m.count), 1);
  const yMax = Math.ceil(maxCount / Math.pow(10, Math.floor(Math.log10(maxCount || 1)))) *
    Math.pow(10, Math.floor(Math.log10(maxCount || 1)));
  const safeYMax = yMax > 0 ? yMax : 10;

  const totalIndustry = industryDistribution.reduce((s, d) => s + d.count, 0) || 1;

  const chartW = 520;
  const chartH = 200;
  const barCount = monthlyReviews.length || 1;
  const slotW = chartW / barCount;
  const barW = Math.max(20, slotW * 0.55);

  const yTicks = [0, 0.25, 0.5, 0.75, 1];

  return (
    <div className="space-y-6">
      <style>{`
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .anim-fade { animation: fadeSlideUp 0.5s ease-out forwards; opacity: 0; }
        @keyframes barGrow {
          from { transform: scaleY(0); }
          to { transform: scaleY(1); }
        }
        .anim-bar { animation: barGrow 0.8s ease-out forwards; transform-origin: bottom; }
        @keyframes pieRotate {
          from { opacity: 0; transform: rotate(-90deg) scale(0.8); }
          to { opacity: 1; transform: rotate(0deg) scale(1); }
        }
        .anim-pie { animation: pieRotate 0.7s ease-out forwards; transform-origin: center; opacity: 0; }
      `}</style>

      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-sm border border-white/50 p-4 md:p-6 anim-fade" style={{ animationDelay: "100ms" }}>
          <div className="flex items-center gap-3 mb-3 md:mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-violet-500 flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <span className="text-sm font-medium text-gray-500">総ショップ数</span>
          </div>
          <span className="text-3xl md:text-5xl font-bold text-gray-900"><AnimatedNumber value={stats.totalShops} /></span>
          <p className="text-sm text-gray-400 mt-2">登録ショップ</p>
        </div>

        <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-sm border border-white/50 p-4 md:p-6 anim-fade" style={{ animationDelay: "200ms" }}>
          <div className="flex items-center gap-3 mb-3 md:mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-violet-500 flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
            </div>
            <span className="text-sm font-medium text-gray-500">総レビュー数</span>
          </div>
          <span className="text-3xl md:text-5xl font-bold text-gray-900"><AnimatedNumber value={stats.totalReviews} /></span>
          <p className="text-sm text-gray-400 mt-2">生成されたレビュー</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative" ref={chartRef}>
        {tooltip && (
          <div
            className="absolute z-50 px-3 py-1.5 bg-gray-900 text-white text-xs rounded-lg shadow-lg pointer-events-none whitespace-nowrap"
            style={{ left: tooltip.x, top: tooltip.y, transform: "translateX(-50%)" }}
          >
            {tooltip.text}
          </div>
        )}
        {/* Bar chart */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-sm border border-white/50 p-4 md:p-6 anim-fade" style={{ animationDelay: "300ms" }}>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-violet-500 flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <span className="text-sm font-semibold text-gray-700">月別レビュー数</span>
          </div>
          <svg viewBox={`0 0 ${chartW + 50} ${chartH + 55}`} className="w-full">
            {yTicks.map((t) => {
              const y = chartH - t * chartH;
              const label = Math.round(safeYMax * t);
              return (
                <g key={t}>
                  <line x1={45} y1={y} x2={chartW + 45} y2={y} stroke="#F3F4F6" strokeWidth={1} />
                  <text x={40} y={y + 4} textAnchor="end" fontSize={10} fill="#9CA3AF">
                    {label.toLocaleString()}
                  </text>
                </g>
              );
            })}
            {monthlyReviews.map((m, i) => {
              const ratio = m.count / safeYMax;
              const bh = ratio * chartH;
              const bx = 45 + i * slotW + (slotW - barW) / 2;
              const by = chartH - bh;
              return (
                <g key={m.month} className="cursor-pointer"
                  onMouseMove={(e) => showTooltip(e, `${m.month}: ${m.count}件`)}
                  onMouseLeave={() => setTooltip(null)}
                >
                  <rect x={bx} y={by} width={barW} height={bh} fill="url(#barGrad)" rx={4} className="anim-bar" style={{ animationDelay: `${400 + i * 60}ms` }} />
                  <text x={bx + barW / 2} y={chartH + 18} textAnchor="middle" fontSize={9} fill="#6B7280">
                    {m.month}
                  </text>
                </g>
              );
            })}
            <defs>
              <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#06B6D4" />
                <stop offset="100%" stopColor="#8B5CF6" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* Pie chart */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-sm border border-white/50 p-4 md:p-6 anim-fade" style={{ animationDelay: "400ms" }}>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-violet-500 flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
              </svg>
            </div>
            <span className="text-sm font-semibold text-gray-700">業種別ショップ分布</span>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 mt-2">
            <svg viewBox="0 0 200 200" className="w-32 h-32 sm:w-44 sm:h-44 shrink-0 anim-pie" style={{ animationDelay: "500ms" }}>
              {industryDistribution.length === 0 ? (
                <circle cx={100} cy={100} r={80} fill="#F3F4F6" />
              ) : industryDistribution.length === 1 ? (
                <circle cx={100} cy={100} r={80} fill={PIE_COLORS[0]} />
              ) : (
                (() => {
                  let cum = 0;
                  return industryDistribution.map((d, i) => {
                    const angle = (d.count / totalIndustry) * 360;
                    const path = slicePath(100, 100, 80, cum, cum + angle);
                    cum += angle;
                    const pct = Math.round((d.count / totalIndustry) * 100);
                    return (
                      <path
                        key={i}
                        d={path}
                        className="cursor-pointer"
                        fill={PIE_COLORS[i % PIE_COLORS.length]}
                        stroke="white"
                        strokeWidth={2}
                        onMouseMove={(e) => showTooltip(e, `${d.industry}: ${d.count}件 (${pct}%)`)}
                        onMouseLeave={() => setTooltip(null)}
                      />
                    );
                  });
                })()
              )}
            </svg>
            <div className="space-y-2">
              {industryDistribution.map((d, i) => (
                <div key={i} className="flex items-center gap-2 anim-fade" style={{ animationDelay: `${600 + i * 80}ms` }}>
                  <div
                    className="w-3 h-3 rounded-sm shrink-0"
                    style={{ backgroundColor: PIE_COLORS[i % PIE_COLORS.length] }}
                  />
                  <span className="text-xs text-gray-600">{d.industry}</span>
                  <span className="text-xs text-gray-400 ml-auto">{d.count}</span>
                </div>
              ))}
              {industryDistribution.length === 0 && (
                <p className="text-xs text-gray-400">データなし</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
