"use client";

import { useState, useEffect, useCallback } from "react";

// ---- Types ----
type Agency = {
  id: string;
  name: string;
};

type Shop = {
  id: string;
  shopName: string;
  email: string;
  loginId: string;
  address?: string | null;
  industry?: string | null;
  agencyId?: string | null;
  agencyName?: string | null;
  monthlyReviewLimit: number;
};

type FormData = {
  shopName: string;
  email: string;
  loginId: string;
  password: string;
  address: string;
  industry: string;
  agencyId: string;
  monthlyReviewLimit: number;
};

const INDUSTRIES = ["飲食店", "美容・サロン", "医療・クリニック", "整体・マッサージ", "その他"];
const PAGE_SIZE = 20;

const emptyForm = (): FormData => ({
  shopName: "",
  email: "",
  loginId: "",
  password: "",
  address: "",
  industry: "",
  agencyId: "",
  monthlyReviewLimit: 100,
});

export default function AdminPage() {
  const [shops, setShops] = useState<Shop[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [agencies, setAgencies] = useState<Agency[]>([]);

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [editingShop, setEditingShop] = useState<Shop | null>(null);
  const [formData, setFormData] = useState<FormData>(emptyForm());
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // ---- Fetch agencies once ----
  useEffect(() => {
    fetch("/api/admin/agencies")
      .then((r) => r.json())
      .then((data: Agency[]) => setAgencies(data))
      .catch(() => {});
  }, []);

  // ---- Fetch shops ----
  const fetchShops = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: String(PAGE_SIZE),
        ...(searchQuery.trim() ? { search: searchQuery.trim() } : {}),
      });
      const res = await fetch(`/api/admin/shops?${params}`);
      if (!res.ok) throw new Error("取得に失敗しました");
      const data = await res.json();
      setShops(Array.isArray(data) ? data : data.shops ?? []);
      setTotal(typeof data.total === "number" ? data.total : Array.isArray(data) ? data.length : 0);
    } catch (e) {
      setError(e instanceof Error ? e.message : "エラーが発生しました");
    } finally {
      setLoading(false);
    }
  }, [page, searchQuery]);

  useEffect(() => {
    fetchShops();
  }, [fetchShops]);

  // Reset page on search change
  const handleSearchChange = (v: string) => {
    setSearchQuery(v);
    setPage(1);
  };

  // ---- Open modal ----
  const openAdd = () => {
    setEditingShop(null);
    setFormData(emptyForm());
    setFormError(null);
    setModalOpen(true);
  };

  const openEdit = (shop: Shop) => {
    setEditingShop(shop);
    setFormData({
      shopName: shop.shopName,
      email: shop.email,
      loginId: shop.loginId,
      password: "",
      address: shop.address ?? "",
      industry: shop.industry ?? "",
      agencyId: shop.agencyId ?? "",
      monthlyReviewLimit: shop.monthlyReviewLimit,
    });
    setFormError(null);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingShop(null);
  };

  // ---- Form submit ----
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!formData.shopName.trim()) { setFormError("ショップ名を入力してください"); return; }
    if (!formData.email.trim()) { setFormError("メールアドレスを入力してください"); return; }
    if (!formData.loginId.trim()) { setFormError("ログインIDを入力してください"); return; }
    if (!editingShop && !formData.password.trim()) { setFormError("パスワードを入力してください"); return; }

    setSubmitting(true);
    try {
      const payload: Record<string, unknown> = {
        shopName: formData.shopName.trim(),
        email: formData.email.trim(),
        loginId: formData.loginId.trim(),
        address: formData.address.trim(),
        industry: formData.industry,
        agencyId: formData.agencyId || null,
        monthlyReviewLimit: formData.monthlyReviewLimit,
      };
      if (formData.password.trim()) payload.password = formData.password.trim();

      let res: Response;
      if (editingShop) {
        res = await fetch(`/api/admin/shops/${editingShop.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch("/api/admin/shops", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }

      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        throw new Error(d.error ?? "保存に失敗しました");
      }

      closeModal();
      fetchShops();
    } catch (e) {
      setFormError(e instanceof Error ? e.message : "エラーが発生しました");
    } finally {
      setSubmitting(false);
    }
  };

  // ---- Delete ----
  const handleDelete = async (shop: Shop) => {
    if (!confirm(`「${shop.shopName}」を削除してもよろしいですか？`)) return;
    try {
      const res = await fetch(`/api/admin/shops/${shop.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("削除に失敗しました");
      fetchShops();
    } catch (e) {
      alert(e instanceof Error ? e.message : "削除に失敗しました");
    }
  };

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  const setField = <K extends keyof FormData>(key: K, value: FormData[K]) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top bar */}
      <header className="bg-[#F5C518] shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <span className="text-xl font-black text-gray-900 tracking-tight">クチコミファースト</span>
          <span className="inline-flex items-center px-3 py-1 rounded-full bg-gray-900 text-white text-xs font-semibold">
            スーパー管理者
          </span>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page header */}
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">ショップ管理</h1>
            <p className="text-sm text-gray-500 mt-0.5">全{total}件</p>
          </div>
          <button
            type="button"
            onClick={openAdd}
            className="flex items-center gap-2 px-4 py-2 bg-[#F5C518] hover:bg-[#D4A017] text-gray-900 font-semibold rounded-xl shadow transition-colors text-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            新規ショップ追加
          </button>
        </div>

        {/* Search */}
        <div className="mb-4">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder="ショップ名で検索..."
            className="w-full max-w-sm border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#F5C518] focus:border-transparent"
          />
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
            {error}
          </div>
        )}

        {/* Table */}
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="text-left px-4 py-3 font-semibold text-gray-700">ショップ名</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-700">住所</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-700">業種</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-700">代理店</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-700">月間制限</th>
                  <th className="text-right px-4 py-3 font-semibold text-gray-700">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading && (
                  <tr>
                    <td colSpan={6} className="text-center py-10 text-gray-400">
                      読み込み中...
                    </td>
                  </tr>
                )}
                {!loading && shops.length === 0 && (
                  <tr>
                    <td colSpan={6} className="text-center py-10 text-gray-400">
                      ショップが見つかりません
                    </td>
                  </tr>
                )}
                {!loading &&
                  shops.map((shop) => (
                    <tr key={shop.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3">
                        <div className="font-medium text-gray-900">{shop.shopName}</div>
                        <div className="text-xs text-gray-400">{shop.email}</div>
                      </td>
                      <td className="px-4 py-3 text-gray-600">{shop.address ?? "—"}</td>
                      <td className="px-4 py-3 text-gray-600">{shop.industry ?? "—"}</td>
                      <td className="px-4 py-3 text-gray-600">{shop.agencyName ?? "—"}</td>
                      <td className="px-4 py-3 text-gray-600">{shop.monthlyReviewLimit}</td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => openEdit(shop)}
                            className="px-3 py-1.5 text-xs font-medium rounded-lg bg-[#F5C518] hover:bg-[#D4A017] text-gray-900 transition-colors"
                          >
                            編集
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(shop)}
                            className="px-3 py-1.5 text-xs font-medium rounded-lg border border-red-200 text-red-500 hover:bg-red-50 transition-colors"
                          >
                            削除
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-4">
            <p className="text-sm text-gray-500">
              {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, total)} / 全{total}件
            </p>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg disabled:opacity-40 hover:bg-gray-50 transition-colors"
              >
                前へ
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter((p) => Math.abs(p - page) <= 2)
                .map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPage(p)}
                    className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                      p === page
                        ? "bg-[#F5C518] text-gray-900 font-semibold"
                        : "border border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    {p}
                  </button>
                ))}
              <button
                type="button"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
                className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg disabled:opacity-40 hover:bg-gray-50 transition-colors"
              >
                次へ
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ===== Modal ===== */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40"
            onClick={closeModal}
          />
          {/* Modal content */}
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white rounded-t-2xl border-b border-gray-100 px-6 py-4 flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900">
                {editingShop ? "ショップ編集" : "新規ショップ追加"}
              </h2>
              <button
                type="button"
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {formError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                  {formError}
                </div>
              )}

              <ModalField label="ショップ名" required>
                <input
                  type="text"
                  value={formData.shopName}
                  onChange={(e) => setField("shopName", e.target.value)}
                  placeholder="例：美容室サンプル"
                  className={inputCls}
                />
              </ModalField>

              <ModalField label="メールアドレス" required>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setField("email", e.target.value)}
                  placeholder="shop@example.com"
                  className={inputCls}
                />
              </ModalField>

              <ModalField label="ログインID" required>
                <input
                  type="text"
                  value={formData.loginId}
                  onChange={(e) => setField("loginId", e.target.value)}
                  placeholder="AG-XXXXXX"
                  className={inputCls}
                />
              </ModalField>

              <ModalField label={editingShop ? "パスワード（変更する場合のみ）" : "パスワード"} required={!editingShop}>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setField("password", e.target.value)}
                  placeholder={editingShop ? "変更しない場合は空白" : "パスワードを入力"}
                  className={inputCls}
                />
              </ModalField>

              <ModalField label="住所">
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setField("address", e.target.value)}
                  placeholder="例：東京都渋谷区..."
                  className={inputCls}
                />
              </ModalField>

              <ModalField label="業種">
                <select
                  value={formData.industry}
                  onChange={(e) => setField("industry", e.target.value)}
                  className={selectCls}
                >
                  <option value="">選択してください</option>
                  {INDUSTRIES.map((ind) => (
                    <option key={ind} value={ind}>{ind}</option>
                  ))}
                </select>
              </ModalField>

              <ModalField label="代理店">
                <select
                  value={formData.agencyId}
                  onChange={(e) => setField("agencyId", e.target.value)}
                  className={selectCls}
                >
                  <option value="">なし</option>
                  {agencies.map((a) => (
                    <option key={a.id} value={a.id}>{a.name}</option>
                  ))}
                </select>
              </ModalField>

              <ModalField label="月間レビュー制限">
                <input
                  type="number"
                  min={0}
                  value={formData.monthlyReviewLimit}
                  onChange={(e) => setField("monthlyReviewLimit", Number(e.target.value))}
                  className={inputCls}
                />
              </ModalField>

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 py-2.5 bg-[#F5C518] hover:bg-[#D4A017] text-gray-900 font-semibold rounded-xl shadow transition-colors disabled:opacity-60 text-sm"
                >
                  {submitting ? "保存中..." : editingShop ? "更新" : "追加"}
                </button>
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 py-2.5 border border-gray-300 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  キャンセル
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// ---- Shared styles ----
const inputCls =
  "w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#F5C518] focus:border-transparent";
const selectCls =
  "w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#F5C518] focus:border-transparent bg-white";

function ModalField({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {children}
    </div>
  );
}
