"use client";

import { RoomEvent, Track } from "livekit-client";
import { useMemo } from "react";
import {
  ConnectionStateToast,
  ControlBar,
  GridLayout,
  ParticipantTile,
  RoomAudioRenderer,
  useTracks,
} from "@livekit/components-react";
import type { TrackReferenceOrPlaceholder } from "@livekit/components-core";

/**
 * Debate video layout: only shows moderator + speakers (participants).
 * Viewers are never shown in the video grid.
 * ControlBar (mic, camera, screen share) shown only for participants.
 */
interface DebateVideoConferenceProps {
  /** IDs of participants who should appear (moderator + speakers) */
  participantIds: string[];
  onDisconnected?: () => void;
  style?: React.CSSProperties;
  /** Extra controls to render to the right of screen share (e.g. Background effects) */
  extraControls?: React.ReactNode;
  /** CSS filter for local participant video (grayscale, sepia, etc.) - only for non-vb effects */
  cssFilter?: string;
  /** Show mic, camera, screen share controls - false for public/visitor viewers */
  showMediaControls?: boolean;
}

export function DebateVideoConference({
  participantIds,
  onDisconnected,
  style,
  extraControls,
  cssFilter,
  showMediaControls = true,
}: DebateVideoConferenceProps) {
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

  const participantIdSet = useMemo(() => new Set(participantIds), [participantIds]);
  const filteredTracks = useMemo(
    () => tracks.filter((t: TrackReferenceOrPlaceholder) => participantIdSet.has(t.participant.identity)),
    [tracks, participantIdSet]
  );

  const filterValue = cssFilter && cssFilter.trim() ? cssFilter : "none";

  return (
    <div className="lk-video-conference flex flex-col" style={style}>
      {filterValue !== "none" && (
        <style>{`
          .lk-video-conference [data-lk-local-participant="true"] video {
            filter: ${filterValue} !important;
          }
        `}</style>
      )}
      <div className="lk-grid-layout-wrapper flex-1 min-h-0 relative w-full">
        {filteredTracks.length > 0 ? (
          <GridLayout tracks={filteredTracks}>
            <ParticipantTile />
          </GridLayout>
        ) : (
          <div className="absolute inset-0 w-full h-full flex flex-col items-center justify-center gap-4 bg-muted/40 p-8">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center animate-pulse">
              <span className="text-2xl">👥</span>
            </div>
            <p className="text-sm font-medium text-muted-foreground text-center">
              Participants are coming
            </p>
            <p className="text-xs text-muted-foreground/80 text-center">
              Please wait while the moderator and speakers join the debate
            </p>
          </div>
        )}
      </div>
      {/* Mic, camera, screen share + extra controls - only for participants; hidden for public/visitor */}
      {showMediaControls && (
        <div className="lk-control-bar flex items-center justify-center gap-2 flex-wrap">
          <ControlBar
            controls={{
              microphone: true,
              camera: true,
              screenShare: true,
              chat: false,
              leave: false,
            }}
          />
          {extraControls}
        </div>
      )}
      <RoomAudioRenderer />
      <ConnectionStateToast />
    </div>
  );
}
