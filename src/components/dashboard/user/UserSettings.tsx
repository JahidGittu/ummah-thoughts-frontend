import { useState } from "react";
import { motion } from "framer-motion";
import { Bell, Eye, Globe, Lock, Mail, Shield, BookOpen, Moon, Sun, Check } from "lucide-react";
import { useTranslation } from "react-i18next";

type SettingItem = { label: string; desc: string; on: boolean };

function Toggle({ on, onChange }: { on: boolean; onChange: () => void }) {
  return (
    <button
      onClick={onChange}
      aria-checked={on}
      role="switch"
      className={`w-11 h-6 rounded-full relative transition-colors flex-shrink-0 ${on ? "bg-blue-500" : "bg-muted"}`}
    >
      <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-all duration-200 flex items-center justify-center ${on ? "left-[22px]" : "left-0.5"}`}>
        {on && <Check className="w-2.5 h-2.5 text-blue-500" />}
      </span>
    </button>
  );
}

export default function UserSettings() {
  const { t } = useTranslation();

  const [notifSettings, setNotifSettings] = useState([
    { label: "New content in my tracks", desc: "Notify when new lessons or articles are added to my learning tracks", on: true },
    { label: "Discussion replies", desc: "When someone replies to my discussions or questions", on: true },
    { label: "Streak reminders", desc: "Daily reminder to maintain my learning streak", on: true },
    { label: "Achievement unlocked", desc: "Celebrate when you earn a new badge", on: true },
    { label: "Weekly digest email", desc: "Summary of new content and your progress every Friday", on: false },
  ]);

  const [privacySettings, setPrivacySettings] = useState([
    { label: "Public learning profile", desc: "Allow others to see your reading progress and badges", on: false },
    { label: "Show in discussion leaderboard", desc: "Display your name in top contributors list", on: true },
    { label: "Allow scholar messages", desc: "Let scholars reply to your questions directly", on: true },
    { label: "Anonymous discussion mode", desc: "Post questions without showing your username", on: false },
  ]);

  const [learningSettings, setLearningSettings] = useState([
    { label: "Daily learning goal reminder", desc: "Remind me to study at least 20 minutes per day", on: true },
    { label: "Show reading time on articles", desc: "Display estimated read time before opening content", on: true },
    { label: "Autoplay next lesson", desc: "Automatically start the next lesson when one finishes", on: false },
    { label: "Show difficulty level", desc: "Display beginner/intermediate/advanced tags on content", on: true },
  ]);

  const toggle = (
    list: SettingItem[],
    setList: React.Dispatch<React.SetStateAction<SettingItem[]>>,
    idx: number
  ) => {
    setList(prev => prev.map((item, i) => i === idx ? { ...item, on: !item.on } : item));
  };

  const sections = [
    { title: "Notifications", icon: Bell, color: "text-primary bg-primary/10", items: notifSettings, set: setNotifSettings },
    { title: "Privacy", icon: Eye, color: "text-blue-500 bg-blue-500/10", items: privacySettings, set: setPrivacySettings },
    { title: "Learning Preferences", icon: BookOpen, color: "text-secondary bg-secondary/10", items: learningSettings, set: setLearningSettings },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {sections.map((sec, i) => (
        <motion.div key={sec.title} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
          className="bg-card border border-border rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${sec.color}`}><sec.icon className="h-4 w-4" /></div>
            <h3 className="font-semibold text-foreground">{sec.title}</h3>
          </div>
          <div className="space-y-4">
            {sec.items.map((item, idx) => (
              <div key={item.label} className="flex items-center justify-between gap-4 p-3 rounded-xl hover:bg-muted/30 transition-colors">
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">{item.label}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{item.desc}</p>
                </div>
                <Toggle on={item.on} onChange={() => toggle(sec.items, sec.set, idx)} />
              </div>
            ))}
          </div>
        </motion.div>
      ))}

      {/* Appearance */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
        className="bg-card border border-border rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center text-muted-foreground bg-muted"><Globe className="h-4 w-4" /></div>
          <h3 className="font-semibold text-foreground">Appearance & Language</h3>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="p-4 rounded-xl border-2 border-primary bg-primary/5 flex items-center gap-3 cursor-pointer">
            <Sun className="h-5 w-5 text-primary" />
            <div>
              <p className="text-sm font-semibold text-primary">Light Mode</p>
              <p className="text-xs text-muted-foreground">Currently active</p>
            </div>
          </div>
          <div className="p-4 rounded-xl border-2 border-border flex items-center gap-3 cursor-pointer hover:border-muted-foreground/30 transition-colors">
            <Moon className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium text-foreground">Dark Mode</p>
              <p className="text-xs text-muted-foreground">Switch theme</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Security */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}
        className="bg-card border border-border rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center text-destructive bg-destructive/10"><Shield className="h-4 w-4" /></div>
          <h3 className="font-semibold text-foreground">Security</h3>
        </div>
        <div className="space-y-3">
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border border-border hover:bg-muted/50 transition-colors text-sm font-medium text-foreground text-left">
            <Lock className="h-4 w-4 text-muted-foreground" />
            <div className="flex-1">
              <p className="font-medium">Change Password</p>
              <p className="text-xs text-muted-foreground">Last changed 3 months ago</p>
            </div>
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border border-border hover:bg-muted/50 transition-colors text-sm font-medium text-foreground text-left">
            <Mail className="h-4 w-4 text-muted-foreground" />
            <div className="flex-1">
              <p className="font-medium">Change Email Address</p>
              <p className="text-xs text-muted-foreground">user@ummahthoughts.com</p>
            </div>
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border border-destructive/20 bg-destructive/5 hover:bg-destructive/10 transition-colors text-sm font-medium text-destructive text-left">
            <Shield className="h-4 w-4" />
            <div className="flex-1">
              <p className="font-medium">Delete Account</p>
              <p className="text-xs text-destructive/60">Permanently remove your data</p>
            </div>
          </button>
        </div>
      </motion.div>
    </div>
  );
}
