import { motion } from "framer-motion";
import { Search, Trash2, ExternalLink, Tag, Clock } from "lucide-react";
import { useTranslation } from "react-i18next";

const bookmarks = [
  { id: 1, title: "The Fiqh of Political Dissent in Classical Islam", category: "Governance", saved: "2 days ago", readTime: "8 min", tags: ["politics", "fiqh"] },
  { id: 2, title: "Ibn Khaldun and the Cyclical Theory of Civilizations", category: "History", saved: "1 week ago", readTime: "12 min", tags: ["history", "ibn-khaldun"] },
  { id: 3, title: "Understanding Maqasid al-Shariah", category: "Foundations", saved: "2 weeks ago", readTime: "6 min", tags: ["maqasid", "usul"] },
  { id: 4, title: "Zakat Calculation: Modern Applications", category: "Fiqh", saved: "3 weeks ago", readTime: "5 min", tags: ["zakat", "finance"] },
  { id: 5, title: "The Role of Shura in Islamic Political Theory", category: "Governance", saved: "1 month ago", readTime: "10 min", tags: ["shura", "governance"] },
];

export default function UserBookmarks() {
  const { t } = useTranslation();
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input placeholder={t("subpages.searchBookmarks")} className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
        </div>
      </div>

      <div className="space-y-3">
        {bookmarks.map((b, i) => (
          <motion.div key={b.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
            className="bg-card border border-border rounded-2xl p-5 hover:shadow-md transition-shadow group cursor-pointer">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-500">{b.category}</span>
                </div>
                <h3 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">{b.title}</h3>
                <div className="flex items-center gap-3 mt-1.5 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {b.readTime} {t("subpages.readTime")}</span>
                  <span>{t("subpages.saved")} {b.saved}</span>
                </div>
                <div className="flex items-center gap-2 mt-2 flex-wrap">
                  {b.tags.map(tag => (
                    <span key={tag} className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-muted text-muted-foreground flex items-center gap-1">
                      <Tag className="h-2.5 w-2.5" />{tag}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-1 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-muted text-muted-foreground hover:text-primary transition-colors" title={t("subpages.openArticle")}>
                  <ExternalLink className="h-3.5 w-3.5" />
                </button>
                <button className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors" title={t("subpages.removeBookmark")}>
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
