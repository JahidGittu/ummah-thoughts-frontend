import { useState } from "react";
import { Bell, UserCheck, Flag, CheckCircle, Info, Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";

const ALL_NOTIFS = [
  { id: 1, type: "flag", titleKey: "contentFlagged", msg: "Comment #9921 has been flagged by 12 users for misattributed hadith.", time: "5m ago", read: false },
  { id: 2, type: "role_req", titleKey: "roleUpgradeRequest", msg: "Hamza Al-Farsi has requested an upgrade from Learner → Writer.", time: "22m ago", read: false },
  { id: 3, type: "verify", titleKey: "scholarApplication", msg: "Dr. Amal Farouk submitted a scholar verification application.", time: "1h ago", read: false },
  { id: 4, type: "info", titleKey: "weeklyReport", msg: "The February Week 3 analytics report is ready to download.", time: "3h ago", read: true },
  { id: 5, type: "success", titleKey: "userSuspended", msg: "User yusuf@example.com was successfully suspended.", time: "5h ago", read: true },
  { id: 6, type: "flag", titleKey: "articleFlagged", msg: "Article 'Controversial View on Riba' now has 7 community flags.", time: "1d ago", read: true },
  { id: 7, type: "role_req", titleKey: "roleUpgradeRequest", msg: "Nadia Benali requests upgrade from Learner → Researcher.", time: "2d ago", read: true },
];

const NOTIF_TITLES: Record<string, string> = {
  contentFlagged: "Content Flagged",
  roleUpgradeRequest: "Role Upgrade Request",
  scholarApplication: "Scholar Application",
  weeklyReport: "Weekly Report Ready",
  userSuspended: "User Suspended",
  articleFlagged: "Article Flagged",
};

const NOTIF_TITLES_BN: Record<string, string> = {
  contentFlagged: "কন্টেন্ট ফ্ল্যাগ করা হয়েছে",
  roleUpgradeRequest: "ভূমিকা আপগ্রেড অনুরোধ",
  scholarApplication: "আলেম আবেদন",
  weeklyReport: "সাপ্তাহিক প্রতিবেদন প্রস্তুত",
  userSuspended: "ব্যবহারকারী স্থগিত",
  articleFlagged: "নিবন্ধ ফ্ল্যাগ করা হয়েছে",
};

const TYPE_META: Record<string, { icon: React.ElementType; color: string; bg: string }> = {
  flag: { icon: Flag, color: "text-destructive", bg: "bg-destructive/10" },
  role_req: { icon: UserCheck, color: "text-amber-600", bg: "bg-amber-500/10" },
  verify: { icon: CheckCircle, color: "text-primary", bg: "bg-primary/10" },
  info: { icon: Info, color: "text-muted-foreground", bg: "bg-muted" },
  success: { icon: CheckCircle, color: "text-emerald-600", bg: "bg-emerald-500/10" },
};

export default function AdminNotifications() {
  const { t, i18n } = useTranslation();
  const [notifs, setNotifs] = useState(ALL_NOTIFS);

  const markAll = () => setNotifs(prev => prev.map(n => ({ ...n, read: true })));
  const remove = (id: number) => setNotifs(prev => prev.filter(n => n.id !== id));
  const unread = notifs.filter(n => !n.read).length;

  const getTitle = (titleKey: string) =>
    i18n.language === "bn" ? NOTIF_TITLES_BN[titleKey] ?? NOTIF_TITLES[titleKey] : NOTIF_TITLES[titleKey];

  return (
    <div className="space-y-5 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bell className="h-5 w-5 text-primary" />
          {unread > 0 && (
            <span className="bg-primary text-primary-foreground text-xs font-bold px-2 py-0.5 rounded-full">{unread} {t("admin.unread")}</span>
          )}
        </div>
        <button onClick={markAll} className="text-xs font-semibold text-primary hover:underline">{t("admin.markAllRead")}</button>
      </div>

      <div className="space-y-2">
        {notifs.map(n => {
          const meta = TYPE_META[n.type] ?? TYPE_META.info;
          const Icon = meta.icon;
          return (
            <div key={n.id} className={`flex items-start gap-3 p-4 rounded-2xl border transition-colors ${
              !n.read ? "bg-primary/5 border-primary/20" : "bg-card border-border"
            }`}>
              <div className={`w-9 h-9 rounded-xl ${meta.bg} flex items-center justify-center flex-shrink-0`}>
                <Icon className={`h-4 w-4 ${meta.color}`} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <p className={`text-sm font-semibold ${!n.read ? "text-foreground" : "text-muted-foreground"}`}>{getTitle(n.titleKey)}</p>
                  <button onClick={() => remove(n.id)} className="text-muted-foreground hover:text-destructive transition-colors flex-shrink-0">
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">{n.msg}</p>
                <p className="text-[10px] text-muted-foreground/70 mt-1">{n.time}</p>
              </div>
              {!n.read && <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0 mt-1.5" />}
            </div>
          );
        })}
      </div>
    </div>
  );
}
