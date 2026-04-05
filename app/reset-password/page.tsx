"use client";

import { useState, useEffect } from "react";

export default function ResetPasswordPage() {
  const [token, setToken] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setToken(params.get("token") || "");
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
      setError("パスワードは6文字以上で設定してください");
      return;
    }
    if (password !== confirm) {
      setError("パスワードが一致しません");
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
      const d = await res.json();
      if (!res.ok) throw new Error(d.error || "再設定に失敗しました");
      setDone(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : "エラーが発生しました");
    } finally {
      setSubmitting(false);
    }
  };

  if (!token) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-cyan-500 to-violet-500 px-4">
        <div className="bg-white rounded-2xl shadow-lg w-full max-w-md px-8 py-10 text-center">
          <p className="text-red-500 text-sm">無効なリンクです。再度パスワード再設定をリクエストしてください。</p>
          <a href="/forgot-password" className="mt-4 inline-block text-sm text-violet-500 hover:underline">パスワード再設定へ</a>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-cyan-500 to-violet-500 px-4">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-md px-8 py-10">
        <div className="flex flex-col items-center mb-6">
          <img src="/logo.png" alt="ComiSta" className="h-20 w-auto mb-3" />
          <h1 className="text-xl font-bold text-gray-900">新しいパスワードを設定</h1>
        </div>

        {done ? (
          <div className="text-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center mx-auto">
              <svg className="w-7 h-7 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="text-sm text-gray-600">パスワードが再設定されました。新しいパスワードでログインしてください。</p>
            <a
              href="/login"
              className="inline-block px-6 py-2.5 bg-gradient-to-r from-cyan-500 to-violet-500 text-white font-bold text-sm rounded-xl"
            >
              ログインへ
            </a>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">新しいパスワード</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="6文字以上"
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">パスワード確認</label>
              <input
                type="password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                placeholder="もう一度入力"
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent"
              />
            </div>
            {error && (
              <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600">{error}</div>
            )}
            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-lg bg-gradient-to-r from-cyan-500 to-violet-500 hover:from-cyan-600 hover:to-violet-600 text-white font-semibold py-2.5 text-sm transition disabled:opacity-60"
            >
              {submitting ? "再設定中..." : "パスワードを再設定"}
            </button>
          </form>
        )}
      </div>
    </main>
  );
}
