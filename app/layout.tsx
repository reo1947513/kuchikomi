import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ComiSta",
  description: "口コミ作成支援サービス",
  openGraph: {
    title: "ComiSta - AIで口コミを自動生成",
    description: "たった3分のアンケートで高品質な口コミを自動生成。Googleマップの評価アップで集客力を高めます。",
    images: [{ url: "/logo.png", width: 1600, height: 440 }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ComiSta - AIで口コミを自動生成",
    description: "たった3分のアンケートで高品質な口コミを自動生成。Googleマップの評価アップで集客力を高めます。",
    images: ["/logo.png"],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body className="antialiased bg-gray-50 text-gray-900">{children}</body>
    </html>
  );
}
