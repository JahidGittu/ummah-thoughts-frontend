import { useAuth, UserRole } from "@/contexts/AuthContext";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Navigate, useLocation } from "react-router-dom";
import { AdminActivityProvider } from "@/contexts/AdminActivityContext";

// Role home pages
import ScholarDashboardHome from "@/components/dashboard/roles/ScholarDashboardHome";
import WriterDashboardHome from "@/components/dashboard/roles/WriterDashboardHome";
import UserDashboardHome from "@/components/dashboard/roles/UserDashboardHome";
import AdminDashboardHome from "@/components/dashboard/roles/AdminDashboardHome";

// Admin pages
import AdminUserManagement from "@/components/dashboard/admin/AdminUserManagement";
import AdminRoleRequests from "@/components/dashboard/admin/AdminRoleRequests";
import AdminScholarVerification from "@/components/dashboard/admin/AdminScholarVerification";
import AdminContentModeration from "@/components/dashboard/admin/AdminContentModeration";
import AdminAuditLog from "@/components/dashboard/admin/AdminAuditLog";
import AdminAnalytics from "@/components/dashboard/admin/AdminAnalytics";
import AdminReports from "@/components/dashboard/admin/AdminReports";
import AdminNotifications from "@/components/dashboard/admin/AdminNotifications";
import AdminSystemSettings from "@/components/dashboard/admin/AdminSystemSettings";

// Scholar pages
import ScholarNotifications from "@/components/dashboard/scholar/ScholarNotifications";
import ScholarFatwas from "@/components/dashboard/scholar/ScholarFatwas";
import ScholarDebates from "@/components/dashboard/scholar/ScholarDebates";
import ScholarWorks from "@/components/dashboard/scholar/ScholarWorks";
import ScholarKnowledge from "@/components/dashboard/scholar/ScholarKnowledge";
import ScholarStudents from "@/components/dashboard/scholar/ScholarStudents";
import ScholarPeerReview from "@/components/dashboard/scholar/ScholarPeerReview";
import ScholarAnalytics from "@/components/dashboard/scholar/ScholarAnalytics";
import ScholarProfile from "@/components/dashboard/scholar/ScholarProfile";
import ScholarSettings from "@/components/dashboard/scholar/ScholarSettings";

// Writer pages
import WriterNotifications from "@/components/dashboard/writer/WriterNotifications";
import WriterArticles from "@/components/dashboard/writer/WriterArticles";
import WriterDrafts from "@/components/dashboard/writer/WriterDrafts";
import WriterSubmissions from "@/components/dashboard/writer/WriterSubmissions";
import WriterArchive from "@/components/dashboard/writer/WriterArchive";
import WriterAnalytics from "@/components/dashboard/writer/WriterAnalytics";
import WriterStats from "@/components/dashboard/writer/WriterStats";
import WriterProfile from "@/components/dashboard/writer/WriterProfile";
import WriterSettings from "@/components/dashboard/writer/WriterSettings";


// User pages

// User pages
import UserNotifications from "@/components/dashboard/user/UserNotifications";
import UserProgress from "@/components/dashboard/user/UserProgress";
import UserBookmarks from "@/components/dashboard/user/UserBookmarks";
import UserHistory from "@/components/dashboard/user/UserHistory";
import UserCourses from "@/components/dashboard/user/UserCourses";
import UserDiscussions from "@/components/dashboard/user/UserDiscussions";
import UserAchievements from "@/components/dashboard/user/UserAchievements";
import UserProfile from "@/components/dashboard/user/UserProfile";
import UserSettings from "@/components/dashboard/user/UserSettings";

interface PageMeta { title: string; subtitle: string }

type PageRegistry = Record<string, { component: React.ComponentType; meta: PageMeta }>;

const SCHOLAR_PAGES: PageRegistry = {
  "/dashboard":               { component: ScholarDashboardHome, meta: { title: "Scholar Dashboard", subtitle: "Manage your fatwas, debates, and scholarly activities" } },
  "/dashboard/notifications": { component: ScholarNotifications, meta: { title: "Notifications", subtitle: "Stay up to date with your activity" } },
  "/dashboard/fatwas":        { component: ScholarFatwas,        meta: { title: "My Fatwas", subtitle: "Manage and track your issued fatwas" } },
  "/dashboard/debates":       { component: ScholarDebates,       meta: { title: "Debates", subtitle: "Moderate and participate in scholarly debates" } },
  "/dashboard/works":         { component: ScholarWorks,         meta: { title: "Published Works", subtitle: "Books, papers, and articles you have published" } },
  "/dashboard/knowledge":     { component: ScholarKnowledge,     meta: { title: "Knowledge Base", subtitle: "Your curated Islamic reference entries" } },
  "/dashboard/students":      { component: ScholarStudents,      meta: { title: "Students", subtitle: "View and manage your enrolled students" } },
  "/dashboard/review":        { component: ScholarPeerReview,    meta: { title: "Peer Review", subtitle: "Review papers and articles submitted by scholars" } },
  "/dashboard/analytics":     { component: ScholarAnalytics,     meta: { title: "Analytics", subtitle: "Track the performance of your content" } },
  "/dashboard/profile":       { component: ScholarProfile,       meta: { title: "My Profile", subtitle: "View and edit your scholar profile" } },
  "/dashboard/settings":      { component: ScholarSettings,      meta: { title: "Settings", subtitle: "Manage your account preferences" } },
};

const WRITER_PAGES: PageRegistry = {
  "/dashboard":               { component: WriterDashboardHome,  meta: { title: "Writer Dashboard", subtitle: "Create, manage, and track your content" } },
  "/dashboard/notifications": { component: WriterNotifications,  meta: { title: "Notifications", subtitle: "Stay up to date with your activity" } },
  "/dashboard/articles":      { component: WriterArticles,       meta: { title: "My Articles", subtitle: "Manage all your published and draft articles" } },
  "/dashboard/drafts":        { component: WriterDrafts,         meta: { title: "Drafts", subtitle: "Continue working on your unpublished content" } },
  "/dashboard/submissions":   { component: WriterSubmissions,    meta: { title: "Submissions", subtitle: "Track the status of your editorial submissions" } },
  "/dashboard/archive":       { component: WriterArchive,        meta: { title: "Archive", subtitle: "Browse your archived articles" } },
  "/dashboard/analytics":     { component: WriterAnalytics,      meta: { title: "Analytics", subtitle: "Track your content performance" } },
  "/dashboard/stats":         { component: WriterStats,          meta: { title: "Reader Stats", subtitle: "Understand your readership and engagement" } },
  "/dashboard/profile":       { component: WriterProfile,        meta: { title: "My Profile", subtitle: "View and edit your writer profile" } },
  "/dashboard/settings":      { component: WriterSettings,       meta: { title: "Settings", subtitle: "Manage your account preferences" } },
};


const USER_PAGES: PageRegistry = {
  "/dashboard":               { component: UserDashboardHome,  meta: { title: "My Learning", subtitle: "Track your progress and continue your journey" } },
  "/dashboard/notifications": { component: UserNotifications,  meta: { title: "Notifications", subtitle: "Stay up to date with your learning activity" } },
  "/dashboard/progress":      { component: UserProgress,       meta: { title: "My Progress", subtitle: "Track your learning journey and streaks" } },
  "/dashboard/bookmarks":     { component: UserBookmarks,      meta: { title: "Bookmarks", subtitle: "Articles and topics saved for later reading" } },
  "/dashboard/history":       { component: UserHistory,        meta: { title: "History", subtitle: "Your recently viewed content" } },
  "/dashboard/courses":       { component: UserCourses,        meta: { title: "Courses", subtitle: "Your enrolled and available learning courses" } },
  "/dashboard/discussions":   { component: UserDiscussions,    meta: { title: "Discussions", subtitle: "Your questions and community conversations" } },
  "/dashboard/achievements":  { component: UserAchievements,   meta: { title: "Achievements", subtitle: "Your badges, XP, and milestones" } },
  "/dashboard/profile":       { component: UserProfile,        meta: { title: "My Profile", subtitle: "View and edit your learner profile" } },
  "/dashboard/settings":      { component: UserSettings,       meta: { title: "Settings", subtitle: "Manage your account preferences" } },
};

const ADMIN_PAGES: PageRegistry = {
  "/dashboard":                       { component: AdminDashboardHome,      meta: { title: "Admin Control Panel", subtitle: "Full oversight of all platform activity" } },
  "/dashboard/notifications":         { component: AdminNotifications,      meta: { title: "Notifications", subtitle: "System alerts and admin activity updates" } },
  "/dashboard/users":                 { component: AdminUserManagement,     meta: { title: "User Management", subtitle: "View, manage, and control all registered users" } },
  "/dashboard/role-requests":         { component: AdminRoleRequests,       meta: { title: "Role Upgrade Requests", subtitle: "Review and approve user role upgrade applications" } },
  "/dashboard/scholar-verification":  { component: AdminScholarVerification,meta: { title: "Scholar Verification", subtitle: "Verify credentials of scholar applicants" } },
  "/dashboard/moderation":            { component: AdminContentModeration,  meta: { title: "Content Moderation", subtitle: "Review flagged content and community reports" } },
  "/dashboard/audit-log":             { component: AdminAuditLog,           meta: { title: "Audit Log", subtitle: "Complete tamper-evident record of admin actions" } },
  "/dashboard/analytics":             { component: AdminAnalytics,          meta: { title: "Platform Analytics", subtitle: "Traffic, engagement, and growth insights" } },
  "/dashboard/reports":               { component: AdminReports,            meta: { title: "Reports", subtitle: "Generate and export platform reports" } },
  "/dashboard/settings":              { component: AdminSystemSettings,     meta: { title: "System Settings", subtitle: "Configure platform-wide settings and policies" } },
};

const PAGES_BY_ROLE: Record<UserRole, PageRegistry> = {
  scholar:    SCHOLAR_PAGES,
  writer:     WRITER_PAGES,
  user:       USER_PAGES,
  admin:      ADMIN_PAGES,
};

// Admin-only paths that non-admins must never reach
const ADMIN_ONLY_PATHS = new Set([
  "/dashboard/users",
  "/dashboard/role-requests",
  "/dashboard/scholar-verification",
  "/dashboard/moderation",
  "/dashboard/audit-log",
  "/dashboard/reports",
]);

export default function Dashboard() {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-primary/30 border-t-primary animate-spin" />
      </div>
    );
  }

  // Not logged in → login page
  if (!user) return <Navigate to="/login" replace />;

  // Non-admin trying to access an admin-only path → kick to their own dashboard
  if (user.role !== "admin" && ADMIN_ONLY_PATHS.has(location.pathname)) {
    return <Navigate to="/dashboard" replace />;
  }

  // Admin trying to access a non-admin sub-page that doesn't exist in ADMIN_PAGES
  // (e.g. /dashboard/fatwas) → kick to admin dashboard home
  if (user.role === "admin" && location.pathname !== "/dashboard" && !ADMIN_PAGES[location.pathname]) {
    return <Navigate to="/dashboard" replace />;
  }

  const registry = PAGES_BY_ROLE[user.role];
  const page = registry[location.pathname];
  const defaultPage = registry["/dashboard"];
  const PageComponent = page?.component ?? defaultPage.component;
  const meta = page?.meta ?? defaultPage.meta;

  const content = (
    <DashboardLayout title={meta.title} subtitle={meta.subtitle}>
      <PageComponent />
    </DashboardLayout>
  );

  if (user.role === "admin") {
    return <AdminActivityProvider>{content}</AdminActivityProvider>;
  }

  return content;
}
