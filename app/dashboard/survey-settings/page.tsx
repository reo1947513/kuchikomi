import { redirect } from "next/navigation";
import { getSessionForRole } from "@/lib/auth";
import { prisma } from "@/lib/db";

export default async function SurveySettingsRedirect() {
  const session = getSessionForRole("admin") || getSessionForRole("super");
  if (!session) redirect("/login");

  const survey = await prisma.survey.findFirst({
    where: { userId: session.userId },
    select: { id: true },
  });

  if (survey) {
    redirect(`/dashboard/surveys/${survey.id}/settings`);
  }

  redirect("/dashboard/surveys");
}
