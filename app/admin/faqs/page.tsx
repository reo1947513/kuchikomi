"use client";

import { useState, useEffect } from "react";

type Faq = {
  id: string;
  question: string;
  answer: string;
  order: number;
  createdAt: string;
};

export default function FaqsPage() {
  const [faqs, setFaqs] = useState<Faq[]>([]);
  const [loading, setLoading] = useState(true);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchFaqs = () => {
    fetch("/api/admin/faqs")
      .then((r) => r.json())
      .then((data) => setFaqs(Array.isArray(data) ? data : []))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchFaqs(); }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim() || !answer.trim()) {
      setError("質問と回答を入力してください");
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/faqs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: question.trim(), answer: answer.trim() }),
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        throw new Error(d.error ?? "登録に失敗しました");
      }
      setQuestion("");
      setAnswer("");
      fetchFaqs();
    } catch (e) {
      setError(e instanceof Error ? e.message : "エラー");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (faq: Faq) => {
    if (!confirm("この質問を削除しますか？")) return;
    try {
      await fetch(`/api/admin/faqs/${faq.id}`, { method: "DELETE" });
      fetchFaqs();
    } catch {
      alert("削除に失敗しました");
    }
  };

  const inputCls = "w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent";

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">質問管理（Q&A）</h1>

      {/* Add form */}
      <div className="bg-white rounded-xl shadow-sm p-5">
        <h2 className="text-sm font-semibold text-gray-800 mb-3">新規質問を追加</h2>
        <form onSubmit={handleAdd} className="space-y-3">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">{error}</div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">質問（Q）</label>
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="例：ComiStaとは何ですか？"
              className={inputCls}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">回答（A）</label>
            <textarea
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="回答を入力してください"
              rows={3}
              className={inputCls}
            />
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2 bg-gradient-to-r from-cyan-500 to-violet-500 hover:from-cyan-600 hover:to-violet-600 text-white text-sm font-semibold rounded-xl shadow transition-colors disabled:opacity-60"
            >
              {submitting ? "追加中..." : "追加"}
            </button>
          </div>
        </form>
      </div>

      {/* FAQ list */}
      <div className="bg-white rounded-xl shadow-sm divide-y divide-gray-100">
        {loading ? (
          <p className="p-6 text-center text-sm text-gray-400">読み込み中...</p>
        ) : faqs.length === 0 ? (
          <p className="p-6 text-center text-sm text-gray-400">質問がまだありません</p>
        ) : (
          faqs.map((faq) => (
            <div key={faq.id} className="px-5 py-4 flex items-start gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-r from-cyan-500 to-violet-500 flex items-center justify-center text-white text-xs font-bold">Q</span>
                  <span className="text-sm font-medium text-gray-800">{faq.question}</span>
                </div>
                <div className="flex items-start gap-2 ml-0.5">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 text-xs font-bold">A</span>
                  <p className="text-sm text-gray-600 whitespace-pre-wrap">{faq.answer}</p>
                </div>
              </div>
              <button
                onClick={() => handleDelete(faq)}
                className="flex-shrink-0 px-3 py-1.5 text-xs font-medium rounded-lg bg-red-500 hover:bg-red-600 text-white transition-colors"
              >
                削除
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
