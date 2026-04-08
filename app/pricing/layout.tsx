import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "料金プラン - ComiSta",
  description:
    "ComiStaの料金プラン一覧。すべてのプランで初期費用0円。スタンダードプラン月額10,000円〜。機能比較やよくある質問もご確認いただけます。",
};

export default function PricingLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
