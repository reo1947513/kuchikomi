"use client";

import { useEffect, useState } from "react";

interface ResultData {
  id: string;
  reviewText: string;
  createdAt: string;
  surveyId: string;
  completionMessage: string | null;
  googleBusinessUrl: string | null;
  logoUrl: string | null;
  couponImageUrl: string | null;
}

export default function ResultPage({
  params,
}: {
  params: { id: string; sessionId: string };
}) {
  const { id: surveyId, sessionId } = params;

  const [data, setData] = useState<ResultData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reviewText, setReviewText] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetch(`/api/sessions/${sessionId}`)
      .then((r) => {
        if (!r.ok) throw new Error("結果の取得に失敗しました");
        return r.json();
      })
      .then((d: ResultData) => {
        setData(d);
        setReviewText(d.reviewText);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [sessionId]);

  async function copyReview() {
    try {
      await navigator.clipboard.writeText(reviewText);
    } catch {
      const el = document.createElement("textarea");
      el.value = reviewText;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  async function handleGooglePost(url: string) {
    try {
      await navigator.clipboard.writeText(reviewText);
    } catch {
      // ignore
    }
    window.open(url, "_blank");
  }

  const formattedTime = data
    ? new Date(data.createdAt).toLocaleString("ja-JP", {
        year: "numeric",
        month: "numeric",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "";

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "#F5F3FF" }}>
        <div
          className="w-10 h-10 border-4 border-t-transparent rounded-full animate-spin"
          style={{ borderColor: "#8B5CF6", borderTopColor: "transparent" }}
        />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6" style={{ backgroundColor: "#F5F3FF" }}>
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-red-700 text-sm max-w-sm w-full text-center">
          {error ?? "エラーが発生しました"}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#F5F3FF" }}>
      <div className="max-w-lg mx-auto px-4 py-10 space-y-5">

        {/* Heading */}
        <div className="flex items-center gap-3">
          {data.logoUrl ? (
            <img src={data.logoUrl} alt="logo" className="w-10 h-10 rounded-full object-cover flex-shrink-0 shadow" />
          ) : (
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 shadow"
              className="bg-gradient-to-r from-cyan-500 to-violet-500 hover:from-cyan-600 hover:to-violet-600"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" className="w-5 h-5">
                <path
                  fillRule="evenodd"
                  d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          )}
          <h1 className="text-xl font-bold text-gray-900">クチコミ文章が完成しました！</h1>
        </div>

        {/* Shop message */}
        {data.completionMessage && (
          <div className="rounded-2xl overflow-hidden shadow-sm border border-violet-200">
            <div className="px-4 py-2 flex items-center gap-2" className="bg-gradient-to-r from-cyan-500 to-violet-500 hover:from-cyan-600 hover:to-violet-600">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-gray-800">
                <path
                  fillRule="evenodd"
                  d="M4.5 3.75a3 3 0 0 0-3 3v10.5a3 3 0 0 0 3 3h15a3 3 0 0 0 3-3V6.75a3 3 0 0 0-3-3h-15Zm4.125 3a2.25 2.25 0 1 0 0 4.5 2.25 2.25 0 0 0 0-4.5Zm-3.873 8.703a4.126 4.126 0 0 1 7.746 0 .75.75 0 0 1-.351.92 7.47 7.47 0 0 1-3.522.877 7.47 7.47 0 0 1-3.522-.877.75.75 0 0 1-.351-.92ZM15 8.25a.75.75 0 0 0 0 1.5h3.75a.75.75 0 0 0 0-1.5H15ZM14.25 12a.75.75 0 0 1 .75-.75h3.75a.75.75 0 0 1 0 1.5H15a.75.75 0 0 1-.75-.75Zm.75 2.25a.75.75 0 0 0 0 1.5h3.75a.75.75 0 0 0 0-1.5H15Z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-sm font-bold text-gray-900">ショップからのメッセージ</span>
            </div>
            <div className="bg-violet-50 px-4 py-4">
              <p className="text-sm text-gray-800 whitespace-pre-wrap leading-relaxed">{data.completionMessage}</p>
              <p className="text-xs text-gray-500 mt-3">{formattedTime}</p>
            </div>
          </div>
        )}

        {/* Review text card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 space-y-3">
          <div className="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-gray-500">
              <path
                fillRule="evenodd"
                d="M4.848 2.771A49.144 49.144 0 0 1 12 2.25c2.43 0 4.817.178 7.152.52 1.978.292 3.348 2.024 3.348 3.97v6.02c0 1.946-1.37 3.678-3.348 3.97a48.901 48.901 0 0 1-3.476.383.39.39 0 0 0-.297.17l-2.755 4.133a.75.75 0 0 1-1.248 0l-2.755-4.133a.39.39 0 0 0-.297-.17 48.9 48.9 0 0 1-3.476-.384c-1.978-.29-3.348-2.024-3.348-3.97V6.741c0-1.946 1.37-3.68 3.348-3.97Z"
                clipRule="evenodd"
              />
            </svg>
            <span className="text-sm font-semibold text-gray-700">クチコミ</span>
          </div>

          <textarea
            className="w-full min-h-[140px] resize-y rounded-xl border border-gray-200 px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:border-transparent leading-relaxed"
            style={{ "--tw-ring-color": "#8B5CF6" } as React.CSSProperties}
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
          />

          <div className="flex items-center justify-between">
            <p className="text-xs text-gray-400">{reviewText.length}文字</p>
            <button
              onClick={copyReview}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 transition-colors"
            >
              {copied ? (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5 text-green-500">
                    <path fillRule="evenodd" d="M19.916 4.626a.75.75 0 0 1 .208 1.04l-9 13.5a.75.75 0 0 1-1.154.114l-6-6a.75.75 0 0 1 1.06-1.06l5.353 5.353 8.493-12.739a.75.75 0 0 1 1.04-.208Z" clipRule="evenodd" />
                  </svg>
                  コピーしました！
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5">
                    <path fillRule="evenodd" d="M10.5 3A1.501 1.501 0 0 0 9 4.5h6A1.5 1.5 0 0 0 13.5 3h-3Zm-2.693.178A3 3 0 0 1 10.5 1.5h3a3 3 0 0 1 2.694 1.678c.497.042.992.092 1.486.15 1.497.173 2.57 1.46 2.57 2.929V19.5a3 3 0 0 1-3 3H6.75a3 3 0 0 1-3-3V6.257c0-1.469 1.073-2.756 2.57-2.93.493-.057.989-.107 1.487-.149Z" clipRule="evenodd" />
                  </svg>
                  コピーする
                </>
              )}
            </button>
          </div>
        </div>

        {/* AI notice */}
        <p className="text-xs text-gray-400 text-center leading-relaxed px-2">
          ※ この口コミ文章はAIが生成したものです。内容を確認・編集してから投稿してください。
        </p>

        {/* Coupon image */}
        {data.couponImageUrl && (
          <div className="rounded-2xl overflow-hidden shadow-sm border border-violet-200">
            <div className="px-4 py-2 flex items-center gap-2" className="bg-gradient-to-r from-cyan-500 to-violet-500 hover:from-cyan-600 hover:to-violet-600">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-gray-800">
                <path d="M9.375 3a1.875 1.875 0 0 0 0 3.75h1.875v4.5H3.375A1.875 1.875 0 0 1 1.5 9.375v-.75a1.875 1.875 0 0 1 1.875-1.875h.375m0 0V3A1.875 1.875 0 0 1 5.625 3h5.25A1.875 1.875 0 0 1 12.75 4.875V6.75m0 0h-3.375m3.375 0h.375a1.875 1.875 0 0 1 1.875 1.875v.75c0 1.036-.84 1.875-1.875 1.875h-9.75A1.875 1.875 0 0 1 1.5 9.375v-.75m12 4.5v5.625a1.875 1.875 0 0 1-1.875 1.875H5.625a1.875 1.875 0 0 1-1.875-1.875V13.5h10.5Z" />
              </svg>
              <span className="text-sm font-bold text-gray-900">クーポン</span>
            </div>
            <img src={data.couponImageUrl} alt="coupon" className="w-full object-contain" />
          </div>
        )}

        {/* CTA buttons */}
        <div className="space-y-3">
          {data.googleBusinessUrl && (
            <button
              onClick={() => handleGooglePost(data.googleBusinessUrl!)}
              className="flex items-center justify-center gap-2 w-full py-3.5 px-4 rounded-xl text-gray-900 text-sm font-bold shadow transition-opacity hover:opacity-90"
              className="bg-gradient-to-r from-cyan-500 to-violet-500 hover:from-cyan-600 hover:to-violet-600"
            >
              <svg viewBox="0 0 24 24" className="w-5 h-5 flex-shrink-0" xmlns="http://www.w3.org/2000/svg">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Google Mapで口コミを投稿
            </button>
          )}

          <a
            href={`/survey/${surveyId}`}
            className="flex items-center justify-center w-full py-3 px-4 rounded-xl text-sm text-gray-600 font-medium border border-gray-200 bg-white hover:bg-gray-50 transition-colors"
          >
            アンケートへ戻る
          </a>
        </div>

      </div>
    </div>
  );
}
