"use client";

import {
  Users,
  Target,
  CheckCircle2,
  Send,
  BarChart3,
  Trophy,
  Coins,
  ShoppingBag,
  AlertTriangle,
  TrendingUp,
  Shield,
  Crown,
  Calendar,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface AdminData {
  stats: {
    totalStudents: number;
    totalTeachers: number;
    totalGroups: number;
    totalTasks: number;
    approvedTasks: number;
    submittedTasks: number;
    revisionTasks: number;
    totalMilestones: number;
    completedMilestones: number;
    completionRate: number;
    totalAchievementsUnlocked: number;
    totalCoinsEarned: number;
    totalPurchases: number;
  };
  groups: {
    id: string;
    name: string;
    section: string;
    subject: string;
    teacherName: string;
    memberCount: number;
    progress: number;
    totalTasks: number;
    completedTasks: number;
    pendingReview: number;
    totalMilestones: number;
    completedMilestones: number;
    upcomingDeadline: Date | null;
    isAtRisk: boolean;
  }[];
  topStudents: {
    id: string;
    name: string;
    xp: number;
    level: number;
    coins: number;
    activeTitle: string | null;
  }[];
  teachers: {
    id: string;
    name: string;
    email: string;
    groupCount: number;
    feedbackCount: number;
  }[];
}

export function AdminDashboardClient({ data }: { data: AdminData }) {
  const { stats, groups, topStudents, teachers } = data;

  const sortedGroups = [...groups].sort((a, b) => a.progress - b.progress);
  const atRiskGroups = groups.filter((g) => g.isAtRisk);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-[var(--text-primary)] font-[family-name:var(--font-heading)] tracking-tight">
          ADMIN PANEL
        </h2>
        <p className="text-[var(--text-secondary)] mt-1 text-sm">
          School-wide research progress overview and management
        </p>
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: "STUDENTS", value: stats.totalStudents, icon: Users, color: "var(--cyan)" },
          { label: "TEACHERS", value: stats.totalTeachers, icon: Shield, color: "var(--magenta)" },
          { label: "GROUPS", value: stats.totalGroups, icon: Users, color: "var(--gold)" },
          { label: "COMPLETION RATE", value: `${stats.completionRate}%`, icon: TrendingUp, color: stats.completionRate >= 50 ? "var(--emerald)" : "var(--red)" },
        ].map((stat, i) => (
          <div key={i} className="card-cyber p-5" style={{ borderRadius: "4px" }}>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 flex items-center justify-center border" style={{ borderRadius: "4px", borderColor: stat.color, background: `color-mix(in srgb, ${stat.color} 10%, transparent)` }}>
                <stat.icon className="w-4 h-4" style={{ color: stat.color }} />
              </div>
            </div>
            <p className="text-2xl font-bold font-[family-name:var(--font-heading)]" style={{ color: stat.color }}>{stat.value}</p>
            <p className="text-[10px] text-[var(--text-dim)] uppercase tracking-wider font-[family-name:var(--font-heading)] mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-3 lg:grid-cols-6 gap-3">
        {[
          { label: "TASKS", value: `${stats.approvedTasks}/${stats.totalTasks}`, icon: CheckCircle2, color: "var(--emerald)" },
          { label: "MILESTONES", value: `${stats.completedMilestones}/${stats.totalMilestones}`, icon: Target, color: "var(--cyan)" },
          { label: "PENDING", value: stats.submittedTasks, icon: Send, color: "var(--gold)" },
          { label: "ACHIEVEMENTS", value: stats.totalAchievementsUnlocked, icon: Trophy, color: "var(--gold)" },
          { label: "COINS EARNED", value: stats.totalCoinsEarned, icon: Coins, color: "var(--gold)" },
          { label: "PURCHASES", value: stats.totalPurchases, icon: ShoppingBag, color: "var(--magenta)" },
        ].map((stat, i) => (
          <div key={i} className="p-3 bg-[var(--bg-card)] border border-[var(--border-dim)]" style={{ borderRadius: "4px" }}>
            <div className="flex items-center gap-1.5 mb-1">
              <stat.icon className="w-3.5 h-3.5" style={{ color: stat.color }} />
              <span className="text-[9px] text-[var(--text-dim)] font-[family-name:var(--font-heading)] uppercase tracking-widest">{stat.label}</span>
            </div>
            <p className="text-sm font-bold font-[family-name:var(--font-heading)]" style={{ color: stat.color }}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* At Risk Alert */}
      {atRiskGroups.length > 0 && (
        <div className="p-4 border border-[var(--red)] bg-[var(--red-glow)]" style={{ borderRadius: "4px", boxShadow: "0 0 15px var(--red-glow)" }}>
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-5 h-5 text-[var(--red)]" />
            <h3 className="text-xs font-bold text-[var(--red)] font-[family-name:var(--font-heading)] uppercase tracking-wider">
              AT-RISK GROUPS ({atRiskGroups.length})
            </h3>
          </div>
          <div className="space-y-2">
            {atRiskGroups.map((g) => (
              <div key={g.id} className="flex items-center justify-between p-2 bg-[var(--bg-card)]/50" style={{ borderRadius: "4px" }}>
                <div>
                  <span className="text-xs text-[var(--text-primary)] font-bold font-[family-name:var(--font-heading)]">{g.name}</span>
                  <span className="text-[10px] text-[var(--text-dim)] ml-2">({g.section}) • Adviser: {g.teacherName}</span>
                </div>
                <span className="text-xs font-bold text-[var(--red)] font-[family-name:var(--font-heading)]">{g.progress}%</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Group Progress */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-xs font-bold text-[var(--text-primary)] font-[family-name:var(--font-heading)] tracking-wide flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-[var(--cyan)]" />
            ALL GROUPS PROGRESS
          </h3>

          <div className="space-y-3">
            {sortedGroups.map((group) => {
              const barColor = group.isAtRisk ? "var(--red)" : group.progress < 70 ? "var(--gold)" : "var(--emerald)";

              return (
                <div key={group.id} className="card-cyber p-4" style={{ borderRadius: "4px" }}>
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="text-xs font-bold text-[var(--text-primary)] font-[family-name:var(--font-heading)]">{group.name}</h4>
                        {group.isAtRisk && (
                          <span className="flex items-center gap-1 text-[9px] font-bold font-[family-name:var(--font-heading)] uppercase tracking-widest px-1.5 py-0.5 border" style={{ borderRadius: "2px", color: "var(--red)", background: "var(--red-glow)", borderColor: "rgba(255,51,102,0.2)" }}>
                            <AlertTriangle className="w-3 h-3" />AT RISK
                          </span>
                        )}
                        {group.pendingReview > 0 && (
                          <span className="text-[9px] font-bold font-[family-name:var(--font-heading)] uppercase tracking-widest px-1.5 py-0.5 border" style={{ borderRadius: "2px", color: "var(--gold)", background: "var(--gold-glow)", borderColor: "rgba(255,179,71,0.2)" }}>
                            {group.pendingReview} PENDING
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] text-[var(--text-dim)] mt-0.5">{group.section} • {group.subject} • Adviser: {group.teacherName}</p>
                    </div>
                    <span className="text-sm font-bold font-[family-name:var(--font-heading)]" style={{ color: barColor }}>{group.progress}%</span>
                  </div>

                  <div className="w-full h-2.5 bg-[var(--bg-card)] overflow-hidden mb-2" style={{ borderRadius: "2px" }}>
                    <div className="h-full transition-all duration-500" style={{ width: `${group.progress}%`, borderRadius: "2px", background: barColor, boxShadow: `0 0 8px color-mix(in srgb, ${barColor} 30%, transparent)` }} />
                  </div>

                  <div className="flex items-center gap-4 text-[10px] text-[var(--text-dim)]">
                    <span>{group.completedTasks}/{group.totalTasks} tasks</span>
                    <span>{group.completedMilestones}/{group.totalMilestones} milestones</span>
                    <span>{group.memberCount} members</span>
                    {group.upcomingDeadline && (
                      <span className="flex items-center gap-1 ml-auto">
                        <Calendar className="w-3 h-3" />
                        {new Date(group.upcomingDeadline).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-4">
          {/* Top Students */}
          <div className="card-cyber p-5" style={{ borderRadius: "4px" }}>
            <h3 className="text-xs font-bold text-[var(--text-primary)] font-[family-name:var(--font-heading)] tracking-wide flex items-center gap-2 mb-4">
              <Crown className="w-4 h-4 text-[var(--gold)]" />
              TOP STUDENTS
            </h3>
            <div className="space-y-2">
              {topStudents.slice(0, 8).map((student, i) => (
                <div key={student.id} className="flex items-center gap-3 p-2 bg-[var(--bg-elevated)] border border-[var(--border-dim)]" style={{ borderRadius: "4px" }}>
                  <span className="text-[10px] font-bold text-[var(--text-dim)] font-[family-name:var(--font-heading)] w-5 text-center">
                    {i + 1}
                  </span>
                  <div className="w-7 h-7 border flex items-center justify-center text-[9px] font-bold font-[family-name:var(--font-heading)]" style={{ borderRadius: "4px", borderColor: i < 3 ? "var(--gold)" : "var(--cyan)", background: i < 3 ? "var(--gold-glow)" : "var(--cyan-glow)", color: i < 3 ? "var(--gold)" : "var(--cyan)" }}>
                    {student.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-[var(--text-primary)] truncate">{student.name}</p>
                    {student.activeTitle && <p className="text-[9px] text-[var(--magenta)]">{student.activeTitle}</p>}
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-bold text-[var(--cyan)] font-[family-name:var(--font-heading)]">{student.xp} XP</p>
                    <p className="text-[9px] text-[var(--gold)]">L{student.level}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Teachers */}
          <div className="card-cyber p-5" style={{ borderRadius: "4px" }}>
            <h3 className="text-xs font-bold text-[var(--text-primary)] font-[family-name:var(--font-heading)] tracking-wide flex items-center gap-2 mb-4">
              <Shield className="w-4 h-4 text-[var(--magenta)]" />
              TEACHERS
            </h3>
            <div className="space-y-2">
              {teachers.map((teacher) => (
                <div key={teacher.id} className="flex items-center gap-3 p-3 bg-[var(--bg-elevated)] border border-[var(--border-dim)]" style={{ borderRadius: "4px" }}>
                  <div className="w-8 h-8 border flex items-center justify-center text-[9px] font-bold font-[family-name:var(--font-heading)]" style={{ borderRadius: "4px", borderColor: "var(--magenta)", background: "var(--magenta-glow)", color: "var(--magenta)" }}>
                    {teacher.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-[var(--text-primary)]">{teacher.name}</p>
                    <p className="text-[10px] text-[var(--text-dim)]">{teacher.email}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-[var(--text-secondary)]">{teacher.groupCount} groups</p>
                    <p className="text-[10px] text-[var(--text-dim)]">{teacher.feedbackCount} feedback</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}