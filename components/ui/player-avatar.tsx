"use client";

import { cn } from "@/lib/utils";
import {
  Flame,
  Zap,
  Crown,
  Swords,
  Bird,
  Star,
} from "lucide-react";

interface PlayerAvatarProps {
  name: string;
  level?: number;
  activeFrame?: string | null;
  activeIcon?: string | null;
  activeTitle?: string | null;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  showTitle?: boolean;
  showLevel?: boolean;
  className?: string;
}

const frameStyles: Record<string, { border: string; shadow: string; animation?: string }> = {
  cyan: {
    border: "var(--cyan)",
    shadow: "0 0 12px var(--cyan-glow), 0 0 24px rgba(0,245,255,0.08)",
  },
  magenta: {
    border: "var(--magenta)",
    shadow: "0 0 12px var(--magenta-glow), 0 0 24px rgba(255,0,229,0.08)",
  },
  gold: {
    border: "var(--gold)",
    shadow: "0 0 12px var(--gold-glow), 0 0 24px rgba(255,179,71,0.08)",
  },
  emerald: {
    border: "var(--emerald)",
    shadow: "0 0 12px var(--emerald-glow), 0 0 24px rgba(0,255,136,0.08)",
  },
  rainbow: {
    border: "var(--cyan)",
    shadow: "0 0 12px var(--cyan-glow)",
    animation: "borderGlow 2s ease-in-out infinite",
  },
  diamond: {
    border: "#b9f2ff",
    shadow: "0 0 15px rgba(185,242,255,0.3), 0 0 30px rgba(185,242,255,0.1), inset 0 0 10px rgba(185,242,255,0.1)",
  },
};

const iconComponents: Record<string, React.ReactNode> = {
  flame: <Flame className="w-full h-full" />,
  zap: <Zap className="w-full h-full" />,
  crown: <Crown className="w-full h-full" />,
  sword: <Swords className="w-full h-full" />,
  dragon: <Flame className="w-full h-full" />,
  phoenix: <Bird className="w-full h-full" />,
};

const sizeConfig = {
  xs: { container: "w-6 h-6", text: "text-[8px]", icon: "w-2.5 h-2.5", levelSize: "w-4 h-4 text-[7px]", iconBadge: "w-3 h-3 -bottom-0.5 -right-0.5 p-0.5" },
  sm: { container: "w-8 h-8", text: "text-[10px]", icon: "w-3 h-3", levelSize: "w-5 h-5 text-[8px]", iconBadge: "w-4 h-4 -bottom-0.5 -right-0.5 p-0.5" },
  md: { container: "w-10 h-10", text: "text-xs", icon: "w-3.5 h-3.5", levelSize: "w-5 h-5 text-[9px]", iconBadge: "w-4 h-4 -bottom-1 -right-1 p-0.5" },
  lg: { container: "w-14 h-14", text: "text-sm", icon: "w-4 h-4", levelSize: "w-6 h-6 text-[10px]", iconBadge: "w-5 h-5 -bottom-1 -right-1 p-[3px]" },
  xl: { container: "w-20 h-20", text: "text-xl", icon: "w-6 h-6", levelSize: "w-8 h-8 text-xs", iconBadge: "w-7 h-7 -bottom-1.5 -right-1.5 p-1" },
};

export function PlayerAvatar({
  name,
  level,
  activeFrame,
  activeIcon,
  activeTitle,
  size = "md",
  showTitle = false,
  showLevel = false,
  className,
}: PlayerAvatarProps) {
  const config = sizeConfig[size];
  const frame = activeFrame ? frameStyles[activeFrame] : null;
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const defaultBorder = "var(--cyan)";
  const defaultBg = "var(--cyan-glow)";
  const defaultColor = "var(--cyan)";

  return (
    <div className={cn("flex flex-col items-center gap-1", className)}>
      <div className="relative">
        {/* Main Avatar */}
        <div
          className={cn(
            config.container,
            "border-2 flex items-center justify-center font-bold font-[family-name:var(--font-heading)]"
          )}
          style={{
            borderRadius: "4px",
            borderColor: frame?.border || defaultBorder,
            background: frame
              ? `color-mix(in srgb, ${frame.border} 10%, transparent)`
              : defaultBg,
            color: frame?.border || defaultColor,
            boxShadow: frame?.shadow || `0 0 8px ${defaultBg}`,
            animation: frame?.animation || "none",
          }}
        >
          {activeIcon && iconComponents[activeIcon] ? (
            <div className={config.icon} style={{ color: frame?.border || defaultColor }}>
              {iconComponents[activeIcon]}
            </div>
          ) : (
            <span className={config.text}>{initials}</span>
          )}
        </div>

        {/* Level Badge */}
        {showLevel && level && (
          <div
            className={cn(
              "absolute -bottom-1 -left-1 flex items-center justify-center border-2 font-bold font-[family-name:var(--font-heading)]",
              config.levelSize
            )}
            style={{
              borderRadius: "4px",
              borderColor: "var(--gold)",
              background: "var(--bg-darkest)",
              color: "var(--gold)",
              boxShadow: "0 0 8px var(--gold-glow)",
            }}
          >
            {level}
          </div>
        )}

        {/* Icon Badge (small icon overlay when using initials) */}
        {activeIcon && iconComponents[activeIcon] && (
          <div
            className={cn(
              "absolute flex items-center justify-center border",
              config.iconBadge
            )}
            style={{
              borderRadius: "2px",
              borderColor: frame?.border || defaultBorder,
              background: "var(--bg-darkest)",
              color: frame?.border || defaultColor,
            }}
          >
            <span className={config.icon}>
              {iconComponents[activeIcon]}
            </span>
          </div>
        )}
      </div>

      {/* Title */}
      {showTitle && activeTitle && (
        <span
          className="text-[9px] font-bold font-[family-name:var(--font-heading)] uppercase tracking-wider px-1.5 py-0.5 border"
          style={{
            borderRadius: "2px",
            color: "var(--magenta)",
            background: "var(--magenta-glow)",
            borderColor: "rgba(255,0,229,0.2)",
          }}
        >
          {activeTitle}
        </span>
      )}
    </div>
  );
}