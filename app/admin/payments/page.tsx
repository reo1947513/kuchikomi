"use client";

import { useState, useEffect, useCallback } from "react";
import { useToast, Toast } from "@/components/Toast";

type Payment = {
  id: string;
  userId: string;
  userName: string;
  amount: number;
  method: "bank_transfer" | "cash" | "stripe" | "other";
  status: "pending" | "paid" | "overdue";
  dueDate: string | null;
  paidAt: string | null;
  note: string | null;
  createdAt: string;
};

type User = {
  id: string;
  shopName?: string | null;
  name: string;
  stripeCustomerId?: string | null;
};

type StripeInvoice = {
  id: string;
  date: string;
  amount: number;
  status: string;
  url: string | null;
};

const METHOD_LABELS: Record<string, string> = {
  bank_transfer: "銀行振込",
  cash: "現金",
  stripe: "Stripe",
  other: "その他",
};

const STATUS_BADGES: Record<string, { label: string; cls: string }> = {
  pending: { label: "未入金", cls: "bg-yellow-100 text-yellow-700" },
  paid: { label: "入金済", cls: "bg-green-100 text-green-700" },
  overdue: { label: "期限超過", cls: "bg-red-100 text-red-700" },
};

type FilterTab = "all" | "pending" | "paid";

export default function PaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterTab>("all");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { toast, showToast } = useToast();

  // Add modal
  const [addOpen, setAddOpen] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [addForm, setAddForm] = useState({
    userId: "",
    amount: "",
    method: "bank_transfer" as string,
    dueDate: "",
    note: "",
  });
  const [addError, setAddError] = useState<string | null>(null);
  const [addSubmitting, setAddSubmitting] = useState(false);

  // Stripe section
  const [stripeCustomerUserId, setStripeCustomerUserId] = useState("");
  const [stripeInvoices, setStripeInvoices] = useState<StripeInvoice[]>([]);
  const [stripeLoading, setStripeLoading] = useState(false);

  const fetchPayments = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: "50",
      });
      if (filter !== "all") {
        params.set("status", filter);
      }
      const res = await fetch(`/api/admin/payments?${params}`);
      if (!res.ok) throw new Error("取得に失敗しました");
      const data = await res.json();
      setPayments(Array.isArray(data.payments) ? data.payments : Array.isArray(data) ? data : []);
      setTotalPages(data.totalPages ?? 1);
    } catch {
      showToast("入金データの取得に失敗しました", "error");
    } finally {
      setLoading(false);
    }
  }, [page, filter, showToast]);

  useEffect(() => {
    fetchPayments();
  }, [fetchPayments]);

  const fetchUsers = useCallback(async () => {
    if (users.length > 0) return;
    setUsersLoading(true);
    try {
      const res = await fetch("/api/admin/shops?role=admin&limit=1000");
      if (!res.ok) throw new Error();
      const data = await res.json();
      const list = (data.shops ?? data ?? []).map((u: User & Record<string, unknown>) => ({
        id: u.id,
        shopName: u.shopName,
        name: u.name,
        stripeCustomerId: u.stripeCustomerId ?? null,
      }));
      setUsers(list);
    } catch {
      // silent
    } finally {
      setUsersLoading(false);
    }
  }, [users.length]);

  const handleOpenAdd = () => {
    fetchUsers();
    setAddForm({ userId: "", amount: "", method: "bank_transfer", dueDate: "", note: "" });
    setAddError(null);
    setAddOpen(true);
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!addForm.userId) {
      setAddError("顧客を選択してください");
      return;
    }
    if (!addForm.amount || Number(addForm.amount) <= 0) {
      setAddError("金額を入力してください");
      return;
    }
    setAddSubmitting(true);
    setAddError(null);
    try {
      const res = await fetch("/api/admin/payments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: addForm.userId,
          amount: Number(addForm.amount),
          method: addForm.method,
          dueDate: addForm.dueDate || null,
          note: addForm.note || null,
        }),
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        throw new Error(d.error ?? "登録に失敗しました");
      }
      setAddOpen(false);
      showToast("入金を登録しました", "success");
      fetchPayments();
    } catch (e) {
      setAddError(e instanceof Error ? e.message : "登録に失敗しました");
    } finally {
      setAddSubmitting(false);
    }
  };

  const handleConfirmPaid = async (payment: Payment) => {
    if (!confirm(`「${payment.userName}」の入金を確認しますか？`)) return;
    try {
      const res = await fetch(`/api/admin/payments/${payment.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "paid", paidAt: new Date().toISOString() }),
      });
      if (!res.ok) throw new Error("更新に失敗しました");
      showToast("入金確認しました", "success");
      fetchPayments();
    } catch (e) {
      showToast(e instanceof Error ? e.message : "更新に失敗しました", "error");
    }
  };

  const handleDelete = async (payment: Payment) => {
    if (!confirm(`「${payment.userName}」の入金データを削除しますか？`)) return;
    try {
      const res = await fetch(`/api/admin/payments/${payment.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("削除に失敗しました");
      showToast("削除しました", "success");
      fetchPayments();
    } catch (e) {
      showToast(e instanceof Error ? e.message : "削除に失敗しました", "error");
    }
  };

  // Stripe invoices
  const handleStripeCustomerChange = async (userId: string) => {
    setStripeCustomerUserId(userId);
    if (!userId) {
      setStripeInvoices([]);
      return;
    }
    const user = users.find((u) => u.id === userId);
    if (!user?.stripeCustomerId) {
      setStripeInvoices([]);
      return;
    }
    setStripeLoading(true);
    try {
      const res = await fetch(`/api/admin/payments/stripe?customerId=${user.stripeCustomerId}`);
      if (!res.ok) throw new Error();
      const data = await res.json();
      setStripeInvoices(Array.isArray(data.invoices) ? data.invoices : Array.isArray(data) ? data : []);
    } catch {
      showToast("Stripe履歴の取得に失敗しました", "error");
      setStripeInvoices([]);
    } finally {
      setStripeLoading(false);
    }
  };

  const formatDate = (d: string | null) => {
    if (!d) return "—";
    return new Date(d).toLocaleDateString("ja-JP", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatAmount = (amount: number) => {
    return `¥${amount.toLocaleString()}`;
  };

  const inputCls =
    "w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent";

  const FILTER_TABS: { key: FilterTab; label: string }[] = [
    { key: "all", label: "全て" },
    { key: "pending", label: "未入金" },
    { key: "paid", label: "入金済" },
  ];

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <h1 className="text-xl md:text-2xl font-bold text-gray-900">入金管理</h1>
        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-500 to-violet-500 hover:from-cyan-600 hover:to-violet-600 text-white font-semibold rounded-xl shadow transition-colors text-sm"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          手動入金を登録
        </button>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-1 bg-gray-100 rounded-lg p-1 w-fit">
        {FILTER_TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => {
              setFilter(tab.key);
              setPage(1);
            }}
            className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${
              filter === tab.key
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block bg-white rounded-xl shadow-sm border border-gray-100 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              <th className="text-left px-3 py-3 font-semibold text-gray-700 whitespace-nowrap">顧客名</th>
              <th className="text-right px-3 py-3 font-semibold text-gray-700 whitespace-nowrap">金額</th>
              <th className="text-center px-3 py-3 font-semibold text-gray-700 whitespace-nowrap">支払方法</th>
              <th className="text-center px-3 py-3 font-semibold text-gray-700 whitespace-nowrap">ステータス</th>
              <th className="text-center px-3 py-3 font-semibold text-gray-700 whitespace-nowrap">期限日</th>
              <th className="text-center px-3 py-3 font-semibold text-gray-700 whitespace-nowrap">入金日</th>
              <th className="text-left px-3 py-3 font-semibold text-gray-700 whitespace-nowrap">メモ</th>
              <th className="text-right px-3 py-3 font-semibold text-gray-700 whitespace-nowrap">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading && (
              <tr>
                <td colSpan={8} className="text-center py-12 text-gray-400">
                  読み込み中...
                </td>
              </tr>
            )}
            {!loading && payments.length === 0 && (
              <tr>
                <td colSpan={8} className="text-center py-12 text-gray-400">
                  入金データがありません
                </td>
              </tr>
            )}
            {!loading &&
              payments.map((payment) => {
                const badge = STATUS_BADGES[payment.status] ?? STATUS_BADGES.pending;
                return (
                  <tr key={payment.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-3 py-3 font-medium text-gray-900 whitespace-nowrap">
                      {payment.userName}
                    </td>
                    <td className="px-3 py-3 text-right text-gray-700 whitespace-nowrap font-medium">
                      {formatAmount(payment.amount)}
                    </td>
                    <td className="px-3 py-3 text-center text-gray-600 whitespace-nowrap">
                      {METHOD_LABELS[payment.method] ?? payment.method}
                    </td>
                    <td className="px-3 py-3 text-center">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${badge.cls}`}
                      >
                        {badge.label}
                      </span>
                    </td>
                    <td className="px-3 py-3 text-center text-gray-600 whitespace-nowrap text-xs">
                      {formatDate(payment.dueDate)}
                    </td>
                    <td className="px-3 py-3 text-center text-gray-600 whitespace-nowrap text-xs">
                      {formatDate(payment.paidAt)}
                    </td>
                    <td className="px-3 py-3 text-gray-500 text-xs max-w-[200px] truncate">
                      {payment.note ?? "—"}
                    </td>
                    <td className="px-3 py-3">
                      <div className="flex items-center justify-end gap-2">
                        {payment.status !== "paid" && (
                          <button
                            onClick={() => handleConfirmPaid(payment)}
                            className="px-3 py-1.5 text-xs font-medium rounded-lg bg-green-500 hover:bg-green-600 text-white transition-colors"
                          >
                            入金確認
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(payment)}
                          className="px-3 py-1.5 text-xs font-medium rounded-lg bg-red-500 hover:bg-red-600 text-white transition-colors"
                        >
                          削除
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-3">
        {loading && (
          <p className="text-center py-8 text-gray-400 text-sm">読み込み中...</p>
        )}
        {!loading && payments.length === 0 && (
          <p className="text-center py-8 text-gray-400 text-sm">入金データがありません</p>
        )}
        {!loading &&
          payments.map((payment) => {
            const badge = STATUS_BADGES[payment.status] ?? STATUS_BADGES.pending;
            return (
              <div
                key={payment.id}
                className="bg-white rounded-xl shadow-sm border border-gray-100 p-4"
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="font-bold text-gray-900">{payment.userName}</p>
                    <p className="text-lg font-semibold text-gray-800 mt-0.5">
                      {formatAmount(payment.amount)}
                    </p>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs font-medium ${badge.cls}`}
                  >
                    {badge.label}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs mb-3">
                  <div>
                    <span className="text-gray-400">支払方法: </span>
                    <span className="text-gray-700">
                      {METHOD_LABELS[payment.method] ?? payment.method}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-400">期限日: </span>
                    <span className="text-gray-700">{formatDate(payment.dueDate)}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">入金日: </span>
                    <span className="text-gray-700">{formatDate(payment.paidAt)}</span>
                  </div>
                  {payment.note && (
                    <div className="col-span-2">
                      <span className="text-gray-400">メモ: </span>
                      <span className="text-gray-700">{payment.note}</span>
                    </div>
                  )}
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {payment.status !== "paid" && (
                    <button
                      onClick={() => handleConfirmPaid(payment)}
                      className="px-2.5 py-1.5 text-xs font-medium rounded-lg bg-green-500 text-white"
                    >
                      入金確認
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(payment)}
                    className="px-2.5 py-1.5 text-xs font-medium rounded-lg bg-red-500 text-white"
                  >
                    削除
                  </button>
                </div>
              </div>
            );
          })}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page <= 1}
            className="px-4 py-2 text-sm border border-gray-300 rounded-lg disabled:opacity-40 hover:bg-gray-50 transition-colors"
          >
            前へ
          </button>
          <span className="text-sm text-gray-600">
            ページ {page} / {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page >= totalPages}
            className="px-4 py-2 text-sm border border-gray-300 rounded-lg disabled:opacity-40 hover:bg-gray-50 transition-colors"
          >
            次へ
          </button>
        </div>
      )}

      {/* Stripe Invoices Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Stripe決済履歴</h2>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">顧客を選択</label>
          <select
            value={stripeCustomerUserId}
            onChange={(e) => handleStripeCustomerChange(e.target.value)}
            onFocus={fetchUsers}
            className={inputCls + " max-w-sm"}
          >
            <option value="">選択してください</option>
            {users.map((u) => (
              <option key={u.id} value={u.id}>
                {u.shopName ?? u.name}
                {u.stripeCustomerId ? "" : " (Stripe未連携)"}
              </option>
            ))}
          </select>
          {usersLoading && (
            <p className="text-xs text-gray-400 mt-1">顧客リスト読み込み中...</p>
          )}
        </div>

        {stripeLoading && (
          <p className="text-center py-6 text-gray-400 text-sm">読み込み中...</p>
        )}

        {!stripeLoading && stripeCustomerUserId && stripeInvoices.length === 0 && (
          <p className="text-center py-6 text-gray-400 text-sm">
            Stripe決済履歴がありません
          </p>
        )}

        {!stripeLoading && stripeInvoices.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="text-left px-3 py-2 font-semibold text-gray-700">日付</th>
                  <th className="text-right px-3 py-2 font-semibold text-gray-700">金額</th>
                  <th className="text-center px-3 py-2 font-semibold text-gray-700">ステータス</th>
                  <th className="text-center px-3 py-2 font-semibold text-gray-700">リンク</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {stripeInvoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-3 py-2 text-gray-700 whitespace-nowrap">
                      {formatDate(inv.date)}
                    </td>
                    <td className="px-3 py-2 text-right text-gray-700 whitespace-nowrap font-medium">
                      {formatAmount(inv.amount)}
                    </td>
                    <td className="px-3 py-2 text-center">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                          inv.status === "paid"
                            ? "bg-green-100 text-green-700"
                            : inv.status === "open"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {inv.status}
                      </span>
                    </td>
                    <td className="px-3 py-2 text-center">
                      {inv.url ? (
                        <a
                          href={inv.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-violet-600 hover:text-violet-800 underline text-xs"
                        >
                          詳細
                        </a>
                      ) : (
                        <span className="text-gray-400 text-xs">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Payment Modal */}
      {addOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setAddOpen(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-violet-500 rounded-t-2xl px-5 py-4 flex items-center justify-between">
              <h2 className="text-base font-bold text-gray-900">手動入金を登録</h2>
              <button
                onClick={() => setAddOpen(false)}
                className="text-gray-700 hover:text-gray-900"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <form onSubmit={handleAdd} className="p-5 space-y-4">
              {addError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                  {addError}
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  顧客<span className="text-red-500 ml-1">*</span>
                </label>
                <select
                  value={addForm.userId}
                  onChange={(e) => setAddForm({ ...addForm, userId: e.target.value })}
                  className={inputCls}
                >
                  <option value="">選択してください</option>
                  {users.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.shopName ?? u.name}
                    </option>
                  ))}
                </select>
                {usersLoading && (
                  <p className="text-xs text-gray-400 mt-1">読み込み中...</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  金額<span className="text-red-500 ml-1">*</span>
                </label>
                <input
                  type="number"
                  min={1}
                  value={addForm.amount}
                  onChange={(e) => setAddForm({ ...addForm, amount: e.target.value })}
                  placeholder="例: 10000"
                  className={inputCls}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">支払方法</label>
                <select
                  value={addForm.method}
                  onChange={(e) => setAddForm({ ...addForm, method: e.target.value })}
                  className={inputCls}
                >
                  <option value="bank_transfer">銀行振込</option>
                  <option value="cash">現金</option>
                  <option value="stripe">Stripe</option>
                  <option value="other">その他</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">期限日</label>
                <input
                  type="date"
                  value={addForm.dueDate}
                  onChange={(e) => setAddForm({ ...addForm, dueDate: e.target.value })}
                  className={inputCls}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">メモ</label>
                <textarea
                  value={addForm.note}
                  onChange={(e) => setAddForm({ ...addForm, note: e.target.value })}
                  rows={3}
                  placeholder="備考を入力"
                  className={inputCls}
                />
              </div>
              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setAddOpen(false)}
                  className="px-4 py-2.5 text-sm font-medium rounded-xl bg-gray-200 hover:bg-gray-300 text-gray-600 transition-colors"
                >
                  キャンセル
                </button>
                <button
                  type="submit"
                  disabled={addSubmitting}
                  className="ml-auto flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-cyan-500 to-violet-500 hover:from-cyan-600 hover:to-violet-600 text-white text-sm font-semibold rounded-xl shadow transition-colors disabled:opacity-60"
                >
                  {addSubmitting ? "登録中..." : "登録"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Toast toast={toast} />
    </div>
  );
}
