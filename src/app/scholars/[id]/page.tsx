"use client";

import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import {
  Users, BookOpen, MessageSquare, Video,
  FileText, Headphones, ExternalLink, Mail, Globe,
  Award, Quote, ArrowLeft, GitBranch, Shield
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScholarMethodologyTag, ScholarDisclaimer } from "@/components/shared/ScholarMethodologyTag";
import Link from "next/link";
import { userApi } from "@/lib/api";
import { useParams } from "next/navigation";

interface ScholarDetailed {
  id: string;
  nameEn: string;
  nameBn: string;
  specializationEn: string;
  specializationBn: string;
  bioEn: string;
  bioBn: string;
  currentPositionEn: string;
  currentPositionBn: string;
  citationCount: number;
  discussionCount: number;
  researchAreas: { en: string; bn: string }[];
  publications: { titleEn: string; titleBn: string; year: number }[];
  featuredIn: { topicEn: string; topicBn: string; count: number }[];
  media: { type: "video" | "audio" | "pdf"; titleEn: string; titleBn: string }[];
  contact?: { email?: string; website?: string };
  methodology: ("salafi" | "maqasid" | "fiqh-awlawiyyat" | "traditional" | "contemporary")[];
  influences?: { en: string; bn: string }[];
}

export default function ScholarDetailPage() {
  const { t, i18n } = useTranslation();
  const isBengali = i18n.language === "bn";
  const params = useParams();
  const scholarId = params?.id as string;
  
  const [scholar, setScholar] = useState<ScholarDetailed | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!scholarId) return;
    
    // Fetch from API and merge with mock detailed data
    userApi.getScholars().then(({ data }) => {
      const apiUser = data?.scholars?.find(s => s.id === scholarId || s.name.toLowerCase().includes(scholarId.toLowerCase()));
      
      // We simulate detailed data mapping here
      setScholar({
        id: apiUser?.id || scholarId,
        nameEn: apiUser?.name || "Scholar Name",
        nameBn: apiUser?.name || "Scholar Name",
        specializationEn: apiUser?.specialization || "Islamic Scholar",
        specializationBn: apiUser?.specialization || "ইসলামী পণ্ডিত",
        bioEn: "Detailed biography of the scholar...",
        bioBn: "পণ্ডিতের বিস্তারিত জীবনী...",
        currentPositionEn: "Scholar",
        currentPositionBn: "পণ্ডিত",
        citationCount: Math.floor(Math.random() * 500) + 10,
        discussionCount: Math.floor(Math.random() * 100) + 5,
        researchAreas: [{ en: "Islamic Studies", bn: "ইসলামিক স্টাডিজ" }],
        publications: [],
        featuredIn: [],
        media: [],
        methodology: ["traditional"],
        influences: []
      });
      setLoading(false);
    });
  }, [scholarId]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!scholar) {
    return <div className="min-h-screen flex items-center justify-center">Scholar not found</div>;
  }

  return (
    <div className="min-h-screen bg-background py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link href="/scholars">
          <Button variant="ghost" className="mb-6 gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Scholars
          </Button>
        </Link>
        
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card rounded-2xl border border-border overflow-hidden"
        >
            {/* Profile Header */}
            <div className="p-8 md:p-12 relative overflow-hidden bg-linear-to-br from-primary/10 via-background to-secondary/10 border-b border-border shadow-inner">
                {/* Decorative background element */}
                <div className="absolute -right-20 -top-20 w-80 h-80 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute -left-20 -bottom-20 w-80 h-80 bg-secondary/5 rounded-full blur-3xl pointer-events-none" />

                <div className="relative flex flex-col md:flex-row items-center md:items-start gap-8">
                    <div className="w-40 h-40 rounded-3xl bg-linear-to-br from-primary/20 to-secondary/20 flex items-center justify-center flex-shrink-0 shadow-2xl border border-primary/20 rotate-1 md:rotate-3">
                        <span className="text-7xl font-display font-bold text-primary drop-shadow-sm">
                            {(isBengali ? scholar.nameBn : scholar.nameEn).charAt(0)}
                        </span>
                    </div>
                    <div className="flex-1 text-center md:text-left space-y-4">
                        <div>
                            <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground tracking-tight leading-tight">
                                {isBengali ? scholar.nameBn : scholar.nameEn}
                            </h2>
                            <div className="flex flex-wrap justify-center md:justify-start items-center gap-2 mt-3">
                                <Badge variant="default" className="bg-primary/20 text-primary hover:bg-primary/30 border-primary/20 text-xs font-bold uppercase tracking-wider px-3 py-1">
                                    <Shield className="w-3 h-3 mr-1.5" />
                                    {isBengali ? scholar.specializationBn : scholar.specializationEn}
                                </Badge>
                                <Badge variant="outline" className="text-xs font-medium px-3 py-1 border-border/60">
                                    {isBengali ? scholar.currentPositionBn : scholar.currentPositionEn}
                                </Badge>
                            </div>
                        </div>

                        <div className="flex flex-wrap justify-center md:justify-start items-center gap-6 py-2">
                            <div className="group flex items-center gap-2.5">
                                <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center group-hover:bg-orange-500/20 transition-colors">
                                    <Award className="h-5 w-5 text-orange-600" />
                                </div>
                                <div>
                                    <p className="text-xl font-bold text-foreground leading-none">{scholar.citationCount.toLocaleString()}</p>
                                    <p className="text-xs text-muted-foreground mt-1">{t('scholars.timesCited', 'Times Cited')}</p>
                                </div>
                            </div>
                            <div className="group flex items-center gap-2.5">
                                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                                    <MessageSquare className="h-5 w-5 text-primary" />
                                </div>
                                <div>
                                    <p className="text-xl font-bold text-foreground leading-none">{scholar.discussionCount.toLocaleString()}</p>
                                    <p className="text-xs text-muted-foreground mt-1">{t('scholars.discussions', 'Discussions')}</p>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-wrap justify-center md:justify-start gap-2 pt-2">
                            {scholar.methodology.map(m => (
                                <Badge key={m} variant="secondary" className="bg-muted hover:bg-muted-foreground/10 text-[11px] font-semibold text-muted-foreground transition-colors">
                                    <GitBranch className="w-3 h-3 mr-1" />
                                    {m}
                                </Badge>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Profile Content */}
            <div className="p-8 space-y-8">
            <div>
                <h3 className="font-display font-semibold text-foreground mb-3">
                {t('scholars.biography', 'Biography')}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                {isBengali ? scholar.bioBn : scholar.bioEn}
                </p>
            </div>
            </div>
        </motion.div>
      </div>
    </div>
  );
}
