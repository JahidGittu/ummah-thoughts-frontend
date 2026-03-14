'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { getDebateById } from '@/lib/debateStorage';

/**
 * /debates/[id] - Redirects to livechat or livevideo based on debate format.
 * Used by DebateCardEnhanced and direct links.
 */
export default function DebateDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string | undefined;

  useEffect(() => {
    if (!id) {
      router.replace('/debates');
      return;
    }
    const debate = getDebateById(id);
    if (debate) {
      if (debate.format === 'live') {
        router.replace(`/debates/livevideo/${id}`);
      } else {
        router.replace(`/debates/livechat/${id}`);
      }
    } else {
      router.replace('/debates');
    }
  }, [id, router]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="w-8 h-8 rounded-full border-2 border-primary/30 border-t-primary animate-spin" />
    </div>
  );
}
