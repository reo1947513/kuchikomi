import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifyToken } from "@/lib/auth";
import AdminNav from "./AdminNav";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = cookies();
  const token = cookieStore.get("auth_token")?.value;
  if (!token) redirect("/login");

  const session = verifyToken(token);
  if (!session || session.role !== "super") redirect("/dashboard");

  return (
    <div className="min-h-screen bg-yellow-50">
      <header className="bg-[#F5C518] shadow-sm sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
          <span className="text-lg font-black text-gray-900 tracking-tight">クチコミPlus</span>
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-gray-900 text-white text-xs font-semibold">
              スーパー管理者
            </span>
            <a href="/api/auth/logout" className="text-sm text-gray-700 hover:text-gray-900 underline">
              ログアウト
            </a>
          </div>
        </div>
      </header>
      <AdminNav />
      <main className="max-w-7xl mx-auto px-6 py-8">{children}</main>
    </div>
  );
}
