import { redirect } from "next/navigation";
import { getSessionForRole } from "@/lib/auth";
import DashboardNav from "./DashboardNav";
import ExpiredNav from "./ExpiredNav";
import NotificationBell from "./NotificationBell";
import { prisma } from "@/lib/db";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = getSessionForRole("admin") || getSessionForRole("super");
  if (!session) redirect("/login");

  if (session.role === "agent") redirect("/login");

  const isSuper = session.role === "super";

  let isExpired = false;
  let paymentFailed = false;
  if (!isSuper) {
    const user = await prisma.user.findUnique({
      where: { id: session.userId },
      select: { contractEnd: true, noContractLimit: true, paymentFailedAt: true },
    });
    if (user && !user.noContractLimit && user.contractEnd) {
      isExpired = new Date() > new Date(user.contractEnd);
    }
    if (user?.paymentFailedAt) {
      paymentFailed = true;
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-gradient-to-r from-cyan-500 to-violet-500 shadow-sm sticky top-0 z-20">
        <div className="max-w-4xl mx-auto px-3 md:px-6 h-14 flex items-center justify-between">
          <span className="text-lg font-black text-white tracking-tight">ComiSta</span>
          {isSuper ? (
            <a href="/admin/shops" className="text-sm text-white/80 hover:text-white underline">
              ← ショップ管理に戻る
            </a>
          ) : (
            <div className="flex items-center gap-2 sm:gap-3">
              <NotificationBell />
              <a href="/dashboard/contact" className="px-3 py-1.5 text-sm font-medium bg-white text-gray-800 rounded-lg hover:bg-gray-100 transition-colors">
                お問い合わせ
              </a>
              <a href="/api/auth/logout" className="text-sm text-white/80 hover:text-white underline">
                ログアウト
              </a>
            </div>
          )}
        </div>
      </header>
      {!isSuper && paymentFailed && (
        <div className="bg-red-500 text-white text-center text-sm py-2 px-4">
          お支払いの確認ができていません。3日以内に<a href="/dashboard/billing" className="underline font-bold">お支払い方法を更新</a>してください。更新されない場合、プランが停止されます。
        </div>
      )}
      {!isSuper && (isExpired ? <ExpiredNav /> : <DashboardNav />)}
      <main className="max-w-4xl mx-auto px-3 md:px-6 py-6 md:py-8">{children}</main>
      <footer className="text-center text-xs text-gray-400 py-6">
        © 2026 ComiSta. All Rights Reserved.
      </footer>
    </div>
  );
}
