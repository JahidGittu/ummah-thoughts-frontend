// components/debates/DebateCard.tsx
"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, Clock, BookOpen, MessageSquare, Video, Calendar, ArrowRight, Bookmark, ThumbsUp, Swords } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface DebateCardProps {
  id: string;
  title: string;
  titleAr?: string;
  status: "upcoming" | "active" | "concluded";
  format: "async" | "live";
  topic: string;
  participants: {
    positionA: { name: string; role: string };
    positionB: { name: string; role: string };
  };
  scheduledDate?: string;
  duration?: string;
  votesClarity?: number;
  bookmarks?: number;
  onView?: () => void;
}

const statusConfig = {
  upcoming:  { label: "Upcoming",    dot: "bg-amber-500",   bar: "from-amber-400 to-orange-400",     badge: "bg-amber-500/10 text-amber-600 border-amber-500/20" },
  active:    { label: "Active",      dot: "bg-emerald-500", bar: "from-primary to-emerald-400",      badge: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" },
  concluded: { label: "Concluded",   dot: "bg-muted-foreground", bar: "from-muted to-muted",         badge: "bg-muted text-muted-foreground border-border" },
};

export const DebateCard = ({
  id,
  title,
  titleAr,
  status,
  format,
  topic,
  participants,
  scheduledDate,
  duration,
  votesClarity = 0,
  bookmarks = 0,
  onView,
}: DebateCardProps) => {
  const [saved, setSaved] = useState(false);
  const FormatIcon = format === "async" ? MessageSquare : Video;
  const cfg = statusConfig[status];
  const isLive = status === "active" && format === "live";

  const getButtonText = () => {
    if (status === "active" && format === "live") return "Join Live Debate";
    if (status === "active" && format === "async") return "Read Debate";
    if (status === "upcoming") return "View Details & RSVP";
    return "Read Full Debate";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        "group relative rounded-3xl border bg-card overflow-hidden cursor-pointer transition-all duration-300",
        "hover:-translate-y-1 hover:shadow-[0_12px_40px_-8px_hsl(var(--primary)/0.18)]",
        isLive ? "border-emerald-500/30 shadow-[0_0_0_1px_hsl(142_76%_36%/0.12)]" : "border-border hover:border-primary/25"
      )}
      onClick={onView}
    >
      <div className={cn("h-1.5 w-full bg-gradient-to-r", cfg.bar)} />

      {isLive && (
        <div className="absolute top-4 right-4 flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/25 text-emerald-700 text-[10px] font-bold px-2.5 py-1 rounded-full z-10">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          LIVE
        </div>
      )}

      <div className="p-6 space-y-5">
        <div className="flex items-center gap-2 flex-wrap pr-16">
          <span className={cn("text-[10px] font-bold px-2.5 py-1 rounded-full border", cfg.badge)}>
            {cfg.label}
          </span>
          <span className="flex items-center gap-1 text-[10px] font-semibold text-muted-foreground bg-muted px-2.5 py-1 rounded-full border border-border">
            <FormatIcon className="h-3 w-3" />
            {format === "async" ? "Written" : "Live Session"}
          </span>
          <span className="flex items-center gap-1 text-[10px] font-semibold text-muted-foreground bg-muted/50 px-2.5 py-1 rounded-full">
            <BookOpen className="h-3 w-3" /> {topic}
          </span>
        </div>

        <div className="space-y-1.5">
          <h3 className="text-lg font-bold text-foreground leading-snug group-hover:text-primary transition-colors duration-200 line-clamp-2">
            {title}
          </h3>
          {titleAr && (
            <p className="text-sm font-amiri text-muted-foreground/80" dir="rtl">{titleAr}</p>
          )}
        </div>

        <div className="relative flex items-stretch gap-0 rounded-2xl overflow-hidden border border-border">
          <div className="flex-1 bg-primary/5 px-4 py-3 space-y-0.5">
            <p className="text-[10px] font-bold uppercase tracking-widest text-primary">Position A</p>
            <p className="text-sm font-semibold text-foreground leading-tight line-clamp-1">{participants.positionA.name}</p>
            <p className="text-[11px] text-muted-foreground">{participants.positionA.role}</p>
          </div>
          <div className="flex items-center justify-center w-9 bg-muted flex-shrink-0">
            <Swords className="h-3.5 w-3.5 text-muted-foreground" />
          </div>
          <div className="flex-1 bg-secondary/5 px-4 py-3 space-y-0.5 text-right">
            <p className="text-[10px] font-bold uppercase tracking-widest text-secondary">Position B</p>
            <p className="text-sm font-semibold text-foreground leading-tight line-clamp-1">{participants.positionB.name}</p>
            <p className="text-[11px] text-muted-foreground">{participants.positionB.role}</p>
          </div>
        </div>

        <div className="flex items-center justify-between text-[11px] text-muted-foreground">
          <div className="flex items-center gap-3">
            {scheduledDate && (
              <span className="flex items-center gap-1">
                <Calendar className="h-3 w-3" /> {scheduledDate}
              </span>
            )}
            {duration && (
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" /> {duration}
              </span>
            )}
          </div>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <ThumbsUp className="h-3 w-3" /> {votesClarity}
            </span>
            <button
              onClick={e => { e.stopPropagation(); setSaved(v => !v); }}
              className={cn("flex items-center gap-1 transition-colors", saved ? "text-primary" : "hover:text-primary")}
            >
              <Bookmark className={cn("h-3 w-3", saved && "fill-current")} /> {bookmarks + (saved ? 1 : 0)}
            </button>
          </div>
        </div>

        <Button
          className={cn(
            "w-full rounded-xl font-semibold text-sm gap-2 transition-all",
            isLive
              ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm"
              : status === "upcoming"
                ? "bg-primary hover:bg-primary/90 text-primary-foreground"
                : "variant-outline"
          )}
          variant={status === "concluded" ? "outline" : "default"}
          onClick={(e) => { e.stopPropagation(); onView?.(); }}
        >
          {getButtonText()}
          <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
        </Button>
      </div>
    </motion.div>
  );
};