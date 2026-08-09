import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface PhaseTimerProps {
  phases: readonly string[];
  phaseConfig: Record<string, { label: string; icon: React.ElementType; duration: number }>;
  currentPhaseName: string;
  activePhaseIdx: number;
  isRunning: boolean;
  debatePaused: boolean;
  phaseTimeLeft: number;
  phaseProgress: number;
  formatTime: (s: number) => string;
}

export function PhaseTimer({
  phases,
  phaseConfig,
  currentPhaseName,
  activePhaseIdx,
  isRunning,
  debatePaused,
  phaseTimeLeft,
  phaseProgress,
  formatTime,
}: PhaseTimerProps) {
  const PhaseIcon = phaseConfig[currentPhaseName]?.icon || CheckCircle;

  return (
    <Card className="bg-primary/5 border-primary/20">
      <CardContent className="py-3">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <PhaseIcon className="h-4 w-4 text-primary" />
            <span className="text-sm font-semibold">{phaseConfig[currentPhaseName]?.label || "Phase"}</span>
            <Badge className="bg-primary/20 text-primary text-xs">
              {isRunning || debatePaused ? formatTime(phaseTimeLeft) : "--:--"}
            </Badge>
            {debatePaused && <Badge className="bg-amber-500/20 text-amber-600 text-xs">Paused</Badge>}
          </div>
          <span className="text-xs text-muted-foreground">
            Phase {activePhaseIdx + 1}/{phases.length}
          </span>
        </div>
        <div className="flex items-center gap-0 mb-2">
          {phases.map((phase, idx) => {
            const isActive = idx === activePhaseIdx;
            const isDone = idx < activePhaseIdx;
            return (
              <div key={phase} className="flex items-center flex-1">
                <div className="relative flex flex-col items-center">
                  <div
                    className={cn(
                      "w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold border-2 transition-all",
                      isActive
                        ? "bg-primary text-primary-foreground border-primary scale-110 shadow-md shadow-primary/30"
                        : isDone
                        ? "bg-primary/20 text-primary border-primary/40"
                        : "bg-muted text-muted-foreground border-border"
                    )}
                  >
                    {isDone ? <CheckCircle className="w-3 h-3" /> : idx + 1}
                  </div>
                  <span
                    className={cn(
                      "text-[8px] mt-0.5 hidden sm:block whitespace-nowrap",
                      isActive ? "text-primary font-semibold" : "text-muted-foreground"
                    )}
                  >
                    {phaseConfig[phase]?.label}
                  </span>
                </div>
                {idx < phases.length - 1 && (
                  <div className={cn("h-0.5 flex-1 mx-0.5", isDone ? "bg-primary/40" : "bg-border")} />
                )}
              </div>
            );
          })}
        </div>
        <Progress value={isRunning || debatePaused ? phaseProgress : 0} className="h-1" />
      </CardContent>
    </Card>
  );
}
