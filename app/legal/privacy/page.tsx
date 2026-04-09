import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "プライバシーポリシー - ComiSta",
  description: "ComiStaのプライバシーポリシーです。",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
          <a href="/lp"><img src="/logo.png" alt="ComiSta" className="h-8" /></a>
          <a href="/lp" className="text-sm text-gray-500 hover:text-gray-700">トップに戻る</a>
        </div>
      </header>
      <main className="max-w-3xl mx-auto px-4 py-10">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-8">プライバシーポリシー</h1>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sm:p-8 space-y-8 text-sm text-gray-700 leading-relaxed">

          <section>
            <h2 className="text-base font-bold text-gray-900 mb-3">1. はじめに</h2>
            <p>RRL（以下「当社」）は、ComiSta（以下「本サービス」）におけるお客様の個人情報の取り扱いについて、以下のとおりプライバシーポリシーを定めます。</p>
          </section>

          <section>
            <h2 className="text-base font-bold text-gray-900 mb-3">2. 収集する情報</h2>
            <p>当社は、本サービスの提供にあたり、以下の情報を収集することがあります。</p>
            <ul className="list-disc ml-5 mt-2 space-y-1">
              <li>氏名、メールアドレス、電話番号、住所等の連絡先情報</li>
              <li>店舗名、業種等の事業に関する情報</li>
              <li>ログインID、パスワード等のアカウント情報</li>
              <li>お支払いに関する情報（クレジットカード情報はStripe社が管理し、当社は保持しません）</li>
              <li>アンケートの回答内容</li>
              <li>サービスの利用履歴、アクセスログ</li>
              <li>Cookie等の技術的情報</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-bold text-gray-900 mb-3">3. 利用目的</h2>
            <p>収集した個人情報は、以下の目的で利用します。</p>
            <ul className="list-disc ml-5 mt-2 space-y-1">
              <li>本サービスの提供、運営、維持、改善</li>
              <li>アカウントの作成および管理</li>
              <li>お問い合わせへの対応</li>
              <li>利用料金の請求および決済処理</li>
              <li>サービスに関するお知らせ、キャンペーン情報の配信</li>
              <li>利用状況の分析およびサービス改善</li>
              <li>不正利用の防止</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-bold text-gray-900 mb-3">4. 第三者への提供</h2>
            <p>当社は、以下の場合を除き、お客様の個人情報を第三者に提供することはありません。</p>
            <ul className="list-disc ml-5 mt-2 space-y-1">
              <li>お客様の同意がある場合</li>
              <li>法令に基づく場合</li>
              <li>人の生命、身体または財産の保護のために必要がある場合</li>
              <li>サービス提供に必要な範囲で業務委託先に提供する場合（Stripe社による決済処理、Resend社によるメール送信等）</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-bold text-gray-900 mb-3">5. 情報の安全管理</h2>
            <p>当社は、個人情報の漏洩、滅失またはき損の防止のため、以下の安全管理措置を講じています。</p>
            <ul className="list-disc ml-5 mt-2 space-y-1">
              <li>パスワードのハッシュ化（bcrypt）</li>
              <li>通信の暗号化（HTTPS/TLS）</li>
              <li>アクセス制御およびログ監視</li>
              <li>定期的なセキュリティ点検</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-bold text-gray-900 mb-3">6. Cookieの使用</h2>
            <p>本サービスでは、認証状態の維持のためにCookieを使用しています。ブラウザの設定によりCookieを無効にすることも可能ですが、一部の機能がご利用いただけなくなる場合があります。</p>
          </section>

          <section>
            <h2 className="text-base font-bold text-gray-900 mb-3">7. お客様の権利</h2>
            <p>お客様は、当社に対して以下の請求を行うことができます。</p>
            <ul className="list-disc ml-5 mt-2 space-y-1">
              <li>個人情報の開示、訂正、追加または削除</li>
              <li>個人情報の利用停止または消去</li>
              <li>個人情報の第三者提供の停止</li>
            </ul>
            <p className="mt-2">上記の請求については、下記のお問い合わせ先までご連絡ください。</p>
          </section>

          <section>
            <h2 className="text-base font-bold text-gray-900 mb-3">8. ポリシーの変更</h2>
            <p>当社は、必要に応じて本ポリシーを変更することがあります。重要な変更がある場合は、本サービス上での通知またはメールにてお知らせします。</p>
          </section>

          <section>
            <h2 className="text-base font-bold text-gray-900 mb-3">9. お問い合わせ</h2>
            <p>個人情報の取り扱いに関するお問い合わせは、以下までご連絡ください。</p>
            <div className="mt-2 bg-gray-50 rounded-lg p-4">
              <p>RRL</p>
              <p>メール: conestkawakami@gmail.com</p>
              <p>電話: 090-2914-0992</p>
            </div>
          </section>

        </div>
        <p className="text-xs text-gray-400 mt-6 text-center">制定日: 2026年4月6日</p>
      </main>
    </div>
  );
}
