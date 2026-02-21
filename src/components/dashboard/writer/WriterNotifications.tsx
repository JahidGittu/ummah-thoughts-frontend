import { motion } from "framer-motion";
import { Bell, MessageSquare, Eye, ThumbsUp, CheckCircle2, Clock, Star, AlertCircle } from "lucide-react";

const notifications = [
  { id: 1, type: "comment", icon: MessageSquare, color: "text-blue-500 bg-blue-500/10", title: "New comment on your article", desc: "\"The Role of Ijtihad in Contemporary Law\" received a comment from Dr. Ahmad Al-Rashid", time: "5 min ago", read: false },
  { id: 2, type: "view", icon: Eye, color: "text-primary bg-primary/10", title: "Your article reached 5K views", desc: "\"Women Scholars in Classical Islam\" has passed 5,000 views milestone", time: "2 hours ago", read: false },
  { id: 3, type: "like", icon: ThumbsUp, color: "text-secondary bg-secondary/10", title: "50 new likes this week", desc: "Your content is getting great engagement across the platform", time: "Yesterday", read: false },
  { id: 4, type: "approved", icon: CheckCircle2, color: "text-emerald-500 bg-emerald-500/10", title: "Article approved for publication", desc: "\"Maqasid and Human Rights\" has been reviewed and approved by the editorial team", time: "2 days ago", read: true },
  { id: 5, type: "review", icon: AlertCircle, color: "text-rose-500 bg-rose-500/10", title: "Revision requested", desc: "The peer review team has requested minor revisions on your latest submission", time: "3 days ago", read: true },
  { id: 6, type: "star", icon: Star, color: "text-secondary bg-secondary/10", title: "Featured article", desc: "Your article was selected as the \"Editor's Pick\" for this week", time: "1 week ago", read: true },
];

const filters = ["All", "Unread", "Comments", "Reviews", "Milestones"];

export default function WriterNotifications() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex gap-2 flex-wrap">
          {filters.map((f, i) => (
            <button key={f} className={`text-xs font-semibold px-3 py-1.5 rounded-full transition-colors
              ${i === 0 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"}`}>
              {f}
            </button>
          ))}
        </div>
        <button className="text-xs text-primary hover:underline font-medium">Mark all as read</button>
      </div>

      <div className="space-y-3">
        {notifications.map((n, i) => (
          <motion.div key={n.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
            className={`flex items-start gap-4 p-4 rounded-2xl border transition-colors cursor-pointer
              ${n.read ? "bg-card border-border hover:bg-muted/30" : "bg-primary/3 border-primary/20 hover:bg-primary/5"}`}>
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${n.color}`}>
              <n.icon className="h-5 w-5" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <p className={`text-sm font-semibold ${n.read ? "text-foreground" : "text-foreground"}`}>{n.title}</p>
                {!n.read && <span className="w-2 h-2 bg-primary rounded-full flex-shrink-0 mt-1.5" />}
              </div>
              <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{n.desc}</p>
              <p className="text-[10px] text-muted-foreground mt-2 flex items-center gap-1">
                <Clock className="h-3 w-3" /> {n.time}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
