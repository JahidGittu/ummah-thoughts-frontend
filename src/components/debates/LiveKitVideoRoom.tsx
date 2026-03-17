"use client";

import { useState, useEffect } from "react";
import { LiveKitRoom } from "@livekit/components-react";
import "@livekit/components-styles";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { DebateVideoConference } from "./DebateVideoConference";

interface LiveKitVideoRoomProps {
  roomName: string;
  participantId: string;
  participantName: string;
  canPublish: boolean;
  onLeave?: () => void;
  /** When canPublish is false, show simplified viewer UI */
  isViewer?: boolean;
  /** Only moderator + speakers appear in video; viewers are hidden */
  participantIds: string[];
}

export function LiveKitVideoRoom({
  roomName,
  participantId,
  participantName,
  canPublish,
  onLeave,
  isViewer = false,
  participantIds,
}: LiveKitVideoRoomProps) {
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);
  const [serverUrl, setServerUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/livekit/token", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            roomName,
            participantId,
            participantName,
            canPublish,
          }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to get token");
        setToken(data.token);
        setServerUrl(data.url);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Connection failed");
      }
    })();
  }, [roomName, participantId, participantName, canPublish]);

  const handleLeave = () => {
    onLeave?.();
    router.push("/debates");
  };

  if (error) {
    return (
      <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-6 text-center">
        <p className="text-sm text-destructive">{error}</p>
        <p className="mt-2 text-xs text-muted-foreground">
          Add LIVEKIT_API_KEY, LIVEKIT_API_SECRET, LIVEKIT_URL to .env.local
        </p>
        <Button variant="outline" size="sm" className="mt-4" onClick={handleLeave}>
          <ArrowLeft className="h-4 w-4 mr-1" /> Back to Debates
        </Button>
      </div>
    );
  }

  if (!token || !serverUrl) {
    return (
      <div className="rounded-2xl border border-border bg-muted/30 p-12 flex flex-col items-center justify-center gap-4">
        <div className="w-10 h-10 rounded-full border-2 border-primary/30 border-t-primary animate-spin" />
        <p className="text-sm text-muted-foreground">Connecting to live room…</p>
      </div>
    );
  }

  return (
    <LiveKitRoom
      token={token}
      serverUrl={serverUrl}
      connect={true}
      audio={canPublish}
      video={canPublish}
      onDisconnected={handleLeave}
      data-lk-theme="default"
      style={{ height: "100%", minHeight: 400 }}
    >
      <DebateVideoConference
        participantIds={participantIds}
        onDisconnected={handleLeave}
        style={{
          height: "100%",
          minHeight: 400,
          display: "flex",
          flexDirection: "column",
        }}
      />
    </LiveKitRoom>
  );
}
