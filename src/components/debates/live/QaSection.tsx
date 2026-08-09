"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ThumbsUp, Send, CheckCircle2, MessageSquare, Sparkles, Scale, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import { QueuedQuestion } from "../LiveDebateRoom";

interface QaSectionProps {
  questions: QueuedQuestion[];
  canUseQa: boolean;
  isParticipant: boolean;
  onUpvote: (id: string) => void;
  onSubmitQuestion: (text: string) => void;
  onAnswerQuestion: (id: string, answer: string) => void;
}

export function QaSection({
  questions,
  canUseQa,
  isParticipant,
  onUpvote,
  onSubmitQuestion,
  onAnswerQuestion,
}: QaSectionProps) {
  const [newQuestion, setNewQuestion] = useState("");
  const [answeringId, setAnsweringId] = useState<string | null>(null);
  const [answerText, setAnswerText] = useState("");

  const handleSubmit = () => {
    if (!newQuestion.trim() || !canUseQa) return;
    onSubmitQuestion(newQuestion.trim());
    setNewQuestion("");
  };

  const handleAnswerSubmit = (id: string) => {
    if (!answerText.trim() || !isParticipant) return;
    onAnswerQuestion(id, answerText.trim());
    setAnsweringId(null);
    setAnswerText("");
  };

  const sortedQuestions = [...questions].sort((a, b) => b.upvotes - a.upvotes);

  return (
    <div className="flex flex-col h-full bg-slate-900/40 backdrop-blur-2xl border border-white/5 rounded-2xl overflow-hidden shadow-2xl transition-all duration-500">
      <div className="p-5 border-b border-white/5 bg-white/5 flex items-center justify-between">
         <div className="flex flex-col">
            <h3 className="font-bold text-xs uppercase tracking-widest text-primary flex items-center gap-2 font-display">
                <Scale className="h-3.5 w-3.5" />
                Scholarly Q&A
            </h3>
            <p className="text-[10px] text-muted-foreground font-medium mt-0.5 tracking-tight opacity-60 italic">Direct dialogue with participants</p>
         </div>
         <Badge variant="outline" className="text-[10px] bg-primary/10 text-primary border-primary/20 font-bold px-2.5 py-0.5 rounded-full shadow-lg shadow-primary/5">
            {questions.length} ACTIVE
         </Badge>
      </div>

      <ScrollArea className="flex-1 p-5">
        <div className="space-y-4 pb-4">
          {sortedQuestions.map((q) => (
            <Card key={q.id} className={cn("bg-white/5 border-white/10 overflow-hidden group transition-all duration-300 hover:bg-white/[0.08] hover:border-primary/20 hover:shadow-xl hover:shadow-primary/5", q.approved && "border-l-4 border-l-primary")}>
              <CardContent className="p-4 space-y-3">
                <div className="flex justify-between items-start gap-4">
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-bold text-primary/80 uppercase tracking-tighter">{q.user}</span>
                      <span className="text-[9px] text-muted-foreground/40 font-mono italic opacity-0 group-hover:opacity-100 transition-opacity">#{q.id.slice(0, 4)}</span>
                    </div>
                    <p className="text-sm font-medium leading-relaxed text-slate-100 drop-shadow-sm">{q.text}</p>
                  </div>
                   <Button
                    size="sm"
                    variant={q.upvotedByMe ? "default" : "outline"}
                    className={cn(
                      "h-10 px-3 flex flex-col gap-0 shadow-sm transition-all duration-300 transform",
                      q.upvotedByMe 
                        ? "bg-primary border-primary hover:bg-primary/90 scale-105 shadow-primary/20 ring-2 ring-primary/20" 
                        : "bg-black/20 hover:bg-primary/20 border-white/10",
                      !canUseQa && "opacity-50 cursor-not-allowed"
                    )}
                    onClick={() => canUseQa && onUpvote(q.id)}
                    disabled={!canUseQa || q.upvotedByMe}
                  >
                    <ThumbsUp className={cn("h-3.5 w-3.5 transition-all", q.upvotedByMe ? "animate-pulse fill-current text-white" : "text-primary/60")} />
                    <span className={cn("text-[11px] font-black mt-0.5", q.upvotedByMe ? "text-white" : "text-primary/80")}>
                      {q.upvotes}
                    </span>
                    {q.upvotedByMe && (
                      <span className="absolute -top-1 -right-1 flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                      </span>
                    )}
                  </Button>
                </div>

                {q.approved && (
                  <div className="mt-4 flex items-center gap-2 p-2.5 bg-primary/10 rounded-xl border border-primary/20 animate-in fade-in slide-in-from-top-2">
                    <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                    <span className="text-[11px] font-black uppercase text-primary tracking-widest drop-shadow-sm">Approved for response</span>
                  </div>
                )}

                {isParticipant && q.approved && answeringId !== q.id && (
                  <Button
                    size="sm"
                    variant="ghost"
                    className="w-full h-8 text-[10px] font-bold uppercase tracking-widest text-primary/70 hover:text-primary hover:bg-primary/5 border border-dashed border-white/10 hover:border-primary/30 mt-2 transition-all"
                    onClick={() => setAnsweringId(q.id)}
                  >
                    Submit Response
                  </Button>
                )}

                {answeringId === q.id && (
                  <div className="mt-4 space-y-2 p-3 bg-primary/5 rounded-xl border border-primary/20 animate-in zoom-in-95">
                    <textarea
                      value={answerText}
                      onChange={(e) => setAnswerText(e.target.value)}
                      placeholder="Type your scholarly response..."
                      className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-xs min-h-[80px] focus:outline-none focus:border-primary/50 transition-all placeholder:text-muted-foreground/30 font-medium"
                    />
                    <div className="flex gap-2 justify-end">
                      <Button size="sm" variant="ghost" onClick={() => setAnsweringId(null)} className="h-8 text-[10px] font-bold uppercase tracking-widest text-muted-foreground hover:bg-white/5">Cancel</Button>
                      <Button size="sm" onClick={() => handleAnswerSubmit(q.id)} disabled={!answerText.trim()} className="h-8 text-[10px] font-bold uppercase tracking-widest px-4 bg-primary shadow-lg shadow-primary/20">Publish</Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}

          {questions.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 px-6 text-center space-y-4 opacity-50 transition-opacity hover:opacity-80">
              <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center border border-white/10 shadow-inner">
                <MessageSquare className="h-7 w-7 text-primary/40" />
              </div>
              <div className="space-y-1">
                 <h4 className="text-xs font-black uppercase tracking-widest text-white">No Questions Queue</h4>
                 <p className="text-[10px] text-muted-foreground font-medium max-w-[200px] leading-relaxed">Be the first to engage with the scholars. All submissions are moderated.</p>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      <div className="p-5 bg-black/40 border-t border-white/5 backdrop-blur-xl relative group">
        <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent opacity-0 group-focus-within:opacity-100 transition-opacity" />
        <div className="flex gap-2">
          <div className="relative flex-1 group">
            <Input
              value={newQuestion}
              onChange={(e) => setNewQuestion(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              placeholder={canUseQa ? "Submit a scholarly question..." : "Login to participate"}
              disabled={!canUseQa}
              className="h-12 bg-white/5 border-white/10 focus-visible:ring-primary/40 focus-visible:bg-white/[0.08] transition-all rounded-xl pr-12 text-sm placeholder:text-muted-foreground/30 font-medium"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Info className="h-3.5 w-3.5 text-muted-foreground/40" />
            </div>
          </div>
          <Button 
            onClick={handleSubmit} 
            disabled={!newQuestion.trim() || !canUseQa} 
            className="h-12 w-12 rounded-xl bg-primary hover:bg-primary/90 shadow-xl shadow-primary/10 border-none transition-all hover:scale-105 active:scale-95"
          >
            <Send className="h-4 w-4 drop-shadow-sm" />
          </Button>
        </div>
        <p className="text-[9px] text-zinc-500 mt-2.5 font-bold uppercase tracking-widest flex items-center justify-center gap-1.5 opacity-50">
            <Sparkles className="h-2.5 w-2.5" />
            Moderated Submission Queue
        </p>
      </div>
    </div>
  );
}
