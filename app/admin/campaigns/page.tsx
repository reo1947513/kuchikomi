"use client";

import { useState, useEffect } from "react";
import { useToast, Toast } from "@/components/Toast";

type Campaign = {
  id: string;
  title: string;
  content: string;
  target: string;
  isPublished: boolean;
  emailSent: boolean;
  emailSentAt: string | null;
  scheduledSendAt: string | null;
  startAt: string;
  endAt: string | null;
  createdAt: string;
};

const TARGETS = [
  { value: "all", label: "全ユーザー" },
  { value: "free", label: "無料ユーザー" },
  { value: "paid", label: "有料ユーザー" },
  { value: "cancelled", label: "解約済みユーザー" },
];

export default function CampaignsPage() {
  const [items, setItems] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [target, setTarget] = useState("all");
  const [startAt, setStartAt] = useState("");
  const [endAt, setEndAt] = useState("");
  const [scheduledSendAt, setScheduledSendAt] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sending, setSending] = useState<string | null>(null);
  const { toast, showToast } = useToast();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editStartAt, setEditStartAt] = useState("");
  const [editEndAt, setEditEndAt] = useState("");
  const [editScheduledSendAt, setEditScheduledSendAt] = useState("");

  const fetchItems = () => {
    fetch("/api/admin/campaigns")
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
      const res = await fetch("/api/admin/campaigns", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title, content, target,
          startAt: startAt ? new Date(startAt).toISOString() : undefined,
          endAt: endAt ? new Date(endAt).toISOString() : undefined,
          scheduledSendAt: scheduledSendAt ? new Date(scheduledSendAt).toISOString() : undefined,
        }),
      });
      if (!res.ok) throw new Error("作成に失敗しました");
      setTitle(""); setContent(""); setTarget("all"); setStartAt(""); setEndAt(""); setScheduledSendAt("");
      fetchItems();
    } catch (e) {
      setError(e instanceof Error ? e.message : "エラー");
    } finally { setSubmitting(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("このキャンペーンを削除しますか？")) return;
    try {
      const res = await fetch(`/api/admin/campaigns/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("削除に失敗しました");
      showToast("削除しました", "success");
      fetchItems();
    } catch (e) {
      showToast(e instanceof Error ? e.message : "削除に失敗しました", "error");
    }
  };

  const handleTogglePublish = async (item: Campaign) => {
    try {
      const res = await fetch(`/api/admin/campaigns/${item.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isPublished: !item.isPublished }),
      });
      if (!res.ok) throw new Error("更新に失敗しました");
      showToast(item.isPublished ? "非公開にしました" : "公開しました", "success");
      fetchItems();
    } catch (e) {
      showToast(e instanceof Error ? e.message : "更新に失敗しました", "error");
    }
  };

  const handleSendEmail = async (item: Campaign) => {
    if (item.scheduledSendAt && !item.emailSent) {
      const choice = confirm("予約送信が設定されています。\n\n「OK」→ 今すぐ送信\n「キャンセル」→ 何もしない");
      if (!choice) return;
    } else {
      if (!confirm("対象ユーザーにメールを一斉送信しますか？この操作は取り消せません。")) return;
    }
    setSending(item.id);
    try {
      const res = await fetch(`/api/admin/campaigns/${item.id}/send`, { method: "POST" });
      const d = await res.json();
      if (!res.ok) throw new Error(d.error || "送信に失敗しました");
      showToast(`${d.sent}/${d.total}件 送信しました`, "success");
      fetchItems();
    } catch (e) {
      showToast(e instanceof Error ? e.message : "送信に失敗しました", "error");
    } finally { setSending(null); }
  };

  const toLocalDatetime = (iso: string) => {
    const d = new Date(iso);
    const offset = d.getTimezoneOffset();
    const local = new Date(d.getTime() - offset * 60000);
    return local.toISOString().slice(0, 16);
  };

  const startEditDates = (item: Campaign) => {
    setEditingId(item.id);
    setEditStartAt(toLocalDatetime(item.startAt));
    setEditEndAt(item.endAt ? toLocalDatetime(item.endAt) : "");
    setEditScheduledSendAt(item.scheduledSendAt ? toLocalDatetime(item.scheduledSendAt) : "");
  };

  const handleSaveDates = async (id: string) => {
    await fetch(`/api/admin/campaigns/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        startAt: editStartAt ? new Date(editStartAt).toISOString() : new Date().toISOString(),
        endAt: editEndAt ? new Date(editEndAt).toISOString() : null,
        scheduledSendAt: editScheduledSendAt ? new Date(editScheduledSendAt).toISOString() : null,
      }),
    });
    setEditingId(null);
    fetchItems();
  };

  const getStatus = (item: Campaign) => {
    const now = new Date();
    const start = new Date(item.startAt);
    if (start > now) return { label: "予約中", cls: "bg-amber-100 text-amber-700" };
    if (item.endAt && new Date(item.endAt) < now) return { label: "終了", cls: "bg-gray-100 text-gray-500" };
    return { label: "配信中", cls: "bg-green-100 text-green-700" };
  };

  const targetLabel = (t: string) => TARGETS.find((x) => x.value === t)?.label || t;
  const targetColor = (t: string) => {
    if (t === "free") return "bg-gray-100 text-gray-600";
    if (t === "paid") return "bg-violet-100 text-violet-700";
    if (t === "cancelled") return "bg-red-100 text-red-600";
    return "bg-cyan-100 text-cyan-700";
  };
  const formatDate = (d: string) => {
    const date = new Date(d);
    return date.toLocaleDateString("ja-JP", { year: "numeric", month: "short", day: "numeric" })
      + " " + date.toLocaleTimeString("ja-JP", { hour: "2-digit", minute: "2-digit" });
  };

  const inputCls = "w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent";

  return (
    <div className="space-y-6">
      <h1 className="text-xl md:text-2xl font-bold text-gray-900">キャンペーン管理</h1>

      {/* Add form */}
      <div className="bg-white rounded-xl shadow-sm p-3 sm:p-5">
        <h2 className="text-sm font-semibold text-gray-800 mb-3">新規キャンペーン作成</h2>
        <form onSubmit={handleAdd} className="space-y-3">
          {error && <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">{error}</div>}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">タイトル</label>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="例：初月50%OFFキャンペーン" className={inputCls} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">内容</label>
            <textarea value={content} onChange={(e) => setContent(e.target.value)} rows={4} placeholder="キャンペーンの詳細を入力" className={inputCls} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">対象ユーザー</label>
            <select value={target} onChange={(e) => setTarget(e.target.value)} className={inputCls}>
              {TARGETS.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">表示開始日時（任意）</label>
              <input type="datetime-local" value={startAt} onChange={(e) => setStartAt(e.target.value)} className={inputCls} />
              <p className="text-xs text-gray-400 mt-0.5">未設定＝即時公開</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">表示終了日時（任意）</label>
              <input type="datetime-local" value={endAt} onChange={(e) => setEndAt(e.target.value)} className={inputCls} />
              <p className="text-xs text-gray-400 mt-0.5">未設定＝無期限</p>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">メール送信日時（任意）</label>
            <input type="datetime-local" value={scheduledSendAt} onChange={(e) => setScheduledSendAt(e.target.value)} className={inputCls} />
            <p className="text-xs text-gray-400 mt-0.5">設定すると指定日時に自動でメール送信されます。未設定の場合は手動送信。</p>
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
          <p className="p-6 text-center text-sm text-gray-400">キャンペーンがまだありません</p>
        ) : (
          items.map((item) => {
            const status = item.isPublished ? getStatus(item) : null;
            return (
            <div key={item.id} className="px-3 sm:px-5 py-4">
              <div className="flex items-start gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${targetColor(item.target)}`}>{targetLabel(item.target)}</span>
                    {status && <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${status.cls}`}>{status.label}</span>}
                    <span className="text-sm font-medium text-gray-800">{item.title}</span>
                    {!item.isPublished && <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-gray-200 text-gray-500">非公開</span>}
                    {item.emailSent && <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-600">メール送信済</span>}
                  </div>
                  <p className="text-sm text-gray-600 whitespace-pre-wrap line-clamp-2">{item.content}</p>
                  {editingId === item.id ? (
                    <div className="mt-2 space-y-2">
                      <div className="flex items-end gap-2 flex-wrap">
                        <div>
                          <label className="block text-xs text-gray-500 mb-0.5">表示開始</label>
                          <input type="datetime-local" value={editStartAt} onChange={(e) => setEditStartAt(e.target.value)}
                            className="border border-gray-300 rounded-lg px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-violet-400" />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-500 mb-0.5">表示終了</label>
                          <input type="datetime-local" value={editEndAt} onChange={(e) => setEditEndAt(e.target.value)}
                            className="border border-gray-300 rounded-lg px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-violet-400" />
                        </div>
                      </div>
                      {!item.emailSent && (
                        <div>
                          <label className="block text-xs text-gray-500 mb-0.5">メール送信日時</label>
                          <input type="datetime-local" value={editScheduledSendAt} onChange={(e) => setEditScheduledSendAt(e.target.value)}
                            className="border border-gray-300 rounded-lg px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-violet-400" />
                        </div>
                      )}
                      <div className="flex gap-2">
                        <button onClick={() => handleSaveDates(item.id)}
                          className="px-3 py-1 text-xs font-medium rounded-lg bg-violet-500 hover:bg-violet-600 text-white">保存</button>
                        <button onClick={() => setEditingId(null)}
                          className="px-3 py-1 text-xs font-medium rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-600">キャンセル</button>
                      </div>
                    </div>
                  ) : (
                    <div className="mt-1 cursor-pointer hover:text-violet-500" onClick={() => startEditDates(item)}>
                      <p className="text-xs text-gray-400">
                        表示: {formatDate(item.startAt)}{item.endAt ? ` 〜 ${formatDate(item.endAt)}` : " 〜 無期限"}
                        <span className="ml-1 text-gray-300">✎</span>
                      </p>
                      {item.scheduledSendAt && !item.emailSent && (
                        <p className="text-xs text-blue-500 mt-0.5">
                          📩 メール予約: {formatDate(item.scheduledSendAt)}
                        </p>
                      )}
                    </div>
                  )}
                </div>
                <div className="flex flex-col gap-1.5 flex-shrink-0">
                  <button onClick={() => handleTogglePublish(item)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${item.isPublished ? "bg-gray-200 hover:bg-gray-300 text-gray-600" : "bg-green-500 hover:bg-green-600 text-white"}`}>
                    {item.isPublished ? "非公開" : "公開"}
                  </button>
                  <button onClick={() => handleSendEmail(item)}
                    disabled={item.emailSent || sending === item.id}
                    className="px-3 py-1.5 text-xs font-medium rounded-lg bg-blue-500 hover:bg-blue-600 text-white transition-colors disabled:opacity-40">
                    {sending === item.id ? "送信中..." : item.emailSent ? "送信済" : item.scheduledSendAt ? "予約済" : "即時送信"}
                  </button>
                  <button onClick={() => handleDelete(item.id)}
                    className="px-3 py-1.5 text-xs font-medium rounded-lg bg-red-500 hover:bg-red-600 text-white">
                    削除
                  </button>
                </div>
              </div>
            </div>
            );
          })
        )}
      </div>
      <Toast toast={toast} />
    </div>
  );
}
