// app/debates/livechat/[id]/page.tsx
"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";

/**
 * Redirect to unified debate detail page.
 * All debate viewing (live/written) uses /debates/[id] with consistent chat UI.
 */
export default function LiveChatDebatePage() {
  const params = useParams();
  const router = useRouter();
  const debateId = params?.id as string;

  useEffect(() => {
    if (debateId) {
      router.replace(`/debates/${debateId}`);
    } else {
      router.replace("/debates");
    }
  }, [debateId, router]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="w-8 h-8 rounded-full border-2 border-primary/30 border-t-primary animate-spin" />
    </div>
  );
}
