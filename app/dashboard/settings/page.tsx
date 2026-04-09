"use client";

import { useState, useEffect } from "react";
import { useToast, Toast } from "@/components/Toast";

type Me = {
  id: string;
  name: string;
  email?: string | null;
  loginId?: string | null;
  shopName?: string | null;
  address?: string | null;
  industry?: string | null;
  role: string;
  lineUserId?: string | null;
};

export default function SettingsPage() {
  const [me, setMe] = useState<Me | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [unlinking, setUnlinking] = useState(false);
  const { toast, showToast } = useToast();

  const [name, setName] = useState("");
  const [shopName, setShopName] = useState("");
  const [address, setAddress] = useState("");
  const [industry, setIndustry] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((data) => {
        setMe(data);
        setName(data.name ?? "");
        setShopName(data.shopName ?? "");
        setAddress(data.address ?? "");
        setIndustry(data.industry ?? "");
      })
      .catch(() => setError("情報の取得に失敗しました"))
      .finally(() => setLoading(false));

    // Handle LINE callback result from URL params
    const params = new URLSearchParams(window.location.search);
    const lineResult = params.get("line");
    if (lineResult === "success") {
      showToast("LINE連携が完了しました", "success");
      window.history.replaceState({}, "", window.location.pathname);
    } else if (lineResult === "error") {
      showToast("LINE連携に失敗しました。もう一度お試しください。", "error");
      window.history.replaceState({}, "", window.location.pathname);
    }
  }, []);

  // Auto-detect LINE linking when user returns to the page.
  // Handles cases where the OAuth callback completes in the background
  // (e.g., LINE in-app browser) and the user returns to this page.
  useEffect(() => {
    const checkLineLinking = () => {
      if (document.visibilityState !== "visible") return;
      fetch("/api/auth/me")
        .then((r) => r.json())
        .then((data) => {
          if (!data.lineUserId) return;
          setMe((prev) => {
            if (prev && !prev.lineUserId) {
              showToast("LINE連携が完了しました", "success");
            }
            return prev ? { ...prev, lineUserId: data.lineUserId } : prev;
          });
        })
        .catch(() => {});
    };

    document.addEventListener("visibilitychange", checkLineLinking);
    window.addEventListener("focus", checkLineLinking);
    return () => {
      document.removeEventListener("visibilitychange", checkLineLinking);
      window.removeEventListener("focus", checkLineLinking);
    };
  }, [showToast]);

  const handleSaveProfile = async () => {
    setSaving(true);
    setSaveMsg(null);
    setError(null);
    try {
      const res = await fetch("/api/auth/me", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, shopName, address, industry }),
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        throw new Error(d.error ?? "保存に失敗しました");
      }
      setSaveMsg("プロフィールを保存しました");
      setTimeout(() => setSaveMsg(null), 3000);
    } catch (e) {
      setError(e instanceof Error ? e.message : "エラーが発生しました");
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async () => {
    if (!newPassword || !currentPassword) {
      setError("現在のパスワードと新しいパスワードを入力してください");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("新しいパスワードが一致しません");
      return;
    }
    setSaving(true);
    setSaveMsg(null);
    setError(null);
    try {
      const res = await fetch("/api/auth/me", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        throw new Error(d.error ?? "パスワード変更に失敗しました");
      }
      setSaveMsg("パスワードを変更しました");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setTimeout(() => setSaveMsg(null), 3000);
    } catch (e) {
      setError(e instanceof Error ? e.message : "エラーが発生しました");
    } finally {
      setSaving(false);
    }
  };

  const handleUnlinkLine = async () => {
    if (!confirm("LINE連携を解除しますか？\nレビュー通知や月次レポートがLINEに届かなくなります。")) return;
    setUnlinking(true);
    try {
      const res = await fetch("/api/line/unlink", { method: "POST" });
      if (!res.ok) throw new Error("解除に失敗しました");
      setMe((prev) => prev ? { ...prev, lineUserId: null } : prev);
      setSaveMsg("LINE連携を解除しました");
      setTimeout(() => setSaveMsg(null), 3000);
    } catch (e) {
      setError(e instanceof Error ? e.message : "エラーが発生しました");
    } finally {
      setUnlinking(false);
    }
  };

  const inputCls =
    "w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent";

  return (
    <div className="space-y-6 max-w-2xl">
      <Toast toast={toast} />
      <h1 className="text-lg sm:text-xl font-bold text-gray-900">アカウント設定</h1>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">{error}</div>
      )}
      {saveMsg && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-xl text-green-700 text-sm">{saveMsg}</div>
      )}

      {loading ? (
        <div className="bg-white rounded-xl shadow p-12 text-center text-gray-400 text-sm">読み込み中...</div>
      ) : (
        <>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6 space-y-4">
            <h2 className="text-sm font-semibold text-gray-700">プロフィール</h2>
            {me?.loginId && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">ログインID</label>
                <input type="text" value={me.loginId} readOnly className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-gray-50 text-gray-500" />
              </div>
            )}
            {me?.email && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">メールアドレス</label>
                <input type="text" value={me.email} readOnly className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-gray-50 text-gray-500" />
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">担当者名</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} className={inputCls} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">店舗・会社名</label>
              <input type="text" value={shopName} onChange={(e) => setShopName(e.target.value)} className={inputCls} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">住所</label>
              <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} className={inputCls} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">業種</label>
              <input type="text" value={industry} onChange={(e) => setIndustry(e.target.value)} placeholder="例：飲食店、美容室" className={inputCls} />
            </div>
            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={handleSaveProfile}
                disabled={saving}
                className="px-6 py-2 bg-gradient-to-r from-cyan-500 to-violet-500 hover:from-cyan-600 hover:to-violet-600 text-white font-semibold rounded-xl shadow transition-colors disabled:opacity-60 text-sm"
              >
                {saving ? "保存中..." : "保存"}
              </button>
            </div>
          </div>

          {/* LINE連携 */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6 space-y-4">
            <h2 className="text-sm font-semibold text-gray-700">LINE連携</h2>
            {me?.lineUserId ? (
              <div className="space-y-3">
                <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <svg className="w-5 h-5 text-green-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm text-green-700 font-medium">LINE連携済み</span>
                </div>
                <p className="text-xs text-gray-500">レビュー受信時や月次レポートがLINEに届きます。</p>
                <button
                  onClick={handleUnlinkLine}
                  disabled={unlinking}
                  className="px-4 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 rounded-lg transition-colors disabled:opacity-60"
                >
                  {unlinking ? "解除中..." : "連携を解除"}
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-sm text-gray-600">
                  ComiSta公式LINEと連携すると、レビュー受信や月次レポートをLINEで通知できます。
                </p>
                <a
                  href="/api/line/auth"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#06C755] hover:bg-[#05b04c] text-white font-semibold rounded-xl shadow transition-colors text-sm"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.346 0 .627.285.627.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63.346 0 .628.285.628.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.282.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314" />
                  </svg>
                  LINEで連携する
                </a>
                <p className="text-xs text-gray-400">公式LINEの友だち追加も同時に行えます。</p>
              </div>
            )}
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6 space-y-4">
            <h2 className="text-sm font-semibold text-gray-700">パスワード変更</h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">現在のパスワード</label>
              <input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} className={inputCls} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">新しいパスワード</label>
              <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className={inputCls} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">新しいパスワード（確認）</label>
              <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className={inputCls} />
            </div>
            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={handleChangePassword}
                disabled={saving}
                className="px-6 py-2 bg-gradient-to-r from-cyan-500 to-violet-500 hover:from-cyan-600 hover:to-violet-600 text-white font-semibold rounded-xl shadow transition-colors disabled:opacity-60 text-sm"
              >
                {saving ? "変更中..." : "パスワード変更"}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
