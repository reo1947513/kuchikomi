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
};

async function fetchSurveys(token: string): Promise<Survey[]> {
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

  const surveys = await fetchSurveys(token);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-gray-900">アンケート一覧</h1>
        <Link
          href="/dashboard/surveys/new"
          className="flex items-center gap-2 px-4 py-2 bg-[#F5C518] hover:bg-[#D4A017] text-gray-900 font-semibold rounded-xl shadow transition-colors text-sm"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          新規作成
        </Link>
      </div>
      <SurveyListClient initialSurveys={surveys} />
    </div>
  );
}
