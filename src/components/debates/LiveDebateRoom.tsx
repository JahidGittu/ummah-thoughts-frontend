"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
  DialogDescription, DialogFooter,
} from "@/components/ui/dialog";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuLabel, DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { motion, AnimatePresence } from "framer-motion";
import {
  Video, Mic, MicOff, VideoOff, Users, MessageSquare,
  Hand, Clock, Shield, Send, BookOpen, Scale,
  ThumbsUp, CheckCircle, AlertTriangle, BarChart3, BookMarked,
  Star, ArrowRight, Gavel, MessagesSquare, Play, Square, UserX,
  CheckCircle2, XCircle, Lock, CameraOff, Volume2, Sparkles, Radio, ExternalLink,
  ShieldCheck, Check, X, PlusCircle,
} from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { debateApi } from "@/lib/api";
import { AuthUser } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";
import { LiveKitRoom } from "@livekit/components-react";
import "@livekit/components-styles";
import { DebateVideoConference } from "@/components/debates/DebateVideoConference";
import { LiveKitEffectHandler } from "@/components/debates/LiveKitEffectHandler";
import { SidePanelMediaControls } from "@/components/debates/SidePanelMediaControls";
import { PhaseTimer } from "./live/PhaseTimer";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useVirtualBackground, isVirtualBackground, ISLAMIC_BACKGROUNDS, VB_CUSTOM_PREFIX } from "@/hooks/useVirtualBackground";
import { getStoredCustomBackground } from "@/lib/customBackgroundStorage";
import { BackgroundEffectsModal } from "@/components/debates/BackgroundEffectsModal";
import { LiveDebateHeader } from "./live/LiveDebateHeader";
import { VideoStage } from "./live/VideoStage";
import { ChatSection } from "./live/ChatSection";
import { QaSection } from "./live/QaSection";
import { SidebarControl } from "./live/SidebarControl";

// Types
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

export interface QueuedQuestion {
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

export type LiveDebateUserRole = "participant" | "registered_viewer" | "public";

export interface LiveDebateRoomProps {
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
  /** YouTube Live URL for viewer stream (when admin streams to YouTube) */
  youtubeLiveUrl?: string;
  /** debateId for LiveKit room name */
  debateId?: string;
  /** participant | registered_viewer | public */
  userRole?: LiveDebateUserRole;
  /** Use LiveKit for real video (when env configured) */
  useLiveKit?: boolean;
  /** Initial clarity votes from API */
  clarityVotes?: { positionA: number; positionB: number; myVote?: "A" | "B" | null };
  /** Callback when user votes */
  onVoteClarity?: (side: "A" | "B") => void;
  /** Initial Q&A questions from API/realtime */
  initialQuestions?: QueuedQuestion[];
  /** Initial join requests */
  initialJoiners?: Participant[];
  /** Phase timing */
  phaseStartedAt?: string;
  phasePaused?: boolean;
  phaseElapsedTime?: number;
  /** Current hand raises */
  initialHandRaises?: HandRaisedUser[];
}

// Constants
const phases = ["opening", "positionA", "positionB", "rebuttal", "qa", "closing"] as const;
type Phase = typeof phases[number];

const phaseConfig: Record<Phase, { label: string; icon: React.ElementType; duration: number }> = {
  opening:    { label: "Opening",    icon: Gavel,          duration: 300  },
  positionA:  { label: "Position A", icon: Scale,          duration: 900  },
  positionB:  { label: "Position B", icon: Scale,          duration: 900  },
  rebuttal:   { label: "Rebuttal",   icon: MessagesSquare, duration: 600  },
  qa:         { label: "Q&A",        icon: MessageSquare,  duration: 600  },
  closing:    { label: "Closing",    icon: CheckCircle,    duration: 300  },
};

const cameraEffects = [
  { id: "none", label: "None", filter: "" },
  { id: "blur", label: "Blur (full)", filter: "blur(4px)" },
  { id: "grayscale", label: "Grayscale", filter: "grayscale(100%)" },
  { id: "sepia", label: "Sepia", filter: "sepia(100%)" },
  { id: "vintage", label: "Vintage", filter: "sepia(100%) contrast(1.1) brightness(0.9)" },
  { id: "warm", label: "Warm", filter: "sepia(30%) saturate(1.2)" },
  { id: "cool", label: "Cool", filter: "hue-rotate(180deg) saturate(0.8)" },
  { id: "invert", label: "Invert", filter: "invert(100%)" },
  { id: "vb-blur", label: "Virtual Blur", filter: "" },
  ...ISLAMIC_BACKGROUNDS.map((b) => ({ id: b.id, label: b.label, filter: "" })),
] as const;

const roleLabels: Record<string, { label: string; color: string }> = {
  scholar:            { label: "Scholar",   color: "bg-primary/20 text-primary" },
  moderator:          { label: "Moderator", color: "bg-amber-500/20 text-amber-600" },
  research_assistant: { label: "Assistant", color: "bg-blue-500/20 text-blue-600" },
  member:             { label: "Member",    color: "bg-muted text-muted-foreground" },
};

const evidenceTypeConfig = {
  quran:     { label: "Quran",   color: "bg-primary/10 text-primary border-primary/20" },
  hadith:    { label: "Hadith",  color: "bg-secondary/10 text-secondary border-secondary/20" },
  scholarly: { label: "Scholar", color: "bg-muted text-muted-foreground border-border" },
};


function formatTime(s: number) {
  return `${Math.floor(s / 60).toString().padStart(2, "0")}:${(s % 60).toString().padStart(2, "0")}`;
}

function extractYoutubeVideoId(url: string): string | null {
  const m = url?.match(/(?:live\/|v=|embed\/)([a-zA-Z0-9_-]{11})/);
  return m ? m[1] : null;
}

const MAX_SCHOLARS = 3;

/** Shared media controls - same state/handlers everywhere for sync */
function MediaControls({
  myMuted,
  myVideoOff,
  onToggleMic,
  onToggleVideo,
  variant = "default",
}: {
  myMuted: boolean;
  myVideoOff: boolean;
  onToggleMic: () => void;
  onToggleVideo: () => void;
  variant?: "default" | "compact" | "video";
}) {
  const isCompact = variant === "compact" || variant === "video";
  const btnClass = isCompact ? "h-8 w-8" : "h-8 gap-1";
  const activeClass = variant === "video" ? "bg-emerald-600 hover:bg-emerald-700 border-emerald-600" : "";
  return (
    <div className="flex gap-2">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            size={isCompact ? "icon" : "sm"}
            variant={myMuted ? "outline" : "default"}
            className={cn(btnClass, !myMuted && activeClass)}
            onClick={onToggleMic}
          >
            {myMuted ? <MicOff className="h-3.5 w-3.5" /> : <Mic className="h-3.5 w-3.5" />}
            {variant === "default" && (myMuted ? "Mic Off" : "Mic On")}
          </Button>
        </TooltipTrigger>
        <TooltipContent>{myMuted ? "Enable microphone" : "Mute microphone"}</TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            size={isCompact ? "icon" : "sm"}
            variant={myVideoOff ? "outline" : "default"}
            className={cn(btnClass, !myVideoOff && activeClass)}
            onClick={onToggleVideo}
          >
            {myVideoOff ? <VideoOff className="h-3.5 w-3.5" /> : <Video className="h-3.5 w-3.5" />}
            {variant === "default" && (myVideoOff ? "Cam Off" : "Cam On")}
          </Button>
        </TooltipTrigger>
        <TooltipContent>{myVideoOff ? "Enable camera" : "Turn off camera"}</TooltipContent>
      </Tooltip>
    </div>
  );
}

export const LiveDebateRoom = (props: LiveDebateRoomProps) => {
  const {
    title, topic, moderator, speakers: initialSpeakers, viewers: initialViewers,
    currentPhase: initialPhase = "opening", evidences: initialEvidences = [],
    onLeave, currentUser, youtubeLiveUrl, debateId, userRole = "participant", useLiveKit = false,
    clarityVotes: externalClarityVotes, onVoteClarity,
    initialQuestions: propQuestions = [], initialJoiners: propJoiners = [],
    phaseStartedAt, phasePaused: propsPhasePaused
  } = props;
  const router = useRouter();

  // Refs
  const localVideoRef    = useRef<HTMLVideoElement>(null);
  const audioStreamRef   = useRef<MediaStream | null>(null);
  const videoStreamRef   = useRef<MediaStream | null>(null);
  const audioContextRef  = useRef<AudioContext | null>(null);
  const analyserRef      = useRef<AnalyserNode | null>(null);
  const animFrameRef     = useRef<number>(0);
  const activePhaseIdxRef = useRef<number>(phases.indexOf((((initialPhase as any) === "position_a" ? "positionA" : (initialPhase as any) === "position_b" ? "positionB" : initialPhase) as any) as Phase));
  const anonIdRef        = useRef<string | null>(null);
  if (!anonIdRef.current && typeof crypto !== "undefined" && crypto.randomUUID) {
    anonIdRef.current = `anon-${crypto.randomUUID()}`;
  }

  // State
  const [myMuted,         setMyMuted]         = useState(true);
  const [myVideoOff,      setMyVideoOff]       = useState(true);
  const [audioLevel,      setAudioLevel]       = useState(0);
  const [iAmSpeaking,     setIAmSpeaking]      = useState(false);
  const [handRaised,      setHandRaised]       = useState(false);
  const [question,        setQuestion]         = useState("");
  const [activePhaseIdx,  setActivePhaseIdx]   = useState(phases.indexOf(((initialPhase as any) === "position_a" ? "positionA" : (initialPhase as any) === "position_b" ? "positionB" : initialPhase) as Phase));
  const [phaseTimeLeft,   setPhaseTimeLeft]    = useState(phaseConfig[((initialPhase as any) === "position_a" ? "positionA" : (initialPhase as any) === "position_b" ? "positionB" : initialPhase) as Phase]?.duration ?? 0);
  const [viewers,         setViewers]          = useState(initialViewers);
  const [activeTab,       setActiveTab]        = useState<"chat" | "evidence">("chat");
  const [evidenceFilter,  setEvidenceFilter]   = useState<"all" | "A" | "B">("all");
  const [clarityA,        setClarityA]         = useState(externalClarityVotes?.positionA ?? 0);
  const [clarityB,        setClarityB]         = useState(externalClarityVotes?.positionB ?? 0);
  const [myVote,          setMyVote]           = useState<"A" | "B" | null>(externalClarityVotes?.myVote ?? null);
  const [questions,       setQuestions]        = useState<QueuedQuestion[]>(propQuestions);
  const [evidences,       setEvidences]        = useState<Evidence[]>(initialEvidences);
  const [handRaisedUsers, setHandRaisedUsers]  = useState<HandRaisedUser[]>(props.initialHandRaises ?? []);
  const [debateStarted,   setDebateStarted]    = useState(initialPhase !== "opening" || !!propJoiners.length);
  const [debatePaused,    setDebatePaused]     = useState(!!propsPhasePaused);
  const [debateEnded,     setDebateEnded]      = useState(false);
  const [speakers,        setSpeakers]         = useState(
    initialSpeakers.map(s => ({ ...s, isMuted: false, isVideoOff: false, isBanned: false, isSpeaking: s.isSpeaking ?? false }))
  );
  const [joiners,         setJoiners]          = useState<Participant[]>(propJoiners);
  const [showEndDialog,   setShowEndDialog]    = useState(false);
  const [showKickDialog,  setShowKickDialog]   = useState<string | null>(null);
  const [showMediaDialog, setShowMediaDialog]  = useState(false);
  const [mediaAction,     setMediaAction]      = useState<"mic" | "video">("mic");
  const [mediaError,      setMediaError]       = useState<string | null>(null);
  const [mediaLoading,    setMediaLoading]     = useState(false);
  const [cameraEffect,    setCameraEffect]     = useState(() => {
    const stored = getStoredCustomBackground();
    return stored ? `${VB_CUSTOM_PREFIX}${stored}` : "none";
  });
  const [rawVideoStream,  setRawVideoStream]  = useState<MediaStream | null>(null);
  const [showBackgroundModal, setShowBackgroundModal] = useState(false);
  const [moderatorUnlocks, setModeratorUnlocks] = useState({ qa: false, chat: false, handRaise: false });
  const [liveKitToken,    setLiveKitToken]     = useState<string | null>(null);
  const [liveKitServerUrl, setLiveKitServerUrl] = useState<string | null>(null);
  const [liveKitError,    setLiveKitError]     = useState<string | null>(null);
  const [isJoiningVideoRoom, setIsJoiningVideoRoom] = useState(false);

  // Virtual background (only when camera on + non-LiveKit + vb effect selected)
  const vbActive = !useLiveKit && !myVideoOff && isVirtualBackground(cameraEffect);
  const { outputStream: vbStream } = useVirtualBackground({
    rawStream: vbActive ? rawVideoStream : null,
    effectId: vbActive ? cameraEffect : "none",
  });

  // Derived roles
  const isAuthenticated = !!currentUser;
  const isAdmin         = currentUser?.role === "admin";
  const isSpeaker       = speakers.some(s => s.id === currentUser?.id);
  const isModerator     = currentUser?.id === moderator.id || isAdmin;
  const isParticipant   = userRole === "participant" || isSpeaker || isModerator;
  const isRegisteredViewer = userRole === "registered_viewer" || (isAuthenticated && !isParticipant);
  const isPublic        = userRole === "public" || !isAuthenticated;

  // Permissions: Participants have full access; Registered viewers need moderator unlock
  const canUseQa        = isParticipant || (isRegisteredViewer && moderatorUnlocks.qa);
  const canUseChat      = isParticipant || (isRegisteredViewer && moderatorUnlocks.chat);
  const canUseHandRaise = isParticipant || (isRegisteredViewer && moderatorUnlocks.handRaise);
  const canAddScholar   = isModerator && speakers.length < MAX_SCHOLARS;
  const isLearner       = isAuthenticated && !isSpeaker && !isModerator;
  const currentPhaseName = phases[activePhaseIdx];
  const PhaseIcon       = phaseConfig[currentPhaseName].icon;
  const totalDuration   = phaseConfig[currentPhaseName].duration;
  const phaseProgress   = ((totalDuration - phaseTimeLeft) / totalDuration) * 100;
  const pendingQs       = questions.filter(q => !q.approved);
  const totalVotes      = clarityA + clarityB;
  const pctA            = totalVotes ? Math.round((clarityA / totalVotes) * 100) : 0;
  const pctB            = 100 - pctA;
  const modNotifications = handRaisedUsers.length + pendingQs.length + joiners.length;
  const isRunning = debateStarted && !debatePaused && !debateEnded;
  const statusLabel = debateEnded ? "CONCLUDED" : !debateStarted ? "NOT STARTED" : debatePaused ? "PAUSED" : "LIVE";

  // Dynamic tabs: Q&A when phase is qa or user can participate; Evidence when position/rebuttal phases or has content
  const availableTabs = useMemo((): ("chat" | "evidence")[] => {
    const tabs: ("chat" | "evidence")[] = [];
    const showQa = canUseQa || questions.some(q => q.approved) || isModerator;
    const showEvidence = evidences.length > 0 || currentPhaseName === "positionA" || currentPhaseName === "positionB" || currentPhaseName === "rebuttal";
    if (showQa) tabs.push("chat");
    if (showEvidence || tabs.length === 0) tabs.push("evidence");
    return tabs.length ? tabs : (["chat", "evidence"] as const);
  }, [canUseQa, questions, evidences.length, currentPhaseName, isModerator]);

  // Auto-switch tab when phase changes: Q&A phase -> chat, position/rebuttal -> evidence
  useEffect(() => {
    if (currentPhaseName === "qa" && availableTabs.includes("chat")) setActiveTab("chat");
    else if (["positionA", "positionB", "rebuttal"].includes(currentPhaseName) && availableTabs.includes("evidence")) setActiveTab("evidence");
  }, [currentPhaseName, availableTabs]);

  // Ensure activeTab is valid when availableTabs changes
  useEffect(() => {
    const first = availableTabs[0];
    if (first && !availableTabs.includes(activeTab)) setActiveTab(first);
  }, [availableTabs, activeTab]);
  const statusClass = debateEnded
    ? "bg-muted text-muted-foreground border-border"
    : !debateStarted
    ? "bg-muted text-muted-foreground border-border"
    : debatePaused
    ? "bg-amber-500/20 text-amber-600 border-amber-500/30"
    : "bg-red-500/20 text-red-500 border-red-500/30 animate-pulse";

  // LiveKit token fetch when useLiveKit
  const participantIdForLiveKit = currentUser?.id ?? anonIdRef.current ?? `anon-${Date.now()}`;
  useEffect(() => {
    if (!useLiveKit || !debateId) return;
    (async () => {
      try {
        const res = await fetch("/api/livekit/token", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            roomName: `debate-${debateId}`,
            participantId: participantIdForLiveKit,
            participantName: currentUser?.name ?? "Viewer",
            canPublish: isParticipant,
          }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to get token");
        setLiveKitToken(data.token);
        setLiveKitServerUrl(data.url || process.env.NEXT_PUBLIC_LIVEKIT_URL);
        setLiveKitError(null);
      } catch (err) {
        setLiveKitError(err instanceof Error ? err.message : "Connection failed");
      }
    })();
  }, [useLiveKit, debateId, participantIdForLiveKit, currentUser?.name, isParticipant]);

  // Keep phase idx ref in sync
  useEffect(() => { activePhaseIdxRef.current = activePhaseIdx; }, [activePhaseIdx]);

  // Sync video stream to element when it mounts or when vb/camera changes
  useEffect(() => {
    if (myVideoOff || !localVideoRef.current) return;
    const stream = vbActive && vbStream ? vbStream : videoStreamRef.current;
    if (stream) {
      localVideoRef.current.srcObject = stream;
      localVideoRef.current.play().catch(() => {});
    }
  }, [myVideoOff, vbActive, vbStream]);


  // Phase sync from props
  useEffect(() => {
    setActivePhaseIdx(phases.indexOf(initialPhase as Phase));
    setDebatePaused(!!propsPhasePaused);
  }, [initialPhase, propsPhasePaused]);

  // Questions sync
  useEffect(() => {
    setQuestions(propQuestions);
  }, [propQuestions]);

  // timer sync
  useEffect(() => {
    setEvidences(initialEvidences);
  }, [initialEvidences]);

  useEffect(() => {
    if (props.initialHandRaises) setHandRaisedUsers(props.initialHandRaises);
  }, [props.initialHandRaises]);

  useEffect(() => {
    if (propJoiners) setJoiners(propJoiners);
  }, [propJoiners]);

  // Timer logic - server authoritative
  useEffect(() => {
    if (debateEnded) return;

    const timer = setInterval(() => {
      if (!phaseStartedAt) {
        setPhaseTimeLeft(phaseConfig[initialPhase as Phase]?.duration ?? 0);
        return;
      }

      if (debatePaused) return;

      const startedAt = new Date(phaseStartedAt).getTime();
      const now = Date.now();
      const totalDuration = phaseConfig[initialPhase as Phase]?.duration ?? 0;
      
      // A6 Fix: Include phaseElapsedTime from props (seconds already spent before this session/pause)
      const sessionElapsed = Math.floor((now - startedAt) / 1000);
      const totalElapsed = (props.phaseElapsedTime || 0) + sessionElapsed;
      const remaining = Math.max(0, totalDuration - totalElapsed);
      
      setPhaseTimeLeft(remaining);
    }, 1000);

    return () => clearInterval(timer);
  }, [initialPhase, phaseStartedAt, debatePaused, debateEnded, props.phaseElapsedTime]);

  const [chatMessages, setChatMessages] = useState<any[]>([]);

  const handleSendMessage = async (text: string) => {
    if (!debateId || !text.trim() || !canUseChat) return;
    const { error } = await debateApi.sendMessage(debateId, text.trim());
    if (error) toast.error(error);
  };

  // ---------------------------------------------------------
  // Debate Actions (API)
  // ---------------------------------------------------------

  // Debate Actions (API)
  const handleToggleDebate = async () => {
    if (!debateId || !isModerator) return;
    const action = debatePaused ? "resume" : "pause";
    const { error } = await debateApi.updatePhase(debateId, currentPhaseName, action);
    if (error) toast.error(error);
  };

  const handleAdvancePhase = async () => {
    if (!debateId || !isModerator || activePhaseIdx >= phases.length - 1) return;
    const nextPhase = phases[activePhaseIdx + 1];
    const { error } = await debateApi.updatePhase(debateId, nextPhase as any, "start");
    if (error) toast.error(error);
  };

  const handleSubmitQuestion = async () => {
    if (!debateId || !question.trim() || !canUseQa) return;
    const text = question.trim();
    setQuestion("");
    const { error } = await debateApi.submitQuestion(debateId, text);
    if (error) {
      toast.error(error);
      setQuestion(text);
    } else {
      toast.success("Question submitted for moderation");
    }
  };

  const handleUpvote = async (qId: string) => {
    if (!debateId || !isAuthenticated) return;
    const { error } = await debateApi.upvoteQuestion(debateId, qId);
    if (error) toast.error(error);
  };

  const handleApproveQuestion = async (qId: string) => {
    if (!debateId || !isModerator) return;
    const { error } = await debateApi.approveQuestion(debateId, qId, true);
    if (error) toast.error(error);
    else toast.success("Question approved");
  };

  const handleAnswerQuestion = async (qId: string, answerText: string) => {
    if (!debateId || !isParticipant) return;
    if (!answerText) return;
    const { error } = await debateApi.answerQuestion(debateId, qId, answerText);
    if (error) toast.error(error);
    else toast.success("Answered");
  };

  const handleEndDebate = async () => {
    if (!debateId || !isModerator) return;
    const { error } = await debateApi.setConcluded(debateId);
    if (error) toast.error(error);
    else {
      setDebateEnded(true);
      setShowEndDialog(false);
      toast.success("Debate concluded");
    }
  };

  const handleJoinRequests = async (uId: string, action: 'admit' | 'deny') => {
    if (!debateId || !isModerator) return;
    const { error } = action === 'admit' 
      ? await debateApi.admitJoiner(debateId, uId)
      : await debateApi.denyJoiner(debateId, uId);
    
    if (error) toast.error(error);
    else toast.success(action === 'admit' ? "User admitted" : "Request denied");
  };

  const handleHandRaiseAction = async (uId?: string) => {
    if (!debateId) return;
    if (uId && isModerator) {
      // Moderator dismissing a user's hand
      const { error } = await debateApi.dismissHandRaise(debateId, uId);
      if (error) toast.error(error);
    } else {
      // User raising/lowering their own hand
      if (handRaised) {
        const { error } = await debateApi.dismissHandRaise(debateId, currentUser?.id || "");
        if (!error) setHandRaised(false);
      } else {
        const { error } = await debateApi.raiseHand(debateId);
        if (!error) setHandRaised(true);
      }
    }
  };

  const handleRequestToJoin = async () => {
    if (!debateId || !isAuthenticated) return;
    const { error } = await debateApi.requestToJoin(debateId);
    if (error) toast.error(error);
    else toast.success("Join request sent to moderator");
  };

  // Viewer simulation
  useEffect(() => {
    const i = setInterval(() => setViewers(v => Math.max(1, v + Math.floor(Math.random() * 5) - 2)), 4000);
    return () => clearInterval(i);
  }, []);

  // Speaking detection
  useEffect(() => {
    setIAmSpeaking(!myMuted && audioLevel > 15);
  }, [audioLevel, myMuted]);

  // Cleanup media on unmount
  useEffect(() => {
    return () => {
      audioStreamRef.current?.getTracks().forEach(t => t.stop());
      videoStreamRef.current?.getTracks().forEach(t => t.stop());
      audioContextRef.current?.close().catch(() => {});
      cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  // Microphone handling
  const startMic = useCallback(async () => {
    setMediaLoading(true);
    setMediaError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
      audioStreamRef.current = stream;

      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioCtx();
      audioContextRef.current = ctx;
      if (ctx.state === "suspended") await ctx.resume();

      const analyser = ctx.createAnalyser();
      analyser.fftSize = 256;
      analyser.smoothingTimeConstant = 0;
      analyser.minDecibels = -90;
      analyser.maxDecibels = -10;
      analyserRef.current = analyser;

      const gainNode = ctx.createGain();
      gainNode.gain.value = 2;
      const source = ctx.createMediaStreamSource(stream);
      source.connect(gainNode);
      gainNode.connect(analyser);

      const pcmData = new Float32Array(analyser.fftSize);
      const loop = () => {
        analyser.getFloatTimeDomainData(pcmData);
        let sumSquares = 0;
        for (let i = 0; i < pcmData.length; i++) {
          sumSquares += pcmData[i] * pcmData[i];
        }
        const rms = Math.sqrt(sumSquares / pcmData.length);
        const level = Math.min(255, Math.round(rms * 450));
        setAudioLevel(level);
        animFrameRef.current = requestAnimationFrame(loop);
      };
      loop();

      setMyMuted(false);
      setShowMediaDialog(false);
      toast.success("🎙️ Microphone enabled");
    } catch (err: any) {
      const msg =
        err?.name === "NotAllowedError"   ? "Microphone access denied. Please allow access in your browser settings and try again." :
        err?.name === "NotFoundError"     ? "No microphone found on this device." :
        err?.name === "NotReadableError"  ? "Microphone is already in use by another app." :
                                            "Could not access microphone. Check your permissions.";
      setMediaError(msg);
      toast.error(msg);
    } finally {
      setMediaLoading(false);
    }
  }, []);

  const stopMic = useCallback(() => {
    audioStreamRef.current?.getTracks().forEach(t => t.stop());
    audioStreamRef.current = null;
    audioContextRef.current?.close().catch(() => {});
    audioContextRef.current = null;
    cancelAnimationFrame(animFrameRef.current);
    setAudioLevel(0);
    setMyMuted(true);
    toast("🔇 Microphone muted");
  }, []);

  // Camera handling
  const startCamera = useCallback(async () => {
    setMediaLoading(true);
    setMediaError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { width: 640, height: 480 }, audio: false });
      videoStreamRef.current = stream;
      setRawVideoStream(stream);

      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
        await localVideoRef.current.play().catch(() => {});
      }

      setMyVideoOff(false);
      setShowMediaDialog(false);
      toast.success("📹 Camera enabled");
    } catch (err: any) {
      const msg =
        err?.name === "NotAllowedError"   ? "Camera access denied. Please allow access in your browser settings and try again." :
        err?.name === "NotFoundError"     ? "No camera found on this device." :
        err?.name === "NotReadableError"  ? "Camera is already in use by another app." :
                                            "Could not access camera. Check your permissions.";
      setMediaError(msg);
      toast.error(msg);
    } finally {
      setMediaLoading(false);
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (localVideoRef.current) {
      localVideoRef.current.pause();
      localVideoRef.current.srcObject = null;
    }
    videoStreamRef.current?.getTracks().forEach(t => t.stop());
    videoStreamRef.current = null;
    setRawVideoStream(null);
    setMyVideoOff(true);
    toast("📷 Camera turned off");
  }, []);

  // Media toggle handlers
  const handleToggleMic = () => {
    if (!isAuthenticated) { router.push("/login"); return; }
    if (myMuted) { setMediaAction("mic"); setMediaError(null); setShowMediaDialog(true); }
    else stopMic();
  };

  const handleToggleVideo = () => {
    if (!isAuthenticated) { router.push("/login"); return; }
    if (myVideoOff) { setMediaAction("video"); setMediaError(null); setShowMediaDialog(true); }
    else stopCamera();
  };

  const handleConfirmMedia = () => {
    if (mediaAction === "mic") startMic();
    else startCamera();
  };

  // Hand Raise
  const handleRaiseHand = () => {
    if (!canUseHandRaise || !currentUser) return;
    const next = !handRaised;
    setHandRaised(next);
    if (next && currentUser) {
      setHandRaisedUsers(prev => [
        ...prev.filter(u => u.userId !== currentUser.id),
        { userId: currentUser.id, name: currentUser.name, timestamp: Date.now() },
      ]);
      toast.success("✋ Hand raised — moderator notified");
    } else if (currentUser) {
      setHandRaisedUsers(prev => prev.filter(u => u.userId !== currentUser.id));
      toast("Hand lowered");
    }
  };

  // Q&A Handlers are now handled by API-based ones at the top

  // Clarity Vote
  const handleVote = async (side: "A" | "B") => {
    if (!isAuthenticated) { router.push("/login"); return; }
    if (myVote || !debateId) return;
    const { data, error } = await debateApi.voteClarity(debateId, side);
    if (error) {
      toast.error(error);
    } else if (data) {
      setMyVote(side);
      setClarityA(data.positionA);
      setClarityB(data.positionB);
      onVoteClarity?.(side);
      toast.success(`✅ Voted Position ${side}`);
    }
  };

  // Sync external clarity votes when provided
  useEffect(() => {
    if (externalClarityVotes) {
      setClarityA(externalClarityVotes.positionA);
      setClarityB(externalClarityVotes.positionB);
      setMyVote(externalClarityVotes.myVote ?? null);
    }
  }, [externalClarityVotes?.positionA, externalClarityVotes?.positionB, externalClarityVotes?.myVote]);

  // Moderator: Speaker Controls
  const handleToggleSpeakerMic = (id: string) => {
    const sp = speakers.find(s => s.id === id);
    if (!sp) return;
    const willMute = !sp.isMuted;
    setSpeakers(prev => prev.map(s =>
      s.id === id ? { ...s, isMuted: willMute, isSpeaking: willMute ? false : s.isSpeaking } : s
    ));
    toast(willMute ? `🔇 ${sp.name} muted` : `🎙️ ${sp.name} unmuted`);
  };

  const handleToggleSpeakerVideo = (id: string) => {
    const sp = speakers.find(s => s.id === id);
    if (!sp) return;
    const willDisable = !sp.isVideoOff;
    setSpeakers(prev => prev.map(s => s.id === id ? { ...s, isVideoOff: willDisable } : s));
    toast(willDisable ? `📷 ${sp.name}'s camera disabled` : `📹 ${sp.name}'s camera enabled`);
  };

  const handleKickSpeaker = (id: string) => {
    const sp = speakers.find(s => s.id === id);
    setSpeakers(prev => prev.filter(s => s.id !== id));
    setShowKickDialog(null);
    toast.success(`${sp?.name ?? "Participant"} removed`);
  };

  // Moderator Notifications/Actions - These will be hooked into real-time later
  // Consolidated handlers at the top

  // Rest of handlers are now consolidated at the top

  const handleLiveKitLeave = () => {
    onLeave?.();
    router.push("/debates");
  };

  if (isJoiningVideoRoom) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[600px] w-full bg-background mt-20 relative overflow-hidden rounded-xl border border-border/50 shadow-2xl">
        <div className="absolute inset-0 bg-primary/5 animate-pulse" />
        <div className="relative z-10 flex flex-col items-center max-w-sm text-center">
            <div className="w-20 h-20 mb-8 relative">
                <div className="absolute inset-0 rounded-full border-4 border-primary/20" />
                <div className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent animate-spin" />
            </div>
            <h2 className="text-2xl font-bold font-display text-foreground mb-3">Admission in Progress</h2>
            <p className="text-muted-foreground leading-relaxed">
                The moderator has approved your join request. Connecting you to the secure video room...
            </p>
        </div>
      </div>
    );
  }

  const mainContent = (
    <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in duration-700">
      
      {/* Media Permission Dialog */}
      <Dialog open={showMediaDialog} onOpenChange={open => { if (!open) { setMediaError(null); setShowMediaDialog(false); } }}>
        <DialogContent className="sm:max-w-md bg-zinc-950 border-white/10 shadow-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-white">
              {mediaAction === "mic" ? <Mic className="h-5 w-5 text-primary" /> : <Video className="h-5 w-5 text-primary" />}
              Enable {mediaAction === "mic" ? "Microphone" : "Camera"}
            </DialogTitle>
            <DialogDescription className="text-zinc-400">
              {mediaAction === "mic"
                ? "Your browser will request microphone permission. The moderator can mute you at any time."
                : "Your browser will request camera permission. The moderator can disable it at any time."}
            </DialogDescription>
          </DialogHeader>
          {mediaError && (
            <div className="flex items-start gap-2 p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-sm text-destructive">
              <AlertTriangle className="h-4 w-4 mt-0.5 flex-shrink-0" />
              <span>{mediaError}</span>
            </div>
          )}
          <DialogFooter className="gap-2 sm:gap-0 mt-4">
            <Button variant="outline" onClick={() => { setShowMediaDialog(false); setMediaError(null); }} className="border-white/10 hover:bg-white/5">Cancel</Button>
            <Button onClick={handleConfirmMedia} disabled={mediaLoading} className="bg-primary hover:bg-primary/90">
              {mediaLoading
                ? <span className="flex items-center gap-2"><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Requesting…</span>
                : `Enable ${mediaAction === "mic" ? "Microphone" : "Camera"}`}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* End Debate Dialog */}
      <Dialog open={showEndDialog} onOpenChange={setShowEndDialog}>
        <DialogContent className="sm:max-w-md bg-zinc-950 border-white/10 shadow-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive"><Square className="h-5 w-5" /> End Debate</DialogTitle>
            <DialogDescription className="text-zinc-400">End the session for all {speakers.length + 1} participants? This cannot be undone.</DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0 mt-4">
            <Button variant="outline" onClick={() => setShowEndDialog(false)} className="border-white/10 hover:bg-white/5">Cancel</Button>
            <Button variant="destructive" onClick={handleEndDebate}>End Debate</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Kick Dialog */}
      <Dialog open={!!showKickDialog} onOpenChange={() => setShowKickDialog(null)}>
        <DialogContent className="sm:max-w-md bg-zinc-950 border-white/10 shadow-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive"><UserX className="h-5 w-5" /> Remove Participant</DialogTitle>
            <DialogDescription className="text-zinc-400">Remove {speakers.find(s => s.id === showKickDialog)?.name}? They cannot rejoin.</DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0 mt-4">
            <Button variant="outline" onClick={() => setShowKickDialog(null)} className="border-white/10 hover:bg-white/5">Cancel</Button>
            <Button variant="destructive" onClick={() => showKickDialog && handleKickSpeaker(showKickDialog)}>Remove</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Header Section */}
      <LiveDebateHeader 
        title={title}
        topic={topic}
        viewers={viewers}
        statusLabel={statusLabel}
        statusClass={statusClass}
      />

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Video Stage + Controls (lg:col-span-8) */}
        <div className="lg:col-span-8 space-y-6">
          <VideoStage 
            useLiveKit={useLiveKit && !!debateId}
            liveKitToken={liveKitToken}
            liveKitServerUrl={liveKitServerUrl}
            liveKitError={liveKitError}
            debateId={debateId}
            youtubeLiveUrl={youtubeLiveUrl}
            isParticipant={isParticipant}
            myMuted={myMuted}
            myVideoOff={myVideoOff}
            cameraEffect={cameraEffect}
            onLiveKitLeave={handleLiveKitLeave}
            extractYoutubeVideoId={extractYoutubeVideoId}
            participantIds={[moderator.id, ...speakers.map(s => s.id)]}
          />
          
          <PhaseTimer
            phases={phases}
            phaseConfig={phaseConfig}
            currentPhaseName={currentPhaseName}
            activePhaseIdx={activePhaseIdx}
            isRunning={isRunning}
            debatePaused={debatePaused}
            phaseTimeLeft={phaseTimeLeft}
            phaseProgress={phaseProgress}
            formatTime={formatTime}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ChatSection 
              messages={chatMessages}
              currentUserId={currentUser?.id}
              canUseChat={moderatorUnlocks.chat || isParticipant}
              onSendMessage={handleSendMessage}
            />
            <QaSection 
              questions={questions}
              canUseQa={moderatorUnlocks.qa || isParticipant}
              isParticipant={isParticipant}
              onUpvote={handleUpvote}
              onSubmitQuestion={handleSubmitQuestion}
              onAnswerQuestion={handleAnswerQuestion}
            />
          </div>
          
          {/* Debate Adab Section */}
          <Card className="bg-primary/5 border-primary/20 backdrop-blur-md">
            <CardHeader className="py-2.5 pb-2">
              <CardTitle className="text-[10px] font-black uppercase tracking-widest text-primary flex items-center gap-2">
                <Scale className="h-3.5 w-3.5" /> 
                Debate Etiquette (Adab)
              </CardTitle>
            </CardHeader>
            <CardContent className="pb-4">
              <div className="grid sm:grid-cols-2 gap-x-6 gap-y-3 text-[11px] text-muted-foreground font-medium">
                {[
                  { icon: CheckCircle,   text: "Arguments must be evidence-based", color: "text-primary" },
                  { icon: AlertTriangle, text: "Personal attacks are strictly prohibited",  color: "text-red-400" },
                  { icon: Scale,         text: "Vote on clarity of argument, not who 'won'",   color: "text-secondary" },
                  { icon: BookOpen,      text: "All citations must be verifiable", color: "text-primary" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2.5 group hover:text-white transition-colors duration-300">
                    <item.icon className={cn("h-3.5 w-3.5 flex-shrink-0 transition-transform group-hover:scale-110", item.color)} />
                    <span>{item.text}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Sidebar (lg:col-span-4) */}
        <aside className="lg:col-span-4 h-full sticky top-6">
          <SidebarControl 
            speakers={speakers.map(s => ({ ...s, role: "scholar" as const }))}
            moderator={{ ...moderator, role: "moderator" as const }}
            joiners={joiners.map(j => ({ ...j, role: "scholar" as const }))}
            handRaisedUsers={handRaisedUsers}
            isModerator={isModerator}
            clarityA={clarityA}
            clarityB={clarityB}
            myVote={myVote}
            onAdmit={(uid) => handleJoinRequests(uid, 'admit')}
            onDeny={(uid) => handleJoinRequests(uid, 'deny')}
            onDismissHand={(uid) => handleHandRaiseAction(uid)}
            onVote={handleVote}
          />
        </aside>
      </div>

      {/* Floating Preview for non-speakers */}
      {isAuthenticated && !myVideoOff && !isSpeaker && currentUser?.id !== moderator.id && (
        <div className="fixed bottom-24 right-6 z-50 rounded-2xl overflow-hidden border-2 border-primary/50 shadow-2xl bg-black transition-all hover:scale-105 duration-300">
          <div className="flex items-center justify-between px-3 py-1.5 bg-zinc-950 border-b border-white/5">
            <p className="text-[10px] font-black uppercase tracking-widest text-primary">Your Preview</p>
            <Button size="icon" variant="ghost" className="h-6 w-6 text-primary hover:bg-primary/20" onClick={() => setShowBackgroundModal(true)}>
              <Sparkles className="h-3 w-3" />
            </Button>
          </div>
          <div className="w-56 h-40 bg-zinc-900">
            <video
              ref={localVideoRef}
              autoPlay
              muted
              playsInline
              className="w-full h-full object-cover"
              style={{
                transform: "scaleX(-1)",
                filter: vbActive ? "" : (cameraEffects.find(e => e.id === cameraEffect)?.filter ?? ""),
              }}
              onLoadedData={(e) => e.currentTarget.play().catch(() => {})}
            />
          </div>
        </div>
      )}
    </div>
  );

  return (
    <TooltipProvider>
    <div className="min-h-screen bg-background p-3 md:p-4">
      {useLiveKit && debateId && liveKitError ? (
        <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-6 text-center">
          <p className="text-sm text-destructive">{liveKitError}</p>
          <Button variant="outline" size="sm" className="mt-4" onClick={handleLiveKitLeave}>
            Back to Debates
          </Button>
        </div>
      ) : useLiveKit && debateId && !liveKitToken && !liveKitError ? (
        <div className="flex flex-col items-center justify-center gap-4 py-24">
          <div className="w-10 h-10 rounded-full border-2 border-primary/30 border-t-primary animate-spin" />
          <p className="text-sm text-muted-foreground">Connecting to live room…</p>
        </div>
      ) : useLiveKit && debateId && liveKitToken && liveKitServerUrl ? (
        <LiveKitRoom
          token={liveKitToken ?? undefined}
          serverUrl={liveKitServerUrl ?? undefined}
          connect={true}
          audio={isParticipant}
          video={isParticipant}
          onDisconnected={handleLiveKitLeave}
          data-lk-theme="default"
          style={{ minHeight: 0, display: "block", backgroundColor: "transparent" }}
        >
          {isParticipant && <LiveKitEffectHandler effectId={cameraEffect} />}
          {mainContent}
        </LiveKitRoom>
      ) : (
        mainContent
      )}

      {/* Background effects modal - Zoom/Meet style */}
      <BackgroundEffectsModal
        open={showBackgroundModal}
        onOpenChange={setShowBackgroundModal}
        selectedEffectId={cameraEffect}
        onSelectEffect={setCameraEffect}
      />
    </div>
    </TooltipProvider>
  );
};