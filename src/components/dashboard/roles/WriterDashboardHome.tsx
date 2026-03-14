import Link from "next/link";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { useTranslation } from "react-i18next";
import { FileText, Eye, Heart, PenSquare, Clock } from "lucide-react";

export default function WriterDashboardHome() {
  const { user } = useAuth();
  const { t } = useTranslation();

  const stats = [
    { label: t("dashboard.published", { defaultValue: "Published" }), value: "31", icon: FileText, trend: "+2 " + t("dashboard.thisMonth", { defaultValue: "this month" }), color: "text-primary bg-primary/10" },
    { label: t("dashboard.totalViews", { defaultValue: "Total Views" }), value: "84K", icon: Eye, trend: "+12% " + t("dashboard.vsLastMonth", { defaultValue: "vs last month" }), color: "text-blue-500 bg-blue-500/10" },
    { label: t("dashboard.likes", { defaultValue: "Likes" }), value: "6.2K", icon: Heart, trend: "+340 " + t("dashboard.thisWeek", { defaultValue: "this week" }), color: "text-rose-500 bg-rose-500/10" },
    { label: t("dashboard.dashboard_nav.drafts"), value: "4", icon: PenSquare, trend: t("dashboard.inProgress", { defaultValue: "In progress" }), color: "text-secondary bg-secondary/10" },
  ];

  const articles = [
    { title: "The Role of Ijtihad in Contemporary Law", status: "published", date: "3 " + t("dashboard.daysAgo", { defaultValue: "days ago" }), views: "4.2K" },
    { title: "Women Scholars in Classical Islam", status: "published", date: "1 " + t("dashboard.weekAgo", { defaultValue: "week ago" }), views: "8.7K" },
    { title: "Digital Caliphate: A Critical Analysis", status: "draft", date: t("dashboard.editing", { defaultValue: "Editing" }), views: "–" },
    { title: "Maqasid and Human Rights", status: "review", date: t("dashboard.underReview", { defaultValue: "Under review" }), views: "–" },
  ];

  return (
    <div className="space-y-8">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-secondary/10 via-secondary/5 to-transparent border border-secondary/20 rounded-3xl p-6">
          <p className="text-sm text-muted-foreground mb-1">{t("dashboard.welcomeBack")}</p>
          <h2 className="font-display text-2xl font-bold text-foreground">{user?.name}</h2>
          <p className="text-muted-foreground text-sm mt-1">{user?.specialization || t("dashboard.writer", { defaultValue: "Writer" })} · {t("dashboard.contentCreator", { defaultValue: "Content Creator" })}</p>
          <Link
            href="/dashboard/newarticle"
            className="mt-4 inline-flex items-center gap-2 bg-secondary text-secondary-foreground text-sm font-semibold px-4 py-2 rounded-xl hover:opacity-90 transition-opacity">
            <PenSquare className="h-4 w-4" /> {t("dashboard.newArticle")}
          </Link>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((s, i) => (
            <motion.div key={s.label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
              className="bg-card border border-border rounded-2xl p-5 hover:shadow-md transition-shadow">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${s.color}`}>
                <s.icon className="h-5 w-5" />
              </div>
              <p className="text-2xl font-bold text-foreground">{s.value}</p>
              <p className="text-sm text-foreground font-medium">{s.label}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{s.trend}</p>
            </motion.div>
          ))}
        </div>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="bg-card border border-border rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-foreground">{t("dashboard.myArticles")}</h3>
            <button className="text-xs text-primary hover:underline">{t("dashboard.viewAll")}</button>
          </div>
          <ul className="divide-y divide-border">
            {articles.map(a => (
              <li key={a.title} className="flex items-center gap-4 py-3">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{a.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
                    <Clock className="h-3 w-3" /> {a.date} · {a.views !== "–" && <><Eye className="h-3 w-3" /> {a.views}</>}
                  </p>
                </div>
                <span className={`text-[10px] font-bold px-2 py-1 rounded-full flex-shrink-0
                  ${a.status === "published" ? "bg-primary/10 text-primary" :
                    a.status === "draft" ? "bg-muted text-muted-foreground" :
                    "bg-secondary/10 text-secondary"}`}>
                  {a.status}
                </span>
              </li>
            ))}
          </ul>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
          className="bg-card border border-border rounded-2xl p-6">
          <h3 className="font-semibold text-foreground mb-4">{t("dashboard.performanceMonth")}</h3>
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: t("dashboard.avgReadTime", { defaultValue: "Avg. Read Time" }), value: "4m 32s" },
              { label: t("dashboard.returnReaders", { defaultValue: "Return Readers" }), value: "68%" },
              { label: t("dashboard.shareRate", { defaultValue: "Share Rate" }), value: "12%" },
            ].map(m => (
              <div key={m.label} className="text-center p-4 rounded-xl bg-muted/40">
                <p className="text-xl font-bold text-foreground">{m.value}</p>
                <p className="text-xs text-muted-foreground mt-1">{m.label}</p>
              </div>
            ))}
          </div>
        </motion.div>
    </div>
  );
}
