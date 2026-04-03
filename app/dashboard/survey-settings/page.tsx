import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifyToken } from "@/lib/auth";
import { prisma } from "@/lib/db";

export default async function SurveySettingsRedirect() {
  const token = cookies().get("auth_token")?.value;
  if (!token) redirect("/login");
  const session = verifyToken(token);
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
