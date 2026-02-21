import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useAuth, UserRole } from "@/contexts/AuthContext";
import {
  LayoutDashboard, BookOpen, MessageSquare, Users, FileText, BarChart3,
  Settings, LogOut, Star, Bookmark, Clock, PenSquare,
  Trophy, Bell, ChevronLeft, GraduationCap, Library, Scale, Scroll,
  CheckSquare, Calendar, Target, TrendingUp, UserCheck, Globe, Archive,
  ShieldAlert, Flag, ShieldCheck, ClipboardList, FileBarChart2, ScrollText,
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
  const location = useLocation();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  if (!user) return null;

  const groups = NAV_BY_ROLE[user.role];
  const isActive = (path: string) => location.pathname === path;
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
    navigate("/login");
  };

  return (
    <motion.aside
      animate={{ width: collapsed ? 72 : 260 }}
      transition={{ duration: 0.25, ease: "easeInOut" }}
      className="flex flex-col h-full bg-sidebar border-r border-sidebar-border overflow-hidden flex-shrink-0"
    >
      {/* Logo + toggle */}
      <div className="flex items-center justify-between px-4 py-5 border-b border-sidebar-border min-h-[68px]">
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

      {/* User card */}
      {!collapsed ? (
        <div className="px-4 py-4 border-b border-sidebar-border">
          <div className="flex items-center gap-3">
            <div className={cn("w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold flex-shrink-0", ROLE_COLORS[user.role])}>
              {user.avatar}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-foreground truncate">{user.name}</p>
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                {lang === "bn" ? ROLE_LABELS[user.role].bn : ROLE_LABELS[user.role].en}
              </span>
            </div>
          </div>
        </div>
      ) : (
        <div className="px-3 py-4 border-b border-sidebar-border flex justify-center">
          <div className={cn("w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold", ROLE_COLORS[user.role])}>
            {user.avatar}
          </div>
        </div>
      )}

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
                      onClick={() => navigate(item.path)}
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
      <div className="px-3 py-3 border-t border-sidebar-border space-y-1">
        {collapsed && (
          <button onClick={onToggle}
            className="w-full flex justify-center py-2 rounded-xl hover:bg-sidebar-accent text-muted-foreground hover:text-foreground transition-colors">
            <ChevronLeft className="h-4 w-4 rotate-180" />
          </button>
        )}
        <button onClick={handleLogout}
          className={cn(
            "w-full flex items-center gap-3 px-2.5 py-2 rounded-xl text-sm font-medium text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-all",
            collapsed && "justify-center px-0"
          )}>
          <LogOut className="h-4 w-4 flex-shrink-0" />
          {!collapsed && <span>{tSafe("dashboard.signOut")}</span>}
        </button>
      </div>
    </motion.aside>
  );
}
