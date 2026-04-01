import { redirect } from "next/navigation";
import { getSession } from "@/app/actions/auth";
import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-slate-950">
      <Sidebar user={session} />
      <div className="lg:pl-72">
        <Topbar user={session} />
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}