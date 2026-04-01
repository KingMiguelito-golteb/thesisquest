"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Swords,
  LayoutDashboard,
  Target,
  ListTodo,
  Trophy,
  Users,
  BarChart3,
  MessageSquare,
  Settings,
  Medal,
  Zap,
  ShoppingBag,
  UserCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarProps {
  user: {
    id: string;
    name: string;
    email: string;
    role: "STUDENT" | "TEACHER" | "ADMIN";
    xp: number;
    level: number;
    coins: number;
    activeTitle: string | null;
    activeFrame: string | null;
    activeIcon: string | null;
  };
}

const studentLinks = [
  { title: "DASHBOARD", href: "/dashboard/student", icon: LayoutDashboard },
  { title: "MILESTONES", href: "/dashboard/student/milestones", icon: Target },
  { title: "MY TASKS", href: "/dashboard/student/tasks", icon: ListTodo },
  { title: "QUEST SHOP", href: "/dashboard/student/shop", icon: ShoppingBag },
  { title: "ACHIEVEMENTS", href: "/dashboard/student/achievements", icon: Trophy },
  { title: "LEADERBOARD", href: "/dashboard/student/leaderboard", icon: Medal },
  { title: "FEEDBACK", href: "/dashboard/student/feedback", icon: MessageSquare },
  { title: "PROFILE", href: "/dashboard/student/profile", icon: UserCircle },
];

const teacherLinks = [
  { title: "DASHBOARD", href: "/dashboard/teacher", icon: LayoutDashboard },
  { title: "MY GROUPS", href: "/dashboard/teacher/groups", icon: Users },
  { title: "REVIEW TASKS", href: "/dashboard/teacher/review", icon: ListTodo },
  { title: "FEEDBACK", href: "/dashboard/teacher/feedback", icon: MessageSquare },
  { title: "ANALYTICS", href: "/dashboard/teacher/analytics", icon: BarChart3 },
];

const adminLinks = [
  { title: "DASHBOARD", href: "/dashboard/admin", icon: LayoutDashboard },
  { title: "ALL GROUPS", href: "/dashboard/admin/groups", icon: Users },
  { title: "ANALYTICS", href: "/dashboard/admin/analytics", icon: BarChart3 },
  { title: "USERS", href: "/dashboard/admin/users", icon: Users },
  { title: "SETTINGS", href: "/dashboard/admin/settings", icon: Settings },
];

export function Sidebar({ user }: SidebarProps) {
  const pathname = usePathname();

  const links =
    user.role === "ADMIN"
      ? adminLinks
      : user.role === "TEACHER"
        ? teacherLinks
        : studentLinks;

  const xpForNextLevel = user.level * 100;
  const xpProgress = (user.xp / xpForNextLevel) * 100;

  const roleColor =
    user.role === "ADMIN"
      ? "var(--gold)"
      : user.role === "TEACHER"
        ? "var(--magenta)"
        : "var(--cyan)";

  return (
    <aside className="hidden lg:flex lg:flex-col lg:w-72 lg:fixed lg:inset-y-0 bg-[var(--bg-dark)] border-r border-[var(--border-dim)]">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-6 h-16 border-b border-[var(--border-dim)]">
        <div
          className="w-8 h-8 border flex items-center justify-center"
          style={{
            borderRadius: "4px",
            borderColor: "var(--cyan)",
            boxShadow: "0 0 8px var(--cyan-glow)",
          }}
        >
          <Swords className="w-4 h-4 text-[var(--cyan)]" />
        </div>
        <span className="text-lg font-bold font-[family-name:var(--font-heading)] tracking-tight text-glow-cyan">
          THESISQUEST
        </span>
      </div>

      {/* User Info (Student only) */}
            {user.role === "STUDENT" && (
        <div className="px-5 py-4 border-b border-[var(--border-dim)]">
          <div className="flex items-center gap-3 mb-3">
            <div
              className="relative w-10 h-10 border flex items-center justify-center text-sm font-bold font-[family-name:var(--font-heading)]"
              style={{
                borderRadius: "4px",
                borderColor: "var(--cyan)",
                background: "var(--cyan-glow)",
                color: "var(--cyan)",
              }}
            >
              {user.name
                .split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase()
                .slice(0, 2)}
            </div>
            <div>
              <p className="text-sm font-medium text-[var(--text-primary)] truncate max-w-[160px]">
                {user.name}
              </p>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  <Zap className="w-3 h-3 text-[var(--gold)]" />
                  <span className="text-xs text-[var(--gold)] font-[family-name:var(--font-heading)] font-bold">
                    LVL {user.level}
                  </span>
                </div>
                <span className="text-[var(--text-dim)]">•</span>
                <div className="flex items-center gap-1">
                  <span className="text-xs text-[var(--gold)] font-[family-name:var(--font-heading)] font-bold">
                    {user.coins} QC
                  </span>
                </div>
              </div>
            </div>
          </div>
          {/* XP Bar */}
          <div>
            <div className="flex items-center justify-between text-[10px] mb-1.5 font-[family-name:var(--font-heading)] uppercase tracking-wider">
              <span className="text-[var(--text-dim)]">
                {user.xp} / {xpForNextLevel} XP
              </span>
              <span className="text-[var(--cyan)]">
                {Math.round(xpProgress)}%
              </span>
            </div>
            <div
              className="w-full h-2 bg-[var(--bg-card)] overflow-hidden"
              style={{ borderRadius: "2px" }}
            >
              <div
                className="h-full xp-bar-fill neon-progress"
                style={{
                  width: `${Math.min(xpProgress, 100)}%`,
                  borderRadius: "2px",
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        <p className="px-3 mb-2 text-[10px] text-[var(--text-dim)] font-[family-name:var(--font-heading)] uppercase tracking-widest">
          Navigation
        </p>
        {links.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 text-xs font-medium font-[family-name:var(--font-heading)] tracking-wide transition-all duration-200",
                isActive
                  ? "text-[var(--cyan)] bg-[var(--cyan-glow)]"
                  : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)]"
              )}
              style={{
                borderRadius: "4px",
                borderLeft: isActive
                  ? "2px solid var(--cyan)"
                  : "2px solid transparent",
                boxShadow: isActive ? "0 0 10px var(--cyan-glow)" : "none",
              }}
            >
              <link.icon className={cn("w-4 h-4", isActive && "text-[var(--cyan)]")} />
              {link.title}
            </Link>
          );
        })}
      </nav>

      {/* Role Badge */}
      <div className="px-5 py-4 border-t border-[var(--border-dim)]">
        <div
          className="inline-flex items-center px-3 py-1 text-[10px] font-bold font-[family-name:var(--font-heading)] uppercase tracking-widest badge-shine"
          style={{
            borderRadius: "2px",
            color: roleColor,
            background: `color-mix(in srgb, ${roleColor} 10%, transparent)`,
            border: `1px solid color-mix(in srgb, ${roleColor} 30%, transparent)`,
          }}
        >
          {user.role}
        </div>
      </div>
    </aside>
  );
}