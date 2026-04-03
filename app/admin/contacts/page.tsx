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
  createdAt: string;
};

export default function ContactsPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
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

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">お問い合わせ管理</h1>

      {loading ? (
        <div className="text-center py-12 text-gray-400 text-sm">読み込み中...</div>
      ) : contacts.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-12 text-center text-gray-400 text-sm">
          お問い合わせはまだありません
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left px-4 py-3 font-medium text-gray-600">日時</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">項目</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">契約状況</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">会社名 / 店舗名</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">名前</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">メール</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {contacts.map((c) => (
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
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
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
