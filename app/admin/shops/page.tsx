"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useToast, Toast } from "@/components/Toast";

type Agency = { id: string; name: string };

type Shop = {
  id: string;
  shopName?: string | null;
  name: string;
  email?: string | null;
  phone?: string | null;
  loginId?: string | null;
  address?: string | null;
  industry?: string | null;
  agencyId?: string | null;
  agencyName?: string | null;
  firstSurveyId?: string | null;
  googleBusinessUrl?: string | null;
  monthlyReviewLimit: number;
  contractStart?: string | null;
  contractEnd?: string | null;
  noContractLimit?: boolean;
  sessionCount?: number;
  stripeSubscriptionId?: string | null;
  planType?: string | null;
};

type EditForm = {
  shopName: string;
  address: string;
  phone: string;
  googleBusinessUrl: string;
  industry: string;
  agencyId: string;
  monthlyReviewLimit: number;
  email: string;
  password: string;
  contractStart: string;
  contractEnd: string;
  noContractLimit: boolean;
  staffName: string;
  planType: string;
};

const emptyEdit = (): EditForm => ({
  shopName: "", address: "", phone: "", googleBusinessUrl: "", industry: "",
  agencyId: "", monthlyReviewLimit: 100, email: "", password: "",
  contractStart: "", contractEnd: "", noContractLimit: false,
  staffName: "", planType: "",
});

export default function ShopsPage() {
  const router = useRouter();
  const [shops, setShops] = useState<Shop[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [error, setError] = useState<string | null>(null);
  const [agencies, setAgencies] = useState<Agency[]>([]);
  const [industries, setIndustries] = useState<string[]>([]);

  // Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [editingShop, setEditingShop] = useState<Shop | null>(null);
  const [form, setForm] = useState<EditForm>(emptyEdit());
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Add modal
  const [addOpen, setAddOpen] = useState(false);
  const [addForm, setAddForm] = useState({
    shopName: "", email: "", loginId: "", password: "",
    address: "", phone: "", industry: "", agencyId: "", monthlyReviewLimit: 100,
    contractStart: "", contractEnd: "", noContractLimit: false,
    staffName: "",
  });
  const [addError, setAddError] = useState<string | null>(null);
  const [addSubmitting, setAddSubmitting] = useState(false);

  const { toast, showToast } = useToast();

  useEffect(() => {
    fetch("/api/admin/agencies")
      .then((r) => r.json())
      .then((data) => setAgencies(Array.isArray(data) ? data : []))
      .catch(() => {});
    fetch("/api/admin/industries")
      .then((r) => r.json())
      .then((data) => setIndustries(Array.isArray(data) ? data.map((d) => d.name) : []))
      .catch(() => {});
  }, []);

  const toggleSort = (key: string) => {
    if (sortKey === key) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
    setPage(1);
  };


  const fetchShops = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        page: String(page), limit: "20",
        ...(search ? { search } : {}),
        ...(sortKey ? { sortKey, sortDir } : {}),
      });
      const res = await fetch(`/api/admin/shops?${params}`);
      if (!res.ok) throw new Error("取得に失敗しました");
      const data = await res.json();
      const list = (data.shops ?? []).map((s: Shop & { agency?: { name: string } }) => ({
        ...s,
        agencyName: s.agency ? (s.agency as { name: string }).name : null,
      }));
      setShops(list);
      setTotal(data.total ?? 0);
      setTotalPages(data.totalPages ?? 1);
    } catch (e) {
      setError(e instanceof Error ? e.message : "エラー");
    } finally {
      setLoading(false);
    }
  }, [page, search, sortKey, sortDir]);

  useEffect(() => { fetchShops(); }, [fetchShops]);

  const openEdit = (shop: Shop) => {
    setEditingShop(shop);
    setForm({
      shopName: shop.shopName ?? shop.name,
      address: shop.address ?? "",
      phone: shop.phone ?? "",
      googleBusinessUrl: shop.googleBusinessUrl ?? "",
      industry: shop.industry ?? "",
      contractStart: shop.contractStart ? new Date(shop.contractStart).toISOString().split("T")[0] : "",
      contractEnd: shop.contractEnd ? new Date(shop.contractEnd).toISOString().split("T")[0] : "",
      noContractLimit: shop.noContractLimit ?? false,
      staffName: shop.name ?? "",
      agencyId: shop.agencyId ?? "",
      monthlyReviewLimit: shop.monthlyReviewLimit,
      planType: shop.planType ?? "",
      email: "",
      password: "",
    });
    setFormError(null);
    setModalOpen(true);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingShop) return;
    setFormError(null);
    setSubmitting(true);
    try {
      const payload: Record<string, unknown> = {
        shopName: form.shopName.trim(),
        address: form.address.trim(),
        phone: form.phone.trim() || null,
        googleBusinessUrl: form.googleBusinessUrl.trim(),
        industry: form.industry,
        contractStart: form.contractStart || null,
        contractEnd: form.contractEnd || null,
        noContractLimit: form.noContractLimit,
        name: form.staffName.trim() || undefined,
        agencyId: form.agencyId || null,
        monthlyReviewLimit: form.monthlyReviewLimit,
        planType: form.planType || null,
      };
      if (form.email.trim()) payload.email = form.email.trim();
      if (form.password.trim()) payload.password = form.password.trim();
      const res = await fetch(`/api/admin/shops/${editingShop.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        throw new Error(d.error ?? "更新に失敗しました");
      }
      setModalOpen(false);
      showToast("更新しました", "success");
      fetchShops();
    } catch (e) {
      showToast(e instanceof Error ? e.message : "更新に失敗しました", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancelContract = async (shop: Shop) => {
    if (!confirm(`「${shop.shopName ?? shop.name}」の契約を解約しますか？Stripeのサブスクリプションもキャンセルされます。`)) return;
    try {
      const res = await fetch(`/api/admin/shops/${shop.id}/cancel`, { method: "POST" });
      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.error || "解約に失敗しました");
      }
      showToast("解約処理が完了しました", "success");
      fetchShops();
    } catch (e) {
      showToast(e instanceof Error ? e.message : "解約に失敗しました", "error");
    }
  };

  const handleDelete = async (shop: Shop) => {
    if (!confirm(`「${shop.shopName ?? shop.name}」を削除しますか？`)) return;
    try {
      const res = await fetch(`/api/admin/shops/${shop.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("削除に失敗しました");
      showToast("削除しました", "success");
      fetchShops();
    } catch (e) {
      showToast(e instanceof Error ? e.message : "削除に失敗しました", "error");
    }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddError(null);
    if (!addForm.shopName.trim()) { setAddError("ショップ名を入力してください"); return; }
    // loginId is auto-generated
    if (!addForm.password.trim()) { setAddError("パスワードを入力してください"); return; }
    setAddSubmitting(true);
    try {
      const res = await fetch("/api/admin/shops", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: addForm.staffName.trim() || addForm.shopName.trim(),
          shopName: addForm.shopName.trim(),
          email: addForm.email.trim() || null,
          loginId: addForm.loginId.trim(),
          password: addForm.password.trim(),
          address: addForm.address.trim() || null,
          phone: addForm.phone.trim() || null,
          industry: addForm.industry || null,
          contractStart: addForm.contractStart || undefined,
          contractEnd: addForm.contractEnd || undefined,
          noContractLimit: addForm.noContractLimit,
          agencyId: addForm.agencyId || null,
          monthlyReviewLimit: addForm.monthlyReviewLimit,
        }),
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        throw new Error(d.error ?? "登録に失敗しました");
      }
      setAddOpen(false);
      setAddForm({ shopName: "", email: "", loginId: "", password: "", address: "", phone: "", industry: "", agencyId: "", monthlyReviewLimit: 100, contractStart: "", contractEnd: "", noContractLimit: false, staffName: "" });
      showToast("新規ショップを登録しました", "success");
      fetchShops();
    } catch (e) {
      setAddError(e instanceof Error ? e.message : "エラー");
    } finally {
      setAddSubmitting(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearch(searchInput);
    setPage(1);
  };

  const inputCls = "w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent";

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <h1 className="text-xl md:text-2xl font-bold text-gray-900">ショップ管理</h1>
        <div className="flex gap-2 w-full sm:w-auto">
          <button
            onClick={async () => {
              try {
                const res = await fetch("/api/admin/invite");
                const d = await res.json();
                await navigator.clipboard.writeText(d.url);
                showToast("招待リンクをコピーしました", "success");
              } catch { showToast("コピーに失敗しました", "error"); }
            }}
            className="flex items-center gap-2 px-4 py-2 border border-violet-400 text-violet-600 font-semibold rounded-xl hover:bg-violet-50 transition-colors text-sm flex-1 sm:flex-none justify-center"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
            招待リンクをコピー
          </button>
          <button
            onClick={() => setAddOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-500 to-violet-500 hover:from-cyan-600 hover:to-violet-600 text-white font-semibold rounded-xl shadow transition-colors text-sm flex-1 sm:flex-none justify-center"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            新規ショップ登録
          </button>
        </div>
      </div>

      {/* Stats + Search */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
        <p className="text-sm font-semibold text-gray-700">総ショップ数: {total}</p>
        <form onSubmit={handleSearch} className="flex items-center gap-2 w-full sm:w-auto">
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="ショップ名で検索"
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400 w-full sm:w-48"
          />
          <button type="submit" className="p-2 bg-violet-500 rounded-lg hover:bg-violet-600 transition-colors shrink-0">
            <svg className="w-4 h-4 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
        </form>
      </div>

      {error && <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">{error}</div>}

      {/* Table - Desktop */}
      <div className="hidden md:block bg-white rounded-xl shadow-sm border border-gray-100 overflow-x-auto">
        <table className="w-full text-sm min-w-[800px]">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              <th className="text-left px-4 py-3 font-semibold text-gray-700 cursor-pointer select-none hover:text-violet-600" onClick={() => toggleSort("shopName")}>顧客名{sortKey === "shopName" && (sortDir === "asc" ? " ▲" : " ▼")}</th>
              <th className="text-left px-4 py-3 font-semibold text-gray-700 cursor-pointer select-none hover:text-violet-600" onClick={() => toggleSort("name")}>担当者名{sortKey === "name" && (sortDir === "asc" ? " ▲" : " ▼")}</th>
              <th className="text-left px-4 py-3 font-semibold text-gray-700 cursor-pointer select-none hover:text-violet-600" onClick={() => toggleSort("sessionCount")}>アクセス回数{sortKey === "sessionCount" && (sortDir === "asc" ? " ▲" : " ▼")}</th>
              <th className="text-left px-4 py-3 font-semibold text-gray-700 cursor-pointer select-none hover:text-violet-600" onClick={() => toggleSort("contractDays")}>契約残日数{sortKey === "contractDays" && (sortDir === "asc" ? " ▲" : " ▼")}</th>
              <th className="text-left px-4 py-3 font-semibold text-gray-700">プラン</th>
              <th className="text-left px-4 py-3 font-semibold text-gray-700">メール</th>
              <th className="text-left px-4 py-3 font-semibold text-gray-700">住所</th>
              <th className="text-left px-4 py-3 font-semibold text-gray-700">代理店</th>
              <th className="text-right px-4 py-3 font-semibold text-gray-700">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading && (
              <tr><td colSpan={4} className="text-center py-12 text-gray-400">読み込み中...</td></tr>
            )}
            {!loading && shops.length === 0 && (
              <tr><td colSpan={4} className="text-center py-12 text-gray-400">ショップが見つかりません</td></tr>
            )}
            {!loading && shops.map((shop) => (
              <tr key={shop.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3">
                  <div className="font-medium text-gray-900">{shop.shopName ?? shop.name}</div>
                  <div className="text-xs text-gray-400">{shop.loginId ?? ""}</div>
                </td>
                <td className="px-4 py-3 text-sm text-gray-600">{shop.name}</td>
                <td className="px-4 py-3 text-sm text-gray-700 font-medium">{shop.sessionCount ?? 0}回</td>
                <td className="px-4 py-3 text-sm">
                  {shop.noContractLimit ? (
                    <span className="text-gray-400">無期限</span>
                  ) : shop.contractEnd ? (() => {
                    const days = Math.ceil((new Date(shop.contractEnd).getTime() - new Date().getTime()) / (1000*60*60*24));
                    return days > 0 ? (
                      <span className={`font-medium ${days <= 7 ? "text-red-500" : days <= 30 ? "text-yellow-600" : "text-green-600"}`}>残り{days}日</span>
                    ) : (
                      <span className="font-medium text-red-500">契約終了</span>
                    );
                  })() : (
                    <span className="text-gray-400">未設定</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  {(() => {
                    const p = shop.planType;
                    if (!p) return <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-500">無料</span>;
                    const labels: Record<string, { label: string; cls: string }> = {
                      light: { label: "ライト", cls: "bg-blue-100 text-blue-700" },
                      standard: { label: "スタンダード", cls: "bg-violet-100 text-violet-700" },
                      premium: { label: "プレミアム", cls: "bg-amber-100 text-amber-700" },
                      lifetime_light: { label: "永年ライト", cls: "bg-blue-100 text-blue-700" },
                      lifetime_standard: { label: "永年スタンダード", cls: "bg-violet-100 text-violet-700" },
                      lifetime_premium: { label: "永年プレミアム", cls: "bg-amber-100 text-amber-700" },
                    };
                    const info = labels[p] || { label: p, cls: "bg-gray-100 text-gray-600" };
                    return <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${info.cls}`}>{info.label}</span>;
                  })()}
                </td>
                <td className="px-4 py-3 text-xs text-gray-500 max-w-[180px] truncate">{shop.email ?? "—"}</td>
                <td className="px-4 py-3 text-gray-600 max-w-xs truncate">{shop.address ?? "—"}</td>
                <td className="px-4 py-3 text-gray-600">{shop.agencyName ?? "—"}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-2">
                    {shop.firstSurveyId && (
                      <button
                        onClick={() => router.push(`/dashboard/surveys/${shop.firstSurveyId}/settings`)}
                        className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-lg bg-blue-500 hover:bg-blue-600 text-white transition-colors"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                        アンケート
                      </button>
                    )}
                    <button
                      onClick={() => openEdit(shop)}
                      className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-lg bg-gradient-to-r from-cyan-500 to-violet-500 hover:from-cyan-600 hover:to-violet-600 text-white transition-colors"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                      編集
                    </button>
                    <button
                      onClick={() => handleCancelContract(shop)}
                      disabled={!shop.stripeSubscriptionId && !shop.planType}
                      className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-lg bg-orange-500 hover:bg-orange-600 text-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      解約
                    </button>
                    <button
                      onClick={() => handleDelete(shop)}
                      className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-lg bg-red-500 hover:bg-red-600 text-white transition-colors"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                      削除
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-3">
        {loading && <p className="text-center py-8 text-gray-400 text-sm">読み込み中...</p>}
        {!loading && shops.length === 0 && <p className="text-center py-8 text-gray-400 text-sm">ショップが見つかりません</p>}
        {!loading && shops.map((shop) => {
          const planLabelsM: Record<string, { label: string; cls: string }> = {
            light: { label: "ライト", cls: "bg-blue-100 text-blue-700" },
            standard: { label: "スタンダード", cls: "bg-violet-100 text-violet-700" },
            premium: { label: "プレミアム", cls: "bg-amber-100 text-amber-700" },
            lifetime_light: { label: "永年ライト", cls: "bg-blue-100 text-blue-700" },
            lifetime_standard: { label: "永年スタンダード", cls: "bg-violet-100 text-violet-700" },
            lifetime_premium: { label: "永年プレミアム", cls: "bg-amber-100 text-amber-700" },
          };
          const planInfo = shop.planType ? planLabelsM[shop.planType] || { label: shop.planType, cls: "bg-gray-100 text-gray-600" } : { label: "無料", cls: "bg-gray-100 text-gray-500" };
          const contractLabel = shop.noContractLimit ? "無期限" : shop.contractEnd ? (() => {
            const days = Math.ceil((new Date(shop.contractEnd).getTime() - Date.now()) / 86400000);
            return days > 0 ? `残り${days}日` : "契約終了";
          })() : "未設定";

          return (
            <div key={shop.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="font-bold text-gray-900">{shop.shopName ?? shop.name}</p>
                  <p className="text-xs text-gray-400">{shop.loginId}</p>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${planInfo.cls}`}>{planInfo.label}</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs mb-3">
                <div><span className="text-gray-400">担当者: </span><span className="text-gray-700">{shop.name}</span></div>
                <div><span className="text-gray-400">アクセス: </span><span className="text-gray-700">{shop.sessionCount ?? 0}回</span></div>
                <div><span className="text-gray-400">契約: </span><span className="text-gray-700">{contractLabel}</span></div>
                <div><span className="text-gray-400">メール: </span><span className="text-gray-700 truncate">{shop.email ?? "—"}</span></div>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {shop.firstSurveyId && (
                  <button onClick={() => router.push(`/dashboard/surveys/${shop.firstSurveyId}/settings`)}
                    className="px-2.5 py-1.5 text-xs font-medium rounded-lg bg-blue-500 text-white">アンケート</button>
                )}
                <button onClick={() => openEdit(shop)}
                  className="px-2.5 py-1.5 text-xs font-medium rounded-lg bg-gradient-to-r from-cyan-500 to-violet-500 text-white">編集</button>
                <button onClick={() => handleCancelContract(shop)} disabled={!shop.stripeSubscriptionId && !shop.planType}
                  className="px-2.5 py-1.5 text-xs font-medium rounded-lg bg-orange-500 text-white disabled:opacity-40">解約</button>
                <button onClick={() => handleDelete(shop)}
                  className="px-2.5 py-1.5 text-xs font-medium rounded-lg bg-red-500 text-white">削除</button>
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
          <span className="text-sm text-gray-600">ページ {page} / {totalPages}</span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page >= totalPages}
            className="px-4 py-2 text-sm border border-gray-300 rounded-lg disabled:opacity-40 hover:bg-gray-50 transition-colors"
          >
            次へ
          </button>
        </div>
      )}

      {/* Edit Modal */}
      {modalOpen && editingShop && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setModalOpen(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-violet-500 rounded-t-2xl px-5 py-4 flex items-center justify-between">
              <h2 className="text-base font-bold text-gray-900">ショップ編集</h2>
              <button onClick={() => setModalOpen(false)} className="text-gray-700 hover:text-gray-900">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <form onSubmit={handleUpdate} className="p-5 space-y-4">
              {formError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">{formError}</div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">ショップ名</label>
                <input type="text" value={form.shopName} onChange={(e) => setForm({ ...form, shopName: e.target.value })} className={inputCls} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">電話番号 <span className="text-red-500">*</span></label>
                <input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="090-0000-0000" className={inputCls} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">住所</label>
                <input type="text" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} className={inputCls} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Googleレビュー URL</label>
                <input type="url" value={form.googleBusinessUrl} onChange={(e) => setForm({ ...form, googleBusinessUrl: e.target.value })} placeholder="https://g.page/r/..." className={inputCls} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">業種</label>
                <select value={form.industry} onChange={(e) => setForm({ ...form, industry: e.target.value })} className={inputCls}>
                  <option value="">選択してください</option>
                  {industries.map((i) => <option key={i} value={i}>{i}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">代理店（オプション）</label>
                <select value={form.agencyId} onChange={(e) => setForm({ ...form, agencyId: e.target.value })} className={inputCls}>
                  <option value="">なし</option>
                  {agencies.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">プラン</label>
                <select value={form.planType} onChange={(e) => setForm({ ...form, planType: e.target.value })} className={inputCls}>
                  <option value="">未設定</option>
                  <option value="standard">スタンダード</option>
                  <option value="premium">プレミアム</option>
                  <option value="chain3">チェーン3店舗</option>
                  <option value="chain5">チェーン5店舗</option>
                  <option value="agency5">エージェンシー5店舗</option>
                  <option value="agency10">エージェンシー10店舗</option>
                  <option value="agency30">エージェンシー30店舗〜</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">月間レビュー生成制限</label>
                <label className="block text-sm font-medium text-gray-700 mb-1">契約期間</label>
                <label className="flex items-center gap-2 mb-2 cursor-pointer">
                  <input type="checkbox" checked={form.noContractLimit} onChange={(e) => setForm({ ...form, noContractLimit: e.target.checked })} className="rounded border-gray-300 text-violet-500 focus:ring-violet-400" />
                  <span className="text-sm text-gray-700">設定なし（無期限）</span>
                </label>
                {!form.noContractLimit && (
                  <div className="flex gap-2 mb-4">
                    <input type="date" value={form.contractStart} onChange={(e) => setForm({ ...form, contractStart: e.target.value })} className={inputCls} />
                    <span className="self-center text-gray-400">〜</span>
                    <input type="date" value={form.contractEnd} onChange={(e) => setForm({ ...form, contractEnd: e.target.value })} className={inputCls} />
                  </div>
                )}
                <input type="number" min={0} value={form.monthlyReviewLimit} onChange={(e) => setForm({ ...form, monthlyReviewLimit: Number(e.target.value) })} className={inputCls} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">担当者名</label>
                <input type="text" value={form.staffName ?? ""} onChange={(e) => setForm({ ...form, staffName: e.target.value })} className={inputCls} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">新しいメールアドレス（変更する場合）</label>
                <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className={inputCls} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">新しいパスワード（変更する場合）</label>
                <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className={inputCls} />
              </div>
              <div className="flex items-center gap-3 pt-2">
                {editingShop.firstSurveyId && (
                  <button
                    type="button"
                    onClick={() => {
                      setModalOpen(false);
                      router.push(`/dashboard/surveys/${editingShop.firstSurveyId}/settings`);
                    }}
                    className="flex items-center gap-2 px-4 py-2.5 bg-blue-500 hover:bg-blue-600 text-white text-sm font-semibold rounded-xl transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    アンケート設定
                  </button>
                )}
                <button
                  type="submit"
                  disabled={submitting}
                  className="ml-auto flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-cyan-500 to-violet-500 hover:from-cyan-600 hover:to-violet-600 text-white text-sm font-semibold rounded-xl shadow transition-colors disabled:opacity-60"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                  </svg>
                  {submitting ? "更新中..." : "更新"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Modal */}
      {addOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setAddOpen(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-violet-500 rounded-t-2xl px-5 py-4 flex items-center justify-between">
              <h2 className="text-base font-bold text-gray-900">新規ショップ登録</h2>
              <button onClick={() => setAddOpen(false)} className="text-gray-700 hover:text-gray-900">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <form onSubmit={handleAdd} className="p-5 space-y-4">
              {addError && <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">{addError}</div>}
              {[
                { label: "ショップ名", key: "shopName", type: "text", required: true },
                { label: "担当者名", key: "staffName", type: "text", required: false },
                { label: "メールアドレス", key: "email", type: "email", required: false },
                { label: "ログインID（自動割り当て）", key: "loginId", type: "text", required: false, placeholder: "自動で割り当てられます", readOnly: true },
                { label: "パスワード", key: "password", type: "password", required: true },
                { label: "電話番号", key: "phone", type: "tel", required: true, placeholder: "090-0000-0000" },
                { label: "住所", key: "address", type: "text", required: false },
              ].map(({ label, key, type, required, placeholder, readOnly }: any) => (
                <div key={key}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {label}{required && <span className="text-red-500 ml-1">*</span>}
                  </label>
                  <input
                    type={type}
                    value={(addForm as Record<string, unknown>)[key] as string}
                    onChange={(e) => setAddForm({ ...addForm, [key]: e.target.value })}
                    placeholder={placeholder} readOnly={readOnly} disabled={readOnly}
                    className={inputCls}
                  />
                </div>
              ))}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">業種</label>
                <select value={addForm.industry} onChange={(e) => setAddForm({ ...addForm, industry: e.target.value })} className={inputCls}>
                  <option value="">選択してください</option>
                  {industries.map((i) => <option key={i} value={i}>{i}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">代理店</label>
                <select value={addForm.agencyId} onChange={(e) => setAddForm({ ...addForm, agencyId: e.target.value })} className={inputCls}>
                  <option value="">なし</option>
                  {agencies.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">月間レビュー制限</label>
                <label className="block text-sm font-medium text-gray-700 mb-1">契約期間</label>
                <label className="flex items-center gap-2 mb-2 cursor-pointer">
                  <input type="checkbox" checked={addForm.noContractLimit} onChange={(e) => setAddForm({ ...addForm, noContractLimit: e.target.checked })} className="rounded border-gray-300 text-violet-500 focus:ring-violet-400" />
                  <span className="text-sm text-gray-700">設定なし（無期限）</span>
                </label>
                {!addForm.noContractLimit && (
                  <div className="flex gap-2 mb-4">
                    <input type="date" value={addForm.contractStart} onChange={(e) => setAddForm({ ...addForm, contractStart: e.target.value })} className={inputCls} />
                    <span className="self-center text-gray-400">〜</span>
                    <input type="date" value={addForm.contractEnd} onChange={(e) => setAddForm({ ...addForm, contractEnd: e.target.value })} className={inputCls} />
                  </div>
                )}
                <input type="number" min={0} value={addForm.monthlyReviewLimit} onChange={(e) => setAddForm({ ...addForm, monthlyReviewLimit: Number(e.target.value) })} className={inputCls} />
              </div>
              <div className="flex justify-end pt-2">
                <button type="submit" disabled={addSubmitting} className="px-6 py-2.5 bg-gradient-to-r from-cyan-500 to-violet-500 hover:from-cyan-600 hover:to-violet-600 text-white font-semibold rounded-xl shadow transition-colors disabled:opacity-60 text-sm">
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
