"use client";

import { useState } from "react";
import {
  ShoppingBag,
  Coins,
  Crown,
  Flame,
  Zap,
  Star,
  Shield,
  Sparkles,
  CheckCircle2,
  Lock,
  ArrowUpDown,
  Scroll,
  Crosshair,
  BookOpen,
  FlaskConical,
  Swords,
  Square,
  Rainbow,
  Diamond,
  Bird,
  Bookmark,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { purchaseItem, equipItem } from "@/app/actions/shop";
import { cn } from "@/lib/utils";

interface ShopData {
  coins: number;
  activeTitle: string | null;
  activeFrame: string | null;
  activeIcon: string | null;
  activeFlair: string | null;
  items: {
    id: string;
    name: string;
    description: string;
    category: string;
    price: number;
    icon: string;
    rarity: string;
    preview: string | null;
    owned: boolean;
  }[];
}

interface CoinTransaction {
  id: string;
  amount: number;
  reason: string;
  createdAt: Date;
}

const rarityColors: Record<string, { color: string; bg: string; border: string }> = {
  common: { color: "var(--text-secondary)", bg: "rgba(136, 136, 136, 0.1)", border: "rgba(136, 136, 136, 0.2)" },
  uncommon: { color: "var(--emerald)", bg: "var(--emerald-glow)", border: "rgba(0, 255, 136, 0.2)" },
  rare: { color: "var(--cyan)", bg: "var(--cyan-glow)", border: "rgba(0, 245, 255, 0.2)" },
  epic: { color: "var(--magenta)", bg: "var(--magenta-glow)", border: "rgba(255, 0, 229, 0.2)" },
  legendary: { color: "var(--gold)", bg: "var(--gold-glow)", border: "rgba(255, 179, 71, 0.2)" },
};

const categoryLabels: Record<string, string> = {
  TITLE: "TITLES",
  FRAME: "FRAMES",
  ICON: "ICONS",
  FLAIR: "FLAIR",
};

function getItemIcon(iconName: string) {
  const icons: Record<string, React.ReactNode> = {
    scroll: <Scroll className="w-5 h-5" />,
    crosshair: <Crosshair className="w-5 h-5" />,
    "book-open": <BookOpen className="w-5 h-5" />,
    "flask-conical": <FlaskConical className="w-5 h-5" />,
    shield: <Shield className="w-5 h-5" />,
    swords: <Swords className="w-5 h-5" />,
    crown: <Crown className="w-5 h-5" />,
    square: <Square className="w-5 h-5" />,
    rainbow: <Rainbow className="w-5 h-5" />,
    diamond: <Diamond className="w-5 h-5" />,
    flame: <Flame className="w-5 h-5" />,
    zap: <Zap className="w-5 h-5" />,
    sword: <Swords className="w-5 h-5" />,
    dragon: <Flame className="w-5 h-5" />,
    bird: <Bird className="w-5 h-5" />,
    sparkles: <Sparkles className="w-5 h-5" />,
    star: <Star className="w-5 h-5" />,
    fire: <Flame className="w-5 h-5" />,
    "shopping-bag": <ShoppingBag className="w-5 h-5" />,
    bookmark: <Bookmark className="w-5 h-5" />,
  };
  return icons[iconName] || <Star className="w-5 h-5" />;
}

export function QuestShopClient({
  data,
  coinHistory,
}: {
  data: ShopData;
  coinHistory: CoinTransaction[];
}) {
  const [activeCategory, setActiveCategory] = useState<string>("ALL");
  const [loading, setLoading] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [showHistory, setShowHistory] = useState(false);
  const [coins, setCoins] = useState(data.coins);

  const categories = ["ALL", "TITLE", "FRAME", "ICON", "FLAIR"];

  const filteredItems =
    activeCategory === "ALL"
      ? data.items
      : data.items.filter((i) => i.category === activeCategory);

  async function handlePurchase(itemId: string) {
    setLoading(itemId);
    setMessage(null);
    const result = await purchaseItem(itemId);
    if (result.error) {
      setMessage({ type: "error", text: result.error });
    } else if (result.success) {
      setMessage({ type: "success", text: result.success });
      const item = data.items.find((i) => i.id === itemId);
      if (item) {
        setCoins((prev) => prev - item.price);
        item.owned = true;
      }
    }
    setLoading(null);
    setTimeout(() => setMessage(null), 4000);
  }

  async function handleEquip(category: string, value: string | null) {
    setMessage(null);
    const result = await equipItem(category, value);
    if (result.error) {
      setMessage({ type: "error", text: result.error });
    } else if (result.success) {
      setMessage({ type: "success", text: result.success });
    }
    setTimeout(() => setMessage(null), 3000);
  }

  function isEquipped(item: { category: string; preview: string | null; name: string }) {
    switch (item.category) {
      case "TITLE":
        return data.activeTitle === item.name;
      case "FRAME":
        return data.activeFrame === item.preview;
      case "ICON":
        return data.activeIcon === item.preview;
      case "FLAIR":
        return data.activeFlair === item.preview;
      default:
        return false;
    }
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[var(--text-primary)] font-[family-name:var(--font-heading)] tracking-tight flex items-center gap-3">
            <ShoppingBag className="w-6 h-6 text-[var(--gold)]" />
            QUEST SHOP
          </h2>
          <p className="text-[var(--text-secondary)] mt-1 text-sm">
            Spend your Quest Coins on titles, frames, icons, and flair
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowHistory(!showHistory)}
            className="flex items-center gap-1.5 px-3 py-1.5 border border-[var(--border-subtle)] bg-[var(--bg-card)] text-[var(--text-secondary)] text-[10px] font-bold font-[family-name:var(--font-heading)] uppercase tracking-wider hover:border-[var(--cyan)] hover:text-[var(--cyan)] transition-all"
            style={{ borderRadius: "4px" }}
          >
            <ArrowUpDown className="w-3.5 h-3.5" />
            {showHistory ? "SHOP" : "HISTORY"}
          </button>

          <div
            className="flex items-center gap-2 px-4 py-2 border-2"
            style={{
              borderRadius: "4px",
              borderColor: "var(--gold)",
              background: "var(--gold-glow)",
              boxShadow: "0 0 20px var(--gold-glow)",
            }}
          >
            <Coins className="w-5 h-5 text-[var(--gold)]" />
            <span className="text-lg font-bold text-[var(--gold)] font-[family-name:var(--font-heading)]">
              {coins}
            </span>
            <span className="text-[10px] text-[var(--text-secondary)] font-[family-name:var(--font-heading)] uppercase tracking-wider">
              QC
            </span>
          </div>
        </div>
      </div>

      {/* Message */}
      {message && (
        <div
          className="p-3 border text-sm flex items-center gap-2"
          style={{
            borderRadius: "4px",
            borderColor: message.type === "success" ? "var(--emerald)" : "var(--red)",
            background: message.type === "success" ? "var(--emerald-glow)" : "var(--red-glow)",
            color: message.type === "success" ? "var(--emerald)" : "var(--red)",
          }}
        >
          {message.type === "success" ? (
            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
          ) : (
            <Lock className="w-4 h-4 flex-shrink-0" />
          )}
          {message.text}
        </div>
      )}

      {showHistory ? (
        /* Coin History */
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-[var(--text-primary)] font-[family-name:var(--font-heading)] tracking-wide">
            TRANSACTION HISTORY
          </h3>
          <div className="space-y-2">
            {coinHistory.map((tx) => (
              <div
                key={tx.id}
                className="flex items-center justify-between p-3 card-cyber"
                style={{ borderRadius: "4px" }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-8 h-8 flex items-center justify-center border"
                    style={{
                      borderRadius: "4px",
                      borderColor: tx.amount > 0 ? "var(--emerald)" : "var(--red)",
                      background: tx.amount > 0 ? "var(--emerald-glow)" : "var(--red-glow)",
                    }}
                  >
                    <Coins
                      className="w-4 h-4"
                      style={{ color: tx.amount > 0 ? "var(--emerald)" : "var(--red)" }}
                    />
                  </div>
                  <div>
                    <p className="text-xs text-[var(--text-primary)]">{tx.reason}</p>
                    <p className="text-[10px] text-[var(--text-dim)]">
                      {new Date(tx.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        hour: "numeric",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
                <span
                  className="text-sm font-bold font-[family-name:var(--font-heading)]"
                  style={{ color: tx.amount > 0 ? "var(--emerald)" : "var(--red)" }}
                >
                  {tx.amount > 0 ? "+" : ""}
                  {tx.amount} QC
                </span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <>
          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={cn(
                  "px-4 py-2 text-[10px] font-bold font-[family-name:var(--font-heading)] uppercase tracking-wider border transition-all whitespace-nowrap btn-cyber",
                  activeCategory === cat
                    ? "border-[var(--cyan)] bg-[var(--cyan-glow)] text-[var(--cyan)]"
                    : "border-[var(--border-subtle)] bg-[var(--bg-card)] text-[var(--text-dim)] hover:border-[var(--text-secondary)] hover:text-[var(--text-secondary)]"
                )}
                style={{
                  borderRadius: "4px",
                  boxShadow: activeCategory === cat ? "0 0 10px var(--cyan-glow)" : "none",
                }}
              >
                {cat === "ALL" ? "ALL ITEMS" : categoryLabels[cat] || cat}
              </button>
            ))}
          </div>

          {/* Items Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredItems.map((item) => {
              const rarity = rarityColors[item.rarity] || rarityColors.common;
              const equipped = isEquipped(item);

              return (
                <div
                  key={item.id}
                  className={cn(
                    "p-5 border transition-all duration-200 group relative overflow-hidden",
                    item.owned
                      ? "bg-[var(--bg-elevated)]"
                      : "bg-[var(--bg-card)]",
                    equipped && "ring-1"
                  )}
                  style={{
                    borderRadius: "4px",
                    borderColor: equipped ? rarity.color : item.owned ? rarity.border : "var(--border-subtle)",
                    boxShadow: equipped ? `0 0 15px ${rarity.bg}` : "none",
                    ringColor: equipped ? rarity.color : "transparent",
                  }}
                >
                  {/* Corner accents */}
                  <div
                    className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 opacity-30 group-hover:opacity-70 transition-opacity"
                    style={{ borderColor: rarity.color }}
                  />
                  <div
                    className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 opacity-30 group-hover:opacity-70 transition-opacity"
                    style={{ borderColor: rarity.color }}
                  />

                  {/* Rarity Badge */}
                  <div className="flex items-center justify-between mb-3">
                    <span
                      className="text-[9px] font-bold font-[family-name:var(--font-heading)] uppercase tracking-widest px-2 py-0.5 border"
                      style={{
                        borderRadius: "2px",
                        color: rarity.color,
                        background: rarity.bg,
                        borderColor: rarity.border,
                      }}
                    >
                      {item.rarity}
                    </span>
                    <span className="text-[9px] font-bold font-[family-name:var(--font-heading)] uppercase tracking-widest text-[var(--text-dim)]">
                      {item.category}
                    </span>
                  </div>

                  {/* Icon */}
                  <div
                    className="w-14 h-14 flex items-center justify-center border mb-4 mx-auto"
                    style={{
                      borderRadius: "4px",
                      borderColor: rarity.color,
                      background: rarity.bg,
                      color: rarity.color,
                      boxShadow: `0 0 20px ${rarity.bg}`,
                    }}
                  >
                    {getItemIcon(item.icon)}
                  </div>

                  {/* Info */}
                  <h4 className="text-sm font-bold text-[var(--text-primary)] font-[family-name:var(--font-heading)] text-center mb-1">
                    {item.name}
                  </h4>
                  <p className="text-[10px] text-[var(--text-dim)] text-center mb-4 line-clamp-2">
                    {item.description}
                  </p>

                  {/* Price & Action */}
                  {item.owned ? (
                    <div className="space-y-2">
                      <div className="flex items-center justify-center gap-1 text-xs text-[var(--emerald)]">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span className="font-bold font-[family-name:var(--font-heading)] uppercase tracking-wider text-[10px]">
                          Owned
                        </span>
                      </div>
                      {equipped ? (
                        <Button
                          onClick={() => handleEquip(item.category, null)}
                          className="w-full text-[10px] font-bold font-[family-name:var(--font-heading)] uppercase tracking-wider py-2 bg-[var(--bg-card)] border hover:bg-[var(--bg-hover)]"
                          variant="outline"
                          style={{
                            borderRadius: "4px",
                            borderColor: rarity.color,
                            color: rarity.color,
                          }}
                        >
                          UNEQUIP
                        </Button>
                      ) : (
                        <Button
                          onClick={() =>
                            handleEquip(
                              item.category,
                              item.category === "TITLE" ? item.name : item.preview
                            )
                          }
                          className="w-full text-[10px] font-bold font-[family-name:var(--font-heading)] uppercase tracking-wider py-2 btn-cyber"
                          style={{
                            borderRadius: "4px",
                            background: rarity.color,
                            color: item.rarity === "common" ? "var(--bg-darkest)" : "white",
                            boxShadow: `0 0 10px ${rarity.bg}`,
                          }}
                        >
                          EQUIP
                        </Button>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="flex items-center justify-center gap-1.5">
                        <Coins className="w-4 h-4 text-[var(--gold)]" />
                        <span className="text-sm font-bold text-[var(--gold)] font-[family-name:var(--font-heading)]">
                          {item.price} QC
                        </span>
                      </div>
                      <Button
                        onClick={() => handlePurchase(item.id)}
                        disabled={coins < item.price || loading === item.id}
                        className="w-full text-[10px] font-bold font-[family-name:var(--font-heading)] uppercase tracking-wider py-2 btn-cyber disabled:opacity-30 disabled:cursor-not-allowed"
                        style={{
                          borderRadius: "4px",
                          background: coins >= item.price ? "var(--gold)" : "var(--bg-hover)",
                          color: coins >= item.price ? "black" : "var(--text-dim)",
                          boxShadow: coins >= item.price ? "0 0 10px var(--gold-glow)" : "none",
                        }}
                      >
                        {loading === item.id
                          ? "PURCHASING..."
                          : coins < item.price
                            ? `NEED ${item.price - coins} MORE QC`
                            : "PURCHASE"}
                      </Button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* How to earn coins */}
          <div className="card-cyber-accent p-6" style={{ borderRadius: "4px" }}>
            <h3 className="text-sm font-bold text-[var(--gold)] font-[family-name:var(--font-heading)] tracking-wide flex items-center gap-2 mb-4">
              <Coins className="w-4 h-4" />
              HOW TO EARN QUEST COINS
            </h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {[
                { action: "Task approved by teacher", reward: "10 QC" },
                { action: "First-try approval (no revisions)", reward: "+5 QC bonus" },
                { action: "Milestone completed", reward: "25 QC" },
                { action: "Achievement unlocked", reward: "15 QC" },
                { action: "Submit before deadline", reward: "+3 QC bonus" },
                { action: "Daily login streak (3+ days)", reward: "5 QC" },
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-3 bg-[var(--bg-elevated)] border border-[var(--border-dim)]"
                  style={{ borderRadius: "4px" }}
                >
                  <span className="text-xs text-[var(--text-secondary)]">{item.action}</span>
                  <span className="text-xs font-bold text-[var(--gold)] font-[family-name:var(--font-heading)]">
                    {item.reward}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}