"use client";

/**
 * Dedicated stream view for OBS / YouTube Live capture.
 * URL: /debates/[id]/stream
 *
 * Moderator opens this in a separate browser tab. OBS uses Browser Source
 * with this URL for stable, full-quality capture - no scroll, no layout shift.
 */
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { DebateStreamView } from "@/components/debates/DebateStreamView";
import { debateApi } from "@/lib/api";

export default function DebateStreamPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string | undefined;
  const [debate, setDebate] = useState<{
    id: string;
    title: string;
    format: string;
    youtubeLiveUrl: string | null;
    participants: {
      positionA: { userId?: string; name: string } | null;
      positionB: { userId?: string; name: string } | null;
      moderator: { userId?: string; name: string } | null;
    };
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) {
      router.replace("/debates");
      return;
    }
    (async () => {
      const { data, error } = await debateApi.getById(id);
      if (error || !data?.debate) {
        router.replace("/debates");
        return;
      }
      setDebate(data.debate);
      setLoading(false);
    })();
  }, [id, router]);

  if (loading || !debate) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 rounded-full border-2 border-white/30 border-t-white animate-spin" />
          <p className="text-sm text-white/80">Loading stream…</p>
        </div>
      </div>
    );
  }

  if (debate.format !== "video") {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-muted p-8">
        <div className="text-center">
          <p className="font-medium">Stream view is for video debates only.</p>
          <p className="text-sm mt-2 text-muted-foreground">
            This debate is not a live video debate.
          </p>
        </div>
      </div>
    );
  }

  const mod = debate.participants.moderator;
  const moderatorId = mod?.userId ?? "mod";
  const speakerIds = [
    debate.participants.positionA?.userId ?? "a",
    debate.participants.positionB?.userId ?? "b",
  ];

  const useLiveKit = process.env.NEXT_PUBLIC_LIVEKIT_ENABLED === "true";

  return (
    <DebateStreamView
      debateId={debate.id}
      title={debate.title}
      moderatorId={moderatorId}
      speakerIds={speakerIds}
      youtubeLiveUrl={debate.youtubeLiveUrl}
      useLiveKit={useLiveKit}
    />
  );
}
