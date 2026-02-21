import { motion } from "framer-motion";
import { Award, Trophy, TrendingUp } from "lucide-react";
import { useTranslation } from "react-i18next";

const earned = [
  { icon: "🏅", label: "First Debate", desc: "Participated in your first debate", date: "Jan 12, 2025", unlocked: true },
  { icon: "📚", label: "50 Articles", desc: "Read 50 articles on the platform", date: "Feb 3, 2025", unlocked: true },
  { icon: "🔥", label: "7-Day Streak", desc: "Studied for 7 consecutive days", date: "Mar 1, 2025", unlocked: true },
  { icon: "⭐", label: "Top Commenter", desc: "Received 20+ likes on your discussions", date: "Feb 20, 2025", unlocked: true },
];

const upcoming = [
  { icon: "🏆", label: "30-Day Streak", desc: "Study for 30 consecutive days", progress: 60 },
  { icon: "📖", label: "100 Articles", desc: "Read 100 articles total", progress: 86 },
  { icon: "💬", label: "Debate Champion", desc: "Participate in 5 debates", progress: 40 },
  { icon: "🎓", label: "Scholar's Friend", desc: "Ask questions to 3 different scholars", progress: 33 },
];

export default function UserAchievements() {
  const { t } = useTranslation();
  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-blue-500/10 via-blue-500/5 to-transparent border border-blue-400/20 rounded-2xl p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">{t("subpages.totalAchievements")}</p>
            <p className="text-4xl font-bold text-foreground mt-1">{earned.length}</p>
            <p className="text-xs text-muted-foreground mt-1">{t("subpages.level3Learner")}</p>
          </div>
          <div className="w-16 h-16 rounded-2xl bg-blue-500 text-white flex items-center justify-center">
            <Trophy className="h-8 w-8" />
          </div>
        </div>
        <div className="mt-4 space-y-1.5">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{t("subpages.xpToLevel4")}</span><span>730 / 1000 XP</span>
          </div>
          <div className="h-2 bg-blue-500/20 rounded-full overflow-hidden">
            <div className="h-full bg-blue-500 rounded-full" style={{ width: "73%" }} />
          </div>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="bg-card border border-border rounded-2xl p-6">
        <h3 className="font-semibold text-foreground flex items-center gap-2 mb-4">
          <Award className="h-4 w-4 text-secondary" /> {t("subpages.earnedBadges")}
        </h3>
        <div className="grid grid-cols-2 gap-3">
          {earned.map(a => (
            <div key={a.label} className="p-4 rounded-2xl border border-primary/20 bg-primary/5 flex items-start gap-3">
              <p className="text-2xl">{a.icon}</p>
              <div>
                <p className="text-sm font-semibold text-foreground">{a.label}</p>
                <p className="text-xs text-muted-foreground">{a.desc}</p>
                <p className="text-[10px] text-muted-foreground mt-1">{a.date}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
        className="bg-card border border-border rounded-2xl p-6">
        <h3 className="font-semibold text-foreground flex items-center gap-2 mb-4">
          <TrendingUp className="h-4 w-4 text-blue-500" /> {t("subpages.inProgressBadges")}
        </h3>
        <div className="space-y-4">
          {upcoming.map(u => (
            <div key={u.label} className="flex items-center gap-4 p-3 rounded-xl bg-muted/40">
              <p className="text-2xl flex-shrink-0">{u.icon}</p>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-sm font-semibold text-foreground">{u.label}</p>
                  <span className="text-xs font-bold text-muted-foreground">{u.progress}%</span>
                </div>
                <p className="text-xs text-muted-foreground mb-1.5">{u.desc}</p>
                <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 rounded-full" style={{ width: `${u.progress}%` }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
