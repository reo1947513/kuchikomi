"use client";

import { useState, useEffect } from "react";

type Contact = {
  id: string;
  category: string;
  contractStatus: string;
  companyName: string;
  lastName: string;
  firstName: string;
  email: string;
  phone: string;
  content: string;
  source: string;
  status: string;
  createdAt: string;
};

export default function ContactsPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [selected, setSelected] = useState<Contact | null>(null);

  useEffect(() => {
    fetch("/api/admin/contacts")
      .then((r) => r.json())
      .then((data) => setContacts(Array.isArray(data) ? data : []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const formatDate = (d: string) => {
    const date = new Date(d);
    return `${date.getFullYear()}/${String(date.getMonth() + 1).padStart(2, "0")}/${String(date.getDate()).padStart(2, "0")} ${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
  };

  const updateStatus = async (id: string, status: string) => {
    try {
      const res = await fetch(`/api/admin/contacts/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        setContacts((prev) => prev.map((c) => c.id === id ? { ...c, status } : c));
        if (selected && selected.id === id) setSelected({ ...selected, status });
      }
    } catch {}
  };

  const statusColor = (s: string) => {
    if (s === "対応済み") return "bg-green-50 border-green-300 text-green-700";
    if (s === "対応中") return "bg-yellow-50 border-yellow-300 text-yellow-700";
    return "bg-red-50 border-red-300 text-red-700";
  };

  const toggleSort = (key: string) => {
    if (sortKey === key) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  const sorted = [...contacts].sort((a, b) => {
    if (!sortKey) return 0;
    const dir = sortDir === "asc" ? 1 : -1;
    if (sortKey === "createdAt") return (new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()) * dir;
    const va = ((a as any)[sortKey] || "").toLowerCase();
    const vb = ((b as any)[sortKey] || "").toLowerCase();
    return va > vb ? dir : va < vb ? -dir : 0;
  });

  const filtered = sorted.filter((c) => {
    if (!search) return true;
    const s = search.toLowerCase();
    return (
      c.companyName.toLowerCase().includes(s) ||
      c.lastName.toLowerCase().includes(s) ||
      c.firstName.toLowerCase().includes(s) ||
      c.email.toLowerCase().includes(s) ||
      c.phone.includes(s) ||
      c.category.toLowerCase().includes(s) ||
      (c.status || "").toLowerCase().includes(s)
    );
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <h1 className="text-xl md:text-2xl font-bold text-gray-900">お問い合わせ管理</h1>
        <form onSubmit={(e) => { e.preventDefault(); setSearch(searchInput); }} className="flex items-center gap-2 w-full sm:w-auto">
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="会社名・名前・メールで検索"
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400 w-full sm:w-56"
          />
          <button type="submit" className="p-2 bg-violet-500 rounded-lg hover:bg-violet-600 transition-colors shrink-0">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
        </form>
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-400 text-sm">読み込み中...</div>
      ) : contacts.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-12 text-center text-gray-400 text-sm">
          お問い合わせはまだありません
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm overflow-x-auto">
          <table className="w-full text-sm min-w-[900px]">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left px-4 py-3 font-medium text-gray-600 cursor-pointer select-none hover:text-violet-600" onClick={() => toggleSort("createdAt")}>日時{sortKey === "createdAt" && (sortDir === "asc" ? " \u25B2" : " \u25BC")}</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600 cursor-pointer select-none hover:text-violet-600" onClick={() => toggleSort("category")}>項目{sortKey === "category" && (sortDir === "asc" ? " \u25B2" : " \u25BC")}</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600 cursor-pointer select-none hover:text-violet-600" onClick={() => toggleSort("contractStatus")}>契約状況{sortKey === "contractStatus" && (sortDir === "asc" ? " \u25B2" : " \u25BC")}</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600 cursor-pointer select-none hover:text-violet-600" onClick={() => toggleSort("companyName")}>会社名 / 店舗名{sortKey === "companyName" && (sortDir === "asc" ? " \u25B2" : " \u25BC")}</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600 cursor-pointer select-none hover:text-violet-600" onClick={() => toggleSort("lastName")}>名前{sortKey === "lastName" && (sortDir === "asc" ? " \u25B2" : " \u25BC")}</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600 cursor-pointer select-none hover:text-violet-600" onClick={() => toggleSort("email")}>メール{sortKey === "email" && (sortDir === "asc" ? " \u25B2" : " \u25BC")}</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">経由</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600 cursor-pointer select-none hover:text-violet-600" onClick={() => toggleSort("status")}>対応状況{sortKey === "status" && (sortDir === "asc" ? " \u25B2" : " \u25BC")}</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((c) => (
                <tr key={c.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 text-gray-500 whitespace-nowrap">{formatDate(c.createdAt)}</td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-violet-100 text-violet-700">{c.category}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${c.contractStatus === "契約中" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}`}>{c.contractStatus}</span>
                  </td>
                  <td className="px-4 py-3 text-gray-800">{c.companyName}</td>
                  <td className="px-4 py-3 text-gray-800">{c.lastName} {c.firstName}</td>
                  <td className="px-4 py-3 text-gray-500">{c.email}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${c.source === "hp" ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-600"}`}>
                      {c.source === "hp" ? "HP" : "管理画面"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <select
                      value={c.status || "未対応"}
                      onChange={(e) => updateStatus(c.id, e.target.value)}
                      className={`text-xs font-medium rounded-lg border px-2 py-1.5 cursor-pointer focus:outline-none focus:ring-2 focus:ring-violet-400 ${statusColor(c.status || "未対応")}`}
                    >
                      <option value="未対応">未対応</option>
                      <option value="対応中">対応中</option>
                      <option value="対応済み">対応済み</option>
                    </select>
                  </td>
                  <td className="px-4 py-3">
                    <button onClick={() => setSelected(c)} className="text-violet-500 hover:text-violet-700 text-xs font-medium">詳細</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selected && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4" onClick={() => setSelected(null)}>
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto mx-2 sm:mx-0" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 bg-gradient-to-r from-cyan-500 to-violet-500 rounded-t-2xl px-5 py-4 flex items-center justify-between">
              <span className="text-white font-bold">お問い合わせ詳細</span>
              <button onClick={() => setSelected(null)} className="text-white/80 hover:text-white">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div className="divide-y divide-gray-100">
                {[
                  ["受信日時", formatDate(selected.createdAt)],
                  ["お問い合わせ項目", selected.category],
                  ["ご契約状況", selected.contractStatus],
                  ["会社名 / 店舗名", selected.companyName],
                  ["名前", `${selected.lastName} ${selected.firstName}`],
                  ["メールアドレス", selected.email],
                  ["連絡先", selected.phone],
                  ["対応状況", selected.status || "未対応"],
                ].map(([label, value]) => (
                  <div key={label} className="flex py-3">
                    <span className="w-36 shrink-0 text-sm font-medium text-gray-500">{label}</span>
                    <span className="text-sm text-gray-800">{value}</span>
                  </div>
                ))}
              </div>
              <div>
                <span className="block text-sm font-medium text-gray-500 mb-1">お問い合わせ内容</span>
                <div className="bg-gray-50 rounded-lg p-3 text-sm text-gray-800 whitespace-pre-wrap">{selected.content}</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
