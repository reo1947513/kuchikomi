"use client";

import { useState, useEffect } from "react";

export default function SignupPage() {
  const [inviteToken, setInviteToken] = useState("");
  const [shopName, setShopName] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [address, setAddress] = useState("");
  const [industry, setIndustry] = useState("");
  const [phone, setPhone] = useState("");
  const [agreedTerms, setAgreedTerms] = useState(false);
  const [agreedPrivacy, setAgreedPrivacy] = useState(false);
  const [industries, setIndustries] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [loginId, setLoginId] = useState("");
  const [invalidLink, setInvalidLink] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("invite") || "";
    if (!token) {
      setInvalidLink(true);
      return;
    }
    setInviteToken(token);
    fetch("/api/admin/industries").then((r) => r.json()).then((d) => {
      if (Array.isArray(d)) setIndustries(d.map((i: any) => i.name));
    }).catch(() => {});
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (password !== confirm) { setError("パスワードが一致しません"); return; }
    if (password.length < 6) { setError("パスワードは6文字以上で設定してください"); return; }

    setSubmitting(true);
    try {
      const res = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ inviteToken, shopName, name, email, password, address, industry, phone }),
      });
      const d = await res.json();
      if (!res.ok) throw new Error(d.error || "登録に失敗しました");
      setLoginId(d.loginId);
      setDone(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : "エラーが発生しました");
    } finally {
      setSubmitting(false);
    }
  };

  if (invalidLink) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-cyan-500 to-violet-500 px-4">
        <div className="bg-white rounded-2xl shadow-lg w-full max-w-md px-8 py-10 text-center">
          <p className="text-red-500 text-sm mb-4">無効な招待リンクです。管理者から正しいリンクを取得してください。</p>
          <a href="/login" className="text-sm text-violet-500 hover:underline">ログインへ</a>
        </div>
      </main>
    );
  }

  if (done) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-cyan-500 to-violet-500 px-4">
        <div className="bg-white rounded-2xl shadow-lg w-full max-w-md px-8 py-10 text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto">
            <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-900">アカウントが作成されました！</h2>
          <p className="text-sm text-gray-500">登録いただいたメールアドレスでログインできます。</p>
          <a
            href="/login"
            className="inline-block w-full py-3 bg-gradient-to-r from-cyan-500 to-violet-500 text-white font-bold text-sm rounded-xl"
          >
            ログインする
          </a>
        </div>
      </main>
    );
  }

  const inputCls = "w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent";

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-cyan-500 to-violet-500 px-4 py-10">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-md px-6 sm:px-8 py-8">
        <div className="flex flex-col items-center mb-6">
          <img src="/logo.png" alt="ComiSta" className="h-16 w-auto mb-3" />
          <h1 className="text-xl font-bold text-gray-900">新規アカウント登録</h1>
          <p className="text-xs text-gray-400 mt-1">ComiStaの利用を開始する</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">店舗名 / 会社名 <span className="text-red-500">*</span></label>
            <input type="text" value={shopName} onChange={(e) => setShopName(e.target.value)} placeholder="例：ComiSta渋谷店" className={inputCls} required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">担当者名 <span className="text-red-500">*</span></label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="例：山田 太郎" className={inputCls} required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">メールアドレス <span className="text-red-500">*</span></label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="example@example.com" className={inputCls} required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">パスワード <span className="text-red-500">*</span></label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="6文字以上" className={inputCls} required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">パスワード確認 <span className="text-red-500">*</span></label>
            <input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} placeholder="もう一度入力" className={inputCls} required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">住所</label>
            <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="東京都渋谷区..." className={inputCls} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">業種</label>
            <select value={industry} onChange={(e) => setIndustry(e.target.value)} className={inputCls}>
              <option value="">選択してください</option>
              {industries.map((i) => <option key={i} value={i}>{i}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">電話番号</label>
            <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="090-0000-0000" className={inputCls} />
          </div>

          {/* Terms & Privacy agreement */}
          <div className="space-y-2 bg-gray-50 rounded-lg p-3">
            <label className="flex items-start gap-2 cursor-pointer">
              <input type="checkbox" checked={agreedTerms} onChange={(e) => setAgreedTerms(e.target.checked)}
                className="mt-0.5 rounded border-gray-300 text-violet-500 focus:ring-violet-400" />
              <span className="text-xs text-gray-600">
                <a href="/legal/terms" target="_blank" className="text-violet-500 underline hover:text-violet-700">利用規約</a>に同意します <span className="text-red-500">*</span>
              </span>
            </label>
            <label className="flex items-start gap-2 cursor-pointer">
              <input type="checkbox" checked={agreedPrivacy} onChange={(e) => setAgreedPrivacy(e.target.checked)}
                className="mt-0.5 rounded border-gray-300 text-violet-500 focus:ring-violet-400" />
              <span className="text-xs text-gray-600">
                <a href="/legal/privacy" target="_blank" className="text-violet-500 underline hover:text-violet-700">プライバシーポリシー</a>に同意します <span className="text-red-500">*</span>
              </span>
            </label>
          </div>

          {error && (
            <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600">{error}</div>
          )}

          <button
            type="submit"
            disabled={submitting || !agreedTerms || !agreedPrivacy}
            className="w-full rounded-lg bg-gradient-to-r from-cyan-500 to-violet-500 hover:from-cyan-600 hover:to-violet-600 text-white font-semibold py-3 text-sm transition disabled:opacity-60"
          >
            {submitting ? "登録中..." : "アカウントを作成"}
          </button>

          <p className="text-center text-xs text-gray-400">
            既にアカウントをお持ちの方は <a href="/login" className="text-violet-500 hover:underline">ログイン</a>
          </p>
        </form>
      </div>
    </main>
  );
}
