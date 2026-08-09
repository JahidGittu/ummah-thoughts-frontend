"use client";

import { Badge } from "@/components/ui/badge";
import { Users, Radio } from "lucide-react";
import { cn } from "@/lib/utils";

interface LiveDebateHeaderProps {
  title: string;
  topic: string;
  viewers: number;
  statusLabel: string;
  statusClass: string;
}

export function LiveDebateHeader({
  title,
  topic,
  viewers,
  statusLabel,
  statusClass,
}: LiveDebateHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-card/50 backdrop-blur-sm p-4 rounded-xl border border-border/50 shadow-sm transition-all duration-300">
      <div className="space-y-1">
        <div className="flex items-center gap-3">
          <Badge variant="outline" className={cn("px-2 py-0.5 font-bold tracking-wider text-[10px]", statusClass)}>
            {statusLabel === "LIVE" && <Radio className="h-2.5 w-2.5 mr-1 animate-pulse" />}
            {statusLabel}
          </Badge>
          <h1 className="text-xl font-bold font-display tracking-tight text-foreground">{title}</h1>
        </div>
        <p className="text-sm text-muted-foreground font-medium flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-primary/40" />
          {topic}
        </p>
      </div>
      
      <div className="flex items-center gap-3 bg-background/40 px-3 py-1.5 rounded-full border border-border/40 shadow-inner">
        <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
          <div className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
          </div>
          <Users className="h-4 w-4" />
          <span>{viewers.toLocaleString()} <span className="font-normal text-[10px] uppercase tracking-widest ml-0.5 opacity-70">Watching</span></span>
        </div>
      </div>
    </div>
  );
}
