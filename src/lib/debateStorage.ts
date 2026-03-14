/**
 * Shared debate storage for persistence across public page, dashboard, and live pages.
 * Syncs debates between /debates, /dashboard/debates, and live routes.
 */

export type PublicDebateStatus = 'active' | 'upcoming' | 'concluded';
export type PublicDebateFormat = 'async' | 'live';

export interface StoredDebate {
  id: string;
  title: string;
  titleAr?: string;
  status: PublicDebateStatus;
  format: PublicDebateFormat;
  topic: string;
  participants: {
    positionA: { name: string; role: string };
    positionB: { name: string; role: string };
  };
  scheduledDate?: string;
  duration?: string;
  votesClarity?: number;
  bookmarks?: number;
  /** Scholar dashboard: live | upcoming | completed */
  scholarStatus?: 'live' | 'upcoming' | 'completed';
  myRole?: string;
  participantsCount?: number;
  time?: string;
  /** When scholar schedules from dashboard */
  scheduledByScholar?: boolean;
}

const DEBATES_KEY = 'ummah-debates-list';

const DEFAULT_DEBATES: StoredDebate[] = [
  {
    id: '1',
    title: 'Is Shura Binding or Advisory?',
    titleAr: 'هل الشورى ملزمة أم استشارية؟',
    status: 'active',
    format: 'async',
    topic: 'Islamic Governance',
    participants: {
      positionA: { name: 'Dr. Ahmad Al-Rashid', role: 'Scholar' },
      positionB: { name: 'Sh. Muhammad Hasan', role: 'Scholar' },
    },
    scheduledDate: 'Feb 1 – Feb 15',
    duration: '2 weeks',
    votesClarity: 127,
    bookmarks: 89,
  },
  {
    id: '2',
    title: 'Modern Applications of Khilafah',
    titleAr: 'التطبيقات المعاصرة للخلافة',
    status: 'upcoming',
    format: 'live',
    topic: 'Political Theory',
    participants: {
      positionA: { name: 'Dr. Fatima Zahra', role: 'Researcher' },
      positionB: { name: 'Prof. Ibrahim Khalil', role: 'Academic' },
    },
    scheduledDate: 'Feb 10, 7:00 PM',
    duration: '2 hours',
    votesClarity: 0,
    bookmarks: 45,
  },
  {
    id: '3',
    title: 'Conditions for Valid Bay\'ah',
    titleAr: 'شروط البيعة الصحيحة',
    status: 'concluded',
    format: 'async',
    topic: 'Fiqh al-Siyasah',
    participants: {
      positionA: { name: 'Sh. Abdullah Farooq', role: 'Scholar' },
      positionB: { name: 'Dr. Maryam Hassan', role: 'Scholar' },
    },
    duration: '3 weeks',
    votesClarity: 234,
    bookmarks: 156,
  },
];

function seedIfEmpty(): void {
  if (typeof window === 'undefined') return;
  try {
    const raw = localStorage.getItem(DEBATES_KEY);
    if (!raw || JSON.parse(raw).length === 0) {
      localStorage.setItem(DEBATES_KEY, JSON.stringify(DEFAULT_DEBATES));
    }
  } catch {
    localStorage.setItem(DEBATES_KEY, JSON.stringify(DEFAULT_DEBATES));
  }
}

export function getDebates(): StoredDebate[] {
  if (typeof window === 'undefined') return DEFAULT_DEBATES;
  seedIfEmpty();
  try {
    const raw = localStorage.getItem(DEBATES_KEY);
    if (!raw) return DEFAULT_DEBATES;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : DEFAULT_DEBATES;
  } catch {
    return DEFAULT_DEBATES;
  }
}

export function getDebateById(id: string): StoredDebate | null {
  const list = getDebates();
  return list.find((d) => d.id === id) ?? null;
}

export function saveDebate(debate: StoredDebate): void {
  const list = getDebates();
  const idx = list.findIndex((d) => d.id === debate.id);
  const next = idx >= 0 ? list.map((d, i) => (i === idx ? debate : d)) : [debate, ...list];
  localStorage.setItem(DEBATES_KEY, JSON.stringify(next));
}

export function addDebate(debate: Omit<StoredDebate, 'id'> & { id?: string }, options?: { scheduledByScholar?: boolean }): StoredDebate {
  const id = debate.id ?? `deb_${Date.now()}`;
  const full: StoredDebate = {
    ...debate,
    id,
    status: debate.status ?? 'upcoming',
    format: debate.format ?? 'async',
    topic: debate.topic ?? 'General',
    participants: debate.participants ?? {
      positionA: { name: 'TBD', role: 'Scholar' },
      positionB: { name: 'TBD', role: 'Scholar' },
    },
    myRole: options?.scheduledByScholar ? 'Moderator' : debate.myRole,
    scheduledByScholar: options?.scheduledByScholar,
  };
  saveDebate(full);
  return full;
}

export function deleteDebate(id: string): void {
  const list = getDebates().filter((d) => d.id !== id);
  localStorage.setItem(DEBATES_KEY, JSON.stringify(list));
}
