"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, Users, Clock, Video, Plus, ChevronRight, BookOpen, Mic, Award, Calendar, Flame, CheckCircle2, AlarmClock, Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { debateApi, type DebateApi } from "@/lib/api";
import { ScheduleDebateDialog } from "@/components/debates/ScheduleDebateDialog";

type ScholarDebateItem = {
  id: string;
  title: string;
  status: "live" | "upcoming" | "completed";
  participants: number;
  myRole: string;
  time: string;
  topic: string;
  duration: string;
};

function toScholarFormat(d: DebateApi): ScholarDebateItem {
  const scholarStatus =
    d.status === "live" ? ("live" as const)
    : d.status === "concluded" ? ("completed" as const)
    : ("upcoming" as const); // draft, scheduled
  const posA = d.participants.positionA?.name;
  const posB = d.participants.positionB?.name;
  const mod = d.participants.moderator?.name;
  const names = [posA, posB, mod].filter(Boolean).length;
  const scheduled = d.scheduledAt ? new Date(d.scheduledAt).toLocaleString("en-GB", { dateStyle: "short", timeStyle: "short" }) : "TBD";
  return {
    id: d.id,
    title: d.title,
    status: scholarStatus,
    participants: names || 2,
    myRole: "Panelist",
    time: scheduled,
    topic: d.topic,
    duration: `${d.duration} mins`,
  };
}

const ROLE_CONFIG: Record<string, { color: string; bg: string; icon: React.ElementType }> = {
  Moderator:  { color: "text-primary", bg: "bg-primary/10", icon: Mic },
  Panelist:   { color: "text-secondary", bg: "bg-secondary/10", icon: MessageSquare },
  Respondent: { color: "text-amber-600", bg: "bg-amber-500/10", icon: BookOpen },
};

const STATUS_CONFIG: Record<string, { label: string; dotColor: string; badgeCls: string }> = {
  live:      { label: "Live Now", dotColor: "bg-rose-500 animate-pulse", badgeCls: "bg-rose-500 text-white" },
  upcoming:  { label: "Upcoming", dotColor: "bg-amber-500", badgeCls: "bg-amber-500/15 text-amber-700 border border-amber-500/30" },
  completed: { label: "Completed", dotColor: "bg-muted-foreground", badgeCls: "bg-muted text-muted-foreground" },
};

const TABS = [
  { key: "all", label: "All", icon: MessageSquare },
  { key: "live", label: "Live", icon: Flame },
  { key: "upcoming", label: "Upcoming", icon: AlarmClock },
  { key: "completed", label: "Completed", icon: CheckCircle2 },
] as const;

export default function ScholarDebates() {
  const router = useRouter();
  const { t } = useTranslation();
  const { user } = useAuth();
  const [tab, setTab] = useState<"all" | "live" | "upcoming" | "completed">("all");
  const [showScheduleDialog, setShowScheduleDialog] = useState(false);
  const [debates, setDebates] = useState<ScholarDebateItem[]>([]);
  const [loading, setLoading] = useState(true);

  const refreshDebates = useCallback(async () => {
    setLoading(true);
    const { data, error } = await debateApi.list();
    setLoading(false);
    if (error) {
      toast.error(error);
      return;
    }
    if (data?.debates) setDebates(data.debates.map(toScholarFormat));
  }, []);

  useEffect(() => {
    refreshDebates();
  }, [refreshDebates]);

  const filtered = debates.filter(d => tab === "all" || d.status === tab);
  const liveDebate = debates.find(d => d.status === "live");

  const stats = [
    { label: "Total Debates", value: debates.length, icon: MessageSquare, color: "text-primary", bg: "bg-primary/10" },
    { label: "As Moderator", value: debates.filter(d => d.myRole === "Moderator").length, icon: Mic, color: "text-secondary", bg: "bg-secondary/10" },
    { label: "Completed", value: debates.filter(d => d.status === "completed").length, icon: Award, color: "text-emerald-600", bg: "bg-emerald-500/10" },
    { label: "Upcoming", value: debates.filter(d => d.status === "upcoming").length, icon: Calendar, color: "text-amber-600", bg: "bg-amber-500/10" },
  ];

  const handleDebateClick = (debate: ScholarDebateItem) => {
    router.push(`/debates/${debate.id}`);
  };

  return (
    <div className="space-y-7">
      <ScheduleDebateDialog
        open={showScheduleDialog}
        onOpenChange={setShowScheduleDialog}
        onSuccess={refreshDebates}
      />

      {/* Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h2 className="font-display text-2xl font-bold text-foreground">{t("subpages.debates")}</h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            {debates.filter(d => d.status === "live").length} live · {debates.filter(d => d.status === "upcoming").length} upcoming · {debates.filter(d => d.status === "completed").length} completed
          </p>
        </div>
        {user?.role === "admin" && (
          <button onClick={() => setShowScheduleDialog(true)} className="inline-flex items-center gap-2 bg-primary text-primary-foreground text-sm font-semibold px-4 py-2.5 rounded-xl hover:bg-primary/90 transition-colors shadow-sm">
            <Plus className="h-4 w-4" /> {t("subpages.scheduleDebate")}
          </button>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {stats.map(s => (
          <div key={s.label} className="bg-card border border-border rounded-2xl p-4 flex items-center gap-3">
            <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0", s.bg)}>
              <s.icon className={cn("h-5 w-5", s.color)} />
            </div>
            <div>
              <p className="text-xl font-bold text-foreground">{s.value}</p>
              <p className="text-xs text-muted-foreground leading-tight">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Live banner */}
      {liveDebate && (
        <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }}
          className="relative overflow-hidden bg-gradient-to-r from-rose-500/12 via-rose-500/6 to-transparent border border-rose-400/30 rounded-2xl p-6">
          <div className="absolute inset-0 opacity-5" style={{ backgroundImage: "radial-gradient(circle at 10% 50%, hsl(0 84% 60%) 0%, transparent 60%)" }} />
          <div className="relative flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-rose-500/15 border border-rose-400/30 flex items-center justify-center flex-shrink-0">
                <span className="w-4 h-4 rounded-full bg-rose-500 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-[10px] font-bold bg-rose-500 text-white px-2 py-0.5 rounded-full uppercase tracking-wide">🔴 {t("subpages.liveNow")}</span>
                  <span className="text-xs text-muted-foreground">{liveDebate.duration}</span>
                </div>
                <p className="font-bold text-foreground text-lg leading-tight">{liveDebate.title}</p>
                <p className="text-sm text-muted-foreground flex items-center gap-2 mt-0.5">
                  <Users className="h-3.5 w-3.5" /> {liveDebate.participants} participants · {t("subpages.youAre")} {liveDebate.myRole}
                </p>
              </div>
            </div>
            <button onClick={() => router.push(`/debates/${liveDebate.id}`)}
              className="inline-flex items-center gap-2 bg-rose-500 hover:bg-rose-600 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors shadow-md">
              <Video className="h-4 w-4" /> {t("subpages.joinRoom")}
            </button>
          </div>
        </motion.div>
      )}

      {/* Filter tabs */}
      <div className="flex gap-2 flex-wrap">
        {TABS.map(({ key, label, icon: Icon }) => (
          <button key={key} onClick={() => setTab(key)}
            className={cn(
              "flex items-center gap-1.5 text-xs font-semibold px-3.5 py-2 rounded-xl capitalize transition-all border",
              tab === key ? "bg-primary text-primary-foreground border-primary shadow-sm" : "bg-card border-border text-muted-foreground hover:text-foreground hover:bg-muted"
            )}>
            <Icon className="h-3.5 w-3.5" />{label}
            {key === "live" && <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />}
          </button>
        ))}
      </div>

      {/* Debate list */}
      <AnimatePresence mode="wait">
        <motion.div key={tab} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.18 }} className="space-y-3">
          {loading ? (
            <div className="flex items-center justify-center py-14 gap-2 text-muted-foreground">
              <Loader2 className="h-5 w-5 animate-spin" />
              <span>Loading debates...</span>
            </div>
          ) : filtered.map((d, i) => {
            const statusCfg = STATUS_CONFIG[d.status];
            const roleCfg = ROLE_CONFIG[d.myRole] ?? { color: "text-muted-foreground", bg: "bg-muted", icon: MessageSquare };
            const RoleIcon = roleCfg.icon;
            const isLive = d.status === "live";

            return (
              <motion.div key={d.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                onClick={() => handleDebateClick(d)}
                className={cn(
                  "bg-card border rounded-2xl p-5 flex items-center gap-4 hover:shadow-md transition-all cursor-pointer group",
                  isLive ? "border-rose-400/30 bg-rose-500/3" : "border-border hover:border-primary/20"
                )}>
                <div className="flex flex-col items-center gap-1 flex-shrink-0">
                  <div className={cn("w-2.5 h-2.5 rounded-full", statusCfg.dotColor)} />
                </div>
                <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0", roleCfg.bg)}>
                  <RoleIcon className={cn("h-4.5 w-4.5", roleCfg.color)} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3 mb-1.5">
                    <p className="font-semibold text-foreground text-sm leading-snug truncate group-hover:text-primary transition-colors">{d.title}</p>
                    <span className={cn("text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0 whitespace-nowrap", statusCfg.badgeCls)}>{statusCfg.label}</span>
                  </div>
                  <div className="flex items-center gap-3 flex-wrap text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {d.time}</span>
                    <span className="flex items-center gap-1"><Users className="h-3 w-3" /> {d.participants}</span>
                    <span className={cn("flex items-center gap-1 font-semibold px-2 py-0.5 rounded-lg", roleCfg.bg, roleCfg.color)}>
                      <RoleIcon className="h-2.5 w-2.5" /> {d.myRole}
                    </span>
                    <span className="text-muted-foreground/60 hidden sm:inline">{d.topic}</span>
                  </div>
                </div>
                {isLive ? (
                  <span className="text-xs font-semibold text-rose-500 flex items-center gap-1"><Video className="h-3.5 w-3.5" /> Join</span>
                ) : (
                  <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all flex-shrink-0" />
                )}
              </motion.div>
            );
          })}

          {!loading && filtered.length === 0 && (
            <div className="text-center py-14 text-muted-foreground">
              <MessageSquare className="h-10 w-10 mx-auto mb-3 opacity-30" />
              <p className="text-sm font-medium">No debates in this category.</p>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}