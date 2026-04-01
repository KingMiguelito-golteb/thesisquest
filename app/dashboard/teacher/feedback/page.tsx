import { redirect } from "next/navigation";
import { getSession } from "@/app/actions/auth";
import { getTeacherFeedbackHistory } from "@/app/actions/teacher";
import { TeacherFeedbackClient } from "@/components/dashboard/teacher-feedback";

export default async function TeacherFeedbackPage() {
  const session = await getSession();
  if (!session || session.role !== "TEACHER") redirect("/login");

  const feedback = await getTeacherFeedbackHistory();

  return <TeacherFeedbackClient feedback={feedback} />;
}