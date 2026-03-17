"use client";

import { RoomEvent, Track } from "livekit-client";
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
}

export function DebateVideoConference({
  participantIds,
  onDisconnected,
  style,
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

  const participantIdSet = new Set(participantIds);
  const filteredTracks = tracks.filter(
    (t: TrackReferenceOrPlaceholder) =>
      participantIdSet.has(t.participant.identity)
  );

  return (
    <div className="lk-video-conference flex flex-col" style={style}>
      <div className="lk-grid-layout-wrapper flex-1 min-h-0">
        <GridLayout tracks={filteredTracks}>
          <ParticipantTile />
        </GridLayout>
      </div>
      {/* Mic, camera, screen share - only for participants (viewers get no controls) */}
      <ControlBar
        controls={{
          microphone: true,
          camera: true,
          screenShare: true,
          chat: false,
          leave: false,
        }}
      />
      <RoomAudioRenderer />
      <ConnectionStateToast />
    </div>
  );
}
