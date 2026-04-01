import { redirect } from "next/navigation";
import { getSession } from "@/app/actions/auth";
import { getStudentAchievements } from "@/app/actions/student";
import { AchievementsClient } from "@/components/dashboard/achievements";

export default async function AchievementsPage() {
  const session = await getSession();
  if (!session || session.role !== "STUDENT") redirect("/login");

  const achievements = await getStudentAchievements();

  return <AchievementsClient data={achievements} />;
}