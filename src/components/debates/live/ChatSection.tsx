"use client";

import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send, Mic, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  userId: string;
  userName: string;
  text: string;
  timestamp: string;
  audioUrl?: string;
}

interface ChatSectionProps {
  messages: Message[];
  currentUserId: string | undefined;
  canUseChat: boolean;
  onSendMessage: (text: string) => void;
  onSendVoiceMessage?: (file: File) => void;
}

export function ChatSection({
  messages,
  currentUserId,
  canUseChat,
  onSendMessage,
}: ChatSectionProps) {
  const [text, setText] = useState("");

  const handleSend = () => {
    if (!text.trim() || !canUseChat) return;
    onSendMessage(text);
    setText("");
  };

  return (
    <div className="flex flex-col h-full bg-card/30 backdrop-blur-xl border border-white/5 rounded-2xl overflow-hidden shadow-2xl relative">
      <div className="p-4 border-b border-white/5 bg-white/5 flex items-center justify-between">
        <h3 className="font-bold text-sm tracking-tight text-white flex items-center gap-2 uppercase tracking-widest text-[10px] opacity-80 font-display">
          <Sparkles className="h-3 w-3 text-primary animate-pulse" />
          Live Community
        </h3>
        <span className="text-[10px] text-muted-foreground font-mono bg-black/20 px-2 py-0.5 rounded-full border border-white/5">{messages.length} messages</span>
      </div>
      
      <ScrollArea className="flex-1 p-4 space-y-4">
        <div className="space-y-4 pb-4">
          {messages.map((msg) => (
            <div key={msg.id} className={cn("flex flex-col gap-1.5 transition-all duration-300 hover:translate-x-1", msg.userId === currentUserId && "items-end")}>
              <div className="flex items-center gap-2 px-1">
                <span className="text-[10px] font-bold text-muted-foreground/80 uppercase tracking-tighter">{msg.userName}</span>
                <span className="text-[9px] text-muted-foreground/40">{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              </div>
              <div className={cn(
                "max-w-[85%] px-4 py-2.5 rounded-2xl text-sm shadow-sm relative group transition-all",
                msg.userId === currentUserId 
                  ? "bg-primary text-primary-foreground rounded-tr-none ring-1 ring-white/10" 
                  : "bg-white/10 backdrop-blur-md text-white border border-white/5 rounded-tl-none hover:bg-white/[0.15]"
              )}>
                {msg.text}
              </div>
            </div>
          ))}
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full py-10 opacity-30">
               <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mb-4">
                  <Send className="h-6 w-6" />
               </div>
               <p className="text-xs font-semibold tracking-widest uppercase">Start the conversation</p>
            </div>
          )}
        </div>
      </ScrollArea>

      <div className="p-4 bg-white/5 border-t border-white/5 backdrop-blur-md">
        <div className="relative group">
          <Input
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder={canUseChat ? "Type your message..." : "Chat locked for viewers"}
            disabled={!canUseChat}
            className="pr-20 py-6 bg-black/40 border-white/10 focus-visible:ring-primary/40 focus-visible:border-primary/40 transition-all rounded-xl placeholder:text-muted-foreground/40"
          />
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
            <Button size="icon" variant="ghost" className="h-8 w-8 text-muted-foreground hover:text-white transition-colors" disabled={!canUseChat}>
              <Mic className="h-4 w-4" />
            </Button>
            <Button size="sm" onClick={handleSend} disabled={!text.trim() || !canUseChat} className="h-8 px-3.5 bg-primary/90 hover:bg-primary border-none shadow-lg shadow-primary/20">
              <Send className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
