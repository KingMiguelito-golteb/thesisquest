import { redirect } from "next/navigation";
import { getSession } from "@/app/actions/auth";
import { getStudentDashboardData } from "@/app/actions/student";
import { StudentDashboardClient } from "@/components/dashboard/student-dashboard";

export default async function StudentDashboardPage() {
  const session = await getSession();
  if (!session || session.role !== "STUDENT") redirect("/login");

  const data = await getStudentDashboardData();
  if (!data) redirect("/login");

  return <StudentDashboardClient data={data} />;
}