import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { PenSquare, Save, FileText, Eye, ThumbsUp, Award } from "lucide-react";

export default function WriterProfile() {
  const { user } = useAuth();
  return (
    <div className="space-y-6 max-w-3xl">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
        className="bg-card border border-border rounded-2xl p-6">
        <div className="flex items-start gap-5">
          <div className="w-16 h-16 rounded-2xl bg-secondary text-secondary-foreground flex items-center justify-center text-2xl font-bold flex-shrink-0">
            {user?.avatar}
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-xl font-bold text-foreground">{user?.name}</h2>
            <p className="text-sm text-muted-foreground">{user?.specialization || "Content Writer"}</p>
            <p className="text-xs text-muted-foreground mt-1">Member since {user?.joinedAt}</p>
            <div className="flex gap-3 mt-3">
              {[{ icon: FileText, label: "31 Articles" }, { icon: Eye, label: "84K Views" }, { icon: ThumbsUp, label: "6.2K Likes" }].map(b => (
                <div key={b.label} className="flex items-center gap-1.5 text-xs text-muted-foreground bg-muted/50 px-3 py-1.5 rounded-full">
                  <b.icon className="h-3.5 w-3.5" /> {b.label}
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="bg-card border border-border rounded-2xl p-6 space-y-5">
        <h3 className="font-semibold text-foreground flex items-center gap-2"><PenSquare className="h-4 w-4 text-secondary" /> Edit Profile</h3>
        <div className="grid grid-cols-2 gap-4">
          {[{ label: "Full Name", value: user?.name || "" }, { label: "Email", value: user?.email || "" }].map(f => (
            <div key={f.label} className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{f.label}</label>
              <input defaultValue={f.value} className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
            </div>
          ))}
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Specialization</label>
          <input defaultValue={user?.specialization || ""} placeholder="e.g. Islamic Governance & History" className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Bio</label>
          <textarea rows={4} defaultValue={user?.bio || ""} placeholder="Tell readers about yourself..." className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none" />
        </div>
        <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity">
          <Save className="h-4 w-4" /> Save Changes
        </button>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
        className="bg-card border border-border rounded-2xl p-6">
        <h3 className="font-semibold text-foreground flex items-center gap-2 mb-4"><Award className="h-4 w-4 text-secondary" /> Writing Badges</h3>
        <div className="flex flex-wrap gap-3">
          {["Prolific Writer", "Top Contributor", "5K Views Club", "Editor's Pick", "Verified Author"].map(b => (
            <span key={b} className="text-xs font-semibold px-3 py-1.5 rounded-full bg-secondary/10 text-secondary border border-secondary/20">{b}</span>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
