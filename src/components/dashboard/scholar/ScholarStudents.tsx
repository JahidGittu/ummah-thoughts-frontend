import { motion } from "framer-motion";
import { Users, Search, TrendingUp, Award } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

const students = [
  { id: 1, name: "Omar Farouq", level: "Advanced", course: "Usul al-Fiqh", progress: 87, joined: "Jan 2025", active: true },
  { id: 2, name: "Aisha Malik", level: "Intermediate", course: "Fiqh al-Siyasah", progress: 64, joined: "Mar 2025", active: true },
  { id: 3, name: "Hassan Ahmed", level: "Beginner", course: "Islamic History", progress: 32, joined: "Aug 2025", active: true },
  { id: 4, name: "Khadijah Noor", level: "Advanced", course: "Usul al-Fiqh", progress: 91, joined: "Nov 2024", active: false },
  { id: 5, name: "Yusuf Ibrahim", level: "Intermediate", course: "Political Theory", progress: 55, joined: "Feb 2025", active: true },
  { id: 6, name: "Fatima Siddiqui", level: "Advanced", course: "Fiqh al-Siyasah", progress: 78, joined: "Dec 2024", active: false },
];

const levelColor: Record<string, string> = {
  Advanced: "bg-primary/10 text-primary",
  Intermediate: "bg-secondary/10 text-secondary",
  Beginner: "bg-blue-500/10 text-blue-600",
};

export default function ScholarStudents() {
  const { t } = useTranslation();
  const [search, setSearch] = useState("");
  const filtered = students.filter(s => s.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-xl font-bold text-foreground">{t("subpages.students")}</h2>
          <p className="text-sm text-muted-foreground mt-0.5">1,240 {t("subpages.enrolled")} · {students.filter(s => s.active).length} {t("subpages.shownActive")}</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {[
          { label: t("subpages.totalEnrolled"), val: "1,240", icon: Users, color: "text-primary" },
          { label: t("subpages.activeToday"), val: "342", icon: TrendingUp, color: "text-rose-500" },
          { label: t("subpages.completedCount"), val: "189", icon: Award, color: "text-secondary" },
        ].map(s => (
          <div key={s.label} className="bg-card border border-border rounded-2xl p-4 text-center">
            <s.icon className={`h-5 w-5 mx-auto mb-2 ${s.color}`} />
            <p className="text-2xl font-bold text-foreground">{s.val}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder={t("subpages.searchStudents")}
          className="w-full pl-10 pr-4 h-10 rounded-xl border border-border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
      </div>

      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-muted/40">
              <th className="text-left text-xs font-bold text-muted-foreground uppercase tracking-wider px-5 py-3.5">{t("subpages.student")}</th>
              <th className="text-left text-xs font-bold text-muted-foreground uppercase tracking-wider px-4 py-3.5 hidden sm:table-cell">{t("subpages.level")}</th>
              <th className="text-left text-xs font-bold text-muted-foreground uppercase tracking-wider px-4 py-3.5 hidden md:table-cell">{t("subpages.course")}</th>
              <th className="text-left text-xs font-bold text-muted-foreground uppercase tracking-wider px-4 py-3.5">{t("subpages.progress")}</th>
              <th className="text-left text-xs font-bold text-muted-foreground uppercase tracking-wider px-4 py-3.5 hidden lg:table-cell">{t("subpages.status")}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filtered.map((s, i) => (
              <motion.tr key={s.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }}
                className="hover:bg-muted/30 transition-colors cursor-pointer">
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-primary/15 flex items-center justify-center text-xs font-bold text-primary flex-shrink-0">
                      {s.name[0]}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{s.name}</p>
                      <p className="text-xs text-muted-foreground">{t("subpages.joined")} {s.joined}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4 hidden sm:table-cell">
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${levelColor[s.level]}`}>{s.level}</span>
                </td>
                <td className="px-4 py-4 hidden md:table-cell">
                  <span className="text-sm text-muted-foreground">{s.course}</span>
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 w-20 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-primary rounded-full" style={{ width: `${s.progress}%` }} />
                    </div>
                    <span className="text-xs text-muted-foreground">{s.progress}%</span>
                  </div>
                </td>
                <td className="px-4 py-4 hidden lg:table-cell">
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${s.active ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}>
                    {s.active ? t("subpages.active") : t("subpages.inactive")}
                  </span>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
