import { motion } from "framer-motion";
import { Archive, Eye, Calendar, Search, Tag, RotateCcw } from "lucide-react";

const archived = [
  { title: "The Ottoman Legal System: An Overview", category: "History", date: "Nov 2023", views: "12.3K", reason: "Outdated — updated version published" },
  { title: "Basics of Islamic Governance", category: "Governance", date: "Sep 2023", views: "9.1K", reason: "Merged into comprehensive guide" },
  { title: "Early Islamic Trade Routes", category: "History", date: "Jul 2023", views: "7.4K", reason: "Archived by author for revision" },
  { title: "Introduction to Zakat Calculation", category: "Fiqh", date: "May 2023", views: "21.5K", reason: "Superseded by updated tool" },
  { title: "Friday Khutbah Guidelines", category: "Practice", date: "Mar 2023", views: "4.2K", reason: "Pending update" },
];

export default function WriterArchive() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input placeholder="Search archive..." className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
        </div>
      </div>

      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        <div className="p-4 border-b border-border flex items-center gap-2">
          <Archive className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-semibold text-foreground">{archived.length} Archived Articles</span>
        </div>
        <div className="divide-y divide-border">
          {archived.map((a, i) => (
            <motion.div key={a.title} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.06 }}
              className="p-5 hover:bg-muted/30 transition-colors group">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <Tag className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className="text-[10px] font-bold text-muted-foreground uppercase">{a.category}</span>
                  </div>
                  <h3 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">{a.title}</h3>
                  <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {a.date}</span>
                    <span className="flex items-center gap-1"><Eye className="h-3 w-3" /> {a.views} views</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1.5 italic">Reason: {a.reason}</p>
                </div>
                <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border text-xs font-medium text-muted-foreground hover:text-primary hover:border-primary transition-colors flex-shrink-0 opacity-0 group-hover:opacity-100">
                  <RotateCcw className="h-3.5 w-3.5" /> Restore
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
