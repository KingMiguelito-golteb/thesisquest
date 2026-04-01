import { redirect } from "next/navigation";
import { getSession } from "@/app/actions/auth";

export default async function AdminSettingsPage() {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") redirect("/login");

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h2 className="text-2xl font-bold text-[var(--text-primary)] font-[family-name:var(--font-heading)] tracking-tight">
          SETTINGS
        </h2>
        <p className="text-[var(--text-secondary)] mt-1 text-sm">
          System configuration and preferences
        </p>
      </div>

      <div className="card-cyber p-8 text-center" style={{ borderRadius: "4px" }}>
        <p className="text-sm text-[var(--text-dim)] font-[family-name:var(--font-heading)]">
          ⚙️ SETTINGS PAGE — COMING SOON
        </p>
        <p className="text-xs text-[var(--text-dim)] mt-2">
          Configure system preferences, manage school year, and more
        </p>
      </div>
    </div>
  );
}