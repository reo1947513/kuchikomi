import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifyToken } from "@/lib/auth";
import DashboardNav from "./DashboardNav";
import ExpiredNav from "./ExpiredNav";
import { prisma } from "@/lib/db";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = cookies();
  const token = cookieStore.get("auth_token")?.value;
  if (!token) redirect("/login");

  const session = verifyToken(token);
  if (!session) redirect("/login");

  // agent role is removed — redirect to login
  if (session.role === "agent") redirect("/login");

  const isSuper = session.role === "super";

  let isExpired = false;
  if (!isSuper) {
    const user = await prisma.user.findUnique({
      where: { id: session.userId },
      select: { contractEnd: true, noContractLimit: true },
    });
    if (user && !user.noContractLimit && user.contractEnd) {
      isExpired = new Date() > new Date(user.contractEnd);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-gradient-to-r from-cyan-500 to-violet-500 shadow-sm sticky top-0 z-20">
        <div className="max-w-4xl mx-auto px-6 h-14 flex items-center justify-between">
          <span className="text-lg font-black text-white tracking-tight">クチコミPlus</span>
          {isSuper ? (
            <a href="/admin" className="text-sm text-white/80 hover:text-white underline">
              ← 管理パネルに戻る
            </a>
          ) : (
            <a href="/api/auth/logout" className="text-sm text-white/80 hover:text-white underline">
              ログアウト
            </a>
          )}
        </div>
      </header>
      {!isSuper && (isExpired ? <ExpiredNav /> : <DashboardNav />)}
      <main className="max-w-4xl mx-auto px-6 py-8">{children}</main>
      <footer className="text-center text-xs text-gray-400 py-6">
        © 2026 クチコミPlus. All Rights Reserved.
      </footer>
    </div>
  );
}
