import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import SurveyListClient from "../SurveyListClient";

type Survey = {
  id: string;
  title: string;
  description?: string | null;
  googleBusinessUrl?: string | null;
  isActive: boolean;
  questions: Array<{ id: string }>;
  user?: { name: string };
};

async function fetchSurveys(): Promise<Survey[]> {
  const cookieStore = cookies();
  const token = cookieStore.get("auth_token")?.value;
  if (!token) return [];

  const baseUrl =
    (process.env["NEXT_PUBLIC_APP_URL"] as string | undefined) ??
    `http://localhost:${(process.env["PORT"] as string | undefined) ?? "3000"}`;

  try {
    const res = await fetch(`${baseUrl}/api/surveys`, {
      headers: { Cookie: `auth_token=${token}` },
      cache: "no-store",
    });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

export default async function SurveysPage() {
  const cookieStore = cookies();
  const token = cookieStore.get("auth_token")?.value;
  if (!token) redirect("/login");

  const surveys = await fetchSurveys();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-[#F5C518] shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <span className="text-2xl font-black text-gray-900 tracking-tight">クチコミPlus</span>
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-gray-700">管理コンソール</span>
            <Link href="/api/auth/logout" className="text-sm text-gray-600 hover:text-gray-900 underline">
              ログアウト
            </Link>
          </div>
        </div>
      </header>

      <div className="flex flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 gap-8">
        <aside className="w-56 shrink-0">
          <nav className="bg-white rounded-xl shadow p-4 flex flex-col gap-1">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-3 mb-2">
              メニュー
            </p>
            <Link
              href="/dashboard"
              className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-gray-600 hover:bg-gray-100 text-sm transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              ダッシュボード
            </Link>
            <Link
              href="/dashboard/surveys"
              className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg bg-[#F5C518]/20 text-gray-900 font-medium text-sm"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              アンケート管理
            </Link>
            <Link
              href="/dashboard/settings"
              className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-gray-600 hover:bg-gray-100 text-sm transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              設定
            </Link>
          </nav>
        </aside>

        <main className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">アンケート管理</h1>
              <p className="text-sm text-gray-500 mt-1">作成したアンケートの一覧です</p>
            </div>
            <Link
              href="/dashboard/surveys/new"
              className="flex items-center gap-2 px-4 py-2 bg-[#F5C518] hover:bg-[#D4A017] text-gray-900 font-semibold rounded-xl shadow transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              新規作成
            </Link>
          </div>
          <SurveyListClient initialSurveys={surveys} />
        </main>
      </div>
    </div>
  );
}
