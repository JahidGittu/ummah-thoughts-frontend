import { motion } from "framer-motion";
import { Bell, BookOpen, MessageSquare, Star, Award, Clock, TrendingUp } from "lucide-react";

const notifications = [
  { id: 1, icon: TrendingUp, color: "text-blue-500 bg-blue-500/10", title: "New article in your track", desc: "\"Principles of Shura in Islamic Governance\" was added to your Islamic Politics learning path", time: "2 hours ago", read: false },
  { id: 2, icon: MessageSquare, color: "text-primary bg-primary/10", title: "Reply to your discussion", desc: "Dr. Ahmad Al-Rashid replied to your question in the Usul al-Fiqh discussion thread", time: "5 hours ago", read: false },
  { id: 3, icon: Award, color: "text-secondary bg-secondary/10", title: "Achievement unlocked!", desc: "You've earned the \"50 Articles\" badge. Keep up your learning streak!", time: "Yesterday", read: false },
  { id: 4, icon: BookOpen, color: "text-blue-500 bg-blue-500/10", title: "Course update available", desc: "New lesson added to \"Islamic Political History\" — Chapter 4: The Umayyad Era", time: "2 days ago", read: true },
  { id: 5, icon: Star, color: "text-secondary bg-secondary/10", title: "Daily wisdom reminder", desc: "Your daily Hadith reflection is ready. Spend 5 minutes deepening your knowledge.", time: "3 days ago", read: true },
  { id: 6, icon: Bell, color: "text-muted-foreground bg-muted", title: "Streak warning", desc: "You haven't studied today! Your 18-day streak is at risk — log in to keep it going.", time: "1 week ago", read: true },
];

export default function UserNotifications() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <div className="flex gap-2 flex-wrap">
          {["All", "Unread", "Learning", "Community"].map((f, i) => (
            <button key={f} className={`text-xs font-semibold px-3 py-1.5 rounded-full transition-colors ${i === 0 ? "bg-blue-500 text-white" : "bg-muted text-muted-foreground hover:bg-muted/80"}`}>{f}</button>
          ))}
        </div>
        <button className="text-xs text-primary hover:underline font-medium">Mark all as read</button>
      </div>
      <div className="space-y-3">
        {notifications.map((n, i) => (
          <motion.div key={n.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
            className={`flex items-start gap-4 p-4 rounded-2xl border cursor-pointer transition-colors ${n.read ? "bg-card border-border hover:bg-muted/30" : "bg-blue-500/5 border-blue-400/20"}`}>
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${n.color}`}><n.icon className="h-5 w-5" /></div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <p className="text-sm font-semibold text-foreground">{n.title}</p>
                {!n.read && <span className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-1.5" />}
              </div>
              <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{n.desc}</p>
              <p className="text-[10px] text-muted-foreground mt-2 flex items-center gap-1"><Clock className="h-3 w-3" />{n.time}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
