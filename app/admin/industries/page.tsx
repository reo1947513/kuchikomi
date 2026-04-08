"use client";

import { useState, useEffect, useCallback } from "react";

type Industry = { id: string; name: string; order: number };

export default function IndustriesPage() {
  const [industries, setIndustries] = useState<Industry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingIndustry, setEditingIndustry] = useState<Industry | null>(null);
  const [name, setName] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [dragIdx, setDragIdx] = useState<number | null>(null);
  const [dragOverIdx, setDragOverIdx] = useState<number | null>(null);
  const [saveMsg, setSaveMsg] = useState<string | null>(null);

  const fetchIndustries = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/industries");
      if (!res.ok) throw new Error("取得に失敗しました");
      setIndustries(await res.json());
    } catch (e) {
      setError(e instanceof Error ? e.message : "エラー");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchIndustries(); }, [fetchIndustries]);

  const openAdd = () => {
    setEditingIndustry(null);
    setName("");
    setFormError(null);
    setModalOpen(true);
  };

  const openEdit = (industry: Industry) => {
    setEditingIndustry(industry);
    setName(industry.name);
    setFormError(null);
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) { setFormError("業種名を入力してください"); return; }
    setSubmitting(true);
    setFormError(null);
    try {
      const url = editingIndustry ? `/api/admin/industries/${editingIndustry.id}` : "/api/admin/industries";
      const method = editingIndustry ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim() }),
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        throw new Error(d.error ?? "保存に失敗しました");
      }
      setModalOpen(false);
      fetchIndustries();
    } catch (e) {
      setFormError(e instanceof Error ? e.message : "エラー");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (industry: Industry) => {
    if (!confirm(`「${industry.name}」を削除しますか？`)) return;
    try {
      const res = await fetch(`/api/admin/industries/${industry.id}`, { method: "DELETE" });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        throw new Error(d.error ?? "削除に失敗しました");
      }
      fetchIndustries();
    } catch (e) {
      alert(e instanceof Error ? e.message : "削除に失敗しました");
    }
  };

  const handleDrop = async (dropIdx: number) => {
    if (dragIdx === null || dragIdx === dropIdx) {
      setDragIdx(null);
      setDragOverIdx(null);
      return;
    }
    const updated = [...industries];
    const [moved] = updated.splice(dragIdx, 1);
    updated.splice(dropIdx, 0, moved);
    setIndustries(updated);
    setDragIdx(null);
    setDragOverIdx(null);

    try {
      const res = await fetch("/api/admin/industries", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ order: updated.map((i) => i.id) }),
      });
      if (res.ok) {
        setSaveMsg("並び順を保存しました");
        setTimeout(() => setSaveMsg(null), 2000);
      }
    } catch {}
  };

  const sortByName = async () => {
    const sorted = [...industries].sort((a, b) => a.name.localeCompare(b.name, "ja"));
    setIndustries(sorted);
    try {
      const res = await fetch("/api/admin/industries", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ order: sorted.map((i) => i.id) }),
      });
      if (res.ok) {
        setSaveMsg("あいうえお順に並べ替えました");
        setTimeout(() => setSaveMsg(null), 2000);
      }
    } catch {}
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-gray-900">業種管理</h1>
          <p className="text-sm text-gray-500 mt-1">ショップ登録時に選択できる業種の一覧</p>
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={sortByName}
            className="flex items-center gap-1.5 px-3 py-2 border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors text-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
            </svg>
            あいうえお順
          </button>
          <button
            onClick={openAdd}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-500 to-violet-500 hover:from-cyan-600 hover:to-violet-600 text-white font-semibold rounded-xl shadow transition-colors text-sm flex-1 sm:flex-none justify-center sm:justify-start"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            業種を追加
          </button>
        </div>
      </div>

      {error && <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">{error}</div>}

      {saveMsg && (
        <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
          <div className="bg-gray-900/90 text-white px-8 py-4 rounded-2xl shadow-2xl flex items-center gap-3 pointer-events-auto" style={{ animation: "toastIn 0.3s ease-out" }}>
            <svg className="w-6 h-6 text-green-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
            <span className="text-sm font-semibold">{saveMsg}</span>
          </div>
        </div>
      )}
      <style>{`@keyframes toastIn { from { opacity: 0; transform: scale(0.85); } to { opacity: 1; transform: scale(1); } }`}</style>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="px-4 py-2 border-b border-gray-100 text-xs text-gray-400">
          ドラッグ&ドロップで並び替えできます
        </div>
        <div className="divide-y divide-gray-100">
          {loading && (
            <p className="text-center py-12 text-gray-400 text-sm">読み込み中...</p>
          )}
          {!loading && industries.length === 0 && (
            <p className="text-center py-12 text-gray-400 text-sm">業種が登録されていません</p>
          )}
          {!loading && industries.map((industry, idx) => (
            <div
              key={industry.id}
              draggable
              onDragStart={() => setDragIdx(idx)}
              onDragOver={(e) => { e.preventDefault(); setDragOverIdx(idx); }}
              onDrop={() => handleDrop(idx)}
              onDragEnd={() => { setDragIdx(null); setDragOverIdx(null); }}
              className={`flex items-center gap-3 px-4 py-3 transition-colors ${
                dragIdx === idx ? "opacity-40" : ""
              } ${dragOverIdx === idx && dragIdx !== idx ? "bg-violet-50" : "hover:bg-gray-50"}`}
            >
              <button
                type="button"
                className="shrink-0 cursor-grab active:cursor-grabbing text-gray-300 hover:text-gray-500"
                title="ドラッグして並べ替え"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M7 2a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM13 2a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM7 8a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM13 8a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM7 14a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM13 14a2 2 0 1 0 0 4 2 2 0 0 0 0-4z" />
                </svg>
              </button>
              <span className="flex-1 font-medium text-sm text-gray-900">{industry.name}</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => openEdit(industry)}
                  className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-lg bg-gradient-to-r from-cyan-500 to-violet-500 hover:from-cyan-600 hover:to-violet-600 text-white transition-colors"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  編集
                </button>
                <button
                  onClick={() => handleDelete(industry)}
                  className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-lg bg-red-500 hover:bg-red-600 text-white transition-colors"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  削除
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setModalOpen(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm">
            <div className="bg-violet-500 rounded-t-2xl px-5 py-4 flex items-center justify-between">
              <h2 className="text-base font-bold text-gray-900">
                {editingIndustry ? "業種編集" : "業種追加"}
              </h2>
              <button onClick={() => setModalOpen(false)} className="text-gray-700 hover:text-gray-900">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              {formError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">{formError}</div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  業種名 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="例：飲食店"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent"
                />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded-xl text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  キャンセル
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2 bg-gradient-to-r from-cyan-500 to-violet-500 hover:from-cyan-600 hover:to-violet-600 text-white font-semibold rounded-xl shadow transition-colors disabled:opacity-60 text-sm"
                >
                  {submitting ? "保存中..." : editingIndustry ? "更新" : "追加"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
