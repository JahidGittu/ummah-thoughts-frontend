import { motion } from "framer-motion";
import { FileText, Eye, ThumbsUp, MessageSquare, Clock, Search, Filter, PenSquare } from "lucide-react";

const articles = [
  { title: "The Role of Ijtihad in Contemporary Law", category: "Fiqh", status: "published", date: "Mar 12, 2025", views: "4.2K", likes: 312, comments: 28 },
  { title: "Women Scholars in Classical Islam", category: "History", status: "published", date: "Mar 5, 2025", views: "8.7K", likes: 640, comments: 54 },
  { title: "Maqasid and Human Rights", category: "Governance", status: "published", date: "Feb 20, 2025", views: "3.1K", likes: 210, comments: 19 },
  { title: "Ethics of Political Dissent in Islam", category: "Governance", status: "published", date: "Feb 10, 2025", views: "5.6K", likes: 430, comments: 37 },
  { title: "Shariah and the Modern State", category: "Law", status: "published", date: "Jan 28, 2025", views: "6.8K", likes: 510, comments: 44 },
  { title: "Digital Caliphate: A Critical Analysis", category: "Contemporary", status: "draft", date: "Editing", views: "–", likes: 0, comments: 0 },
  { title: "Fiqh of Social Media", category: "Contemporary", status: "review", date: "Under Review", views: "–", likes: 0, comments: 0 },
];

const statusColor: Record<string, string> = {
  published: "bg-primary/10 text-primary",
  draft: "bg-muted text-muted-foreground",
  review: "bg-secondary/10 text-secondary",
};

export default function WriterArticles() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input placeholder="Search articles..." className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border bg-card text-sm font-medium text-muted-foreground hover:bg-muted/50 transition-colors">
          <Filter className="h-4 w-4" /> Filter
        </button>
        <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity">
          <PenSquare className="h-4 w-4" /> New Article
        </button>
      </div>

      <div className="space-y-3">
        {articles.map((a, i) => (
          <motion.div key={a.title} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
            className="bg-card border border-border rounded-2xl p-5 hover:shadow-md transition-shadow cursor-pointer group">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-muted text-muted-foreground">{a.category}</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${statusColor[a.status]}`}>{a.status}</span>
                </div>
                <h3 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors truncate">{a.title}</h3>
                <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1"><Clock className="h-3 w-3" /> {a.date}</p>
              </div>
              {a.status === "published" && (
                <div className="flex items-center gap-4 flex-shrink-0 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><Eye className="h-3.5 w-3.5" /> {a.views}</span>
                  <span className="flex items-center gap-1"><ThumbsUp className="h-3.5 w-3.5" /> {a.likes}</span>
                  <span className="flex items-center gap-1"><MessageSquare className="h-3.5 w-3.5" /> {a.comments}</span>
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
