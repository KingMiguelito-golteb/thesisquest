"use client";

import { MessageSquare, CheckCircle2, RotateCcw, MessageCircle, User } from "lucide-react";

interface FeedbackEntry {
  id: string;
  content: string;
  type: string;
  createdAt: Date;
  taskTitle: string;
  studentName: string;
  groupName: string;
  groupSection: string;
  milestoneName: string;
}

export function TeacherFeedbackClient({ feedback }: { feedback: FeedbackEntry[] }) {
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h2 className="text-2xl font-bold text-[var(--text-primary)] font-[family-name:var(--font-heading)] tracking-tight flex items-center gap-3">
          <MessageSquare className="w-6 h-6 text-[var(--magenta)]" />
          FEEDBACK HISTORY
        </h2>
        <p className="text-[var(--text-secondary)] mt-1 text-sm">
          All feedback you&apos;ve given to students
        </p>
      </div>

      {feedback.length === 0 ? (
        <div className="card-cyber p-12 text-center" style={{ borderRadius: "4px" }}>
          <MessageSquare className="w-8 h-8 text-[var(--text-dim)] mx-auto mb-3" />
          <p className="text-sm text-[var(--text-dim)] font-[family-name:var(--font-heading)]">NO FEEDBACK GIVEN YET</p>
        </div>
      ) : (
        <div className="space-y-3">
          {feedback.map((fb) => {
            const isApproval = fb.type === "APPROVAL";
            const color = isApproval ? "var(--emerald)" : fb.type === "REVISION_REQUEST" ? "var(--magenta)" : "var(--cyan)";
            const bg = isApproval ? "var(--emerald-glow)" : fb.type === "REVISION_REQUEST" ? "var(--magenta-glow)" : "var(--cyan-glow)";

            return (
              <div key={fb.id} className="card-cyber p-5" style={{ borderRadius: "4px" }}>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 flex items-center justify-center border flex-shrink-0" style={{ borderRadius: "4px", borderColor: color, background: bg, color }}>
                    {isApproval ? <CheckCircle2 className="w-4 h-4" /> : fb.type === "REVISION_REQUEST" ? <RotateCcw className="w-4 h-4" /> : <MessageCircle className="w-4 h-4" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-2">
                      <span className="text-[9px] font-bold font-[family-name:var(--font-heading)] uppercase tracking-widest px-2 py-0.5 border" style={{ borderRadius: "2px", color, background: bg, borderColor: `color-mix(in srgb, ${color} 30%, transparent)` }}>
                        {isApproval ? "APPROVED" : fb.type === "REVISION_REQUEST" ? "REVISION" : "COMMENT"}
                      </span>
                      <span className="flex items-center gap-1 text-[10px] text-[var(--text-dim)]"><User className="w-3 h-3" />{fb.studentName}</span>
                      <span className="text-[var(--text-dim)]">•</span>
                      <span className="text-[10px] text-[var(--text-dim)]">{fb.groupName} ({fb.groupSection})</span>
                      <span className="text-[var(--text-dim)]">•</span>
                      <span className="text-[10px] text-[var(--text-dim)]">
                        {new Date(fb.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                      </span>
                    </div>
                    <p className="text-[10px] text-[var(--text-dim)] font-[family-name:var(--font-heading)] uppercase tracking-wider mb-2">
                      {fb.milestoneName} → &quot;{fb.taskTitle}&quot;
                    </p>
                    <div className="p-3 bg-[var(--bg-elevated)] border border-[var(--border-dim)]" style={{ borderRadius: "4px" }}>
                      <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{fb.content}</p>
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