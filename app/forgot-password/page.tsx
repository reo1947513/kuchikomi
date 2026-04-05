"use client";

import { useState } from "react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });
      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.error || "送信に失敗しました");
      }
      setSent(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : "エラーが発生しました");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-cyan-500 to-violet-500 px-4">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-md px-8 py-10">
        <div className="flex flex-col items-center mb-6">
          <img src="/logo.png" alt="ComiSta" className="h-20 w-auto mb-3" />
          <h1 className="text-xl font-bold text-gray-900">パスワード再設定</h1>
        </div>

        {sent ? (
          <div className="text-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center mx-auto">
              <svg className="w-7 h-7 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="text-sm text-gray-600">
              入力されたメールアドレスにパスワード再設定用のリンクを送信しました。メールをご確認ください。
            </p>
            <a href="/login" className="inline-block text-sm text-violet-500 hover:underline">
              ログインに戻る
            </a>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <p className="text-sm text-gray-500">
              登録済みのメールアドレスを入力してください。パスワード再設定用のリンクをお送りします。
            </p>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">メールアドレス</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@example.com"
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent"
              />
            </div>
            {error && (
              <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600">{error}</div>
            )}
            <button
              type="submit"
              disabled={submitting || !email.trim()}
              className="w-full rounded-lg bg-gradient-to-r from-cyan-500 to-violet-500 hover:from-cyan-600 hover:to-violet-600 text-white font-semibold py-2.5 text-sm transition disabled:opacity-60"
            >
              {submitting ? "送信中..." : "再設定メールを送信"}
            </button>
            <div className="text-center">
              <a href="/login" className="text-sm text-gray-500 hover:text-gray-700">ログインに戻る</a>
            </div>
          </form>
        )}
      </div>
    </main>
  );
}
