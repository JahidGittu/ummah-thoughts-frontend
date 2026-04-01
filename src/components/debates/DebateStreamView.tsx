"use client";

/**
 * Dedicated stream-only view for OBS/YouTube Live capture.
 * Full viewport, no scroll, no controls - only the video grid.
 * Moderator opens this in a separate tab for OBS Browser Source.
 */
import { useState, useEffect } from "react";
import { LiveKitRoom } from "@livekit/components-react";
import "@livekit/components-styles";
import { RoomEvent, Track } from "livekit-client";
import {
  ConnectionStateToast,
  GridLayout,
  ParticipantTile,
  RoomAudioRenderer,
  useTracks,
} from "@livekit/components-react";
import type { TrackReferenceOrPlaceholder } from "@livekit/components-core";

function extractYouTubeVideoId(url: string): string | null {
  if (!url) return null;
  const m = url?.match(/(?:live\/|v=|embed\/)([a-zA-Z0-9_-]{11})/);
  return m ? m[1] : null;
}

/** Stream-only video grid - no ControlBar (viewer capture) */
function StreamVideoGrid({ participantIds }: { participantIds: string[] }) {
  const tracks = useTracks(
    [
      { source: Track.Source.Camera, withPlaceholder: true },
      { source: Track.Source.ScreenShare, withPlaceholder: false },
    ],
    {
      updateOnlyOn: [RoomEvent.ActiveSpeakersChanged],
      onlySubscribed: false,
    }
  );

  const participantIdSet = new Set(participantIds);
  const filteredTracks = tracks.filter(
    (t: TrackReferenceOrPlaceholder) => participantIdSet.has(t.participant.identity)
  );

  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex-1 min-h-0 relative w-full">
        {filteredTracks.length > 0 ? (
          <GridLayout tracks={filteredTracks}>
            <ParticipantTile />
          </GridLayout>
        ) : (
          <div className="absolute inset-0 w-full h-full flex flex-col items-center justify-center gap-4 bg-black/90 p-8">
            <div className="w-20 h-20 rounded-full bg-white/10 flex items-center justify-center animate-pulse">
              <span className="text-4xl">👥</span>
            </div>
            <p className="text-base font-medium text-white/90 text-center">
              Participants are coming
            </p>
            <p className="text-sm text-white/60 text-center">
              Please wait while the moderator and speakers join
            </p>
          </div>
        )}
      </div>
      <RoomAudioRenderer />
      <ConnectionStateToast />
    </div>
  );
}

interface DebateStreamViewProps {
  debateId: string;
  title: string;
  moderatorId: string;
  speakerIds: string[];
  youtubeLiveUrl?: string | null;
  useLiveKit: boolean;
}

export function DebateStreamView({
  debateId,
  title,
  moderatorId,
  speakerIds,
  youtubeLiveUrl,
  useLiveKit,
}: DebateStreamViewProps) {
  const [token, setToken] = useState<string | null>(null);
  const [serverUrl, setServerUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const participantIds = [moderatorId, ...speakerIds];

  useEffect(() => {
    if (!useLiveKit || !debateId) return;
    const streamerId = `stream-${debateId}-${Date.now()}`;
    (async () => {
      try {
        const res = await fetch("/api/livekit/token", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            roomName: `debate-${debateId}`,
            participantId: streamerId,
            participantName: "Stream Capture",
            canPublish: false, // Viewer only - just subscribe
          }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to get token");
        setToken(data.token);
        setServerUrl(data.url || process.env.NEXT_PUBLIC_LIVEKIT_URL);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Connection failed");
      }
    })();
  }, [useLiveKit, debateId]);

  // YouTube embed only (no LiveKit)
  if (!useLiveKit && youtubeLiveUrl) {
    const videoId = extractYouTubeVideoId(youtubeLiveUrl);
    if (videoId) {
      return (
        <div className="fixed inset-0 w-screen h-screen bg-black flex flex-col">
          <iframe
            src={`https://www.youtube.com/embed/${videoId}?autoplay=0`}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full"
          />
        </div>
      );
    }
  }

  // LiveKit stream view
  if (useLiveKit) {
    if (error) {
      return (
        <div className="fixed inset-0 flex items-center justify-center bg-muted text-destructive p-8">
          <div className="text-center">
            <p className="font-medium">{error}</p>
            <p className="text-sm mt-2 text-muted-foreground">
              Ensure the debate has started and LiveKit is configured.
            </p>
          </div>
        </div>
      );
    }

    if (!token || !serverUrl) {
      return (
        <div className="fixed inset-0 flex items-center justify-center bg-muted">
          <div className="flex flex-col items-center gap-4">
            <div className="w-10 h-10 rounded-full border-2 border-primary/30 border-t-primary animate-spin" />
            <p className="text-sm text-muted-foreground">Connecting to stream…</p>
          </div>
        </div>
      );
    }

    return (
      <div className="fixed inset-0 w-screen h-screen bg-black overflow-hidden">
        <LiveKitRoom
          token={token}
          serverUrl={serverUrl}
          connect={true}
          audio={false}
          video={false}
          data-lk-theme="default"
          style={{
            width: "100%",
            height: "100%",
            backgroundColor: "transparent",
          }}
          className="!bg-transparent"
        >
          <StreamVideoGrid participantIds={participantIds} />
        </LiveKitRoom>
      </div>
    );
  }

  // Fallback: no LiveKit, no YouTube
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-muted">
      <div className="text-center p-8 max-w-md">
        <p className="font-medium text-foreground">Stream view</p>
        <p className="text-sm mt-2 text-muted-foreground">
          Open this page when using LiveKit video. For YouTube-only streaming, add the YouTube Live URL in debate settings.
        </p>
      </div>
    </div>
  );
}
