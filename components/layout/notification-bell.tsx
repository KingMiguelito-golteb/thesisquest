"use client";

import { useState, useEffect } from "react";
import {
  Bell,
  CheckCheck,
  Trash2,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  deleteNotification,
  clearAllNotifications,
} from "@/app/actions/notifications";

interface Notification {
  id: string;
  message: string;
  read: boolean;
  createdAt: Date;
}

export function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);

  async function loadNotifications() {
    const data = await getNotifications();
    setNotifications(data.notifications);
    setUnreadCount(data.unreadCount);
  }

  useEffect(() => {
    loadNotifications();
    // Poll every 30 seconds
    const interval = setInterval(loadNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  async function handleMarkRead(id: string) {
    await markNotificationRead(id);
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
    setUnreadCount((prev) => Math.max(0, prev - 1));
  }

  async function handleMarkAllRead() {
    setLoading(true);
    await markAllNotificationsRead();
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    setUnreadCount(0);
    setLoading(false);
  }

  async function handleDelete(id: string) {
    const notif = notifications.find((n) => n.id === id);
    await deleteNotification(id);
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    if (notif && !notif.read) {
      setUnreadCount((prev) => Math.max(0, prev - 1));
    }
  }

  async function handleClearAll() {
    setLoading(true);
    await clearAllNotifications();
    setNotifications([]);
    setUnreadCount(0);
    setLoading(false);
  }

  return (
    <div className="relative">
      {/* Bell Button */}
      <Button
        variant="ghost"
        size="icon"
        className="relative text-[var(--text-secondary)] hover:text-[var(--cyan)] hover:bg-[var(--cyan-glow)]"
        style={{ borderRadius: "4px" }}
        onClick={() => {
          setOpen(!open);
          if (!open) loadNotifications();
        }}
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span
            className="absolute -top-1 -right-1 w-4 h-4 bg-[var(--magenta)] text-[10px] font-bold flex items-center justify-center text-white"
            style={{
              borderRadius: "2px",
              boxShadow: "0 0 8px var(--magenta-glow)",
            }}
          >
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </Button>

      {/* Dropdown */}
      {open && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setOpen(false)}
          />

          {/* Panel */}
          <div
            className="absolute right-0 top-12 w-[380px] max-h-[500px] z-50 border overflow-hidden flex flex-col"
            style={{
              borderRadius: "4px",
              borderColor: "var(--border-subtle)",
              background: "var(--bg-card)",
              boxShadow:
                "0 0 30px rgba(0,0,0,0.5), 0 0 15px var(--cyan-glow)",
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--border-dim)]">
              <h3 className="text-xs font-bold text-[var(--text-primary)] font-[family-name:var(--font-heading)] uppercase tracking-wider flex items-center gap-2">
                <Bell className="w-4 h-4 text-[var(--cyan)]" />
                NOTIFICATIONS
                {unreadCount > 0 && (
                  <span
                    className="px-1.5 py-0.5 text-[9px] font-bold"
                    style={{
                      borderRadius: "2px",
                      color: "var(--magenta)",
                      background: "var(--magenta-glow)",
                      border:
                        "1px solid color-mix(in srgb, var(--magenta) 30%, transparent)",
                    }}
                  >
                    {unreadCount} NEW
                  </span>
                )}
              </h3>
              <div className="flex items-center gap-1">
                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllRead}
                    disabled={loading}
                    className="p-1.5 text-[var(--text-dim)] hover:text-[var(--cyan)] transition-colors"
                    title="Mark all as read"
                  >
                    <CheckCheck className="w-4 h-4" />
                  </button>
                )}
                {notifications.length > 0 && (
                  <button
                    onClick={handleClearAll}
                    disabled={loading}
                    className="p-1.5 text-[var(--text-dim)] hover:text-[var(--red)] transition-colors"
                    title="Clear all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
                <button
                  onClick={() => setOpen(false)}
                  className="p-1.5 text-[var(--text-dim)] hover:text-[var(--text-primary)] transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Notifications List */}
            <div className="flex-1 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-8 text-center">
                  <Bell className="w-6 h-6 text-[var(--text-dim)] mx-auto mb-2" />
                  <p className="text-xs text-[var(--text-dim)] font-[family-name:var(--font-heading)]">
                    NO NOTIFICATIONS
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-[var(--border-dim)]">
                  {notifications.map((notif) => (
                    <div
                      key={notif.id}
                      className={`px-4 py-3 flex items-start gap-3 transition-colors hover:bg-[var(--bg-hover)] group ${
                        !notif.read ? "bg-[var(--cyan-glow)]" : ""
                      }`}
                    >
                      {/* Unread dot */}
                      <div className="mt-1.5 flex-shrink-0">
                        {!notif.read ? (
                          <div
                            className="w-2 h-2"
                            style={{
                              borderRadius: "2px",
                              background: "var(--cyan)",
                              boxShadow: "0 0 6px var(--cyan-glow)",
                            }}
                          />
                        ) : (
                          <div className="w-2 h-2" />
                        )}
                      </div>

                      {/* Content */}
                      <div
                        className="flex-1 min-w-0 cursor-pointer"
                        onClick={() => !notif.read && handleMarkRead(notif.id)}
                      >
                        <p
                          className={`text-xs leading-relaxed ${
                            notif.read
                              ? "text-[var(--text-dim)]"
                              : "text-[var(--text-primary)]"
                          }`}
                        >
                          {notif.message}
                        </p>
                        <p className="text-[10px] text-[var(--text-dim)] mt-1">
                          {new Date(notif.createdAt).toLocaleDateString(
                            "en-US",
                            {
                              month: "short",
                              day: "numeric",
                              hour: "numeric",
                              minute: "2-digit",
                            }
                          )}
                        </p>
                      </div>

                      {/* Delete */}
                      <button
                        onClick={() => handleDelete(notif.id)}
                        className="opacity-0 group-hover:opacity-100 p-1 text-[var(--text-dim)] hover:text-[var(--red)] transition-all flex-shrink-0"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}