"use client";

import { useState } from "react";
import {
  ListTodo,
  CheckCircle2,
  RotateCcw,
  Send,
  MessageSquare,
  Zap,
  Coins,
  ChevronDown,
  ChevronUp,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { reviewTask } from "@/app/actions/teacher";
import { cn } from "@/lib/utils";

interface ReviewTask {
  id: string;
  title: string;
  description: string | null;
  status: string;
  xpReward: number;
  coinReward: number;
  updatedAt: Date;
  assignedTo: { id: string; name: string; level: number } | null;
  groupName: string;
  groupSection: string;
  milestoneName: string;
  feedback: {
    id: string;
    content: string;
    type: string;
    createdAt: Date;
    teacherName: string;
  }[];
}

export function ReviewTasksClient({ tasks }: { tasks: ReviewTask[] }) {
  const [expandedTask, setExpandedTask] = useState<string | null>(null);
  const [feedbackText, setFeedbackText] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  async function handleReview(taskId: string, action: "APPROVE" | "REQUEST_REVISION") {
    const content = feedbackText[taskId] || "";

    if (action === "REQUEST_REVISION" && !content.trim()) {
      setMessage({ type: "error", text: "Please provide feedback when requesting revisions." });
      setTimeout(() => setMessage(null), 3000);
      return;
    }

    setLoading(taskId);
    setMessage(null);

    const result = await reviewTask(taskId, action, content);

    if (result.error) {
      setMessage({ type: "error", text: result.error });
    } else if (result.success) {
      setMessage({ type: "success", text: result.success });
      setFeedbackText((prev) => ({ ...prev, [taskId]: "" }));
      setExpandedTask(null);
    }

    setLoading(null);
    setTimeout(() => setMessage(null), 4000);
  }

  const submittedTasks = tasks.filter((t) => t.status === "SUBMITTED");
  const revisionTasks = tasks.filter((t) => t.status === "REVISION");

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-[var(--text-primary)] font-[family-name:var(--font-heading)] tracking-tight flex items-center gap-3">
          <ListTodo className="w-6 h-6 text-[var(--gold)]" />
          REVIEW TASKS
        </h2>
        <p className="text-[var(--text-secondary)] mt-1 text-sm">
          Approve or request revisions on student submissions
        </p>
      </div>

      {/* Message */}
      {message && (
        <div className="p-3 border text-sm flex items-center gap-2" style={{ borderRadius: "4px", borderColor: message.type === "success" ? "var(--emerald)" : "var(--red)", background: message.type === "success" ? "var(--emerald-glow)" : "var(--red-glow)", color: message.type === "success" ? "var(--emerald)" : "var(--red)" }}>
          {message.text}
        </div>
      )}

      {/* Submitted Tasks */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold text-[var(--gold)] font-[family-name:var(--font-heading)] uppercase tracking-widest flex items-center gap-2">
          <Send className="w-4 h-4" />
          AWAITING REVIEW ({submittedTasks.length})
        </h3>

        {submittedTasks.length === 0 ? (
          <div className="card-cyber p-12 text-center" style={{ borderRadius: "4px" }}>
            <CheckCircle2 className="w-8 h-8 text-[var(--emerald)] mx-auto mb-3" />
            <p className="text-sm text-[var(--text-dim)] font-[family-name:var(--font-heading)]">ALL CAUGHT UP!</p>
            <p className="text-xs text-[var(--text-dim)] mt-1">No tasks awaiting review</p>
          </div>
        ) : (
          submittedTasks.map((task) => {
            const isExpanded = expandedTask === task.id;

            return (
              <div key={task.id} className="card-cyber overflow-hidden" style={{ borderRadius: "4px" }}>
                {/* Task Header */}
                <button onClick={() => setExpandedTask(isExpanded ? null : task.id)} className="w-full p-5 flex items-start justify-between gap-4 text-left hover:bg-[var(--bg-hover)] transition-colors">
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <div className="w-10 h-10 flex items-center justify-center border flex-shrink-0" style={{ borderRadius: "4px", borderColor: "var(--gold)", background: "var(--gold-glow)", color: "var(--gold)" }}>
                      <Send className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-bold text-[var(--text-primary)] font-[family-name:var(--font-heading)]">{task.title}</h4>
                      <div className="flex items-center gap-2 flex-wrap mt-1">
                        <span className="flex items-center gap-1 text-[10px] text-[var(--text-dim)]">
                          <User className="w-3 h-3" />
                          {task.assignedTo?.name || "Unassigned"}
                        </span>
                        <span className="text-[var(--text-dim)]">•</span>
                        <span className="text-[10px] text-[var(--text-dim)]">{task.groupName} ({task.groupSection})</span>
                        <span className="text-[var(--text-dim)]">•</span>
                        <span className="text-[10px] text-[var(--text-dim)]">{task.milestoneName}</span>
                      </div>
                      <div className="flex items-center gap-3 mt-2">
                        <span className="flex items-center gap-1 text-[10px] text-[var(--cyan)]">
                          <Zap className="w-3 h-3" />{task.xpReward} XP
                        </span>
                        <span className="flex items-center gap-1 text-[10px] text-[var(--gold)]">
                          <Coins className="w-3 h-3" />{task.coinReward} QC
                        </span>
                        {task.feedback.length > 0 && (
                          <span className="flex items-center gap-1 text-[10px] text-[var(--magenta)]">
                            <MessageSquare className="w-3 h-3" />{task.feedback.length} previous
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="text-[var(--text-dim)] flex-shrink-0">{isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}</div>
                </button>

                {/* Expanded Review Panel */}
                {isExpanded && (
                  <div className="border-t border-[var(--border-dim)] p-5 space-y-4">
                    {task.description && (
                      <div>
                        <p className="text-[10px] text-[var(--text-dim)] font-[family-name:var(--font-heading)] uppercase tracking-widest mb-1">TASK DESCRIPTION</p>
                        <p className="text-xs text-[var(--text-secondary)] p-3 bg-[var(--bg-elevated)] border border-[var(--border-dim)]" style={{ borderRadius: "4px" }}>{task.description}</p>
                      </div>
                    )}

                    {/* Previous Feedback */}
                    {task.feedback.length > 0 && (
                      <div>
                        <p className="text-[10px] text-[var(--text-dim)] font-[family-name:var(--font-heading)] uppercase tracking-widest mb-2">PREVIOUS FEEDBACK</p>
                        <div className="space-y-2">
                          {task.feedback.map((fb) => (
                            <div key={fb.id} className="p-3 bg-[var(--bg-elevated)] border border-[var(--border-dim)]" style={{ borderRadius: "4px" }}>
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-[9px] font-bold font-[family-name:var(--font-heading)] uppercase tracking-widest px-1.5 py-0.5 border" style={{ borderRadius: "2px", color: fb.type === "APPROVAL" ? "var(--emerald)" : "var(--magenta)", background: fb.type === "APPROVAL" ? "var(--emerald-glow)" : "var(--magenta-glow)", borderColor: fb.type === "APPROVAL" ? "rgba(0,255,136,0.2)" : "rgba(255,0,229,0.2)" }}>
                                  {fb.type === "APPROVAL" ? "APPROVED" : "REVISION"}
                                </span>
                                <span className="text-[10px] text-[var(--text-dim)]">{fb.teacherName}</span>
                                <span className="text-[10px] text-[var(--text-dim)]">{new Date(fb.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>
                              </div>
                              <p className="text-xs text-[var(--text-secondary)]">{fb.content}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Feedback Input */}
                    <div>
                      <p className="text-[10px] text-[var(--text-dim)] font-[family-name:var(--font-heading)] uppercase tracking-widest mb-2">YOUR FEEDBACK</p>
                      <Textarea
                        placeholder="Write your feedback here... (required for revisions, optional for approval)"
                        value={feedbackText[task.id] || ""}
                        onChange={(e) => setFeedbackText((prev) => ({ ...prev, [task.id]: e.target.value }))}
                        className="bg-[var(--bg-card)] border-[var(--border-subtle)] text-[var(--text-primary)] placeholder:text-[var(--text-dim)] min-h-[100px] text-sm"
                        style={{ borderRadius: "4px" }}
                      />
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-3">
                      <Button
                        onClick={() => handleReview(task.id, "APPROVE")}
                        disabled={loading === task.id}
                        className="flex-1 text-[10px] font-bold font-[family-name:var(--font-heading)] uppercase tracking-wider btn-cyber py-5"
                        style={{ borderRadius: "4px", background: "var(--emerald)", color: "black", boxShadow: "0 0 15px var(--emerald-glow)" }}
                      >
                        <CheckCircle2 className="w-4 h-4 mr-2" />
                        {loading === task.id ? "PROCESSING..." : "APPROVE TASK"}
                      </Button>
                      <Button
                        onClick={() => handleReview(task.id, "REQUEST_REVISION")}
                        disabled={loading === task.id}
                        className="flex-1 text-[10px] font-bold font-[family-name:var(--font-heading)] uppercase tracking-wider btn-cyber py-5"
                        style={{ borderRadius: "4px", background: "var(--magenta)", color: "white", boxShadow: "0 0 15px var(--magenta-glow)" }}
                      >
                        <RotateCcw className="w-4 h-4 mr-2" />
                        {loading === task.id ? "PROCESSING..." : "REQUEST REVISION"}
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Tasks in Revision */}
      {revisionTasks.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-[var(--magenta)] font-[family-name:var(--font-heading)] uppercase tracking-widest flex items-center gap-2">
            <RotateCcw className="w-4 h-4" />
            IN REVISION ({revisionTasks.length})
          </h3>
          {revisionTasks.map((task) => (
            <div key={task.id} className="card-cyber p-4" style={{ borderRadius: "4px" }}>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 flex items-center justify-center border flex-shrink-0" style={{ borderRadius: "4px", borderColor: "var(--magenta)", background: "var(--magenta-glow)", color: "var(--magenta)" }}>
                  <RotateCcw className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-[var(--text-primary)] font-[family-name:var(--font-heading)] truncate">{task.title}</p>
                  <p className="text-[10px] text-[var(--text-dim)]">{task.assignedTo?.name} • {task.groupName} • Awaiting student resubmission</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}