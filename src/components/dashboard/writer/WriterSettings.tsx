import { motion } from "framer-motion";
import { Bell, Lock, Globe, Eye, Mail, Shield } from "lucide-react";

const sections = [
  {
    title: "Notifications", icon: Bell, color: "text-primary bg-primary/10",
    items: [
      { label: "Email on new comment", desc: "Get notified when someone comments on your articles", on: true },
      { label: "Weekly performance digest", desc: "Summary of views, likes and reader growth", on: true },
      { label: "Editorial review updates", desc: "Track status changes of your submissions", on: true },
      { label: "Platform announcements", desc: "News about new features and updates", on: false },
    ],
  },
  {
    title: "Privacy", icon: Eye, color: "text-blue-500 bg-blue-500/10",
    items: [
      { label: "Public profile", desc: "Allow readers to view your writer profile", on: true },
      { label: "Show article statistics", desc: "Display views and engagement on your profile", on: false },
      { label: "Appear in author directory", desc: "Be listed in the platform's writer directory", on: true },
    ],
  },
  {
    title: "Publishing", icon: Globe, color: "text-secondary bg-secondary/10",
    items: [
      { label: "Auto-save drafts", desc: "Automatically save drafts every 5 minutes", on: true },
      { label: "Email subscription widget", desc: "Show subscribe button on your articles", on: false },
    ],
  },
];

function Toggle({ on }: { on: boolean }) {
  return (
    <div className={`w-11 h-6 rounded-full relative transition-colors cursor-pointer ${on ? "bg-primary" : "bg-muted"}`}>
      <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all ${on ? "left-5.5 translate-x-0.5" : "left-0.5"}`} />
    </div>
  );
}

export default function WriterSettings() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {sections.map((sec, i) => (
        <motion.div key={sec.title} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
          className="bg-card border border-border rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${sec.color}`}>
              <sec.icon className="h-4 w-4" />
            </div>
            <h3 className="font-semibold text-foreground">{sec.title}</h3>
          </div>
          <div className="space-y-4">
            {sec.items.map(item => (
              <div key={item.label} className="flex items-center justify-between gap-4">
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">{item.label}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{item.desc}</p>
                </div>
                <Toggle on={item.on} />
              </div>
            ))}
          </div>
        </motion.div>
      ))}

      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
        className="bg-card border border-border rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center text-destructive bg-destructive/10">
            <Shield className="h-4 w-4" />
          </div>
          <h3 className="font-semibold text-foreground">Security</h3>
        </div>
        <div className="space-y-3">
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border border-border hover:bg-muted/50 transition-colors text-sm font-medium text-foreground">
            <Lock className="h-4 w-4 text-muted-foreground" /> Change Password
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border border-border hover:bg-muted/50 transition-colors text-sm font-medium text-foreground">
            <Mail className="h-4 w-4 text-muted-foreground" /> Change Email Address
          </button>
        </div>
      </motion.div>
    </div>
  );
}
