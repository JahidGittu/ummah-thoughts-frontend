import { useState } from "react";
import { motion } from "framer-motion";
import { Library, Search, Plus, BookOpen, Tag, Eye, ChevronRight, Star } from "lucide-react";

const entries = [
  { id: 1, title: "Principles of Usul al-Fiqh", category: "Methodology", tags: ["Fiqh", "Classical"], views: "5.2K", rating: 4.9 },
  { id: 2, title: "Al-Shatibi's Theory of Maqasid", category: "Theory", tags: ["Maqasid", "Objectives"], views: "4.8K", rating: 4.8 },
  { id: 3, title: "Ijma' (Consensus) in Modern Context", category: "Methodology", tags: ["Consensus", "Ijtihad"], views: "3.1K", rating: 4.7 },
  { id: 4, title: "Qiyas: Analogical Reasoning", category: "Methodology", tags: ["Qiyas", "Logic"], views: "2.9K", rating: 4.6 },
  { id: 5, title: "Political Authority in Early Islam", category: "Political", tags: ["Governance", "History"], views: "6.3K", rating: 4.9 },
  { id: 6, title: "Islamic Economic Principles", category: "Economics", tags: ["Finance", "Halal"], views: "7.1K", rating: 4.8 },
  { id: 7, title: "Fiqh of Contemporary Issues", category: "Contemporary", tags: ["Modern", "Applied"], views: "8.4K", rating: 4.7 },
  { id: 8, title: "Hadith Sciences: An Introduction", category: "Hadith", tags: ["Hadith", "Sciences"], views: "4.2K", rating: 4.9 },
];

const categories = ["All", "Methodology", "Theory", "Political", "Economics", "Contemporary", "Hadith"];

export default function ScholarKnowledge() {
  const [search, setSearch] = useState("");
  const [cat, setCat] = useState("All");

  const filtered = entries.filter(e =>
    (cat === "All" || e.category === cat) &&
    e.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-xl font-bold text-foreground">Knowledge Base</h2>
          <p className="text-sm text-muted-foreground mt-0.5">{entries.length} entries across 6 categories</p>
        </div>
        <button className="inline-flex items-center gap-2 bg-primary text-primary-foreground text-sm font-semibold px-4 py-2.5 rounded-xl hover:bg-primary/90 transition-colors shadow-sm">
          <Plus className="h-4 w-4" /> Add Entry
        </button>
      </div>

      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search knowledge base…"
            className="w-full pl-10 pr-4 h-10 rounded-xl border border-border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
        </div>
      </div>

      <div className="flex gap-2 flex-wrap">
        {categories.map(c => (
          <button key={c} onClick={() => setCat(c)}
            className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors
              ${cat === c ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"}`}>
            {c}
          </button>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-3">
        {filtered.map((e, i) => (
          <motion.div key={e.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
            className="bg-card border border-border rounded-2xl p-4 hover:shadow-sm hover:border-primary/20 transition-all cursor-pointer group flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Library className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors truncate">{e.title}</p>
              <div className="flex items-center gap-2 mt-1 flex-wrap">
                <span className="text-[10px] bg-muted text-muted-foreground px-2 py-0.5 rounded-md">{e.category}</span>
                {e.tags.map(t => (
                  <span key={t} className="text-[10px] bg-primary/8 text-primary px-2 py-0.5 rounded-md flex items-center gap-0.5">
                    <Tag className="h-2.5 w-2.5" />{t}
                  </span>
                ))}
              </div>
            </div>
            <div className="flex flex-col items-end gap-1 flex-shrink-0">
              <span className="text-xs text-muted-foreground flex items-center gap-1"><Eye className="h-3 w-3" />{e.views}</span>
              <span className="text-xs text-muted-foreground flex items-center gap-1"><Star className="h-3 w-3 text-secondary" />{e.rating}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
