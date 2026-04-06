"use client";

import { useState, useEffect } from "react";

type Announcement = {
  id: string;
  title: string;
  content: string;
  category: string;
  isPublished: boolean;
  publishedAt: string;
  createdAt: string;
};

const CATEGORIES = ["新機能", "メンテナンス", "お知らせ", "重要"];

export default function AnnouncementsPage() {
  const [items, setItems] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("お知らせ");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [editCategory, setEditCategory] = useState("");

  const fetchItems = () => {
    fetch("/api/admin/announcements")
      .then((r) => r.json())
      .then((d) => setItems(Array.isArray(d) ? d : []))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchItems(); }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) { setError("タイトルと内容を入力してください"); return; }
    setSubmitting(true); setError(null);
    try {
      const res = await fetch("/api/admin/announcements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content, category }),
      });
      if (!res.ok) throw new Error("登録に失敗しました");
      setTitle(""); setContent(""); setCategory("お知らせ");
      fetchItems();
    } catch (e) {
      setError(e instanceof Error ? e.message : "エラー");
    } finally { setSubmitting(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("このお知らせを削除しますか？")) return;
    await fetch(`/api/admin/announcements/${id}`, { method: "DELETE" });
    fetchItems();
  };

  const handleTogglePublish = async (item: Announcement) => {
    await fetch(`/api/admin/announcements/${item.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isPublished: !item.isPublished }),
    });
    fetchItems();
  };

  const startEdit = (item: Announcement) => {
    setEditingId(item.id);
    setEditTitle(item.title);
    setEditContent(item.content);
    setEditCategory(item.category);
  };

  const handleUpdate = async () => {
    if (!editTitle.trim() || !editContent.trim()) return;
    setSubmitting(true);
    await fetch(`/api/admin/announcements/${editingId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: editTitle, content: editContent, category: editCategory }),
    });
    setEditingId(null);
    setSubmitting(false);
    fetchItems();
  };

  const categoryColor = (c: string) => {
    if (c === "新機能") return "bg-cyan-100 text-cyan-700";
    if (c === "重要") return "bg-red-100 text-red-700";
    if (c === "メンテナンス") return "bg-amber-100 text-amber-700";
    return "bg-gray-100 text-gray-600";
  };

  const formatDate = (d: string) => new Date(d).toLocaleDateString("ja-JP", { year: "numeric", month: "short", day: "numeric" });

  const inputCls = "w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent";

  return (
    <div className="space-y-6">
      <h1 className="text-xl md:text-2xl font-bold text-gray-900">お知らせ管理</h1>

      {/* Add form */}
      <div className="bg-white rounded-xl shadow-sm p-3 sm:p-5">
        <h2 className="text-sm font-semibold text-gray-800 mb-3">新規お知らせを作成</h2>
        <form onSubmit={handleAdd} className="space-y-3">
          {error && <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">{error}</div>}
          <div className="flex gap-3">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">タイトル</label>
              <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="例：新機能リリースのお知らせ" className={inputCls} />
            </div>
            <div className="w-36">
              <label className="block text-sm font-medium text-gray-700 mb-1">カテゴリ</label>
              <select value={category} onChange={(e) => setCategory(e.target.value)} className={inputCls}>
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">内容</label>
            <textarea value={content} onChange={(e) => setContent(e.target.value)} rows={4} placeholder="お知らせの詳細を入力" className={inputCls} />
          </div>
          <div className="flex justify-end">
            <button type="submit" disabled={submitting}
              className="px-5 py-2 bg-gradient-to-r from-cyan-500 to-violet-500 hover:from-cyan-600 hover:to-violet-600 text-white text-sm font-semibold rounded-xl shadow transition-colors disabled:opacity-60">
              {submitting ? "作成中..." : "作成"}
            </button>
          </div>
        </form>
      </div>

      {/* List */}
      <div className="bg-white rounded-xl shadow-sm divide-y divide-gray-100">
        {loading ? (
          <p className="p-6 text-center text-sm text-gray-400">読み込み中...</p>
        ) : items.length === 0 ? (
          <p className="p-6 text-center text-sm text-gray-400">お知らせがまだありません</p>
        ) : (
          items.map((item) => (
            <div key={item.id} className="px-3 sm:px-5 py-4">
              {editingId === item.id ? (
                <div className="space-y-3">
                  <input type="text" value={editTitle} onChange={(e) => setEditTitle(e.target.value)} className={inputCls} />
                  <select value={editCategory} onChange={(e) => setEditCategory(e.target.value)} className={inputCls}>
                    {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                  <textarea value={editContent} onChange={(e) => setEditContent(e.target.value)} rows={3} className={inputCls} />
                  <div className="flex justify-end gap-2">
                    <button onClick={() => setEditingId(null)} className="px-3 py-1.5 text-xs font-medium rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-700">キャンセル</button>
                    <button onClick={handleUpdate} disabled={submitting}
                      className="px-3 py-1.5 text-xs font-medium rounded-lg bg-gradient-to-r from-cyan-500 to-violet-500 text-white disabled:opacity-60">
                      {submitting ? "保存中..." : "保存"}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-start gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${categoryColor(item.category)}`}>{item.category}</span>
                      <span className="text-sm font-medium text-gray-800">{item.title}</span>
                      {!item.isPublished && <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-gray-200 text-gray-500">非公開</span>}
                    </div>
                    <p className="text-sm text-gray-600 whitespace-pre-wrap line-clamp-2">{item.content}</p>
                    <p className="text-xs text-gray-400 mt-1">{formatDate(item.publishedAt)}</p>
                  </div>
                  <div className="flex flex-col gap-1.5 flex-shrink-0">
                    <button onClick={() => handleTogglePublish(item)}
                      className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${item.isPublished ? "bg-gray-200 hover:bg-gray-300 text-gray-600" : "bg-green-500 hover:bg-green-600 text-white"}`}>
                      {item.isPublished ? "非公開" : "公開"}
                    </button>
                    <button onClick={() => startEdit(item)} className="px-3 py-1.5 text-xs font-medium rounded-lg bg-violet-500 hover:bg-violet-600 text-white">編集</button>
                    <button onClick={() => handleDelete(item.id)} className="px-3 py-1.5 text-xs font-medium rounded-lg bg-red-500 hover:bg-red-600 text-white">削除</button>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
