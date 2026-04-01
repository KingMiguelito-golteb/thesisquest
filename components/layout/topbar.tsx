"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LogOut,
  Menu,
  X,
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
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { logoutAction } from "@/app/actions/auth";
import { cn } from "@/lib/utils";
import { NotificationBell } from "@/components/layout/notification-bell";

interface TopbarProps {
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

export function Topbar({ user }: TopbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const getPageTitle = () => {
    const segments = pathname.split("/").filter(Boolean);
    const lastSegment = segments[segments.length - 1];
    const titles: Record<string, string> = {
      student: "DASHBOARD",
      teacher: "DASHBOARD",
      admin: "DASHBOARD",
      milestones: "MILESTONES",
      tasks: "MY TASKS",
      achievements: "ACHIEVEMENTS",
      leaderboard: "LEADERBOARD",
      feedback: "FEEDBACK",
      groups: "GROUPS",
      review: "REVIEW TASKS",
      analytics: "ANALYTICS",
      users: "USERS",
      settings: "SETTINGS",
    };
    return titles[lastSegment] || "DASHBOARD";
  };

  const getMobileLinks = () => {
       if (user.role === "STUDENT") {
      return [
        { title: "DASHBOARD", href: "/dashboard/student", icon: LayoutDashboard },
        { title: "MILESTONES", href: "/dashboard/student/milestones", icon: Target },
        { title: "MY TASKS", href: "/dashboard/student/tasks", icon: ListTodo },
        { title: "QUEST SHOP", href: "/dashboard/student/shop", icon: ShoppingBag },
        { title: "ACHIEVEMENTS", href: "/dashboard/student/achievements", icon: Trophy },
        { title: "LEADERBOARD", href: "/dashboard/student/leaderboard", icon: Medal },
        { title: "FEEDBACK", href: "/dashboard/student/feedback", icon: MessageSquare },
        { title: "PROFILE", href: "/dashboard/student/profile", icon: UserCircle },
      ];
    }
    if (user.role === "TEACHER") {
      return [
        { title: "DASHBOARD", href: "/dashboard/teacher", icon: LayoutDashboard },
        { title: "MY GROUPS", href: "/dashboard/teacher/groups", icon: Users },
        { title: "REVIEW TASKS", href: "/dashboard/teacher/review", icon: ListTodo },
        { title: "FEEDBACK", href: "/dashboard/teacher/feedback", icon: MessageSquare },
        { title: "ANALYTICS", href: "/dashboard/teacher/analytics", icon: BarChart3 },
      ];
    }
    return [
      { title: "DASHBOARD", href: "/dashboard/admin", icon: LayoutDashboard },
      { title: "ALL GROUPS", href: "/dashboard/admin/groups", icon: Users },
      { title: "ANALYTICS", href: "/dashboard/admin/analytics", icon: BarChart3 },
      { title: "USERS", href: "/dashboard/admin/users", icon: Users },
      { title: "SETTINGS", href: "/dashboard/admin/settings", icon: Settings },
    ];
  };

  return (
    <>
      <header className="sticky top-0 z-40 h-16 border-b border-[var(--border-dim)] bg-[var(--bg-darker)]/80 backdrop-blur-md">
        <div className="flex items-center justify-between h-full px-6">
          <div className="flex items-center gap-4">
            <button
              className="lg:hidden text-[var(--text-secondary)] hover:text-[var(--cyan)] transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
            <h1 className="text-sm font-bold text-[var(--text-primary)] font-[family-name:var(--font-heading)] tracking-wide">
              {getPageTitle()}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            {/* Level indicator on topbar */}
                     {user.role === "STUDENT" && (
              <div className="hidden sm:flex items-center gap-2">
                <div className="flex items-center gap-1.5 px-3 py-1 border border-[var(--gold)] bg-[var(--gold-glow)]"
                     style={{ borderRadius: "2px" }}>
                  <Zap className="w-3.5 h-3.5 text-[var(--gold)]" />
                  <span className="text-[10px] font-bold font-[family-name:var(--font-heading)] text-[var(--gold)] uppercase tracking-wider">
                    LVL {user.level} • {user.xp} XP
                  </span>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1 border border-[var(--gold)] bg-[var(--gold-glow)]"
                     style={{ borderRadius: "2px" }}>
                  <span className="text-[10px] font-bold font-[family-name:var(--font-heading)] text-[var(--gold)] uppercase tracking-wider">
                    {user.coins} QC
                  </span>
                </div>
              </div>
            )}

            {/* Notifications */}
                     
            <NotificationBell />

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                  <div
                    className="w-8 h-8 border flex items-center justify-center text-xs font-bold font-[family-name:var(--font-heading)]"
                    style={{
                      borderRadius: "4px",
                      borderColor: "var(--cyan)",
                      background: "var(--cyan-glow)",
                      color: "var(--cyan)",
                    }}
                  >
                    {user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)}
                  </div>
                  <span className="hidden sm:block text-xs text-[var(--text-secondary)] font-[family-name:var(--font-heading)]">
                    {user.name}
                  </span>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 bg-[var(--bg-card)] border-[var(--border-subtle)]"
                                   style={{ borderRadius: "4px" }}>
                <div className="px-3 py-2">
                  <p className="text-sm font-medium text-[var(--text-primary)]">{user.name}</p>
                  <p className="text-xs text-[var(--text-dim)]">{user.email}</p>
                </div>
                <DropdownMenuSeparator className="bg-[var(--border-dim)]" />
                <DropdownMenuItem
                  className="text-[var(--red)] focus:text-[var(--red)] focus:bg-[var(--red-glow)] cursor-pointer text-xs font-[family-name:var(--font-heading)] uppercase tracking-wider"
                  onClick={() => logoutAction()}
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  LOG OUT
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-30 bg-[var(--bg-darkest)]/98 pt-16">
          <nav className="px-4 py-6 space-y-0.5">
            <div className="flex items-center gap-2 px-3 mb-6">
              <div className="w-8 h-8 border border-[var(--cyan)] flex items-center justify-center glow-cyan-subtle"
                   style={{ borderRadius: "4px" }}>
                <Swords className="w-4 h-4 text-[var(--cyan)]" />
              </div>
              <span className="text-lg font-bold font-[family-name:var(--font-heading)] tracking-tight text-glow-cyan">
                THESISQUEST
              </span>
            </div>

            {getMobileLinks().map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-3 py-3 text-xs font-medium font-[family-name:var(--font-heading)] tracking-wide transition-all",
                    isActive
                      ? "text-[var(--cyan)] bg-[var(--cyan-glow)]"
                      : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)]"
                  )}
                  style={{ borderRadius: "4px" }}
                >
                  <link.icon className="w-5 h-5" />
                  {link.title}
                </Link>
              );
            })}

            <div className="pt-4 border-t border-[var(--border-dim)] mt-4">
              <button
                onClick={() => logoutAction()}
                className="flex items-center gap-3 px-3 py-3 text-xs font-medium font-[family-name:var(--font-heading)] tracking-wide text-[var(--red)] hover:bg-[var(--red-glow)] w-full"
                style={{ borderRadius: "4px" }}
              >
                <LogOut className="w-5 h-5" />
                LOG OUT
              </button>
            </div>
          </nav>
        </div>
      )}
    </>
  );
}