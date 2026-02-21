import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { Save, Award, BookOpen, Star, ArrowUpCircle, PenSquare, FlaskConical, HandHeart, CheckCircle2, ChevronRight, Sparkles, Camera, Edit3, GraduationCap } from "lucide-react";
import { useTranslation } from "react-i18next";

const UPGRADE_ROLES = [
  {
    role: "writer" as const,
    label: "Writer",
    labelBn: "লেখক",
    icon: PenSquare,
    description: "Publish articles, manage drafts, and contribute written content to the platform.",
    descriptionBn: "নিবন্ধ প্রকাশ করুন, ড্র্যাফট পরিচালনা করুন এবং প্ল্যাটফর্মে লিখিত বিষয়বস্তু অবদান রাখুন।",
    perks: ["Publish articles", "Track readership", "Editorial submissions"],
    color: "from-secondary/15 to-secondary/5 border-secondary/25",
    iconColor: "text-secondary",
    badgeColor: "bg-secondary/10 text-secondary border-secondary/20",
  },
];

export default function UserProfile() {
  const { user } = useAuth();
  const { i18n } = useTranslation();
  const lang = i18n.language;
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [requested, setRequested] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [name, setName] = useState(user?.name || "");
  const [bio, setBio] = useState(user?.bio || "");
  const [interests, setInterests] = useState("Usul al-Fiqh, Islamic History, Governance");

  const handleRequest = (role: string) => {
    setRequested(role);
    setSelectedRole(null);
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Profile Card */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
        className="bg-card border border-border rounded-2xl p-6">
        <div className="flex items-start gap-5">
          <div className="relative group">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-primary flex items-center justify-center text-3xl font-bold text-white flex-shrink-0">
              {user?.avatar}
            </div>
            <button className="absolute inset-0 rounded-2xl bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <Camera className="h-5 w-5 text-white" />
            </button>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-xl font-bold text-foreground">{user?.name}</h2>
                <p className="text-sm text-muted-foreground flex items-center gap-1.5 mt-0.5">
                  <GraduationCap className="h-3.5 w-3.5" />
                  {lang === "bn" ? "শিক্ষার্থী · ইসলামী বিজ্ঞান" : "Learner · Islamic Sciences"}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {lang === "bn" ? "সদস্য হয়েছেন" : "Member since"} {user?.joinedAt}
                </p>
              </div>
              <div className="flex-shrink-0">
                <span className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full bg-blue-500/10 text-blue-600 border border-blue-400/20">
                  <Star className="h-3 w-3 fill-current" />
                  Level 3
                </span>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 mt-4">
              {[
                { icon: BookOpen, label: "86 Articles Read" },
                { icon: Star, label: "730 XP" },
                { icon: Award, label: "4 Badges" }
              ].map(b => (
                <div key={b.label} className="flex items-center gap-1.5 text-xs text-muted-foreground bg-muted/60 px-3 py-1.5 rounded-full">
                  <b.icon className="h-3.5 w-3.5" /> {b.label}
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Edit Profile */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}
        className="bg-card border border-border rounded-2xl p-6 space-y-5">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-foreground flex items-center gap-2">
            <Edit3 className="h-4 w-4 text-muted-foreground" />
            {lang === "bn" ? "প্রোফাইল সম্পাদনা করুন" : "Edit Profile"}
          </h3>
          {saved && (
            <motion.span initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
              className="text-xs font-semibold text-primary flex items-center gap-1">
              <CheckCircle2 className="h-3.5 w-3.5" /> Saved!
            </motion.span>
          )}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              {lang === "bn" ? "পুরো নাম" : "Full Name"}
            </label>
            <input value={name} onChange={e => setName(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all" />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              {lang === "bn" ? "ইমেইল" : "Email"}
            </label>
            <input defaultValue={user?.email || ""} readOnly
              className="w-full px-4 py-2.5 rounded-xl border border-border bg-muted/30 text-sm text-muted-foreground cursor-not-allowed" />
          </div>
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            {lang === "bn" ? "শেখার আগ্রহ" : "Learning Interests"}
          </label>
          <input value={interests} onChange={e => setInterests(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all" />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            {lang === "bn" ? "পরিচয়" : "Bio"}
          </label>
          <textarea rows={3} value={bio} onChange={e => setBio(e.target.value)}
            placeholder={lang === "bn" ? "আপনার শেখার যাত্রা সম্পর্কে বলুন..." : "Tell us about your learning journey..."}
            className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none transition-all" />
        </div>
        <button onClick={handleSave}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity">
          <Save className="h-4 w-4" />
          {lang === "bn" ? "পরিবর্তন সংরক্ষণ করুন" : "Save Changes"}
        </button>
      </motion.div>

      {/* Role Upgrade Section */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.16 }}
        className="bg-card border border-border rounded-2xl overflow-hidden">
        <div className="px-6 py-5 border-b border-border bg-gradient-to-r from-primary/5 to-secondary/5">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
              <ArrowUpCircle className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground flex items-center gap-2">
                {lang === "bn" ? "ভূমিকা আপগ্রেড করুন" : "Upgrade Your Role"}
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-secondary/15 text-secondary border border-secondary/20 uppercase tracking-wide">
                  Level Up
                </span>
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                {lang === "bn" ? "আরও গভীরভাবে প্ল্যাটফর্মে অবদান রাখুন" : "Expand your access and contribute more deeply to the platform"}
              </p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-4">
          <AnimatePresence>
            {requested && (
              <motion.div
                initial={{ opacity: 0, y: -8, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.97 }}
                className="flex items-start gap-3 bg-primary/8 border border-primary/20 rounded-xl px-4 py-3.5"
              >
                <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-primary">
                    {lang === "bn" ? "অনুরোধ পাঠানো হয়েছে!" : "Request Sent!"}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {lang === "bn"
                      ? `আপনার ${requested} ভূমিকার অনুরোধ জমা হয়েছে। ২৪-৪৮ ঘণ্টার মধ্যে পর্যালোচনা করা হবে।`
                      : `Your ${requested} role request has been submitted. Our team will review it within 24–48 hours.`}
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="grid grid-cols-1 gap-3">
            {UPGRADE_ROLES.map((r, i) => {
              const isSelected = selectedRole === r.role;
              const isRequested = requested === r.role;
              return (
                <motion.div key={r.role} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.18 + i * 0.06 }}>
                  <button
                    onClick={() => !isRequested && setSelectedRole(isSelected ? null : r.role)}
                    className={`w-full text-left bg-gradient-to-br ${r.color} border rounded-xl px-4 py-4 transition-all duration-200 ${isRequested ? "opacity-60 cursor-default" : "hover:shadow-md cursor-pointer"}`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-card flex items-center justify-center border border-border/60">
                          <r.icon className={`h-4 w-4 ${r.iconColor}`} />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-foreground">{lang === "bn" ? r.labelBn : r.label}</p>
                          <p className="text-xs text-muted-foreground leading-snug max-w-xs hidden sm:block">{lang === "bn" ? r.descriptionBn : r.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        {isRequested ? (
                          <span className={`text-[10px] font-bold px-2 py-1 rounded-full border ${r.badgeColor}`}>
                            {lang === "bn" ? "মুলতুবি" : "Pending"}
                          </span>
                        ) : (
                          <ChevronRight className={`h-4 w-4 text-muted-foreground transition-transform duration-200 ${isSelected ? "rotate-90" : ""}`} />
                        )}
                      </div>
                    </div>
                  </button>
                  <AnimatePresence>
                    {isSelected && !isRequested && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.22, ease: "easeInOut" }}
                        className="overflow-hidden"
                      >
                        <div className="border border-t-0 border-border rounded-b-xl bg-muted/30 px-4 py-4 space-y-4">
                          <p className="text-sm text-muted-foreground">{lang === "bn" ? r.descriptionBn : r.description}</p>
                          <div>
                            <p className="text-xs font-semibold text-foreground mb-2 uppercase tracking-wider">
                              {lang === "bn" ? "আপনি যা আনলক পাবেন" : "What you'll unlock"}
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {r.perks.map(p => (
                                <span key={p} className={`flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full border ${r.badgeColor}`}>
                                  <Sparkles className="h-3 w-3" /> {p}
                                </span>
                              ))}
                            </div>
                          </div>
                          <div className="flex gap-2 pt-1">
                            <button onClick={() => handleRequest(r.role)}
                              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity">
                              <ArrowUpCircle className="h-4 w-4" />
                              {lang === "bn" ? `${r.labelBn} হিসেবে অনুরোধ করুন` : `Request ${r.label} Role`}
                            </button>
                            <button onClick={() => setSelectedRole(null)}
                              className="px-4 py-2 rounded-xl border border-border text-muted-foreground text-sm hover:bg-muted transition-colors">
                              {lang === "bn" ? "বাতিল" : "Cancel"}
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>

          <p className="text-xs text-muted-foreground text-center pt-1">
            {lang === "bn"
              ? "আপগ্রেড উম্মাহ থটস দলের দ্বারা পর্যালোচনা করা হয়। ইমেইলে জানানো হবে।"
              : "Upgrades are reviewed by the Ummah Thoughts team. You'll be notified via email."}
          </p>
        </div>
      </motion.div>

      {/* Badges */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.24 }}
        className="bg-card border border-border rounded-2xl p-6">
        <h3 className="font-semibold text-foreground flex items-center gap-2 mb-4">
          <Award className="h-4 w-4 text-secondary" />
          {lang === "bn" ? "আমার ব্যাজ" : "My Badges"}
        </h3>
        <div className="flex flex-wrap gap-3">
          {[
            { icon: "🏅", label: "First Debate" },
            { icon: "📚", label: "50 Articles" },
            { icon: "🔥", label: "7-Day Streak" },
            { icon: "⭐", label: "Top Commenter" }
          ].map(b => (
            <div key={b.label} className="flex items-center gap-2 text-xs font-semibold px-3 py-2 rounded-full bg-primary/8 text-primary border border-primary/15">
              <span>{b.icon}</span> {b.label}
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
