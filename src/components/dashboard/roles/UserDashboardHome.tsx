import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { useTranslation } from "react-i18next";
import { BookOpen, Bookmark, Clock, Star, TrendingUp, MessageSquare, Award } from "lucide-react";

const achievements = [
  { icon: "🏅", labelKey: "firstDebate", unlocked: true },
  { icon: "📚", labelKey: "fiftyArticles", unlocked: true },
  { icon: "🔥", labelKey: "thirtyStreak", unlocked: false },
  { icon: "⭐", labelKey: "topContributor", unlocked: false },
];

const ACHIEVEMENT_LABELS: Record<string, { en: string; bn: string }> = {
  firstDebate: { en: "First Debate", bn: "প্রথম বিতর্ক" },
  fiftyArticles: { en: "50 Articles", bn: "৫০টি নিবন্ধ" },
  thirtyStreak: { en: "30-Day Streak", bn: "৩০-দিনের ধারা" },
  topContributor: { en: "Top Contributor", bn: "শীর্ষ অবদানকারী" },
};

export default function UserDashboardHome() {
  const { user } = useAuth();
  const { t, i18n } = useTranslation();
  const lang = i18n.language;

  const stats = [
    { label: t("dashboard.topicsRead", { defaultValue: "Topics Read" }), value: "86", icon: BookOpen, trend: "+12 " + t("dashboard.thisMonth", { defaultValue: "this month" }), color: "text-blue-500 bg-blue-500/10" },
    { label: t("dashboard.dashboard_nav.bookmarks"), value: "34", icon: Bookmark, trend: t("dashboard.savedForLater", { defaultValue: "Saved for later" }), color: "text-primary bg-primary/10" },
    { label: t("dashboard.studyHours", { defaultValue: "Study Hours" }), value: "42h", icon: Clock, trend: t("dashboard.thisMonth", { defaultValue: "This month" }), color: "text-secondary bg-secondary/10" },
    { label: t("dashboard.streak", { defaultValue: "Streak" }), value: "18d", icon: TrendingUp, trend: t("dashboard.keepItUp", { defaultValue: "Keep it up!" }), color: "text-rose-500 bg-rose-500/10" },
  ];

  const recent = [
    { title: "Introduction to Usul al-Fiqh", progress: 100, category: t("dashboard.foundations", { defaultValue: "Foundations" }) },
    { title: "Islamic Political History", progress: 65, category: t("dashboard.history", { defaultValue: "History" }) },
    { title: "Principles of Halal Finance", progress: 30, category: "Fiqh" },
  ];

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-blue-500/10 via-blue-500/5 to-transparent border border-blue-400/20 rounded-3xl p-6">
        <p className="text-sm text-muted-foreground mb-1">{t("dashboard.assalamu")}</p>
        <h2 className="font-display text-2xl font-bold text-foreground">{user?.name}</h2>
        <p className="text-muted-foreground text-sm mt-1">{lang === "bn" ? "শিক্ষার্থী · ইসলামী বিজ্ঞান" : "Learner · Islamic Sciences"}</p>
        <div className="flex items-center gap-2 mt-3">
          <Star className="h-4 w-4 text-secondary" />
          <span className="text-sm font-medium text-foreground">{lang === "bn" ? "স্তর ৩ — মধ্যবর্তী শিক্ষার্থী" : "Level 3 — Intermediate Learner"}</span>
        </div>
        <div className="mt-4 space-y-1.5">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{t("dashboard.xpProgress")}</span><span>730 / 1000 XP</span>
          </div>
          <div className="h-2 bg-blue-500/20 rounded-full overflow-hidden">
            <div className="h-full bg-blue-500 rounded-full" style={{ width: "73%" }} />
          </div>
        </div>
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

      <div className="grid lg:grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="bg-card border border-border rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-foreground">{t("dashboard.continueLearning")}</h3>
            <button className="text-xs text-primary hover:underline">{t("dashboard.viewAllCourses")}</button>
          </div>
          <ul className="space-y-4">
            {recent.map(r => (
              <li key={r.title} className="space-y-2 cursor-pointer group">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">{r.title}</p>
                    <p className="text-xs text-muted-foreground">{r.category}</p>
                  </div>
                  <span className="text-xs font-bold text-muted-foreground">{r.progress}%</span>
                </div>
                <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${r.progress === 100 ? "bg-primary" : "bg-blue-500"}`}
                    style={{ width: `${r.progress}%` }} />
                </div>
              </li>
            ))}
          </ul>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
          className="bg-card border border-border rounded-2xl p-6 space-y-4">
          <h3 className="font-semibold text-foreground flex items-center gap-2">
            <Award className="h-4 w-4 text-secondary" /> {t("dashboard.achievements")}
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {achievements.map(a => (
              <div key={a.labelKey} className={`p-4 rounded-2xl border-2 text-center transition-all
                ${a.unlocked ? "border-primary/20 bg-primary/5" : "border-border bg-muted/30 opacity-50"}`}>
                <p className="text-2xl mb-1">{a.icon}</p>
                <p className={`text-xs font-semibold ${a.unlocked ? "text-foreground" : "text-muted-foreground"}`}>
                  {lang === "bn" ? ACHIEVEMENT_LABELS[a.labelKey].bn : ACHIEVEMENT_LABELS[a.labelKey].en}
                </p>
                {!a.unlocked && <p className="text-[10px] text-muted-foreground mt-0.5">{t("dashboard.locked")}</p>}
              </div>
            ))}
          </div>
          <div className="rounded-xl bg-muted/50 p-4 flex items-center gap-3">
            <MessageSquare className="h-5 w-5 text-blue-500" />
            <div>
              <p className="text-sm font-medium text-foreground">{t("dashboard.newReplies", { count: 3 })}</p>
              <p className="text-xs text-muted-foreground">{t("dashboard.joinConversation")}</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
