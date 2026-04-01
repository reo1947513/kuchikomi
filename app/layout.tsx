import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "クチコミファースト",
  description: "口コミ作成支援サービス",
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
