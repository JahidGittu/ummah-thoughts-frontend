import { motion } from "framer-motion";
import { Reply, ThumbsUp, Plus, Search, Clock } from "lucide-react";
import { useTranslation } from "react-i18next";

const threads = [
  { id: 1, title: "Can democracy be compatible with Islamic governance?", category: "Governance", replies: 24, likes: 47, lastActivity: "2 hours ago", myPost: true, status: "active" },
  { id: 2, title: "What are the conditions for legitimate political authority in Islam?", category: "Fiqh", replies: 15, likes: 32, lastActivity: "Yesterday", myPost: false, status: "active" },
  { id: 3, title: "How did Ibn Khaldun explain the rise and fall of civilizations?", category: "History", replies: 8, likes: 19, lastActivity: "3 days ago", myPost: true, status: "answered" },
  { id: 4, title: "Differences between Sunni and Shia political thought", category: "Comparative", replies: 31, likes: 58, lastActivity: "1 week ago", myPost: false, status: "active" },
];

export default function UserDiscussions() {
  const { t } = useTranslation();
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input placeholder={t("subpages.searchDiscussions")} className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity">
          <Plus className="h-4 w-4" /> {t("subpages.newDiscussion")}
        </button>
      </div>

      <div className="flex gap-2 flex-wrap">
        {[
          { key: "all", label: t("subpages.all") },
          { key: "my", label: t("subpages.myPosts") },
          { key: "following", label: t("subpages.following") },
          { key: "answered", label: t("subpages.answered") },
        ].map((f, i) => (
          <button key={f.key} className={`text-xs font-semibold px-3 py-1.5 rounded-full transition-colors ${i === 0 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"}`}>{f.label}</button>
        ))}
      </div>

      <div className="space-y-3">
        {threads.map((thread, i) => (
          <motion.div key={thread.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
            className="bg-card border border-border rounded-2xl p-5 hover:shadow-md transition-shadow cursor-pointer group">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-muted text-muted-foreground">{thread.category}</span>
                  {thread.myPost && <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary/10 text-primary">{t("subpages.myPosts")}</span>}
                  {thread.status === "answered" && <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary/10 text-primary">✓ {t("subpages.answered")}</span>}
                </div>
                <h3 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">{thread.title}</h3>
                <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><Reply className="h-3 w-3" /> {thread.replies} {t("subpages.replies")}</span>
                  <span className="flex items-center gap-1"><ThumbsUp className="h-3 w-3" /> {thread.likes}</span>
                  <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {thread.lastActivity}</span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
