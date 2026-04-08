import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "ComiSta - 口コミ収集・投稿支援ツール",
  description:
    "たった3分のアンケートで、お客様の声をもとにAIが口コミ投稿の下書きを作成。口コミ収集とレビュー運用を無理なく継続できます。初期費用0円・最短即日導入・アプリ不要。",
  openGraph: {
    title: "ComiSta - 口コミ収集・投稿支援ツール",
    description: "たった3分のアンケートで、お客様の声をもとにAIが口コミ投稿の下書きを作成。口コミ収集とレビュー運用を無理なく継続できます。",
    images: [{ url: "/logo.png", width: 1600, height: 440 }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ComiSta - 口コミ収集・投稿支援ツール",
    description: "たった3分のアンケートで、お客様の声をもとにAIが口コミ投稿の下書きを作成。口コミ収集とレビュー運用を無理なく継続できます。",
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
      <body className="antialiased bg-gray-50 text-gray-900">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
