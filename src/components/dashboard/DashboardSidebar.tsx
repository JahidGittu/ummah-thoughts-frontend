"use client";

import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useAuth, UserRole } from "@/contexts/AuthContext";
import {
  LayoutDashboard, BookOpen, MessageSquare, Users, FileText, BarChart3,
  Settings, LogOut, Star, Bookmark, Clock, PenSquare,
  Trophy, Bell, ChevronLeft, GraduationCap, Library, Scale, Scroll,
  CheckSquare, Calendar, Target, TrendingUp, UserCheck, Globe, Archive,
  ShieldAlert, Flag, ShieldCheck, ClipboardList, FileBarChart2, ScrollText,
  Shield,
  User,
  MoreVertical,
} from "lucide-react";
import { useTranslation } from "react-i18next";

interface NavItem {
  labelKey: string;
  icon: React.ElementType;
  path: string;
  badge?: string;
}

interface NavGroup {
  titleKey: string;
  items: NavItem[];
}

const NAV_BY_ROLE: Record<UserRole, NavGroup[]> = {
  scholar: [
    {
      titleKey: "dashboard.overview",
      items: [
        { labelKey: "dashboard_nav.dashboard", icon: LayoutDashboard, path: "/dashboard" },
        { labelKey: "dashboard_nav.notifications", icon: Bell, path: "/dashboard/notifications", badge: "3" },
      ],
    },
    {
      titleKey: "dashboard_nav.scholarship",
      items: [
        { labelKey: "dashboard_nav.fatwas", icon: Scale, path: "/dashboard/fatwas" },
        { labelKey: "dashboard_nav.debates", icon: MessageSquare, path: "/dashboard/debates", badge: "Live" },
        { labelKey: "dashboard_nav.works", icon: Scroll, path: "/dashboard/works" },
        { labelKey: "dashboard_nav.knowledge", icon: Library, path: "/dashboard/knowledge" },
      ],
    },
    {
      titleKey: "dashboard_nav.community",
      items: [
        { labelKey: "dashboard_nav.students", icon: Users, path: "/dashboard/students" },
        { labelKey: "dashboard_nav.peerReview", icon: UserCheck, path: "/dashboard/review" },
        { labelKey: "dashboard_nav.analytics", icon: BarChart3, path: "/dashboard/analytics" },
      ],
    },
    {
      titleKey: "dashboard.account",
      items: [
        { labelKey: "dashboard.profile", icon: GraduationCap, path: "/dashboard/profile" },
        { labelKey: "dashboard.settings", icon: Settings, path: "/dashboard/settings" },
      ],
    },
  ],
  writer: [
    {
      titleKey: "dashboard.overview",
      items: [
        { labelKey: "dashboard_nav.dashboard", icon: LayoutDashboard, path: "/dashboard" },
        { labelKey: "dashboard_nav.notifications", icon: Bell, path: "/dashboard/notifications", badge: "2" },
      ],
    },
    {
      titleKey: "dashboard_nav.content",
      items: [
        { labelKey: "dashboard_nav.articles", icon: FileText, path: "/dashboard/articles" },
        { labelKey: "dashboard_nav.drafts", icon: PenSquare, path: "/dashboard/drafts", badge: "4" },
        { labelKey: "dashboard_nav.submissions", icon: CheckSquare, path: "/dashboard/submissions" },
        { labelKey: "dashboard_nav.archive", icon: Archive, path: "/dashboard/archive" },
      ],
    },
    {
      titleKey: "dashboard_nav.insights",
      items: [
        { labelKey: "dashboard_nav.analytics", icon: TrendingUp, path: "/dashboard/analytics" },
        { labelKey: "dashboard_nav.readerStats", icon: BarChart3, path: "/dashboard/stats" },
      ],
    },
    {
      titleKey: "dashboard.account",
      items: [
        { labelKey: "dashboard.profile", icon: Users, path: "/dashboard/profile" },
        { labelKey: "dashboard.settings", icon: Settings, path: "/dashboard/settings" },
      ],
    },
  ],
  user: [
    {
      titleKey: "dashboard.overview",
      items: [
        { labelKey: "dashboard_nav.dashboard", icon: LayoutDashboard, path: "/dashboard" },
        { labelKey: "dashboard_nav.notifications", icon: Bell, path: "/dashboard/notifications" },
      ],
    },
    {
      titleKey: "dashboard_nav.learning",
      items: [
        { labelKey: "dashboard_nav.myProgress", icon: Target, path: "/dashboard/progress" },
        { labelKey: "dashboard_nav.bookmarks", icon: Bookmark, path: "/dashboard/bookmarks" },
        { labelKey: "dashboard_nav.history", icon: Clock, path: "/dashboard/history" },
        { labelKey: "dashboard_nav.courses", icon: BookOpen, path: "/dashboard/courses" },
      ],
    },
    {
      titleKey: "dashboard_nav.community",
      items: [
        { labelKey: "dashboard_nav.discussions", icon: MessageSquare, path: "/dashboard/discussions" },
        { labelKey: "dashboard_nav.achievements", icon: Star, path: "/dashboard/achievements" },
      ],
    },
    {
      titleKey: "dashboard.account",
      items: [
        { labelKey: "dashboard.profile", icon: Users, path: "/dashboard/profile" },
        { labelKey: "dashboard.settings", icon: Settings, path: "/dashboard/settings" },
      ],
    },
  ],
  admin: [
    {
      titleKey: "dashboard.overview",
      items: [
        { labelKey: "dashboard_nav.dashboard", icon: LayoutDashboard, path: "/dashboard" },
        { labelKey: "dashboard_nav.notifications", icon: Bell, path: "/dashboard/notifications", badge: "3" },
      ],
    },
    {
      titleKey: "dashboard_nav.userManagement",
      items: [
        { labelKey: "dashboard_nav.allUsers", icon: Users, path: "/dashboard/users" },
        { labelKey: "dashboard_nav.roleRequests", icon: UserCheck, path: "/dashboard/role-requests", badge: "3" },
        { labelKey: "dashboard_nav.scholarVerification", icon: ShieldCheck, path: "/dashboard/scholar-verification", badge: "3" },
      ],
    },
    {
      titleKey: "dashboard_nav.contentControl",
      items: [
        { labelKey: "dashboard_nav.debates", icon: MessageSquare, path: "/dashboard/debates" },
        { labelKey: "dashboard_nav.contentModeration", icon: Flag, path: "/dashboard/moderation", badge: "5" },
        { labelKey: "dashboard_nav.auditLog", icon: ScrollText, path: "/dashboard/audit-log" },
      ],
    },
    {
      titleKey: "dashboard_nav.insightsReports",
      items: [
        { labelKey: "dashboard_nav.analytics", icon: BarChart3, path: "/dashboard/analytics" },
        { labelKey: "dashboard_nav.reports", icon: FileBarChart2, path: "/dashboard/reports" },
      ],
    },
    {
      titleKey: "dashboard.account",
      items: [
        { labelKey: "dashboard.settings", icon: Settings, path: "/dashboard/settings" },
      ],
    },
  ],
};

// Fallback label map when translation key resolves to itself
const LABEL_FALLBACKS: Record<string, string> = {
  "dashboard_nav.dashboard": "Dashboard",
  "dashboard_nav.notifications": "Notifications",
  "dashboard_nav.fatwas": "My Fatwas",
  "dashboard_nav.debates": "Debates",
  "dashboard_nav.works": "Published Works",
  "dashboard_nav.knowledge": "Knowledge Base",
  "dashboard_nav.students": "Students",
  "dashboard_nav.peerReview": "Peer Review",
  "dashboard_nav.analytics": "Analytics",
  "dashboard_nav.articles": "My Articles",
  "dashboard_nav.drafts": "Drafts",
  "dashboard_nav.submissions": "Submissions",
  "dashboard_nav.archive": "Archive",
  "dashboard_nav.readerStats": "Reader Stats",
  "dashboard_nav.projects": "Projects",
  "dashboard_nav.citations": "Citations",
  "dashboard_nav.bibliography": "Bibliography",
  "dashboard_nav.annotations": "Annotations",
  "dashboard_nav.scholarAssist": "Scholar Assist",
  "dashboard_nav.sharedDocs": "Shared Docs",
  "dashboard_nav.tasks": "Tasks",
  "dashboard_nav.events": "Events",
  "dashboard_nav.myHours": "My Hours",
  "dashboard_nav.contributions": "Contributions",
  "dashboard_nav.leaderboard": "Leaderboard",
  "dashboard_nav.team": "Team",
  "dashboard_nav.myProgress": "My Progress",
  "dashboard_nav.bookmarks": "Bookmarks",
  "dashboard_nav.history": "History",
  "dashboard_nav.courses": "Courses",
  "dashboard_nav.discussions": "Discussions",
  "dashboard_nav.achievements": "Achievements",
  "dashboard_nav.scholarship": "Scholarship",
  "dashboard_nav.content": "Content",
  "dashboard_nav.insights": "Insights",
  "dashboard_nav.research": "Research",
  "dashboard_nav.collaboration": "Collaboration",
  "dashboard_nav.activities": "Activities",
  "dashboard_nav.learning": "Learning",
  "dashboard_nav.community": "Community",
  "dashboard_nav.userManagement": "User Management",
  "dashboard_nav.allUsers": "All Users",
  "dashboard_nav.roleRequests": "Role Requests",
  "dashboard_nav.scholarVerification": "Scholar Verification",
  "dashboard_nav.contentControl": "Content Control",
  "dashboard_nav.contentModeration": "Moderation",
  "dashboard_nav.auditLog": "Audit Log",
  "dashboard_nav.insightsReports": "Insights & Reports",
  "dashboard_nav.reports": "Reports",
  "dashboard.overview": "Overview",
  "dashboard.account": "Account",
  "dashboard.profile": "Profile",
  "dashboard.settings": "Settings",
  "dashboard.signOut": "Sign Out",
};

const ROLE_COLORS: Record<UserRole, string> = {
  scholar: "bg-primary text-primary-foreground",
  writer: "bg-secondary text-secondary-foreground",
  user: "bg-primary/80 text-primary-foreground",
  admin: "bg-destructive text-destructive-foreground",
};

const ROLE_LABELS: Record<UserRole, { en: string; bn: string }> = {
  scholar: { en: "Scholar", bn: "আলেম" },
  writer: { en: "Writer", bn: "লেখক" },
  user: { en: "Learner", bn: "শিক্ষার্থী" },
  admin: { en: "Admin", bn: "অ্যাডমিন" },
};

interface DashboardSidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export default function DashboardSidebar({ collapsed, onToggle }: DashboardSidebarProps) {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const { t, i18n } = useTranslation();

  if (!user) return null;

  const groups = NAV_BY_ROLE[user.role];
  const isActive = (path: string) => pathname === path;
  const lang = i18n.language;

  // Safe translate: tries dashboard.dashboard_nav.X first, then dashboard.X, then LABEL_FALLBACKS
  const tSafe = (key: string) => {
    // For dashboard_nav.* keys, try the nested path first
    if (key.startsWith("dashboard_nav.")) {
      const subKey = key.replace("dashboard_nav.", "");
      const nested = t(`dashboard.dashboard_nav.${subKey}`);
      if (nested !== `dashboard.dashboard_nav.${subKey}`) return nested;
    }
    // For dashboard.* keys try direct
    if (key.startsWith("dashboard.")) {
      const direct = t(key);
      if (direct !== key) return direct;
    }
    // Fallback to English label map
    return LABEL_FALLBACKS[key] ?? key;
  };

  const handleLogout = () => {
    logout();
    router.push("/auth/login");
  };

  return (
    <motion.aside
      animate={{ width: collapsed ? 72 : 260 }}
      transition={{ duration: 0.25, ease: "easeInOut" }}
      className="flex flex-col h-full bg-sidebar border-r border-sidebar-border overflow-hidden flex-shrink-0"
    >
      {/* Logo + toggle */}
      <div className="flex items-center justify-between px-4 py-5 border-b border-sidebar-border h-[70px]">
        {!collapsed && (
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center flex-shrink-0">
              <GraduationCap className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-display font-bold text-foreground text-sm whitespace-nowrap">Ummah Thoughts</span>
          </div>
        )}
        {collapsed && (
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center mx-auto">
            <GraduationCap className="h-4 w-4 text-primary-foreground" />
          </div>
        )}
        {!collapsed && (
          <button onClick={onToggle}
            className="w-7 h-7 rounded-lg hover:bg-sidebar-accent flex items-center justify-center transition-colors flex-shrink-0">
            <ChevronLeft className="h-4 w-4 text-muted-foreground" />
          </button>
        )}
      </div>



      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-5">
        {groups.map(group => (
          <div key={group.titleKey}>
            {!collapsed && (
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground px-2 mb-1.5">
                {tSafe(group.titleKey)}
              </p>
            )}
            <ul className="space-y-0.5">
              {group.items.map(item => {
                const active = isActive(item.path);
                return (
                  <li key={item.path}>
                    <button
                      onClick={() => router.push(item.path)}
                      title={collapsed ? (LABEL_FALLBACKS[item.labelKey] ?? item.labelKey) : undefined}
                      className={cn(
                        "w-full flex items-center gap-3 px-2.5 py-2 rounded-xl text-sm font-medium transition-all group relative",
                        active
                          ? "bg-sidebar-accent text-sidebar-accent-foreground"
                          : "text-muted-foreground hover:bg-sidebar-accent/60 hover:text-foreground",
                        collapsed && "justify-center px-0"
                      )}
                    >
                      <item.icon className={cn("h-4 w-4 flex-shrink-0", active ? "text-primary" : "")} />
                      {!collapsed && <span className="flex-1 text-left truncate">{tSafe(item.labelKey)}</span>}
                      {!collapsed && item.badge && (
                        <span className={cn(
                          "text-[10px] font-bold px-1.5 py-0.5 rounded-full",
                          item.badge === "Live" ? "bg-destructive text-destructive-foreground" : "bg-primary/15 text-primary"
                        )}>
                          {item.badge}
                        </span>
                      )}
                      {collapsed && item.badge && (
                        <span className="absolute top-0.5 right-0.5 w-2 h-2 bg-primary rounded-full" />
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* Collapse toggle (when collapsed) + logout */}
      {/* Footer Section - User Profile & Actions */}
      <div className="mt-auto border-t border-sidebar-border bg-sidebar/50">
        {/* User Profile Card - Collapsed State */}
        {collapsed ? (
          <div className="relative group px-2 py-4">
            {/* Profile Avatar with Status */}
            <div className="relative flex justify-center">
              <div className={cn(
                "relative w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold transition-all duration-300",
                "bg-gradient-to-br from-primary/20 to-primary/5",
                "border border-primary/20 group-hover:border-primary/40",
                "shadow-sm group-hover:shadow-md"
              )}>
                <span className="text-primary font-bold text-base">{user.avatar}</span>

                {/* Online Status Indicator */}
                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-sidebar animate-pulse" />
              </div>

              {/* Role Indicator Dot */}
              <div className={cn(
                "absolute -top-1 -right-1 w-3 h-3 rounded-full border-2 border-sidebar",
                user.role === 'admin' ? 'bg-destructive' :
                  user.role === 'scholar' ? 'bg-primary' :
                    user.role === 'writer' ? 'bg-secondary' : 'bg-blue-500'
              )} />
            </div>

            {/* Tooltip on Hover */}
            <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50">
              <div className="bg-popover text-popover-foreground text-xs font-medium px-2.5 py-1.5 rounded-lg shadow-lg border border-border whitespace-nowrap">
                {user.name}
              </div>
            </div>
          </div>
        ) : (
          /* User Profile Card - Expanded State */
          <div className="relative group px-4 py-2 bg-gradient-to-br from-sidebar-accent/5 to-transparent">
            <div className="flex items-center gap-4">
              {/* Avatar with animated ring */}
              <div className="relative">
                <div className={cn(
                  "relative w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold transition-all duration-300",
                  "bg-gradient-to-br from-primary/20 via-primary/10 to-secondary/10",
                  "border-2 border-primary/20 group-hover:border-primary/30",
                  "shadow-md group-hover:shadow-lg",
                  "transform group-hover:scale-105 group-hover:-rotate-2 transition-all duration-300"
                )}>
                  <span className={cn(
                    "font-bold",
                    user.role === 'admin' ? 'text-destructive' :
                      user.role === 'scholar' ? 'text-primary' :
                        user.role === 'writer' ? 'text-secondary' : 'text-blue-500'
                  )}>
                    {user.avatar}
                  </span>

                  {/* Decorative corner accent */}
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-primary/30 rounded-full blur-sm" />
                </div>

                {/* Status Ring */}
                <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-[3px] border-sidebar animate-pulse shadow-lg" />
              </div>

              {/* User Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <p className="text-sm font-semibold text-foreground truncate group-hover:text-primary transition-colors">
                    {user.name}
                  </p>

                  {/* Verified Badge for Scholars/Admins */}
                  {(user.role === 'scholar' || user.role === 'admin') && (
                    <svg className="w-3.5 h-3.5 text-primary fill-current" viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                    </svg>
                  )}
                </div>

                {/* Role Badge */}
                <div className="flex items-center gap-1.5">
                  <span className={cn(
                    "inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider",
                    "border shadow-sm",
                    user.role === 'admin' && "bg-destructive/10 text-destructive border-destructive/20",
                    user.role === 'scholar' && "bg-primary/10 text-primary border-primary/20",
                    user.role === 'writer' && "bg-secondary/10 text-secondary border-secondary/20",
                    user.role === 'user' && "bg-blue-500/10 text-blue-500 border-blue-500/20"
                  )}>
                    {/* Role Icon */}
                    {user.role === 'admin' && <Shield className="w-2.5 h-2.5 mr-1" />}
                    {user.role === 'scholar' && <GraduationCap className="w-2.5 h-2.5 mr-1" />}
                    {user.role === 'writer' && <PenSquare className="w-2.5 h-2.5 mr-1" />}
                    {user.role === 'user' && <User className="w-2.5 h-2.5 mr-1" />}

                    {lang === "bn" ? ROLE_LABELS[user.role].bn : ROLE_LABELS[user.role].en}
                  </span>

                  {/* Email indicator */}
                  <span className="text-[8px] text-muted-foreground truncate max-w-[80px] opacity-60">
                    {user.email}
                  </span>
                </div>
              </div>

              {/* Quick Actions Menu (dots) */}
              <button className="opacity-0 group-hover:opacity-100 transition-opacity">
                <MoreVertical className="w-4 h-4 text-muted-foreground hover:text-foreground" />
              </button>
            </div>
          </div>
        )}

        {/* Action Buttons max-w-11/12 */}
        <div className="p-1">
          {/* Collapse Toggle Button - Only in collapsed mode */}
          {collapsed && (
            <button
              onClick={onToggle}
              className={cn(
                "w-full flex items-center justify-center rounded-xl",
                "text-muted-foreground hover:text-foreground",
                "bg-sidebar-accent/30 hover:bg-sidebar-accent",
                "border border-sidebar-border hover:border-sidebar-ring",
                "transition-all duration-200 group"
              )}
              title="Expand sidebar"
            >
              <ChevronLeft className="h-4 w-4 rotate-180 transition-transform group-hover:scale-110" />
            </button>
          )}

          <div className="flex gap-5">
            {/* Settings Button */}
            <button
              onClick={() => router.push('/dashboard/settings')}
              className={cn(
                "w-full flex items-center gap-3 px-2.5 rounded-xl",
                "text-muted-foreground hover:text-foreground",
                "bg-sidebar-accent/30 hover:bg-sidebar-accent",
                "border border-sidebar-border hover:border-sidebar-ring",
                "transition-all duration-200 group",
                collapsed && "justify-center px-0"
              )}
              title={collapsed ? "Settings" : undefined}>
              <Settings className={cn(
                "h-4 w-4 flex-shrink-0 transition-transform group-hover:rotate-90",
                collapsed ? "mx-auto" : ""
              )} />
              {!collapsed && (
                <span className="flex-1 text-left text-sm font-medium">Settings</span>
              )}
            </button>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className={cn(
                "w-full flex items-center gap-3 px-2.5 py-2.5 rounded-xl",
                "text-muted-foreground hover:text-destructive",
                "bg-sidebar-accent/30 hover:bg-destructive/10",
                "border border-sidebar-border hover:border-destructive/30",
                "transition-all duration-200 group",
                collapsed && "justify-center px-0"
              )}
              title={collapsed ? "Sign out" : undefined}
            >
              <LogOut className={cn(
                "h-4 w-4 flex-shrink-0 transition-transform group-hover:translate-x-1 group-hover:-translate-y-0.5",
                collapsed ? "mx-auto" : ""
              )} />
              {!collapsed && (
                <span className="flex-1 text-left text-sm font-medium">Sign out</span>
              )}
            </button>
          </div>
        </div>
      </div>
    </motion.aside>
  );
}