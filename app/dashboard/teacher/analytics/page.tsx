import { redirect } from "next/navigation";
import { getSession } from "@/app/actions/auth";
import { getTeacherDashboardData } from "@/app/actions/teacher";
import { TeacherAnalyticsClient } from "@/components/dashboard/teacher-analytics";

export default async function TeacherAnalyticsPage() {
  const session = await getSession();
  if (!session || session.role !== "TEACHER") redirect("/login");

  const data = await getTeacherDashboardData();
  if (!data) redirect("/login");

  return <TeacherAnalyticsClient data={data} />;
}