"use client";

import { useState, useRef } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  BookOpen,
  Scale,
  CheckCircle2,
  XCircle,
  Quote,
  Bookmark,
  Share2,
  Clock,
  Star,
  ChevronDown,
  ChevronUp,
  Lock,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";

interface DebatePosition {
  scholar: { name: string; title: string; avatar?: string };
  position: string;
  summary: string;
  evidence: {
    type: "quran" | "hadith" | "ijma" | "qiyas" | "scholarly";
    reference: string;
    arabic?: string;
    translation?: string;
  }[];
  methodology: string;
}

interface DebatePanelProps {
  title: string;
  titleAr?: string;
  topic: string;
  positionA: DebatePosition;
  positionB: DebatePosition;
  agreementPoints: string[];
  disagreementPoints: string[];
  conclusion?: string;
  status: "active" | "concluded";
  clarityVotes: { positionA: number; positionB: number };
}

const evidenceIcons = {
  quran:    { icon: "📖", label: "Quran",     color: "bg-primary/10 text-primary border-primary/20" },
  hadith:   { icon: "📜", label: "Hadith",    color: "bg-secondary/10 text-secondary border-secondary/20" },
  ijma:     { icon: "🤝", label: "Ijma",      color: "bg-blue-500/10 text-blue-600 border-blue-500/20" },
  qiyas:    { icon: "⚖️", label: "Qiyas",    color: "bg-purple-500/10 text-purple-600 border-purple-500/20" },
  scholarly:{ icon: "📚", label: "Scholarly", color: "bg-muted text-muted-foreground border-border" },
};

type Tab = "chat" | "comparison" | "conclusion";

const buildChatTurns = (posA: DebatePosition, posB: DebatePosition) => [
  { side: "A" as const, label: "Opening Statement",   text: posA.position,  detail: posA.summary, evidence: posA.evidence.slice(0, 1), timestamp: "Day 1 · 09:00" },
  { side: "B" as const, label: "Opening Statement",   text: posB.position,  detail: posB.summary, evidence: posB.evidence.slice(0, 1), timestamp: "Day 1 · 14:00" },
  { side: "A" as const, label: "Evidence Submission", text: `My methodology is grounded in ${posA.methodology.toLowerCase()}. The dalils I present establish this position conclusively.`, detail: null, evidence: posA.evidence.slice(1), timestamp: "Day 3 · 10:30" },
  { side: "B" as const, label: "Rebuttal & Evidence", text: `While I respect the textual evidence cited, my approach differs: ${posB.methodology.toLowerCase()}. The following dalils support my position:`, detail: null, evidence: posB.evidence.slice(1), timestamp: "Day 4 · 16:00" },
  { side: "A" as const, label: "Closing Argument",    text: `In summary: the weight of evidence — Quranic, prophetic, and historical — consistently supports the binding nature of Shura. The Ummah's right to governance is not merely advisory.`, detail: null, evidence: [], timestamp: "Day 14 · 11:00" },
  { side: "B" as const, label: "Closing Argument",    text: `To conclude: while the process of Shura is obligatory, the ruler's ultimate authority and accountability to Allah means the decision rests with him. This preserves both consultation and decisive leadership.`, detail: null, evidence: [], timestamp: "Day 14 · 18:00" },
];

const REACTIONS = ["👍", "🤔", "💡", "❤️", "🔥", "📖"];

export const DebatePanel = ({
  title, titleAr, topic,
  positionA, positionB,
  agreementPoints, disagreementPoints,
  conclusion, status, clarityVotes,
}: DebatePanelProps) => {
  const { user } = useAuth();
  const router = useRouter();
  const isAuthenticated = !!user;

  const [activeTab, setActiveTab] = useState<Tab>("chat");
  const [bookmarked, setBookmarked] = useState(false);
  const [myVote, setMyVote] = useState<"A" | "B" | null>(null);
  const [expandedEvidence, setExpandedEvidence] = useState<Record<number, boolean>>({});
  const [hoveredTurn, setHoveredTurn] = useState<number | null>(null);
  const [reactions, setReactions] = useState<Record<number, Record<string, number>>>({});
  const [myReactions, setMyReactions] = useState<Record<number, string>>({});
  const chatEndRef = useRef<HTMLDivElement>(null);

  const totalVotes = clarityVotes.positionA + clarityVotes.positionB;
  const pctA = totalVotes ? Math.round((clarityVotes.positionA / totalVotes) * 100) : 0;
  const pctB = 100 - pctA;
  const chatTurns = buildChatTurns(positionA, positionB);

  const tabs: { key: Tab; label: string }[] = [
    { key: "chat",       label: "💬 Debate Thread" },
    { key: "comparison", label: "⚖️ Comparison" },
    { key: "conclusion", label: "📋 Conclusion" },
  ];

  const toggleEvidence = (idx: number) =>
    setExpandedEvidence(prev => ({ ...prev, [idx]: !prev[idx] }));

  const handleReact = (turnIdx: number, emoji: string) => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }
    const prev = myReactions[turnIdx];
    setReactions(r => {
      const turnR = { ...(r[turnIdx] || {}) };
      if (prev) turnR[prev] = Math.max(0, (turnR[prev] || 1) - 1);
      if (prev !== emoji) turnR[emoji] = (turnR[emoji] || 0) + 1;
      return { ...r, [turnIdx]: turnR };
    });
    setMyReactions(m => ({ ...m, [turnIdx]: prev === emoji ? "" : emoji }));
    setHoveredTurn(null);
  };

  const handleVote = (side: "A" | "B") => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }
    if (myVote) return;
    setMyVote(side);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Hero Header */}
      <div className="relative rounded-3xl overflow-hidden border border-border bg-gradient-to-br from-card to-muted/40 p-8 md:p-10">
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23064E3B' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")" }}
        />
        <div className="relative space-y-5 text-center">
          <div className="flex items-center justify-center gap-2 flex-wrap">
            <Badge className={status === "active"
              ? "bg-emerald-500/20 text-emerald-600 border border-emerald-500/30 px-3 py-1"
              : "bg-muted text-muted-foreground border border-border px-3 py-1"}>
              {status === "active" ? "🔴 Active Debate" : "✅ Concluded"}
            </Badge>
            <Badge variant="outline" className="px-3 py-1 flex items-center gap-1.5">
              <BookOpen className="h-3.5 w-3.5" />{topic}
            </Badge>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground leading-tight">{title}</h1>
          {titleAr && <p className="text-2xl font-amiri text-muted-foreground" dir="rtl">{titleAr}</p>}

          <div className="flex items-center justify-center gap-6 pt-1">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center text-lg font-bold text-primary">A</div>
              <div className="text-left">
                <p className="text-sm font-semibold text-foreground">{positionA.scholar.name}</p>
                <p className="text-xs text-muted-foreground">{positionA.scholar.title}</p>
              </div>
            </div>
            <div className="text-muted-foreground font-bold text-lg">vs</div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-secondary/20 flex items-center justify-center text-lg font-bold text-secondary">B</div>
              <div className="text-left">
                <p className="text-sm font-semibold text-foreground">{positionB.scholar.name}</p>
                <p className="text-xs text-muted-foreground">{positionB.scholar.title}</p>
              </div>
            </div>
          </div>

          <div className="max-w-md mx-auto pt-1">
            <div className="flex items-center justify-between text-xs text-muted-foreground mb-1.5">
              <span className="font-semibold text-primary">{positionA.scholar.name.split(" ")[0]} · {pctA}%</span>
              <span className="text-[10px]">{totalVotes} clarity votes</span>
              <span className="font-semibold text-secondary">{pctB}% · {positionB.scholar.name.split(" ")[0]}</span>
            </div>
            <div className="h-1.5 rounded-full bg-muted overflow-hidden flex">
              <motion.div className="h-full bg-primary" initial={{ width: 0 }} animate={{ width: `${pctA}%` }} transition={{ duration: 0.8 }} />
              <motion.div className="h-full bg-secondary" initial={{ width: 0 }} animate={{ width: `${pctB}%` }} transition={{ duration: 0.8 }} />
            </div>
          </div>
        </div>
      </div>

      {/* Action Bar + Tabs */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setBookmarked(!bookmarked)}
            className={bookmarked ? "text-primary border-primary/40" : ""}>
            <Bookmark className={`h-4 w-4 mr-1.5 ${bookmarked ? "fill-current" : ""}`} />
            {bookmarked ? "Bookmarked" : "Bookmark"}
          </Button>
          <Button variant="outline" size="sm">
            <Share2 className="h-4 w-4 mr-1.5" /> Share
          </Button>
        </div>
        <div className="flex items-center gap-1 bg-muted rounded-xl p-1">
          {tabs.map(t => (
            <button key={t.key} onClick={() => setActiveTab(t.key)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                activeTab === t.key ? "bg-card shadow text-foreground" : "text-muted-foreground hover:text-foreground"
              }`}>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        {activeTab === "chat" && (
          <motion.div key="chat" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.25 }}>
            {/* Scholar header strip */}
            <div className="grid grid-cols-2 gap-4 mb-5 sticky top-20 z-10">
              <div className="flex items-center gap-3 bg-primary/5 border border-primary/15 rounded-2xl px-4 py-3 backdrop-blur-sm">
                <div className="w-9 h-9 rounded-xl bg-primary/20 flex items-center justify-center font-bold text-primary text-sm flex-shrink-0">A</div>
                <div className="min-w-0">
                  <p className="text-[10px] font-bold text-primary uppercase tracking-wider">Position A</p>
                  <p className="text-sm font-semibold text-foreground truncate">{positionA.scholar.name}</p>
                </div>
              </div>
              <div className="flex items-center justify-end gap-3 bg-secondary/5 border border-secondary/15 rounded-2xl px-4 py-3 backdrop-blur-sm">
                <div className="min-w-0 text-right">
                  <p className="text-[10px] font-bold text-secondary uppercase tracking-wider">Position B</p>
                  <p className="text-sm font-semibold text-foreground truncate">{positionB.scholar.name}</p>
                </div>
                <div className="w-9 h-9 rounded-xl bg-secondary/20 flex items-center justify-center font-bold text-secondary text-sm flex-shrink-0">B</div>
              </div>
            </div>

            {/* Chat bubbles */}
            <div className="space-y-4">
              {chatTurns.map((turn, idx) => {
                const isA = turn.side === "A";
                const hasEvidence = turn.evidence.length > 0;
                const evidenceOpen = expandedEvidence[idx];
                const turnReactions = reactions[idx] || {};
                const myEmoji = myReactions[idx];
                const hasAnyReaction = Object.values(turnReactions).some(c => c > 0);
                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.06, duration: 0.3 }}
                    className={`relative flex items-end gap-3 ${isA ? "justify-start" : "justify-end"}`}
                    onMouseEnter={() => setHoveredTurn(idx)}
                    onMouseLeave={() => setHoveredTurn(null)}
                  >
                    {isA && (
                      <div className="w-9 h-9 rounded-xl bg-primary/20 flex items-center justify-center font-bold text-primary text-sm flex-shrink-0 mb-1">A</div>
                    )}
                    <div className={`max-w-[72%] space-y-2 ${isA ? "" : "items-end flex flex-col"}`}>
                      <div className={`flex items-center gap-2 ${isA ? "" : "justify-end"}`}>
                        <span className={`text-[10px] font-bold uppercase tracking-widest ${isA ? "text-primary" : "text-secondary"}`}>{turn.label}</span>
                        <span className="text-[10px] text-muted-foreground/60">{turn.timestamp}</span>
                      </div>

                      {/* Bubble + hover reaction picker */}
                      <div className={`relative group ${isA ? "" : "self-end"}`}>
                        <div className={`rounded-3xl px-5 py-4 ${
                          isA ? "bg-primary/10 border border-primary/20 rounded-tl-sm" : "bg-secondary/10 border border-secondary/20 rounded-tr-sm"
                        }`}>
                          <p className="text-foreground leading-relaxed text-sm">{turn.text}</p>
                          {turn.detail && (
                            <p className="text-muted-foreground text-sm mt-2 leading-relaxed border-t border-border/50 pt-2">{turn.detail}</p>
                          )}
                        </div>

                        {/* Hover reaction picker - only for authenticated users */}
                        <AnimatePresence>
                          {isAuthenticated && hoveredTurn === idx && (
                            <motion.div
                              initial={{ opacity: 0, scale: 0.85, y: 6 }}
                              animate={{ opacity: 1, scale: 1, y: 0 }}
                              exit={{ opacity: 0, scale: 0.85, y: 6 }}
                              transition={{ duration: 0.15 }}
                              className={`absolute -top-11 z-20 flex items-center gap-1 bg-card border border-border rounded-2xl px-2.5 py-1.5 shadow-lg ${
                                isA ? "left-0" : "right-0"
                              }`}
                            >
                              {REACTIONS.map(emoji => (
                                <button
                                  key={emoji}
                                  onClick={() => handleReact(idx, emoji)}
                                  className={`text-lg w-8 h-8 flex items-center justify-center rounded-xl transition-all hover:scale-125 active:scale-95 ${
                                    myEmoji === emoji ? "bg-primary/15 ring-1 ring-primary/30" : "hover:bg-muted"
                                  }`}
                                >
                                  {emoji}
                                </button>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>

                      {/* Reaction counts below bubble - always visible */}
                      {hasAnyReaction && (
                        <motion.div
                          initial={{ opacity: 0, y: 4 }}
                          animate={{ opacity: 1, y: 0 }}
                          className={`flex flex-wrap gap-1 ${isA ? "" : "justify-end"}`}
                        >
                          {Object.entries(turnReactions)
                            .filter(([, count]) => count > 0)
                            .map(([emoji, count]) => (
                              <button
                                key={emoji}
                                onClick={() => isAuthenticated && handleReact(idx, emoji)}
                                className={`flex items-center gap-1 text-xs rounded-full px-2.5 py-0.5 border transition-all ${
                                  myEmoji === emoji
                                    ? "bg-primary/15 border-primary/30 text-primary"
                                    : "bg-card border-border text-muted-foreground hover:border-primary/30"
                                }`}
                                disabled={!isAuthenticated}
                              >
                                <span>{emoji}</span>
                                <span className="font-medium">{count}</span>
                              </button>
                            ))}
                        </motion.div>
                      )}

                      {/* Evidence section */}
                      {hasEvidence && (
                        <div className="w-full space-y-1.5">
                          <button onClick={() => toggleEvidence(idx)}
                            className={`flex items-center gap-1.5 text-xs font-medium transition-colors ${
                              isA ? "text-primary hover:text-primary/80" : "text-secondary hover:text-secondary/80"
                            } ${isA ? "" : "ml-auto"}`}>
                            <BookOpen className="h-3 w-3" />
                            {turn.evidence.length} dalil{turn.evidence.length > 1 ? "s" : ""} cited
                            {evidenceOpen ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                          </button>
                          <AnimatePresence>
                            {evidenceOpen && (
                              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.2 }}
                                className="overflow-hidden space-y-2">
                                {turn.evidence.map((ev, eIdx) => {
                                  const cfg = evidenceIcons[ev.type];
                                  return (
                                    <div key={eIdx} className={`rounded-2xl border p-4 space-y-2 ${
                                      isA ? "bg-primary/5 border-primary/15" : "bg-secondary/5 border-secondary/15"
                                    }`}>
                                      <div className="flex items-center gap-2">
                                        <span className="text-sm">{cfg.icon}</span>
                                        <Badge variant="outline" className={`text-[10px] py-0 px-2 border ${cfg.color}`}>{cfg.label}</Badge>
                                        <span className="text-xs text-muted-foreground">— {ev.reference}</span>
                                      </div>
                                      {ev.arabic && <p className="text-lg leading-relaxed font-amiri text-foreground text-right" dir="rtl">{ev.arabic}</p>}
                                      {ev.translation && <p className="text-sm text-muted-foreground italic">&quot;{ev.translation}&quot;</p>}
                                    </div>
                                  );
                                })}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      )}
                    </div>
                    {!isA && (
                      <div className="w-9 h-9 rounded-xl bg-secondary/20 flex items-center justify-center font-bold text-secondary text-sm flex-shrink-0 mb-1">B</div>
                    )}
                  </motion.div>
                );
              })}
            </div>

            <div ref={chatEndRef} />

            {/* Vote strip - only for authenticated users */}
            {status === "active" && (
              <>
                {isAuthenticated ? (
                  <div className="mt-5 rounded-2xl border border-border bg-card p-5">
                    <p className="text-sm font-semibold text-foreground text-center mb-4">
                      After reading the debate thread, which argument did you find clearer?
                    </p>
                    <div className="grid grid-cols-2 gap-3">
                      <Button variant={myVote === "A" ? "default" : "outline"} onClick={() => handleVote("A")}
                        disabled={!!myVote && myVote !== "A"} className="rounded-xl h-12">
                        <Star className="h-4 w-4 mr-2" />
                        {myVote === "A" ? "✓ Voted A" : "Position A is clearer"}
                      </Button>
                      <Button variant={myVote === "B" ? "default" : "outline"} onClick={() => handleVote("B")}
                        disabled={!!myVote && myVote !== "B"} className="rounded-xl h-12">
                        <Star className="h-4 w-4 mr-2" />
                        {myVote === "B" ? "✓ Voted B" : "Position B is clearer"}
                      </Button>
                    </div>
                    {myVote && (
                      <motion.p initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
                        className="text-xs text-center text-muted-foreground mt-3">
                        ✓ Your vote has been recorded — thank you for participating in scholarly discourse.
                      </motion.p>
                    )}
                  </div>
                ) : (
                  <div className="mt-5 rounded-2xl border border-primary/20 bg-primary/5 p-5 text-center">
                    <Lock className="h-5 w-5 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                      <button onClick={() => router.push("/login")} className="text-primary underline font-medium">
                        Sign in
                      </button> to vote on clarity and react to arguments.
                    </p>
                  </div>
                )}
              </>
            )}

            {/* Adab notice - always visible */}
            <div className="mt-4 rounded-2xl border border-primary/15 bg-primary/5 px-6 py-4 flex items-start gap-3">
              <Scale className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
              <p className="text-sm text-muted-foreground leading-relaxed">
                <span className="font-semibold text-foreground">Adab al-Ikhtilaf:</span> This thread follows
                the ethics of scholarly disagreement. Votes measure <em>clarity of argument</em>,
                not which position is correct. Both positions are equally respected.
              </p>
            </div>
          </motion.div>
        )}

        {/* Comparison tab - unchanged */}
        {activeTab === "comparison" && (
          <motion.div key="comparison" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.25 }}
            className="grid md:grid-cols-2 gap-6">
            <div className="rounded-3xl border border-primary/20 bg-card overflow-hidden">
              <div className="bg-primary/5 px-7 py-5 border-b border-primary/10">
                <h3 className="font-bold text-foreground flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-primary" /> Points of Agreement
                </h3>
              </div>
              <ul className="px-7 py-6 space-y-4">
                {agreementPoints.map((point, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-muted-foreground">
                    <span className="text-primary mt-0.5 font-bold">✓</span>
                    <span className="leading-relaxed">{point}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-3xl border border-secondary/20 bg-card overflow-hidden">
              <div className="bg-secondary/5 px-7 py-5 border-b border-secondary/10">
                <h3 className="font-bold text-foreground flex items-center gap-2">
                  <XCircle className="h-5 w-5 text-secondary" /> Points of Disagreement
                </h3>
              </div>
              <ul className="px-7 py-6 space-y-4">
                {disagreementPoints.map((point, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-muted-foreground">
                    <span className="text-secondary mt-0.5 font-bold">✗</span>
                    <span className="leading-relaxed">{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        )}

        {/* Conclusion tab - unchanged */}
        {activeTab === "conclusion" && (
          <motion.div key="conclusion" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.25 }}>
            <div className="rounded-3xl border border-border bg-card overflow-hidden">
              <div className="bg-primary/5 px-8 py-6 border-b border-primary/10">
                <h3 className="font-bold text-foreground flex items-center gap-2 text-lg">
                  <Quote className="h-5 w-5 text-primary" /> Scholarly Conclusion
                </h3>
              </div>
              <div className="px-8 py-8">
                {conclusion ? (
                  <div className="space-y-6">
                    <p className="text-muted-foreground leading-relaxed text-base">{conclusion}</p>
                    <div className="bg-primary/5 border border-primary/15 rounded-2xl p-6">
                      <p className="text-sm text-muted-foreground italic leading-relaxed">
                        &quot;This conclusion represents the synthesis of both positions and does not necessarily
                        reflect the official stance of Ummah Thoughts. Readers are encouraged to study both
                        positions thoroughly.&quot;
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-16">
                    <Clock className="h-14 w-14 text-muted-foreground mx-auto mb-5 opacity-40" />
                    <p className="text-muted-foreground text-lg">This debate is still active.</p>
                    <p className="text-muted-foreground/70 text-sm mt-1">
                      Conclusion will be added once both scholars have presented their final arguments.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};