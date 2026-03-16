/**
 * API client for Ummah Thoughts backend
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('ummahthoughts_token');
}

export async function api<T>(
  path: string,
  options: RequestInit = {}
): Promise<{ data?: T; error?: string }> {
  const token = getToken();
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };
  if (token) {
    (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
  }

  try {
    const res = await fetch(`${API_URL}${path}`, { ...options, headers });
    const json = await res.json().catch(() => ({}));

    if (!res.ok) {
      return { error: json.error || res.statusText || 'Request failed' };
    }
    return { data: json as T };
  } catch (err) {
    return { error: err instanceof Error ? err.message : 'Network error' };
  }
}

export const authApi = {
  register: (data: { name: string; email: string; password: string; role?: string; specialization?: string; bio?: string }) =>
    api<{ user: any; token: string }>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  login: (email: string, password: string) =>
    api<{ user: any; token: string }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  getMe: () => api<{ user: any }>('/api/auth/me'),

  googleUrl: () => `${API_URL}/api/auth/google`,
};

export const userApi = {
  getScholars: (search?: string) =>
    api<{ success: boolean; scholars: { id: string; name: string; email: string; specialization: string | null }[] }>(
      search ? `/api/users/scholars?search=${encodeURIComponent(search)}` : '/api/users/scholars'
    ),
};

export const notificationApi = {
  list: (unreadOnly?: boolean) =>
    api<{ success: boolean; notifications: { id: string; type: string; title: string; message: string; link: string | null; read: boolean; createdAt: string }[] }>(
      unreadOnly ? '/api/notifications?unread=true' : '/api/notifications'
    ),
  markAsRead: (id: string) => api<{ success: boolean }>(`/api/notifications/${id}/read`, { method: 'PATCH' }),
  markAllAsRead: () => api<{ success: boolean }>('/api/notifications/read-all', { method: 'PATCH' }),
};

export interface DebateParticipant {
  userId: string;
  name: string;
  role: 'Scholar' | 'Moderator';
}

export interface DebateApi {
  id: string;
  title: string;
  details: string;
  topic: string;
  tags: string[];
  status: 'draft' | 'scheduled' | 'live' | 'concluded';
  format: 'video' | 'chat';
  scheduledAt: string;
  duration: number;
  youtubeLiveUrl: string | null;
  participants: {
    positionA: DebateParticipant | null;
    positionB: DebateParticipant | null;
    moderator: DebateParticipant | null;
  };
  createdAt: string;
}

export const debateApi = {
  list: (status?: string) =>
    api<{ success: boolean; debates: DebateApi[] }>(status ? `/api/debates?status=${status}` : '/api/debates'),

  getById: (id: string) => api<{ success: boolean; debate: DebateApi }>(`/api/debates/${id}`),

  getTopics: () => api<{ success: boolean; topics: string[] }>('/api/debates/topics'),

  getMessages: (id: string) =>
    api<{
      success: boolean;
      messages: {
        id: string;
        userId: string;
        userName: string;
        text: string;
        audioUrl?: string;
        createdAt: string;
        reactions?: Record<string, number>;
        /** Current user's reaction (when authenticated) – for change/remove on reload */
        myReaction?: string;
      }[];
    }>(`/api/debates/${id}/messages`),

  sendMessage: (id: string, text: string) =>
    api<{ success: boolean; message: unknown }>(`/api/debates/${id}/messages`, {
      method: 'POST',
      body: JSON.stringify({ text }),
    }),

  /** Send voice message (audio blob). Uses multipart/form-data. */
  sendVoiceMessage: async (id: string, audioBlob: Blob) => {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
    const token = typeof window !== 'undefined' ? localStorage.getItem('ummahthoughts_token') : null;
    const formData = new FormData();
    const ext = audioBlob.type.includes('webm') ? '.webm' : '.mp4';
    formData.append('audio', audioBlob, `voice${ext}`);
    const res = await fetch(`${API_URL}/api/debates/${id}/messages/voice`, {
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: formData,
    });
    const json = await res.json().catch(() => ({}));
    if (!res.ok) return { error: json.error || res.statusText || 'Request failed' };
    return { data: json as { success: boolean; message: unknown } };
  },

  editMessage: (debateId: string, messageId: string, text: string) =>
    api<{ success: boolean; message: unknown }>(`/api/debates/${debateId}/messages/${messageId}`, {
      method: 'PATCH',
      body: JSON.stringify({ text }),
    }),

  deleteMessage: (debateId: string, messageId: string) =>
    api<{ success: boolean }>(`/api/debates/${debateId}/messages/${messageId}`, {
      method: 'DELETE',
    }),

  /** Toggle reaction on a message. Emoji: 👍 🤔 💡 ❤️ 🔥 📖. Same emoji = remove, different = change. Backend must implement POST /api/debates/:id/messages/:messageId/reactions */
  getClarityVotes: (id: string) =>
    api<{ success: boolean; positionA: number; positionB: number; myVote?: 'A' | 'B' | null }>(`/api/debates/${id}/clarity-votes`),

  getBookmark: (id: string) =>
    api<{ success: boolean; bookmarked: boolean }>(`/api/debates/${id}/bookmark`),

  emitTyping: (id: string) =>
    api<{ success: boolean }>(`/api/debates/${id}/typing`, { method: 'POST' }),

  emitRecording: (id: string, recording: boolean) =>
    api<{ success: boolean }>(`/api/debates/${id}/recording`, {
      method: 'POST',
      body: JSON.stringify({ recording }),
    }),

  toggleBookmark: (id: string) =>
    api<{ success: boolean; bookmarked: boolean }>(`/api/debates/${id}/bookmark`, {
      method: 'POST',
    }),

  voteClarity: (id: string, side: 'A' | 'B') =>
    api<{ success: boolean; positionA: number; positionB: number; myVote?: 'A' | 'B' | null }>(`/api/debates/${id}/clarity-votes`, {
      method: 'POST',
      body: JSON.stringify({ side }),
    }),

  react: (debateId: string, messageId: string, emoji: string) =>
    api<{ success: boolean; reactions?: Record<string, number>; myReaction?: string }>(
      `/api/debates/${debateId}/messages/${messageId}/reactions`,
      {
        method: 'POST',
        body: JSON.stringify({ emoji }),
      }
    ),

  create: (data: {
    title: string;
    details: string;
    topic: string;
    tags?: string[];
    format: 'video' | 'chat';
    scheduledAt: string;
    duration: number;
    youtubeLiveUrl?: string | null;
    positionAUserId?: string | null;
    positionBUserId?: string | null;
    moderatorUserId?: string | null;
  }) =>
    api<{ success: boolean; debate: DebateApi }>('/api/debates', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
};
