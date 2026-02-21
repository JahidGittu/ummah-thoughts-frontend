import { motion } from "framer-motion";
import { Target, BookOpen, Star, Flame } from "lucide-react";
import { useTranslation } from "react-i18next";

const tracks = [
  { title: "Introduction to Usul al-Fiqh", category: "Foundations", progress: 100, lessons: 12, completed: 12 },
  { title: "Islamic Political History", category: "History", progress: 65, lessons: 20, completed: 13 },
  { title: "Principles of Halal Finance", category: "Fiqh", progress: 30, lessons: 15, completed: 4 },
  { title: "Ethics in Islamic Governance", category: "Governance", progress: 0, lessons: 10, completed: 0 },
];

const weeklyActivity = [
  { day: "Mon", mins: 25 }, { day: "Tue", mins: 40 }, { day: "Wed", mins: 15 },
  { day: "Thu", mins: 55 }, { day: "Fri", mins: 30 }, { day: "Sat", mins: 0 }, { day: "Sun", mins: 45 },
];
const maxMins = Math.max(...weeklyActivity.map(d => d.mins));

export default function UserProgress() {
  const { t } = useTranslation();
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: t("subpages.currentStreak"), value: "18d", icon: Flame, color: "text-rose-500 bg-rose-500/10" },
          { label: t("subpages.articlesRead"), value: "86", icon: BookOpen, color: "text-blue-500 bg-blue-500/10" },
          { label: t("subpages.xpPoints"), value: "730", icon: Star, color: "text-secondary bg-secondary/10" },
        ].map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
            className="bg-card border border-border rounded-2xl p-5 text-center">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 mx-auto ${s.color}`}><s.icon className="h-5 w-5" /></div>
            <p className="text-2xl font-bold text-foreground">{s.value}</p>
            <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
          </motion.div>
        ))}
      </div>

      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
        className="bg-card border border-border rounded-2xl p-6">
        <h3 className="font-semibold text-foreground mb-5">{t("subpages.weeklyStudy")}</h3>
        <div className="flex items-end gap-2 h-28">
          {weeklyActivity.map(d => (
            <div key={d.day} className="flex-1 flex flex-col items-center gap-1">
              <div className="w-full rounded-t-lg bg-blue-500/20 relative overflow-hidden" style={{ height: "100px" }}>
                <div className="absolute bottom-0 w-full bg-blue-500 rounded-t-lg transition-all"
                  style={{ height: `${maxMins ? (d.mins / maxMins) * 100 : 0}%` }} />
              </div>
              <p className="text-[10px] text-muted-foreground">{d.day}</p>
            </div>
          ))}
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
        className="bg-card border border-border rounded-2xl p-6 space-y-5">
        <h3 className="font-semibold text-foreground flex items-center gap-2">
          <Target className="h-4 w-4 text-blue-500" /> {t("subpages.learningTracks")}
        </h3>
        <div className="space-y-4">
          {tracks.map(track => (
            <div key={track.title}>
              <div className="flex items-center justify-between mb-1.5">
                <div>
                  <p className="text-sm font-medium text-foreground">{track.title}</p>
                  <p className="text-xs text-muted-foreground">{track.category} · {track.completed}/{track.lessons} {t("subpages.lessons")}</p>
                </div>
                <span className="text-xs font-bold text-foreground">{track.progress}%</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div className={`h-full rounded-full ${track.progress === 100 ? "bg-primary" : "bg-blue-500"}`} style={{ width: `${track.progress}%` }} />
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
