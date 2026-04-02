import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifyToken } from "@/lib/auth";
import DashboardNav from "./DashboardNav";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = cookies();
  const token = cookieStore.get("auth_token")?.value;
  if (!token) redirect("/login");

  const session = verifyToken(token);
  if (!session) redirect("/login");

  // super admin can visit dashboard pages (e.g. to edit a shop's survey settings)
  const isSuper = session.role === "super";

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-[#F5C518] shadow-sm sticky top-0 z-20">
        <div className="max-w-4xl mx-auto px-6 h-14 flex items-center justify-between">
          <span className="text-lg font-black text-gray-900 tracking-tight">クチコミPlus</span>
          {isSuper ? (
            <a href="/admin" className="text-sm text-gray-700 hover:text-gray-900 underline">
              ← 管理パネルに戻る
            </a>
          ) : (
            <a href="/api/auth/logout" className="text-sm text-gray-700 hover:text-gray-900 underline">
              ログアウト
            </a>
          )}
        </div>
      </header>
      {!isSuper && <DashboardNav />}
      <main className="max-w-4xl mx-auto px-6 py-8">{children}</main>
    </div>
  );
}
