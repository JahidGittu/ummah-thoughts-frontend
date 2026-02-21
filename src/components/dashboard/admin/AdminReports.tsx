import { Download, FileText, BarChart3, Users, Calendar, TrendingUp } from "lucide-react";
import { useTranslation } from "react-i18next";

const REPORTS = [
  { id: "r1", title: "Monthly User Growth Report", desc: "New registrations, active users, churn rate breakdown by month", icon: Users, color: "text-primary", bg: "bg-primary/10", size: "248 KB", generated: "Feb 19, 2026" },
  { id: "r2", title: "Content Performance Summary", desc: "Top articles, topics, and engagement metrics across all content", icon: FileText, color: "text-secondary-foreground", bg: "bg-secondary/20", size: "312 KB", generated: "Feb 19, 2026" },
  { id: "r3", title: "Debate & Live Session Analytics", desc: "Session attendance, scholar participation, viewer drop-off analysis", icon: BarChart3, color: "text-purple-600", bg: "bg-purple-100", size: "187 KB", generated: "Feb 18, 2026" },
  { id: "r4", title: "Role Upgrade Request History", desc: "All role upgrade applications with approval/rejection rates", icon: TrendingUp, color: "text-amber-600", bg: "bg-amber-100", size: "94 KB", generated: "Feb 18, 2026" },
  { id: "r5", title: "Scholar Verification Log", desc: "All scholar verification requests and their outcomes", icon: Calendar, color: "text-emerald-600", bg: "bg-emerald-100", size: "128 KB", generated: "Feb 17, 2026" },
  { id: "r6", title: "Moderation & Flagging Report", desc: "Flagged content statistics, resolution times, and outcomes", icon: FileText, color: "text-destructive", bg: "bg-destructive/10", size: "156 KB", generated: "Feb 17, 2026" },
];

export default function AdminReports() {
  const { t } = useTranslation();

  const QUICK_STATS = [
    { labelKey: "reportsGenerated", value: "142", sub: t("subpages.allTime") },
    { labelKey: "lastGenerated", value: "Today", sub: "Feb 19, 2026" },
    { labelKey: "totalExported", value: "18.4 MB", sub: t("subpages.allTime") },
  ];

  return (
    <div className="space-y-6">
      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-4">
        {QUICK_STATS.map(s => (
          <div key={s.labelKey} className="bg-card border border-border rounded-2xl p-4 text-center">
            <p className="text-xl font-bold text-foreground">{s.value}</p>
            <p className="text-xs font-medium text-muted-foreground">{t(`admin.${s.labelKey}`)}</p>
            <p className="text-[10px] text-muted-foreground/70 mt-0.5">{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Generate New Report */}
      <div className="bg-primary/5 border border-primary/20 rounded-2xl p-5">
        <h3 className="font-semibold text-foreground mb-3">{t("admin.generateCustom")}</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <select className="h-10 px-3 rounded-xl border border-border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-primary/30">
            <option>{t("admin.reportType")}</option>
            <option>{t("admin.userAnalytics")}</option>
            <option>{t("admin.contentReport")}</option>
            <option>{t("admin.moderationReport")}</option>
          </select>
          <select className="h-10 px-3 rounded-xl border border-border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-primary/30">
            <option>{t("admin.dateRange")}</option>
            <option>{t("admin.last7Days")}</option>
            <option>{t("admin.last30Days")}</option>
            <option>{t("admin.last3Months")}</option>
            <option>{t("admin.customRange")}</option>
          </select>
          <button className="h-10 px-4 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors flex items-center justify-center gap-2">
            <BarChart3 className="h-4 w-4" /> {t("admin.generate")}
          </button>
        </div>
      </div>

      {/* Reports List */}
      <div>
        <h3 className="font-semibold text-foreground mb-3">{t("admin.preGeneratedReports")}</h3>
        <div className="space-y-3">
          {REPORTS.map(report => (
            <div key={report.id} className="bg-card border border-border rounded-2xl p-4 flex items-center gap-4 hover:border-primary/30 transition-colors">
              <div className={`w-10 h-10 rounded-xl ${report.bg} flex items-center justify-center flex-shrink-0`}>
                <report.icon className={`h-5 w-5 ${report.color}`} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-foreground text-sm">{report.title}</p>
                <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{report.desc}</p>
                <p className="text-[10px] text-muted-foreground/70 mt-1">{t("admin.generated")}: {report.generated} · {report.size}</p>
              </div>
              <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-primary/10 text-primary text-xs font-semibold hover:bg-primary/20 transition-colors flex-shrink-0">
                <Download className="h-3.5 w-3.5" /> {t("admin.export")}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
