import { motion } from "framer-motion";
import { Clock, Calendar, Search, BookOpen } from "lucide-react";
import { useTranslation } from "react-i18next";

const history = [
  { title: "Introduction to Usul al-Fiqh — Lesson 12", type: "Lesson", time: "Today, 9:22 AM", duration: "18 min", category: "Foundations" },
  { title: "The Fiqh of Political Dissent in Classical Islam", type: "Article", time: "Today, 8:05 AM", duration: "8 min", category: "Governance" },
  { title: "Ibn Khaldun and Cyclical Civilizations", type: "Article", time: "Yesterday, 7:40 PM", duration: "12 min", category: "History" },
  { title: "Islamic Political History — Lesson 8", type: "Lesson", time: "Yesterday, 6:15 PM", duration: "22 min", category: "History" },
  { title: "Principles of Halal Finance — Lesson 3", type: "Lesson", time: "2 days ago", duration: "14 min", category: "Fiqh" },
  { title: "Understanding Maqasid al-Shariah", type: "Article", time: "3 days ago", duration: "6 min", category: "Foundations" },
  { title: "Debate: Is Democracy Compatible with Islam?", type: "Debate", time: "4 days ago", duration: "35 min", category: "Governance" },
];

const typeColor: Record<string, string> = {
  Lesson: "bg-blue-500/10 text-blue-500",
  Article: "bg-primary/10 text-primary",
  Debate: "bg-rose-500/10 text-rose-500",
};

export default function UserHistory() {
  const { t } = useTranslation();
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input placeholder={t("subpages.searchHistory")} className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
        </div>
      </div>

      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        <div className="p-4 border-b border-border flex items-center gap-2">
          <Clock className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-semibold text-foreground">{t("subpages.recentActivity")}</span>
          <span className="ml-auto text-xs text-muted-foreground">{history.length} {t("subpages.items")}</span>
        </div>
        <div className="divide-y divide-border">
          {history.map((h, i) => (
            <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }}
              className="flex items-center gap-4 p-4 hover:bg-muted/30 transition-colors cursor-pointer group">
              <div className="w-10 h-10 rounded-xl bg-muted/60 flex items-center justify-center flex-shrink-0">
                <BookOpen className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors truncate">{h.title}</p>
                <div className="flex items-center gap-2 mt-0.5 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {h.time}</span>
                  <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {h.duration}</span>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-muted text-muted-foreground">{h.category}</span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${typeColor[h.type]}`}>{h.type}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
