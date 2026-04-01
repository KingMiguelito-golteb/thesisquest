import { redirect } from "next/navigation";
import { getSession } from "@/app/actions/auth";
import { getTeacherReviewTasks } from "@/app/actions/teacher";
import { ReviewTasksClient } from "@/components/dashboard/review-tasks";

export default async function ReviewPage() {
  const session = await getSession();
  if (!session || session.role !== "TEACHER") redirect("/login");

  const tasks = await getTeacherReviewTasks();

  return <ReviewTasksClient tasks={tasks} />;
}