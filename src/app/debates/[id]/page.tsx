"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import Pusher from "pusher-js";
import { toast } from "sonner";
import { debateApi } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { ArrowLeft, LayoutGrid, Rows3 } from "lucide-react";
import { DebatePanel } from "@/components/debates/DebatePanel";
import { DebateChatPanel } from "@/components/debates/DebateChatPanel";
import { motion } from "framer-motion";

function extractYouTubeVideoId(url: string): string | null {
  if (!url) return null;
  const liveMatch = url.match(/youtube\.com\/live\/([a-zA-Z0-9_-]+)/);
  if (liveMatch) return liveMatch[1];
  const embedMatch = url.match(/youtube\.com\/embed\/([a-zA-Z0-9_-]+)/);
  if (embedMatch) return embedMatch[1];
  const shortMatch = url.match(/youtu\.be\/([a-zA-Z0-9_-]+)/);
  if (shortMatch) return shortMatch[1];
  const vMatch = url.match(/[?&]v=([a-zA-Z0-9_-]+)/);
  if (vMatch) return vMatch[1];
  return null;
}

// Full mock content for demo debates (same design for all viewers)
const mockDebateContent: Record<string, {
  titleAr?: string;
  positionA: { scholar: { name: string; title: string }; position: string; summary: string; evidence: { type: "quran" | "hadith" | "ijma" | "qiyas" | "scholarly"; reference: string; arabic?: string; translation?: string }[]; methodology: string };
  positionB: { scholar: { name: string; title: string }; position: string; summary: string; evidence: { type: "quran" | "hadith" | "ijma" | "qiyas" | "scholarly"; reference: string; arabic?: string; translation?: string }[]; methodology: string };
  agreementPoints: string[];
  disagreementPoints: string[];
  conclusion?: string;
  clarityVotes: { positionA: number; positionB: number };
}> = {
  "1": {
    titleAr: "هل الشورى ملزمة أم استشارية؟",
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
    agreementPoints: [
      "Shura (consultation) is obligatory for the Muslim ruler",
      "The practice of the Rashidun Caliphs serves as a model",
      "Shura promotes justice and prevents tyranny",
      "The Ummah has a right to participate in governance",
    ],
    disagreementPoints: [
      "Whether the outcome of Shura legally binds the ruler",
      "The scope of issues requiring mandatory consultation",
      "Whether modern parliamentary systems fulfill Shura requirements",
    ],
    clarityVotes: { positionA: 73, positionB: 54 },
  },
  "3": {
    titleAr: "شروط البيعة الصحيحة",
    positionA: {
      scholar: { name: "Sh. Abdullah Farooq", title: "Senior Scholar" },
      position: "Bay'ah requires consensus of Ahl al-Hall wal-'Aqd",
      summary: "The classical position requires the agreement of the people who loosen and bind (ahl al-hall wal-'aqd) as representatives of the community.",
      evidence: [{ type: "scholarly" as const, reference: "Al-Mawardi", translation: "The contract of imamate is concluded by the people who loosen and bind" }],
      methodology: "Classical fiqh methodology",
    },
    positionB: {
      scholar: { name: "Dr. Maryam Hassan", title: "Researcher" },
      position: "Bay'ah requires direct public consent",
      summary: "In modern contexts, bay'ah should involve direct or representative consent of the entire Ummah.",
      evidence: [{ type: "scholarly" as const, reference: "Modern scholarship", translation: "The spirit of bay'ah requires public participation" }],
      methodology: "Contemporary usul al-fiqh",
    },
    agreementPoints: ["Bay'ah is essential for legitimate leadership", "Consent of the governed is required"],
    disagreementPoints: ["Who constitutes Ahl al-Hall wal-'Aqd", "Whether bay'ah can be implied"],
    clarityVotes: { positionA: 45, positionB: 38 },
  },
};

function buildDebatePanelProps(
  api: { id: string; title: string; details: string; topic: string; status: string; participants: { positionA: { name: string } | null; positionB: { name: string } | null } }
) {
  const mock = mockDebateContent[api.id];
  const nameA = api.participants.positionA?.name ?? "TBD";
  const nameB = api.participants.positionB?.name ?? "TBD";
  const status: "active" | "concluded" = api.status === "concluded" ? "concluded" : "active";

  if (mock) {
    return {
      title: api.title,
      titleAr: mock.titleAr,
      topic: api.topic,
      positionA: mock.positionA,
      positionB: mock.positionB,
      agreementPoints: mock.agreementPoints,
      disagreementPoints: mock.disagreementPoints,
      conclusion: mock.conclusion,
      status,
      clarityVotes: mock.clarityVotes,
    };
  }

  const placeholder = "Position statement to be added. Full content will be available once the scholars complete their submissions.";
  return {
    title: api.title,
    topic: api.topic,
    positionA: {
      scholar: { name: nameA, title: "Scholar" },
      position: placeholder,
      summary: placeholder,
      evidence: [],
      methodology: "To be determined",
    },
    positionB: {
      scholar: { name: nameB, title: "Scholar" },
      position: placeholder,
      summary: placeholder,
      evidence: [],
      methodology: "To be determined",
    },
    agreementPoints: ["Debate in progress"],
    disagreementPoints: ["Positions to be presented"],
    status,
    clarityVotes: { positionA: 0, positionB: 0 },
  };
}

export default function DebateDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const id = params?.id as string | undefined;
  const [debate, setDebate] = useState<{
    id: string;
    title: string;
    details: string;
    topic: string;
    status: string;
    format: string;
    scheduledAt: string;
    duration: number;
    youtubeLiveUrl: string | null;
    participants: {
      positionA: { userId?: string; name: string } | null;
      positionB: { userId?: string; name: string } | null;
      moderator: { userId?: string; name: string } | null;
    };
  } | null>(null);
  const [messages, setMessages] = useState<{ id: string; userId?: string; userName: string; text: string; audioUrl?: string; createdAt: string; reactions?: Record<string, number>; myReaction?: string }[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(true);
  const [dalilAttachment, setDalilAttachment] = useState<{ type: string; reference: string; arabic?: string; translation?: string } | null>(null);
  const [clarityVotes, setClarityVotes] = useState<{ positionA: number; positionB: number; myVote?: "A" | "B" | null } | null>(null);
  const [bookmarked, setBookmarked] = useState(false);
  const [chatLayout, setChatLayout] = useState<"stacked" | "side">("stacked");
  const [typingUsers, setTypingUsers] = useState<{ userId: string; userName: string }[]>([]);
  const [recordingUsers, setRecordingUsers] = useState<{ userId: string; userName: string }[]>([]);
  const typingTimeoutsRef = useRef<Record<string, ReturnType<typeof setTimeout>>>({});
  const lastSentRef = useRef<{ text: string; time: number } | null>(null);

  const hasChatAccess =
    !!user &&
    !!debate &&
    (user.id === debate.participants.positionA?.userId ||
      user.id === debate.participants.positionB?.userId ||
      user.id === debate.participants.moderator?.userId ||
      user.role === "admin");

  useEffect(() => {
    if (!id) {
      router.replace("/debates");
      return;
    }
    (async () => {
      const { data, error } = await debateApi.getById(id);
      if (error || !data?.debate) {
        router.replace("/debates");
        return;
      }
      setDebate(data.debate);
      const hasMock = !!mockDebateContent[id];
      const [msgRes, clarityRes] = await Promise.all([
        debateApi.getMessages(id),
        hasMock ? Promise.resolve({ data: null }) : debateApi.getClarityVotes(id),
      ]);
      if (msgRes.data?.messages) setMessages(msgRes.data.messages);
      if (!hasMock && clarityRes?.data) setClarityVotes({ positionA: clarityRes.data.positionA, positionB: clarityRes.data.positionB, myVote: clarityRes.data.myVote ?? null });
      if (user?.id) {
        const bookmarkRes = await debateApi.getBookmark(id);
        if (bookmarkRes.data?.bookmarked !== undefined) setBookmarked(bookmarkRes.data.bookmarked);
      }
      setLoading(false);
    })();
  }, [id, router, user?.id]);

  // Real-time: subscribe for everyone (participants + viewers) so all see new messages
  useEffect(() => {
    const key = process.env.NEXT_PUBLIC_PUSHER_KEY;
    const cluster = process.env.NEXT_PUBLIC_PUSHER_CLUSTER || "ap1";
    if (!id || !key) return;
    const pusher = new Pusher(key, { cluster });
    const ch = pusher.subscribe(`debate-${id}`);
    ch.bind("new-message", (payload: { userId: string; name: string; text: string; timestamp: string; id?: string; audioUrl?: string }) => {
      const msgId = payload.id ?? `pusher-${Date.now()}`;
      setMessages((prev) => {
        if (prev.some((m) => m.id === msgId)) return prev;
        const last = lastSentRef.current;
        if (last && payload.userId === user?.id && payload.text === last.text && Date.now() - last.time < 3000) return prev;
        return [
          ...prev,
          {
            id: msgId,
            userId: payload.userId,
            userName: payload.name,
            text: payload.text,
            audioUrl: payload.audioUrl,
            createdAt: payload.timestamp,
          },
        ];
      });
    });
    ch.bind("message-updated", (payload: { id: string; text: string }) => {
      setMessages((prev) => prev.map((m) => (m.id === payload.id ? { ...m, text: payload.text } : m)));
    });
    ch.bind("message-deleted", (payload: { id: string }) => {
      setMessages((prev) => prev.filter((m) => m.id !== payload.id));
    });
    ch.bind("clarity-votes-updated", (payload: { positionA: number; positionB: number }) => {
      setClarityVotes((prev) => (prev ? { ...prev, positionA: payload.positionA, positionB: payload.positionB } : { positionA: payload.positionA, positionB: payload.positionB, myVote: null }));
    });
    ch.bind("user-typing", (payload: { userId: string; userName: string }) => {
      if (payload.userId === user?.id) return;
      if (typingTimeoutsRef.current[payload.userId]) clearTimeout(typingTimeoutsRef.current[payload.userId]);
      setTypingUsers((prev) => {
        if (prev.some((t) => t.userId === payload.userId)) return prev;
        return [...prev.filter((t) => t.userId !== payload.userId), payload];
      });
      typingTimeoutsRef.current[payload.userId] = setTimeout(() => {
        setTypingUsers((p) => p.filter((t) => t.userId !== payload.userId));
        delete typingTimeoutsRef.current[payload.userId];
      }, 3000);
    });
    ch.bind("user-recording", (payload: { userId: string; userName: string; recording: boolean }) => {
      if (payload.userId === user?.id) return;
      setRecordingUsers((prev) => {
        if (payload.recording) {
          if (prev.some((t) => t.userId === payload.userId)) return prev;
          return [...prev.filter((t) => t.userId !== payload.userId), { userId: payload.userId, userName: payload.userName }];
        }
        return prev.filter((t) => t.userId !== payload.userId);
      });
    });
    return () => {
      ch.unbind_all();
      pusher.unsubscribe(`debate-${id}`);
      pusher.disconnect();
    };
  }, [id, user?.id]);

  const MAX_MESSAGE_LENGTH = 5000;
  const handleSendMessage = async (overrideText?: string) => {
    let textToSend = (overrideText ?? chatInput).trim();
    if (dalilAttachment) {
      const d = dalilAttachment;
      textToSend += `\n\n[${d.type}: ${d.reference}${d.arabic ? ` — ${d.arabic}` : ""}${d.translation ? ` — "${d.translation}"` : ""}]`;
    }
    if (!textToSend || !id || !user || !debate) return;
    if (textToSend.length > MAX_MESSAGE_LENGTH) {
      toast.error(`Message too long (max ${MAX_MESSAGE_LENGTH} characters)`);
      return;
    }
    const scheduledMs = debate.scheduledAt ? new Date(debate.scheduledAt).getTime() : null;
    if (scheduledMs != null && Date.now() < scheduledMs) return;
    const text = textToSend;
    setDalilAttachment(null);
    setSending(true);
    lastSentRef.current = { text, time: Date.now() };
    const { data, error } = await debateApi.sendMessage(id, text);
    setSending(false);
    if (error) {
      toast.error(error);
      return;
    }
    if (data?.message) {
      const m = data.message as { id: string; userId?: string; userName: string; text: string; createdAt: string };
      setMessages((prev) => [...prev, m]);
    }
    setChatInput("");
  };

  const handleEditMessage = async (messageId: string, newText: string) => {
    if (!id || !newText.trim()) return;
    const { data, error } = await debateApi.editMessage(id, messageId, newText.trim());
    if (error) {
      toast.error(error);
      return;
    }
    if (data?.message) {
      const updated = data.message as { id: string; userId?: string; userName: string; text: string; createdAt: string };
      setMessages((prev) => prev.map((m) => (m.id === messageId ? { ...m, ...updated } : m)));
      toast.success("Message updated");
    }
  };

  const handleDeleteMessage = async (messageId: string) => {
    if (!id) return;
    const { error } = await debateApi.deleteMessage(id, messageId);
    if (error) {
      toast.error(error);
      return;
    }
    setMessages((prev) => prev.filter((m) => m.id !== messageId));
    toast.success("Message deleted");
  };

  const handleSendVoice = async (audioBlob: Blob) => {
    if (!id || !user || !debate) return;
    const scheduledMs = debate.scheduledAt ? new Date(debate.scheduledAt).getTime() : null;
    if (scheduledMs != null && Date.now() < scheduledMs) return;
    setSending(true);
    const { data, error } = await debateApi.sendVoiceMessage(id, audioBlob);
    setSending(false);
    if (error) {
      toast.error(error);
      return;
    }
    if (data?.message) {
      const m = data.message as { id: string; userId?: string; userName: string; text: string; audioUrl?: string; createdAt: string };
      setMessages((prev) => [...prev, m]);
    }
  };

  if (loading || !debate) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4">
        <div className="w-10 h-10 rounded-full border-2 border-primary/30 border-t-primary animate-spin" />
        <p className="text-sm text-muted-foreground">Loading debate...</p>
      </div>
    );
  }

  const videoId = debate.format === "video" && debate.youtubeLiveUrl ? extractYouTubeVideoId(debate.youtubeLiveUrl) : null;
  const panelProps = buildDebatePanelProps(debate);
  const effectiveClarityVotes = clarityVotes ?? panelProps.clarityVotes;

  const handleVoteClarity = async (side: "A" | "B") => {
    if (!id) return;
    const { data } = await debateApi.voteClarity(id, side);
    if (data) setClarityVotes({ positionA: data.positionA, positionB: data.positionB, myVote: data.myVote ?? null });
  };

  const handleBookmarkToggle = async () => {
    if (!id) return;
    const { data } = await debateApi.toggleBookmark(id);
    if (data?.bookmarked !== undefined) setBookmarked(data.bookmarked);
  };

  const refetchClarityVotes = async () => {
    if (!id) return;
    const { data } = await debateApi.getClarityVotes(id);
    if (data) setClarityVotes({ positionA: data.positionA, positionB: data.positionB, myVote: data.myVote ?? null });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur border-b border-border">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => router.push("/debates")}>
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back
          </Button>
          <div className="flex-1 min-w-0">
            <h1 className="font-bold text-lg truncate">{debate.title}</h1>
            <p className="text-sm text-muted-foreground">
              {debate.participants.positionA?.name ?? "TBD"} vs {debate.participants.positionB?.name ?? "TBD"}
              {debate.participants.moderator?.name && ` · Moderator: ${debate.participants.moderator.name}`}
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {videoId && (
          <div className="rounded-xl overflow-hidden border border-border bg-muted mb-6">
            <iframe
              src={`https://www.youtube.com/embed/${videoId}?autoplay=0`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full aspect-video"
            />
          </div>
        )}
        <div className={hasChatAccess && chatLayout === "side" ? "flex gap-6 items-stretch" : "space-y-6"}>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className={hasChatAccess && chatLayout === "side" ? "flex-1 min-w-0" : ""}
          >
            <DebatePanel
              {...panelProps}
              clarityVotes={effectiveClarityVotes}
              myVote={clarityVotes?.myVote ?? null}
              onVoteClarity={handleVoteClarity}
              onReactionChange={refetchClarityVotes}
              liveMessages={messages}
              debateId={id}
              bookmarked={bookmarked}
              onBookmarkToggle={user ? handleBookmarkToggle : undefined}
              typingUsers={typingUsers}
              recordingUsers={recordingUsers}
              onShare={id ? () => {
                const url = typeof window !== "undefined" ? `${window.location.origin}/debates/${id}` : "";
                if (navigator.share) {
                  navigator.share({ title: debate?.title ?? "Debate", url }).catch(() => {
                    navigator.clipboard.writeText(url);
                    toast.success("Link copied!");
                  });
                } else {
                  navigator.clipboard.writeText(url);
                  toast.success("Link copied!");
                }
              } : undefined}
            />
          </motion.div>

          {hasChatAccess && (
            <div className={chatLayout === "side" ? "w-[380px] shrink-0 flex flex-col" : "space-y-2"}>
              <div className="flex items-center justify-between gap-2">
                <span className="text-sm font-medium text-muted-foreground">Debate Chat</span>
                <div className="flex items-center gap-1">
                  <Button
                    variant={chatLayout === "stacked" ? "secondary" : "ghost"}
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => setChatLayout("stacked")}
                    title="Stacked layout (top-bottom)"
                    aria-pressed={chatLayout === "stacked"}
                  >
                    <Rows3 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={chatLayout === "side" ? "secondary" : "ghost"}
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => setChatLayout("side")}
                    title="Side-by-side layout"
                    aria-pressed={chatLayout === "side"}
                  >
                    <LayoutGrid className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="rounded-xl border border-border bg-card overflow-hidden flex-1 min-h-[400px] flex flex-col">
                <DebateChatPanel
                  messages={messages}
                  chatInput={chatInput}
                  onInputChange={setChatInput}
                  onSend={handleSendMessage}
                  sending={sending}
                  currentUserId={user?.id}
                  currentUserName={user?.name}
                  requireLogin={false}
                  variant="default"
                  scheduledAt={debate.scheduledAt}
                  onEditMessage={handleEditMessage}
                  onDeleteMessage={handleDeleteMessage}
                  showDalilAttachment
                  dalilAttachment={dalilAttachment}
                  onDalilChange={setDalilAttachment}
                  onSendVoice={handleSendVoice}
                  onTyping={hasChatAccess && id ? () => debateApi.emitTyping(id) : undefined}
                  onRecordingChange={hasChatAccess && id ? (recording) => debateApi.emitRecording(id, recording) : undefined}
                  typingUsers={typingUsers}
                  realtimeAvailable={!!process.env.NEXT_PUBLIC_PUSHER_KEY}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
