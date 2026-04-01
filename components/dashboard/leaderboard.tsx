"use client";

import {
  Medal,
  Crown,
  Zap,
  Trophy,
  Star,
  TrendingUp,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface LeaderboardEntry {
  rank: number;
  id: string;
  name: string;
  xp: number;
  level: number;
  avatar: string | null;
  activeTitle: string | null;
  activeFrame: string | null;
  activeIcon: string | null;
  activeFlair: string | null;
  achievementCount: number;
}
import { PlayerAvatar } from "@/components/ui/player-avatar";

export function LeaderboardClient({
  data,
  currentUserId,
}: {
  data: LeaderboardEntry[];
  currentUserId: string;
}) {
  const top3 = data.slice(0, 3);
  const rest = data.slice(3);

  const getRankStyle = (rank: number) => {
    switch (rank) {
      case 1:
        return { color: "var(--gold)", bg: "var(--gold-glow)", border: "var(--gold)", icon: <Crown className="w-5 h-5" /> };
      case 2:
        return { color: "#c0c0c0", bg: "rgba(192,192,192,0.1)", border: "#c0c0c0", icon: <Medal className="w-5 h-5" /> };
      case 3:
        return { color: "#cd7f32", bg: "rgba(205,127,50,0.1)", border: "#cd7f32", icon: <Medal className="w-5 h-5" /> };
      default:
        return { color: "var(--text-dim)", bg: "transparent", border: "var(--border-subtle)", icon: null };
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-[var(--text-primary)] font-[family-name:var(--font-heading)] tracking-tight flex items-center gap-3">
          <Medal className="w-6 h-6 text-[var(--gold)]" />
          LEADERBOARD
        </h2>
        <p className="text-[var(--text-secondary)] mt-1 text-sm">
          See how you stack up against other researchers
        </p>
      </div>

      {/* Top 3 Podium */}
      {top3.length >= 3 && (
        <div className="grid grid-cols-3 gap-4 items-end">
          {/* 2nd Place */}
          <div className="flex flex-col items-center">
            <div
              className="card-cyber p-5 w-full text-center"
              style={{
                borderRadius: "4px",
                borderColor: getRankStyle(2).border,
                boxShadow: `0 0 15px ${getRankStyle(2).bg}`,
              }}
            >
                        <div className="mb-3 flex justify-center">
                <PlayerAvatar
                  name={top3[1].name}
                  level={top3[1].level}
                  activeFrame={top3[1].activeFrame}
                  activeIcon={top3[1].activeIcon}
                  size="md"
                  showLevel
                />
              </div>
              <Medal className="w-5 h-5 mx-auto mb-1" style={{ color: getRankStyle(2).color }} />
              <p className="text-xs font-bold text-[var(--text-primary)] font-[family-name:var(--font-heading)] truncate">
                {top3[1].name}
                {top3[1].id === currentUserId && <span className="text-[var(--cyan)] ml-1">(YOU)</span>}
              </p>
              {top3[1].activeTitle && (
                <p className="text-[9px] text-[var(--magenta)] font-[family-name:var(--font-heading)]">{top3[1].activeTitle}</p>
              )}
              <p className="text-sm font-bold font-[family-name:var(--font-heading)] mt-1" style={{ color: getRankStyle(2).color }}>
                {top3[1].xp} XP
              </p>
              <p className="text-[10px] text-[var(--text-dim)]">Level {top3[1].level}</p>
            </div>
          </div>

          {/* 1st Place */}
          <div className="flex flex-col items-center">
            <div
              className="card-cyber p-6 w-full text-center animate-border-glow"
              style={{ borderRadius: "4px" }}
            >
                            <div className="mb-3 flex justify-center">
                <PlayerAvatar
                  name={top3[0].name}
                  level={top3[0].level}
                  activeFrame={top3[0].activeFrame}
                  activeIcon={top3[0].activeIcon}
                  size="lg"
                  showLevel
                />
              </div>
              <Crown className="w-6 h-6 mx-auto mb-1 text-[var(--gold)]" />
              <p className="text-sm font-bold text-[var(--text-primary)] font-[family-name:var(--font-heading)] truncate">
                {top3[0].name}
                {top3[0].id === currentUserId && <span className="text-[var(--cyan)] ml-1">(YOU)</span>}
              </p>
             {top3[0].activeTitle && (
                <p className="text-[9px] text-[var(--magenta)] font-[family-name:var(--font-heading)]">{top3[0].activeTitle}</p>
              )}
              <p className="text-lg font-bold text-[var(--gold)] font-[family-name:var(--font-heading)] mt-1">
                {top3[0].xp} XP
              </p>
              <p className="text-[10px] text-[var(--text-dim)]">Level {top3[0].level}</p>
              <div className="flex items-center justify-center gap-1 mt-1">
                <Trophy className="w-3 h-3 text-[var(--gold)]" />
                <span className="text-[10px] text-[var(--gold)]">{top3[0].achievementCount} achievements</span>
              </div>
            </div>
          </div>

          {/* 3rd Place */}
          <div className="flex flex-col items-center">
            <div
              className="card-cyber p-5 w-full text-center"
              style={{
                borderRadius: "4px",
                borderColor: getRankStyle(3).border,
                boxShadow: `0 0 15px ${getRankStyle(3).bg}`,
              }}
            >
                           <div className="mb-3 flex justify-center">
                <PlayerAvatar
                  name={top3[2].name}
                  level={top3[2].level}
                  activeFrame={top3[2].activeFrame}
                  activeIcon={top3[2].activeIcon}
                  size="md"
                  showLevel
                />
              </div>
              <Medal className="w-5 h-5 mx-auto mb-1" style={{ color: getRankStyle(3).color }} />
              <p className="text-xs font-bold text-[var(--text-primary)] font-[family-name:var(--font-heading)] truncate">
                {top3[2].name}
                {top3[2].id === currentUserId && <span className="text-[var(--cyan)] ml-1">(YOU)</span>}
              </p>
            {top3[2].activeTitle && (
                <p className="text-[9px] text-[var(--magenta)] font-[family-name:var(--font-heading)]">{top3[2].activeTitle}</p>
              )}
              <p className="text-sm font-bold font-[family-name:var(--font-heading)] mt-1" style={{ color: getRankStyle(3).color }}>
                {top3[2].xp} XP
              </p>
              <p className="text-[10px] text-[var(--text-dim)]">Level {top3[2].level}</p>
            </div>
          </div>
        </div>
      )}

      {/* Rest of Leaderboard */}
      <div className="space-y-2">
        {rest.map((entry) => {
          const isCurrentUser = entry.id === currentUserId;

          return (
            <div
          key={entry.id}
          className={cn("card-cyber p-4 flex items-center gap-4", isCurrentUser && "ring-1 ring-[var(--cyan)]")}
          style={{
            borderRadius: "4px",
            borderColor: isCurrentUser ? "var(--cyan)" : undefined,
            boxShadow: isCurrentUser ? "0 0 15px var(--cyan-glow)" : undefined,
          }}
        >
              {/* Rank */}
              <div
                className="w-10 h-10 flex items-center justify-center border flex-shrink-0"
                style={{
                  borderRadius: "4px",
                  borderColor: "var(--border-subtle)",
                  background: "var(--bg-elevated)",
                }}
              >
                <span className="text-sm font-bold text-[var(--text-secondary)] font-[family-name:var(--font-heading)]">
                  {entry.rank}
                </span>
              </div>

              {/* Avatar */}
              <div
                className="w-10 h-10 flex items-center justify-center border text-xs font-bold font-[family-name:var(--font-heading)] flex-shrink-0"
                style={{
                  borderRadius: "4px",
                  borderColor: isCurrentUser ? "var(--cyan)" : "var(--border-subtle)",
                  background: isCurrentUser ? "var(--cyan-glow)" : "var(--bg-elevated)",
                  color: isCurrentUser ? "var(--cyan)" : "var(--text-secondary)",
                }}
              >
                {entry.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-[var(--text-primary)] font-[family-name:var(--font-heading)] truncate">
                  {entry.name}
                  {isCurrentUser && <span className="text-[var(--cyan)] ml-1">(YOU)</span>}
                </p>
                {entry.activeTitle && (
                  <p className="text-[9px] text-[var(--magenta)] font-[family-name:var(--font-heading)]">{entry.activeTitle}</p>
                )}
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1 text-[10px] text-[var(--text-dim)]">
                    <Zap className="w-3 h-3 text-[var(--gold)]" />
                    Level {entry.level}
                  </span>
                  <span className="flex items-center gap-1 text-[10px] text-[var(--text-dim)]">
                    <Star className="w-3 h-3" />
                    {entry.achievementCount} badges
                  </span>
                </div>
              </div>

              {/* XP */}
              <div className="text-right flex-shrink-0">
                <p className="text-sm font-bold text-[var(--cyan)] font-[family-name:var(--font-heading)]">
                  {entry.xp} XP
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}