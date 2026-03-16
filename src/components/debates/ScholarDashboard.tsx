import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  GraduationCap,
  LogOut,
  Scale,
  Calendar,
  CheckCircle2,
  Clock,
  MessageSquare,
  Video,
  Plus,
  Bell,
  ChevronRight,
  Mic,
  FileText,
  BarChart2,
  BookOpen,
  Send,
  Eye,
  X,
} from "lucide-react";
import { motion as m } from "framer-motion";

interface DebateInvite {
  id: string;
  title: string;
  opponent: string;
  topic: string;
  format: "written" | "live";
  scheduledDate: string;
  status: "pending" | "accepted" | "declined";
}

interface ActiveDebate {
  id: string;
  title: string;
  opponent: string;
  topic: string;
  format: "written" | "live";
  myTurn: boolean;
  deadline: string;
  progress: number; // 0-100
  unreadMessages: number;
}

interface CompletedDebate {
  id: string;
  title: string;
  opponent: string;
  topic: string;
  clarityVotes: { mine: number; theirs: number };
  outcome: string;
}

const MOCK_INVITES: DebateInvite[] = [
  {
    id: "inv1",
    title: "Role of Ijtihad in Contemporary Law",
    opponent: "Prof. Ibrahim Khalil",
    topic: "Usul al-Fiqh",
    format: "written",
    scheduledDate: "Feb 25, 2026",
    status: "pending",
  },
  {
    id: "inv2",
    title: "Democratic Governance & Islamic Principles",
    opponent: "Dr. Yusuf Al-Maliki",
    topic: "Islamic Governance",
    format: "live",
    scheduledDate: "Mar 5, 2026 · 7:00 PM",
    status: "pending",
  },
];

const MOCK_ACTIVE: ActiveDebate[] = [
  {
    id: "act1",
    title: "Is Shura Binding or Advisory?",
    opponent: "Sh. Muhammad Hasan",
    topic: "Islamic Governance",
    format: "written",
    myTurn: true,
    deadline: "Tomorrow · 11:59 PM",
    progress: 65,
    unreadMessages: 2,
  },
  {
    id: "act2",
    title: "Modern Applications of Khilafah",
    opponent: "Dr. Fatima Zahra",
    topic: "Political Theory",
    format: "live",
    myTurn: false,
    deadline: "Feb 22, 2026",
    progress: 40,
    unreadMessages: 0,
  },
];

const MOCK_COMPLETED: CompletedDebate[] = [
  {
    id: "cmp1",
    title: "Conditions for Valid Bay'ah",
    opponent: "Dr. Maryam Hassan",
    topic: "Fiqh al-Siyasah",
    clarityVotes: { mine: 142, theirs: 92 },
    outcome: "Your argument was rated clearer by 61% of readers",
  },
];

const MOCK_NOTIFICATIONS = [
  { id: "n1", text: "Sh. Muhammad Hasan submitted his rebuttal in 'Is Shura Binding?'", time: "2h ago", unread: true },
  { id: "n2", text: "Your debate 'Conditions for Valid Bay'ah' received 15 new clarity votes", time: "5h ago", unread: true },
  { id: "n3", text: "Upcoming live debate reminder: Feb 22 at 7:00 PM", time: "1d ago", unread: false },
];

type DashTab = "overview" | "invites" | "active" | "history" | "compose";

export interface ScholarProfile {
  name: string;
  title?: string;
  specialization?: string;
  avatar?: string;
}

interface ScholarDashboardProps {
  scholar: ScholarProfile;
  onLogout: () => void;
}

export const ScholarDashboard = ({ scholar, onLogout }: ScholarDashboardProps) => {
  const [activeTab, setActiveTab] = useState<DashTab>("overview");
  const [invites, setInvites] = useState<DebateInvite[]>(MOCK_INVITES);
  const [showNotifs, setShowNotifs] = useState(false);
  const [composeText, setComposeText] = useState("");
  const [composeSent, setComposeSent] = useState(false);

  const pendingInvites = invites.filter((i) => i.status === "pending").length;
  const unreadNotifs = MOCK_NOTIFICATIONS.filter((n) => n.unread).length;

  const respondToInvite = (id: string, response: "accepted" | "declined") => {
    setInvites((prev) => prev.map((inv) => (inv.id === id ? { ...inv, status: response } : inv)));
  };

  const tabs: { key: DashTab; label: string; icon: React.ElementType; badge?: number }[] = [
    { key: "overview", label: "Overview", icon: BarChart2 },
    { key: "invites", label: "Invites", icon: Bell, badge: pendingInvites },
    { key: "active", label: "Active Debates", icon: Scale, badge: MOCK_ACTIVE.filter((d) => d.myTurn).length },
    { key: "history", label: "History", icon: BookOpen },
    { key: "compose", label: "New Response", icon: FileText },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-6">

      {/* ─── Scholar Profile Header ─────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-3xl border border-border bg-gradient-to-br from-card to-muted/30 overflow-hidden"
      >
        <div className="p-7 flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-5">
            <div className="relative">
              <div className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center text-2xl font-bold text-primary">
                {scholar.avatar}
              </div>
              <span className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full border-2 border-card" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Badge className="bg-primary/15 text-primary border border-primary/25 text-xs">
                  <GraduationCap className="h-3 w-3 mr-1" /> Verified Scholar
                </Badge>
              </div>
              <h2 className="text-xl font-bold text-foreground">{scholar.name}</h2>
              <p className="text-sm text-muted-foreground">{scholar.title}</p>
              <p className="text-xs text-primary font-medium mt-0.5">{scholar.specialization}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Notifications */}
            <div className="relative">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowNotifs(!showNotifs)}
                className="rounded-xl gap-2"
              >
                <Bell className="h-4 w-4" />
                {unreadNotifs > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-destructive text-destructive-foreground text-[10px] font-bold rounded-full flex items-center justify-center">
                    {unreadNotifs}
                  </span>
                )}
              </Button>
              <AnimatePresence>
                {showNotifs && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.95 }}
                    className="absolute right-0 top-12 w-80 bg-card border border-border rounded-2xl shadow-xl z-20 overflow-hidden"
                  >
                    <div className="px-4 py-3 border-b border-border flex items-center justify-between">
                      <p className="text-sm font-bold text-foreground">Notifications</p>
                      <button onClick={() => setShowNotifs(false)}><X className="h-4 w-4 text-muted-foreground" /></button>
                    </div>
                    {MOCK_NOTIFICATIONS.map((n) => (
                      <div key={n.id} className={`px-4 py-3 border-b border-border last:border-0 ${n.unread ? "bg-primary/5" : ""}`}>
                        <p className="text-sm text-foreground leading-relaxed">{n.text}</p>
                        <p className="text-xs text-muted-foreground mt-1">{n.time}</p>
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={onLogout}
              className="rounded-xl gap-2 text-muted-foreground hover:text-destructive hover:border-destructive/30"
            >
              <LogOut className="h-4 w-4" /> Logout
            </Button>
          </div>
        </div>

        {/* Stats strip */}
        <div className="grid grid-cols-4 border-t border-border divide-x divide-border">
          {[
            { label: "Active Debates", value: MOCK_ACTIVE.length, color: "text-primary" },
            { label: "Pending Invites", value: pendingInvites, color: "text-secondary" },
            { label: "Total Debates", value: MOCK_COMPLETED.length + MOCK_ACTIVE.length, color: "text-foreground" },
            { label: "Clarity Score", value: "87%", color: "text-emerald-600" },
          ].map((stat) => (
            <div key={stat.label} className="px-5 py-4 text-center">
              <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{stat.label}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* ─── Tab Navigation ─────────────────────────────── */}
      <div className="flex items-center gap-1 bg-muted/50 rounded-2xl p-1.5 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`relative flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all whitespace-nowrap flex-shrink-0 ${
              activeTab === tab.key
                ? "bg-card shadow text-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <tab.icon className="h-4 w-4" />
            {tab.label}
            {tab.badge !== undefined && tab.badge > 0 && (
              <span className="w-5 h-5 bg-primary text-primary-foreground text-[10px] font-bold rounded-full flex items-center justify-center">
                {tab.badge}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* ─── Tab Content ─────────────────────────────────── */}
      <AnimatePresence mode="wait">

        {/* ── OVERVIEW ── */}
        {activeTab === "overview" && (
          <motion.div key="overview" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <div className="grid md:grid-cols-2 gap-5">
              {/* My Turn action cards */}
              {MOCK_ACTIVE.filter((d) => d.myTurn).map((debate) => (
                <motion.div
                  key={debate.id}
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="rounded-3xl border-2 border-primary/30 bg-primary/5 p-6 space-y-4"
                >
                  <div className="flex items-start justify-between">
                    <Badge className="bg-primary/15 text-primary border border-primary/25 text-xs">
                      ⚡ Your Turn
                    </Badge>
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="h-3 w-3" /> Due: {debate.deadline}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground">{debate.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">vs {debate.opponent} · {debate.topic}</p>
                  </div>
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Debate Progress</span>
                      <span>{debate.progress}%</span>
                    </div>
                    <div className="h-2 rounded-full bg-muted overflow-hidden">
                      <motion.div
                        className="h-full bg-primary rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${debate.progress}%` }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                      />
                    </div>
                  </div>
                  <Button
                    className="w-full h-10 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground"
                    onClick={() => setActiveTab("compose")}
                  >
                    <MessageSquare className="h-4 w-4 mr-2" /> Submit My Response
                  </Button>
                </motion.div>
              ))}

              {/* Pending invites preview */}
              {invites.filter((i) => i.status === "pending").slice(0, 1).map((inv) => (
                <motion.div
                  key={inv.id}
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="rounded-3xl border border-secondary/30 bg-secondary/5 p-6 space-y-4"
                >
                  <Badge className="bg-secondary/15 text-secondary border border-secondary/25 text-xs">
                    📩 Debate Invite
                  </Badge>
                  <div>
                    <h3 className="font-bold text-foreground">{inv.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">From {inv.opponent} · {inv.topic}</p>
                    <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                      {inv.format === "live" ? <Video className="h-3 w-3" /> : <MessageSquare className="h-3 w-3" />}
                      {inv.format === "live" ? "Live Debate" : "Written Debate"} · {inv.scheduledDate}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => respondToInvite(inv.id, "accepted")}
                      className="flex-1 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground"
                    >
                      <CheckCircle2 className="h-4 w-4 mr-1.5" /> Accept
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => respondToInvite(inv.id, "declined")}
                      className="flex-1 rounded-xl"
                    >
                      Decline
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* ── INVITES ── */}
        {activeTab === "invites" && (
          <motion.div key="invites" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="space-y-4">
            {invites.map((inv) => (
              <motion.div
                key={inv.id}
                layout
                className={`rounded-3xl border p-6 space-y-4 ${
                  inv.status === "pending"
                    ? "border-border bg-card"
                    : inv.status === "accepted"
                    ? "border-emerald-500/20 bg-emerald-500/5"
                    : "border-border bg-muted/30 opacity-60"
                }`}
              >
                <div className="flex items-start justify-between flex-wrap gap-3">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline" className="text-xs">
                        {inv.format === "live" ? <Video className="h-3 w-3 mr-1" /> : <MessageSquare className="h-3 w-3 mr-1" />}
                        {inv.format === "live" ? "Live" : "Written"}
                      </Badge>
                      <Badge variant="outline" className="text-xs">{inv.topic}</Badge>
                      {inv.status !== "pending" && (
                        <Badge className={inv.status === "accepted"
                          ? "bg-emerald-500/15 text-emerald-600 border-emerald-500/25 text-xs"
                          : "bg-muted text-muted-foreground border-border text-xs"}>
                          {inv.status === "accepted" ? "✓ Accepted" : "✗ Declined"}
                        </Badge>
                      )}
                    </div>
                    <h3 className="font-bold text-foreground text-lg">{inv.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">Invited by <span className="text-foreground font-medium">{inv.opponent}</span></p>
                    <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1.5">
                      <Calendar className="h-3 w-3" /> {inv.scheduledDate}
                    </p>
                  </div>
                  {inv.status === "pending" && (
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => respondToInvite(inv.id, "accepted")}
                        className="rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground"
                      >
                        <CheckCircle2 className="h-4 w-4 mr-1.5" /> Accept
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => respondToInvite(inv.id, "declined")}
                        className="rounded-xl"
                      >
                        Decline
                      </Button>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
            {invites.length === 0 && (
              <div className="text-center py-16 text-muted-foreground">
                <Bell className="h-12 w-12 mx-auto mb-4 opacity-30" />
                <p>No pending invitations.</p>
              </div>
            )}
          </motion.div>
        )}

        {/* ── ACTIVE DEBATES ── */}
        {activeTab === "active" && (
          <motion.div key="active" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="space-y-4">
            {MOCK_ACTIVE.map((debate) => (
              <div
                key={debate.id}
                className={`rounded-3xl border p-6 space-y-5 ${
                  debate.myTurn ? "border-primary/30 bg-primary/5" : "border-border bg-card"
                }`}
              >
                <div className="flex items-start justify-between flex-wrap gap-3">
                  <div>
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      {debate.myTurn ? (
                        <Badge className="bg-primary/15 text-primary border border-primary/25 text-xs">⚡ Your Turn</Badge>
                      ) : (
                        <Badge className="bg-muted text-muted-foreground border border-border text-xs">⏳ Opponent's Turn</Badge>
                      )}
                      <Badge variant="outline" className="text-xs">
                        {debate.format === "live" ? <Video className="h-3 w-3 mr-1" /> : <MessageSquare className="h-3 w-3 mr-1" />}
                        {debate.format === "live" ? "Live" : "Written"}
                      </Badge>
                      {debate.unreadMessages > 0 && (
                        <Badge className="bg-secondary/15 text-secondary border border-secondary/25 text-xs">
                          {debate.unreadMessages} new
                        </Badge>
                      )}
                    </div>
                    <h3 className="font-bold text-foreground text-lg">{debate.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">vs <span className="text-foreground font-medium">{debate.opponent}</span> · {debate.topic}</p>
                  </div>
                  <div className="text-right space-y-1">
                    <p className="text-xs text-muted-foreground flex items-center gap-1 justify-end">
                      <Clock className="h-3 w-3" /> {debate.deadline}
                    </p>
                  </div>
                </div>

                {/* Progress */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Debate Progress</span>
                    <span>{debate.progress}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-muted overflow-hidden">
                    <motion.div
                      className={`h-full rounded-full ${debate.myTurn ? "bg-primary" : "bg-muted-foreground"}`}
                      initial={{ width: 0 }}
                      animate={{ width: `${debate.progress}%` }}
                      transition={{ duration: 0.8 }}
                    />
                  </div>
                </div>

                <div className="flex gap-2">
                  {debate.myTurn && (
                    <Button
                      size="sm"
                      className="rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground gap-1.5"
                      onClick={() => setActiveTab("compose")}
                    >
                      <Send className="h-4 w-4" /> Submit Response
                    </Button>
                  )}
                  <Button size="sm" variant="outline" className="rounded-xl gap-1.5">
                    <Eye className="h-4 w-4" /> View Thread
                  </Button>
                  {debate.format === "live" && (
                    <Button size="sm" variant="outline" className="rounded-xl gap-1.5">
                      <Video className="h-4 w-4" /> Join Room
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </motion.div>
        )}

        {/* ── HISTORY ── */}
        {activeTab === "history" && (
          <motion.div key="history" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="space-y-4">
            {MOCK_COMPLETED.map((debate) => (
              <div key={debate.id} className="rounded-3xl border border-border bg-card p-6 space-y-4">
                <div className="flex items-start justify-between flex-wrap gap-3">
                  <div>
                    <Badge className="bg-emerald-500/15 text-emerald-600 border border-emerald-500/25 text-xs mb-2">
                      ✅ Concluded
                    </Badge>
                    <h3 className="font-bold text-foreground text-lg">{debate.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">vs {debate.opponent} · {debate.topic}</p>
                  </div>
                </div>
                <div className="rounded-2xl bg-muted/50 border border-border p-4">
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">Clarity Vote Results</p>
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-primary font-semibold">You · {debate.clarityVotes.mine} votes</span>
                    <span className="text-muted-foreground">{debate.clarityVotes.theirs} votes · {debate.opponent.split(" ")[0]}</span>
                  </div>
                  <div className="h-2 rounded-full bg-muted overflow-hidden flex">
                    <div
                      className="h-full bg-primary rounded-full"
                      style={{ width: `${(debate.clarityVotes.mine / (debate.clarityVotes.mine + debate.clarityVotes.theirs)) * 100}%` }}
                    />
                    <div className="h-full bg-secondary flex-1" />
                  </div>
                  <p className="text-xs text-emerald-600 font-medium mt-2">{debate.outcome}</p>
                </div>
                <Button size="sm" variant="outline" className="rounded-xl gap-1.5">
                  <BookOpen className="h-4 w-4" /> View Full Debate
                </Button>
              </div>
            ))}
          </motion.div>
        )}

        {/* ── COMPOSE RESPONSE ── */}
        {activeTab === "compose" && (
          <motion.div key="compose" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="space-y-5">
            <div className="rounded-3xl border border-border bg-card overflow-hidden">
              <div className="bg-primary/5 px-7 py-5 border-b border-primary/10">
                <h3 className="font-bold text-foreground flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" /> Compose Debate Response
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Responding to: <span className="text-foreground font-medium">Is Shura Binding or Advisory?</span>
                </p>
              </div>

              <div className="p-7 space-y-5">
                {composeSent ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-12 space-y-4"
                  >
                    <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto">
                      <CheckCircle2 className="h-8 w-8 text-emerald-500" />
                    </div>
                    <h3 className="text-xl font-bold text-foreground">Response Submitted!</h3>
                    <p className="text-muted-foreground">Your argument has been sent to Sh. Muhammad Hasan for review.</p>
                    <Button variant="outline" className="rounded-xl" onClick={() => { setComposeSent(false); setComposeText(""); setActiveTab("active"); }}>
                      Back to Active Debates
                    </Button>
                  </motion.div>
                ) : (
                  <>
                    {/* Response type */}
                    <div>
                      <label className="text-sm font-semibold text-foreground mb-2 block">Response Type</label>
                      <div className="grid grid-cols-3 gap-2">
                        {["Rebuttal", "New Evidence", "Closing Argument"].map((type) => (
                          <button
                            key={type}
                            className="border border-border rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground hover:border-primary/40 hover:text-primary hover:bg-primary/5 transition-all first:border-primary/40 first:text-primary first:bg-primary/5"
                          >
                            {type}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Response text */}
                    <div>
                      <label className="text-sm font-semibold text-foreground mb-2 block">Your Argument</label>
                      <textarea
                        value={composeText}
                        onChange={(e) => setComposeText(e.target.value)}
                        placeholder="Write your scholarly argument here... Support with dalils, reference classical scholars, and address the opponent's points respectfully."
                        className="w-full h-44 rounded-2xl border border-border bg-muted/30 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:ring-2 focus:ring-ring"
                      />
                      <p className="text-xs text-muted-foreground mt-1">{composeText.length} characters</p>
                    </div>

                    {/* Add dalil */}
                    <div className="rounded-2xl border border-dashed border-border bg-muted/20 p-4 space-y-3">
                      <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                        <BookOpen className="h-3.5 w-3.5" /> Attach Dalil (Evidence)
                      </p>
                      <div className="grid grid-cols-2 gap-2">
                        <Input placeholder="Reference (e.g. Surah 42:38)" className="h-9 rounded-xl text-sm" />
                        <Input placeholder="Arabic text (optional)" className="h-9 rounded-xl text-sm" dir="rtl" />
                      </div>
                      <Input placeholder="Translation / explanation" className="h-9 rounded-xl text-sm" />
                      <div className="flex gap-2">
                        {["Quran", "Hadith", "Ijma", "Qiyas", "Scholarly"].map((type) => (
                          <button key={type} className="text-xs border border-border rounded-lg px-2.5 py-1 text-muted-foreground hover:border-primary/40 hover:text-primary transition-all">
                            {type}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Voice note option */}
                    <div className="flex items-center gap-3 p-4 rounded-2xl bg-muted/30 border border-border">
                      <Mic className="h-5 w-5 text-muted-foreground" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-foreground">Add Voice Commentary</p>
                        <p className="text-xs text-muted-foreground">Record an audio clarification for your written response</p>
                      </div>
                      <Button size="sm" variant="outline" className="rounded-xl text-xs gap-1.5">
                        <Mic className="h-3.5 w-3.5" /> Record
                      </Button>
                    </div>

                    {/* Ethics notice */}
                    <div className="rounded-2xl bg-primary/5 border border-primary/15 px-5 py-4 flex items-start gap-3">
                      <Scale className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        <span className="font-semibold text-foreground">Adab reminder:</span> Your response will be reviewed by the moderation team before publishing. Personal attacks, unsubstantiated claims, and disrespectful language will result in rejection.
                      </p>
                    </div>

                    <div className="flex gap-3 justify-end">
                      <Button variant="outline" className="rounded-xl">Save Draft</Button>
                      <Button
                        className="rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground gap-2"
                        disabled={composeText.trim().length < 20}
                        onClick={() => setComposeSent(true)}
                      >
                        <Send className="h-4 w-4" /> Submit Response
                      </Button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
};
