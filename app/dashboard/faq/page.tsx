"use client";

import { useState, useEffect } from "react";

type Faq = { id: string; question: string; answer: string };

const defaultFaqs: Faq[] = [
  { id: "1", question: "ComiStaとは何ですか？", answer: "ComiStaは、お客様のアンケート回答をもとにAIが口コミ文章を自動生成するサービスです。生成された文章をGoogleマップなどに投稿することで、店舗の評価向上に貢献します。" },
  { id: "2", question: "アンケートの質問内容は変更できますか？", answer: "はい、アンケート設定画面から質問の追加・編集・削除・並べ替えが自由に行えます。選択式とテキスト入力式の両方に対応しています。" },
  { id: "3", question: "生成された口コミ文章は編集できますか？", answer: "はい、AIが生成した文章はアンケート結果ページで自由に編集できます。内容を確認・修正してからGoogleマップに投稿してください。" },
  { id: "4", question: "QRコードはどのように使いますか？", answer: "アンケート設定画面でQRコードを作成・ダウンロードできます。印刷して店頭に設置することで、お客様がスマートフォンから簡単にアンケートに回答できるようになります。" },
  { id: "5", question: "月間のレビュー生成数に上限はありますか？", answer: "ご契約プランによって月間のレビュー生成数が設定されています。現在の利用状況はダッシュボードで確認できます。上限に達した場合は翌月にリセットされます。" },
  { id: "6", question: "ロゴやカラーテーマは変更できますか？", answer: "はい、アンケート設定のロゴ・クーポンタブからロゴ画像のアップロード、カラー設定タブからテーマカラーの変更が可能です。お店のブランドに合わせたカスタマイズができます。" },
];

export default function FAQPage() {
  const [faqs, setFaqs] = useState<Faq[]>([]);
  const [loading, setLoading] = useState(true);
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  useEffect(() => {
    fetch("/api/faqs")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setFaqs(data);
        } else {
          setFaqs(defaultFaqs);
        }
      })
      .catch(() => setFaqs(defaultFaqs))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <style jsx>{`
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .answer-enter {
          animation: slideDown 0.25s ease-out forwards;
        }
      `}</style>

      <div>
        <h1 className="text-lg sm:text-2xl font-bold text-gray-900">よくある質問</h1>
        <p className="text-sm text-gray-500 mt-1">ComiStaに関するよくある質問をまとめました</p>
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-400 text-sm">読み込み中...</div>
      ) : (
      <div className="bg-white rounded-xl shadow-sm divide-y divide-gray-100">
        {faqs.map((faq, i) => (
          <div key={faq.id}>
            <button
              onClick={() => setOpenIndex(openIndex === i ? null : i)}
              className="w-full flex items-center justify-between px-3 sm:px-5 py-3 sm:py-4 text-left hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className={`flex-shrink-0 w-7 h-7 rounded-full bg-gradient-to-r from-cyan-500 to-violet-500 flex items-center justify-center text-white text-xs font-bold transition-transform duration-300 ${openIndex === i ? "scale-110" : ""}`}>Q</span>
                <span className="text-sm font-medium text-gray-800">{faq.question}</span>
              </div>
              <svg
                className={`w-5 h-5 text-gray-400 transition-transform duration-300 flex-shrink-0 ml-2 ${openIndex === i ? "rotate-180" : ""}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {openIndex === i && (
              <div className="px-3 sm:px-5 pb-4 answer-enter">
                <div className="flex gap-3 ml-0.5">
                  <span className="flex-shrink-0 w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 text-xs font-bold">A</span>
                  <p className="text-sm text-gray-600 leading-relaxed pt-1">{faq.answer}</p>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
      )}
    </div>
  );
}
