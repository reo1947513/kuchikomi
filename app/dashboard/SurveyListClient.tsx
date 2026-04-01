"use client";

import { useState } from "react";
import SurveyCard from "@/components/SurveyCard";

type Survey = {
  id: string;
  title: string;
  description?: string | null;
  googleBusinessUrl?: string | null;
  isActive: boolean;
  questions: Array<{ id: string }>;
};

export default function SurveyListClient({
  initialSurveys,
}: {
  initialSurveys: Survey[];
}) {
  const [surveys, setSurveys] = useState<Survey[]>(initialSurveys);

  const handleDeleted = (id: string) => {
    setSurveys((prev) => prev.filter((s) => s.id !== id));
  };

  if (surveys.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow p-12 text-center">
        <svg
          className="w-16 h-16 mx-auto text-gray-300 mb-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
          />
        </svg>
        <p className="text-gray-500 font-medium text-lg">
          アンケートがありません
        </p>
        <p className="text-gray-400 text-sm mt-1">
          「新規作成」ボタンから最初のアンケートを作成しましょう
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {surveys.map((survey) => (
        <SurveyCard key={survey.id} survey={survey} onDeleted={handleDeleted} />
      ))}
    </div>
  );
}
