"use client"

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Scale, MessageSquare, Video, Search,
  BookOpen, Users, Clock, GraduationCap,
  LayoutDashboard, Bookmark, ThumbsUp, Flame,
  ChevronRight, Swords, Eye, Sparkles,
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { DebateCard } from "@/components/debates/DebateCard";
import { DebatePanel } from "@/components/debates/DebatePanel";
import { LiveDebateRoom } from "@/components/debates/LiveDebateRoom";
import { ScholarLoginModal, ScholarProfile } from "@/components/debates/ScholarLoginModal";
import { ScholarDashboard } from "@/components/debates/ScholarDashboard";
import { DebateRSVPModal } from "@/components/debates/DebateRSVPModal";
import { cn } from "@/lib/utils";

// ─── Mock data ─────────────────────────────────────────────────────────────────
const mockDebates = [
  {
    id: "1",
    title: "Is Shura Binding or Advisory?",
    titleAr: "هل الشورى ملزمة أم استشارية؟",
    status: "active" as const,
    format: "async" as const,
    topic: "Islamic Governance",
    participants: {
      positionA: { name: "Dr. Ahmad Al-Rashid", role: "Scholar" },
      positionB: { name: "Sh. Muhammad Hasan",  role: "Scholar" },
    },
    scheduledDate: "Feb 1 – Feb 15",
    duration: "2 weeks",
    votesClarity: 127,
    bookmarks: 89,
  },
  {
    id: "2",
    title: "Modern Applications of Khilafah",
    titleAr: "التطبيقات المعاصرة للخلافة",
    status: "upcoming" as const,
    format: "live" as const,
    topic: "Political Theory",
    participants: {
      positionA: { name: "Dr. Fatima Zahra",    role: "Researcher" },
      positionB: { name: "Prof. Ibrahim Khalil", role: "Academic" },
    },
    scheduledDate: "Feb 10, 7:00 PM",
    duration: "2 hours",
    votesClarity: 0,
    bookmarks: 45,
  },
  {
    id: "3",
    title: "Conditions for Valid Bay'ah",
    titleAr: "شروط البيعة الصحيحة",
    status: "concluded" as const,
    format: "async" as const,
    topic: "Fiqh al-Siyasah",
    participants: {
      positionA: { name: "Sh. Abdullah Farooq", role: "Scholar" },
      positionB: { name: "Dr. Maryam Hassan",   role: "Scholar" },
    },
    duration: "3 weeks",
    votesClarity: 234,
    bookmarks: 156,
  },
];

const sampleDebateDetail = {
  title: "Is Shura Binding or Advisory?",
  titleAr: "هل الشورى ملزمة أم استشارية؟",
  topic: "Islamic Governance",
  status: "active" as const,
  positionA: {
    scholar: { name: "Dr. Ahmad Al-Rashid", title: "Professor of Islamic Political Thought" },
    position: "Shura is binding (mulzimah) on the ruler",
    summary: "The Quranic imperative 'wa shawirhum fil-amr' combined with the practice of the Rashidun Caliphs establishes that consultation is not merely recommended but obligatory, and its outcomes bind the ruler.",
    evidence: [
      { type: "quran" as const, reference: "Surah Ash-Shura 42:38", arabic: "وَأَمْرُهُمْ شُورَىٰ بَيْنَهُمْ", translation: "And their affairs are conducted by mutual consultation" },
      { type: "hadith" as const, reference: "Reported in various collections", translation: "The Prophet ﷺ consulted his companions and often followed their majority opinion" },
    ],
    methodology: "Textual analysis combined with historical precedent from the Rashidun era",
  },
  positionB: {
    scholar: { name: "Sh. Muhammad Hasan", title: "Senior Scholar, Dar al-Ifta" },
    position: "Shura is advisory (mu'limah) to the ruler",
    summary: "While consultation is obligatory, the final decision rests with the ruler who bears responsibility. The verse 'fa idha 'azamta fatawakkal' indicates the ruler's ultimate authority after consultation.",
    evidence: [
      { type: "quran" as const, reference: "Surah Aal-Imran 3:159", arabic: "فَإِذَا عَزَمْتَ فَتَوَكَّلْ عَلَى اللَّهِ", translation: "Then when you have decided, put your trust in Allah" },
      { type: "scholarly" as const, reference: "Al-Mawardi, Al-Ahkam al-Sultaniyyah", translation: "Classical scholars emphasized the ruler's discretion in implementing consultation outcomes" },
    ],
    methodology: "Classical fiqh tradition with emphasis on governmental stability",
  },
  agreementPoints: ["Shura (consultation) is obligatory for the Muslim ruler", "The practice of the Rashidun Caliphs serves as a model", "Shura promotes justice and prevents tyranny", "The Ummah has a right to participate in governance"],
  disagreementPoints: ["Whether the outcome of Shura legally binds the ruler", "The scope of issues requiring mandatory consultation", "Whether modern parliamentary systems fulfill Shura requirements"],
  clarityVotes: { positionA: 73, positionB: 54 },
};

const TABS = [
  { key: "all",       label: "All Debates",  icon: Scale },
  { key: "active",    label: "Active",        icon: Flame },
  { key: "upcoming",  label: "Upcoming",      icon: Clock },
  { key: "concluded", label: "Concluded",     icon: BookOpen },
  { key: "async",     label: "Written",       icon: MessageSquare },
  { key: "live",      label: "Live",          icon: Video },
];

// ─── Component ──────────────────────────────────────────────────────────────────
const Debates = () => {
  const [activeTab, setActiveTab]               = useState("all");
  const [selectedDebate, setSelectedDebate]     = useState<string | null>(null);
  const [searchQuery, setSearchQuery]           = useState("");
  const [inLiveRoom, setInLiveRoom]             = useState(false);
  const [showScholarLogin, setShowScholarLogin] = useState(false);
  const [scholarProfile, setScholarProfile]     = useState<ScholarProfile | null>(null);
  const [showScholarDashboard, setShowScholarDashboard] = useState(false);
  const [rsvpDebate, setRsvpDebate]             = useState<typeof mockDebates[0] | null>(null);

  const handleScholarLogin = (s: ScholarProfile) => { setScholarProfile(s); setShowScholarLogin(false); setShowScholarDashboard(true); };
  const handleScholarLogout = () => { setScholarProfile(null); setShowScholarDashboard(false); };

  const filteredDebates = mockDebates.filter(d => {
    const matchTab = activeTab === "all" || d.status === activeTab || d.format === activeTab;
    const matchSearch = !searchQuery || d.title.toLowerCase().includes(searchQuery.toLowerCase()) || d.topic.toLowerCase().includes(searchQuery.toLowerCase());
    return matchTab && matchSearch;
  });

  // ── Live room ──
  if (inLiveRoom) {
    return (
      <div className="min-h-screen bg-background">
        <div className="pt-20">
          <LiveDebateRoom
            title="Modern Applications of Khilafah"
            topic="Political Theory"
            moderator={{ id: "m1", name: "Sh. Imran Hussain", role: "moderator" }}
            speakers={[
              { id: "s1", name: "Dr. Fatima Zahra",    role: "scholar", isSpeaking: true },
              { id: "s2", name: "Prof. Ibrahim Khalil", role: "scholar", isSpeaking: false },
            ]}
            viewers={243}
            duration="45:12"
            currentPhase="position_a"
            onLeave={() => setInLiveRoom(false)}
          />
        </div>
      </div>
    );
  }

  // ── Debate detail ──
  if (selectedDebate) {
    return (
      <div className="min-h-screen bg-background">
    
        <main className="pt-24 pb-16 px-4">
          <div className="max-w-6xl mx-auto">
            <Button variant="ghost" onClick={() => setSelectedDebate(null)} className="mb-6">
              ← Back to Debates
            </Button>
            <DebatePanel {...sampleDebateDetail} />
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <ScholarLoginModal isOpen={showScholarLogin} onClose={() => setShowScholarLogin(false)} onLogin={handleScholarLogin} />
      {rsvpDebate && (
        <DebateRSVPModal
          isOpen={!!rsvpDebate}
          onClose={() => setRsvpDebate(null)}
          debate={rsvpDebate}
        />
      )}

      <main className="pt-28 pb-24 px-4">
        <div className="max-w-7xl mx-auto space-y-14">

          {/* ── Scholar Dashboard ── */}
          {showScholarDashboard && scholarProfile ? (
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div>
                  <h1 className="text-3xl font-bold text-foreground">Scholar Dashboard</h1>
                  <p className="text-muted-foreground text-sm mt-1">Manage your debates, invites, and responses</p>
                </div>
                <Button variant="outline" className="rounded-xl gap-2" onClick={() => setShowScholarDashboard(false)}>
                  ← Back to Debates
                </Button>
              </div>
              <ScholarDashboard scholar={scholarProfile} onLogout={handleScholarLogout} />
            </motion.div>
          ) : (
            <>
              {/* ── Hero ── */}
              <motion.section
                initial={{ opacity: 0, y: 28 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                className="relative text-center space-y-6 py-6"
              >
                {/* decorative blobs */}
                <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-primary/5 rounded-full blur-3xl pointer-events-none" />

                <div className="relative space-y-5">
                  <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold">
                    <Scale className="h-3.5 w-3.5" /> Ikhtilaf Panel · Adab al-Ikhtilaf
                  </span>

                  <h1 className="text-5xl md:text-7xl font-display font-bold text-foreground tracking-tight leading-[1.05]">
                    Scholarly<br />
                    <span className="text-primary">Debates</span>
                  </h1>

                  <div className="w-14 h-0.5 bg-secondary rounded-full mx-auto" />

                  <p className="text-muted-foreground text-lg md:text-xl max-w-xl mx-auto leading-relaxed">
                    Evidence-based discourse in the tradition of <em>adab al-ikhtilaf</em>. No comment wars — only structured scholarly exchange.
                  </p>

                  <div className="flex items-center justify-center gap-3 flex-wrap pt-1">
                    {scholarProfile ? (
                      <Button className="rounded-xl gap-2 shadow-sm" onClick={() => setShowScholarDashboard(true)}>
                        <LayoutDashboard className="h-4 w-4" /> My Scholar Dashboard
                      </Button>
                    ) : (
                      <Button variant="outline" className="rounded-xl gap-2 border-primary/30 text-primary hover:bg-primary/5" onClick={() => setShowScholarLogin(true)}>
                        <GraduationCap className="h-4 w-4" /> Scholar Login
                      </Button>
                    )}
                    <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Eye className="h-3.5 w-3.5" /> Read debates & vote on clarity as a viewer
                    </span>
                  </div>
                </div>
              </motion.section>

              {/* ── Stats ── */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { icon: Scale,    label: "Active Debates",        value: "3",      color: "text-primary",     bg: "bg-primary/10" },
                  { icon: Users,    label: "Participating Scholars", value: "12",     color: "text-secondary",   bg: "bg-secondary/10" },
                  { icon: BookOpen, label: "Topics Covered",         value: "24",     color: "text-amber-600",   bg: "bg-amber-500/10" },
                  { icon: ThumbsUp, label: "Clarity Votes Cast",     value: "1.8k",   color: "text-emerald-600", bg: "bg-emerald-500/10" },
                ].map((s, i) => (
                  <motion.div key={s.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
                    className="rounded-2xl border border-border bg-card p-5 flex items-center gap-4">
                    <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0", s.bg)}>
                      <s.icon className={cn("h-6 w-6", s.color)} />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-foreground">{s.value}</p>
                      <p className="text-xs text-muted-foreground leading-tight">{s.label}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* ── LIVE Banner ── */}
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative overflow-hidden flex items-center justify-between gap-6 p-6 rounded-3xl bg-gradient-to-r from-emerald-600/10 via-primary/8 to-emerald-600/5 border border-emerald-500/25"
              >
                <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: "radial-gradient(circle at 20% 50%, hsl(var(--primary)) 0%, transparent 60%)" }} />
                <div className="relative flex items-center gap-5">
                  <div className="w-14 h-14 rounded-2xl bg-emerald-500/15 border border-emerald-500/25 flex items-center justify-center flex-shrink-0">
                    <span className="w-4 h-4 rounded-full bg-emerald-500 animate-pulse" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Badge className="bg-emerald-500 text-white border-0 text-[10px] font-bold px-2 py-0.5">🔴 LIVE NOW</Badge>
                      <span className="text-xs text-muted-foreground flex items-center gap-1"><Users className="h-3 w-3" /> 243 watching</span>
                    </div>
                    <p className="font-bold text-foreground text-lg leading-tight">Modern Applications of Khilafah</p>
                    <p className="text-sm text-muted-foreground">Dr. Fatima Zahra <Swords className="h-3 w-3 inline mx-1" /> Prof. Ibrahim Khalil</p>
                  </div>
                </div>
                <Button
                  className="relative bg-emerald-600 hover:bg-emerald-700 text-white gap-2 rounded-xl flex-shrink-0 shadow-md"
                  onClick={() => setInLiveRoom(true)}
                >
                  <Video className="h-4 w-4" /> Join Live
                </Button>
              </motion.div>

              {/* ── Search + Tabs ── */}
              <div className="space-y-5">
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search debates by topic, scholar, or keyword…"
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                      className="pl-11 h-11 rounded-xl"
                    />
                  </div>
                </div>

                {/* Tab pills */}
                <div className="flex gap-2 flex-wrap">
                  {TABS.map(tab => {
                    const Icon = tab.icon;
                    const active = activeTab === tab.key;
                    return (
                      <button
                        key={tab.key}
                        onClick={() => setActiveTab(tab.key)}
                        className={cn(
                          "flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-all border",
                          active
                            ? "bg-primary text-primary-foreground border-primary shadow-sm"
                            : "bg-card text-muted-foreground border-border hover:text-foreground hover:bg-muted"
                        )}
                      >
                        <Icon className="h-3.5 w-3.5" />
                        {tab.label}
                        {tab.key === "active" && (
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Cards grid */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTab + searchQuery}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.2 }}
                    className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
                  >
                    {filteredDebates.map(debate => (
                      <DebateCard
                        key={debate.id}
                        {...debate}
                        onView={() => {
                          if (debate.status === "upcoming") {
                            setRsvpDebate(debate);
                          } else if (debate.status === "active" && (debate.format as string) === "live") {
                            setInLiveRoom(true);
                          } else {
                            setSelectedDebate(debate.id);
                          }
                        }}
                      />
                    ))}
                  </motion.div>
                </AnimatePresence>

                {filteredDebates.length === 0 && (
                  <div className="text-center py-20">
                    <Scale className="h-14 w-14 mx-auto mb-4 text-muted-foreground opacity-30" />
                    <p className="text-muted-foreground text-lg font-medium">No debates match this filter.</p>
                    <p className="text-sm text-muted-foreground mt-1">Try "All Debates" or a different search term.</p>
                  </div>
                )}
              </div>

              {/* ── Role cards ── */}
              <div className="grid md:grid-cols-2 gap-5">
                {/* Scholar card */}
                <div className="group relative overflow-hidden rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/8 to-primary/3 p-7 space-y-4">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl" />
                  <div className="relative flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center">
                      <GraduationCap className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-bold text-foreground text-lg">Are you a Scholar?</h3>
                      <p className="text-xs text-muted-foreground">Access your debate management panel</p>
                    </div>
                  </div>
                  <p className="relative text-sm text-muted-foreground leading-relaxed">
                    Verified scholars can accept debate invitations, submit written responses, attend live sessions, and track their debate history.
                  </p>
                  <ul className="relative space-y-1.5">
                    {["✓ Accept & manage debate invitations", "✓ Submit structured written positions", "✓ Attend & moderate live sessions"].map(item => (
                      <li key={item} className="text-sm text-foreground/80 flex items-center gap-2">{item}</li>
                    ))}
                  </ul>
                  <Button className="relative w-full rounded-xl gap-2" onClick={() => setShowScholarLogin(true)}>
                    <GraduationCap className="h-4 w-4" /> Scholar Login →
                  </Button>
                </div>

                {/* Viewer card */}
                <div className="relative overflow-hidden rounded-3xl border border-border bg-card p-7 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-muted flex items-center justify-center">
                      <Eye className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <div>
                      <h3 className="font-bold text-foreground text-lg">For Regular Readers</h3>
                      <p className="text-xs text-muted-foreground">Your role in the debates</p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Read every debate thread in full, vote on which position made the clearest argument, and bookmark debates for later study.
                  </p>
                  <ul className="space-y-2">
                    {[
                      { icon: BookOpen,  text: "Read all debate threads & evidence" },
                      { icon: ThumbsUp,  text: "Vote on argument clarity" },
                      { icon: Bookmark,  text: "Bookmark & share debates" },
                      { icon: Sparkles,  text: "Emoji reactions per debate turn" },
                    ].map(item => (
                      <li key={item.text} className="flex items-center gap-2.5 text-sm text-muted-foreground">
                        <item.icon className="h-3.5 w-3.5 text-primary flex-shrink-0" />
                        {item.text}
                      </li>
                    ))}
                  </ul>
                  <Button variant="outline" className="w-full rounded-xl gap-2" onClick={() => setSelectedDebate("1")}>
                    <ChevronRight className="h-4 w-4" /> Browse Debates
                  </Button>
                </div>
              </div>

              {/* ── Adab notice ── */}
              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
                className="relative overflow-hidden rounded-3xl border border-primary/15 bg-gradient-to-br from-primary/6 to-secondary/4 px-8 py-9"
              >
                <div className="absolute right-8 top-6 text-primary/10 text-8xl font-amiri select-none pointer-events-none">⚖</div>
                <div className="flex items-start gap-5 relative">
                  <Scale className="h-9 w-9 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="text-xl font-bold text-foreground mb-2">The Ethics of Scholarly Disagreement <span className="text-muted-foreground font-normal text-base">(Adab al-Ikhtilaf)</span></h3>
                    <p className="text-muted-foreground leading-relaxed">
                      All debates on Ummah Thoughts follow strict protocols: positions must be evidence-based, personal attacks are prohibited, and both sides acknowledge valid points. Members vote on <em>clarity of argumentation</em>, not on who "won" — because in scholarly discourse, the pursuit of truth benefits everyone.
                    </p>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default Debates;
