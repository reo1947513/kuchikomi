import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";

export default async function DashboardPage() {
  const session = getSession();
  if (!session) redirect("/login");
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
