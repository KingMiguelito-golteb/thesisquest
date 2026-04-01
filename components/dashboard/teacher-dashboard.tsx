"use client";

import {
  Users,
  ListTodo,
  CheckCircle2,
  RotateCcw,
  Send,
  Target,
  TrendingUp,
  Clock,
  AlertTriangle,
  ChevronRight,
  Calendar,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface TeacherDashboardData {
  stats: {
    totalGroups: number;
    totalStudents: number;
    totalTasks: number;
    pendingReview: number;
    approvedTasks: number;
    revisionTasks: number;
    totalMilestones: number;
    completedMilestones: number;
  };
  groups: {
    id: string;
    name: string;
    section: string;
    subject: string;
    progress: number;
    totalTasks: number;
    completedTasks: number;
    pendingReview: number;
    upcomingDeadline: Date | null;
    members: { id: string; name: string; level: number }[];
  }[];
  pendingTasks: {
    id: string;
    title: string;
    assignedTo: { id: string; name: string } | null;
    groupName: string;
    milestoneName: string;
    updatedAt: Date;
  }[];
  recentFeedback: {
    id: string;
    content: string;
    type: string;
    createdAt: Date;
    taskTitle: string;
    studentName: string;
  }[];
}

export function TeacherDashboardClient({ data, userName }: { data: TeacherDashboardData; userName: string }) {
  const { stats, groups, pendingTasks, recentFeedback } = data;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-[var(--text-primary)] font-[family-name:var(--font-heading)] tracking-tight">
          WELCOME, {userName.split(" ").pop()?.toUpperCase()}
        </h2>
        <p className="text-[var(--text-secondary)] mt-1 text-sm">
          {stats.pendingReview > 0
            ? `You have ${stats.pendingReview} task${stats.pendingReview > 1 ? "s" : ""} awaiting review`
            : "All caught up! No pending reviews."}
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: "GROUPS", value: stats.totalGroups, icon: Users, color: "var(--cyan)" },
          { label: "PENDING REVIEW", value: stats.pendingReview, icon: Send, color: stats.pendingReview > 0 ? "var(--gold)" : "var(--emerald)" },
          { label: "APPROVED", value: stats.approvedTasks, icon: CheckCircle2, color: "var(--emerald)" },
          { label: "STUDENTS", value: stats.totalStudents, icon: Users, color: "var(--magenta)" },
        ].map((stat, i) => (
          <div key={i} className="card-cyber p-4" style={{ borderRadius: "4px" }}>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 flex items-center justify-center border" style={{ borderRadius: "4px", borderColor: stat.color, background: `color-mix(in srgb, ${stat.color} 10%, transparent)` }}>
                <stat.icon className="w-4 h-4" style={{ color: stat.color }} />
              </div>
            </div>
            <p className="text-xl font-bold font-[family-name:var(--font-heading)]" style={{ color: stat.color }}>{stat.value}</p>
            <p className="text-[10px] text-[var(--text-dim)] uppercase tracking-wider font-[family-name:var(--font-heading)] mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Groups Overview */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-[var(--text-primary)] font-[family-name:var(--font-heading)] tracking-wide flex items-center gap-2">
              <Users className="w-4 h-4 text-[var(--cyan)]" />
              MY GROUPS
            </h3>
            <Link href="/dashboard/teacher/groups" className="text-[10px] text-[var(--cyan)] hover:text-[var(--cyan-dim)] font-[family-name:var(--font-heading)] uppercase tracking-wider flex items-center gap-1">
              View all <ChevronRight className="w-3 h-3" />
            </Link>
          </div>

          {groups.map((group) => (
            <div key={group.id} className="card-cyber p-5" style={{ borderRadius: "4px" }}>
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <h4 className="text-sm font-bold text-[var(--text-primary)] font-[family-name:var(--font-heading)]">{group.name}</h4>
                  <p className="text-[10px] text-[var(--text-dim)] font-[family-name:var(--font-heading)] uppercase tracking-wider mt-0.5">
                    {group.section} • {group.subject}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {group.pendingReview > 0 && (
                    <span className="flex items-center gap-1 px-2 py-0.5 text-[9px] font-bold font-[family-name:var(--font-heading)] uppercase tracking-widest border" style={{ borderRadius: "2px", color: "var(--gold)", background: "var(--gold-glow)", borderColor: "rgba(255,179,71,0.3)" }}>
                      <Send className="w-3 h-3" />
                      {group.pendingReview} TO REVIEW
                    </span>
                  )}
                </div>
              </div>

              {/* Progress */}
              <div className="mb-3">
                <div className="flex items-center justify-between text-[10px] font-[family-name:var(--font-heading)] uppercase tracking-wider mb-1.5">
                  <span className="text-[var(--text-dim)]">{group.completedTasks}/{group.totalTasks} tasks</span>
                  <span className="text-[var(--cyan)]">{group.progress}%</span>
                </div>
                <div className="w-full h-2 bg-[var(--bg-card)] overflow-hidden" style={{ borderRadius: "2px" }}>
                  <div className="h-full transition-all duration-500" style={{ width: `${group.progress}%`, borderRadius: "2px", background: group.progress < 30 ? "var(--red)" : group.progress < 70 ? "var(--gold)" : "var(--emerald)", boxShadow: `0 0 6px ${group.progress < 30 ? "var(--red-glow)" : group.progress < 70 ? "var(--gold-glow)" : "var(--emerald-glow)"}` }} />
                </div>
              </div>

              {/* Members */}
              <div className="flex items-center gap-2 flex-wrap">
                {group.members.map((m) => (
                  <div key={m.id} className="flex items-center gap-1.5 px-2 py-1 bg-[var(--bg-elevated)] border border-[var(--border-dim)]" style={{ borderRadius: "4px" }}>
                    <span className="text-[10px] text-[var(--text-secondary)]">{m.name.split(" ")[0]}</span>
                    <span className="text-[9px] text-[var(--gold)] font-bold font-[family-name:var(--font-heading)]">L{m.level}</span>
                  </div>
                ))}
                {group.upcomingDeadline && (
                  <div className="flex items-center gap-1 ml-auto text-[10px] text-[var(--text-dim)]">
                    <Calendar className="w-3 h-3" />
                    Next: {new Date(group.upcomingDeadline).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Right Column */}
        <div className="space-y-4">
          {/* Pending Reviews */}
          <div className="card-cyber p-5" style={{ borderRadius: "4px" }}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs font-bold text-[var(--text-primary)] font-[family-name:var(--font-heading)] tracking-wide flex items-center gap-2">
                <Send className="w-4 h-4 text-[var(--gold)]" />
                PENDING REVIEWS
              </h3>
              <Link href="/dashboard/teacher/review" className="text-[10px] text-[var(--cyan)] hover:text-[var(--cyan-dim)] font-[family-name:var(--font-heading)] uppercase tracking-wider">
                Review all
              </Link>
            </div>

            {pendingTasks.length === 0 ? (
              <div className="text-center py-6">
                <CheckCircle2 className="w-6 h-6 text-[var(--emerald)] mx-auto mb-2" />
                <p className="text-xs text-[var(--text-dim)]">All caught up!</p>
              </div>
            ) : (
              <div className="space-y-2">
                {pendingTasks.slice(0, 5).map((task) => (
                  <Link key={task.id} href="/dashboard/teacher/review" className="block p-3 bg-[var(--bg-elevated)] border border-[var(--border-dim)] hover:border-[var(--gold)] transition-colors" style={{ borderRadius: "4px" }}>
                    <p className="text-xs font-medium text-[var(--text-primary)] truncate">{task.title}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] text-[var(--text-dim)]">{task.assignedTo?.name}</span>
                      <span className="text-[var(--text-dim)]">•</span>
                      <span className="text-[10px] text-[var(--text-dim)]">{task.groupName}</span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Recent Feedback */}
          <div className="card-cyber p-5" style={{ borderRadius: "4px" }}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs font-bold text-[var(--text-primary)] font-[family-name:var(--font-heading)] tracking-wide flex items-center gap-2">
                <ListTodo className="w-4 h-4 text-[var(--magenta)]" />
                RECENT ACTIVITY
              </h3>
            </div>

            {recentFeedback.length === 0 ? (
              <p className="text-xs text-[var(--text-dim)] text-center py-4">No recent activity</p>
            ) : (
              <div className="space-y-2">
                {recentFeedback.slice(0, 5).map((fb) => (
                  <div key={fb.id} className="p-2.5 bg-[var(--bg-elevated)] border border-[var(--border-dim)]" style={{ borderRadius: "4px" }}>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[9px] font-bold font-[family-name:var(--font-heading)] uppercase tracking-widest px-1.5 py-0.5 border" style={{ borderRadius: "2px", color: fb.type === "APPROVAL" ? "var(--emerald)" : "var(--magenta)", background: fb.type === "APPROVAL" ? "var(--emerald-glow)" : "var(--magenta-glow)", borderColor: fb.type === "APPROVAL" ? "rgba(0,255,136,0.2)" : "rgba(255,0,229,0.2)" }}>
                        {fb.type === "APPROVAL" ? "APPROVED" : "REVISION"}
                      </span>
                      <span className="text-[10px] text-[var(--text-dim)]">{fb.studentName}</span>
                    </div>
                    <p className="text-[10px] text-[var(--text-secondary)] line-clamp-1">{fb.content}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}