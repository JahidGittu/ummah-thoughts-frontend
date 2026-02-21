import { useState } from "react";
import { motion } from "framer-motion";
import { Settings, Bell, Shield, Globe, Eye, Moon, Save } from "lucide-react";

const sections = [
  {
    title: "Notifications",
    icon: Bell,
    items: [
      { label: "New fatwa requests", desc: "Get notified when users submit fatwa requests", key: "fatwaReq" },
      { label: "Debate reminders", desc: "Reminders 1 hour before scheduled debates", key: "debateRemind" },
      { label: "Peer review requests", desc: "Notifications for incoming review requests", key: "peerReview" },
      { label: "Student messages", desc: "When students send you direct messages", key: "studentMsg" },
      { label: "Publication updates", desc: "When your publications are approved or commented on", key: "pubUpdate" },
    ],
  },
  {
    title: "Privacy",
    icon: Shield,
    items: [
      { label: "Public profile", desc: "Allow anyone to view your scholar profile", key: "publicProfile" },
      { label: "Show student count", desc: "Display number of enrolled students publicly", key: "showStudents" },
      { label: "Show publications", desc: "Make your works visible to non-members", key: "showPubs" },
    ],
  },
  {
    title: "Display",
    icon: Eye,
    items: [
      { label: "Dark mode", desc: "Use dark theme across the dashboard", key: "darkMode" },
      { label: "Compact sidebar", desc: "Use collapsed sidebar by default", key: "compactSidebar" },
      { label: "Arabic numerals", desc: "Display numbers in Arabic-Indic format", key: "arabicNums" },
    ],
  },
];

export default function ScholarSettings() {
  const [toggles, setToggles] = useState<Record<string, boolean>>({
    fatwaReq: true, debateRemind: true, peerReview: true, studentMsg: false, pubUpdate: true,
    publicProfile: true, showStudents: true, showPubs: false,
    darkMode: false, compactSidebar: false, arabicNums: false,
  });

  const toggle = (key: string) => setToggles(p => ({ ...p, [key]: !p[key] }));

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-xl font-bold text-foreground">Settings</h2>
        <button className="inline-flex items-center gap-2 bg-primary text-primary-foreground text-sm font-semibold px-4 py-2.5 rounded-xl hover:bg-primary/90 transition-colors">
          <Save className="h-4 w-4" /> Save Changes
        </button>
      </div>

      {sections.map((section, si) => (
        <motion.div key={section.title} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: si * 0.1 }}
          className="bg-card border border-border rounded-2xl overflow-hidden">
          <div className="flex items-center gap-3 px-5 py-4 border-b border-border bg-muted/30">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <section.icon className="h-4 w-4 text-primary" />
            </div>
            <h3 className="font-semibold text-foreground">{section.title}</h3>
          </div>
          <ul className="divide-y divide-border">
            {section.items.map(item => (
              <li key={item.key} className="flex items-center justify-between px-5 py-4 hover:bg-muted/20 transition-colors">
                <div>
                  <p className="text-sm font-medium text-foreground">{item.label}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{item.desc}</p>
                </div>
                <button
                  onClick={() => toggle(item.key)}
                  className={`relative w-11 h-6 rounded-full transition-colors flex-shrink-0 ml-4
                    ${toggles[item.key] ? "bg-primary" : "bg-muted"}`}>
                  <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform
                    ${toggles[item.key] ? "translate-x-5" : "translate-x-0"}`} />
                </button>
              </li>
            ))}
          </ul>
        </motion.div>
      ))}

      {/* Danger zone */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
        className="bg-destructive/5 border border-destructive/20 rounded-2xl p-5 space-y-3">
        <h3 className="font-semibold text-destructive">Danger Zone</h3>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-foreground">Deactivate Account</p>
            <p className="text-xs text-muted-foreground">Temporarily disable your scholar account</p>
          </div>
          <button className="text-xs font-semibold text-destructive border border-destructive/30 px-3 py-1.5 rounded-lg hover:bg-destructive/10 transition-colors">
            Deactivate
          </button>
        </div>
      </motion.div>
    </div>
  );
}
