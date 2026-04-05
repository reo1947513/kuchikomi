import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ComiSta - AIで口コミを自動生成",
  description:
    "たった3分のアンケートで高品質な口コミを自動生成。Googleマップの評価アップで集客力を高めます。初期費用0円・最短即日導入。",
  openGraph: {
    title: "ComiSta - AIで口コミを自動生成",
    description: "たった3分のアンケートで高品質な口コミを自動生成。Googleマップの評価アップで集客力を高めます。初期費用0円・最短即日導入。",
    images: [{ url: "/logo.png", width: 1600, height: 440 }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ComiSta - AIで口コミを自動生成",
    description: "たった3分のアンケートで高品質な口コミを自動生成。Googleマップの評価アップで集客力を高めます。初期費用0円・最短即日導入。",
    images: ["/logo.png"],
  },
};

export default function LpLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
