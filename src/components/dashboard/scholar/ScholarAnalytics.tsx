import { motion } from "framer-motion";
import { Eye, Users, Star, TrendingUp, Calendar, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { useTranslation } from "react-i18next";

const monthlyData = [
  { month: "Sep", views: 8200 }, { month: "Oct", views: 11400 }, { month: "Nov", views: 9800 },
  { month: "Dec", views: 13200 }, { month: "Jan", views: 15600 }, { month: "Feb", views: 18300 },
];
const maxViews = Math.max(...monthlyData.map(d => d.views));
const topContent = [
  { title: "Contemporary Ijtihad", views: "34.2K", change: "+18%", up: true },
  { title: "Working in Conventional Banks", views: "19.1K", change: "+7%", up: true },
  { title: "Fiqh al-Siyasah Paper", views: "21.5K", change: "+12%", up: true },
  { title: "Organ Donation Fatwa", views: "–", change: "New", up: true },
];

export default function ScholarAnalytics() {
  const { t } = useTranslation();
  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-xl font-bold text-foreground">{t("subpages.analytics")}</h2>
        <p className="text-sm text-muted-foreground mt-0.5">{t("subpages.performanceOverview")} · {t("subpages.last6Months")}</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: t("subpages.totalViews"), val: "112K", change: "+18%", up: true, icon: Eye, color: "text-primary bg-primary/10" },
          { label: t("subpages.students"), val: "1,240", change: "+42", up: true, icon: Users, color: "text-blue-500 bg-blue-500/10" },
          { label: t("subpages.avgRating"), val: "4.8", change: "+0.1", up: true, icon: Star, color: "text-secondary bg-secondary/10" },
          { label: "Engagement", val: "74%", change: "-2%", up: false, icon: TrendingUp, color: "text-purple-500 bg-purple-500/10" },
        ].map((k, i) => (
          <motion.div key={k.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
            className="bg-card border border-border rounded-2xl p-5">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${k.color}`}>
              <k.icon className="h-5 w-5" />
            </div>
            <p className="text-2xl font-bold text-foreground">{k.val}</p>
            <div className="flex items-center justify-between mt-1">
              <p className="text-xs text-muted-foreground">{k.label}</p>
              <span className={`text-xs font-semibold flex items-center gap-0.5 ${k.up ? "text-primary" : "text-destructive"}`}>
                {k.up ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                {k.change}
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
        className="bg-card border border-border rounded-2xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-foreground">{t("subpages.monthlyViews")}</h3>
          <span className="text-xs text-muted-foreground flex items-center gap-1"><Calendar className="h-3.5 w-3.5" />Sep – Feb 2026</span>
        </div>
        <div className="flex items-end gap-3 h-36 pt-4">
          {monthlyData.map((d, i) => (
            <div key={d.month} className="flex-1 flex flex-col items-center gap-1.5">
              <span className="text-[10px] text-muted-foreground">{(d.views / 1000).toFixed(1)}K</span>
              <motion.div
                initial={{ height: 0 }} animate={{ height: `${(d.views / maxViews) * 100}%` }}
                transition={{ delay: i * 0.08, duration: 0.5, ease: "easeOut" }}
                className="w-full rounded-t-lg bg-primary/80 hover:bg-primary transition-colors cursor-pointer min-h-[4px]"
                style={{ height: `${(d.views / maxViews) * 100}%` }}
              />
              <span className="text-[10px] font-medium text-muted-foreground">{d.month}</span>
            </div>
          ))}
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
        className="bg-card border border-border rounded-2xl p-6 space-y-4">
        <h3 className="font-semibold text-foreground">{t("subpages.topPerformingContent")}</h3>
        <ul className="divide-y divide-border">
          {topContent.map((c, i) => (
            <li key={c.title} className="flex items-center gap-4 py-3">
              <span className="w-6 h-6 rounded-lg bg-muted flex items-center justify-center text-xs font-bold text-muted-foreground flex-shrink-0">{i + 1}</span>
              <p className="flex-1 text-sm font-medium text-foreground">{c.title}</p>
              <span className="text-sm text-muted-foreground">{c.views}</span>
              <span className={`text-xs font-semibold flex items-center gap-0.5 ${c.up ? "text-primary" : "text-destructive"}`}>
                <ArrowUpRight className="h-3 w-3" />{c.change}
              </span>
            </li>
          ))}
        </ul>
      </motion.div>
    </div>
  );
}
