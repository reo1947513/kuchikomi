"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

type Me = {
  id: string;
  name: string;
  email?: string | null;
  loginId?: string | null;
  shopName?: string | null;
  address?: string | null;
  industry?: string | null;
  role: string;
};

export default function SettingsPage() {
  const [me, setMe] = useState<Me | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

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
  }, []);

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

  const inputCls =
    "w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#F5C518] focus:border-transparent";

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-[#F5C518] shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <span className="text-2xl font-black text-gray-900 tracking-tight">クチコミPlus</span>
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-gray-700">管理コンソール</span>
            <Link href="/api/auth/logout" className="text-sm text-gray-600 hover:text-gray-900 underline">
              ログアウト
            </Link>
          </div>
        </div>
      </header>

      <div className="flex flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 gap-8">
        <aside className="w-56 shrink-0">
          <nav className="bg-white rounded-xl shadow p-4 flex flex-col gap-1">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-3 mb-2">
              メニュー
            </p>
            <Link
              href="/dashboard"
              className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-gray-600 hover:bg-gray-100 text-sm transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              ダッシュボード
            </Link>
            <Link
              href="/dashboard/surveys"
              className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-gray-600 hover:bg-gray-100 text-sm transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              アンケート管理
            </Link>
            <Link
              href="/dashboard/settings"
              className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg bg-[#F5C518]/20 text-gray-900 font-medium text-sm"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              設定
            </Link>
          </nav>
        </aside>

        <main className="flex-1 min-w-0 space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">アカウント設定</h1>
            <p className="text-sm text-gray-500 mt-1">プロフィールやパスワードを管理します</p>
          </div>

          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
              {error}
            </div>
          )}
          {saveMsg && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-xl text-green-700 text-sm">
              {saveMsg}
            </div>
          )}

          {loading ? (
            <div className="bg-white rounded-xl shadow p-12 text-center text-gray-400 text-sm">
              読み込み中...
            </div>
          ) : (
            <>
              {/* Profile */}
              <div className="bg-white rounded-xl shadow p-6 space-y-4">
                <h2 className="text-base font-semibold text-gray-800">プロフィール</h2>
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
                  <input type="text" value={shopName} onChange={(e) => setShopName(e.target.value)} placeholder="例：ガイア株式会社" className={inputCls} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">住所</label>
                  <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} className={inputCls} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">業種</label>
                  <input type="text" value={industry} onChange={(e) => setIndustry(e.target.value)} placeholder="例：飲食店、美容室" className={inputCls} />
                </div>
                <div className="pt-2 flex justify-end">
                  <button
                    type="button"
                    onClick={handleSaveProfile}
                    disabled={saving}
                    className="px-6 py-2.5 bg-[#F5C518] hover:bg-[#D4A017] text-gray-900 font-semibold rounded-xl shadow transition-colors disabled:opacity-60 text-sm"
                  >
                    {saving ? "保存中..." : "保存"}
                  </button>
                </div>
              </div>

              {/* Password */}
              <div className="bg-white rounded-xl shadow p-6 space-y-4">
                <h2 className="text-base font-semibold text-gray-800">パスワード変更</h2>
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
                <div className="pt-2 flex justify-end">
                  <button
                    type="button"
                    onClick={handleChangePassword}
                    disabled={saving}
                    className="px-6 py-2.5 bg-[#F5C518] hover:bg-[#D4A017] text-gray-900 font-semibold rounded-xl shadow transition-colors disabled:opacity-60 text-sm"
                  >
                    {saving ? "変更中..." : "パスワード変更"}
                  </button>
                </div>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}
