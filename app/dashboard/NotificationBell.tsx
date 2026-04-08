"use client";

import { useState, useEffect, useRef } from "react";

interface Announcement {
  id: string;
  title: string;
  content: string;
  category: string;
  publishedAt: string;
}

export default function NotificationBell() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [open, setOpen] = useState(false);
  const [readIds, setReadIds] = useState<Set<string>>(new Set());
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/api/announcements")
      .then((r) => r.json())
      .then((data) => { if (Array.isArray(data)) setAnnouncements(data.slice(0, 10)); })
      .catch(() => {});

    const stored = localStorage.getItem("readAnnouncementIds");
    if (stored) {
      try { setReadIds(new Set(JSON.parse(stored))); } catch {}
    }
  }, []);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const unreadCount = announcements.filter((a) => !readIds.has(a.id)).length;

  const markAllRead = () => {
    const ids = new Set(announcements.map((a) => a.id));
    setReadIds(ids);
    localStorage.setItem("readAnnouncementIds", JSON.stringify(Array.from(ids)));
  };

  const handleOpen = () => {
    setOpen(!open);
    if (!open) markAllRead();
  };

  const catColor = (cat: string) =>
    cat === "新機能" ? "bg-cyan-100 text-cyan-700"
    : cat === "重要" ? "bg-red-100 text-red-700"
    : cat === "メンテナンス" ? "bg-amber-100 text-amber-700"
    : "bg-gray-100 text-gray-600";

  return (
    <div ref={ref} className="relative">
      <button
        onClick={handleOpen}
        className="relative p-2 text-white/80 hover:text-white transition-colors"
        aria-label="通知"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 w-4.5 h-4.5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center min-w-[18px] h-[18px]">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-2xl border border-gray-200 z-50 overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
            <h3 className="text-sm font-bold text-gray-800">お知らせ</h3>
            {announcements.length > 0 && (
              <button onClick={markAllRead} className="text-xs text-violet-500 hover:text-violet-700">
                すべて既読にする
              </button>
            )}
          </div>
          <div className="max-h-80 overflow-y-auto divide-y divide-gray-50">
            {announcements.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-8">お知らせはありません</p>
            ) : (
              announcements.map((a) => (
                <div key={a.id} className={`px-4 py-3 ${readIds.has(a.id) ? "" : "bg-violet-50/30"}`}>
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium ${catColor(a.category)}`}>
                      {a.category}
                    </span>
                    <span className="text-[10px] text-gray-400">{new Date(a.publishedAt).toLocaleDateString("ja-JP")}</span>
                  </div>
                  <p className="text-sm font-semibold text-gray-800">{a.title}</p>
                  <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{a.content}</p>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
