/**
 * Maps API debate response to UI (StoredDebate) shape
 */
import type { DebateApi } from './api';
import type { StoredDebate } from './debateStorage';

function mapStatus(api: DebateApi['status']): StoredDebate['status'] {
  if (api === 'live') return 'active';
  if (api === 'concluded') return 'concluded';
  return 'upcoming'; // draft, scheduled
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
    status: mapStatus(d.status),
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
  };
}
