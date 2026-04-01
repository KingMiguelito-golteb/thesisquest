import { redirect } from "next/navigation";
import { getSession } from "@/app/actions/auth";
import { getStudentDashboardData } from "@/app/actions/student";
import { FeedbackClient } from "@/components/dashboard/feedback";

export default async function FeedbackPage() {
  const session = await getSession();
  if (!session || session.role !== "STUDENT") redirect("/login");

  const data = await getStudentDashboardData();
  if (!data) redirect("/login");

  return <FeedbackClient data={data} />;
}