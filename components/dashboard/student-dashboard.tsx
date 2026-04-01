"use client";

import {
  Trophy,
  Target,
  ListTodo,
  Zap,
  TrendingUp,
  Clock,
  CheckCircle2,
  Send,
  RotateCcw,
  ChevronRight,
  Users,
  BookOpen,
  MessageSquare,
  Star,
  Flame,
  AlertCircle,
  Sparkles,
  Shield,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface DashboardData {
  user: {
    id: string;
    name: string;
    email: string;
    xp: number;
    level: number;
    avatar: string | null;
  };
  group: {
    id: string;
    name: string;
    section: string;
    subject: string;
    teacher: { id: string; name: string; email: string };
    members: {
      id: string;
      name: string;
      xp: number;
      level: number;
      avatar: string | null;
    }[];
  } | null;
  milestones: {
    id: string;
    title: string;
    description: string | null;
    order: number;
    status: string;
    dueDate: Date | null;
    xpReward: number;
    tasks: {
      id: string;
      title: string;
      status: string;
      assignedTo: { id: string; name: string } | null;
    }[];
    taskCount: number;
    completedTaskCount: number;
  }[];
  stats: {
    totalTasks: number;
    completedTasks: number;
    pendingTasks: number;
    submittedTasks: number;
    revisionTasks?: number;
    totalMilestones: number;
    completedMilestones: number;
    overallProgress: number;
  };
  achievements: {
    id: string;
    title: string;
    description: string;
    icon: string;
    unlockedAt: Date;
  }[];
  notifications: {
    id: string;
    message: string;
    read: boolean;
    createdAt: Date;
  }[];
  recentFeedback: {
    id: string;
    content: string;
    type: string;
    createdAt: Date;
    teacherName: string;
    taskTitle: string;
  }[];
}

export function StudentDashboardClient({ data }: { data: DashboardData }) {
  const { user, group, milestones, stats, achievements, notifications, recentFeedback } = data;

  const xpForNextLevel = user.level * 100;
  const xpProgress = Math.min((user.xp / xpForNextLevel) * 100, 100);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "COMPLETED":
      case "APPROVED":
        return { color: "var(--emerald)", bg: "var(--emerald-glow)" };
      case "IN_PROGRESS":
        return { color: "var(--cyan)", bg: "var(--cyan-glow)" };
      case "SUBMITTED":
        return { color: "var(--gold)", bg: "var(--gold-glow)" };
      case "REVISION":
        return { color: "var(--magenta)", bg: "var(--magenta-glow)" };
      case "LOCKED":
      case "TODO":
      default:
        return { color: "var(--text-dim)", bg: "rgba(85, 85, 85, 0.1)" };
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "COMPLETED":
      case "APPROVED":
        return <CheckCircle2 className="w-3.5 h-3.5" />;
      case "IN_PROGRESS":
        return <Clock className="w-3.5 h-3.5" />;
      case "SUBMITTED":
        return <Send className="w-3.5 h-3.5" />;
      case "REVISION":
        return <RotateCcw className="w-3.5 h-3.5" />;
      case "TODO":
        return <ListTodo className="w-3.5 h-3.5" />;
      default:
        return <AlertCircle className="w-3.5 h-3.5" />;
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[var(--text-primary)] font-[family-name:var(--font-heading)] tracking-tight">
            WELCOME BACK, {user.name.split(" ")[0].toUpperCase()}
          </h2>
          <p className="text-[var(--text-secondary)] mt-1 text-sm">
            {stats.overallProgress < 30
              ? "Keep pushing! Every task brings you closer to the finish line."
              : stats.overallProgress < 70
                ? "Great progress! You're well on your way."
                : "Almost there! The finish line is in sight! 🏁"}
          </p>
        </div>
        {group && (
          <div
            className="flex items-center gap-2 px-4 py-2 border border-[var(--cyan)]"
            style={{ borderRadius: "4px", background: "var(--cyan-glow)" }}
          >
            <Users className="w-4 h-4 text-[var(--cyan)]" />
            <span className="text-xs text-[var(--cyan)] font-bold font-[family-name:var(--font-heading)] uppercase tracking-wide">
              {group.name}
            </span>
            <span className="text-[var(--text-dim)]">•</span>
            <span className="text-[10px] text-[var(--text-secondary)]">{group.section}</span>
          </div>
        )}
      </div>

      {/* Level & XP Card */}
      <div
        className="card-cyber-accent p-6"
        style={{ borderRadius: "4px" }}
      >
        <div className="flex flex-col sm:flex-row sm:items-center gap-6">
          {/* Avatar & Level */}
          <div className="flex items-center gap-4">
            <div className="relative">
              <div
                className="w-16 h-16 border-2 flex items-center justify-center text-xl font-bold font-[family-name:var(--font-heading)]"
                style={{
                  borderRadius: "4px",
                  borderColor: "var(--cyan)",
                  background: "var(--cyan-glow)",
                  color: "var(--cyan)",
                  boxShadow: "0 0 20px var(--cyan-glow), inset 0 0 20px var(--cyan-glow)",
                }}
              >
                {user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)}
              </div>
              <div
                className="absolute -bottom-1.5 -right-1.5 w-7 h-7 flex items-center justify-center border-2"
                style={{
                  borderRadius: "4px",
                  borderColor: "var(--gold)",
                  background: "var(--bg-darkest)",
                  boxShadow: "0 0 8px var(--gold-glow)",
                }}
              >
                <span className="text-[10px] font-bold text-[var(--gold)] font-[family-name:var(--font-heading)]">
                  {user.level}
                </span>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-bold text-[var(--text-primary)] font-[family-name:var(--font-heading)] tracking-tight">
                {user.name}
              </h3>
              <p className="text-xs text-[var(--text-secondary)]">
                Level {user.level} Researcher
              </p>
            </div>
          </div>

          {/* XP Progress */}
          <div className="flex-1">
            <div className="flex items-center justify-between text-xs mb-2 font-[family-name:var(--font-heading)]">
              <span className="text-[var(--text-dim)] uppercase tracking-wider text-[10px]">
                Experience Points
              </span>
              <span className="text-[var(--cyan)] font-bold">
                {user.xp} / {xpForNextLevel} XP
              </span>
            </div>
            <div
              className="w-full h-3 bg-[var(--bg-card)] overflow-hidden"
              style={{ borderRadius: "2px" }}
            >
              <div
                className="h-full xp-bar-fill neon-progress"
                style={{ width: `${xpProgress}%`, borderRadius: "2px" }}
              />
            </div>
            <p className="text-[10px] text-[var(--text-dim)] mt-1">
              {xpForNextLevel - user.xp} XP until Level {user.level + 1}
            </p>
          </div>

          {/* Achievements Count */}
          <div
            className="text-center px-6 py-3 border"
            style={{
              borderRadius: "4px",
              borderColor: "var(--gold)",
              background: "var(--gold-glow)",
              boxShadow: "0 0 15px var(--gold-glow)",
            }}
          >
            <div className="flex items-center gap-1.5 justify-center">
              <Trophy className="w-5 h-5 text-[var(--gold)]" />
              <span className="text-2xl font-bold text-[var(--gold)] font-[family-name:var(--font-heading)]">
                {achievements.length}
              </span>
            </div>
            <p className="text-[10px] text-[var(--text-secondary)] uppercase tracking-wider font-[family-name:var(--font-heading)] mt-1">
              Achievements
            </p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        {[
          { label: "OVERALL", value: `${stats.overallProgress}%`, icon: TrendingUp, color: "var(--cyan)" },
          { label: "COMPLETED", value: stats.completedTasks, icon: CheckCircle2, color: "var(--emerald)" },
          { label: "PENDING", value: stats.pendingTasks, icon: Clock, color: "var(--gold)" },
          { label: "IN REVIEW", value: stats.submittedTasks, icon: Send, color: "var(--magenta)" },
          { label: "MILESTONES", value: `${stats.completedMilestones}/${stats.totalMilestones}`, icon: Target, color: "var(--cyan)" },
        ].map((stat, i) => (
          <div
            key={i}
            className="card-cyber p-4 group"
            style={{ borderRadius: "4px" }}
          >
            <div className="flex items-center gap-2 mb-3">
              <div
                className="w-8 h-8 flex items-center justify-center border"
                style={{
                  borderRadius: "4px",
                  borderColor: stat.color,
                  background: `color-mix(in srgb, ${stat.color} 10%, transparent)`,
                }}
              >
                <stat.icon className="w-4 h-4" style={{ color: stat.color }} />
              </div>
            </div>
            <p className="text-xl font-bold font-[family-name:var(--font-heading)]" style={{ color: stat.color }}>
              {stat.value}
            </p>
            <p className="text-[10px] text-[var(--text-dim)] uppercase tracking-wider font-[family-name:var(--font-heading)] mt-1">
              {stat.label}
            </p>
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Milestones Timeline */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-[var(--text-primary)] font-[family-name:var(--font-heading)] tracking-wide flex items-center gap-2">
              <Target className="w-4 h-4 text-[var(--cyan)]" />
              RESEARCH MILESTONES
            </h3>
            <Link
              href="/dashboard/student/milestones"
              className="text-[10px] text-[var(--cyan)] hover:text-[var(--cyan-dim)] flex items-center gap-1 font-[family-name:var(--font-heading)] uppercase tracking-wider"
            >
              View all <ChevronRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="space-y-2">
            {milestones.map((milestone, index) => {
              const taskProgress =
                milestone.taskCount > 0
                  ? Math.round((milestone.completedTaskCount / milestone.taskCount) * 100)
                  : 0;
              const isLocked = milestone.status === "LOCKED";
              const statusColors = getStatusColor(milestone.status);

              return (
                <div
                  key={milestone.id}
                  className={cn(
                    "p-4 border transition-all duration-200",
                    isLocked
                      ? "bg-[var(--bg-card)]/50 border-[var(--border-dim)] opacity-50"
                      : "card-cyber"
                  )}
                  style={{ borderRadius: "4px" }}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3 flex-1">
                      {/* Milestone Number */}
                      <div
                        className="w-9 h-9 flex items-center justify-center text-xs font-bold font-[family-name:var(--font-heading)] flex-shrink-0 border"
                        style={{
                          borderRadius: "4px",
                          borderColor: statusColors.color,
                          background: statusColors.bg,
                          color: statusColors.color,
                        }}
                      >
                        {milestone.status === "COMPLETED" ? (
                          <CheckCircle2 className="w-4 h-4" />
                        ) : (
                          index + 1
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="font-semibold text-[var(--text-primary)] text-sm font-[family-name:var(--font-heading)]">
                            {milestone.title}
                          </h4>
                          <span
                            className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold font-[family-name:var(--font-heading)] uppercase tracking-wider border"
                            style={{
                              borderRadius: "2px",
                              color: statusColors.color,
                              background: statusColors.bg,
                              borderColor: `color-mix(in srgb, ${statusColors.color} 30%, transparent)`,
                            }}
                          >
                            {getStatusIcon(milestone.status)}
                            {milestone.status.replace("_", " ")}
                          </span>
                        </div>

                        {milestone.description && (
                          <p className="text-xs text-[var(--text-dim)] mt-1 line-clamp-1">
                            {milestone.description}
                          </p>
                        )}

                        {!isLocked && milestone.taskCount > 0 && (
                          <div className="mt-3">
                            <div className="flex items-center justify-between text-[10px] mb-1.5 font-[family-name:var(--font-heading)] uppercase tracking-wider">
                              <span className="text-[var(--text-dim)]">
                                {milestone.completedTaskCount}/{milestone.taskCount} tasks
                              </span>
                              <span style={{ color: statusColors.color }}>
                                {taskProgress}%
                              </span>
                            </div>
                            <div
                              className="w-full h-1.5 bg-[var(--bg-card)] overflow-hidden"
                              style={{ borderRadius: "2px" }}
                            >
                              <div
                                className="h-full transition-all duration-500"
                                style={{
                                  width: `${taskProgress}%`,
                                  borderRadius: "2px",
                                  background: statusColors.color,
                                  boxShadow: `0 0 8px ${statusColors.bg}`,
                                }}
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {milestone.dueDate && (
                      <div className="text-right flex-shrink-0">
                        <p className="text-[9px] text-[var(--text-dim)] uppercase tracking-widest font-[family-name:var(--font-heading)]">
                          Due
                        </p>
                        <p className="text-xs text-[var(--text-secondary)] font-medium font-[family-name:var(--font-heading)]">
                          {new Date(milestone.dueDate).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                          })}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-4">
          {/* Group Info */}
          {group && (
            <div className="card-cyber p-5" style={{ borderRadius: "4px" }}>
              <h3 className="text-xs font-bold text-[var(--text-primary)] font-[family-name:var(--font-heading)] tracking-wide flex items-center gap-2 mb-4">
                <BookOpen className="w-4 h-4 text-[var(--cyan)]" />
                MY GROUP
              </h3>
              <div className="space-y-3">
                <div>
                  <p className="text-[10px] text-[var(--text-dim)] uppercase tracking-widest font-[family-name:var(--font-heading)]">
                    Group Name
                  </p>
                  <p className="text-sm text-[var(--text-primary)] font-medium">{group.name}</p>
                </div>
                <div>
                  <p className="text-[10px] text-[var(--text-dim)] uppercase tracking-widest font-[family-name:var(--font-heading)]">
                    Subject
                  </p>
                  <p className="text-sm text-[var(--text-primary)]">{group.subject}</p>
                </div>
                <div>
                  <p className="text-[10px] text-[var(--text-dim)] uppercase tracking-widest font-[family-name:var(--font-heading)]">
                    Adviser
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <Shield className="w-3.5 h-3.5 text-[var(--magenta)]" />
                    <p className="text-sm text-[var(--text-primary)]">{group.teacher.name}</p>
                  </div>
                </div>
                <div>
                  <p className="text-[10px] text-[var(--text-dim)] uppercase tracking-widest font-[family-name:var(--font-heading)] mb-2">
                    Members
                  </p>
                  <div className="space-y-2">
                    {group.members.map((member) => (
                      <div key={member.id} className="flex items-center gap-2">
                        <div
                          className="w-6 h-6 border flex items-center justify-center text-[9px] font-bold font-[family-name:var(--font-heading)]"
                          style={{
                            borderRadius: "2px",
                            borderColor: "var(--cyan)",
                            background: "var(--cyan-glow)",
                            color: "var(--cyan)",
                          }}
                        >
                          {member.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-[var(--text-primary)] truncate">
                            {member.name}
                            {member.id === user.id && (
                              <span className="text-[var(--cyan)] ml-1 text-[10px]">(YOU)</span>
                            )}
                          </p>
                        </div>
                        <div className="flex items-center gap-1">
                          <Zap className="w-3 h-3 text-[var(--gold)]" />
                          <span className="text-[10px] text-[var(--gold)] font-[family-name:var(--font-heading)] font-bold">
                            {member.level}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Recent Achievements */}
          <div className="card-cyber p-5" style={{ borderRadius: "4px" }}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs font-bold text-[var(--text-primary)] font-[family-name:var(--font-heading)] tracking-wide flex items-center gap-2">
                <Trophy className="w-4 h-4 text-[var(--gold)]" />
                ACHIEVEMENTS
              </h3>
              <Link
                href="/dashboard/student/achievements"
                className="text-[10px] text-[var(--cyan)] hover:text-[var(--cyan-dim)] font-[family-name:var(--font-heading)] uppercase tracking-wider"
              >
                View all
              </Link>
            </div>

            {achievements.length > 0 ? (
              <div className="space-y-2">
                {achievements.slice(0, 4).map((achievement) => (
                  <div
                    key={achievement.id}
                    className="flex items-center gap-3 p-2.5 bg-[var(--bg-elevated)] border border-[var(--border-dim)]"
                    style={{ borderRadius: "4px" }}
                  >
                    <div
                      className="w-8 h-8 flex items-center justify-center border badge-shine"
                      style={{
                        borderRadius: "4px",
                        borderColor: "var(--gold)",
                        background: "var(--gold-glow)",
                      }}
                    >
                      <Star className="w-4 h-4 text-[var(--gold)]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-[var(--text-primary)] font-[family-name:var(--font-heading)] truncate">
                        {achievement.title}
                      </p>
                      <p className="text-[10px] text-[var(--text-dim)] truncate">
                        {achievement.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-[var(--text-dim)] text-center py-4">
                Complete tasks to unlock achievements! 🏆
              </p>
            )}
          </div>

          {/* Recent Feedback */}
          <div className="card-cyber p-5" style={{ borderRadius: "4px" }}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs font-bold text-[var(--text-primary)] font-[family-name:var(--font-heading)] tracking-wide flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-[var(--magenta)]" />
                RECENT FEEDBACK
              </h3>
              <Link
                href="/dashboard/student/feedback"
                className="text-[10px] text-[var(--cyan)] hover:text-[var(--cyan-dim)] font-[family-name:var(--font-heading)] uppercase tracking-wider"
              >
                View all
              </Link>
            </div>

            {recentFeedback.length > 0 ? (
              <div className="space-y-2">
                {recentFeedback.slice(0, 3).map((fb) => {
                  const fbColor =
                    fb.type === "APPROVAL"
                      ? { color: "var(--emerald)", bg: "var(--emerald-glow)" }
                      : fb.type === "REVISION_REQUEST"
                        ? { color: "var(--magenta)", bg: "var(--magenta-glow)" }
                        : { color: "var(--cyan)", bg: "var(--cyan-glow)" };

                  return (
                    <div
                      key={fb.id}
                      className="p-3 bg-[var(--bg-elevated)] border border-[var(--border-dim)] space-y-1.5"
                      style={{ borderRadius: "4px" }}
                    >
                      <div className="flex items-center gap-2">
                        <span
                          className="inline-flex items-center px-2 py-0.5 text-[9px] font-bold font-[family-name:var(--font-heading)] uppercase tracking-wider border"
                          style={{
                            borderRadius: "2px",
                            color: fbColor.color,
                            background: fbColor.bg,
                            borderColor: `color-mix(in srgb, ${fbColor.color} 30%, transparent)`,
                          }}
                        >
                          {fb.type === "APPROVAL" ? "APPROVED" : fb.type === "REVISION_REQUEST" ? "REVISION" : "COMMENT"}
                        </span>
                        <span className="text-[10px] text-[var(--text-dim)]">
                          {fb.teacherName}
                        </span>
                      </div>
                      <p className="text-xs text-[var(--text-secondary)] line-clamp-2">
                        {fb.content}
                      </p>
                      <p className="text-[10px] text-[var(--text-dim)]">
                        on &quot;{fb.taskTitle}&quot;
                      </p>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-xs text-[var(--text-dim)] text-center py-4">
                No feedback yet. Submit tasks to get feedback! 📝
              </p>
            )}
          </div>

          {/* Notifications */}
          {notifications.length > 0 && (
            <div className="card-cyber p-5" style={{ borderRadius: "4px" }}>
              <h3 className="text-xs font-bold text-[var(--text-primary)] font-[family-name:var(--font-heading)] tracking-wide flex items-center gap-2 mb-4">
                <Sparkles className="w-4 h-4 text-[var(--magenta)]" />
                NOTIFICATIONS
                <span
                  className="ml-auto text-[9px] px-2 py-0.5 font-bold font-[family-name:var(--font-heading)]"
                  style={{
                    borderRadius: "2px",
                    color: "var(--magenta)",
                    background: "var(--magenta-glow)",
                    border: "1px solid color-mix(in srgb, var(--magenta) 30%, transparent)",
                  }}
                >
                  {notifications.length} NEW
                </span>
              </h3>
              <div className="space-y-2">
                {notifications.slice(0, 4).map((notif) => (
                  <div
                    key={notif.id}
                    className="p-2.5 bg-[var(--bg-elevated)] border border-[var(--border-dim)]"
                    style={{ borderRadius: "4px" }}
                  >
                    <p className="text-xs text-[var(--text-secondary)]">{notif.message}</p>
                    <p className="text-[10px] text-[var(--text-dim)] mt-1">
                      {new Date(notif.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        hour: "numeric",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}