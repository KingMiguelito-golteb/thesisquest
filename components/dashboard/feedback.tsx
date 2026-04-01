"use client";

import {
  MessageSquare,
  CheckCircle2,
  RotateCcw,
  MessageCircle,
  Shield,
} from "lucide-react";

interface DashboardData {
  recentFeedback: {
    id: string;
    content: string;
    type: string;
    createdAt: Date;
    teacherName: string;
    taskTitle: string;
  }[];
}

export function FeedbackClient({ data }: { data: DashboardData }) {
  const feedback = data.recentFeedback;

  const getTypeStyle = (type: string) => {
    switch (type) {
      case "APPROVAL":
        return { color: "var(--emerald)", bg: "var(--emerald-glow)", label: "APPROVED", icon: <CheckCircle2 className="w-4 h-4" /> };
      case "REVISION_REQUEST":
        return { color: "var(--magenta)", bg: "var(--magenta-glow)", label: "REVISION", icon: <RotateCcw className="w-4 h-4" /> };
      default:
        return { color: "var(--cyan)", bg: "var(--cyan-glow)", label: "COMMENT", icon: <MessageCircle className="w-4 h-4" /> };
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-[var(--text-primary)] font-[family-name:var(--font-heading)] tracking-tight flex items-center gap-3">
          <MessageSquare className="w-6 h-6 text-[var(--magenta)]" />
          TEACHER FEEDBACK
        </h2>
        <p className="text-[var(--text-secondary)] mt-1 text-sm">
          Review feedback from your adviser on submitted tasks
        </p>
      </div>

      {/* Feedback List */}
      {feedback.length === 0 ? (
        <div className="card-cyber p-12 text-center" style={{ borderRadius: "4px" }}>
          <MessageSquare className="w-8 h-8 text-[var(--text-dim)] mx-auto mb-3" />
          <p className="text-sm text-[var(--text-dim)] font-[family-name:var(--font-heading)]">
            NO FEEDBACK YET
          </p>
          <p className="text-xs text-[var(--text-dim)] mt-1">
            Submit your tasks to receive feedback from your adviser
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {feedback.map((fb) => {
            const typeStyle = getTypeStyle(fb.type);

            return (
              <div
                key={fb.id}
                className="card-cyber p-5"
                style={{ borderRadius: "4px" }}
              >
                <div className="flex items-start gap-4">
                  {/* Type Icon */}
                  <div
                    className="w-10 h-10 flex items-center justify-center border flex-shrink-0"
                    style={{
                      borderRadius: "4px",
                      borderColor: typeStyle.color,
                      background: typeStyle.bg,
                      color: typeStyle.color,
                      boxShadow: `0 0 10px ${typeStyle.bg}`,
                    }}
                  >
                    {typeStyle.icon}
                  </div>

                  <div className="flex-1 min-w-0">
                    {/* Header */}
                    <div className="flex items-center gap-2 flex-wrap mb-2">
                      <span
                        className="text-[9px] font-bold font-[family-name:var(--font-heading)] uppercase tracking-widest px-2 py-0.5 border"
                        style={{
                          borderRadius: "2px",
                          color: typeStyle.color,
                          background: typeStyle.bg,
                          borderColor: `color-mix(in srgb, ${typeStyle.color} 30%, transparent)`,
                        }}
                      >
                        {typeStyle.label}
                      </span>
                      <span className="flex items-center gap-1 text-[10px] text-[var(--text-dim)]">
                        <Shield className="w-3 h-3 text-[var(--magenta)]" />
                        {fb.teacherName}
                      </span>
                      <span className="text-[10px] text-[var(--text-dim)]">•</span>
                      <span className="text-[10px] text-[var(--text-dim)]">
                        {new Date(fb.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                          hour: "numeric",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>

                    {/* Task */}
                    <p className="text-[10px] text-[var(--text-dim)] font-[family-name:var(--font-heading)] uppercase tracking-wider mb-2">
                      Task: &quot;{fb.taskTitle}&quot;
                    </p>

                    {/* Content */}
                    <div
                      className="p-3 bg-[var(--bg-elevated)] border border-[var(--border-dim)]"
                      style={{ borderRadius: "4px" }}
                    >
                      <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                        {fb.content}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}