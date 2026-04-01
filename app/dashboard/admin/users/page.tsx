import { redirect } from "next/navigation";
import { getSession } from "@/app/actions/auth";
import { getAdminUsers } from "@/app/actions/admin";
import { AdminUsersClient } from "@/components/dashboard/admin-users";

export default async function AdminUsersPage() {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") redirect("/login");

  const users = await getAdminUsers();

  return <AdminUsersClient users={users} />;
}