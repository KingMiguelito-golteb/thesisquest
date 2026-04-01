import { redirect } from "next/navigation";
import { getSession } from "@/app/actions/auth";
import { getTeacherDashboardData } from "@/app/actions/teacher";
import { TeacherDashboardClient } from "@/components/dashboard/teacher-dashboard";

export default async function TeacherDashboardPage() {
  const session = await getSession();
  if (!session || session.role !== "TEACHER") redirect("/login");

  const data = await getTeacherDashboardData();
  if (!data) redirect("/login");

  return <TeacherDashboardClient data={data} userName={session.name} />;
}