"use client";

import { useState, useContext, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { Menu, Bell, Globe, Sun, Moon, CheckCheck, Zap, Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { AdminActivityContext, NotifEntry } from "@/contexts/AdminActivityContext";
import DashboardSidebar from "./DashboardSidebar";
import { cn } from "@/lib/utils";
import { changeLanguage } from "@/i18n";
import { notificationApi } from "@/lib/api";

interface DashboardLayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
}

const NOTIF_TYPE_COLORS: Record<NotifEntry["type"], { dot: string; bg: string }> = {
  flag: { dot: "bg-destructive", bg: "bg-destructive/10" },
  role_req: { dot: "bg-amber-500", bg: "bg-amber-500/10" },
  verify: { dot: "bg-primary", bg: "bg-primary/10" },
  info: { dot: "bg-muted-foreground", bg: "bg-muted" },
  success: { dot: "bg-emerald-500", bg: "bg-emerald-500/10" },
  error: { dot: "bg-destructive", bg: "bg-destructive/10" },
};

function useDarkMode() {
  const [dark, setDark] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("ummahthoughts-theme");
      if (stored) return stored === "dark";
      return document.documentElement.classList.contains("dark");
    }
    return false;
  });

  const toggle = () => {
    const next = !dark;
    setDark(next);
    if (next) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("ummahthoughts-theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("ummahthoughts-theme", "light");
    }
  };

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [dark]);

  return { dark, toggle };
}

export default function DashboardLayout({ children, title, subtitle }: DashboardLayoutProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [bellOpen, setBellOpen] = useState(false);
  const [livePulse, setLivePulse] = useState(false);
  const prevSessionLen = useRef(0);
  const { user } = useAuth();
  const router = useRouter();
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language;
  const { dark, toggle: toggleDark } = useDarkMode();

  // Safe context read — null when not inside AdminActivityProvider
  const notifData = useContext(AdminActivityContext);
  const sessionLogs = notifData?.sessionLogs ?? [];

  // API notifications (real data from backend)
  const [apiNotifications, setApiNotifications] = useState<{ id: string; type: string; title: string; message: string; link: string | null; read: boolean; createdAt: string }[]>([]);
  const [apiNotifLoading, setApiNotifLoading] = useState(false);
  const apiUnreadCount = apiNotifications.filter((n) => !n.read).length;

  const fetchApiNotifications = async () => {
    setApiNotifLoading(true);
    const { data } = await notificationApi.list();
    setApiNotifLoading(false);
    if (data?.notifications) setApiNotifications(data.notifications);
  };

  // Fetch on mount so badge shows from the start
  useEffect(() => {
    if (user) fetchApiNotifications();
  }, [user?.id]);

  // Refresh when bell opens
  useEffect(() => {
    if (bellOpen) fetchApiNotifications();
  }, [bellOpen]);

  const handleApiMarkRead = async (id: string) => {
    setApiNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
    await notificationApi.markAsRead(id);
  };

  const handleApiMarkAllRead = async () => {
    setApiNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    await notificationApi.markAllAsRead();
  };

  const handleNotificationClick = async (n: { id: string; link: string | null; read: boolean }) => {
    if (!n.read) handleApiMarkRead(n.id);
    setBellOpen(false);
    if (n.link && n.link !== "#") {
      router.push(n.link);
    } else {
      router.push("/dashboard/notifications");
    }
  };

  function formatNotifTime(iso: string) {
    try {
      const d = new Date(iso);
      const now = new Date();
      const diff = now.getTime() - d.getTime();
      if (diff < 60000) return "just now";
      if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
      if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
      return d.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
    } catch {
      return "";
    }
  }

  // Pulse bell whenever a NEW live session log is added
  useEffect(() => {
    if (sessionLogs.length > prevSessionLen.current) {
      setLivePulse(true);
      const timer = setTimeout(() => setLivePulse(false), 4000);
      prevSessionLen.current = sessionLogs.length;
      return () => clearTimeout(timer);
    }
    prevSessionLen.current = sessionLogs.length;
  }, [sessionLogs.length]);

  useEffect(() => {
    if (!user) {
      router.push("/auth/login");
    }
  }, [user, router]);

  if (!user) return null;

  const toggleLang = () => {
    const next = currentLang === "bn" ? "en" : "bn";
    changeLanguage(next);
  };

  const unreadCount = apiUnreadCount;

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Mobile overlay */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setMobileSidebarOpen(false)} />
      )}

      {/* Bell overlay */}
      {bellOpen && (
        <div className="fixed inset-0 z-40" onClick={() => setBellOpen(false)} />
      )}

      {/* Sidebar – desktop */}
      <div className="hidden lg:flex">
        <DashboardSidebar collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />
      </div>

      {/* Sidebar – mobile */}
      <div className={cn(
        "fixed left-0 top-0 h-full z-50 lg:hidden transition-transform duration-300",
        mobileSidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div style={{ width: 260 }}>
          <DashboardSidebar collapsed={false} onToggle={() => setMobileSidebarOpen(false)} />
        </div>
      </div>

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* Topbar */}
        <header className="h-[70px] flex items-center justify-between px-4 sm:px-6 border-b border-border bg-card/80 backdrop-blur-sm flex-shrink-0 gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="lg:hidden w-8 h-8 rounded-lg hover:bg-muted flex items-center justify-center flex-shrink-0"
            >
              <Menu className="h-4 w-4 text-muted-foreground" />
            </button>
            {title && (
              <div className="min-w-0">
                <h1 className="font-display font-bold text-base sm:text-lg text-foreground leading-tight truncate">{title}</h1>
                {subtitle && <p className="text-xs text-muted-foreground truncate hidden sm:block">{subtitle}</p>}
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            {/* Language toggle */}
            <button
              onClick={toggleLang}
              title={currentLang === "bn" ? "Switch to English" : "বাংলায় পরিবর্তন করুন"}
              className={cn(
                "flex items-center gap-2 h-8 px-3 rounded-full text-xs font-bold transition-all border",
                "bg-primary/10 border-primary/30 text-primary hover:bg-primary/20 hover:border-primary/50"
              )}
            >
              <Globe className="h-3.5 w-3.5 flex-shrink-0" />
              <span className="hidden xs:inline sm:inline">
                {currentLang === "bn" ? "🇧🇩 বাং → EN" : "🇬🇧 EN → বাং"}
              </span>
              <span className="xs:hidden sm:hidden">
                {currentLang === "bn" ? "EN" : "বাং"}
              </span>
            </button>

            {/* Dark mode toggle */}
            <button
              onClick={toggleDark}
              title={dark ? "Switch to light mode" : "Switch to dark mode"}
              className="w-8 h-8 rounded-xl hover:bg-muted flex items-center justify-center transition-colors"
            >
              {dark
                ? <Sun className="h-4 w-4 text-amber-400" />
                : <Moon className="h-4 w-4 text-muted-foreground" />
              }
            </button>

            {/* Notification bell */}
            <div className="relative">
              <button
                onClick={() => { setBellOpen(o => !o); setLivePulse(false); }}
                className="w-8 h-8 rounded-xl hover:bg-muted flex items-center justify-center transition-colors relative"
              >
                {/* Outer pulse ring when live action fires */}
                {livePulse && (
                  <span className="absolute inset-0 rounded-xl ring-2 ring-emerald-500 animate-ping opacity-60 pointer-events-none" />
                )}
                <Bell className={cn("h-4 w-4 transition-colors", livePulse ? "text-emerald-500" : "text-muted-foreground")} />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-destructive text-destructive-foreground rounded-full text-[9px] font-bold flex items-center justify-center leading-none">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </button>

              {/* Bell dropdown */}
              {bellOpen && (
                <div className="absolute right-0 top-10 z-50 w-80 bg-card border border-border rounded-2xl shadow-[var(--shadow-elevated)] overflow-hidden">
                  {/* Header */}
                  <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                    <div className="flex items-center gap-2">
                      <Bell className="h-4 w-4 text-primary" />
                      <span className="text-sm font-semibold text-foreground">{t("admin.notifications")}</span>
                      {unreadCount > 0 && (
                        <span className="bg-destructive text-destructive-foreground text-[10px] font-bold px-1.5 py-0.5 rounded-full">{unreadCount}</span>
                      )}
                    </div>
                    {unreadCount > 0 && (
                      <button
                        onClick={handleApiMarkAllRead}
                        className="flex items-center gap-1 text-[10px] font-semibold text-primary hover:underline"
                      >
                        <CheckCheck className="h-3 w-3" /> {t("admin.markAllRead")}
                      </button>
                    )}
                  </div>

                  {/* Live session logs pinned at top */}
                  {sessionLogs.length > 0 && (
                    <div className="border-b border-emerald-500/20 bg-emerald-500/5 px-4 py-2 space-y-1.5">
                      <div className="flex items-center gap-1.5 mb-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider">Live Session</span>
                      </div>
                      {sessionLogs.slice(0, 3).map((log, i) => (
                        <div key={log.id} className={cn(
                          "flex items-center gap-2 px-2 py-1.5 rounded-lg",
                          i === 0 && "bg-emerald-500/10"
                        )}>
                          <Zap className="h-3 w-3 text-emerald-600 flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="text-[11px] font-semibold text-foreground capitalize truncate">{log.action.replace(/_/g, " ")}</p>
                            <p className="text-[10px] text-muted-foreground truncate">{log.target}</p>
                          </div>
                          <span className="text-[9px] font-bold bg-emerald-500/15 text-emerald-700 px-1.5 py-0.5 rounded-full flex-shrink-0">live</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Notification list (from API) */}
                  <div className="max-h-72 overflow-y-auto divide-y divide-border">
                    {apiNotifLoading ? (
                      <div className="py-8 flex items-center justify-center gap-2 text-muted-foreground text-sm">
                        <Loader2 className="h-4 w-4 animate-spin" /> Loading...
                      </div>
                    ) : apiNotifications.length === 0 ? (
                      <div className="py-8 text-center text-sm text-muted-foreground">{t("admin.noNotifications")}</div>
                    ) : apiNotifications.slice(0, 8).map((n) => {
                      const meta = NOTIF_TYPE_COLORS[n.type as NotifEntry["type"]] ?? NOTIF_TYPE_COLORS.info;
                      return (
                        <div
                          key={n.id}
                          role="button"
                          tabIndex={0}
                          onClick={() => handleNotificationClick(n)}
                          onKeyDown={(e) => e.key === "Enter" && handleNotificationClick(n)}
                          className={cn(
                            "flex items-start gap-3 px-4 py-3 cursor-pointer transition-colors hover:bg-muted/50",
                            !n.read && "bg-primary/5"
                          )}
                        >
                          <div className={cn("w-2 h-2 rounded-full flex-shrink-0 mt-1.5", meta.dot, n.read && "opacity-0")} />
                          <div className="flex-1 min-w-0">
                            <p className={cn("text-xs font-semibold truncate", !n.read ? "text-foreground" : "text-muted-foreground")}>{n.title}</p>
                            <p className="text-[11px] text-muted-foreground line-clamp-2 mt-0.5">{n.message}</p>
                            <p className="text-[10px] text-muted-foreground/60 mt-1">{formatNotifTime(n.createdAt)}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Footer */}
                  <div className="border-t border-border px-4 py-2.5">
                    <button
                      onClick={() => { setBellOpen(false); router.push("/dashboard/notifications"); }}
                      className="w-full text-xs font-semibold text-primary hover:underline text-center"
                    >
                      {t("admin.viewAllNotifications")}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Role badge + avatar */}
            <div className="flex items-center gap-2">
              {user.role === "admin" && (
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-destructive/10 text-destructive border border-destructive/20 uppercase tracking-wider">
                  Admin
                </span>
              )}
              <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center text-sm font-bold text-primary cursor-pointer hover:bg-primary/20 transition-colors">
                {user.avatar}
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}