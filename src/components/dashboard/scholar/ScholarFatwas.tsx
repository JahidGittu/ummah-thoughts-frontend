import { useState } from "react";
import { motion } from "framer-motion";
import { Scale, Plus, Search, Filter, Eye, CheckCircle2, Clock, AlertCircle, ChevronRight } from "lucide-react";
import { useTranslation } from "react-i18next";

const fatwas = [
  { id: 1, title: "Zakat on Cryptocurrency Holdings", category: "Finance", status: "published", views: "12.4K", date: "Jan 12, 2026", priority: "normal" },
  { id: 2, title: "Digital Contracts in Islamic Law", category: "Muamalat", status: "published", views: "8.2K", date: "Jan 5, 2026", priority: "normal" },
  { id: 3, title: "Prayer Times for Polar Regions", category: "Ibadah", status: "published", views: "6.7K", date: "Dec 28, 2025", priority: "normal" },
  { id: 4, title: "NFT Ownership and Islamic Ethics", category: "Finance", status: "pending", views: "–", date: "Feb 10, 2026", priority: "high" },
  { id: 5, title: "Organ Donation: A Fiqh Analysis", category: "Medical", status: "draft", views: "–", date: "Feb 14, 2026", priority: "normal" },
  { id: 6, title: "Working in Conventional Banks", category: "Finance", status: "published", views: "19.1K", date: "Nov 20, 2025", priority: "normal" },
  { id: 7, title: "Social Media & Backbiting (Gheebah)", category: "Ethics", status: "review", views: "–", date: "Feb 16, 2026", priority: "normal" },
];

export default function ScholarFatwas() {
  const { t } = useTranslation();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const statusConfig: Record<string, { label: string; color: string }> = {
    published: { label: t("subpages.published"), color: "bg-primary/10 text-primary" },
    pending: { label: t("subpages.pending"), color: "bg-secondary/10 text-secondary" },
    draft: { label: t("subpages.draft"), color: "bg-muted text-muted-foreground" },
    review: { label: t("subpages.inReview"), color: "bg-purple-500/10 text-purple-600" },
  };

  const filtered = fatwas.filter(f =>
    (filter === "all" || f.status === filter) &&
    f.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-xl font-bold text-foreground">{t("subpages.myFatwas")}</h2>
          <p className="text-sm text-muted-foreground mt-0.5">{fatwas.length} {t("subpages.total")} · 4 {t("subpages.published")}</p>
        </div>
        <button className="inline-flex items-center gap-2 bg-primary text-primary-foreground text-sm font-semibold px-4 py-2.5 rounded-xl hover:bg-primary/90 transition-colors shadow-sm">
          <Plus className="h-4 w-4" /> {t("subpages.newFatwa")}
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: t("subpages.total"), val: "7", icon: Scale },
          { label: t("subpages.published"), val: "4", icon: CheckCircle2 },
          { label: t("subpages.pending"), val: "2", icon: Clock },
          { label: t("subpages.totalViews"), val: "46.4K", icon: Eye },
        ].map(s => (
          <div key={s.label} className="bg-card border border-border rounded-2xl p-4 flex items-center gap-3">
            <s.icon className="h-5 w-5 text-primary flex-shrink-0" />
            <div>
              <p className="text-lg font-bold text-foreground">{s.val}</p>
              <p className="text-xs text-muted-foreground">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder={t("subpages.searchFatwas")}
            className="w-full pl-10 pr-4 h-10 rounded-xl border border-border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
        </div>
        <div className="flex gap-2">
          {["all", "published", "pending", "draft", "review"].map(s => (
            <button key={s} onClick={() => setFilter(s)}
              className={`text-xs font-semibold px-3 py-1.5 rounded-lg capitalize transition-colors
                ${filter === s ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"}`}>
              {s === "all" ? t("subpages.all") : s === "published" ? t("subpages.published") : s === "pending" ? t("subpages.pending") : s === "draft" ? t("subpages.draft") : t("subpages.inReview")}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/40">
                <th className="text-left text-xs font-bold text-muted-foreground uppercase tracking-wider px-5 py-3.5">{t("subpages.title")}</th>
                <th className="text-left text-xs font-bold text-muted-foreground uppercase tracking-wider px-4 py-3.5 hidden sm:table-cell">{t("subpages.category")}</th>
                <th className="text-left text-xs font-bold text-muted-foreground uppercase tracking-wider px-4 py-3.5">{t("subpages.status")}</th>
                <th className="text-left text-xs font-bold text-muted-foreground uppercase tracking-wider px-4 py-3.5 hidden md:table-cell">{t("subpages.views")}</th>
                <th className="text-left text-xs font-bold text-muted-foreground uppercase tracking-wider px-4 py-3.5 hidden lg:table-cell">{t("subpages.date")}</th>
                <th className="px-4 py-3.5" />
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((f, i) => (
                <motion.tr key={f.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }}
                  className="hover:bg-muted/30 transition-colors cursor-pointer">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      {f.priority === "high" && <AlertCircle className="h-3.5 w-3.5 text-secondary flex-shrink-0" />}
                      <p className="text-sm font-medium text-foreground">{f.title}</p>
                    </div>
                  </td>
                  <td className="px-4 py-4 hidden sm:table-cell">
                    <span className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded-lg">{f.category}</span>
                  </td>
                  <td className="px-4 py-4">
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${statusConfig[f.status].color}`}>
                      {statusConfig[f.status].label}
                    </span>
                  </td>
                  <td className="px-4 py-4 hidden md:table-cell">
                    <span className="text-sm text-muted-foreground">{f.views}</span>
                  </td>
                  <td className="px-4 py-4 hidden lg:table-cell">
                    <span className="text-xs text-muted-foreground">{f.date}</span>
                  </td>
                  <td className="px-4 py-4">
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="text-center py-12 text-muted-foreground text-sm">{t("subpages.noFatwasFound")}</div>
        )}
      </div>
    </div>
  );
}
