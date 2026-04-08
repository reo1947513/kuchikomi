import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ログイン - ComiSta",
  description: "ComiStaの管理画面にログインします。メールアドレスまたはログインIDでアクセスできます。",
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
