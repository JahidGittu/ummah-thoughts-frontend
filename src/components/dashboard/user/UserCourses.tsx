import { motion } from "framer-motion";
import { BookOpen, Play, CheckCircle2, Lock, Star, Clock } from "lucide-react";
import { useTranslation } from "react-i18next";

const courses = [
  { title: "Introduction to Usul al-Fiqh", category: "Foundations", lessons: 12, completed: 12, rating: 4.9, duration: "3h 20m", status: "completed", instructor: "Dr. Ahmad Al-Rashid" },
  { title: "Islamic Political History", category: "History", lessons: 20, completed: 13, rating: 4.8, duration: "6h 10m", status: "in-progress", instructor: "Dr. Ibrahim Khalil" },
  { title: "Principles of Halal Finance", category: "Fiqh", lessons: 15, completed: 4, rating: 4.7, duration: "4h 45m", status: "in-progress", instructor: "Sh. Muhammad Hasan" },
  { title: "Ethics in Islamic Governance", category: "Governance", lessons: 10, completed: 0, rating: 4.9, duration: "2h 30m", status: "not-started", instructor: "Dr. Fatima Zahra" },
  { title: "Hadith Sciences for Beginners", category: "Hadith", lessons: 8, completed: 0, rating: 4.6, duration: "2h 15m", status: "locked", instructor: "Sh. Yusuf Al-Azhari" },
];

export default function UserCourses() {
  const { t } = useTranslation();

  const statusConfig: Record<string, { label: string; color: string; icon: React.ElementType }> = {
    "completed": { label: t("subpages.completed_status"), color: "bg-primary/10 text-primary", icon: CheckCircle2 },
    "in-progress": { label: t("subpages.inProgress"), color: "bg-blue-500/10 text-blue-500", icon: Play },
    "not-started": { label: t("subpages.startNow"), color: "bg-muted text-muted-foreground", icon: BookOpen },
    "locked": { label: t("subpages.locked"), color: "bg-muted text-muted-foreground", icon: Lock },
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: t("subpages.completed_status"), count: 1, color: "text-primary" },
          { label: t("subpages.inProgress"), count: 2, color: "text-blue-500" },
          { label: t("subpages.available"), count: 2, color: "text-muted-foreground" },
        ].map(s => (
          <div key={s.label} className="bg-card border border-border rounded-2xl p-4 text-center">
            <p className={`text-2xl font-bold ${s.color}`}>{s.count}</p>
            <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="space-y-4">
        {courses.map((c, i) => {
          const cfg = statusConfig[c.status];
          const Icon = cfg.icon;
          return (
            <motion.div key={c.title} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
              className={`bg-card border border-border rounded-2xl p-5 hover:shadow-md transition-shadow group ${c.status === "locked" ? "opacity-60" : "cursor-pointer"}`}>
              <div className="flex items-start justify-between gap-4 mb-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-muted text-muted-foreground">{c.category}</span>
                  </div>
                  <h3 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">{c.title}</h3>
                  <p className="text-xs text-muted-foreground mt-1">{t("subpages.instructor")}: {c.instructor}</p>
                  <div className="flex items-center gap-3 mt-1.5 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><BookOpen className="h-3 w-3" /> {c.completed}/{c.lessons} {t("subpages.lessons")}</span>
                    <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {c.duration}</span>
                    <span className="flex items-center gap-1"><Star className="h-3 w-3 text-secondary fill-secondary" /> {c.rating}</span>
                  </div>
                </div>
                <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold flex-shrink-0 ${cfg.color}`}>
                  <Icon className="h-3.5 w-3.5" /> {cfg.label}
                </div>
              </div>
              {c.status !== "not-started" && c.status !== "locked" && (
                <div className="space-y-1.5">
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${c.status === "completed" ? "bg-primary" : "bg-blue-500"}`}
                      style={{ width: `${Math.round((c.completed / c.lessons) * 100)}%` }} />
                  </div>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
