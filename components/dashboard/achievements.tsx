"use client";

import {
  Trophy,
  Star,
  Lock,
  Coins,
  CheckCircle2,
} from "lucide-react";

interface AchievementData {
  unlocked: {
    id: string;
    title: string;
    description: string;
    icon: string;
    xpRequired: number;
    coinReward: number;
    condition: string;
    unlockedAt: Date;
  }[];
  locked: {
    id: string;
    title: string;
    description: string;
    icon: string;
    xpRequired: number;
    coinReward: number;
    condition: string;
  }[];
}

export function AchievementsClient({ data }: { data: AchievementData }) {
  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-[var(--text-primary)] font-[family-name:var(--font-heading)] tracking-tight flex items-center gap-3">
            <Trophy className="w-6 h-6 text-[var(--gold)]" />
            ACHIEVEMENTS
          </h2>
          <p className="text-[var(--text-secondary)] mt-1 text-sm">
            Complete tasks and milestones to unlock achievements and earn Quest Coins
          </p>
        </div>
        <div
          className="flex items-center gap-2 px-4 py-2 border-2"
          style={{
            borderRadius: "4px",
            borderColor: "var(--gold)",
            background: "var(--gold-glow)",
            boxShadow: "0 0 15px var(--gold-glow)",
          }}
        >
          <Trophy className="w-5 h-5 text-[var(--gold)]" />
          <span className="text-lg font-bold text-[var(--gold)] font-[family-name:var(--font-heading)]">
            {data.unlocked.length}
          </span>
          <span className="text-[10px] text-[var(--text-secondary)] font-[family-name:var(--font-heading)] uppercase tracking-wider">
            / {data.unlocked.length + data.locked.length}
          </span>
        </div>
      </div>

      {/* Unlocked */}
      {data.unlocked.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-[var(--emerald)] font-[family-name:var(--font-heading)] uppercase tracking-widest flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            UNLOCKED ({data.unlocked.length})
          </h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {data.unlocked.map((a) => (
              <div
                key={a.id}
                className="card-cyber p-5 group"
                style={{ borderRadius: "4px" }}
              >
                <div className="flex items-start gap-4">
                  <div
                    className="w-12 h-12 flex items-center justify-center border badge-shine flex-shrink-0"
                    style={{
                      borderRadius: "4px",
                      borderColor: "var(--gold)",
                      background: "var(--gold-glow)",
                      boxShadow: "0 0 15px var(--gold-glow)",
                    }}
                  >
                    <Star className="w-6 h-6 text-[var(--gold)]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-bold text-[var(--text-primary)] font-[family-name:var(--font-heading)]">
                      {a.title}
                    </h4>
                    <p className="text-[10px] text-[var(--text-dim)] mt-0.5">
                      {a.description}
                    </p>
                    <div className="flex items-center gap-3 mt-2">
                      <span className="flex items-center gap-1 text-[10px] text-[var(--gold)]">
                        <Coins className="w-3 h-3" />
                        +{a.coinReward} QC
                      </span>
                      <span className="text-[10px] text-[var(--text-dim)]">
                        {new Date(a.unlockedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Locked */}
      {data.locked.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-[var(--text-dim)] font-[family-name:var(--font-heading)] uppercase tracking-widest flex items-center gap-2">
            <Lock className="w-4 h-4" />
            LOCKED ({data.locked.length})
          </h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {data.locked.map((a) => (
              <div
                key={a.id}
                className="p-5 bg-[var(--bg-card)]/50 border border-[var(--border-dim)] opacity-60"
                style={{ borderRadius: "4px" }}
              >
                <div className="flex items-start gap-4">
                  <div
                    className="w-12 h-12 flex items-center justify-center border flex-shrink-0"
                    style={{
                      borderRadius: "4px",
                      borderColor: "var(--border-subtle)",
                      background: "var(--bg-elevated)",
                    }}
                  >
                    <Lock className="w-5 h-5 text-[var(--text-dim)]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-bold text-[var(--text-secondary)] font-[family-name:var(--font-heading)]">
                      {a.title}
                    </h4>
                    <p className="text-[10px] text-[var(--text-dim)] mt-0.5">
                      {a.description}
                    </p>
                    <span className="flex items-center gap-1 text-[10px] text-[var(--text-dim)] mt-2">
                      <Coins className="w-3 h-3" />
                      +{a.coinReward} QC on unlock
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}