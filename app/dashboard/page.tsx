import { redirect } from "next/navigation";
import { getSessionForRole } from "@/lib/auth";
import { prisma } from "@/lib/db";

export default async function DashboardPage() {
  const session = getSessionForRole("admin") || getSessionForRole("super");
  if (!session) redirect("/login");

  // Super admin accessing /dashboard directly → redirect to /admin
  if (session.role === "super") redirect("/admin");

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: { contractEnd: true, noContractLimit: true },
  });

  if (user && !user.noContractLimit && user.contractEnd && new Date() > new Date(user.contractEnd)) {
    redirect("/dashboard/apply");
  }

  redirect("/dashboard/surveys");
}
