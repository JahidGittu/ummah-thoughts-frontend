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
} from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { AuthUser } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";
import { LiveKitRoom } from "@livekit/components-react";
import "@livekit/components-styles";
import { DebateVideoConference } from "@/components/debates/DebateVideoConference";
import { LiveKitEffectHandler } from "@/components/debates/LiveKitEffectHandler";
import { SidePanelMediaControls } from "@/components/debates/SidePanelMediaControls";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useVirtualBackground, isVirtualBackground, ISLAMIC_BACKGROUNDS, VB_CUSTOM_PREFIX } from "@/hooks/useVirtualBackground";
import { getStoredCustomBackground } from "@/lib/customBackgroundStorage";
import { BackgroundEffectsModal } from "@/components/debates/BackgroundEffectsModal";

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
  const activePhaseIdxRef = useRef<number>(phases.indexOf(initialPhase));
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
  const [activePhaseIdx,  setActivePhaseIdx]   = useState(phases.indexOf(initialPhase as Phase));
  const [phaseTimeLeft,   setPhaseTimeLeft]    = useState(phaseConfig[initialPhase as Phase]?.duration ?? 0);
  const [viewers,         setViewers]          = useState(initialViewers);
  const [activeTab,       setActiveTab]        = useState<"chat" | "evidence">("chat");
  const [evidenceFilter,  setEvidenceFilter]   = useState<"all" | "A" | "B">("all");
  const [clarityA,        setClarityA]         = useState(externalClarityVotes?.positionA ?? 0);
  const [clarityB,        setClarityB]         = useState(externalClarityVotes?.positionB ?? 0);
  const [myVote,          setMyVote]           = useState<"A" | "B" | null>(externalClarityVotes?.myVote ?? null);
  const [questions,       setQuestions]        = useState<QueuedQuestion[]>(propQuestions);
  const [evidences,       setEvidences]        = useState<Evidence[]>(initialEvidences);
  const [handRaisedUsers, setHandRaisedUsers]  = useState<HandRaisedUser[]>([]);
  const [debateStarted,   setDebateStarted]    = useState(initialPhase !== "opening" || !!initialJoiners.length);
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

  // Timer logic - server authoritative
  useEffect(() => {
    if (debateEnded) return;

    const timer = setInterval(() => {
      if (!phaseStartedAt) {
        setPhaseTimeLeft(phaseConfig[initialPhase as Phase]?.duration ?? 0);
        return;
      }

      const startedAt = new Date(phaseStartedAt).getTime();
      const now = Date.now();
      const totalDuration = phaseConfig[initialPhase as Phase]?.duration ?? 0;
      
      let elapsedSeconds = Math.floor((now - startedAt) / 1000);
      const remaining = Math.max(0, totalDuration - elapsedSeconds);
      setPhaseTimeLeft(remaining);
    }, 1000);

    return () => clearInterval(timer);
  }, [initialPhase, phaseStartedAt, propsPhasePaused, debateEnded]);

  // ---------------------------------------------------------
  // Debate Actions (API)
  // ---------------------------------------------------------

  const handleToggleDebate = async () => {
    if (!debateId || !isModerator) return;
    const newPaused = !debatePaused;
    const { error } = await debateApi.updatePhase(debateId, {
      phase: initialPhase,
      paused: newPaused
    });
    if (error) toast.error(error);
  };

  const handleAdvancePhase = async () => {
    if (!debateId || !isModerator || activePhaseIdx >= phases.length - 1) return;
    const nextPhase = phases[activePhaseIdx + 1];
    const { error } = await debateApi.updatePhase(debateId, {
      phase: nextPhase,
      paused: false
    });
    if (error) toast.error(error);
  };

  const handleSubmitQuestion = async () => {
    if (!debateId || !question.trim() || !canUseQa) return;
    const text = question.trim();
    setQuestion("");
    const { data, error } = await debateApi.submitQuestion(debateId, text);
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
    const { error } = await debateApi.approveQuestion(debateId, qId);
    if (error) toast.error(error);
    else toast.success("Question approved");
  };

  const handleAnswerQuestion = async (qId: string) => {
    if (!debateId || !isParticipant) return;
    const { error } = await debateApi.answerQuestion(debateId, qId);
    if (error) toast.error(error);
    else toast.success("Question marked as answering");
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

  // Q&A
  const handleSubmitQuestion = () => {
    if (!isAuthenticated) { router.push("/login"); return; }
    if (!canUseQa) return;
    if (!question.trim()) return;
    setQuestions(prev => [...prev, {
      id: `q${Date.now()}`,
      userId: currentUser?.id,
      user: currentUser?.name || "You",
      text: question.trim(),
      upvotes: 0,
      upvotedByMe: false,
      approved: false,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    }]);
    setQuestion("");
    toast.success("Question submitted for review");
  };

  const handleUpvote = (qId: string) => {
    if (!isAuthenticated) { router.push("/login"); return; }
    setQuestions(prev => prev.map(q =>
      q.id === qId ? { ...q, upvotes: q.upvotedByMe ? q.upvotes - 1 : q.upvotes + 1, upvotedByMe: !q.upvotedByMe } : q
    ));
  };

  // Clarity Vote
  const handleVote = (side: "A" | "B") => {
    if (!isAuthenticated) { router.push("/login"); return; }
    if (myVote) return;
    setMyVote(side);
    if (side === "A") setClarityA(v => v + 1); else setClarityB(v => v + 1);
    onVoteClarity?.(side);
    toast.success(`✅ Voted Position ${side}`);
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

  // Moderator: Join Requests
  const handleAdmitJoiner = (id: string) => {
    const j = joiners.find(x => x.id === id);
    if (!j) return;
    setSpeakers(prev => [...prev, { ...j, isSpeaking: false, isMuted: true, isVideoOff: true, isBanned: false }]);
    setJoiners(prev => prev.filter(x => x.id !== id));
    toast.success(`✅ ${j.name} admitted`);
  };

  const handleDenyJoiner = (id: string) => {
    const j = joiners.find(x => x.id === id);
    setJoiners(prev => prev.filter(x => x.id !== id));
    toast(`❌ ${j?.name ?? "Request"} denied`);
  };

  // Moderator: Q&A
  const handleApproveQuestion = (qId: string) => {
    setQuestions(prev => prev.map(q => q.id === qId ? { ...q, approved: true } : q));
    toast.success("✅ Question approved");
  };

  const handleRejectQuestion = (qId: string) => {
    setQuestions(prev => prev.filter(q => q.id !== qId));
    toast("❌ Question removed");
  };

  // Moderator: Hand Raise
  const handleAdmitFromHandRaise = (userId: string) => {
    const raised = handRaisedUsers.find(u => u.userId === userId);
    if (!raised) return;
    setSpeakers(prev => [...prev, {
      id: raised.userId,
      name: raised.name,
      role: "member" as const,
      isSpeaking: false,
      isMuted: true,
      isVideoOff: true,
      isBanned: false,
    }]);
    setHandRaisedUsers(prev => prev.filter(u => u.userId !== userId));
    if (userId === currentUser?.id) setHandRaised(false);
    toast.success(`✅ ${raised.name} admitted as speaker`);
  };

  const handleDismissHandRaise = (userId: string) => {
    const raised = handRaisedUsers.find(u => u.userId === userId);
    setHandRaisedUsers(prev => prev.filter(u => u.userId !== userId));
    if (userId === currentUser?.id) setHandRaised(false);
    toast(`${raised?.name ?? "User"}'s hand raise dismissed`);
  };

  // Moderator: Debate Flow
  const handleToggleDebate = () => {
    if (!debateStarted) { setDebateStarted(true); setDebatePaused(false); toast.success("▶ Debate started"); }
    else if (!debatePaused) { setDebatePaused(true); toast("⏸ Debate paused"); }
    else { setDebatePaused(false); toast.success("▶ Debate resumed"); }
  };

  const handleEndDebate = () => {
    setDebateStarted(false);
    setDebatePaused(false);
    setDebateEnded(true);
    setShowEndDialog(false);
    toast.success("🏁 Debate ended");
    setTimeout(() => onLeave?.(), 300);
  };

  const handleAdvancePhase = () => {
    const cur = activePhaseIdxRef.current;
    if (cur < phases.length - 1) {
      const next = cur + 1;
      setActivePhaseIdx(next);
      setPhaseTimeLeft(phaseConfig[phases[next]].duration);
      toast.success(`⏭ Advanced to: ${phaseConfig[phases[next]].label}`);
    } else {
      toast("Already at final phase");
    }
  };

  const handleLiveKitLeave = () => {
    onLeave?.();
    router.push("/debates");
  };

  const mainContent = (
      <div className="max-w-7xl mx-auto space-y-4">

        {/* Media Permission Dialog */}
        <Dialog open={showMediaDialog} onOpenChange={open => { if (!open) { setMediaError(null); setShowMediaDialog(false); } }}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                {mediaAction === "mic" ? <Mic className="h-5 w-5 text-primary" /> : <Video className="h-5 w-5 text-primary" />}
                Enable {mediaAction === "mic" ? "Microphone" : "Camera"}
              </DialogTitle>
              <DialogDescription>
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
            <DialogFooter className="gap-2 sm:gap-0">
              <Button variant="outline" onClick={() => { setShowMediaDialog(false); setMediaError(null); }}>Cancel</Button>
              <Button onClick={handleConfirmMedia} disabled={mediaLoading}>
                {mediaLoading
                  ? <span className="flex items-center gap-2"><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Requesting…</span>
                  : `Enable ${mediaAction === "mic" ? "Microphone" : "Camera"}`}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* End Debate Dialog */}
        <Dialog open={showEndDialog} onOpenChange={setShowEndDialog}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-destructive"><Square className="h-5 w-5" /> End Debate</DialogTitle>
              <DialogDescription>End the session for all {speakers.length + 1} participants? This cannot be undone.</DialogDescription>
            </DialogHeader>
            <DialogFooter className="gap-2 sm:gap-0">
              <Button variant="outline" onClick={() => setShowEndDialog(false)}>Cancel</Button>
              <Button variant="destructive" onClick={handleEndDebate}>End Debate</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Kick Dialog */}
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
              <Badge className={cn("gap-1 border", statusClass)}>
                {isRunning && <span className="w-1.5 h-1.5 rounded-full bg-red-500 inline-block" />}
                {statusLabel}
              </Badge>
              <Badge variant="outline" className="gap-1">
                <Clock className="h-3 w-3" />
                {isRunning || debatePaused ? formatTime(phaseTimeLeft) : "--:--"}
              </Badge>
              <Badge variant="outline" className="gap-1"><Users className="h-3 w-3" /> {viewers}</Badge>
              {isModerator && <Badge className="bg-amber-500/20 text-amber-600 border border-amber-500/30 gap-1"><Shield className="h-3 w-3" /> Admin Moderator</Badge>}
            </div>
            <h1 className="text-lg font-bold text-foreground">{title}</h1>
            <p className="text-xs text-muted-foreground flex items-center gap-1"><BookOpen className="h-3 w-3" /> {topic}</p>
          </div>
          <div className="flex gap-2 items-center">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="destructive" size="sm" onClick={onLeave}>Leave</Button>
              </TooltipTrigger>
              <TooltipContent>Leave debate room</TooltipContent>
            </Tooltip>
          </div>
        </div>

        {/* Layout: main content + side panel */}
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Side panel: moderator + phase - sticky on right, edge of viewport */}
          <aside className="w-full lg:w-72 shrink-0 order-1 lg:order-2 lg:border-l lg:border-border lg:pl-4">
            <div className="lg:sticky lg:top-4 space-y-4">
        {isModerator && (
          <Card className="border-amber-500/30 bg-amber-500/5">
            <CardHeader className="py-2.5 pb-1">
              <CardTitle className="text-xs flex items-center gap-2"><Shield className="h-3.5 w-3.5 text-amber-600" /> Controls</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 pb-3">
              {/* Moderator's own mic/camera */}
              {currentUser?.id === moderator.id && (
                <>
                  <div className="space-y-2">
                    <span className="text-[10px] font-semibold text-amber-700 uppercase">My Media</span>
                    <SidePanelMediaControls myMuted={myMuted} myVideoOff={myVideoOff} onToggleMic={handleToggleMic} onToggleVideo={handleToggleVideo} />
                  </div>
                  <Separator />
                </>
              )}
              <div className="space-y-2">
                <span className="text-[10px] font-semibold text-amber-700 uppercase">Participants</span>
              {[moderator, ...speakers].map((p) => (
                <div key={p.id} className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-background border border-border">
                  <div className={cn("w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0", p.id === moderator.id ? "bg-amber-500/20 text-amber-600" : "bg-primary/20 text-primary")}>
                    {p.name.charAt(0)}
                  </div>
                  <span className="text-xs font-medium max-w-[80px] truncate">{p.name}</span>
                  {speakers.some(s => s.id === p.id) && (
                    <div className="flex gap-0.5">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => handleToggleSpeakerMic(p.id)}>
                            {speakers.find(s => s.id === p.id)?.isMuted ? <MicOff className="h-3 w-3 text-destructive" /> : <Mic className="h-3 w-3" />}
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>{speakers.find(s => s.id === p.id)?.isMuted ? "Unmute" : "Mute"}</TooltipContent>
                      </Tooltip>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => handleToggleSpeakerVideo(p.id)}>
                            {speakers.find(s => s.id === p.id)?.isVideoOff ? <VideoOff className="h-3 w-3 text-destructive" /> : <Video className="h-3 w-3" />}
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>{speakers.find(s => s.id === p.id)?.isVideoOff ? "Enable camera" : "Disable camera"}</TooltipContent>
                      </Tooltip>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button size="icon" variant="ghost" className="h-6 w-6 text-destructive hover:bg-destructive/10" onClick={() => setShowKickDialog(p.id)}>
                            <UserX className="h-3 w-3" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Remove participant</TooltipContent>
                      </Tooltip>
                    </div>
                  )}
                </div>
              ))}
                </div>
              <Separator />
              <div className="space-y-2">
                <span className="text-[10px] font-semibold text-amber-700 uppercase">Viewers</span>
                <div className="flex flex-wrap gap-1.5">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button size="sm" variant={moderatorUnlocks.qa ? "default" : "outline"} className="h-7 text-[10px]" onClick={() => setModeratorUnlocks(u => ({ ...u, qa: !u.qa }))}>
                        Q&A {moderatorUnlocks.qa ? "✓" : ""}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Allow viewers to ask questions</TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button size="sm" variant={moderatorUnlocks.chat ? "default" : "outline"} className="h-7 text-[10px]" onClick={() => setModeratorUnlocks(u => ({ ...u, chat: !u.chat }))}>
                        Chat {moderatorUnlocks.chat ? "✓" : ""}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Allow viewers to chat</TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button size="sm" variant={moderatorUnlocks.handRaise ? "default" : "outline"} className="h-7 text-[10px]" onClick={() => setModeratorUnlocks(u => ({ ...u, handRaise: !u.handRaise }))}>
                        Hand {moderatorUnlocks.handRaise ? "✓" : ""}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Allow viewers to raise hand</TooltipContent>
                  </Tooltip>
                </div>
              </div>
              <Separator />
              <div className="space-y-2">
                <span className="text-[10px] font-semibold text-amber-700 uppercase">Debate</span>
                <div className="flex flex-wrap gap-1.5">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button size="sm" variant={debatePaused ? "default" : "outline"} onClick={handleToggleDebate} className="h-7 text-[10px] gap-1">
                        {!debateStarted || debateEnded ? <Play className="h-3 w-3" /> : debatePaused ? <Play className="h-3 w-3" /> : <Square className="h-3 w-3" />}
                        {!debateStarted || debateEnded ? "Start" : debatePaused ? "Resume" : "Pause"}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>{!debateStarted || debateEnded ? "Start debate" : debatePaused ? "Resume" : "Pause debate"}</TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button size="sm" variant="outline" className="h-7 text-[10px]" onClick={handleAdvancePhase} disabled={activePhaseIdx >= phases.length - 1 || debateEnded}>
                        Next
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Advance to next phase</TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button size="sm" variant="destructive" className="h-7 text-[10px]" onClick={() => setShowEndDialog(true)} disabled={debateEnded || !debateStarted}>
                        End
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>End debate for all</TooltipContent>
                  </Tooltip>
                </div>
              </div>
              {/* YouTube Live - moderator can stream */}
              <Separator />
              <div className="space-y-2">
                <span className="text-[10px] font-semibold text-amber-700 uppercase flex items-center gap-1">
                  <Radio className="h-3 w-3" /> YouTube Live
                </span>
                <p className="text-[10px] text-muted-foreground">
                  Open the stream view in a new tab for OBS Browser Source. No scroll, full quality.
                </p>
                {debateId && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="w-full text-xs gap-1.5"
                    onClick={() => window.open(`/debates/${debateId}/stream`, "_blank", "noopener,noreferrer")}
                  >
                    <ExternalLink className="h-3 w-3" /> Open Stream View (OBS)
                  </Button>
                )}
                <p className="text-[10px] text-muted-foreground">
                  Use OBS Browser Source with that URL. Add RTMP from YouTube Studio → Go Live. See docs/YOUTUBE_LIVE_STREAMING_GUIDE.md for full steps.
                </p>
                {youtubeLiveUrl ? (
                  <a href={youtubeLiveUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-xs text-primary hover:underline">
                    <ExternalLink className="h-3 w-3" /> Stream URL set
                  </a>
                ) : (
                  <p className="text-[10px] text-muted-foreground">Add stream URL in debate settings</p>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Phase Progress */}
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="py-3">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <PhaseIcon className="h-4 w-4 text-primary" />
                <span className="text-sm font-semibold">{phaseConfig[currentPhaseName].label}</span>
                <Badge className="bg-primary/20 text-primary text-xs">{isRunning || debatePaused ? formatTime(phaseTimeLeft) : "--:--"}</Badge>
                {debatePaused && <Badge className="bg-amber-500/20 text-amber-600 text-xs">Paused</Badge>}
              </div>
              <span className="text-xs text-muted-foreground">Phase {activePhaseIdx + 1}/{phases.length}</span>
            </div>
            <div className="flex items-center gap-0 mb-2">
              {phases.map((phase, idx) => {
                const isActive = idx === activePhaseIdx;
                const isDone   = idx < activePhaseIdx;
                return (
                  <div key={phase} className="flex items-center flex-1">
                    <div className="relative flex flex-col items-center">
                      <div className={cn(
                        "w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold border-2 transition-all",
                        isActive ? "bg-primary text-primary-foreground border-primary scale-110 shadow-md shadow-primary/30"
                          : isDone ? "bg-primary/20 text-primary border-primary/40"
                          : "bg-muted text-muted-foreground border-border"
                      )}>
                        {isDone ? <CheckCircle className="w-3 h-3" /> : idx + 1}
                      </div>
                      <span className={cn("text-[8px] mt-0.5 hidden sm:block whitespace-nowrap", isActive ? "text-primary font-semibold" : "text-muted-foreground")}>
                        {phaseConfig[phase].label}
                      </span>
                    </div>
                    {idx < phases.length - 1 && <div className={cn("h-0.5 flex-1 mx-0.5", isDone ? "bg-primary/40" : "bg-border")} />}
                  </div>
                );
              })}
            </div>
            <Progress value={isRunning || debatePaused ? phaseProgress : 0} className="h-1" />
          </CardContent>
        </Card>
            </div>
          </aside>

          {/* Main: video + bottom section */}
          <main className="flex-1 min-w-0 space-y-4 order-2 lg:order-1">
        {/* LiveKit video (when useLiveKit + debateId) - ControlBar on video for participants */}
        {useLiveKit && debateId ? (
          <div className="relative rounded-2xl overflow-hidden border-2 border-border bg-black" style={{ minHeight: 400 }}>
            <DebateVideoConference
              participantIds={[moderator.id, ...speakers.map((s) => s.id)]}
              style={{ height: "100%", minHeight: 400, display: "flex", flexDirection: "column" }}
              showMediaControls={isParticipant}
              cssFilter={
                isParticipant && !isVirtualBackground(cameraEffect)
                  ? (cameraEffects.find((e) => e.id === cameraEffect)?.filter ?? "")
                  : undefined
              }
              extraControls={
                isParticipant ? (
                  <Button
                    size="sm"
                    variant="secondary"
                    className="h-9 gap-1.5 shrink-0"
                    onClick={() => setShowBackgroundModal(true)}
                  >
                    <Sparkles className="h-4 w-4" />
                    <span className="text-xs font-medium hidden sm:inline">Background</span>
                  </Button>
                ) : null
              }
            />
          </div>
        ) : (
          <>
            {/* YouTube Live embed (when admin provides stream URL) */}
            {youtubeLiveUrl && extractYoutubeVideoId(youtubeLiveUrl) && (
              <div className="rounded-2xl overflow-hidden border-2 border-border bg-black">
                <iframe
                  src={`https://www.youtube.com/embed/${extractYoutubeVideoId(youtubeLiveUrl)}?autoplay=0`}
                  title="Live debate stream"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full aspect-video"
                />
              </div>
            )}

            {/* Background effects - button opens modal */}
            {isParticipant && !myVideoOff && (
              <div className="flex justify-end mb-2">
                <Button
                  size="sm"
                  variant="secondary"
                  className="h-9 gap-1.5 shadow-md"
                  onClick={() => setShowBackgroundModal(true)}
                >
                  <Sparkles className="h-4 w-4" />
                  <span className="text-xs font-medium">Background effects</span>
                </Button>
              </div>
            )}

            {/* Debate Stage: only moderator + scholars (no viewers) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { ...moderator, isMuted: currentUser?.id === moderator.id ? myMuted : false, isVideoOff: currentUser?.id === moderator.id ? myVideoOff : true, isSpeaking: currentUser?.id === moderator.id ? iAmSpeaking : false, position: "mod" as const },
            ...speakers.slice(0, 2).map((s, i) => ({ ...s, position: (i === 0 ? "A" : "B") as "A" | "B" })),
          ].map((participant, i) => {
            const isCurrentUser = participant.id === currentUser?.id;
            const isMod = participant.position === "mod";
            const posLabel = isMod ? "Moderator" : `Position ${participant.position}`;
            const accentBg = isMod ? "rgb(245 158 11 / 0.2)" : i === 1 ? "hsl(var(--primary) / 0.2)" : "hsl(var(--secondary) / 0.2)";
            const accentClass = isMod ? "text-amber-600" : i === 1 ? "text-primary" : "text-secondary";
            const accentBgClass = isMod ? "bg-amber-500/20" : i === 1 ? "bg-primary/20" : "bg-secondary/20";
            return (
              <motion.div
                key={participant.id}
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                className={cn(
                  "relative rounded-2xl border-2 overflow-hidden flex flex-col",
                  participant.isSpeaking && !participant.isMuted
                    ? isMod ? "border-amber-500 shadow-lg shadow-amber-500/20" : i === 1 ? "border-primary shadow-lg shadow-primary/20" : "border-secondary shadow-lg shadow-secondary/20"
                    : "border-border"
                )}
                style={{ minHeight: 280 }}
              >
                {/* Top indicators */}
                <div className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest z-10"
                  style={{ backgroundColor: accentBg }}>
                  {posLabel}
                </div>
                <div className="absolute top-3 right-3 flex gap-1 z-10">
                  {participant.isMuted && (
                    <div className="w-7 h-7 rounded-full bg-destructive/20 border border-destructive/30 flex items-center justify-center" title="Muted">
                      <MicOff className="h-3.5 w-3.5 text-destructive" />
                    </div>
                  )}
                  {participant.isVideoOff && (
                    <div className="w-7 h-7 rounded-full bg-destructive/20 border border-destructive/30 flex items-center justify-center" title="Camera off">
                      <VideoOff className="h-3.5 w-3.5 text-destructive" />
                    </div>
                  )}
                </div>

                {/* Main content - camera fills full card when current user has it on */}
                <div className={cn(
                  "flex-1 flex flex-col relative overflow-hidden",
                  isCurrentUser && !myVideoOff ? "min-h-[260px]" : ""
                )}>
                  {isCurrentUser && !myVideoOff ? (
                    // Camera fills entire card - effect applied only when user selects
                    <div className="absolute inset-0 bg-black">
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
                  ) : (
                    <div className="flex-1 flex flex-col items-center justify-center p-4 bg-gradient-to-br from-card to-muted/60">
                      <div className={cn("w-16 h-16 rounded-2xl flex items-center justify-center mb-2", accentBgClass)}>
                        <span className={cn("text-2xl font-bold", accentClass)}>
                          {participant.name.charAt(0)}
                        </span>
                      </div>
                      <p className="font-bold text-foreground text-sm">{participant.name}</p>
                      <Badge className={cn(roleLabels[participant.role]?.color ?? "bg-muted text-muted-foreground", "mt-1 text-[10px]")}>
                        {roleLabels[participant.role]?.label ?? "Member"}
                      </Badge>
                      {participant.isSpeaking && !participant.isMuted && (
                        <div className="flex items-end gap-1 mt-3">
                          {[2, 3, 5, 4, 6, 4, 5, 3, 2].map((h, j) => (
                            <div key={j} className={cn("w-1 rounded-full animate-pulse", accentClass)} style={{ height: `${h * 2.5}px`, animationDelay: `${j * 0.08}s` }} />
                          ))}
                          <span className={cn("text-[10px] ml-1.5 font-medium", accentClass)}>Speaking</span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Controls bar when camera on - no overlay/background color */}
                  {isCurrentUser && !myVideoOff && (
                    <div className="absolute bottom-0 left-0 right-0 p-3 z-10">
                      <p className="font-bold text-white text-sm">{participant.name}</p>
                      <Badge className={cn(roleLabels[participant.role]?.color ?? "bg-muted text-muted-foreground", "mt-1 text-[10px]")}>
                        {roleLabels[participant.role]?.label ?? "Member"}
                      </Badge>
                      {participant.isSpeaking && !participant.isMuted && (
                        <div className="flex items-end gap-1 mt-2">
                          {[2, 3, 5, 4, 6, 4, 5, 3, 2].map((h, j) => (
                            <div key={j} className={cn("w-1 rounded-full animate-pulse", accentClass)} style={{ height: `${h * 2.5}px`, animationDelay: `${j * 0.08}s` }} />
                          ))}
                          <span className={cn("text-[10px] ml-1.5 font-medium", accentClass)}>Speaking</span>
                        </div>
                      )}
                      <div className="mt-3 flex justify-center items-center gap-2 flex-wrap">
                        <MediaControls myMuted={myMuted} myVideoOff={myVideoOff} onToggleMic={handleToggleMic} onToggleVideo={handleToggleVideo} variant="video" />
                        <Button size="icon" variant="outline" className="h-8 w-8" title="Background effects" onClick={() => setShowBackgroundModal(true)}>
                          <Sparkles className="h-3.5 w-3.5" />
                        </Button>
                        {!myMuted && (
                          <div className="relative h-8 min-w-[48px] flex items-center gap-1">
                            <Volume2 className="h-4 w-4 text-foreground shrink-0" />
                            <div className="h-2 w-8 bg-muted rounded-full overflow-hidden">
                              <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${Math.min((audioLevel / 255) * 100, 100)}%` }} />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Local controls – only for current user (when camera off; when camera on, controls are in overlay) */}
                  {isCurrentUser && myVideoOff && (
                    <div className="mt-4 w-full border-t pt-3 flex justify-center gap-3 items-start">
                      <div className="flex flex-col items-center gap-1">
                        <MediaControls myMuted={myMuted} myVideoOff={myVideoOff} onToggleMic={handleToggleMic} onToggleVideo={handleToggleVideo} variant="video" />
                        <span className="text-[8px] text-muted-foreground">{myMuted ? "Muted" : "Live"} · {myVideoOff ? "Cam Off" : "Cam On"}</span>
                      </div>

                      {/* Audio level indicator (only when mic on) */}
                      {!myMuted && (
                        <div className="flex flex-col items-center gap-1">
                          <div className="relative h-8 min-w-[48px] flex items-center gap-1">
                            <Volume2 className="h-4 w-4 text-muted-foreground shrink-0" />
                            <div className="h-2 w-8 bg-muted rounded-full overflow-hidden">
                              <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${Math.min((audioLevel / 255) * 100, 100)}%` }} />
                            </div>
                          </div>
                          <span className="text-[8px] text-muted-foreground">Level</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
          </>
        )}

        {/* Bottom Section */}
        <div className="grid lg:grid-cols-3 gap-4">

          {/* Left: Voting + Participants (no separate "Your Controls" card) */}
          <div className="space-y-4">

            {/* Clarity Voting */}
            {isAuthenticated ? (
              <Card>
                <CardHeader className="py-2.5 pb-1">
                  <CardTitle className="text-xs flex items-center gap-2">
                    <BarChart3 className="h-3.5 w-3.5 text-primary" /> Clarity Voting
                    <span className="text-[10px] font-normal text-muted-foreground ml-auto">{totalVotes} votes</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="pb-3 space-y-2.5">
                  {[
                    { side: "A" as const, name: speakers[0]?.name.split(" ")[0] ?? "—", pct: pctA, bg: "bg-primary" },
                    { side: "B" as const, name: speakers[1]?.name.split(" ")[0] ?? "—", pct: pctB, bg: "bg-secondary" },
                  ].map(({ side, name, pct, bg }) => (
                    <div key={side}>
                      <div className="flex items-center justify-between text-[10px] mb-1">
                        <span className={cn("font-medium", side === "A" ? "text-primary" : "text-secondary")}>Position {side} · {name}</span>
                        <span className="text-muted-foreground">{pct}%</span>
                      </div>
                      <div className="relative h-2.5 bg-muted rounded-full overflow-hidden">
                        <motion.div className={cn("absolute inset-y-0 left-0 rounded-full", bg)} initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.6 }} />
                      </div>
                    </div>
                  ))}
                  <div className="grid grid-cols-2 gap-2">
                    {(["A", "B"] as const).map(side => (
                      <Tooltip key={side}>
                        <TooltipTrigger asChild>
                          <Button size="sm" variant={myVote === side ? "default" : "outline"} className="text-xs" onClick={() => handleVote(side)} disabled={!!myVote || !isAuthenticated}>
                            <Star className="h-3 w-3 mr-1" /> {myVote === side ? `✓ Voted ${side}` : `Position ${side}`}
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>{myVote === side ? `You voted for Position ${side}` : `Vote for Position ${side} clarity`}</TooltipContent>
                      </Tooltip>
                    ))}
                  </div>
                  {myVote && (
                    <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-[10px] text-center text-muted-foreground">
                      ✓ Your vote for Position {myVote} is recorded
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

            {/* Participants */}
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
                    <div key={s.id} className={cn(
                      "flex items-center gap-2 p-1.5 rounded-lg border",
                      s.isSpeaking && !s.isMuted ? "bg-primary/5 border-primary/20" : "bg-background/50 border-transparent"
                    )}>
                      <div className={cn("w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold", i === 0 ? "bg-primary/20 text-primary" : "bg-secondary/20 text-secondary")}>
                        {s.name.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium truncate">{s.name}</p>
                        <p className={cn("text-[10px]", i === 0 ? "text-primary" : "text-secondary")}>
                          Pos. {i === 0 ? "A" : "B"}{s.isMuted ? " · 🔇" : ""}{s.isVideoOff ? " · 📷" : ""}
                        </p>
                      </div>
                      {s.isSpeaking && !s.isMuted && (
                        <div className="flex items-end gap-0.5">
                          {[2, 3, 4, 3, 2].map((h, j) => (
                            <div key={j} className="w-0.5 bg-primary rounded-full animate-pulse" style={{ height: `${h * 2}px`, animationDelay: `${j * 0.1}s` }} />
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                  {/* Current user speaking indicator */}
                  {iAmSpeaking && isSpeaker && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2 p-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                      <div className="w-7 h-7 rounded-full bg-emerald-500/20 flex items-center justify-center text-xs">{currentUser?.name?.charAt(0) ?? "Y"}</div>
                      <div className="flex-1">
                        <p className="text-xs font-medium">{currentUser?.name ?? "You"}</p>
                        <p className="text-[10px] text-emerald-600 flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Speaking (live)
                        </p>
                      </div>
                    </motion.div>
                  )}
                  {handRaised && canUseHandRaise && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2 p-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20">
                      <div className="w-7 h-7 rounded-full bg-muted flex items-center justify-center text-xs">{currentUser?.name?.charAt(0) ?? "Y"}</div>
                      <div className="flex-1">
                        <p className="text-xs font-medium">{currentUser?.name ?? "You"}</p>
                        <p className="text-[10px] text-amber-600">✋ Hand Raised</p>
                      </div>
                      <Button size="sm" variant="ghost" className="h-6 text-[10px]" onClick={handleRaiseHand}>Lower</Button>
                    </motion.div>
                  )}
                  {!handRaised && canUseHandRaise && !isSpeaker && currentUser?.id !== moderator.id && (
                    <Button size="sm" variant="outline" className="w-full mt-2 gap-1.5" onClick={handleRaiseHand}>
                      <Hand className="h-3.5 w-3.5" /> Raise Hand
                    </Button>
                  )}
                  {/* Moderator media controls - same as side panel (synced) */}
                  {currentUser?.id === moderator.id && (
                    <div className="flex items-center gap-2 p-2 rounded-lg bg-muted/50 border border-border mt-2">
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium">{currentUser?.name ?? "You"}</p>
                        <p className="text-[10px] text-muted-foreground">Your media</p>
                      </div>
                      <SidePanelMediaControls myMuted={myMuted} myVideoOff={myVideoOff} onToggleMic={handleToggleMic} onToggleVideo={handleToggleVideo} />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right: Q&A + Evidence */}
          <div className="lg:col-span-2 space-y-4">
            <Card className="flex flex-col" style={{ minHeight: 380 }}>
              <CardHeader className="py-2.5 pb-0">
                <div className="flex gap-1 border-b border-border pb-2">
                  {availableTabs.map((tab: "chat" | "evidence") => (
                    <button key={tab} onClick={() => setActiveTab(tab)}
                      className={cn("text-xs px-3 py-1.5 rounded-md font-medium transition-colors flex items-center gap-1",
                        activeTab === tab ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground"
                      )}>
                      {tab === "chat"
                        ? <><MessageSquare className="h-3 w-3" /> Q&A {pendingQs.length > 0 && isModerator && <span className="ml-0.5 px-1 py-0.5 rounded-full bg-red-500 text-white text-[9px]">{pendingQs.length}</span>}</>
                        : <><BookMarked className="h-3 w-3" /> Evidence</>}
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
                            .filter(q => q.approved || isModerator || q.userId === currentUser?.id)
                            .map(q => (
                              <div key={q.id} className={cn(
                                "p-2.5 rounded-lg text-xs border",
                                q.approved ? "bg-primary/5 border-primary/20" : "bg-muted/50 border-border"
                              )}>
                                <div className="flex items-start justify-between gap-2">
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-1.5 mb-0.5">
                                      <span className="font-semibold text-foreground">{q.user}</span>
                                      {!q.approved && <Badge className="text-[9px] bg-amber-500/20 text-amber-600 py-0 px-1.5">Pending</Badge>}
                                      <span className="text-muted-foreground/50 text-[10px]">{q.timestamp}</span>
                                    </div>
                                    <p className="text-muted-foreground leading-snug">{q.text}</p>
                                  </div>
                                  <button onClick={() => handleUpvote(q.id)} disabled={!isAuthenticated}
                                    className={cn(
                                      "flex flex-col items-center gap-0.5 px-1.5 py-1 rounded-md transition-colors flex-shrink-0",
                                      q.upvotedByMe ? "text-primary bg-primary/10"
                                        : isAuthenticated ? "text-muted-foreground hover:text-primary hover:bg-primary/5"
                                        : "text-muted-foreground/40 cursor-not-allowed"
                                    )}>
                                    <ThumbsUp className="h-3 w-3" />
                                    <span className="text-[10px] font-bold">{q.upvotes}</span>
                                  </button>
                                </div>
                              </div>
                            ))}
                          {questions.filter(q => q.approved || isModerator || q.userId === currentUser?.id).length === 0 && (
                            <div className="text-center py-8 text-muted-foreground">
                              <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-30" />
                              <p className="text-xs">No questions yet — be the first!</p>
                            </div>
                          )}
                        </div>
                      </ScrollArea>
                      {!currentUser ? (
                        <div className="mt-2 p-2 text-center border border-dashed border-border rounded-lg">
                          <p className="text-[10px] text-muted-foreground">
                            <Lock className="h-3 w-3 inline mr-1" />
                            <button onClick={() => router.push("/login")} className="underline text-primary">Sign in</button> to participate
                          </p>
                        </div>
                      ) : !canUseQa ? (
                        <div className="mt-2 p-2 text-center border border-dashed border-border rounded-lg">
                          <p className="text-[10px] text-muted-foreground">
                            <Lock className="h-3 w-3 inline mr-1" />
                            Q&A is currently locked by moderator
                          </p>
                        </div>
                      ) : (
                        <div className="flex gap-1.5 mt-2">
                          <Input
                            placeholder="Ask a question…"
                            value={question}
                            onChange={e => setQuestion(e.target.value)}
                            onKeyDown={e => e.key === "Enter" && !e.shiftKey && handleSubmitQuestion()}
                            className="text-xs h-8"
                            maxLength={300}
                            disabled={!canUseQa}
                          />
                          <Button size="icon" className="h-8 w-8 flex-shrink-0" onClick={handleSubmitQuestion} disabled={!question.trim()}>
                            <Send className="h-3 w-3" />
                          </Button>
                        </div>
                      )}
                      <p className="text-[10px] text-muted-foreground mt-1 flex items-center gap-1">
                        <Shield className="h-2.5 w-2.5" /> Questions reviewed by moderator before appearing publicly
                      </p>
                    </motion.div>
                  ) : (
                    <motion.div key="evidence" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col flex-1 overflow-hidden">
                      <div className="flex gap-1 mb-2">
                        {(["all", "A", "B"] as const).map(f => (
                          <Tooltip key={f}>
                            <TooltipTrigger asChild>
                              <button onClick={() => setEvidenceFilter(f)}
                                className={cn("text-[10px] px-2.5 py-1 rounded-full font-semibold transition-colors",
                                  evidenceFilter === f
                                    ? f === "A" ? "bg-primary text-primary-foreground"
                                      : f === "B" ? "bg-secondary text-secondary-foreground"
                                      : "bg-foreground text-background"
                                    : "bg-muted text-muted-foreground hover:text-foreground"
                                )}>
                                {f === "all" ? "All Evidence" : `Position ${f}`}
                              </button>
                            </TooltipTrigger>
                            <TooltipContent>{f === "all" ? "Show all evidence" : `Show ${f === "A" ? "পক্ষ (Position A)" : "বিপক্ষ (Position B)"} evidence only`}</TooltipContent>
                          </Tooltip>
                        ))}
                      </div>
                      <ScrollArea className="flex-1">
                        {/* Position A left, Position B right - দুই পাশে আলাদা */}
                        <div className={cn(
                          "grid gap-3 pb-1",
                          evidenceFilter === "all" ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1"
                        )}>
                          {(evidenceFilter === "all" ? ["A", "B"] as const : [evidenceFilter]).map(side => {
                            const sideEvs = evidences.filter(e => e.scholar === side);
                            return (
                              <div key={side} className={cn(
                                "space-y-2",
                                evidenceFilter === "all" && side === "B" && "md:border-l md:border-secondary/20 md:pl-3"
                              )}>
                                <p className={cn("text-[10px] font-bold uppercase", side === "A" ? "text-primary" : "text-secondary")}>
                                  {side === "A" ? "পক্ষ (Position A)" : "বিপক্ষ (Position B)"}
                                </p>
                                {sideEvs.length === 0 ? (
                                  <div className="text-center py-4 text-muted-foreground text-xs">No evidence</div>
                                ) : (
                                  sideEvs.map((ev, idx) => (
                                    <div key={idx} className={cn(
                                      "p-3 rounded-xl border text-xs",
                                      side === "A"
                                        ? "border-primary/20 bg-primary/5 text-left"
                                        : "border-secondary/20 bg-secondary/5 text-right"
                                    )}>
                                      <div className={cn("flex items-center gap-1.5 mb-1.5", side === "B" && "justify-end")}>
                                        <Badge className={cn("text-[9px] py-0 border", evidenceTypeConfig[ev.type].color)}>{evidenceTypeConfig[ev.type].label}</Badge>
                                      </div>
                                      {ev.arabic && <p className={cn("text-base font-arabic text-foreground leading-relaxed mb-1.5", side === "A" ? "text-left" : "text-right")} dir="rtl">{ev.arabic}</p>}
                                      <p className={cn("text-muted-foreground italic", side === "B" && "text-right")}>&ldquo;{ev.translation}&rdquo;</p>
                                      <p className={cn("text-muted-foreground/60 mt-1", side === "B" && "text-right")}>— {ev.reference}</p>
                                    </div>
                                  ))
                                )}
                              </div>
                            );
                          })}
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
                <CardTitle className="text-xs flex items-center gap-2"><Scale className="h-3.5 w-3.5 text-primary" /> Debate Adab</CardTitle>
              </CardHeader>
              <CardContent className="pb-3">
                <div className="grid sm:grid-cols-2 gap-x-4 gap-y-2 text-xs text-muted-foreground">
                  {[
                    { icon: CheckCircle,   text: "Arguments must be evidence-based", color: "text-primary" },
                    { icon: AlertTriangle, text: "Personal attacks are prohibited",  color: "text-destructive" },
                    { icon: Scale,         text: "Vote on clarity, not who 'won'",   color: "text-secondary" },
                    { icon: BookOpen,      text: "All dalils are cited & verifiable", color: "text-primary" },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <item.icon className={cn("h-3.5 w-3.5 flex-shrink-0", item.color)} />
                      <span>{item.text}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
          </main>
        </div>

      {/* Floating "Your camera" preview - when user is viewer (not speaker) and camera is on */}
      {isAuthenticated && !myVideoOff && !isSpeaker && (
        <div className="fixed bottom-24 right-6 z-50 rounded-2xl overflow-hidden border-2 border-primary/50 shadow-xl bg-black">
          <div className="flex items-center justify-between px-2 py-1">
            <p className="text-[10px] font-semibold text-primary">Your camera</p>
            <Button size="icon" variant="ghost" className="h-6 w-6 text-primary hover:bg-primary/20" onClick={() => setShowBackgroundModal(true)}>
              <Sparkles className="h-3 w-3" />
            </Button>
          </div>
          <div className="w-40 h-32 bg-black">
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
          token={liveKitToken}
          serverUrl={liveKitServerUrl}
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