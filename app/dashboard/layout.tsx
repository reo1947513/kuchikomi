import { redirect } from "next/navigation";
import { getSessionForRole } from "@/lib/auth";
import DashboardNav from "./DashboardNav";
import ExpiredNav from "./ExpiredNav";
import { prisma } from "@/lib/db";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = getSessionForRole("admin") || getSessionForRole("super");
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
        <div className="max-w-4xl mx-auto px-3 md:px-6 h-14 flex items-center justify-between">
          <span className="text-lg font-black text-white tracking-tight">ComiSta</span>
          {isSuper ? (
            <a href="/admin/shops" className="text-sm text-white/80 hover:text-white underline">
              ← ショップ管理に戻る
            </a>
          ) : (
            <div className="flex items-center gap-2 sm:gap-3">
              <a href="https://lin.ee/6C7mwFK" target="_blank" rel="noopener noreferrer"
                className="flex items-center justify-center w-8 h-8 bg-[#06C755] rounded-lg hover:opacity-90 transition-opacity" title="公式LINE">
                <svg viewBox="0 0 24 24" className="w-4.5 h-4.5 fill-white"><path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.346 0 .627.285.627.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.066-.022.137-.033.194-.033.195 0 .375.104.515.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63.346 0 .628.285.628.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.282.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314" /></svg>
              </a>
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
      {!isSuper && (isExpired ? <ExpiredNav /> : <DashboardNav />)}
      <main className="max-w-4xl mx-auto px-3 md:px-6 py-6 md:py-8">{children}</main>
      <footer className="text-center text-xs text-gray-400 py-6">
        © 2026 ComiSta. All Rights Reserved.
      </footer>
    </div>
  );
}
