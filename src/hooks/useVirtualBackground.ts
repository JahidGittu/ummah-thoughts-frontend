"use client";

import { useEffect, useRef, useState } from "react";
import { VirtualBackgroundProcessor } from "@/lib/virtualBackgroundProcessor";

export const ISLAMIC_BACKGROUNDS = [
  { id: "vb-mosque", label: "Mosque", url: "/backgrounds/mosque.svg" },
  { id: "vb-geometric", label: "Geometric", url: "/backgrounds/geometric.svg" },
  { id: "vb-teal", label: "Teal Gradient", url: "/backgrounds/teal-gradient.svg" },
  { id: "vb-arabesque", label: "Arabesque", url: "/backgrounds/arabesque.svg" },
  { id: "vb-minimal", label: "Minimal", url: "/backgrounds/minimal.svg" },
] as const;

export const VB_CUSTOM_PREFIX = "vb-custom:";

export function isVirtualBackground(effectId: string): boolean {
  return effectId === "vb-blur" || effectId.startsWith("vb-");
}

export function getVirtualBackgroundUrl(effectId: string): string | null {
  if (effectId === "vb-blur") return null;
  if (effectId.startsWith(VB_CUSTOM_PREFIX)) {
    return effectId.slice(VB_CUSTOM_PREFIX.length) || null;
  }
  const bg = ISLAMIC_BACKGROUNDS.find((b) => b.id === effectId);
  return bg ? bg.url : null;
}

export interface UseVirtualBackgroundOptions {
  rawStream: MediaStream | null;
  effectId: string;
}

export function useVirtualBackground({
  rawStream,
  effectId,
}: UseVirtualBackgroundOptions) {
  const [outputStream, setOutputStream] = useState<MediaStream | null>(null);
  const [isReady, setIsReady] = useState(false);
  const processorRef = useRef<VirtualBackgroundProcessor | null>(null);

  useEffect(() => {
    if (!rawStream || !isVirtualBackground(effectId)) {
      processorRef.current?.stop();
      processorRef.current = null;
      setOutputStream(null);
      setIsReady(true);
      return;
    }

    let cancelled = false;
    const processor = new VirtualBackgroundProcessor({
      type: effectId === "vb-blur" ? "blur" : getVirtualBackgroundUrl(effectId) ?? "none",
      blurAmount: 14,
    });

    processorRef.current = processor;

    processor
      .start(rawStream)
      .then((stream) => {
        if (!cancelled) {
          setOutputStream(stream);
          setIsReady(true);
        } else {
          stream.getTracks().forEach((t) => t.stop());
        }
      })
      .catch(() => {
        if (!cancelled) {
          setOutputStream(null);
          setIsReady(true);
        }
      });

    return () => {
      cancelled = true;
      processor.stop();
      processorRef.current = null;
      setOutputStream(null);
    };
  }, [rawStream, effectId]);

  return { outputStream, isReady };
}
