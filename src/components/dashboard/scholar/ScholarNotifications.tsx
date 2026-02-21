import { motion } from "framer-motion";
import { Bell, CheckCircle2, MessageSquare, Scale, UserCheck, AlertTriangle, Info, Clock } from "lucide-react";

const notifications = [
  { id: 1, type: "fatwa", icon: Scale, color: "text-primary bg-primary/10", title: "New Fatwa Request", desc: "A user asked about digital zakat calculation methods.", time: "5 min ago", unread: true },
  { id: 2, type: "debate", icon: MessageSquare, color: "text-rose-500 bg-rose-500/10", title: "Debate starts in 1 hour", desc: "\"Ijtihad in the Modern Age\" — You are a panelist.", time: "1 hr ago", unread: true },
  { id: 3, type: "review", icon: UserCheck, color: "text-purple-500 bg-purple-500/10", title: "Peer Review Request", desc: "Dr. Ibrahim Khalil requested your review on a new paper.", time: "3 hrs ago", unread: true },
  { id: 4, type: "info", icon: Info, color: "text-blue-500 bg-blue-500/10", title: "Publication Approved", desc: "Your fatwa on e-commerce transactions has been published.", time: "Yesterday", unread: false },
  { id: 5, type: "info", icon: CheckCircle2, color: "text-primary bg-primary/10", title: "Student Enrolled", desc: "42 new students enrolled in your Usul al-Fiqh course.", time: "Yesterday", unread: false },
  { id: 6, type: "alert", icon: AlertTriangle, color: "text-secondary bg-secondary/10", title: "Debate Response Needed", desc: "A counter-argument was posted in your debate thread.", time: "2 days ago", unread: false },
  { id: 7, type: "info", icon: Info, color: "text-blue-500 bg-blue-500/10", title: "Knowledge Base Updated", desc: "Your article was featured in the weekly digest.", time: "3 days ago", unread: false },
];

export default function ScholarNotifications() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-xl font-bold text-foreground">Notifications</h2>
          <p className="text-sm text-muted-foreground mt-0.5">3 unread notifications</p>
        </div>
        <button className="text-sm text-primary hover:underline font-medium">Mark all as read</button>
      </div>

      <div className="space-y-2">
        {notifications.map((n, i) => (
          <motion.div key={n.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
            className={`flex items-start gap-4 p-4 rounded-2xl border transition-all cursor-pointer hover:shadow-sm
              ${n.unread ? "bg-card border-primary/20 shadow-sm" : "bg-muted/30 border-border"}`}>
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${n.color}`}>
              <n.icon className="h-5 w-5" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <p className={`text-sm font-semibold ${n.unread ? "text-foreground" : "text-muted-foreground"}`}>{n.title}</p>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className="text-xs text-muted-foreground flex items-center gap-1"><Clock className="h-3 w-3" />{n.time}</span>
                  {n.unread && <span className="w-2 h-2 rounded-full bg-primary flex-shrink-0" />}
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{n.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
