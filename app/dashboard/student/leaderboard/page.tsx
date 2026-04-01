import { redirect } from "next/navigation";
import { getSession } from "@/app/actions/auth";
import { getLeaderboardData } from "@/app/actions/student";
import { LeaderboardClient } from "@/components/dashboard/leaderboard";

export default async function LeaderboardPage() {
  const session = await getSession();
  if (!session || session.role !== "STUDENT") redirect("/login");

  const leaderboard = await getLeaderboardData();

  return <LeaderboardClient data={leaderboard} currentUserId={session.id} />;
}