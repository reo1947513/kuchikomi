"use client";

import { useState, useEffect } from "react";

type CaseStudy = {
  id: string; shopName: string; industry: string; title: string;
  content: string; result: string; rating: number; isPublished: boolean;
};

export default function CaseStudiesPage() {
  const [items, setItems] = useState<CaseStudy[]>([]);
  const [loading, setLoading] = useState(true);
  const [shopName, setShopName] = useState("");
  const [industry, setIndustry] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [result, setResult] = useState("");
  const [rating, setRating] = useState(5);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);

  const fetchItems = () => {
    fetch("/api/admin/case-studies").then((r) => r.json()).then((d) => setItems(Array.isArray(d) ? d : [])).catch(() => {}).finally(() => setLoading(false));
  };
  useEffect(() => { fetchItems(); }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!shopName.trim() || !title.trim() || !content.trim() || !result.trim()) { setError("必須項目を入力してください"); return; }
    setSubmitting(true); setError(null);
    try {
      const res = await fetch("/api/admin/case-studies", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ shopName, industry, title, content, result, rating }),
      });
      if (!res.ok) throw new Error("作成に失敗しました");
      setShopName(""); setIndustry(""); setTitle(""); setContent(""); setResult(""); setRating(5);
      fetchItems();
    } catch (e) { setError(e instanceof Error ? e.message : "エラー"); } finally { setSubmitting(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("削除しますか？")) return;
    await fetch(`/api/admin/case-studies/${id}`, { method: "DELETE" });
    fetchItems();
  };

  const handleToggle = async (item: CaseStudy) => {
    await fetch(`/api/admin/case-studies/${item.id}`, {
      method: "PUT", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isPublished: !item.isPublished }),
    });
    fetchItems();
  };

  const inputCls = "w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent";

  return (
    <div className="space-y-6">
      <h1 className="text-xl md:text-2xl font-bold text-gray-900">導入事例管理</h1>

      <div className="bg-white rounded-xl shadow-sm p-3 sm:p-5">
        <h2 className="text-sm font-semibold text-gray-800 mb-3">新規事例を追加</h2>
        <form onSubmit={handleAdd} className="space-y-3">
          {error && <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">{error}</div>}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">店舗名 *</label>
              <input type="text" value={shopName} onChange={(e) => setShopName(e.target.value)} placeholder="例：焼肉 花火" className={inputCls} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">業種</label>
              <input type="text" value={industry} onChange={(e) => setIndustry(e.target.value)} placeholder="例：飲食店" className={inputCls} />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">タイトル *</label>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="例：口コミ数が3倍に増加" className={inputCls} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">導入の背景・課題 *</label>
            <textarea value={content} onChange={(e) => setContent(e.target.value)} rows={3} placeholder="導入前の課題や状況" className={inputCls} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">導入後の成果 *</label>
            <textarea value={result} onChange={(e) => setResult(e.target.value)} rows={2} placeholder="具体的な成果や数値" className={inputCls} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">評価（★）</label>
            <select value={rating} onChange={(e) => setRating(Number(e.target.value))} className={inputCls + " w-24"}>
              {[5,4,3,2,1].map((n) => <option key={n} value={n}>{"★".repeat(n)}</option>)}
            </select>
          </div>
          <div className="flex justify-end">
            <button type="submit" disabled={submitting} className="px-5 py-2 bg-gradient-to-r from-cyan-500 to-violet-500 hover:from-cyan-600 hover:to-violet-600 text-white text-sm font-semibold rounded-xl shadow disabled:opacity-60">
              {submitting ? "作成中..." : "作成"}
            </button>
          </div>
        </form>
      </div>

      <div className="bg-white rounded-xl shadow-sm divide-y divide-gray-100">
        {loading ? <p className="p-6 text-center text-sm text-gray-400">読み込み中...</p> :
        items.length === 0 ? <p className="p-6 text-center text-sm text-gray-400">導入事例がまだありません</p> :
        items.map((item) => (
          <div key={item.id} className="px-3 sm:px-5 py-4 flex items-start gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-cyan-100 text-cyan-700">{item.industry || "未設定"}</span>
                <span className="text-sm font-medium text-gray-800">{item.shopName}</span>
                {!item.isPublished && <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-gray-200 text-gray-500">非公開</span>}
              </div>
              <p className="text-sm font-bold text-gray-700">{item.title}</p>
              <p className="text-xs text-gray-500 mt-1 line-clamp-2">{item.content}</p>
              <p className="text-xs text-amber-500 mt-1">{"★".repeat(item.rating)}</p>
            </div>
            <div className="flex flex-col gap-1.5 flex-shrink-0">
              <button onClick={() => handleToggle(item)} className={`px-3 py-1.5 text-xs font-medium rounded-lg ${item.isPublished ? "bg-gray-200 hover:bg-gray-300 text-gray-600" : "bg-green-500 hover:bg-green-600 text-white"}`}>
                {item.isPublished ? "非公開" : "公開"}
              </button>
              <button onClick={() => handleDelete(item.id)} className="px-3 py-1.5 text-xs font-medium rounded-lg bg-red-500 hover:bg-red-600 text-white">削除</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
