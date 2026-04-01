"use client";

import {
  UserCircle,
  Zap,
  Coins,
  Trophy,
  Target,
  CheckCircle2,
  Calendar,
  Flame,
  ShoppingBag,
  BookOpen,
  Shield,
  Mail,
  Clock,
  TrendingUp,
  Star,
} from "lucide-react";
import { PlayerAvatar } from "@/components/ui/player-avatar";

interface ProfileData {
  id: string;
  name: string;
  email: string;
  role: string;
  xp: number;
  level: number;
  coins: number;
  activeTitle: string | null;
  activeFrame: string | null;
  activeIcon: string | null;
  activeFlair: string | null;
  loginStreak: number;
  createdAt: Date;
  totalTasks: number;
  completedTasks: number;
  taskCompletionRate: number;
  achievementCount: number;
  purchaseCount: number;
  unreadNotifications: number;
  groupName: string | null;
  groupSection: string | null;
  groupSubject: string | null;
  adviserName: string | null;
  groupProgress: number;
  recentAchievements: {
    title: string;
    description: string;
    unlockedAt: Date;
  }[];
  ownedItems: {
    name: string;
    category: string;
    rarity: string;
  }[];
}

export function ProfileClient({ data }: { data: ProfileData }) {
  const xpForNextLevel = data.level * 100;
  const xpProgress = Math.min((data.xp / xpForNextLevel) * 100, 100);

  const memberSince = new Date(data.createdAt).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-[var(--text-primary)] font-[family-name:var(--font-heading)] tracking-tight flex items-center gap-3">
          <UserCircle className="w-6 h-6 text-[var(--cyan)]" />
          PROFILE
        </h2>
        <p className="text-[var(--text-secondary)] mt-1 text-sm">
          Your researcher identity and stats
        </p>
      </div>

      {/* Profile Card */}
      <div className="card-cyber-accent p-8" style={{ borderRadius: "4px" }}>
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-8">
          {/* Avatar */}
          <PlayerAvatar
            name={data.name}
            level={data.level}
            activeFrame={data.activeFrame}
            activeIcon={data.activeIcon}
            activeTitle={data.activeTitle}
            size="xl"
            showTitle
            showLevel
          />

          {/* Info */}
          <div className="flex-1 text-center sm:text-left">
            <h3 className="text-2xl font-bold text-[var(--text-primary)] font-[family-name:var(--font-heading)] tracking-tight">
              {data.name}
            </h3>
            {data.activeTitle && (
              <p className="text-sm text-[var(--magenta)] font-[family-name:var(--font-heading)] mt-0.5">
                {data.activeTitle}
              </p>
            )}
            <div className="flex items-center justify-center sm:justify-start gap-4 mt-3 flex-wrap">
              <span className="flex items-center gap-1.5 text-xs text-[var(--text-dim)]">
                <Mail className="w-3.5 h-3.5" />
                {data.email}
              </span>
              <span className="flex items-center gap-1.5 text-xs text-[var(--text-dim)]">
                <Calendar className="w-3.5 h-3.5" />
                Member since {memberSince}
              </span>
            </div>

            {/* XP Bar */}
            <div className="mt-5 max-w-md">
              <div className="flex items-center justify-between text-xs mb-1.5 font-[family-name:var(--font-heading)]">
                <span className="text-[var(--text-dim)] uppercase tracking-wider text-[10px]">
                  Level {data.level} → Level {data.level + 1}
                </span>
                <span className="text-[var(--cyan)] font-bold">
                  {data.xp} / {xpForNextLevel} XP
                </span>
              </div>
              <div className="w-full h-3 bg-[var(--bg-card)] overflow-hidden" style={{ borderRadius: "2px" }}>
                <div className="h-full xp-bar-fill neon-progress" style={{ width: `${xpProgress}%`, borderRadius: "2px" }} />
              </div>
              <p className="text-[10px] text-[var(--text-dim)] mt-1">
                {xpForNextLevel - data.xp} XP until next level
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {[
          { label: "LEVEL", value: data.level, icon: Zap, color: "var(--gold)" },
          { label: "TOTAL XP", value: data.xp, icon: TrendingUp, color: "var(--cyan)" },
          { label: "QUEST COINS", value: data.coins, icon: Coins, color: "var(--gold)" },
          { label: "ACHIEVEMENTS", value: data.achievementCount, icon: Trophy, color: "var(--gold)" },
          { label: "TASKS DONE", value: `${data.completedTasks}/${data.totalTasks}`, icon: CheckCircle2, color: "var(--emerald)" },
          { label: "LOGIN STREAK", value: `${data.loginStreak}d`, icon: Flame, color: data.loginStreak >= 7 ? "var(--magenta)" : "var(--gold)" },
        ].map((stat, i) => (
          <div key={i} className="card-cyber p-4 text-center" style={{ borderRadius: "4px" }}>
            <stat.icon className="w-5 h-5 mx-auto mb-2" style={{ color: stat.color }} />
            <p className="text-lg font-bold font-[family-name:var(--font-heading)]" style={{ color: stat.color }}>{stat.value}</p>
            <p className="text-[9px] text-[var(--text-dim)] uppercase tracking-widest font-[family-name:var(--font-heading)] mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Group Info */}
        {data.groupName && (
          <div className="card-cyber p-6" style={{ borderRadius: "4px" }}>
            <h3 className="text-xs font-bold text-[var(--text-primary)] font-[family-name:var(--font-heading)] tracking-wide flex items-center gap-2 mb-4">
              <BookOpen className="w-4 h-4 text-[var(--cyan)]" />
              RESEARCH GROUP
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-[var(--text-dim)] font-[family-name:var(--font-heading)] uppercase tracking-widest">Group</span>
                <span className="text-sm text-[var(--text-primary)] font-medium">{data.groupName}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-[var(--text-dim)] font-[family-name:var(--font-heading)] uppercase tracking-widest">Section</span>
                <span className="text-sm text-[var(--text-primary)]">{data.groupSection}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-[var(--text-dim)] font-[family-name:var(--font-heading)] uppercase tracking-widest">Subject</span>
                <span className="text-sm text-[var(--text-primary)]">{data.groupSubject}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-[var(--text-dim)] font-[family-name:var(--font-heading)] uppercase tracking-widest">Adviser</span>
                <span className="text-sm text-[var(--text-primary)] flex items-center gap-1">
                  <Shield className="w-3.5 h-3.5 text-[var(--magenta)]" />
                  {data.adviserName}
                </span>
              </div>
              <div className="pt-2">
                <div className="flex items-center justify-between text-[10px] mb-1.5 font-[family-name:var(--font-heading)] uppercase tracking-wider">
                  <span className="text-[var(--text-dim)]">Group Progress</span>
                  <span className="text-[var(--cyan)]">{data.groupProgress}%</span>
                </div>
                <div className="w-full h-2 bg-[var(--bg-card)] overflow-hidden" style={{ borderRadius: "2px" }}>
                  <div className="h-full xp-bar-fill" style={{ width: `${data.groupProgress}%`, borderRadius: "2px" }} />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Task Completion */}
        <div className="card-cyber p-6" style={{ borderRadius: "4px" }}>
          <h3 className="text-xs font-bold text-[var(--text-primary)] font-[family-name:var(--font-heading)] tracking-wide flex items-center gap-2 mb-4">
            <Target className="w-4 h-4 text-[var(--emerald)]" />
            PERFORMANCE
          </h3>
          <div className="space-y-4">
            {/* Completion rate */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] text-[var(--text-dim)] font-[family-name:var(--font-heading)] uppercase tracking-widest">Task Completion Rate</span>
                <span className="text-lg font-bold font-[family-name:var(--font-heading)]" style={{ color: data.taskCompletionRate >= 70 ? "var(--emerald)" : data.taskCompletionRate >= 40 ? "var(--gold)" : "var(--red)" }}>
                  {data.taskCompletionRate}%
                </span>
              </div>
              <div className="w-full h-3 bg-[var(--bg-card)] overflow-hidden" style={{ borderRadius: "2px" }}>
                <div className="h-full transition-all" style={{ width: `${data.taskCompletionRate}%`, borderRadius: "2px", background: data.taskCompletionRate >= 70 ? "var(--emerald)" : data.taskCompletionRate >= 40 ? "var(--gold)" : "var(--red)" }} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-[var(--bg-elevated)] border border-[var(--border-dim)] text-center" style={{ borderRadius: "4px" }}>
                <p className="text-lg font-bold text-[var(--emerald)] font-[family-name:var(--font-heading)]">{data.completedTasks}</p>
                <p className="text-[9px] text-[var(--text-dim)] uppercase tracking-widest font-[family-name:var(--font-heading)]">Completed</p>
              </div>
              <div className="p-3 bg-[var(--bg-elevated)] border border-[var(--border-dim)] text-center" style={{ borderRadius: "4px" }}>
                <p className="text-lg font-bold text-[var(--text-secondary)] font-[family-name:var(--font-heading)]">{data.totalTasks - data.completedTasks}</p>
                <p className="text-[9px] text-[var(--text-dim)] uppercase tracking-widest font-[family-name:var(--font-heading)]">Remaining</p>
              </div>
            </div>

            {/* Login Streak */}
            <div className="p-4 border bg-[var(--bg-elevated)]" style={{ borderRadius: "4px", borderColor: data.loginStreak >= 7 ? "var(--magenta)" : "var(--border-dim)", boxShadow: data.loginStreak >= 7 ? "0 0 15px var(--magenta-glow)" : "none" }}>
              <div className="flex items-center gap-3">
                <Flame className="w-8 h-8" style={{ color: data.loginStreak >= 7 ? "var(--magenta)" : data.loginStreak >= 3 ? "var(--gold)" : "var(--text-dim)" }} />
                <div>
                  <p className="text-sm font-bold font-[family-name:var(--font-heading)]" style={{ color: data.loginStreak >= 7 ? "var(--magenta)" : "var(--gold)" }}>
                    {data.loginStreak} DAY STREAK
                  </p>
                  <p className="text-[10px] text-[var(--text-dim)]">
                    {data.loginStreak >= 7 ? "🔥 On fire! Keep it going!" : data.loginStreak >= 3 ? "Nice streak! Don't break it!" : "Log in daily to build your streak!"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Achievements */}
        <div className="card-cyber p-6" style={{ borderRadius: "4px" }}>
          <h3 className="text-xs font-bold text-[var(--text-primary)] font-[family-name:var(--font-heading)] tracking-wide flex items-center gap-2 mb-4">
            <Trophy className="w-4 h-4 text-[var(--gold)]" />
            RECENT ACHIEVEMENTS
          </h3>
          {data.recentAchievements.length > 0 ? (
            <div className="space-y-2">
              {data.recentAchievements.map((a, i) => (
                <div key={i} className="flex items-center gap-3 p-3 bg-[var(--bg-elevated)] border border-[var(--border-dim)]" style={{ borderRadius: "4px" }}>
                  <div className="w-8 h-8 flex items-center justify-center border badge-shine" style={{ borderRadius: "4px", borderColor: "var(--gold)", background: "var(--gold-glow)" }}>
                    <Star className="w-4 h-4 text-[var(--gold)]" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-bold text-[var(--text-primary)] font-[family-name:var(--font-heading)]">{a.title}</p>
                    <p className="text-[10px] text-[var(--text-dim)]">{a.description}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-[var(--text-dim)] text-center py-4">No achievements yet</p>
          )}
        </div>

        {/* Owned Items */}
        <div className="card-cyber p-6" style={{ borderRadius: "4px" }}>
          <h3 className="text-xs font-bold text-[var(--text-primary)] font-[family-name:var(--font-heading)] tracking-wide flex items-center gap-2 mb-4">
            <ShoppingBag className="w-4 h-4 text-[var(--magenta)]" />
            INVENTORY ({data.ownedItems.length} items)
          </h3>
          {data.ownedItems.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {data.ownedItems.map((item, i) => {
                const rarityColor = item.rarity === "legendary" ? "var(--gold)" : item.rarity === "epic" ? "var(--magenta)" : item.rarity === "rare" ? "var(--cyan)" : item.rarity === "uncommon" ? "var(--emerald)" : "var(--text-secondary)";
                return (
                  <span
                    key={i}
                    className="text-[10px] font-bold font-[family-name:var(--font-heading)] uppercase tracking-wider px-2.5 py-1 border"
                    style={{
                      borderRadius: "2px",
                      color: rarityColor,
                      background: `color-mix(in srgb, ${rarityColor} 10%, transparent)`,
                      borderColor: `color-mix(in srgb, ${rarityColor} 30%, transparent)`,
                    }}
                  >
                    {item.name}
                  </span>
                );
              })}
            </div>
          ) : (
            <p className="text-xs text-[var(--text-dim)] text-center py-4">Visit the Quest Shop to get items!</p>
          )}
        </div>
      </div>
    </div>
  );
}