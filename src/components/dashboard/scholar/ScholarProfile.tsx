import { useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { GraduationCap, Mail, Calendar, Edit3, Save, X, BookOpen, Star, Award } from "lucide-react";

export default function ScholarProfile() {
  const { user } = useAuth();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(user?.name || "");
  const [bio, setBio] = useState(user?.bio || "");
  const [spec, setSpec] = useState(user?.specialization || "");

  if (!user) return null;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-xl font-bold text-foreground">My Profile</h2>
        {!editing ? (
          <button onClick={() => setEditing(true)}
            className="inline-flex items-center gap-2 bg-muted text-foreground text-sm font-semibold px-4 py-2 rounded-xl hover:bg-muted/80 transition-colors">
            <Edit3 className="h-4 w-4" /> Edit Profile
          </button>
        ) : (
          <div className="flex gap-2">
            <button onClick={() => setEditing(false)}
              className="inline-flex items-center gap-2 bg-muted text-foreground text-sm font-semibold px-3 py-2 rounded-xl hover:bg-muted/80 transition-colors">
              <X className="h-4 w-4" /> Cancel
            </button>
            <button onClick={() => setEditing(false)}
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground text-sm font-semibold px-4 py-2 rounded-xl hover:bg-primary/90 transition-colors">
              <Save className="h-4 w-4" /> Save
            </button>
          </div>
        )}
      </div>

      {/* Avatar + basics */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
        className="bg-card border border-border rounded-3xl p-6 space-y-5">
        <div className="flex items-center gap-5">
          <div className="w-20 h-20 rounded-2xl bg-primary/15 flex items-center justify-center text-3xl font-bold text-primary flex-shrink-0">
            {user.avatar}
          </div>
          <div>
            {editing ? (
              <input value={name} onChange={e => setName(e.target.value)}
                className="text-xl font-bold text-foreground border-b-2 border-primary outline-none bg-transparent w-full mb-1" />
            ) : (
              <h3 className="text-xl font-bold text-foreground">{user.name}</h3>
            )}
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs font-bold bg-primary/10 text-primary px-2.5 py-1 rounded-full flex items-center gap-1">
                <GraduationCap className="h-3 w-3" /> Scholar
              </span>
              <span className="text-xs font-bold bg-secondary/10 text-secondary px-2.5 py-1 rounded-full flex items-center gap-1">
                <Star className="h-3 w-3" /> Verified
              </span>
            </div>
          </div>
        </div>

        <div className="grid gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Specialization</label>
            {editing ? (
              <input value={spec} onChange={e => setSpec(e.target.value)}
                className="w-full h-10 px-3 rounded-xl border border-border bg-muted/30 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
            ) : (
              <p className="text-sm text-foreground">{user.specialization || "Not set"}</p>
            )}
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Bio</label>
            {editing ? (
              <textarea value={bio} onChange={e => setBio(e.target.value)} rows={3}
                className="w-full px-3 py-2 rounded-xl border border-border bg-muted/30 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/30" />
            ) : (
              <p className="text-sm text-muted-foreground leading-relaxed">{user.bio || "No bio yet."}</p>
            )}
          </div>
        </div>

        <div className="pt-3 border-t border-border grid grid-cols-2 gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Mail className="h-4 w-4 text-primary flex-shrink-0" />
            <span className="truncate">{user.email}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-primary flex-shrink-0" />
            <span>Joined {user.joinedAt}</span>
          </div>
        </div>
      </motion.div>

      {/* Achievements */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
        className="bg-card border border-border rounded-3xl p-6 space-y-4">
        <h3 className="font-semibold text-foreground flex items-center gap-2"><Award className="h-4 w-4 text-secondary" />Scholar Badges</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { icon: "🎓", label: "Verified Scholar", unlocked: true },
            { icon: "📚", label: "100 Fatwas", unlocked: true },
            { icon: "🏆", label: "Top Moderator", unlocked: true },
            { icon: "🌟", label: "10K Students", unlocked: false },
          ].map(b => (
            <div key={b.label} className={`p-4 rounded-2xl border text-center transition-all
              ${b.unlocked ? "border-primary/20 bg-primary/5" : "border-border bg-muted/30 opacity-50"}`}>
              <p className="text-2xl mb-2">{b.icon}</p>
              <p className={`text-xs font-semibold leading-tight ${b.unlocked ? "text-foreground" : "text-muted-foreground"}`}>{b.label}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
