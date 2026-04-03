import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifyToken } from "@/lib/auth";
import { prisma } from "@/lib/db";

export default async function DashboardPage() {
  const token = cookies().get("auth_token")?.value;
  if (!token) redirect("/login");
  const session = verifyToken(token);
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
