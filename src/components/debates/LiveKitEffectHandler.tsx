"use client";

import { useLiveKitVirtualBackground } from "@/hooks/useLiveKitVirtualBackground";

/**
 * Handles LiveKit video track replacement when virtual background is selected.
 * Must be rendered inside LiveKitRoom.
 */
export function LiveKitEffectHandler({ effectId }: { effectId: string }) {
  useLiveKitVirtualBackground(effectId);
  return null;
}
