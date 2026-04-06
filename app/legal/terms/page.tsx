import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "利用規約 - ComiSta",
  description: "ComiStaの利用規約です。",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
          <a href="/lp"><img src="/logo.png" alt="ComiSta" className="h-8" /></a>
          <a href="/lp" className="text-sm text-gray-500 hover:text-gray-700">トップに戻る</a>
        </div>
      </header>
      <main className="max-w-3xl mx-auto px-4 py-10">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-8">利用規約</h1>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sm:p-8 space-y-8 text-sm text-gray-700 leading-relaxed">

          <section>
            <h2 className="text-base font-bold text-gray-900 mb-3">第1条（適用）</h2>
            <p>本規約は、川上玲央（以下「当社」）が提供するComiSta（以下「本サービス」）の利用に関する条件を定めるものです。利用者は、本規約に同意の上、本サービスを利用するものとします。</p>
          </section>

          <section>
            <h2 className="text-base font-bold text-gray-900 mb-3">第2条（定義）</h2>
            <ul className="list-disc ml-5 space-y-1">
              <li>「利用者」とは、本サービスの利用契約を締結した法人または個人をいいます。</li>
              <li>「エンドユーザー」とは、利用者の顧客であり、アンケートに回答する方をいいます。</li>
              <li>「コンテンツ」とは、本サービスを通じて生成された口コミ文章、アンケートデータ等をいいます。</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-bold text-gray-900 mb-3">第3条（アカウント）</h2>
            <ol className="list-decimal ml-5 space-y-1">
              <li>利用者は、正確な情報を提供してアカウントを登録するものとします。</li>
              <li>アカウント情報（ログインID、パスワード等）の管理は利用者の責任とし、第三者に譲渡・貸与することはできません。</li>
              <li>アカウントの不正利用により生じた損害について、当社は責任を負いません。</li>
            </ol>
          </section>

          <section>
            <h2 className="text-base font-bold text-gray-900 mb-3">第4条（サービス内容）</h2>
            <ol className="list-decimal ml-5 space-y-1">
              <li>本サービスは、AIを活用した口コミ文章の自動生成、アンケート収集、分析機能等を提供します。</li>
              <li>AIにより生成された口コミ文章は参考として提供されるものであり、内容の正確性、完全性を保証するものではありません。</li>
              <li>利用者は、生成された口コミ文章の内容を確認・編集した上で、自己の責任において投稿するものとします。</li>
            </ol>
          </section>

          <section>
            <h2 className="text-base font-bold text-gray-900 mb-3">第5条（料金および支払い）</h2>
            <ol className="list-decimal ml-5 space-y-1">
              <li>本サービスの利用料金は、別途定める料金表に基づきます。</li>
              <li>支払いはクレジットカードによる自動決済とします。</li>
              <li>一括払いの料金は申込時に即時決済されます。</li>
              <li>分割払いの場合は、一括払い料金に10%を上乗せした金額を分割してお支払いいただきます。</li>
              <li>支払い済みの料金は、理由の如何を問わず返金いたしません。</li>
            </ol>
          </section>

          <section>
            <h2 className="text-base font-bold text-gray-900 mb-3">第6条（契約期間および解約）</h2>
            <ol className="list-decimal ml-5 space-y-1">
              <li>月額プランの最低契約期間は6ヶ月とします。</li>
              <li>最低契約期間中の途中解約はできません。</li>
              <li>契約終了日の1ヶ月前から解約手続きが可能です。</li>
              <li>解約手続きを行った場合、契約期間終了日までサービスを利用できます。</li>
              <li>契約期間終了後は自動更新とし、解約手続きがない場合は同条件で契約が更新されます。</li>
              <li>永年ライセンスについては、契約期間の定めなく利用できます。</li>
            </ol>
          </section>

          <section>
            <h2 className="text-base font-bold text-gray-900 mb-3">第7条（禁止事項）</h2>
            <p>利用者は、以下の行為を行ってはなりません。</p>
            <ul className="list-disc ml-5 mt-2 space-y-1">
              <li>法令または公序良俗に反する行為</li>
              <li>虚偽の口コミを生成・投稿する行為</li>
              <li>本サービスを利用した不正競争行為</li>
              <li>本サービスの運営を妨害する行為</li>
              <li>他の利用者またはエンドユーザーの個人情報を不正に取得・利用する行為</li>
              <li>本サービスのリバースエンジニアリング、改変、複製、再販売</li>
              <li>Googleの利用規約に反する方法での口コミ投稿</li>
              <li>その他、当社が不適切と判断する行為</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-bold text-gray-900 mb-3">第8条（知的財産権）</h2>
            <ol className="list-decimal ml-5 space-y-1">
              <li>本サービスに関する知的財産権は、当社または正当な権利者に帰属します。</li>
              <li>AIにより生成された口コミ文章の著作権は、利用者に帰属するものとします。</li>
              <li>利用者がアップロードしたロゴ、画像等の権利は利用者に帰属します。</li>
            </ol>
          </section>

          <section>
            <h2 className="text-base font-bold text-gray-900 mb-3">第9条（免責事項）</h2>
            <ol className="list-decimal ml-5 space-y-1">
              <li>当社は、本サービスの完全性、正確性、有用性等について保証しません。</li>
              <li>AIにより生成された口コミ文章に起因する損害について、当社は責任を負いません。</li>
              <li>天災、システム障害等の不可抗力により本サービスの提供が困難な場合、当社は責任を負いません。</li>
              <li>本サービスの利用により利用者とエンドユーザーまたは第三者との間で紛争が生じた場合、利用者の責任と費用で解決するものとします。</li>
              <li>当社の損害賠償責任は、直接かつ通常の損害に限り、利用者が当社に支払った過去3ヶ月分の利用料金を上限とします。</li>
            </ol>
          </section>

          <section>
            <h2 className="text-base font-bold text-gray-900 mb-3">第10条（サービスの変更・中断・終了）</h2>
            <ol className="list-decimal ml-5 space-y-1">
              <li>当社は、事前の通知なく本サービスの内容を変更することがあります。</li>
              <li>メンテナンス、システム障害等の理由により、本サービスを一時的に中断することがあります。</li>
              <li>本サービスを終了する場合、1ヶ月前までに利用者に通知します。</li>
            </ol>
          </section>

          <section>
            <h2 className="text-base font-bold text-gray-900 mb-3">第11条（規約の変更）</h2>
            <p>当社は、必要に応じて本規約を変更することがあります。変更後の規約は、本サービス上に掲載した時点で効力を生じるものとします。重要な変更がある場合は、事前に利用者に通知します。</p>
          </section>

          <section>
            <h2 className="text-base font-bold text-gray-900 mb-3">第12条（準拠法および管轄）</h2>
            <ol className="list-decimal ml-5 space-y-1">
              <li>本規約は日本法に準拠するものとします。</li>
              <li>本サービスに関する紛争は、大阪地方裁判所を第一審の専属的合意管轄裁判所とします。</li>
            </ol>
          </section>

          <section>
            <h2 className="text-base font-bold text-gray-900 mb-3">第13条（お問い合わせ）</h2>
            <div className="bg-gray-50 rounded-lg p-4">
              <p>川上玲央</p>
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
