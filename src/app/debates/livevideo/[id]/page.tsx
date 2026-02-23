// app/debates/livevideo/[id]/page.tsx
"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { LiveDebateRoom } from "@/components/debates/LiveDebateRoom";
import { useAuth } from "@/contexts/AuthContext";
import { motion } from "framer-motion";

// Mock data for live video debates
const mockLiveDebates = {
  "2": {
    id: "2",
    title: "Modern Applications of Khilafah",
    titleAr: "التطبيقات المعاصرة للخلافة",
    topic: "Political Theory",
    moderator: { id: "m1", name: "Sh. Imran Hussain", role: "moderator" as const },
    speakers: [
      { id: "s1", name: "Dr. Fatima Zahra", role: "scholar" as const, isSpeaking: true },
      { id: "s2", name: "Prof. Ibrahim Khalil", role: "scholar" as const, isSpeaking: false },
    ],
    viewers: 243,
    duration: "45:12",
    currentPhase: "position_a" as const,
  },
};

export default function LiveVideoDebatePage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [inRoom, setInRoom] = useState(true);

  const debateId = params.id as string;
  const debate = mockLiveDebates[debateId as keyof typeof mockLiveDebates];

  useEffect(() => {
    setMounted(true);

    // Disable native browser scroll restoration for this page
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }

    const scrollToTop = () => {
      window.scrollTo(0, 0);
      document.documentElement.scrollTo(0, 0);
      document.body.scrollTo(0, 0);
    };

    requestAnimationFrame(() => {
      scrollToTop();
      setTimeout(scrollToTop, 50);
      setTimeout(scrollToTop, 200);
    });

    return () => {
      if ("scrollRestoration" in window.history) {
        window.history.scrollRestoration = "auto";
      }
    };
  }, []);

  if (!mounted) return null;

  if (!debate) {
    return (
      <div className="min-h-screen bg-background pt-24 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Live debate not found</h1>
          <Button onClick={() => router.push("/debates")}>← Back to Debates</Button>
        </div>
      </div>
    );
  }

  if (!inRoom) {
    router.push("/debates");
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <LiveDebateRoom
        title={debate.title}
        topic={debate.topic}
        moderator={debate.moderator}
        speakers={debate.speakers}
        viewers={debate.viewers}
        duration={debate.duration}
        currentPhase={debate.currentPhase}
        onLeave={() => setInRoom(false)}
        currentUser={user}
      />
    </motion.div>
  );
}