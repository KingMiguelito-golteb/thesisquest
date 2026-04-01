import { redirect } from "next/navigation";
import { getSession } from "@/app/actions/auth";
import { getTeacherDashboardData } from "@/app/actions/teacher";
import { getAvailableStudents } from "@/app/actions/manage";
import { TeacherGroupsClient } from "@/components/dashboard/teacher-groups";

export default async function TeacherGroupsPage() {
  const session = await getSession();
  if (!session || session.role !== "TEACHER") redirect("/login");

  const data = await getTeacherDashboardData();
  if (!data) redirect("/login");

  const allStudents = await getAvailableStudents();

  return <TeacherGroupsClient groups={data.groups} allStudents={allStudents} />;
}