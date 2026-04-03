"use client";

export default function ApplyPage() {
  return (
    <div className="max-w-2xl mx-auto py-10 px-4">
      <div className="bg-white rounded-2xl shadow-sm p-8 text-center">
        <div className="w-16 h-16 rounded-full bg-violet-100 flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-violet-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h1 className="text-xl font-bold text-gray-900 mb-2">ご契約期間が終了しました</h1>
        <p className="text-sm text-gray-500 mb-6">サービスのご利用を継続される場合は、下記よりお申し込みください。</p>
        <div className="bg-gray-50 rounded-xl p-6 mb-6 text-left">
          <h2 className="text-sm font-bold text-gray-700 mb-3">お申し込み方法</h2>
          <p className="text-sm text-gray-600 leading-relaxed">お手数ですが「お問い合わせ」ページより、契約更新のご連絡をお願いいたします。<br />担当者より折り返しご連絡させていただきます。</p>
        </div>
        <a href="/dashboard/contact" className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-violet-500 hover:from-cyan-600 hover:to-violet-600 text-white font-semibold rounded-xl shadow transition-colors text-sm">お問い合わせへ</a>
      </div>
    </div>
  );
}
