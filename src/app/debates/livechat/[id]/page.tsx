// app/debates/livechat/[id]/page.tsx
"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { DebatePanel } from "@/components/debates/DebatePanel";
import { motion } from "framer-motion";
import { getDebateById } from "@/lib/debateStorage";

// Mock data for text-based debates
const mockTextDebates = {
  "1": {
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
    agreementPoints: [
      "Shura (consultation) is obligatory for the Muslim ruler",
      "The practice of the Rashidun Caliphs serves as a model",
      "Shura promotes justice and prevents tyranny",
      "The Ummah has a right to participate in governance"
    ],
    disagreementPoints: [
      "Whether the outcome of Shura legally binds the ruler",
      "The scope of issues requiring mandatory consultation",
      "Whether modern parliamentary systems fulfill Shura requirements"
    ],
    clarityVotes: { positionA: 73, positionB: 54 },
  },
  "3": {
    title: "Conditions for Valid Bay'ah",
    titleAr: "شروط البيعة الصحيحة",
    topic: "Fiqh al-Siyasah",
    status: "concluded" as const,
    positionA: {
      scholar: { name: "Sh. Abdullah Farooq", title: "Senior Scholar" },
      position: "Bay'ah requires consensus of Ahl al-Hall wal-'Aqd",
      summary: "The classical position requires the agreement of the people who loosen and bind (ahl al-hall wal-'aqd) as representatives of the community.",
      evidence: [
        { type: "scholarly" as const, reference: "Al-Mawardi", translation: "The contract of imamate is concluded by the people who loosen and bind" },
      ],
      methodology: "Classical fiqh methodology",
    },
    positionB: {
      scholar: { name: "Dr. Maryam Hassan", title: "Researcher" },
      position: "Bay'ah requires direct public consent",
      summary: "In modern contexts, bay'ah should involve direct or representative consent of the entire Ummah.",
      evidence: [
        { type: "scholarly" as const, reference: "Modern scholarship", translation: "The spirit of bay'ah requires public participation" },
      ],
      methodology: "Contemporary usul al-fiqh",
    },
    agreementPoints: ["Bay'ah is essential for legitimate leadership", "Consent of the governed is required"],
    disagreementPoints: ["Who constitutes Ahl al-Hall wal-'Aqd", "Whether bay'ah can be implied"],
    clarityVotes: { positionA: 45, positionB: 38 },
  },
};

export default function LiveChatDebatePage() {
  const params = useParams();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  const debateId = params.id as string;
  const mockDebate = mockTextDebates[debateId as keyof typeof mockTextDebates];
  const storedDebate = getDebateById(debateId);

  // Use mock if available, else build minimal debate from storage
  const debate = mockDebate ?? (storedDebate ? {
    title: storedDebate.title,
    titleAr: storedDebate.titleAr,
    topic: storedDebate.topic,
    status: storedDebate.status === "concluded" ? "concluded" as const : "active" as const,
    positionA: {
      scholar: { name: storedDebate.participants.positionA.name, title: storedDebate.participants.positionA.role },
      position: "Position statement to be added.",
      summary: "This debate is scheduled. Full content will be available once the scholars complete their submissions.",
      evidence: [],
      methodology: "To be determined",
    },
    positionB: {
      scholar: { name: storedDebate.participants.positionB.name, title: storedDebate.participants.positionB.role },
      position: "Position statement to be added.",
      summary: "This debate is scheduled. Full content will be available once the scholars complete their submissions.",
      evidence: [],
      methodology: "To be determined",
    },
    agreementPoints: ["Debate in progress"],
    disagreementPoints: ["Positions to be presented"],
    clarityVotes: { positionA: storedDebate.votesClarity ?? 0, positionB: Math.floor((storedDebate.votesClarity ?? 0) / 2) },
  } : null);

  useEffect(() => {
    setMounted(true);

    // Disable browser scroll restoration to prevent auto-scroll
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }

    const scrollToTop = () => {
      // Scroll all relevant elements to top
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    };

    // Scroll to top immediately and multiple times to ensure it sticks
    scrollToTop();
    const timer1 = setTimeout(scrollToTop, 0);
    const timer2 = setTimeout(scrollToTop, 50);
    const timer3 = setTimeout(scrollToTop, 100);

    return () => {
      // Clear timers
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, []);

  if (!mounted) return null;

  if (!debate) {
    return (
      <div className="min-h-screen bg-background pt-24 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Debate not found</h1>
          <Button onClick={() => router.push("/debates")}>← Back to Debates</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="pt-20 pb-24 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <Button
              variant="ghost"
              onClick={() => router.push("/debates")}
              className="mb-6 hover:bg-primary/10"
            >
              ← Back to Debates
            </Button>
            <DebatePanel {...debate} />
          </motion.div>
        </div>
      </main>
    </div>
  );
}