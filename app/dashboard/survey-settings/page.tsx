import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";

export default async function SurveySettingsRedirect() {
  const session = getSession();
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
