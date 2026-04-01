// app/debates/page.tsx
"use client";

import { useState, useEffect, useId } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Scale, MessageSquare, Video, Search,
  BookOpen, Users, Clock, GraduationCap,
  LayoutDashboard, ThumbsUp, Flame,
  Swords, Eye, Sparkles, LogOut,
  Plus,
  Bookmark,
  ChevronRight
} from "lucide-react";
import { DebateCard } from "@/components/debates/DebateCard";
import { ScheduleDebateDialog } from "@/components/debates/ScheduleDebateDialog";
import { ScholarLoginModal } from "@/components/debates/ScholarLoginModal";
import { DebateRSVPModal } from "@/components/debates/DebateRSVPModal";
import { cn } from "@/lib/utils";
import { debateApi } from "@/lib/api";
import { apiDebateToStored } from "@/lib/debateApiAdapter";
import type { StoredDebate } from "@/lib/debateStorage";
import { toast } from "sonner";
import ScholarDashboardHome from "@/components/dashboard/roles/ScholarDashboardHome";
import { SkeletonDebateGrid, SkeletonStatCard } from "@/components/shared/SkeletonCard";
import { EmptyState } from "@/components/shared/EmptyState";

// Seed and load from storage (sync with dashboard)

const TABS = [
  { key: "all", label: "All Debates", icon: Scale },
  { key: "active", label: "Active", icon: Flame },
  { key: "upcoming", label: "Upcoming", icon: Clock },
  { key: "concluded", label: "Concluded", icon: BookOpen },
  { key: "async", label: "Written", icon: MessageSquare },
  { key: "live", label: "Live", icon: Video },
];

export default function DebatesPage() {
  const { user, login, logout } = useAuth();
  const router = useRouter();
  const tablistId = useId();

  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showScholarLogin, setShowScholarLogin] = useState(false);
  const [rsvpDebate, setRsvpDebate] = useState<any>(null);
  const [showScheduleDialog, setShowScheduleDialog] = useState(false);
  const [showScholarDashboard, setShowScholarDashboard] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [debates, setDebates] = useState<StoredDebate[]>([]);
  const [loading, setLoading] = useState(true);

  const refreshDebates = async (showLoading = true) => {
    if (showLoading) setLoading(true);
    const { data, error } = await debateApi.list();
    if (error) {
      toast.error(error);
      setDebates([]);
    } else if (data?.debates) {
      setDebates(data.debates.map(apiDebateToStored));
    } else {
      setDebates([]);
    }
    if (showLoading) setLoading(false);
  };

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 600);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    refreshDebates(true);
    const onFocus = () => refreshDebates(true);
    window.addEventListener("focus", onFocus);
    const poll = setInterval(() => refreshDebates(false), 30000); // Real-time: refresh every 30s (no loading flash)
    return () => {
      window.removeEventListener("focus", onFocus);
      clearInterval(poll);
    };
  }, []);

  const filteredDebates = debates.filter(d => {
    const matchTab = activeTab === "all" || d.status === activeTab || d.format === activeTab;
    const matchSearch = !searchQuery || d.title.toLowerCase().includes(searchQuery.toLowerCase()) || d.topic.toLowerCase().includes(searchQuery.toLowerCase());
    return matchTab && matchSearch;
  });

  const liveDebate = debates.find(d => d.status === "upcoming" && d.format === "live");

  const tabCounts = {
    all: debates.length,
    active: debates.filter(d => d.status === "active").length,
    upcoming: debates.filter(d => d.status === "upcoming").length,
    concluded: debates.filter(d => d.status === "concluded").length,
    async: debates.filter(d => d.format === "async").length,
    live: debates.filter(d => d.format === "live").length,
  };

  const handleScholarLogin = async (email: string, password: string) => {
    const result = await login(email, password);
    if (!result.success) {
      throw new Error(result.error);
    }
    setShowScholarLogin(false);
  };

  const handleLogout = () => {
    logout();
    setShowScholarDashboard(false);
  };

  const handleViewDebate = (debateId: string, format: string, status: string) => {
    // Always navigate to detail - public and registered users can view
    router.push(`/debates/${debateId}`);
  };

  // Scholar Dashboard View
  if (showScholarDashboard && user?.role === "scholar") {
    return (
      <div className="min-h-screen bg-background">
        <main className="pt-28 pb-24 px-4" id="main-content">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-bold text-foreground">Scholar Dashboard</h1>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setShowScholarDashboard(false)}>
                  Browse Debates
                </Button>
                <Button variant="outline" onClick={handleLogout} className="gap-2">
                  <LogOut className="h-4 w-4" aria-hidden="true" /> Logout
                </Button>
              </div>
            </div>
            <ScholarDashboardHome />
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <ScholarLoginModal
        isOpen={showScholarLogin}
        onClose={() => setShowScholarLogin(false)}
        onLogin={handleScholarLogin}
      />

      {rsvpDebate && (
        <DebateRSVPModal
          isOpen={!!rsvpDebate}
          onClose={() => setRsvpDebate(null)}
          debate={rsvpDebate}
        />
      )}

      <ScheduleDebateDialog
        open={showScheduleDialog}
        onOpenChange={setShowScheduleDialog}
        onSuccess={refreshDebates}
      />

      <main className="pt-28 pb-24 px-4" id="main-content">
        <div className="max-w-7xl mx-auto space-y-14">

          {/* Hero Section */}
          <motion.section
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="relative text-center space-y-6 py-6"
            aria-labelledby="debates-hero-heading"
          >
            <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-primary/5 rounded-full blur-3xl pointer-events-none" aria-hidden="true" />

            <div className="relative space-y-5">
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold" aria-hidden="true">
                <Scale className="h-3.5 w-3.5" /> Ikhtilaf Panel · Adab al-Ikhtilaf
              </span>

              <h1 id="debates-hero-heading" className="text-5xl md:text-7xl font-display font-bold text-foreground tracking-tight leading-[1.05]">
                Scholarly<br />
                <span className="text-primary">Debates</span>
              </h1>

              <div className="w-14 h-0.5 bg-secondary rounded-full mx-auto" aria-hidden="true" />

              <p className="text-muted-foreground text-lg md:text-xl max-w-xl mx-auto leading-relaxed">
                Evidence-based discourse in the tradition of <em>adab al-ikhtilaf</em>. No comment wars — only structured scholarly exchange.
              </p>

              <div className="flex items-center justify-center gap-3 flex-wrap pt-1">
                {!user ? (
                  <Button
                    variant="outline"
                    className="rounded-xl gap-2 border-primary/30 text-primary hover:bg-primary/5"
                    onClick={() => setShowScholarLogin(true)}
                    aria-label="Open scholar login dialog"
                  >
                    <GraduationCap className="h-4 w-4" aria-hidden="true" /> Scholar Login
                  </Button>
                ) : user.role === "scholar" ? (
                  <Button
                    className="rounded-xl gap-2 shadow-sm"
                    onClick={() => setShowScholarDashboard(true)}
                    aria-label="Go to your scholar dashboard"
                  >
                    <LayoutDashboard className="h-4 w-4" aria-hidden="true" /> My Dashboard
                  </Button>
                ) : null}
                <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Eye className="h-3.5 w-3.5" aria-hidden="true" /> Read debates &amp; vote on clarity as a viewer
                </span>
              </div>
            </div>
          </motion.section>

          {/* Stats Grid */}
          <section aria-label="Debate statistics">
            {!mounted ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[0, 1, 2, 3].map(i => <SkeletonStatCard key={i} />)}
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { icon: Scale, label: "Active Debates", value: String(debates.filter(d => d.status === "active").length), color: "text-primary", bg: "bg-primary/10" },
                  { icon: Users, label: "Participating Scholars", value: String([...new Set(debates.flatMap(d => [d.participants.positionA.name, d.participants.positionB.name]))].length), color: "text-secondary", bg: "bg-secondary/10" },
                  { icon: BookOpen, label: "Topics Covered", value: String([...new Set(debates.map(d => d.topic))].length), color: "text-amber-600", bg: "bg-amber-500/10" },
                  { icon: ThumbsUp, label: "Clarity Votes Cast", value: String(debates.reduce((s, d) => s + (d.votesClarity ?? 0), 0)), color: "text-emerald-600", bg: "bg-emerald-500/10" },
                ].map((s, i) => (
                  <motion.div
                    key={s.label}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.07 }}
                    className="rounded-2xl border border-border bg-card p-5 flex items-center gap-4"
                    aria-label={`${s.label}: ${s.value}`}
                  >
                    <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0", s.bg)} aria-hidden="true">
                      <s.icon className={cn("h-6 w-6", s.color)} />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-foreground" aria-hidden="true">{s.value}</p>
                      <p className="text-xs text-muted-foreground leading-tight">{s.label}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </section>

          {/* Live Banner */}
          {liveDebate && mounted && (
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative overflow-hidden flex items-center justify-between gap-6 p-6 rounded-3xl bg-gradient-to-r from-emerald-600/10 via-primary/8 to-emerald-600/5 border border-emerald-500/25"
              role="region"
              aria-label="Upcoming live debate announcement"
            >
              <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: "radial-gradient(circle at 20% 50%, hsl(var(--primary)) 0%, transparent 60%)" }} aria-hidden="true" />
              <div className="relative flex items-center gap-5">
                <div className="w-14 h-14 rounded-2xl bg-emerald-500/15 border border-emerald-500/25 flex items-center justify-center flex-shrink-0" aria-hidden="true">
                  <span className="w-4 h-4 rounded-full bg-emerald-500 animate-pulse" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Badge className="bg-emerald-500 text-white border-0 text-[10px] font-bold px-2 py-0.5">🔴 UPCOMING LIVE</Badge>
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Users className="h-3 w-3" aria-hidden="true" /> 243 interested
                    </span>
                  </div>
                  <p className="font-bold text-foreground text-lg leading-tight">{liveDebate.title}</p>
                  <p className="text-sm text-muted-foreground">
                    {liveDebate.participants.positionA.name} <Swords className="h-3 w-3 inline mx-1" aria-hidden="true" /> {liveDebate.participants.positionB.name}
                  </p>
                </div>
              </div>
              <Button
                className="relative bg-emerald-600 hover:bg-emerald-700 text-white gap-2 rounded-xl flex-shrink-0 shadow-md"
                onClick={() => {
                  const debate = debates.find(d => d.id === liveDebate.id);
                  setRsvpDebate(debate);
                }}
                aria-label={`RSVP for live debate: ${liveDebate.title}`}
              >
                <Video className="h-4 w-4" aria-hidden="true" /> RSVP Now
              </Button>
            </motion.div>
          )}

          {/* Admin Schedule Button */}
          {user?.role === "admin" && (
            <div className="flex justify-end">
              <Button onClick={() => setShowScheduleDialog(true)} className="gap-2">
                <Plus className="h-4 w-4" aria-hidden="true" /> Schedule New Debate
              </Button>
            </div>
          )}

          {/* Search & Filters */}
          <section aria-label="Search and filter debates">
            <div className="space-y-5">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" aria-hidden="true" />
                  <Input
                    placeholder="Search debates by topic, scholar, or keyword…"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="pl-11 h-11 rounded-xl"
                    aria-label="Search debates by topic, scholar, or keyword"
                    type="search"
                  />
                </div>
              </div>

              {/* Tab Navigation — accessible + mobile-scrollable */}
              <div
                role="tablist"
                aria-label="Filter debates by status or format"
                id={tablistId}
                className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1 no-scrollbar snap-x"
              >
                {TABS.map(tab => {
                  const Icon = tab.icon;
                  const active = activeTab === tab.key;
                  const panelId = `debates-panel-${tab.key}`;
                  const count = tabCounts[tab.key as keyof typeof tabCounts] ?? 0;
                  const hasActive = tab.key === "active" && count > 0;
                  return (
                    <button
                      key={tab.key}
                      role="tab"
                      aria-selected={active}
                      aria-controls={panelId}
                      id={`tab-${tab.key}`}
                      onClick={() => setActiveTab(tab.key)}
                      className={cn(
                        "flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-all border whitespace-nowrap snap-start flex-shrink-0",
                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                        active
                          ? "bg-primary text-primary-foreground border-primary shadow-sm"
                          : "bg-card text-muted-foreground border-border hover:text-foreground hover:bg-muted"
                      )}
                    >
                      <Icon className="h-3.5 w-3.5" aria-hidden="true" />
                      {tab.label}
                      <span className={cn(
                        "text-[10px] font-bold px-1.5 py-0.5 rounded-md min-w-[1.25rem] text-center",
                        active ? "bg-primary-foreground/20" : "bg-muted/80 text-muted-foreground"
                      )}>
                        {count}
                      </span>
                      {hasActive && (
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" aria-label="live" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Debate Cards Panel */}
              <div
                role="tabpanel"
                aria-labelledby={`tab-${activeTab}`}
                id={`debates-panel-${activeTab}`}
                aria-live="polite"
              >
                {!mounted ? (
                  <SkeletonDebateGrid count={3} />
                ) : (
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeTab + searchQuery}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.2 }}
                    >
                      {filteredDebates.length > 0 ? (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                          {filteredDebates.map(debate => (
                            <DebateCard
                              key={debate.id}
                              {...debate}
                              onView={() => handleViewDebate(debate.id, debate.format, debate.status)}
                            />
                          ))}
                        </div>
                      ) : (
                        <EmptyState
                          icon={Scale}
                          title="No debates match this filter"
                          description='Try "All Debates" or a different search term.'
                          actionLabel="Clear filter"
                          onAction={() => { setActiveTab("all"); setSearchQuery(""); }}
                        />
                      )}
                    </motion.div>
                  </AnimatePresence>
                )}
              </div>
            </div>
          </section>

          {/* Role Cards */}
          <section aria-label="Participation options" className="grid md:grid-cols-2 gap-5">
            {/* Scholar Card */}
            <div className="group relative overflow-hidden rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/8 to-primary/3 p-7 space-y-4">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl" aria-hidden="true" />
              <div className="relative flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center" aria-hidden="true">
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
              <ul className="relative space-y-1.5" aria-label="Scholar capabilities">
                {[
                  "Accept & manage debate invitations",
                  "Submit structured written positions",
                  "Attend & moderate live sessions"
                ].map(item => (
                  <li key={item} className="text-sm text-foreground/80 flex items-center gap-2">
                    <span aria-hidden="true">✓</span> {item}
                  </li>
                ))}
              </ul>
              <Button
                className="relative w-full rounded-xl gap-2"
                onClick={() => setShowScholarLogin(true)}
                aria-label="Log in as a verified scholar"
              >
                <GraduationCap className="h-4 w-4" aria-hidden="true" /> Scholar Login →
              </Button>
            </div>

            {/* Reader Card */}
            <div className="relative overflow-hidden rounded-3xl border border-border bg-card p-7 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-muted flex items-center justify-center" aria-hidden="true">
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
              <ul className="space-y-2" aria-label="Reader capabilities">
                {[
                  { icon: BookOpen, text: "Read all debate threads & evidence" },
                  { icon: ThumbsUp, text: "Vote on argument clarity" },
                  { icon: Bookmark, text: "Bookmark & share debates" },
                  { icon: Sparkles, text: "Emoji reactions per debate turn" },
                ].map(item => (
                  <li key={item.text} className="flex items-center gap-2.5 text-sm text-muted-foreground">
                    <item.icon className="h-3.5 w-3.5 text-primary flex-shrink-0" aria-hidden="true" />
                    {item.text}
                  </li>
                ))}
              </ul>
              <Button
                variant="outline"
                className="w-full rounded-xl gap-2"
                onClick={() => {
                  const firstActive = debates.find(d => d.status === "active");
                  if (firstActive) handleViewDebate(firstActive.id, firstActive.format, firstActive.status);
                  else { setActiveTab("all"); document.getElementById("debates-panel-all")?.scrollIntoView({ behavior: "smooth" }); }
                }}
                aria-label="Browse active debates as a reader"
              >
                Browse Debates <ChevronRight className="h-4 w-4" aria-hidden="true" />
              </Button>
            </div>
          </section>

          {/* Adab Notice */}
          <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="relative overflow-hidden rounded-3xl border border-primary/15 bg-gradient-to-br from-primary/6 to-secondary/4 px-8 py-9"
            aria-label="Ethics of scholarly disagreement"
          >
            <div className="absolute right-8 top-6 text-primary/10 text-8xl font-amiri select-none pointer-events-none" aria-hidden="true">⚖</div>
            <div className="flex items-start gap-5 relative">
              <Scale className="h-9 w-9 text-primary mt-0.5 flex-shrink-0" aria-hidden="true" />
              <div>
                <h3 className="text-xl font-bold text-foreground mb-2">
                  The Ethics of Scholarly Disagreement{" "}
                  <span className="text-muted-foreground font-normal text-base ml-2">(Adab al-Ikhtilaf)</span>
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  All debates on Ummah Thoughts follow strict protocols: positions must be evidence-based,
                  personal attacks are prohibited, and both sides acknowledge valid points. Members vote on
                  <em className="mx-1">clarity of argumentation</em>, not on who &quot;won&quot; — because in scholarly
                  discourse, the pursuit of truth benefits everyone.
                </p>
              </div>
            </div>
          </motion.section>
        </div>
      </main>
    </div>
  );
}