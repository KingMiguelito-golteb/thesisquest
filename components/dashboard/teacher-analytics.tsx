"use client";

import { BarChart3, Users, Target, CheckCircle2, Send, RotateCcw, TrendingUp, AlertTriangle } from "lucide-react";

interface AnalyticsData {
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
    progress: number;
    totalTasks: number;
    completedTasks: number;
    totalMilestones: number;
    completedMilestones: number;
    pendingReview: number;
    members: { id: string; name: string; level: number }[];
  }[];
}

export function TeacherAnalyticsClient({ data }: { data: AnalyticsData }) {
  const { stats, groups } = data;

  const completionRate = stats.totalTasks > 0 ? Math.round((stats.approvedTasks / stats.totalTasks) * 100) : 0;
  const milestoneRate = stats.totalMilestones > 0 ? Math.round((stats.completedMilestones / stats.totalMilestones) * 100) : 0;

  // Sort groups by progress (ascending = at risk first)
  const sortedGroups = [...groups].sort((a, b) => a.progress - b.progress);

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h2 className="text-2xl font-bold text-[var(--text-primary)] font-[family-name:var(--font-heading)] tracking-tight flex items-center gap-3">
          <BarChart3 className="w-6 h-6 text-[var(--cyan)]" />
          ANALYTICS
        </h2>
        <p className="text-[var(--text-secondary)] mt-1 text-sm">
          Overview of your groups&apos; research progress and performance
        </p>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: "TASK COMPLETION", value: `${completionRate}%`, sub: `${stats.approvedTasks}/${stats.totalTasks} tasks`, icon: CheckCircle2, color: "var(--emerald)" },
          { label: "MILESTONE PROGRESS", value: `${milestoneRate}%`, sub: `${stats.completedMilestones}/${stats.totalMilestones} milestones`, icon: Target, color: "var(--cyan)" },
          { label: "PENDING REVIEWS", value: stats.pendingReview, sub: "awaiting your review", icon: Send, color: "var(--gold)" },
          { label: "IN REVISION", value: stats.revisionTasks, sub: "awaiting student fixes", icon: RotateCcw, color: "var(--magenta)" },
        ].map((stat, i) => (
          <div key={i} className="card-cyber p-5" style={{ borderRadius: "4px" }}>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 flex items-center justify-center border" style={{ borderRadius: "4px", borderColor: stat.color, background: `color-mix(in srgb, ${stat.color} 10%, transparent)` }}>
                <stat.icon className="w-4 h-4" style={{ color: stat.color }} />
              </div>
            </div>
            <p className="text-2xl font-bold font-[family-name:var(--font-heading)]" style={{ color: stat.color }}>{stat.value}</p>
            <p className="text-[10px] text-[var(--text-dim)] uppercase tracking-wider font-[family-name:var(--font-heading)] mt-0.5">{stat.label}</p>
            <p className="text-[10px] text-[var(--text-dim)] mt-1">{stat.sub}</p>
          </div>
        ))}
      </div>

      {/* Group Progress Comparison */}
      <div className="card-cyber p-6" style={{ borderRadius: "4px" }}>
        <h3 className="text-xs font-bold text-[var(--text-primary)] font-[family-name:var(--font-heading)] tracking-wide flex items-center gap-2 mb-6">
          <TrendingUp className="w-4 h-4 text-[var(--cyan)]" />
          GROUP PROGRESS COMPARISON
        </h3>

        <div className="space-y-4">
          {sortedGroups.map((group) => {
            const isAtRisk = group.progress < 30;
            const barColor = isAtRisk ? "var(--red)" : group.progress < 70 ? "var(--gold)" : "var(--emerald)";

            return (
              <div key={group.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-[var(--text-primary)] font-[family-name:var(--font-heading)]">{group.name}</span>
                    <span className="text-[10px] text-[var(--text-dim)]">({group.section})</span>
                    {isAtRisk && (
                      <span className="flex items-center gap-1 text-[9px] font-bold font-[family-name:var(--font-heading)] uppercase tracking-widest px-1.5 py-0.5 border" style={{ borderRadius: "2px", color: "var(--red)", background: "var(--red-glow)", borderColor: "rgba(255,51,102,0.2)" }}>
                        <AlertTriangle className="w-3 h-3" />AT RISK
                      </span>
                    )}
                  </div>
                  <span className="text-xs font-bold font-[family-name:var(--font-heading)]" style={{ color: barColor }}>{group.progress}%</span>
                </div>
                <div className="w-full h-3 bg-[var(--bg-card)] overflow-hidden" style={{ borderRadius: "2px" }}>
                  <div className="h-full transition-all duration-500" style={{ width: `${group.progress}%`, borderRadius: "2px", background: barColor, boxShadow: `0 0 6px color-mix(in srgb, ${barColor} 30%, transparent)` }} />
                </div>
                <div className="flex items-center gap-4 text-[10px] text-[var(--text-dim)]">
                  <span>{group.completedTasks}/{group.totalTasks} tasks</span>
                  <span>{group.completedMilestones}/{group.totalMilestones} milestones</span>
                  <span>{group.members.length} members</span>
                  {group.pendingReview > 0 && <span className="text-[var(--gold)]">{group.pendingReview} pending</span>}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Student Performance */}
      <div className="card-cyber p-6" style={{ borderRadius: "4px" }}>
        <h3 className="text-xs font-bold text-[var(--text-primary)] font-[family-name:var(--font-heading)] tracking-wide flex items-center gap-2 mb-4">
          <Users className="w-4 h-4 text-[var(--magenta)]" />
          STUDENT LEVELS
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {groups
            .flatMap((g) => g.members)
            .filter((m, i, arr) => arr.findIndex((a) => a.id === m.id) === i)
            .sort((a, b) => b.level - a.level)
            .map((student) => (
              <div key={student.id} className="flex items-center gap-2 p-3 bg-[var(--bg-elevated)] border border-[var(--border-dim)]" style={{ borderRadius: "4px" }}>
                <div className="w-8 h-8 border flex items-center justify-center text-[9px] font-bold font-[family-name:var(--font-heading)]" style={{ borderRadius: "4px", borderColor: "var(--cyan)", background: "var(--cyan-glow)", color: "var(--cyan)" }}>
                  {student.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-[var(--text-primary)] truncate">{student.name}</p>
                  <p className="text-[10px] text-[var(--gold)] font-bold font-[family-name:var(--font-heading)]">Level {student.level}</p>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}