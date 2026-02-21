import { motion } from "framer-motion";
import { Scroll, Eye, Download, Calendar, Plus, BookOpen, FileText, Star } from "lucide-react";
import { useTranslation } from "react-i18next";

const works = [
  { id: 1, title: "Contemporary Ijtihad: Theory and Practice", type: "Book", year: 2023, views: "34.2K", downloads: "8.1K", rating: 4.9, featured: true },
  { id: 2, title: "Fiqh al-Siyasah: A Modern Perspective", type: "Paper", year: 2024, views: "21.5K", downloads: "4.3K", rating: 4.8, featured: false },
  { id: 3, title: "Islamic Governance in the Digital Era", type: "Article", year: 2025, views: "15.7K", downloads: "2.6K", rating: 4.7, featured: true },
  { id: 4, title: "Usul al-Fiqh: Classical Sources Reviewed", type: "Paper", year: 2022, views: "28.3K", downloads: "6.9K", rating: 4.9, featured: false },
  { id: 5, title: "Halal Finance: Contemporary Challenges", type: "Article", year: 2025, views: "9.4K", downloads: "1.8K", rating: 4.6, featured: false },
  { id: 6, title: "Ethics of AI in Islamic Jurisprudence", type: "Paper", year: 2026, views: "3.1K", downloads: "0.9K", rating: 4.8, featured: false },
];

const typeIcon: Record<string, React.ElementType> = { Book: BookOpen, Paper: FileText, Article: Scroll };
const typeColor: Record<string, string> = {
  Book: "bg-primary/10 text-primary",
  Paper: "bg-purple-500/10 text-purple-600",
  Article: "bg-secondary/10 text-secondary",
};

export default function ScholarWorks() {
  const { t } = useTranslation();
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-xl font-bold text-foreground">{t("subpages.publishedWorks")}</h2>
          <p className="text-sm text-muted-foreground mt-0.5">6 {t("subpages.publications")} · 112.2K {t("subpages.totalViewsCount")}</p>
        </div>
        <button className="inline-flex items-center gap-2 bg-primary text-primary-foreground text-sm font-semibold px-4 py-2.5 rounded-xl hover:bg-primary/90 transition-colors shadow-sm">
          <Plus className="h-4 w-4" /> {t("subpages.addPublication")}
        </button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {[
          { label: t("subpages.books"), val: "1", color: "text-primary" },
          { label: t("subpages.papers"), val: "3", color: "text-purple-600" },
          { label: t("subpages.articles"), val: "2", color: "text-secondary" },
        ].map(s => (
          <div key={s.label} className="bg-card border border-border rounded-2xl p-4 text-center">
            <p className={`text-3xl font-bold ${s.color}`}>{s.val}</p>
            <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {works.map((w, i) => {
          const Icon = typeIcon[w.type];
          return (
            <motion.div key={w.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
              className={`bg-card border rounded-2xl p-5 hover:shadow-md transition-all cursor-pointer group
                ${w.featured ? "border-primary/30 ring-1 ring-primary/10" : "border-border"}`}>
              <div className="flex items-start gap-3 mb-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${typeColor[w.type]}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    {w.featured && <span className="text-[9px] font-bold bg-secondary/15 text-secondary px-1.5 py-0.5 rounded-full uppercase tracking-wide">{t("subpages.featured")}</span>}
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${typeColor[w.type]}`}>{w.type}</span>
                  </div>
                  <p className="text-sm font-semibold text-foreground leading-snug group-hover:text-primary transition-colors">{w.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
                    <Calendar className="h-3 w-3" /> {w.year}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1"><Eye className="h-3.5 w-3.5" />{w.views}</span>
                <span className="flex items-center gap-1"><Download className="h-3.5 w-3.5" />{w.downloads}</span>
                <span className="flex items-center gap-1 ml-auto"><Star className="h-3.5 w-3.5 text-secondary" />{w.rating}</span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
