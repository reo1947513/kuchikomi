import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ComiSta - 口コミ収集・投稿支援ツール",
  description:
    "たった3分のアンケートで、お客様の声をもとにAIが口コミ投稿の下書きを作成。口コミ収集とレビュー運用を無理なく継続できます。初期費用0円・最短即日導入・アプリ不要。",
};

export default function LpLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
