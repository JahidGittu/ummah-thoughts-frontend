"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { motion, AnimatePresence } from "framer-motion";
import {
  Video, Mic, MicOff, VideoOff, Users, MessageSquare,
  Hand, Clock, Shield, Send, BookOpen, Scale, ChevronRight,
  ThumbsUp, CheckCircle, AlertTriangle, BarChart3, BookMarked,
  Star, ArrowRight, Gavel, MessagesSquare, Play, Square, UserX,
  Settings, CheckCircle2, XCircle, Lock
} from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { AuthUser } from "@/contexts/AuthContext";

interface Participant {
  id: string;
  name: string;
  role: "scholar" | "moderator" | "research_assistant" | "member";
  avatar?: string;
  isSpeaking?: boolean;
  isMuted?: boolean;
  isVideoOff?: boolean;
  isBanned?: boolean;
}

interface Evidence {
  type: "quran" | "hadith" | "scholarly";
  reference: string;
  arabic?: string;
  translation: string;
  scholar: "A" | "B";
}

interface QueuedQuestion {
  id: string;
  userId?: string;
  user: string;
  text: string;
  upvotes: number;
  upvotedByMe: boolean;
  approved: boolean;
  timestamp: string;
}

interface HandRaisedUser {
  userId: string;
  name: string;
  timestamp: number;
}

interface LiveDebateRoomProps {
  title: string;
  topic: string;
  moderator: Participant;
  speakers: Participant[];
  viewers: number;
  duration: string;
  currentPhase: "opening" | "position_a" | "position_b" | "rebuttal" | "qa" | "closing";
  evidences?: Evidence[];
  onLeave?: () => void;
  currentUser: AuthUser | null;
}

const phases = ["opening", "position_a", "position_b", "rebuttal", "qa", "closing"] as const;

const phaseConfig = {
  opening:    { label: "Opening",     icon: Gavel,          duration: 300  },
  position_a: { label: "Position A",  icon: Scale,          duration: 900  },
  position_b: { label: "Position B",  icon: Scale,          duration: 900  },
  rebuttal:   { label: "Rebuttal",    icon: MessagesSquare, duration: 600  },
  qa:         { label: "Q&A",         icon: MessageSquare,  duration: 600  },
  closing:    { label: "Closing",     icon: CheckCircle,    duration: 300  },
};

const roleLabels = {
  scholar:            { label: "Scholar",   color: "bg-primary/20 text-primary" },
  moderator:          { label: "Moderator", color: "bg-amber-500/20 text-amber-600" },
  research_assistant: { label: "Assistant", color: "bg-blue-500/20 text-blue-600" },
  member:             { label: "Member",    color: "bg-muted text-muted-foreground" },
};

const defaultEvidences: Evidence[] = [
  { type: "quran", reference: "Surah Ash-Shura 42:38", arabic: "وَأَمْرُهُمْ شُورَىٰ بَيْنَهُمْ", translation: "And their affairs are conducted by mutual consultation", scholar: "A" },
  { type: "quran", reference: "Surah Aal-Imran 3:159", arabic: "فَإِذَا عَزَمْتَ فَتَوَكَّلْ عَلَى اللَّهِ", translation: "Then when you have decided, put your trust in Allah", scholar: "B" },
  { type: "hadith", reference: "Reported by Bukhari", translation: "The Prophet ﷺ consulted his companions and often followed their majority opinion", scholar: "A" },
  { type: "scholarly", reference: "Al-Mawardi, Al-Ahkam al-Sultaniyyah", translation: "Classical scholars emphasized the ruler's discretion in implementing consultation outcomes", scholar: "B" },
];

const initialQuestions: QueuedQuestion[] = [
  { id: "q1", user: "Brother Omar", text: "How did the Khulafa Rashidun handle binding Shura in practice?", upvotes: 14, upvotedByMe: false, approved: true, timestamp: "12:03" },
  { id: "q2", user: "Sister Fatima", text: "Does this ruling differ for a non-Muslim majority state?", upvotes: 9, upvotedByMe: false, approved: false, timestamp: "12:07" },
  { id: "q3", user: "Br. Khalid", text: "What is the difference between shura mulzimah and istisharah?", upvotes: 7, upvotedByMe: false, approved: false, timestamp: "12:10" },
];

const initialJoiners: Participant[] = [
  { id: "j1", name: "Br. Yusuf", role: "member" },
  { id: "j2", name: "Sr. Aisha", role: "member" },
  { id: "j3", name: "Br. Hassan", role: "research_assistant" },
];

function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60).toString().padStart(2, "0");
  const s = (seconds % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

export const LiveDebateRoom = ({
  title, topic, moderator, speakers: initialSpeakers, viewers: initialViewers,
  currentPhase: initialPhase = "position_a", evidences = defaultEvidences,
  onLeave, currentUser,
}: LiveDebateRoomProps) => {
  const router = useRouter();

  // Determine user role in this room
  const isAuthenticated = !!currentUser;
  const isAdmin = currentUser?.role === "admin";
  const isSpeaker = speakers.some(s => s.id === currentUser?.id);
  const isModerator = isAdmin; // Only admins can moderate
  const isAudience = isAuthenticated && !isSpeaker && !isModerator;

  // My own controls
  const [myMuted, setMyMuted] = useState(true);
  const [myVideoOff, setMyVideoOff] = useState(true);
  const [handRaised, setHandRaised] = useState(false);
  const [question, setQuestion] = useState("");

  // Phase & timer
  const [activePhaseIdx, setActivePhaseIdx] = useState(phases.indexOf(initialPhase));
  const [phaseTimeLeft, setPhaseTimeLeft] = useState(phaseConfig[initialPhase].duration);
  const [viewers, setViewers] = useState(initialViewers);

  // Tabs
  const [activeTab, setActiveTab] = useState<"chat" | "evidence">("chat");
  const [evidenceFilter, setEvidenceFilter] = useState<"all" | "A" | "B">("all");

  // Clarity votes
  const [clarityA, setClarityA] = useState(73);
  const [clarityB, setClarityB] = useState(54);
  const [myVote, setMyVote] = useState<"A" | "B" | null>(null);

  // Q&A
  const [questions, setQuestions] = useState<QueuedQuestion[]>(initialQuestions);

  // Hand raised users (for moderator)
  const [handRaisedUsers, setHandRaisedUsers] = useState<HandRaisedUser[]>([]);

  // Moderator state
  const [debateStarted, setDebateStarted] = useState(true);
  const [debatePaused, setDebatePaused] = useState(false);
  const [speakers, setSpeakers] = useState(initialSpeakers.map(s => ({ ...s, isMuted: false, isVideoOff: false, isBanned: false })));
  const [joiners, setJoiners] = useState<Participant[]>(initialJoiners);
  const [showModPanel, setShowModPanel] = useState(isModerator);
  const [showEndDialog, setShowEndDialog] = useState(false);
  const [showKickDialog, setShowKickDialog] = useState<string | null>(null);

  // Media permission dialog
  const [showMediaDialog, setShowMediaDialog] = useState(false);
  const [mediaAction, setMediaAction] = useState<"mic" | "video">("mic");

  const currentPhase = phases[activePhaseIdx];
  const PhaseIcon = phaseConfig[currentPhase].icon;
  const totalDuration = phaseConfig[currentPhase].duration;
  const phaseProgress = ((totalDuration - phaseTimeLeft) / totalDuration) * 100;

  // Countdown timer
  useEffect(() => {
    if (!debateStarted || debatePaused) return;
    const timer = setInterval(() => {
      setPhaseTimeLeft(t => {
        if (t <= 1) {
          if (activePhaseIdx < phases.length - 1) {
            setActivePhaseIdx(prev => prev + 1);
            return phaseConfig[phases[activePhaseIdx + 1]].duration;
          }
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [activePhaseIdx, debateStarted, debatePaused]);

  // Viewer simulation
  useEffect(() => {
    const interval = setInterval(() => setViewers(v => Math.max(1, v + Math.floor(Math.random() * 5) - 2)), 4000);
    return () => clearInterval(interval);
  }, []);

  // Participant actions
  const handleToggleMic = () => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }
    if (myMuted) { setMediaAction("mic"); setShowMediaDialog(true); }
    else { setMyMuted(true); toast("Microphone muted"); }
  };

  const handleToggleVideo = () => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }
    if (myVideoOff) { setMediaAction("video"); setShowMediaDialog(true); }
    else { setMyVideoOff(true); toast("Camera turned off"); }
  };

  const confirmMedia = () => {
    if (mediaAction === "mic") { setMyMuted(false); toast.success("Microphone enabled"); }
    else { setMyVideoOff(false); toast.success("Camera enabled"); }
    setShowMediaDialog(false);
  };

  const handleRaiseHand = () => {
    if (!isAudience) return;
    const newState = !handRaised;
    setHandRaised(newState);
    
    if (newState && currentUser) {
      setHandRaisedUsers(prev => [...prev, { 
        userId: currentUser.id, 
        name: currentUser.name,
        timestamp: Date.now()
      }]);
      toast.success("✋ Hand raised – moderator will acknowledge you");
    } else {
      setHandRaisedUsers(prev => prev.filter(u => u.userId !== currentUser?.id));
      toast("Hand lowered");
    }
  };

  const handleSubmitQuestion = () => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }
    if (!question.trim()) return;
    
    const newQuestion: QueuedQuestion = {
      id: `q${Date.now()}`,
      userId: currentUser?.id,
      user: currentUser?.name || "You",
      text: question.trim(),
      upvotes: 0,
      upvotedByMe: false,
      approved: false,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
    
    setQuestions(prev => [...prev, newQuestion]);
    setQuestion("");
    toast.success("Question submitted for moderator review");
  };

  const handleUpvote = (qId: string) => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }
    setQuestions(prev => prev.map(q =>
      q.id === qId ? { 
        ...q, 
        upvotes: q.upvotedByMe ? q.upvotes - 1 : q.upvotes + 1, 
        upvotedByMe: !q.upvotedByMe 
      } : q
    ));
  };

  const handleVote = (side: "A" | "B") => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }
    if (myVote) return;
    setMyVote(side);
    if (side === "A") setClarityA(v => v + 1); else setClarityB(v => v + 1);
    toast.success(`Vote recorded — Position ${side}`);
  };

  // Moderator-only actions
  const handleToggleSpeakerMic = (id: string) => {
    setSpeakers(prev => prev.map(s => s.id === id ? { ...s, isMuted: !s.isMuted, isSpeaking: s.isMuted ? s.isSpeaking : false } : s));
    const sp = speakers.find(s => s.id === id);
    toast(sp?.isMuted ? `${sp.name} unmuted` : `${sp?.name} muted by moderator`);
  };

  const handleToggleSpeakerVideo = (id: string) => {
    setSpeakers(prev => prev.map(s => s.id === id ? { ...s, isVideoOff: !s.isVideoOff } : s));
    const sp = speakers.find(s => s.id === id);
    toast(sp?.isVideoOff ? `${sp.name} camera enabled` : `${sp?.name} camera disabled by moderator`);
  };

  const handleKickSpeaker = (id: string) => {
    setSpeakers(prev => prev.filter(s => s.id !== id));
    setShowKickDialog(null);
    toast.success("Participant removed from debate");
  };

  const handleAdmitJoiner = (id: string) => {
    const joiner = joiners.find(j => j.id === id);
    if (joiner) {
      setSpeakers(prev => [...prev, { ...joiner, isSpeaking: false, isMuted: true, isVideoOff: true, isBanned: false }]);
      setJoiners(prev => prev.filter(j => j.id !== id));
      toast.success(`${joiner.name} admitted`);
    }
  };

  const handleDenyJoiner = (id: string) => {
    const joiner = joiners.find(j => j.id === id);
    setJoiners(prev => prev.filter(j => j.id !== id));
    toast(`${joiner?.name} denied entry`);
  };

  const handleApproveQuestion = (qId: string) => {
    setQuestions(prev => prev.map(q => q.id === qId ? { ...q, approved: true } : q));
    toast.success("Question approved");
  };

  const handleRejectQuestion = (qId: string) => {
    setQuestions(prev => prev.filter(q => q.id !== qId));
    toast("Question removed");
  };

  const handleAdmitFromHandRaise = (userId: string) => {
    const user = handRaisedUsers.find(u => u.userId === userId);
    if (user) {
      // In a real app, you'd add them to speakers
      setHandRaisedUsers(prev => prev.filter(u => u.userId !== userId));
      if (userId === currentUser?.id) setHandRaised(false);
      toast.success(`${user.name} admitted as speaker`);
    }
  };

  const handleDismissHandRaise = (userId: string) => {
    setHandRaisedUsers(prev => prev.filter(u => u.userId !== userId));
    if (userId === currentUser?.id) setHandRaised(false);
    toast("Hand raise dismissed");
  };

  const handleToggleDebate = () => {
    if (debateStarted && !debatePaused) { setDebatePaused(true); toast("⏸ Debate paused"); }
    else if (debatePaused) { setDebatePaused(false); toast.success("▶ Debate resumed"); }
    else { setDebateStarted(true); toast.success("▶ Debate started"); }
  };

  const handleEndDebate = () => {
    setDebateStarted(false); setDebatePaused(false); setShowEndDialog(false);
    toast.success("Debate ended by moderator");
    onLeave?.();
  };

  const handleAdvancePhase = () => {
    if (activePhaseIdx < phases.length - 1) {
      const nextIdx = activePhaseIdx + 1;
      setActivePhaseIdx(nextIdx);
      setPhaseTimeLeft(phaseConfig[phases[nextIdx]].duration);
      toast.success(`Advanced to: ${phaseConfig[phases[nextIdx]].label}`);
    }
  };

  const totalVotes = clarityA + clarityB;
  const pctA = totalVotes ? Math.round((clarityA / totalVotes) * 100) : 0;
  const pctB = 100 - pctA;
  const filteredEvidences = evidences.filter(e => evidenceFilter === "all" || e.scholar === evidenceFilter);
  const pendingQs = questions.filter(q => !q.approved);

  const evidenceTypeConfig = {
    quran:    { label: "Quran",   color: "bg-primary/10 text-primary border-primary/20" },
    hadith:   { label: "Hadith",  color: "bg-secondary/10 text-secondary border-secondary/20" },
    scholarly:{ label: "Scholar", color: "bg-muted text-muted-foreground border-border" },
  };

  return (
    <div className="min-h-screen bg-background p-3 md:p-4">
      <div className="max-w-7xl mx-auto space-y-4">
        {/* Dialogs */}
        <Dialog open={showMediaDialog} onOpenChange={setShowMediaDialog}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                {mediaAction === "mic" ? <Mic className="h-5 w-5 text-primary" /> : <Video className="h-5 w-5 text-primary" />}
                Enable {mediaAction === "mic" ? "Microphone" : "Camera"}
              </DialogTitle>
              <DialogDescription>
                {mediaAction === "mic"
                  ? "Your microphone will be enabled. The moderator can mute you at any time."
                  : "Your camera will be turned on. The moderator can disable it at any time."}
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="gap-2 sm:gap-0">
              <Button variant="outline" onClick={() => setShowMediaDialog(false)}>Cancel</Button>
              <Button onClick={confirmMedia}>Enable {mediaAction === "mic" ? "Microphone" : "Camera"}</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={showEndDialog} onOpenChange={setShowEndDialog}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-destructive"><Square className="h-5 w-5" /> End Debate</DialogTitle>
              <DialogDescription>This will close the session for everyone. This cannot be undone.</DialogDescription>
            </DialogHeader>
            <DialogFooter className="gap-2 sm:gap-0">
              <Button variant="outline" onClick={() => setShowEndDialog(false)}>Cancel</Button>
              <Button variant="destructive" onClick={handleEndDebate}>End Debate</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={!!showKickDialog} onOpenChange={() => setShowKickDialog(null)}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-destructive"><UserX className="h-5 w-5" /> Remove Participant</DialogTitle>
              <DialogDescription>Remove {speakers.find(s => s.id === showKickDialog)?.name}? They cannot rejoin.</DialogDescription>
            </DialogHeader>
            <DialogFooter className="gap-2 sm:gap-0">
              <Button variant="outline" onClick={() => setShowKickDialog(null)}>Cancel</Button>
              <Button variant="destructive" onClick={() => showKickDialog && handleKickSpeaker(showKickDialog)}>Remove</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              {debateStarted && !debatePaused ? (
                <Badge className="bg-red-500/20 text-red-500 border border-red-500/30 animate-pulse gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 inline-block" /> LIVE
                </Badge>
              ) : debatePaused ? (
                <Badge className="bg-amber-500/20 text-amber-600 border border-amber-500/30 gap-1">⏸ PAUSED</Badge>
              ) : (
                <Badge variant="outline">ENDED</Badge>
              )}
              <Badge variant="outline" className="gap-1"><Clock className="h-3 w-3" /> {formatTime(phaseTimeLeft)}</Badge>
              <Badge variant="outline" className="gap-1"><Users className="h-3 w-3" /> {viewers}</Badge>
              {isModerator && <Badge className="bg-amber-500/20 text-amber-600 border border-amber-500/30 gap-1"><Shield className="h-3 w-3" /> Admin Moderator</Badge>}
            </div>
            <h1 className="text-lg font-bold text-foreground">{title}</h1>
            <p className="text-xs text-muted-foreground flex items-center gap-1"><BookOpen className="h-3 w-3" /> {topic}</p>
          </div>
          <div className="flex gap-2">
            {isModerator && (
              <Button variant="outline" size="sm" onClick={() => setShowModPanel(!showModPanel)} className="gap-1.5">
                <Settings className="h-4 w-4" /> {showModPanel ? "Hide" : "Show"} Controls
              </Button>
            )}
            <Button variant="destructive" size="sm" onClick={onLeave}>Leave</Button>
          </div>
        </div>

        {/* Moderator Control Panel - Only visible to admins */}
        <AnimatePresence>
          {isModerator && showModPanel && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}>
              <Card className="border-amber-500/30 bg-amber-500/5">
                <CardHeader className="py-3 pb-2">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Shield className="h-4 w-4 text-amber-600" /> Moderator Control Panel
                  </CardTitle>
                </CardHeader>
                <CardContent className="pb-4">
                  <div className="grid md:grid-cols-4 gap-4">
                    {/* Col 1: Debate Flow */}
                    <div className="space-y-3">
                      <p className="text-[11px] font-bold text-amber-700 uppercase tracking-wider">Debate Flow</p>
                      <div className="flex flex-col gap-2">
                        <Button size="sm" variant={debatePaused ? "default" : "outline"} onClick={handleToggleDebate} className="gap-1.5 w-full justify-start">
                          {debateStarted && !debatePaused ? <><Square className="h-3.5 w-3.5" /> Pause Debate</>
                            : debatePaused ? <><Play className="h-3.5 w-3.5" /> Resume Debate</>
                            : <><Play className="h-3.5 w-3.5" /> Start Debate</>}
                        </Button>
                        <Button size="sm" variant="outline" onClick={handleAdvancePhase} disabled={activePhaseIdx >= phases.length - 1} className="gap-1.5 w-full justify-start">
                          <ArrowRight className="h-3.5 w-3.5" /> Next Phase
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => setShowEndDialog(true)} disabled={!debateStarted} className="gap-1.5 w-full justify-start">
                          <Square className="h-3.5 w-3.5" /> End Debate
                        </Button>
                      </div>
                      <p className="text-[10px] text-muted-foreground">Current: <strong>{phaseConfig[currentPhase].label}</strong></p>
                    </div>

                    {/* Col 2: Speakers */}
                    <div className="space-y-3">
                      <p className="text-[11px] font-bold text-amber-700 uppercase tracking-wider">Speakers ({speakers.length})</p>
                      <div className="space-y-1.5 max-h-48 overflow-y-auto">
                        {speakers.map(s => (
                          <div key={s.id} className="flex items-center gap-2 p-2 rounded-lg bg-background border border-border">
                            <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary">{s.name.charAt(0)}</div>
                            <span className="text-xs font-medium flex-1 min-w-0 truncate">{s.name}</span>
                            <div className="flex gap-1">
                              <Button size="icon" variant={s.isMuted ? "destructive" : "ghost"} className="h-6 w-6" onClick={() => handleToggleSpeakerMic(s.id)} title={s.isMuted ? "Unmute" : "Mute"}>
                                {s.isMuted ? <MicOff className="h-3 w-3" /> : <Mic className="h-3 w-3" />}
                              </Button>
                              <Button size="icon" variant={s.isVideoOff ? "destructive" : "ghost"} className="h-6 w-6" onClick={() => handleToggleSpeakerVideo(s.id)} title={s.isVideoOff ? "Enable camera" : "Disable camera"}>
                                {s.isVideoOff ? <VideoOff className="h-3 w-3" /> : <Video className="h-3 w-3" />}
                              </Button>
                              <Button size="icon" variant="ghost" className="h-6 w-6 text-destructive hover:bg-destructive/10" onClick={() => setShowKickDialog(s.id)} title="Remove">
                                <UserX className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Col 3: Join Requests */}
                    <div className="space-y-3">
                      <p className="text-[11px] font-bold text-amber-700 uppercase tracking-wider">Join Requests ({joiners.length})</p>
                      <div className="space-y-1.5 max-h-48 overflow-y-auto">
                        {joiners.map(j => (
                          <div key={j.id} className="flex items-center gap-2 p-2 rounded-lg bg-background border border-border">
                            <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-[10px] font-bold">{j.name.charAt(0)}</div>
                            <span className="text-xs flex-1 truncate">{j.name}</span>
                            <Button size="sm" className="h-6 text-[10px] px-2 gap-1" onClick={() => handleAdmitJoiner(j.id)}>
                              <CheckCircle2 className="h-2.5 w-2.5" /> Admit
                            </Button>
                            <Button size="sm" variant="ghost" className="h-6 text-[10px] px-2 gap-1 text-destructive" onClick={() => handleDenyJoiner(j.id)}>
                              <XCircle className="h-2.5 w-2.5" /> Deny
                            </Button>
                          </div>
                        ))}
                        {joiners.length === 0 && (
                          <p className="text-[10px] text-muted-foreground text-center py-2">No pending requests</p>
                        )}
                      </div>
                    </div>

                    {/* Col 4: Hand Raised & Questions */}
                    <div className="space-y-3">
                      <p className="text-[11px] font-bold text-amber-700 uppercase tracking-wider">Hand Raised ({handRaisedUsers.length})</p>
                      <div className="space-y-1.5 max-h-48 overflow-y-auto">
                        {handRaisedUsers.map(u => (
                          <div key={u.userId} className="flex items-center justify-between p-2 rounded-lg bg-background border border-border">
                            <span className="text-xs font-medium">{u.name}</span>
                            <div className="flex gap-1">
                              <Button size="sm" className="h-6 text-[10px] px-2" onClick={() => handleAdmitFromHandRaise(u.userId)}>
                                Admit
                              </Button>
                              <Button size="sm" variant="ghost" className="h-6 text-[10px] px-2" onClick={() => handleDismissHandRaise(u.userId)}>
                                Dismiss
                              </Button>
                            </div>
                          </div>
                        ))}
                        {handRaisedUsers.length === 0 && (
                          <p className="text-[10px] text-muted-foreground text-center py-2">No hands raised</p>
                        )}
                      </div>

                      <p className="text-[11px] font-bold text-amber-700 uppercase tracking-wider mt-3">Pending Questions ({pendingQs.length})</p>
                      <div className="space-y-1.5 max-h-48 overflow-y-auto">
                        {pendingQs.map(q => (
                          <div key={q.id} className="flex items-start gap-2 p-2 rounded-lg bg-background border border-border">
                            <div className="flex-1 min-w-0">
                              <span className="text-[10px] font-semibold">{q.user}</span>
                              <p className="text-[10px] text-muted-foreground truncate">{q.text}</p>
                            </div>
                            <div className="flex gap-1 flex-shrink-0">
                              <Button size="icon" variant="ghost" className="h-6 w-6 text-primary hover:bg-primary/10" onClick={() => handleApproveQuestion(q.id)}>
                                <CheckCircle2 className="h-3 w-3" />
                              </Button>
                              <Button size="icon" variant="ghost" className="h-6 w-6 text-destructive hover:bg-destructive/10" onClick={() => handleRejectQuestion(q.id)}>
                                <XCircle className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        ))}
                        {pendingQs.length === 0 && (
                          <p className="text-[10px] text-muted-foreground text-center py-2">No pending questions</p>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Phase Progress */}
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="py-3">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <PhaseIcon className="h-4 w-4 text-primary" />
                <span className="text-sm font-semibold">{phaseConfig[currentPhase].label}</span>
                <Badge className="bg-primary/20 text-primary text-xs">{formatTime(phaseTimeLeft)}</Badge>
              </div>
              <span className="text-xs text-muted-foreground">Phase {activePhaseIdx + 1}/{phases.length}</span>
            </div>
            <div className="flex items-center gap-0 mb-2">
              {phases.map((phase, idx) => {
                const isActive = idx === activePhaseIdx;
                const isDone = idx < activePhaseIdx;
                return (
                  <div key={phase} className="flex items-center flex-1">
                    <div className="relative flex flex-col items-center">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold border-2 transition-all ${
                        isActive ? "bg-primary text-primary-foreground border-primary scale-110 shadow-md shadow-primary/30"
                        : isDone ? "bg-primary/20 text-primary border-primary/40"
                        : "bg-muted text-muted-foreground border-border"
                      }`}>{isDone ? <CheckCircle className="w-3 h-3" /> : idx + 1}</div>
                      <span className={`text-[8px] mt-0.5 hidden sm:block whitespace-nowrap ${isActive ? "text-primary font-semibold" : "text-muted-foreground"}`}>
                        {phaseConfig[phase].label}
                      </span>
                    </div>
                    {idx < phases.length - 1 && <div className={`h-0.5 flex-1 mx-0.5 ${isDone ? "bg-primary/40" : "bg-border"}`} />}
                  </div>
                );
              })}
            </div>
            <Progress value={phaseProgress} className="h-1" />
          </CardContent>
        </Card>

        {/* Speaker Stage */}
        <div className="grid md:grid-cols-2 gap-4">
          {speakers.slice(0, 2).map((speaker, i) => (
            <motion.div key={speaker.id} initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }}
              className={`relative rounded-2xl border-2 overflow-hidden ${
                speaker.isSpeaking && !speaker.isMuted
                  ? i === 0 ? "border-primary shadow-lg shadow-primary/20" : "border-secondary shadow-lg shadow-secondary/20"
                  : "border-border"
              }`} style={{ minHeight: 200 }}>
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-card to-muted/60 p-6">
                <div className={`absolute top-3 left-3 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                  i === 0 ? "bg-primary/20 text-primary" : "bg-secondary/20 text-secondary"
                }`}>Position {i === 0 ? "A" : "B"}</div>
                <div className="absolute top-3 right-3 flex gap-1">
                  {speaker.isMuted && (
                    <div className="w-6 h-6 rounded-full bg-destructive/20 flex items-center justify-center"><MicOff className="h-3 w-3 text-destructive" /></div>
                  )}
                  {speaker.isVideoOff && (
                    <div className="w-6 h-6 rounded-full bg-destructive/20 flex items-center justify-center"><VideoOff className="h-3 w-3 text-destructive" /></div>
                  )}
                </div>
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-2 ${i === 0 ? "bg-primary/20" : "bg-secondary/20"}`}>
                  <span className={`text-2xl font-bold ${i === 0 ? "text-primary" : "text-secondary"}`}>{speaker.name.charAt(0)}</span>
                </div>
                <p className="font-bold text-foreground text-sm">{speaker.name}</p>
                <Badge className={`${roleLabels[speaker.role].color} mt-1 text-[10px]`}>{roleLabels[speaker.role].label}</Badge>
                {speaker.isSpeaking && !speaker.isMuted && (
                  <div className="flex items-end gap-1 mt-3">
                    {[2,3,5,4,6,4,5,3,2].map((h, j) => (
                      <div key={j} className={`w-1 rounded-full animate-pulse ${i === 0 ? "bg-primary" : "bg-secondary"}`}
                        style={{ height: `${h * 2.5}px`, animationDelay: `${j * 0.08}s` }} />
                    ))}
                    <span className={`text-[10px] ml-1.5 font-medium ${i === 0 ? "text-primary" : "text-secondary"}`}>Speaking</span>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom Section */}
        <div className="grid lg:grid-cols-3 gap-4">
          {/* Left Column - Controls & Voting */}
          <div className="space-y-4">
            {/* My Controls */}
            <Card>
              <CardHeader className="py-2.5 pb-1">
                <CardTitle className="text-xs text-muted-foreground">Your Controls</CardTitle>
              </CardHeader>
              <CardContent className="pb-3">
                {isAuthenticated ? (
                  <div className="flex items-center gap-2 flex-wrap">
                    {isSpeaker && (
                      <>
                        <Button variant={myMuted ? "destructive" : "outline"} size="icon" onClick={handleToggleMic} className="h-9 w-9" title={myMuted ? "Unmute" : "Mute"}>
                          {myMuted ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                        </Button>
                        <Button variant={myVideoOff ? "destructive" : "outline"} size="icon" onClick={handleToggleVideo} className="h-9 w-9" title={myVideoOff ? "Camera on" : "Camera off"}>
                          {myVideoOff ? <VideoOff className="h-4 w-4" /> : <Video className="h-4 w-4" />}
                        </Button>
                        <Separator orientation="vertical" className="h-7" />
                      </>
                    )}
                    
                    {isAudience && (
                      <>
                        <Button
                          variant={handRaised ? "default" : "outline"}
                          size="sm"
                          onClick={handleRaiseHand}
                          className={`gap-1.5 ${handRaised ? "bg-amber-500 hover:bg-amber-600 text-white border-amber-500" : ""}`}
                        >
                          <Hand className={`h-3.5 w-3.5 ${handRaised ? "animate-bounce" : ""}`} />
                          {handRaised ? "Raised ✓" : "Raise Hand"}
                        </Button>
                      </>
                    )}

                    {isModerator && (
                      <p className="text-xs text-muted-foreground">Use moderator panel above</p>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-2">
                    <Lock className="h-5 w-5 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-xs text-muted-foreground mb-2">Sign in to participate</p>
                    <Button size="sm" variant="outline" className="w-full" onClick={() => router.push("/login")}>
                      Sign In
                    </Button>
                  </div>
                )}
                {isAuthenticated && (
                  <p className="text-[10px] text-muted-foreground mt-2 flex items-center gap-1">
                    <Shield className="h-2.5 w-2.5" />
                    {!isSpeaker && !isModerator ? "Audience mode — raise hand to speak" : "Active participant"}
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Clarity Voting - Only for authenticated users */}
            {isAuthenticated ? (
              <Card>
                <CardHeader className="py-2.5 pb-1">
                  <CardTitle className="text-xs flex items-center gap-2">
                    <BarChart3 className="h-3.5 w-3.5 text-primary" /> Clarity Voting
                    <span className="text-[10px] font-normal text-muted-foreground ml-auto">{totalVotes} votes</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="pb-3 space-y-2.5">
                  <div>
                    <div className="flex items-center justify-between text-[10px] mb-1">
                      <span className="font-medium text-primary">Position A · {speakers[0]?.name.split(" ")[0] ?? "—"}</span>
                      <span className="text-muted-foreground">{pctA}%</span>
                    </div>
                    <div className="relative h-2.5 bg-muted rounded-full overflow-hidden">
                      <motion.div className="absolute inset-y-0 left-0 bg-primary rounded-full" initial={{ width: 0 }} animate={{ width: `${pctA}%` }} transition={{ duration: 0.6 }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between text-[10px] mb-1">
                      <span className="font-medium text-secondary">Position B · {speakers[1]?.name.split(" ")[0] ?? "—"}</span>
                      <span className="text-muted-foreground">{pctB}%</span>
                    </div>
                    <div className="relative h-2.5 bg-muted rounded-full overflow-hidden">
                      <motion.div className="absolute inset-y-0 left-0 bg-secondary rounded-full" initial={{ width: 0 }} animate={{ width: `${pctB}%` }} transition={{ duration: 0.6 }} />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <Button size="sm" variant={myVote === "A" ? "default" : "outline"} className="text-xs" onClick={() => handleVote("A")} disabled={!!myVote}>
                      <Star className="h-3 w-3 mr-1" /> Position A
                    </Button>
                    <Button size="sm" variant={myVote === "B" ? "default" : "outline"} className="text-xs" onClick={() => handleVote("B")} disabled={!!myVote}>
                      <Star className="h-3 w-3 mr-1" /> Position B
                    </Button>
                  </div>
                  {myVote && (
                    <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-[10px] text-center text-muted-foreground">
                      ✓ You voted Position {myVote}
                    </motion.p>
                  )}
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="py-4 text-center">
                  <Lock className="h-5 w-5 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-xs text-muted-foreground">Sign in to vote on clarity</p>
                </CardContent>
              </Card>
            )}

            {/* Participants List */}
            <Card>
              <CardHeader className="py-2.5 pb-1">
                <CardTitle className="text-xs flex items-center gap-2"><Users className="h-3.5 w-3.5" /> Participants</CardTitle>
              </CardHeader>
              <CardContent className="pb-3">
                <div className="space-y-1.5">
                  {/* Moderator */}
                  <div className="flex items-center gap-2 p-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20">
                    <div className="w-7 h-7 rounded-full bg-amber-500/20 flex items-center justify-center text-xs font-bold text-amber-600">{moderator.name.charAt(0)}</div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium truncate">{moderator.name}</p>
                      <p className="text-[10px] text-amber-600">Moderator</p>
                    </div>
                    <Gavel className="h-3 w-3 text-amber-500" />
                  </div>
                  
                  {/* Speakers */}
                  {speakers.map((s, i) => (
                    <div key={s.id} className={`flex items-center gap-2 p-1.5 rounded-lg border ${
                      s.isSpeaking && !s.isMuted ? "bg-primary/5 border-primary/20" : "bg-background/50 border-transparent"
                    }`}>
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                        i === 0 ? "bg-primary/20 text-primary" : "bg-secondary/20 text-secondary"
                      }`}>{s.name.charAt(0)}</div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium truncate">{s.name}</p>
                        <p className={`text-[10px] ${i === 0 ? "text-primary" : "text-secondary"}`}>
                          Pos. {i === 0 ? "A" : "B"}{s.isMuted ? " · Muted" : ""}{s.isVideoOff ? " · No cam" : ""}
                        </p>
                      </div>
                      {s.isSpeaking && !s.isMuted && (
                        <div className="flex items-end gap-0.5">
                          {[2,3,4,3,2].map((h, j) => (
                            <div key={j} className="w-0.5 bg-primary rounded-full animate-pulse" style={{ height: `${h * 2}px`, animationDelay: `${j * 0.1}s` }} />
                          ))}
                        </div>
                      )}
                    </div>
                  ))}

                  {/* Current user if hand raised */}
                  {handRaised && isAudience && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2 p-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20">
                      <div className="w-7 h-7 rounded-full bg-muted flex items-center justify-center text-xs">Y</div>
                      <div><p className="text-xs font-medium">You</p><p className="text-[10px] text-amber-600">✋ Hand Raised</p></div>
                    </motion.div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Center & Right Columns - Q&A / Evidence */}
          <div className="lg:col-span-2 space-y-4">
            {/* Q&A / Evidence Tabs */}
            <Card className="flex flex-col" style={{ minHeight: 360 }}>
              <CardHeader className="py-2.5 pb-0">
                <div className="flex gap-1 border-b border-border pb-2">
                  {(["chat", "evidence"] as const).map(tab => (
                    <button key={tab} onClick={() => setActiveTab(tab)}
                      className={`text-xs px-3 py-1.5 rounded-md font-medium transition-colors ${
                        activeTab === tab ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground"
                      }`}>
                      {tab === "chat" ? <><MessageSquare className="h-3 w-3 inline mr-1" />Q&A</> : <><BookMarked className="h-3 w-3 inline mr-1" />Evidence</>}
                    </button>
                  ))}
                </div>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col py-2 pb-3 overflow-hidden">
                <AnimatePresence mode="wait">
                  {activeTab === "chat" ? (
                    <motion.div key="chat" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col flex-1 overflow-hidden">
                      <ScrollArea className="flex-1 pr-1">
                        <div className="space-y-2 pb-1">
                          {questions
                            .sort((a, b) => b.upvotes - a.upvotes)
                            .filter(q => q.approved || (isModerator) || (q.userId === currentUser?.id))
                            .map(q => (
                              <div key={q.id} className={`p-2.5 rounded-lg text-xs border ${q.approved ? "bg-primary/5 border-primary/20" : "bg-muted/50 border-border"}`}>
                                <div className="flex items-start justify-between gap-2">
                                  <div>
                                    <span className="font-medium text-foreground">{q.user}</span>
                                    {!q.approved && (
                                      <Badge className="ml-1 text-[9px] bg-amber-500/20 text-amber-600 py-0">Pending</Badge>
                                    )}
                                    <p className="text-muted-foreground mt-0.5">{q.text}</p>
                                  </div>
                                  <button 
                                    onClick={() => handleUpvote(q.id)}
                                    className={`flex flex-col items-center gap-0.5 px-1.5 py-1 rounded-md transition-colors ${
                                      q.upvotedByMe ? "text-primary bg-primary/10" : "text-muted-foreground hover:text-primary"
                                    }`}
                                    disabled={!isAuthenticated}
                                  >
                                    <ThumbsUp className="h-3 w-3" />
                                    <span className="text-[10px] font-bold">{q.upvotes}</span>
                                  </button>
                                </div>
                              </div>
                            ))}
                        </div>
                      </ScrollArea>

                      {/* Question input - only for authenticated users */}
                      {isAuthenticated ? (
                        <div className="flex gap-1.5 mt-2">
                          <Input 
                            placeholder="Submit a question..." 
                            value={question} 
                            onChange={e => setQuestion(e.target.value)} 
                            onKeyDown={e => e.key === "Enter" && handleSubmitQuestion()} 
                            className="text-xs h-8" 
                          />
                          <Button size="icon" className="h-8 w-8 flex-shrink-0" onClick={handleSubmitQuestion}>
                            <Send className="h-3 w-3" />
                          </Button>
                        </div>
                      ) : (
                        <div className="mt-2 p-2 text-center border border-dashed border-border rounded-lg">
                          <p className="text-[10px] text-muted-foreground">
                            <Lock className="h-3 w-3 inline mr-1" />
                            Sign in to ask questions
                          </p>
                        </div>
                      )}
                      
                      <p className="text-[10px] text-muted-foreground mt-1">
                        <Shield className="h-2.5 w-2.5 inline mr-0.5" /> 
                        Questions reviewed by moderator before appearing
                      </p>
                    </motion.div>
                  ) : (
                    <motion.div key="evidence" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col flex-1 overflow-hidden">
                      <div className="flex gap-1 mb-2">
                        {(["all", "A", "B"] as const).map(f => (
                          <button key={f} onClick={() => setEvidenceFilter(f)}
                            className={`text-[10px] px-2 py-0.5 rounded-full font-medium transition-colors ${
                              evidenceFilter === f 
                                ? f === "A" 
                                  ? "bg-primary text-primary-foreground" 
                                  : f === "B" 
                                    ? "bg-secondary text-secondary-foreground" 
                                    : "bg-foreground text-background" 
                                : "bg-muted text-muted-foreground"
                            }`}>
                            {f === "all" ? "All" : `Position ${f}`}
                          </button>
                        ))}
                      </div>
                      <ScrollArea className="flex-1">
                        <div className="space-y-2 pb-1">
                          {filteredEvidences.map((ev, idx) => (
                            <div key={idx} className={`p-2.5 rounded-lg border text-xs ${ev.scholar === "A" ? "border-primary/20 bg-primary/5" : "border-secondary/20 bg-secondary/5"}`}>
                              <div className="flex items-center gap-1.5 mb-1">
                                <Badge className={`text-[9px] py-0 ${evidenceTypeConfig[ev.type].color} border`}>
                                  {evidenceTypeConfig[ev.type].label}
                                </Badge>
                                <Badge className={`text-[9px] py-0 ${ev.scholar === "A" ? "bg-primary/20 text-primary" : "bg-secondary/20 text-secondary"}`}>
                                  Pos. {ev.scholar}
                                </Badge>
                              </div>
                              {ev.arabic && (
                                <p className="text-base text-right font-arabic text-foreground leading-relaxed mb-1" dir="rtl">
                                  {ev.arabic}
                                </p>
                              )}
                              <p className="text-muted-foreground italic">"{ev.translation}"</p>
                              <p className="text-muted-foreground/70 mt-1">— {ev.reference}</p>
                            </div>
                          ))}
                        </div>
                      </ScrollArea>
                    </motion.div>
                  )}
                </AnimatePresence>
              </CardContent>
            </Card>

            {/* Debate Adab */}
            <Card className="bg-primary/5 border-primary/20">
              <CardHeader className="py-2.5 pb-1">
                <CardTitle className="text-xs flex items-center gap-2">
                  <Scale className="h-3.5 w-3.5 text-primary" /> Debate Adab
                </CardTitle>
              </CardHeader>
              <CardContent className="pb-3">
                <div className="grid sm:grid-cols-2 gap-x-4 gap-y-2 text-xs text-muted-foreground">
                  {[
                    { icon: CheckCircle, text: "Arguments must be evidence-based", color: "text-primary" },
                    { icon: AlertTriangle, text: "Personal attacks are prohibited", color: "text-destructive" },
                    { icon: Scale, text: "Vote on clarity, not who 'won'", color: "text-secondary" },
                    { icon: BookOpen, text: "All dalils are cited & verifiable", color: "text-primary" },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <item.icon className={`h-3.5 w-3.5 flex-shrink-0 ${item.color}`} />
                      <span>{item.text}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};