"use client";

import { useState } from "react";
import {
  Target,
  CheckCircle2,
  Clock,
  Send,
  RotateCcw,
  ListTodo,
  Lock,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  Coins,
  Zap,
  Users,
  Calendar,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface MilestoneData {
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
    description?: string | null;
    status: string;
    xpReward?: number;
    assignedTo: { id: string; name: string } | null;
    feedbackCount?: number;
  }[];
  taskCount: number;
  completedTaskCount: number;
}

interface DashboardData {
  user: { id: string; name: string };
  group: {
    name: string;
    section: string;
    subject: string;
    teacher: { name: string };
  } | null;
  milestones: MilestoneData[];
  stats: {
    overallProgress: number;
    totalMilestones: number;
    completedMilestones: number;
  };
}

export function MilestonesClient({ data }: { data: DashboardData }) {
  const [expandedMilestone, setExpandedMilestone] = useState<string | null>(
    data.milestones.find((m) => m.status === "IN_PROGRESS")?.id || null
  );

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "COMPLETED":
      case "APPROVED":
        return { color: "var(--emerald)", bg: "var(--emerald-glow)", label: "COMPLETED" };
      case "IN_PROGRESS":
        return { color: "var(--cyan)", bg: "var(--cyan-glow)", label: "IN PROGRESS" };
      case "SUBMITTED":
        return { color: "var(--gold)", bg: "var(--gold-glow)", label: "SUBMITTED" };
      case "REVISION":
        return { color: "var(--magenta)", bg: "var(--magenta-glow)", label: "REVISION" };
      case "LOCKED":
        return { color: "var(--text-dim)", bg: "rgba(85,85,85,0.1)", label: "LOCKED" };
      case "TODO":
        return { color: "var(--text-secondary)", bg: "rgba(136,136,136,0.1)", label: "TODO" };
      default:
        return { color: "var(--text-dim)", bg: "rgba(85,85,85,0.1)", label: status };
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "COMPLETED":
      case "APPROVED":
        return <CheckCircle2 className="w-4 h-4" />;
      case "IN_PROGRESS":
        return <Clock className="w-4 h-4" />;
      case "SUBMITTED":
        return <Send className="w-4 h-4" />;
      case "REVISION":
        return <RotateCcw className="w-4 h-4" />;
      case "LOCKED":
        return <Lock className="w-4 h-4" />;
      case "TODO":
        return <ListTodo className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  const overallProgress = data.stats.overallProgress;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-[var(--text-primary)] font-[family-name:var(--font-heading)] tracking-tight flex items-center gap-3">
          <Target className="w-6 h-6 text-[var(--cyan)]" />
          RESEARCH MILESTONES
        </h2>
        <p className="text-[var(--text-secondary)] mt-1 text-sm">
          Track your research progress through each chapter and milestone
        </p>
      </div>

      {/* Overall Progress Card */}
      <div className="card-cyber-accent p-6" style={{ borderRadius: "4px" }}>
        <div className="flex flex-col sm:flex-row sm:items-center gap-6">
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-[var(--text-secondary)] font-[family-name:var(--font-heading)] uppercase tracking-wider">
                OVERALL RESEARCH PROGRESS
              </span>
              <span className="text-sm font-bold text-[var(--cyan)] font-[family-name:var(--font-heading)]">
                {overallProgress}%
              </span>
            </div>
            <div className="w-full h-4 bg-[var(--bg-card)] overflow-hidden" style={{ borderRadius: "2px" }}>
              <div
                className="h-full xp-bar-fill neon-progress transition-all duration-1000"
                style={{ width: `${overallProgress}%`, borderRadius: "2px" }}
              />
            </div>
            <div className="flex items-center justify-between mt-2">
              <span className="text-[10px] text-[var(--text-dim)]">
                {data.stats.completedMilestones} of {data.stats.totalMilestones} milestones completed
              </span>
              {data.group && (
                <span className="text-[10px] text-[var(--text-dim)] flex items-center gap-1">
                  <Users className="w-3 h-3" />
                  {data.group.name} • {data.group.section}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Milestone Timeline */}
      <div className="relative">
        {/* Timeline line */}
        <div
          className="absolute left-[23px] top-0 bottom-0 w-px"
          style={{ background: "var(--border-subtle)" }}
        />

        <div className="space-y-4">
          {data.milestones.map((milestone, index) => {
            const statusStyle = getStatusStyle(milestone.status);
            const isExpanded = expandedMilestone === milestone.id;
            const isLocked = milestone.status === "LOCKED";
            const taskProgress =
              milestone.taskCount > 0
                ? Math.round((milestone.completedTaskCount / milestone.taskCount) * 100)
                : 0;

            return (
              <div key={milestone.id} className="relative pl-14">
                {/* Timeline dot */}
                <div
                  className="absolute left-0 top-5 w-[46px] h-[46px] flex items-center justify-center border-2 z-10"
                  style={{
                    borderRadius: "4px",
                    borderColor: statusStyle.color,
                    background: isLocked ? "var(--bg-dark)" : statusStyle.bg,
                    color: statusStyle.color,
                    boxShadow: isLocked ? "none" : `0 0 15px ${statusStyle.bg}`,
                  }}
                >
                  {milestone.status === "COMPLETED" ? (
                    <CheckCircle2 className="w-5 h-5" />
                  ) : (
                    <span className="text-sm font-bold font-[family-name:var(--font-heading)]">
                      {index + 1}
                    </span>
                  )}
                </div>

                {/* Card */}
                <div
                  className={cn(
                    "border transition-all duration-200",
                    isLocked ? "opacity-50 bg-[var(--bg-card)]/50" : "card-cyber"
                  )}
                  style={{ borderRadius: "4px" }}
                >
                  {/* Card Header */}
                  <button
                    onClick={() => !isLocked && setExpandedMilestone(isExpanded ? null : milestone.id)}
                    className={cn(
                      "w-full p-5 flex items-start justify-between gap-4 text-left",
                      !isLocked && "cursor-pointer hover:bg-[var(--bg-hover)]"
                    )}
                    disabled={isLocked}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <h3 className="text-sm font-bold text-[var(--text-primary)] font-[family-name:var(--font-heading)]">
                          {milestone.title}
                        </h3>
                        <span
                          className="inline-flex items-center gap-1 px-2 py-0.5 text-[9px] font-bold font-[family-name:var(--font-heading)] uppercase tracking-widest border"
                          style={{
                            borderRadius: "2px",
                            color: statusStyle.color,
                            background: statusStyle.bg,
                            borderColor: `color-mix(in srgb, ${statusStyle.color} 30%, transparent)`,
                          }}
                        >
                          {getStatusIcon(milestone.status)}
                          {statusStyle.label}
                        </span>
                      </div>

                      {milestone.description && (
                        <p className="text-xs text-[var(--text-dim)] mt-1">
                          {milestone.description}
                        </p>
                      )}

                      {/* Progress + Meta */}
                      <div className="flex items-center gap-4 mt-3 flex-wrap">
                        {!isLocked && milestone.taskCount > 0 && (
                          <div className="flex items-center gap-2 flex-1 min-w-[150px]">
                            <div className="flex-1 h-1.5 bg-[var(--bg-card)] overflow-hidden" style={{ borderRadius: "2px" }}>
                              <div
                                className="h-full transition-all duration-500"
                                style={{
                                  width: `${taskProgress}%`,
                                  borderRadius: "2px",
                                  background: statusStyle.color,
                                  boxShadow: `0 0 6px ${statusStyle.bg}`,
                                }}
                              />
                            </div>
                            <span className="text-[10px] font-bold font-[family-name:var(--font-heading)]" style={{ color: statusStyle.color }}>
                              {milestone.completedTaskCount}/{milestone.taskCount}
                            </span>
                          </div>
                        )}

                        <div className="flex items-center gap-3">
                          <span className="flex items-center gap-1 text-[10px] text-[var(--text-dim)]">
                            <Zap className="w-3 h-3 text-[var(--cyan)]" />
                            {milestone.xpReward} XP
                          </span>
                          {milestone.dueDate && (
                            <span className="flex items-center gap-1 text-[10px] text-[var(--text-dim)]">
                              <Calendar className="w-3 h-3" />
                              {new Date(milestone.dueDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {!isLocked && (
                      <div className="flex-shrink-0 mt-1 text-[var(--text-dim)]">
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </div>
                    )}
                  </button>

                  {/* Expanded Tasks */}
                  {isExpanded && !isLocked && (
                    <div className="border-t border-[var(--border-dim)] p-4">
                      <p className="text-[10px] text-[var(--text-dim)] font-[family-name:var(--font-heading)] uppercase tracking-widest mb-3">
                        TASKS
                      </p>
                      <div className="space-y-2">
                        {milestone.tasks.map((task) => {
                          const taskStyle = getStatusStyle(task.status);

                          return (
                            <div
                              key={task.id}
                              className="flex items-center gap-3 p-3 bg-[var(--bg-elevated)] border border-[var(--border-dim)]"
                              style={{ borderRadius: "4px" }}
                            >
                              <div
                                className="w-7 h-7 flex items-center justify-center border flex-shrink-0"
                                style={{
                                  borderRadius: "4px",
                                  borderColor: taskStyle.color,
                                  background: taskStyle.bg,
                                  color: taskStyle.color,
                                }}
                              >
                                {getStatusIcon(task.status)}
                              </div>

                              <div className="flex-1 min-w-0">
                                <p className="text-xs font-medium text-[var(--text-primary)] truncate">
                                  {task.title}
                                </p>
                                {task.assignedTo && (
                                  <p className="text-[10px] text-[var(--text-dim)]">
                                    Assigned to:{" "}
                                    <span style={{ color: task.assignedTo.id === data.user.id ? "var(--cyan)" : "var(--text-secondary)" }}>
                                      {task.assignedTo.id === data.user.id ? "You" : task.assignedTo.name}
                                    </span>
                                  </p>
                                )}
                              </div>

                              <span
                                className="text-[9px] font-bold font-[family-name:var(--font-heading)] uppercase tracking-widest px-2 py-0.5 border flex-shrink-0"
                                style={{
                                  borderRadius: "2px",
                                  color: taskStyle.color,
                                  background: taskStyle.bg,
                                  borderColor: `color-mix(in srgb, ${taskStyle.color} 30%, transparent)`,
                                }}
                              >
                                {task.status.replace("_", " ")}
                              </span>
                            </div>
                          );
                        })}

                        {milestone.tasks.length === 0 && (
                          <p className="text-xs text-[var(--text-dim)] text-center py-4">
                            No tasks created for this milestone yet
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}