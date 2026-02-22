"use client";

import React, { createContext, useContext, useState, useCallback } from "react";

export type ActivityAction =
  | "role_approve"
  | "role_reject"
  | "content_approve"
  | "content_delete"
  | "user_suspend"
  | "user_unsuspend"
  | "role_change";

export interface ActivityEntry {
  id: string;
  action: ActivityAction;
  actor: string;
  target: string;
  detail: string;
  time: string;
  ip: string;
}

interface AdminActivityContextType {
  sessionLogs: ActivityEntry[];
  logActivity: (action: ActivityAction, target: string, detail: string) => void;
  notifications: NotifEntry[];
  markAllRead: () => void;
  markRead: (id: string) => void;
  dismissNotif: (id: string) => void;
  unreadCount: number;
}

export interface NotifEntry {
  id: string;
  type: "flag" | "role_req" | "verify" | "info" | "success" | "error";
  title: string;
  msg: string;
  time: string;
  read: boolean;
}

const SEED_NOTIFS: NotifEntry[] = [
  { id: "n1", type: "flag", title: "Content Flagged", msg: "Comment #9921 flagged by 12 users for misattributed hadith.", time: "5m ago", read: false },
  { id: "n2", type: "role_req", title: "Role Upgrade Request", msg: "Hamza Al-Farsi requested Learner → Writer upgrade.", time: "22m ago", read: false },
  { id: "n3", type: "verify", title: "Scholar Application", msg: "Dr. Amal Farouk submitted a scholar verification application.", time: "1h ago", read: false },
  { id: "n4", type: "info", title: "Weekly Report Ready", msg: "The February Week 3 analytics report is ready.", time: "3h ago", read: true },
  { id: "n5", type: "success", title: "User Suspended", msg: "User yusuf@example.com was successfully suspended.", time: "5h ago", read: true },
];

export const AdminActivityContext = createContext<AdminActivityContextType | null>(null);

export function AdminActivityProvider({ children }: { children: React.ReactNode }) {
  const [sessionLogs, setSessionLogs] = useState<ActivityEntry[]>([]);
  const [notifications, setNotifications] = useState<NotifEntry[]>(SEED_NOTIFS);

  const logActivity = useCallback((action: ActivityAction, target: string, detail: string) => {
    const entry: ActivityEntry = {
      id: crypto.randomUUID(),
      action,
      actor: "admin@ummahthoughts.com",
      target,
      detail,
      time: new Date().toLocaleString("en-GB", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }),
      ip: "192.168.1.1",
    };
    setSessionLogs(prev => [entry, ...prev]);

    // Push a notification for key actions
    if (["role_approve", "role_reject", "user_suspend", "content_delete"].includes(action)) {
      const notifType: NotifEntry["type"] =
        action === "user_suspend" ? "error"
        : action === "content_delete" ? "flag"
        : action === "role_approve" ? "success"
        : "info";

      const notif: NotifEntry = {
        id: crypto.randomUUID(),
        type: notifType,
        title: detail.split(":")[0] ?? detail,
        msg: `${target} — ${detail}`,
        time: "just now",
        read: false,
      };
      setNotifications(prev => [notif, ...prev]);
    }
  }, []);

  const markAllRead = useCallback(() => setNotifications(prev => prev.map(n => ({ ...n, read: true }))), []);
  const markRead = useCallback((id: string) => setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n)), []);
  const dismissNotif = useCallback((id: string) => setNotifications(prev => prev.filter(n => n.id !== id)), []);

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <AdminActivityContext.Provider value={{ sessionLogs, logActivity, notifications, markAllRead, markRead, dismissNotif, unreadCount }}>
      {children}
    </AdminActivityContext.Provider>
  );
}

export function useAdminActivity() {
  const ctx = useContext(AdminActivityContext);
  if (!ctx) throw new Error("useAdminActivity must be used inside AdminActivityProvider");
  return ctx;
}