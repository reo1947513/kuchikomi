import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "特定商取引法に基づく表記 - ComiSta",
  description: "ComiStaの特定商取引法に基づく表記ページです。",
};

export default function TokushohoPage() {
  const rows = [
    ["販売業者", "RRL"],
    ["代表者", "川上玲央"],
    ["所在地", "大阪府大阪市中央区南久宝寺町4丁目4-1 新御堂ビル501-1"],
    ["電話番号", "090-2914-0992"],
    ["メールアドレス", "conestkawakami@gmail.com"],
    ["販売URL", "https://comista-kuchikomi.com"],
    ["販売価格", "スタンダードプラン: 月額¥10,000（税込）\nプレミアムプラン: 月額¥30,000（税込）\nチェーン3店舗パック: 月額¥80,000（税込）\nチェーン5店舗パック: 月額¥130,000（税込）\nエージェンシー5店舗プラン: 月額¥40,000（税込）\nエージェンシー10店舗プラン: 月額¥70,000（税込）\nエージェンシー30店舗〜: 要見積\n初期セットアップ代行: ¥15,000〜（税込）"],
    ["商品代金以外の必要料金", "なし（初期費用0円）"],
    ["お支払方法", "クレジットカード（Visa / Mastercard / AMEX / JCB）"],
    ["お支払時期", "お申込み時に即時決済"],
    ["サービス提供時期", "決済完了後、即時ご利用いただけます"],
    ["返品・交換について", "デジタルサービスの性質上、返品・交換はお受けしておりません"],
    ["契約期間", "最低契約期間6ヶ月"],
    ["解約について", "最低契約期間中の途中解約はできません。契約終了日の1ヶ月前から解約手続きが可能です。解約後は契約期間終了日までサービスをご利用いただけます。"],
    ["動作環境", "インターネットに接続されたPC・スマートフォン・タブレット\n推奨ブラウザ: Chrome, Safari, Edge, Firefox の最新版"],
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
          <a href="/lp">
            <img src="/logo.png" alt="ComiSta" className="h-8" />
          </a>
          <a href="/lp" className="text-sm text-gray-500 hover:text-gray-700">トップに戻る</a>
        </div>
      </header>
      <main className="max-w-3xl mx-auto px-4 py-10">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-8">特定商取引法に基づく表記</h1>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="divide-y divide-gray-100">
            {rows.map(([label, value]) => (
              <div key={label} className="flex flex-col sm:flex-row">
                <div className="sm:w-48 shrink-0 bg-gray-50 px-4 sm:px-6 py-3 sm:py-4">
                  <span className="text-sm font-semibold text-gray-700">{label}</span>
                </div>
                <div className="px-4 sm:px-6 py-3 sm:py-4">
                  <span className="text-sm text-gray-800 whitespace-pre-wrap">{value}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        <p className="text-xs text-gray-400 mt-6 text-center">最終更新日: 2026年4月6日</p>
      </main>
    </div>
  );
}
