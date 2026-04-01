import { redirect } from "next/navigation";
import { getSession } from "@/app/actions/auth";
import { getStudentDashboardData } from "@/app/actions/student";
import { TasksClient } from "@/components/dashboard/tasks";

export default async function TasksPage() {
  const session = await getSession();
  if (!session || session.role !== "STUDENT") redirect("/login");

  const data = await getStudentDashboardData();
  if (!data) redirect("/login");

  return <TasksClient data={data} />;
}