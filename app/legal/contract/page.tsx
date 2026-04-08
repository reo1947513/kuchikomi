"use client";

export default function ContractPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 print:hidden">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
          <a href="/"><img src="/logo.png" alt="ComiSta" className="h-8" /></a>
          <button
            onClick={() => { if (typeof window !== 'undefined') window.print(); }}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-500 to-violet-500 text-white text-sm font-semibold rounded-lg hover:opacity-90 transition-opacity"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
            印刷 / PDF保存
          </button>
        </div>
      </header>
      <main className="max-w-3xl mx-auto px-4 py-10 print:py-4 print:px-0">
        <style>{`
          @media print {
            body { background: white !important; }
            .print-hide { display: none !important; }
          }
        `}</style>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 sm:p-12 print:shadow-none print:border-none print:p-0 text-sm text-gray-800 leading-relaxed">

          <h1 className="text-2xl font-bold text-center text-gray-900 mb-2">サービス利用契約書</h1>
          <p className="text-center text-gray-500 text-xs mb-10">ComiSta サービス利用契約</p>

          <p className="mb-6">
            川上玲央（以下「甲」という）と、契約者（以下「乙」という）は、甲が提供するComiSta（以下「本サービス」という）の利用に関し、以下のとおり契約を締結する。
          </p>

          <div className="space-y-6">

            <section>
              <h2 className="font-bold text-gray-900 mb-2">第1条（目的）</h2>
              <p>本契約は、甲が乙に対して本サービスを提供し、乙がこれを利用するにあたっての条件を定めることを目的とする。</p>
            </section>

            <section>
              <h2 className="font-bold text-gray-900 mb-2">第2条（サービスの内容）</h2>
              <p>甲は、乙に対し以下のサービスを提供する。</p>
              <ul className="list-disc ml-5 mt-1 space-y-0.5">
                <li>AIを活用した口コミ文章の自動生成機能</li>
                <li>チャット形式によるアンケート収集機能</li>
                <li>QRコード発行機能</li>
                <li>回答データの分析・レポート機能（プランに応じる）</li>
                <li>その他、甲が定めるプランに応じた機能</li>
              </ul>
            </section>

            <section>
              <h2 className="font-bold text-gray-900 mb-2">第3条（契約期間）</h2>
              <ol className="list-decimal ml-5 space-y-0.5">
                <li>本契約の期間は、別紙に定める契約開始日から契約終了日までとする。</li>
                <li>月額プランの最低契約期間は6ヶ月とする。</li>
                <li>契約期間満了の1ヶ月前までに乙から書面またはシステム上での解約手続きがない場合、同一条件にて自動更新されるものとする。</li>
                <li>永年ライセンスの場合、契約期間の定めなく利用できるものとする。</li>
              </ol>
            </section>

            <section>
              <h2 className="font-bold text-gray-900 mb-2">第4条（利用料金および支払い）</h2>
              <ol className="list-decimal ml-5 space-y-0.5">
                <li>乙は、別紙に定める利用料金を甲に支払うものとする。</li>
                <li>支払方法はクレジットカードによる自動決済とする。</li>
                <li>一括払いの場合は申込時に即時決済される。分割払いの場合は一括払い料金に10%を上乗せした金額を分割して支払うものとする。</li>
                <li>支払い済みの利用料金は、理由の如何を問わず返金しない。</li>
              </ol>
            </section>

            <section>
              <h2 className="font-bold text-gray-900 mb-2">第5条（途中解約）</h2>
              <ol className="list-decimal ml-5 space-y-0.5">
                <li>最低契約期間中の途中解約はできないものとする。</li>
                <li>契約終了日の1ヶ月前から解約手続きが可能となる。</li>
                <li>解約手続き後も、契約期間終了日までは本サービスを利用できるものとする。</li>
              </ol>
            </section>

            <section>
              <h2 className="font-bold text-gray-900 mb-2">第6条（プランの変更）</h2>
              <ol className="list-decimal ml-5 space-y-0.5">
                <li>乙は、契約期間中にプランのアップグレードを行うことができる。</li>
                <li>アップグレードの場合、差額は日割り計算で即時精算される。</li>
                <li>プランのダウングレードは、次回更新時より適用される。</li>
              </ol>
            </section>

            <section>
              <h2 className="font-bold text-gray-900 mb-2">第7条（秘密保持）</h2>
              <p>甲および乙は、本契約に関連して知り得た相手方の秘密情報を、相手方の書面による事前の承諾なく第三者に開示・漏洩してはならない。ただし、法令に基づく開示要求がある場合はこの限りではない。</p>
            </section>

            <section>
              <h2 className="font-bold text-gray-900 mb-2">第8条（個人情報の取り扱い）</h2>
              <ol className="list-decimal ml-5 space-y-0.5">
                <li>甲は、本サービスの提供に関して取得した個人情報を、プライバシーポリシーに従い適切に管理する。</li>
                <li>乙は、エンドユーザーの個人情報を含むアンケートデータの取り扱いについて、関連法令を遵守するものとする。</li>
              </ol>
            </section>

            <section>
              <h2 className="font-bold text-gray-900 mb-2">第9条（禁止事項）</h2>
              <p>乙は、以下の行為を行ってはならない。</p>
              <ul className="list-disc ml-5 mt-1 space-y-0.5">
                <li>虚偽の口コミの生成・投稿</li>
                <li>本サービスの不正利用または営業妨害</li>
                <li>本サービスのリバースエンジニアリング、複製、再販売</li>
                <li>Googleの利用規約に反する口コミ投稿</li>
                <li>その他、甲が不適切と判断する行為</li>
              </ul>
            </section>

            <section>
              <h2 className="font-bold text-gray-900 mb-2">第10条（免責事項）</h2>
              <ol className="list-decimal ml-5 space-y-0.5">
                <li>甲は、AIにより生成された口コミ文章の内容について責任を負わない。</li>
                <li>甲の損害賠償責任は、直接損害に限り、乙が甲に支払った過去3ヶ月分の利用料金を上限とする。</li>
                <li>天災、システム障害等の不可抗力により本サービスの提供が困難な場合、甲は責任を負わない。</li>
              </ol>
            </section>

            <section>
              <h2 className="font-bold text-gray-900 mb-2">第11条（契約の解除）</h2>
              <p>甲は、乙が以下に該当する場合、催告なく本契約を解除することができる。</p>
              <ul className="list-disc ml-5 mt-1 space-y-0.5">
                <li>本規約または本契約に違反した場合</li>
                <li>利用料金の支払いを2ヶ月以上滞納した場合</li>
                <li>破産、民事再生等の申立てがあった場合</li>
                <li>その他、信頼関係を著しく損なう行為があった場合</li>
              </ul>
            </section>

            <section>
              <h2 className="font-bold text-gray-900 mb-2">第12条（準拠法および管轄）</h2>
              <ol className="list-decimal ml-5 space-y-0.5">
                <li>本契約は日本法に準拠する。</li>
                <li>本契約に関する紛争は、大阪地方裁判所を第一審の専属的合意管轄裁判所とする。</li>
              </ol>
            </section>

            <section>
              <h2 className="font-bold text-gray-900 mb-2">第13条（協議事項）</h2>
              <p>本契約に定めのない事項および本契約の解釈について疑義が生じた場合は、甲乙誠意をもって協議の上、解決するものとする。</p>
            </section>

          </div>

          {/* 別紙 */}
          <div className="mt-12 pt-8 border-t-2 border-gray-300">
            <h2 className="text-lg font-bold text-center text-gray-900 mb-6">別紙：契約条件</h2>
            <table className="w-full border-collapse text-sm">
              <tbody>
                {[
                  ["契約プラン", ""],
                  ["月額利用料金（税込）", ""],
                  ["契約開始日", "　　　　年　　月　　日"],
                  ["契約終了日", "　　　　年　　月　　日"],
                  ["月間レビュー上限", ""],
                  ["支払方法", "クレジットカード"],
                ].map(([label, value]) => (
                  <tr key={label} className="border border-gray-300">
                    <td className="bg-gray-50 px-4 py-3 font-semibold w-1/3 border-r border-gray-300">{label}</td>
                    <td className="px-4 py-3">{value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* 署名欄 */}
          <div className="mt-12 pt-8 border-t-2 border-gray-300">
            <p className="text-center text-gray-500 text-xs mb-8">本契約の成立を証するため、本書を2通作成し、甲乙記名押印の上、各1通を保有する。</p>
            <p className="text-center text-gray-500 text-xs mb-8">契約締結日：　　　　年　　月　　日</p>

            <div className="grid grid-cols-2 gap-8 mt-8">
              <div className="space-y-6">
                <h3 className="font-bold text-gray-900">甲（サービス提供者）</h3>
                <div className="space-y-4">
                  <div className="border-b border-gray-300 pb-1">
                    <span className="text-xs text-gray-500">住所</span>
                    <p className="text-xs mt-1">大阪府大阪市中央区南久宝寺町4丁目4-1 新御堂ビル501-1</p>
                  </div>
                  <div className="border-b border-gray-300 pb-1">
                    <span className="text-xs text-gray-500">氏名</span>
                    <p className="mt-1">川上玲央</p>
                  </div>
                  <div className="border-b border-gray-300 pb-1 h-12">
                    <span className="text-xs text-gray-500">印</span>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <h3 className="font-bold text-gray-900">乙（契約者）</h3>
                <div className="space-y-4">
                  <div className="border-b border-gray-300 pb-1">
                    <span className="text-xs text-gray-500">住所</span>
                    <p className="mt-6"></p>
                  </div>
                  <div className="border-b border-gray-300 pb-1">
                    <span className="text-xs text-gray-500">会社名 / 店舗名</span>
                    <p className="mt-6"></p>
                  </div>
                  <div className="border-b border-gray-300 pb-1">
                    <span className="text-xs text-gray-500">代表者氏名</span>
                    <p className="mt-6"></p>
                  </div>
                  <div className="border-b border-gray-300 pb-1 h-12">
                    <span className="text-xs text-gray-500">印</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
