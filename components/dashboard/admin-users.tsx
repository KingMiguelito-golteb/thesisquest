"use client";

import { useState } from "react";
import { Users, Shield, GraduationCap, Crown, Zap, Coins, Trophy, Filter } from "lucide-react";
import { cn } from "@/lib/utils";

interface UserData {
  id: string;
  name: string;
  email: string;
  role: string;
  xp: number;
  level: number;
  coins: number;
  activeTitle: string | null;
  createdAt: Date;
  _count: {
    achievements: number;
    purchases: number;
    assignedTasks: number;
    teacherGroups: number;
    feedbackGiven: number;
  };
}

export function AdminUsersClient({ users }: { users: UserData[] }) {
  const [filter, setFilter] = useState<string>("ALL");

  const filters = ["ALL", "STUDENT", "TEACHER", "ADMIN"];
  const filtered = filter === "ALL" ? users : users.filter((u) => u.role === filter);

  const getRoleStyle = (role: string) => {
    switch (role) {
      case "ADMIN": return { color: "var(--gold)", bg: "var(--gold-glow)", icon: <Crown className="w-3.5 h-3.5" /> };
      case "TEACHER": return { color: "var(--magenta)", bg: "var(--magenta-glow)", icon: <Shield className="w-3.5 h-3.5" /> };
      default: return { color: "var(--cyan)", bg: "var(--cyan-glow)", icon: <GraduationCap className="w-3.5 h-3.5" /> };
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h2 className="text-2xl font-bold text-[var(--text-primary)] font-[family-name:var(--font-heading)] tracking-tight flex items-center gap-3">
          <Users className="w-6 h-6 text-[var(--cyan)]" />
          USER MANAGEMENT
        </h2>
        <p className="text-[var(--text-secondary)] mt-1 text-sm">
          {users.length} total users registered
        </p>
      </div>

      {/* Filter */}
      <div className="flex items-center gap-2">
        <Filter className="w-4 h-4 text-[var(--text-dim)]" />
        {filters.map((f) => {
          const count = f === "ALL" ? users.length : users.filter((u) => u.role === f).length;
          return (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className="px-3 py-1.5 text-[10px] font-bold font-[family-name:var(--font-heading)] uppercase tracking-wider border transition-all btn-cyber flex items-center gap-1.5"
              style={{
                borderRadius: "4px",
                borderColor: filter === f ? "var(--cyan)" : "var(--border-subtle)",
                background: filter === f ? "var(--cyan-glow)" : "var(--bg-card)",
                color: filter === f ? "var(--cyan)" : "var(--text-dim)",
              }}
            >
              {f} <span className="opacity-60">{count}</span>
            </button>
          );
        })}
      </div>

      {/* User List */}
      <div className="space-y-2">
        {filtered.map((user) => {
          const roleStyle = getRoleStyle(user.role);

          return (
            <div key={user.id} className="card-cyber p-4 flex items-center gap-4" style={{ borderRadius: "4px" }}>
              <div className="w-10 h-10 border flex items-center justify-center text-xs font-bold font-[family-name:var(--font-heading)] flex-shrink-0" style={{ borderRadius: "4px", borderColor: roleStyle.color, background: roleStyle.bg, color: roleStyle.color }}>
                {user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="text-sm font-bold text-[var(--text-primary)] font-[family-name:var(--font-heading)]">{user.name}</p>
                  <span className="text-[9px] font-bold font-[family-name:var(--font-heading)] uppercase tracking-widest px-1.5 py-0.5 border" style={{ borderRadius: "2px", color: roleStyle.color, background: roleStyle.bg, borderColor: `color-mix(in srgb, ${roleStyle.color} 30%, transparent)` }}>
                    {user.role}
                  </span>
                  {user.activeTitle && (
                    <span className="text-[9px] text-[var(--magenta)] font-[family-name:var(--font-heading)]">{user.activeTitle}</span>
                  )}
                </div>
                <p className="text-[10px] text-[var(--text-dim)] mt-0.5">{user.email}</p>
              </div>

              {user.role === "STUDENT" && (
                <div className="flex items-center gap-4 flex-shrink-0">
                  <div className="text-center">
                    <div className="flex items-center gap-1">
                      <Zap className="w-3 h-3 text-[var(--cyan)]" />
                      <span className="text-xs font-bold text-[var(--cyan)] font-[family-name:var(--font-heading)]">{user.xp}</span>
                    </div>
                    <p className="text-[9px] text-[var(--text-dim)]">XP</p>
                  </div>
                  <div className="text-center">
                    <span className="text-xs font-bold text-[var(--gold)] font-[family-name:var(--font-heading)]">L{user.level}</span>
                    <p className="text-[9px] text-[var(--text-dim)]">Level</p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center gap-1">
                      <Coins className="w-3 h-3 text-[var(--gold)]" />
                      <span className="text-xs font-bold text-[var(--gold)] font-[family-name:var(--font-heading)]">{user.coins}</span>
                    </div>
                    <p className="text-[9px] text-[var(--text-dim)]">QC</p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center gap-1">
                      <Trophy className="w-3 h-3 text-[var(--gold)]" />
                      <span className="text-xs font-bold text-[var(--text-secondary)] font-[family-name:var(--font-heading)]">{user._count.achievements}</span>
                    </div>
                    <p className="text-[9px] text-[var(--text-dim)]">Badges</p>
                  </div>
                </div>
              )}

              {user.role === "TEACHER" && (
                <div className="flex items-center gap-4 flex-shrink-0">
                  <div className="text-center">
                    <span className="text-xs font-bold text-[var(--magenta)] font-[family-name:var(--font-heading)]">{user._count.teacherGroups}</span>
                    <p className="text-[9px] text-[var(--text-dim)]">Groups</p>
                  </div>
                  <div className="text-center">
                    <span className="text-xs font-bold text-[var(--text-secondary)] font-[family-name:var(--font-heading)]">{user._count.feedbackGiven}</span>
                    <p className="text-[9px] text-[var(--text-dim)]">Feedback</p>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}