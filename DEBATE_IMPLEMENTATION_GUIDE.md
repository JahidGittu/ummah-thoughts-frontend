# Debate Platform – Implementation Guide

## Executive Summary

This guide covers the full implementation of the debate scheduling and live debate system. **Only admins** can schedule debates. Scholars receive notifications; direct participants receive invitation links. Viewers watch/listen via YouTube Live or in-app chat.

---

## 1. Permission Model

| Role | Schedule Debate | Join as Participant | View/Listen |
|------|------------------|--------------------|-------------|
| **Admin** | ✅ Yes | ✅ Yes (as moderator) | ✅ Yes |
| **Scholar** | ❌ No | ✅ Yes (if invited) | ✅ Yes |
| **User** | ❌ No | ❌ No | ✅ Yes |

**Important:** Remove the "Schedule" button from Scholar dashboard. Only show it in Admin dashboard.

---

## 2. Data Model (Backend / Database)

### 2.1 Debate Schema (MongoDB / PostgreSQL)

```typescript
interface Debate {
  id: string;
  title: string;
  details: string;                    // Rich text description
  topic: string;                     // e.g. "Islamic Governance"
  tags: string[];                    // ["Fiqh", "Politics", "Khilafah"]
  
  // Participants (2–4 people + moderator)
  participants: {
    positionA: { userId: string; name: string; role: "Scholar" | "Moderator" };
    positionB: { userId: string; name: string; role: "Scholar" | "Moderator" };
    moderator?: { userId: string; name: string };
    extra?: { userId: string; name: string; role: string }[];  // Optional 4th person
  };
  
  // Scheduling
  scheduledAt: Date;                 // ISO datetime
  duration: number;                  // minutes (e.g. 120)
  
  // Format
  format: "video" | "chat";         // Video = YouTube Live; Chat = text-based
  
  // YouTube (when format = "video")
  youtubeLiveUrl?: string;           // e.g. "https://youtube.com/live/xxx"
  
  // Status
  status: "draft" | "scheduled" | "live" | "concluded";
  
  // Metadata
  createdBy: string;                 // Admin userId
  createdAt: Date;
  updatedAt: Date;
}
```

### 2.2 User Reference for Participants

Participants are selected from existing users (scholars). Store `userId` for notifications and invitation links.

---

## 3. Admin Schedule Form (UI Fields)

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| **Debate Title** | Text | ✅ | e.g. "Is Shura Binding or Advisory?" |
| **Debate Details** | Rich text / Textarea | ✅ | Full description |
| **Topic** | Text / Select | ✅ | Category |
| **Tags** | Multi-select / Chips | Optional | ["Fiqh", "Politics"] |
| **Position A (Pro)** | User picker | ✅ | Select scholar from list |
| **Position B (Con)** | User picker | ✅ | Select scholar from list |
| **Moderator** | User picker | Optional | Admin or trusted user |
| **Extra Participant** | User picker | Optional | 4th person if needed |
| **Date** | Date picker | ✅ | Scheduled date |
| **Time** | Time picker | ✅ | Scheduled time |
| **Duration** | Number (minutes) | ✅ | e.g. 120 |
| **Format** | Radio: Video / Chat | ✅ | Video = YouTube, Chat = text |
| **YouTube Live URL** | URL input | If Video | Shown only when format = "video" |

---

## 4. Notification Flow

### 4.1 When Admin Schedules a Debate

```
Admin clicks "Schedule" 
  → Backend saves debate
  → Trigger notifications
```

### 4.2 Notification Types

| Recipient | Message | Action |
|-----------|---------|--------|
| **All Scholars** | "A new debate has been scheduled: [Title] at [Date/Time]" | Link to `/debates` or debate detail |
| **Direct Participants** (Position A, B, Moderator, Extra) | "You are invited to participate in [Title]. Join here: [Invitation Link]" | Invitation link with token |

### 4.3 Invitation Link Format

```
/debates/[debateId]/join?token=[inviteToken]
```

- `inviteToken`: JWT or signed token containing `debateId`, `userId`, expiry
- Only valid participants can use this link to join as **speaker/debater**
- Others use `/debates/[id]` to **watch** (YouTube embed or chat view)

### 4.4 Implementation Options for Notifications

| Method | Pros | Cons |
|--------|------|-----|
| **Email** | Reliable, no real-time needed | Delay, may go to spam |
| **In-app (Pusher)** | Instant | User must be online |
| **Push (Web Push)** | Works when tab closed | Needs permission |
| **SMS** | High open rate | Cost |

**Recommended:** In-app (Pusher) + Email for participants. Scholars see a notification badge when they log in.

---

## 5. Participant vs Viewer

| Type | Count | Access | Capabilities |
|------|-------|--------|--------------|
| **Participants** | 2–4 + moderator | Invitation link | Speak, share video (if video debate), send messages |
| **Viewers** | Unlimited | Public `/debates/[id]` | Watch YouTube stream, read chat, vote on clarity |

**Flow:**
1. Participant opens invitation link → Joins as **speaker** (mic/camera on in WebRTC or chat)
2. Viewer opens public link → Sees YouTube embed + chat, no mic/camera

---

## 6. YouTube Live Integration ("YouTube Hack")

### 6.1 Architecture

```
[Debaters] ←→ WebRTC / Jitsi (or similar) ←→ Your Backend
                    ↓
[YouTube Live] ← OBS / Stream Key (Admin streams the call to YouTube)
                    ↓
[Viewers] ← Embed YouTube iframe on your site
```

**Flow:**
1. Debaters join a video call (Jitsi, Daily.co, or custom WebRTC).
2. Admin uses OBS to stream that call to YouTube Live.
3. Your site embeds the YouTube Live URL in an iframe for viewers.
4. Chat runs separately (Pusher) for all users.

### 6.2 Frontend Embed

```tsx
// When format = "video" and youtubeLiveUrl exists
<iframe
  src={`https://www.youtube.com/embed/${extractVideoId(youtubeLiveUrl)}`}
  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
  allowFullScreen
  className="w-full aspect-video rounded-lg"
/>
```

### 6.3 For Testing (No YouTube Yet)

- Use a placeholder or "Stream will start at [time]"
- Or use Jitsi/Daily.co embed for both debaters and viewers during development.

---

## 7. Real-Time Messaging (Pusher)

### 7.1 Channels

| Channel | Purpose |
|---------|---------|
| `debate-{debateId}` | Chat messages, hand raises, votes |
| `debate-{debateId}-signaling` | WebRTC signaling (if not using Jitsi) |

### 7.2 Events

| Event | Payload | When |
|-------|---------|------|
| `new-message` | `{ userId, name, text, timestamp }` | User sends chat message |
| `user-joined` | `{ userId, name, role }` | Participant joins |
| `user-left` | `{ userId }` | Participant leaves |
| `hand-raised` | `{ userId, name }` | Viewer raises hand |
| `vote-clarity` | `{ side: "A"|"B", count }` | Clarity vote update |

### 7.3 Backend (Node.js + Pusher)

```javascript
// POST /api/debates/:id/messages
const pusher = new Pusher({ appId, key, secret, cluster });
pusher.trigger(`debate-${debateId}`, "new-message", { userId, name, text, timestamp });
```

### 7.4 Frontend (React + pusher-js)

```javascript
useEffect(() => {
  const channel = pusher.subscribe(`debate-${debateId}`);
  channel.bind("new-message", (data) => setMessages(prev => [...prev, data]));
  return () => pusher.unsubscribe(`debate-${debateId}`);
}, [debateId]);
```

---

## 8. Free Hosting Setup (2026)

| Component | Host | Notes |
|-----------|------|------|
| **Frontend** | Vercel | Next.js, free tier |
| **Backend API** | Koyeb / Render | Node.js, may sleep after 15 min |
| **Real-time** | Pusher | Free tier ~200k msg/day |
| **Database** | MongoDB Atlas | Free M0 |
| **Video (debaters)** | Jitsi Meet / Daily.co | Free tier for small groups |
| **Video (viewers)** | YouTube Live | Unlimited viewers |

**Important:** Vercel serverless cannot run Socket.io. Use Pusher instead.

---

## 9. Implementation Phases

### Phase 1: Admin-Only Scheduling (Current Focus)
- [ ] Add `/dashboard/admin/debates` route (admin only)
- [ ] Build full schedule form (all fields above)
- [ ] Remove schedule from Scholar dashboard
- [ ] Save to backend API (or localStorage for MVP)

### Phase 2: Notifications
- [ ] Integrate Pusher
- [ ] "Debate scheduled" event to scholars
- [ ] Invitation link generation for participants
- [ ] (Optional) Email via Resend/SendGrid

### Phase 3: Live Debate Page
- [ ] `/debates/[id]` – public view (YouTube embed + chat)
- [ ] `/debates/[id]/join` – participant view (invitation token)
- [ ] Chat via Pusher
- [ ] Clarity voting

### Phase 4: Video (If Needed)
- [ ] Jitsi/Daily.co for debaters
- [ ] Admin streams to YouTube
- [ ] Embed YouTube on viewer page

---

## 10. API Endpoints (Backend)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/debates` | Admin | Create/schedule debate |
| GET | `/api/debates` | Public | List debates |
| GET | `/api/debates/:id` | Public | Debate detail |
| GET | `/api/debates/:id/join` | Participant token | Validate invite, return join URL |
| POST | `/api/debates/:id/messages` | Authenticated | Send chat message |
| GET | `/api/debates/:id/messages` | Authenticated | Get chat history |

---

## 11. Frontend Route Structure

```
/debates                    → Public list
/debates/[id]               → View (YouTube + chat) or redirect to livechat/livevideo
/debates/[id]/join?token=   → Participant join (with token validation)
/dashboard/admin/debates     → Admin schedule + manage
/dashboard/debates           → Scholar view (no schedule button)
```

---

## 12. Summary Checklist

- [ ] Admin-only scheduling
- [ ] Full schedule form (title, details, participants, time, format, tags, YouTube URL)
- [ ] Scholars: notification "Debate scheduled at X"
- [ ] Participants: invitation link with token
- [ ] Viewers: public page with YouTube embed + chat
- [ ] Pusher for real-time chat
- [ ] YouTube Live for video debates (admin streams via OBS)

---

*Document version: 1.0 | Last updated: March 2025*
