import { redirect } from "next/navigation";
import { getSession } from "@/app/actions/auth";
import { getProfileData } from "@/app/actions/profile";
import { ProfileClient } from "@/components/dashboard/profile";

export default async function ProfilePage() {
  const session = await getSession();
  if (!session || session.role !== "STUDENT") redirect("/login");

  const profile = await getProfileData();
  if (!profile) redirect("/login");

  return <ProfileClient data={profile} />;
}