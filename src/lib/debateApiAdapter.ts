/**
 * Maps API debate response to UI (StoredDebate) shape
 */
import type { DebateApi } from './api';
import type { StoredDebate } from './debateStorage';

/** Derive public status (active / upcoming / concluded) based on time + API status. */
function computePublicStatus(d: DebateApi): StoredDebate['status'] {
  // If backend already marks as concluded, always respect that
  if (d.status === 'concluded') return 'concluded';

  // When scheduledAt or duration is missing, fall back to API flags
  if (!d.scheduledAt || !d.duration) {
    if (d.status === 'live') return 'active';
    return 'upcoming';
  }

  const start = new Date(d.scheduledAt).getTime();
  if (Number.isNaN(start)) {
    if (d.status === 'live') return 'active';
    return 'upcoming';
  }

  const end = start + d.duration * 60_000;
  const now = Date.now();

  if (now >= end) return 'concluded';
  if (now >= start) return 'active';

  // Before start time
  return 'upcoming';
}

function mapFormat(api: DebateApi['format']): StoredDebate['format'] {
  return api === 'video' ? 'live' : 'async';
}

function formatScheduledDate(iso: string): string {
  try {
    const d = new Date(iso);
    return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
      + ' ' + d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
  } catch {
    return iso;
  }
}

function formatDuration(mins: number): string {
  if (mins >= 60) return `${Math.floor(mins / 60)} hour${mins >= 120 ? 's' : ''}`;
  return `${mins} min`;
}

export function apiDebateToStored(d: DebateApi): StoredDebate {
  return {
    id: d.id,
    title: d.title,
    status: computePublicStatus(d),
    format: mapFormat(d.format),
    topic: d.topic,
    participants: {
      positionA: { name: d.participants.positionA?.name ?? 'TBD', role: 'Scholar' },
      positionB: { name: d.participants.positionB?.name ?? 'TBD', role: 'Scholar' },
    },
    scheduledDate: formatScheduledDate(d.scheduledAt),
    duration: formatDuration(d.duration),
    votesClarity: 0,
    bookmarks: 0,
    youtubeLiveUrl: d.youtubeLiveUrl ?? undefined,
    currentPhase: d.currentPhase,
    phaseStartedAt: d.phaseStartedAt,
    phasePaused: d.phasePaused,
  };
}
