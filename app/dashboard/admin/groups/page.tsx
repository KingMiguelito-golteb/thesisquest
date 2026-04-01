import { redirect } from "next/navigation";
import { getSession } from "@/app/actions/auth";
import { getAdminDashboardData } from "@/app/actions/admin";
import { AdminDashboardClient } from "@/components/dashboard/admin-dashboard";

export default async function AdminGroupsPage() {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") redirect("/login");

  const data = await getAdminDashboardData();
  if (!data) redirect("/login");

  // Reuse the admin dashboard since it shows all groups
  return <AdminDashboardClient data={data} />;
}