import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifyToken } from "@/lib/auth";

export default function DashboardPage() {
  const token = cookies().get("auth_token")?.value;
  if (!token) redirect("/login");
  const session = verifyToken(token);
  if (!session) redirect("/login");
  if (session.role === "super") redirect("/admin");
  redirect("/dashboard/surveys");
}
