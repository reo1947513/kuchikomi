import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ComiSta - AIで口コミを自動生成",
  description:
    "たった3分のアンケートで高品質な口コミを自動生成。Googleマップの評価アップで集客力を高めます。初期費用0円・最短即日導入。",
};

export default function LpLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
