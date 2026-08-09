"use client";

import { Card } from "@/components/ui/card";
import { LiveKitRoom } from "@livekit/components-react";
import { DebateVideoConference } from "@/components/debates/DebateVideoConference";
import { LiveKitEffectHandler } from "@/components/debates/LiveKitEffectHandler";
import { cn } from "@/lib/utils";
import { AlertTriangle, Radio } from "lucide-react";
import { Button } from "@/components/ui/button";

interface VideoStageProps {
  useLiveKit: boolean;
  liveKitToken: string | null;
  liveKitServerUrl: string | null;
  liveKitError: string | null;
  debateId: string | undefined;
  youtubeLiveUrl: string | undefined;
  isParticipant: boolean;
  myMuted: boolean;
  myVideoOff: boolean;
  cameraEffect: string;
  onLiveKitLeave: () => void;
  extractYoutubeVideoId: (url: string) => string | null;
  participantIds: string[];
}

export function VideoStage({
  useLiveKit,
  liveKitToken,
  liveKitServerUrl,
  liveKitError,
  debateId,
  youtubeLiveUrl,
  isParticipant,
  myMuted,
  myVideoOff,
  cameraEffect,
  onLiveKitLeave,
  extractYoutubeVideoId,
  participantIds,
}: VideoStageProps) {
  const youtubeId = youtubeLiveUrl ? extractYoutubeVideoId(youtubeLiveUrl) : null;

  return (
    <Card className="relative overflow-hidden border border-border/50 shadow-2xl bg-black rounded-2xl group transition-all duration-500 hover:shadow-primary/5">
      <div className="aspect-video w-full relative">
        {useLiveKit && liveKitToken ? (
          <LiveKitRoom
            token={liveKitToken}
            serverUrl={liveKitServerUrl || undefined}
            connect={true}
            audio={!myMuted}
            video={!myVideoOff}
            className="h-full w-full"
            onDisconnected={onLiveKitLeave}
          >
            <DebateVideoConference participantIds={participantIds} showMediaControls={isParticipant} />
            <LiveKitEffectHandler effectId={cameraEffect} />
          </LiveKitRoom>
        ) : youtubeId ? (
          <div className="relative w-full h-full pt-[56.25%]">
            <iframe
              className="absolute top-0 left-0 w-full h-full"
              src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1&mute=0&rel=0&showinfo=0&modestbranding=1`}
              title="YouTube Live Stream"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
            {/* Custom Overlay for premium look */}
            <div className="absolute top-4 left-4 z-10">
              <Badge className="bg-red-600/90 hover:bg-red-600 animate-pulse border-none px-2 py-1 flex items-center gap-1.5 shadow-lg shadow-red-600/20 backdrop-blur-md">
                <Radio className="h-3 w-3" />
                <span className="text-[10px] uppercase font-black tracking-tighter">Youtube Live</span>
              </Badge>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full space-y-6 bg-gradient-to-br from-zinc-900 to-black p-8 text-center relative">
            {/* Visual background pattern */}
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-from)_0%,_transparent_70%)] from-primary" />
            
            <div className="relative">
              <div className="absolute -inset-4 bg-primary/20 blur-2xl rounded-full" />
              <AlertTriangle className="h-20 w-20 text-primary/40 relative z-10 drop-shadow-glow" />
            </div>
            
            <div className="space-y-3 relative z-10 max-w-sm">
              <h3 className="text-2xl font-bold text-white font-display tracking-tight">No Active Stream</h3>
              <p className="text-zinc-400 text-sm leading-relaxed">
                The debate hasn't started its video broadcast yet. Please wait for the moderator to go live.
              </p>
            </div>
            
            {liveKitError && (
              <p className="text-red-400 text-xs font-medium px-4 py-2 bg-red-400/10 rounded-lg border border-red-500/20 max-w-md">
                Protocol Error: {liveKitError}
              </p>
            )}
          </div>
        )}
      </div>
    </Card>
  );
}

function Badge({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2", className)}>
      {children}
    </div>
  );
}
