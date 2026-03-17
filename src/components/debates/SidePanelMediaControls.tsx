"use client";

import { Track } from "livekit-client";
import { useTrackToggle, useMaybeRoomContext } from "@livekit/components-react";
import { Button } from "@/components/ui/button";
import { Mic, MicOff, Video, VideoOff } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

/**
 * Media controls for side panel.
 * When inside LiveKitRoom: uses useTrackToggle (synced with video ControlBar).
 * When outside (non-LiveKit): uses custom MediaControls with local state.
 */
interface SidePanelMediaControlsProps {
  /** Non-LiveKit mode: use these */
  myMuted?: boolean;
  myVideoOff?: boolean;
  onToggleMic?: () => void;
  onToggleVideo?: () => void;
}

function LiveKitMediaControls() {
  const mic = useTrackToggle({ source: Track.Source.Microphone });
  const cam = useTrackToggle({ source: Track.Source.Camera });
  return (
    <div className="flex gap-2">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button size="sm" variant={mic.enabled ? "default" : "outline"} className="h-8 gap-1" {...mic.buttonProps}>
            {mic.enabled ? <Mic className="h-3.5 w-3.5" /> : <MicOff className="h-3.5 w-3.5" />}
            {mic.enabled ? "Mic On" : "Mic Off"}
          </Button>
        </TooltipTrigger>
        <TooltipContent>{mic.enabled ? "Mute microphone" : "Enable microphone"}</TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button size="sm" variant={cam.enabled ? "default" : "outline"} className="h-8 gap-1" {...cam.buttonProps}>
            {cam.enabled ? <Video className="h-3.5 w-3.5" /> : <VideoOff className="h-3.5 w-3.5" />}
            {cam.enabled ? "Cam On" : "Cam Off"}
          </Button>
        </TooltipTrigger>
        <TooltipContent>{cam.enabled ? "Turn off camera" : "Enable camera"}</TooltipContent>
      </Tooltip>
    </div>
  );
}

export function SidePanelMediaControls({
  myMuted = true,
  myVideoOff = true,
  onToggleMic,
  onToggleVideo,
}: SidePanelMediaControlsProps) {
  const room = useMaybeRoomContext();

  // LiveKit mode: use LiveKit hooks for sync with video ControlBar
  if (room) {
    return <LiveKitMediaControls />;
  }

  // Non-LiveKit mode: use custom handlers
  return (
    <div className="flex gap-2">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            size="sm"
            variant={myMuted ? "outline" : "default"}
            className="h-8 gap-1"
            onClick={onToggleMic}
          >
            {myMuted ? <MicOff className="h-3.5 w-3.5" /> : <Mic className="h-3.5 w-3.5" />}
            {myMuted ? "Mic Off" : "Mic On"}
          </Button>
        </TooltipTrigger>
        <TooltipContent>{myMuted ? "Enable microphone" : "Mute microphone"}</TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            size="sm"
            variant={myVideoOff ? "outline" : "default"}
            className="h-8 gap-1"
            onClick={onToggleVideo}
          >
            {myVideoOff ? <VideoOff className="h-3.5 w-3.5" /> : <Video className="h-3.5 w-3.5" />}
            {myVideoOff ? "Cam Off" : "Cam On"}
          </Button>
        </TooltipTrigger>
        <TooltipContent>{myVideoOff ? "Enable camera" : "Turn off camera"}</TooltipContent>
      </Tooltip>
    </div>
  );
}
