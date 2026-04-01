"use client";

import { useEffect, useRef } from "react";
import { useLocalParticipant } from "@livekit/components-react";
import {
  BackgroundProcessor,
  supportsBackgroundProcessors,
} from "@livekit/track-processors";
import type { BackgroundProcessorWrapper } from "@livekit/track-processors";
import { isVirtualBackground, getVirtualBackgroundUrl } from "./useVirtualBackground";

const BLUR_RADIUS = 14;

/**
 * Applies virtual background effects to the LiveKit camera track using setProcessor.
 * Does NOT unpublish/republish - processes the existing track in place.
 * Must be used inside LiveKitRoom.
 */
export function useLiveKitVirtualBackground(effectId: string) {
  const { cameraTrack } = useLocalParticipant();
  const processorRef = useRef<BackgroundProcessorWrapper | null>(null);
  const effectIdRef = useRef(effectId);
  effectIdRef.current = effectId;

  const videoTrack = cameraTrack?.track;

  useEffect(() => {
    if (!supportsBackgroundProcessors()) return;
    const track = videoTrack as import("livekit-client").LocalVideoTrack | undefined;
    if (!track || typeof track.setProcessor !== "function") return;

    let cancelled = false;

    const init = async () => {
      try {
        const processor = BackgroundProcessor({ mode: "disabled" });
        processorRef.current = processor;
        await track.setProcessor(processor, true);
        if (cancelled) return;
        await applyEffect(processor, effectIdRef.current);
      } catch {
        processorRef.current = null;
      }
    };

    init();

    return () => {
      cancelled = true;
      processorRef.current = null;
      track.stopProcessor?.().catch(() => {});
    };
  }, [videoTrack]);

  useEffect(() => {
    const processor = processorRef.current;
    if (!processor) return;

    applyEffect(processor, effectId).catch(() => {});
  }, [effectId]);
}

async function applyEffect(
  processor: BackgroundProcessorWrapper,
  effectId: string
): Promise<void> {
  if (isVirtualBackground(effectId)) {
    if (effectId === "vb-blur") {
      await processor.switchTo({ mode: "background-blur", blurRadius: BLUR_RADIUS });
    } else {
      const url = getVirtualBackgroundUrl(effectId);
      if (url) {
        const fullUrl =
          typeof window !== "undefined" && !url.startsWith("blob:") && !url.startsWith("data:")
            ? `${window.location.origin}${url}`
            : url;
        await processor.switchTo({
          mode: "virtual-background",
          imagePath: fullUrl,
        });
      } else {
        await processor.switchTo({ mode: "disabled" });
      }
    }
  } else {
    await processor.switchTo({ mode: "disabled" });
  }
}
