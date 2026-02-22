"use client";

import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { useTranslation } from "react-i18next";
import { Scale, MessageSquare, BookOpen, Users, TrendingUp, Star, Clock, CheckCircle2, AlertCircle, GraduationCap } from "lucide-react";

export default function ScholarDashboardHome() {
  const { user } = useAuth();
  const { t } = useTranslation();

  // Redirect if not scholar (handled in parent)
  if (!user || user.role !== "scholar") {
    return null;
  }

  const stats = [
    { label: t("dashboard.recentFatwas", { defaultValue: "Fatwas Issued" }), value: "124", icon: Scale, trend: "+8 " + t("common.thisMonth", { defaultValue: "this month" }), color: "text-primary bg-primary/10" },
    { label: t("dashboard.dashboard_nav.debates"), value: "7", icon: MessageSquare, trend: "2 " + t("dashboard.livNow", { defaultValue: "live now" }), color: "text-rose-500 bg-rose-500/10" },
    { label: t("dashboard.dashboard_nav.works"), value: "38", icon: BookOpen, trend: "+3 " + t("dashboard.pendingReview", { defaultValue: "pending review" }), color: "text-secondary bg-secondary/10" },
    { label: t("dashboard.dashboard_nav.students"), value: "1,240", icon: Users, trend: "+42 " + t("dashboard.thisWeek", { defaultValue: "this week" }), color: "text-blue-500 bg-blue-500/10" },
  ];

  const recentFatwas = [
    { title: "Contemporary Issues in Islamic Finance", status: "published", date: "2 " + t("dashboard.daysAgo", { defaultValue: "days ago" }), views: "2.4K" },
    { title: "Digital Privacy & Islamic Ethics", status: "pending", date: "5 " + t("dashboard.daysAgo", { defaultValue: "days ago" }), views: "–" },
    { title: "Fiqh of Online Transactions", status: "published", date: "1 " + t("dashboard.weekAgo", { defaultValue: "week ago" }), views: "5.1K" },
  ];

  const upcomingDebates = [
    { title: "Ijtihad in the Modern Age", time: t("dashboard.todayTime", { defaultValue: "Today, 3:00 PM" }), participants: 12, live: true },
    { title: "Maqasid al-Shariah & Human Rights", time: t("dashboard.tomorrowTime", { defaultValue: "Tomorrow, 10:00 AM" }), participants: 8, live: false },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <motion.div 
        initial={{ opacity: 0, y: 16 }} 
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border border-primary/20 rounded-3xl p-6"
      >
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-muted-foreground mb-1">
              {t("dashboard.assalamu", { defaultValue: "Assalamu Alaikum" })}
            </p>
            <h2 className="font-display text-2xl font-bold text-foreground">{user?.name}</h2>
            <p className="text-muted-foreground text-sm mt-1">
              {user?.specialization || "Scholar"} · {t("dashboard.dashboard_nav.scholarship")}
            </p>
          </div>
          <div className="flex items-center gap-2 bg-primary/10 px-3 py-1.5 rounded-full">
            <GraduationCap className="h-4 w-4 text-primary" />
            <span className="text-xs font-medium text-primary">Verified Scholar</span>
          </div>
        </div>
        <div className="flex items-center gap-2 mt-3">
          <Star className="h-4 w-4 text-secondary fill-secondary" />
          <span className="text-sm font-medium text-foreground">{t("dashboard.verifiedScholar")}</span>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <motion.div 
            key={s.label} 
            initial={{ opacity: 0, y: 16 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: i * 0.08 }}
            className="bg-card border border-border rounded-2xl p-5 hover:shadow-md transition-shadow"
          >
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${s.color}`}>
              <s.icon className="h-5 w-5" />
            </div>
            <p className="text-2xl font-bold text-foreground">{s.value}</p>
            <p className="text-sm text-foreground font-medium">{s.label}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{s.trend}</p>
          </motion.div>
        ))}
      </div>

      {/* Two Column Layout */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Fatwas */}
        <motion.div 
          initial={{ opacity: 0, y: 16 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ delay: 0.3 }}
          className="bg-card border border-border rounded-2xl p-6 space-y-4"
        >
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-foreground">{t("dashboard.recentFatwas")}</h3>
            <button className="text-xs text-primary hover:underline">{t("dashboard.viewAll")}</button>
          </div>
          <ul className="space-y-3">
            {recentFatwas.map(f => (
              <li key={f.title} className="flex items-start gap-3 p-3 rounded-xl hover:bg-muted/40 transition-colors">
                {f.status === "published"
                  ? <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                  : <AlertCircle className="h-4 w-4 text-secondary mt-0.5 flex-shrink-0" />}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{f.title}</p>
                  <p className="text-xs text-muted-foreground">{f.date} · {f.views} views</p>
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0
                  ${f.status === "published" ? "bg-primary/10 text-primary" : "bg-secondary/10 text-secondary"}`}>
                  {f.status}
                </span>
              </li>
            ))}
          </ul>
        </motion.div>

        {/* Upcoming Debates */}
        <motion.div 
          initial={{ opacity: 0, y: 16 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ delay: 0.35 }}
          className="bg-card border border-border rounded-2xl p-6 space-y-4"
        >
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-foreground">{t("dashboard.upcomingDebates")}</h3>
            <button className="text-xs text-primary hover:underline">{t("dashboard.schedule")}</button>
          </div>
          <ul className="space-y-3">
            {upcomingDebates.map(d => (
              <li key={d.title} className="flex items-start gap-3 p-3 rounded-xl hover:bg-muted/40 transition-colors">
                <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${d.live ? "bg-rose-500 animate-pulse" : "bg-border"}`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{d.title}</p>
                  <p className="text-xs text-muted-foreground">{d.time} · {d.participants} participants</p>
                </div>
                {d.live && <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-destructive text-destructive-foreground flex-shrink-0">LIVE</span>}
              </li>
            ))}
          </ul>
          
          {/* Engagement Card */}
          <div className="rounded-xl bg-muted/50 p-4 flex items-center gap-3">
            <TrendingUp className="h-5 w-5 text-primary" />
            <div>
              <p className="text-sm font-medium text-foreground">{t("dashboard.engagementTrend")}</p>
              <p className="text-xs text-muted-foreground">{t("dashboard.engagementDesc")}</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}