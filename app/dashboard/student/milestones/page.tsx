import { redirect } from "next/navigation";
import { getSession } from "@/app/actions/auth";
import { getStudentDashboardData } from "@/app/actions/student";
import { MilestonesClient } from "@/components/dashboard/milestones";

export default async function MilestonesPage() {
  const session = await getSession();
  if (!session || session.role !== "STUDENT") redirect("/login");

  const data = await getStudentDashboardData();
  if (!data) redirect("/login");

  return <MilestonesClient data={data} />;
}