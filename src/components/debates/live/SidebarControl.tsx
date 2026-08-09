"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import { Users, Hand, MessageSquare, Shield, Check, X, Scale, BookOpen, AlertCircle, Sparkles, UserPlus, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

interface Participant {
  id: string;
  name: string;
  role: "scholar" | "moderator" | "research_assistant" | "member";
  isSpeaking?: boolean;
}

interface SidebarControlProps {
  speakers: Participant[];
  moderator: Participant;
  joiners: Participant[];
  handRaisedUsers: { userId: string; name: string }[];
  isModerator: boolean;
  clarityA: number;
  clarityB: number;
  myVote: "A" | "B" | null;
  onAdmit: (userId: string) => void;
  onDeny: (userId: string) => void;
  onDismissHand: (userId: string) => void;
  onVote: (side: "A" | "B") => void;
}

export function SidebarControl({
  speakers,
  moderator,
  joiners,
  handRaisedUsers,
  isModerator,
  clarityA,
  clarityB,
  myVote,
  onAdmit,
  onDeny,
  onDismissHand,
  onVote,
}: SidebarControlProps) {
  const totalVotes = clarityA + clarityB;
  const pctA = totalVotes ? Math.round((clarityA / totalVotes) * 100) : 50;
  const pctB = 100 - pctA;

  return (
    <div className="space-y-4 h-full flex flex-col transition-all duration-700 animate-in slide-in-from-right-4">
      
      {/* Real-time Clarity Poll */}
      <Card className="bg-gradient-to-br from-zinc-900/80 to-zinc-950/90 border-white/5 shadow-2xl overflow-hidden group">
        <CardHeader className="pb-3 border-b border-white/5 flex flex-row items-center justify-between bg-white/5">
          <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] text-primary flex items-center gap-2 font-display drop-shadow-sm">
            <Zap className="h-3 w-3 animate-pulse" />
            Clarity Consensus
          </CardTitle>
          <div className="flex items-center gap-1.5 grayscale opacity-40 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500">
             <div className="h-1 w-1 rounded-full bg-red-400" />
             <span className="text-[8px] font-bold tracking-tighter text-white">LIVE RECONCILIATION</span>
          </div>
        </CardHeader>
        <CardContent className="pt-5 space-y-5">
          <div className="space-y-4">
            <div className="flex justify-between text-[11px] font-black tracking-widest text-zinc-100 uppercase italic">
              <span className={cn("transition-all duration-500", myVote === "A" && "text-primary drop-shadow-glow")}>Position A ({pctA}%)</span>
              <span className={cn("transition-all duration-500", myVote === "B" && "text-primary drop-shadow-glow")}>Position B ({pctB}%)</span>
            </div>
            <div className="relative h-2 bg-white/5 rounded-full overflow-hidden border border-white/10 p-0.5">
               <div className="absolute inset-0 flex h-full w-full">
                  <div className="bg-primary/80 transition-all duration-1000 ease-out" style={{ width: `${pctA}%` }} />
                  <div className="bg-zinc-800 transition-all duration-1000 ease-out flex-1" />
               </div>
               <div className="absolute top-0 left-1/2 -translate-x-1/2 h-full w-px bg-white/40 z-10 opacity-30 shadow-[0_0_8px_rgba(255,255,255,0.5)]" />
            </div>
            {!myVote && (
              <div className="grid grid-cols-2 gap-2.5 pt-2">
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => onVote("A")} 
                  className="h-8 text-[9px] font-black uppercase tracking-widest bg-white/5 border-white/10 hover:bg-primary/20 hover:border-primary/40 hover:text-primary transition-all duration-300"
                >
                  Support A
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                   onClick={() => onVote("B")} 
                  className="h-8 text-[9px] font-black uppercase tracking-widest bg-white/5 border-white/10 hover:bg-primary/20 hover:border-primary/40 hover:text-primary transition-all duration-300"
                >
                  Support B
                </Button>
              </div>
            )}
            {myVote && (
              <div className="text-center py-2 bg-primary/10 rounded-xl border border-primary/20 animate-in zoom-in-95">
                <span className="text-[10px] font-black tracking-[0.1em] text-primary uppercase drop-shadow-sm flex items-center justify-center gap-1.5">
                   <Check className="h-3 w-3" />
                   Vote Registered ({myVote})
                </span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Participants & Moderation */}
      <Card className="flex-1 bg-zinc-950/60 border-white/5 flex flex-col shadow-2xl overflow-hidden backdrop-blur-xl">
        <CardHeader className="pb-3 border-b border-white/5 bg-zinc-900/40">
          <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 flex items-center gap-2 font-display">
            <Users className="h-3.5 w-3.5" />
            Active Chamber
          </CardTitle>
        </CardHeader>
        <ScrollArea className="flex-1 p-4 bg-transparent">
          <div className="space-y-6">
            
            {/* Speakers */}
            <div className="space-y-3">
              <h4 className="text-[9px] font-black text-zinc-500 uppercase tracking-[0.2em] px-1 flex items-center gap-1.5">
                  <div className="w-1 h-1 rounded-full bg-primary animate-pulse" />
                  Scholars & Debate Faculty
              </h4>
              <div className="space-y-2">
                {[moderator, ...speakers].map((s) => (
                  <div key={s.id} className={cn("flex items-center justify-between p-2.5 rounded-xl transition-all duration-300 border border-transparent hover:bg-white/5 group relative", s.isSpeaking && "bg-primary/5 border-primary/20")}>
                    {s.isSpeaking && (
                      <div className="absolute -left-1 top-1/2 -translate-y-1/2 w-0.5 h-6 bg-primary rounded-full animate-glow shadow-[0_0_8px_rgba(var(--primary),0.8)]" />
                    )}
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-full bg-zinc-800 flex items-center justify-center border border-white/10 shadow-lg relative group-hover:scale-105 transition-transform duration-300">
                        {s.role === "moderator" ? <Shield className="h-3.5 w-3.5 text-amber-500" /> : <div className="text-[10px] font-black text-zinc-500">{s.name[0]}</div>}
                        {s.isSpeaking && <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 bg-primary rounded-full border-2 border-zinc-950 animate-pulse transition-all shadow-glow" />}
                      </div>
                      <div className="space-y-0.5">
                        <div className="text-xs font-bold text-zinc-100 tracking-tight group-hover:text-primary transition-colors">{s.name}</div>
                        <div className="text-[9px] font-black uppercase tracking-widest text-zinc-500 opacity-80">{s.role}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Moderator: Hand Raises */}
            {isModerator && handRaisedUsers.length > 0 && (
              <div className="space-y-3 animate-in fade-in slide-in-from-top-2">
                <h4 className="text-[9px] font-black text-amber-500/80 uppercase tracking-[0.2em] px-1 flex items-center gap-1.5 drop-shadow-sm">
                    <Hand className="h-3.5 w-3.5" />
                    Signals for Floor
                </h4>
                <div className="space-y-1.5 px-0.5">
                  {handRaisedUsers.map((u) => (
                    <div key={u.userId} className="flex items-center justify-between p-2 rounded-xl bg-amber-500/5 border border-amber-500/10 hover:bg-amber-500/10 transition-all duration-300 group">
                      <span className="text-xs font-bold text-amber-500 tracking-tight">{u.name}</span>
                      <Button size="icon" variant="ghost" className="h-6 w-6 text-amber-500/50 hover:text-amber-500 hover:bg-amber-500/10" onClick={() => onDismissHand(u.userId)}>
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Moderator: Join Requests */}
            {isModerator && joiners.length > 0 && (
              <div className="space-y-3 animate-in fade-in slide-in-from-top-2">
                <h4 className="text-[9px] font-black text-primary uppercase tracking-[0.2em] px-1 flex items-center gap-1.5 drop-shadow-sm">
                    <UserPlus className="h-3.5 w-3.5" />
                    Admission Queue
                </h4>
                <div className="space-y-2 px-0.5">
                  {joiners.map((j) => (
                    <div key={j.id} className="flex items-center justify-between p-3 rounded-xl bg-primary/5 border border-primary/10 hover:bg-primary/10 hover:border-primary/20 transition-all duration-300 group shadow-lg shadow-primary/5">
                      <div className="flex flex-col gap-0.5">
                        <span className="text-xs font-bold text-zinc-100 tracking-tight">{j.name}</span>
                        <span className="text-[8px] font-black text-primary/60 uppercase tracking-tighter italic">Scholarship Pending</span>
                      </div>
                      <div className="flex gap-1.5">
                        <Button size="icon" variant="ghost" className="h-7 w-7 text-red-400 hover:text-red-300 hover:bg-red-400/10 rounded-full transition-all" onClick={() => onDeny(j.id)}>
                          <X className="h-3 w-3" />
                        </Button>
                        <Button size="icon" variant="ghost" className="h-7 w-7 text-emerald-400 hover:text-emerald-300 hover:bg-emerald-400/10 rounded-full transition-all" onClick={() => onAdmit(j.id)}>
                          <Check className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        </ScrollArea>
        
        {/* Real-time Indicator Footer */}
        <div className="p-3 bg-zinc-900/60 border-t border-white/5 flex items-center justify-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-500 opacity-60">Session Synchronized</span>
        </div>
      </Card>
    </div>
  );
}
