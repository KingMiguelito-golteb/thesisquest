"use client";

import { useState } from "react";
import {
  ListTodo,
  CheckCircle2,
  Clock,
  Send,
  RotateCcw,
  AlertCircle,
  Zap,
  Coins,
  Play,
  ArrowRight,
  MessageSquare,
  Filter,
  Plus,
  Trash2,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { updateTaskStatus, createTask, deleteTask } from "@/app/actions/tasks";
import { cn } from "@/lib/utils";

interface TaskData {
  id: string;
  title: string;
  description?: string | null;
  status: string;
  xpReward?: number;
  dueDate?: Date | null;
  assignedTo: { id: string; name: string } | null;
  feedbackCount?: number;
}

interface DashboardData {
  user: { id: string; name: string };
  group: {
    id: string;
    name: string;
    members: { id: string; name: string }[];
  } | null;
  milestones: {
    id: string;
    title: string;
    status: string;
    tasks: TaskData[];
  }[];
}

export function TasksClient({ data }: { data: DashboardData }) {
  const [filter, setFilter] = useState<string>("ALL");
  const [loading, setLoading] = useState<string | null>(null);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    milestoneId: "",
    assignedToId: data.user.id,
  });

  const filters = [
    "ALL",
    "TODO",
    "IN_PROGRESS",
    "SUBMITTED",
    "REVISION",
    "APPROVED",
  ];

  const myTasks = data.milestones.flatMap((m) =>
    m.tasks
      .filter((t) => t.assignedTo?.id === data.user.id)
      .map((t) => ({
        ...t,
        milestoneName: m.title,
        milestoneStatus: m.status,
      }))
  );

  const allGroupTasks = data.milestones.flatMap((m) =>
    m.tasks.map((t) => ({
      ...t,
      milestoneName: m.title,
      milestoneStatus: m.status,
    }))
  );

  const [showAllTasks, setShowAllTasks] = useState(false);
  const displayTasks = showAllTasks ? allGroupTasks : myTasks;

  const filteredTasks =
    filter === "ALL"
      ? displayTasks
      : displayTasks.filter((t) => t.status === filter);

  const taskCounts = {
    ALL: displayTasks.length,
    TODO: displayTasks.filter((t) => t.status === "TODO").length,
    IN_PROGRESS: displayTasks.filter((t) => t.status === "IN_PROGRESS").length,
    SUBMITTED: displayTasks.filter((t) => t.status === "SUBMITTED").length,
    REVISION: displayTasks.filter((t) => t.status === "REVISION").length,
    APPROVED: displayTasks.filter((t) => t.status === "APPROVED").length,
  };

  // Milestones where tasks can be added (not locked)
  const availableMilestones = data.milestones.filter(
    (m) => m.status !== "LOCKED"
  );

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "COMPLETED":
      case "APPROVED":
        return {
          color: "var(--emerald)",
          bg: "var(--emerald-glow)",
          label: "APPROVED",
        };
      case "IN_PROGRESS":
        return {
          color: "var(--cyan)",
          bg: "var(--cyan-glow)",
          label: "IN PROGRESS",
        };
      case "SUBMITTED":
        return {
          color: "var(--gold)",
          bg: "var(--gold-glow)",
          label: "SUBMITTED",
        };
      case "REVISION":
        return {
          color: "var(--magenta)",
          bg: "var(--magenta-glow)",
          label: "REVISION",
        };
      case "TODO":
        return {
          color: "var(--text-secondary)",
          bg: "rgba(136,136,136,0.1)",
          label: "TODO",
        };
      default:
        return {
          color: "var(--text-dim)",
          bg: "rgba(85,85,85,0.1)",
          label: status,
        };
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "APPROVED":
        return <CheckCircle2 className="w-4 h-4" />;
      case "IN_PROGRESS":
        return <Clock className="w-4 h-4" />;
      case "SUBMITTED":
        return <Send className="w-4 h-4" />;
      case "REVISION":
        return <RotateCcw className="w-4 h-4" />;
      case "TODO":
        return <ListTodo className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  async function handleStatusChange(
    taskId: string,
    newStatus: "IN_PROGRESS" | "SUBMITTED"
  ) {
    setLoading(taskId);
    setMessage(null);
    const result = await updateTaskStatus(taskId, newStatus);
    if (result.error) setMessage({ type: "error", text: result.error });
    else if (result.success)
      setMessage({ type: "success", text: result.success });
    setLoading(null);
    setTimeout(() => setMessage(null), 3000);
  }

  async function handleCreateTask() {
    if (!newTask.title.trim()) {
      setMessage({ type: "error", text: "Task title is required" });
      return;
    }
    if (!newTask.milestoneId) {
      setMessage({ type: "error", text: "Please select a milestone" });
      return;
    }

    setLoading("create");
    setMessage(null);

    const result = await createTask(
      newTask.milestoneId,
      newTask.title,
      newTask.description,
      newTask.assignedToId
    );

    if (result.error) {
      setMessage({ type: "error", text: result.error });
    } else if (result.success) {
      setMessage({ type: "success", text: result.success });
      setShowCreateModal(false);
      setNewTask({
        title: "",
        description: "",
        milestoneId: "",
        assignedToId: data.user.id,
      });
    }

    setLoading(null);
    setTimeout(() => setMessage(null), 3000);
  }

  async function handleDeleteTask(taskId: string) {
    setLoading(taskId);
    const result = await deleteTask(taskId);
    if (result.error) setMessage({ type: "error", text: result.error });
    else if (result.success)
      setMessage({ type: "success", text: result.success });
    setLoading(null);
    setTimeout(() => setMessage(null), 3000);
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[var(--text-primary)] font-[family-name:var(--font-heading)] tracking-tight flex items-center gap-3">
            <ListTodo className="w-6 h-6 text-[var(--cyan)]" />
            MY TASKS
          </h2>
          <p className="text-[var(--text-secondary)] mt-1 text-sm">
            Manage and submit your assigned research tasks
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Toggle my tasks / all tasks */}
          <button
            onClick={() => setShowAllTasks(!showAllTasks)}
            className="px-3 py-1.5 text-[10px] font-bold font-[family-name:var(--font-heading)] uppercase tracking-wider border transition-all btn-cyber"
            style={{
              borderRadius: "4px",
              borderColor: showAllTasks
                ? "var(--magenta)"
                : "var(--border-subtle)",
              background: showAllTasks
                ? "var(--magenta-glow)"
                : "var(--bg-card)",
              color: showAllTasks ? "var(--magenta)" : "var(--text-dim)",
            }}
          >
            {showAllTasks ? "ALL GROUP TASKS" : "MY TASKS ONLY"}
          </button>

          {/* Create Task Button */}
          {data.group && availableMilestones.length > 0 && (
            <Button
              onClick={() => setShowCreateModal(true)}
              className="text-[10px] font-bold font-[family-name:var(--font-heading)] uppercase tracking-wider btn-cyber px-4"
              style={{
                borderRadius: "4px",
                background: "var(--cyan)",
                color: "black",
                boxShadow: "0 0 10px var(--cyan-glow)",
              }}
            >
              <Plus className="w-4 h-4 mr-1" />
              NEW TASK
            </Button>
          )}
        </div>
      </div>

      {/* Message */}
      {message && (
        <div
          className="p-3 border text-sm flex items-center gap-2"
          style={{
            borderRadius: "4px",
            borderColor:
              message.type === "success" ? "var(--emerald)" : "var(--red)",
            background:
              message.type === "success"
                ? "var(--emerald-glow)"
                : "var(--red-glow)",
            color:
              message.type === "success" ? "var(--emerald)" : "var(--red)",
          }}
        >
          {message.text}
        </div>
      )}

      {/* Create Task Modal */}
      {showCreateModal && (
        <>
          <div
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm"
            onClick={() => setShowCreateModal(false)}
          />
          <div
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md border"
            style={{
              borderRadius: "4px",
              borderColor: "var(--cyan)",
              background: "var(--bg-card)",
              boxShadow: "0 0 40px var(--cyan-glow), 0 0 80px rgba(0,0,0,0.5)",
            }}
          >
            {/* Corner accents */}
            <div
              className="absolute top-0 left-0 w-5 h-5 border-t-2 border-l-2"
              style={{ borderColor: "var(--cyan)" }}
            />
            <div
              className="absolute bottom-0 right-0 w-5 h-5 border-b-2 border-r-2"
              style={{ borderColor: "var(--cyan)" }}
            />

            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-sm font-bold text-[var(--text-primary)] font-[family-name:var(--font-heading)] tracking-wide flex items-center gap-2">
                  <Plus className="w-4 h-4 text-[var(--cyan)]" />
                  CREATE NEW TASK
                </h3>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="text-[var(--text-dim)] hover:text-[var(--text-primary)] transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-[var(--text-secondary)] text-[10px] uppercase tracking-wider font-[family-name:var(--font-heading)]">
                    Task Title
                  </Label>
                  <Input
                    value={newTask.title}
                    onChange={(e) =>
                      setNewTask({ ...newTask, title: e.target.value })
                    }
                    placeholder="e.g., Write Chapter 3 introduction"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-[var(--text-secondary)] text-[10px] uppercase tracking-wider font-[family-name:var(--font-heading)]">
                    Description (optional)
                  </Label>
                  <Textarea
                    value={newTask.description}
                    onChange={(e) =>
                      setNewTask({ ...newTask, description: e.target.value })
                    }
                    placeholder="Describe what needs to be done..."
                    className="min-h-[80px] bg-[var(--bg-card)] border-[var(--border-subtle)] text-[var(--text-primary)] placeholder:text-[var(--text-dim)]"
                    style={{ borderRadius: "4px" }}
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-[var(--text-secondary)] text-[10px] uppercase tracking-wider font-[family-name:var(--font-heading)]">
                    Milestone
                  </Label>
                  <Select
                    value={newTask.milestoneId}
                    onValueChange={(v) =>
                      setNewTask({ ...newTask, milestoneId: v })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select milestone" />
                    </SelectTrigger>
                    <SelectContent className="bg-[var(--bg-card)] border-[var(--border-subtle)]">
                      {availableMilestones.map((m) => (
                        <SelectItem key={m.id} value={m.id}>
                          {m.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-[var(--text-secondary)] text-[10px] uppercase tracking-wider font-[family-name:var(--font-heading)]">
                    Assign To
                  </Label>
                  <Select
                    value={newTask.assignedToId}
                    onValueChange={(v) =>
                      setNewTask({ ...newTask, assignedToId: v })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select member" />
                    </SelectTrigger>
                    <SelectContent className="bg-[var(--bg-card)] border-[var(--border-subtle)]">
                      {data.group?.members.map((m) => (
                        <SelectItem key={m.id} value={m.id}>
                          {m.name}{" "}
                          {m.id === data.user.id ? "(You)" : ""}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex gap-3 pt-2">
                  <Button
                    onClick={() => setShowCreateModal(false)}
                    variant="outline"
                    className="flex-1 text-[10px] font-bold font-[family-name:var(--font-heading)] uppercase tracking-wider btn-cyber border-[var(--border-subtle)] text-[var(--text-dim)] hover:text-[var(--text-primary)]"
                    style={{ borderRadius: "4px" }}
                  >
                    CANCEL
                  </Button>
                  <Button
                    onClick={handleCreateTask}
                    disabled={loading === "create"}
                    className="flex-1 text-[10px] font-bold font-[family-name:var(--font-heading)] uppercase tracking-wider btn-cyber"
                    style={{
                      borderRadius: "4px",
                      background: "var(--cyan)",
                      color: "black",
                      boxShadow: "0 0 10px var(--cyan-glow)",
                    }}
                  >
                    {loading === "create" ? "CREATING..." : "CREATE TASK"}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        <Filter className="w-4 h-4 text-[var(--text-dim)] flex-shrink-0" />
        {filters.map((f) => {
          const style =
            f === "ALL"
              ? { color: "var(--text-primary)", bg: "rgba(255,255,255,0.05)" }
              : getStatusStyle(f);

          return (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                "px-3 py-1.5 text-[10px] font-bold font-[family-name:var(--font-heading)] uppercase tracking-wider border transition-all whitespace-nowrap btn-cyber flex items-center gap-1.5"
              )}
              style={{
                borderRadius: "4px",
                borderColor:
                  filter === f ? style.color : "var(--border-subtle)",
                background: filter === f ? style.bg : "var(--bg-card)",
                color: filter === f ? style.color : "var(--text-dim)",
                boxShadow:
                  filter === f ? `0 0 8px ${style.bg}` : "none",
              }}
            >
              {f === "ALL" ? "ALL" : f.replace("_", " ")}
              <span
                className="px-1.5 py-0.5 text-[9px]"
                style={{
                  borderRadius: "2px",
                  background:
                    filter === f
                      ? `color-mix(in srgb, ${style.color} 20%, transparent)`
                      : "var(--bg-elevated)",
                }}
              >
                {taskCounts[f as keyof typeof taskCounts]}
              </span>
            </button>
          );
        })}
      </div>

      {/* Task List */}
      <div className="space-y-3">
        {filteredTasks.length === 0 ? (
          <div
            className="card-cyber p-12 text-center"
            style={{ borderRadius: "4px" }}
          >
            <ListTodo className="w-8 h-8 text-[var(--text-dim)] mx-auto mb-3" />
            <p className="text-sm text-[var(--text-dim)]">
              {filter === "ALL"
                ? "No tasks yet. Create one to get started!"
                : `No ${filter.replace("_", " ").toLowerCase()} tasks`}
            </p>
          </div>
        ) : (
          filteredTasks.map((task) => {
            const style = getStatusStyle(task.status);
            const isMyTask = task.assignedTo?.id === data.user.id;

            return (
              <div
                key={task.id}
                className="card-cyber p-5"
                style={{ borderRadius: "4px" }}
              >
                <div className="flex items-start gap-4">
                  {/* Status Icon */}
                  <div
                    className="w-10 h-10 flex items-center justify-center border flex-shrink-0 mt-0.5"
                    style={{
                      borderRadius: "4px",
                      borderColor: style.color,
                      background: style.bg,
                      color: style.color,
                      boxShadow: `0 0 10px ${style.bg}`,
                    }}
                  >
                    {getStatusIcon(task.status)}
                  </div>

                  {/* Task Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <h4 className="text-sm font-bold text-[var(--text-primary)] font-[family-name:var(--font-heading)]">
                        {task.title}
                      </h4>
                      <span
                        className="text-[9px] font-bold font-[family-name:var(--font-heading)] uppercase tracking-widest px-2 py-0.5 border"
                        style={{
                          borderRadius: "2px",
                          color: style.color,
                          background: style.bg,
                          borderColor: `color-mix(in srgb, ${style.color} 30%, transparent)`,
                        }}
                      >
                        {style.label}
                      </span>
                      {!isMyTask && task.assignedTo && (
                        <span className="text-[9px] text-[var(--text-dim)] font-[family-name:var(--font-heading)]">
                          → {task.assignedTo.name}
                        </span>
                      )}
                    </div>

                    {task.description && (
                      <p className="text-xs text-[var(--text-dim)] mb-2 line-clamp-2">
                        {task.description}
                      </p>
                    )}

                    <div className="flex items-center gap-4 flex-wrap">
                      <span className="text-[10px] text-[var(--text-dim)] font-[family-name:var(--font-heading)] uppercase tracking-wider">
                        {task.milestoneName}
                      </span>

                      {task.xpReward && (
                        <span className="flex items-center gap-1 text-[10px] text-[var(--cyan)]">
                          <Zap className="w-3 h-3" />
                          {task.xpReward} XP
                        </span>
                      )}

                      {task.feedbackCount !== undefined &&
                        task.feedbackCount > 0 && (
                          <span className="flex items-center gap-1 text-[10px] text-[var(--magenta)]">
                            <MessageSquare className="w-3 h-3" />
                            {task.feedbackCount} feedback
                          </span>
                        )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {isMyTask && task.status === "TODO" && (
                      <>
                        <Button
                          onClick={() =>
                            handleStatusChange(task.id, "IN_PROGRESS")
                          }
                          disabled={loading === task.id}
                          className="text-[10px] font-bold font-[family-name:var(--font-heading)] uppercase tracking-wider btn-cyber px-4"
                          style={{
                            borderRadius: "4px",
                            background: "var(--cyan)",
                            color: "black",
                            boxShadow: "0 0 10px var(--cyan-glow)",
                          }}
                        >
                          <Play className="w-3.5 h-3.5 mr-1" />
                          {loading === task.id ? "..." : "START"}
                        </Button>
                        <button
                          onClick={() => handleDeleteTask(task.id)}
                          disabled={loading === task.id}
                          className="p-2 text-[var(--text-dim)] hover:text-[var(--red)] transition-colors"
                          title="Delete task"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </>
                    )}

                    {isMyTask &&
                      (task.status === "IN_PROGRESS" ||
                        task.status === "REVISION") && (
                        <Button
                          onClick={() =>
                            handleStatusChange(task.id, "SUBMITTED")
                          }
                          disabled={loading === task.id}
                          className="text-[10px] font-bold font-[family-name:var(--font-heading)] uppercase tracking-wider btn-cyber px-4"
                          style={{
                            borderRadius: "4px",
                            background: "var(--gold)",
                            color: "black",
                            boxShadow: "0 0 10px var(--gold-glow)",
                          }}
                        >
                          <ArrowRight className="w-3.5 h-3.5 mr-1" />
                          {loading === task.id ? "..." : "SUBMIT"}
                        </Button>
                      )}

                    {task.status === "SUBMITTED" && (
                      <span
                        className="text-[10px] font-bold font-[family-name:var(--font-heading)] uppercase tracking-wider px-3 py-1.5 border"
                        style={{
                          borderRadius: "4px",
                          color: "var(--gold)",
                          borderColor: "var(--gold)",
                          background: "var(--gold-glow)",
                        }}
                      >
                        {isMyTask ? "AWAITING REVIEW" : "SUBMITTED"}
                      </span>
                    )}

                    {task.status === "APPROVED" && (
                      <span
                        className="text-[10px] font-bold font-[family-name:var(--font-heading)] uppercase tracking-wider px-3 py-1.5 border"
                        style={{
                          borderRadius: "4px",
                          color: "var(--emerald)",
                          borderColor: "var(--emerald)",
                          background: "var(--emerald-glow)",
                        }}
                      >
                        ✓ COMPLETE
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}