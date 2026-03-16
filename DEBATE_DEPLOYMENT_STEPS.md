# Debate System – Full Deployment Steps (PostgreSQL)

বেসিক থেকে অ্যাডভান্স পর্যন্ত পুরো ডিবেট সিস্টেমের স্টেপ-বাই-স্টেপ ইমপ্লিমেন্টেশন গাইড।

---

# Phase 0: Prerequisites

## 0.1 যা যা লাগবে

| Item | Purpose |
|------|---------|
| Node.js 20+ | Backend + Frontend |
| PostgreSQL 15+ | Database |
| Git | Version control |
| VM / Server | Backend + Socket.io host |
| Vercel account | Frontend deploy (optional) |

## 0.2 প্রজেক্ট স্ট্রাকচার

```
ummah-thoughts/
├── frontend/          # Next.js (existing)
├── backend/           # Node.js + Express + Socket.io (নতুন)
│   ├── src/
│   │   ├── db/        # PostgreSQL
│   │   ├── routes/
│   │   ├── sockets/
│   │   └── index.ts
│   ├── package.json
│   └── .env
└── docs/
```

---

# Phase 1: PostgreSQL Database

## 1.1 Database তৈরি

```sql
CREATE DATABASE ummah_debates;
\c ummah_debates
```

## 1.2 Tables

```sql
-- Users (যদি আলাদা auth DB না থাকে)
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL DEFAULT 'user',  -- admin, scholar, user, writer
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Debates
CREATE TABLE debates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(500) NOT NULL,
  details TEXT,
  topic VARCHAR(200) NOT NULL,
  tags TEXT[] DEFAULT '{}',
  
  -- Participants (JSONB for flexibility)
  participants JSONB NOT NULL DEFAULT '{}',
  -- Format: { "positionA": { "userId": "uuid", "name": "...", "role": "Scholar" },
  --          "positionB": { ... }, "moderator": { ... }, "extra": [...] }
  
  scheduled_at TIMESTAMPTZ NOT NULL,
  duration_minutes INT NOT NULL DEFAULT 120,
  format VARCHAR(20) NOT NULL CHECK (format IN ('video', 'chat')),
  youtube_live_url TEXT,
  
  status VARCHAR(20) NOT NULL DEFAULT 'scheduled' 
    CHECK (status IN ('draft', 'scheduled', 'live', 'concluded')),
  
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_debates_status ON debates(status);
CREATE INDEX idx_debates_scheduled_at ON debates(scheduled_at);

-- Debate Messages (chat)
CREATE TABLE debate_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  debate_id UUID NOT NULL REFERENCES debates(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id),
  user_name VARCHAR(255),
  message_type VARCHAR(20) DEFAULT 'text',  -- text, audio, system
  content TEXT,
  audio_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_debate_messages_debate ON debate_messages(debate_id);

-- Invitations (participant tokens)
CREATE TABLE debate_invitations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  debate_id UUID NOT NULL REFERENCES debates(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id),
  token VARCHAR(255) UNIQUE NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  used_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE UNIQUE INDEX idx_invitation_token ON debate_invitations(token);

-- Notifications (scholars + participants)
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id),
  type VARCHAR(50) NOT NULL,  -- debate_scheduled, debate_invitation
  title VARCHAR(255) NOT NULL,
  body TEXT,
  link TEXT,
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_notifications_user ON notifications(user_id);

-- Clarity votes
CREATE TABLE debate_votes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  debate_id UUID NOT NULL REFERENCES debates(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id),
  side VARCHAR(1) NOT NULL CHECK (side IN ('A', 'B')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(debate_id, user_id)
);

CREATE INDEX idx_debate_votes_debate ON debate_votes(debate_id);
```

## 1.3 Seed Data (optional)

```sql
INSERT INTO users (id, email, name, role) VALUES
  ('00000000-0000-0000-0000-000000000001', 'admin@example.com', 'Admin', 'admin'),
  ('00000000-0000-0000-0000-000000000002', 'scholar1@example.com', 'Dr. Ahmad', 'scholar'),
  ('00000000-0000-0000-0000-000000000003', 'scholar2@example.com', 'Sh. Muhammad', 'scholar');
```

---

# Phase 2: Backend API (Node.js + Express)

## 2.1 Backend প্রজেক্ট তৈরি

```bash
mkdir backend && cd backend
npm init -y
npm install express cors pg dotenv uuid jsonwebtoken bcrypt
npm install -D typescript @types/node @types/express @types/pg ts-node nodemon
```

## 2.2 package.json scripts

```json
{
  "scripts": {
    "dev": "nodemon --exec ts-node src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js"
  }
}
```

## 2.3 .env

```env
PORT=4000
DATABASE_URL=postgresql://user:pass@localhost:5432/ummah_debates
JWT_SECRET=your-secret-key
CORS_ORIGIN=http://localhost:3000
```

## 2.4 DB Connection (src/db/pool.ts)

```typescript
import { Pool } from 'pg';

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 20,
  idleTimeoutMillis: 30000,
});
```

## 2.5 Core API Routes

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| GET | /api/health | - | Health check |
| POST | /api/auth/login | - | Login |
| GET | /api/users | Admin | List users (for picker) |
| POST | /api/debates | Admin | Create debate |
| GET | /api/debates | Public | List debates |
| GET | /api/debates/:id | Public | Debate detail |
| POST | /api/debates/:id/messages | Auth | Send message |
| GET | /api/debates/:id/messages | Auth | Get messages |
| GET | /api/debates/:id/join | Token | Validate invite, return join URL |
| POST | /api/debates/:id/vote | Auth | Clarity vote |

---

# Phase 3: Socket.io (Real-time)

## 3.1 Install

```bash
cd backend
npm install socket.io
```

## 3.2 Server Setup (src/index.ts)

```typescript
import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';

const app = express();
app.use(cors({ origin: process.env.CORS_ORIGIN }));
app.use(express.json());

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: { origin: process.env.CORS_ORIGIN },
  path: '/socket.io',
  pingTimeout: 60000,
  pingInterval: 25000,
});

// REST routes here...
app.post('/api/debates/:id/messages', async (req, res) => {
  // Save to DB, then:
  io.to(`debate-${req.params.id}`).emit('new-message', msg);
  res.json({ ok: true });
});

// Socket handlers
io.on('connection', (socket) => {
  socket.on('join-debate', (debateId) => {
    socket.join(`debate-${debateId}`);
  });
  socket.on('send-message', (payload) => {
    io.to(`debate-${payload.debateId}`).emit('new-message', payload);
  });
  socket.on('hand-raise', (payload) => {
    io.to(`debate-${payload.debateId}`).emit('hand-raised', payload);
  });
  socket.on('vote-clarity', (payload) => {
    io.to(`debate-${payload.debateId}`).emit('vote-updated', payload);
  });
});

const PORT = process.env.PORT || 4000;
httpServer.listen(PORT, () => console.log(`Server on ${PORT}`));
```

---

# Phase 4: Auth Integration

## 4.1 JWT Middleware

```typescript
// src/middleware/auth.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ error: 'Unauthorized' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    (req as any).user = decoded;
    next();
  } catch {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

export function adminOnly(req: Request, res: Response, next: NextFunction) {
  if ((req as any).user?.role !== 'admin') {
    return res.status(403).json({ error: 'Admin only' });
  }
  next();
}
```

## 4.2 Frontend থেকে Token পাঠানো

Frontend এ login এর পর JWT localStorage/session এ রাখুন। API call এ:

```typescript
headers: { Authorization: `Bearer ${token}` }
```

---

# Phase 5: Admin Debate Scheduling

## 5.1 Admin Route

- `/dashboard/admin/debates` – শুধু admin role এ দেখাবে
- Schedule button শুধু এখানে

## 5.2 Schedule Form Fields

| Field | Type | Required |
|-------|------|----------|
| title | string | ✅ |
| details | string | ✅ |
| topic | string | ✅ |
| tags | string[] | ❌ |
| positionA.userId | uuid | ✅ |
| positionB.userId | uuid | ✅ |
| moderator.userId | uuid | ❌ |
| scheduledAt | ISO datetime | ✅ |
| durationMinutes | number | ✅ |
| format | 'video' \| 'chat' | ✅ |
| youtubeLiveUrl | string | If video |

## 5.3 API: POST /api/debates

```typescript
// Backend
app.post('/api/debates', authMiddleware, adminOnly, async (req, res) => {
  const body = req.body;
  const debate = await pool.query(`
    INSERT INTO debates (title, details, topic, tags, participants, scheduled_at, duration_minutes, format, youtube_live_url, status, created_by)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, 'scheduled', $10)
    RETURNING *
  `, [body.title, body.details, body.topic, body.tags || [], JSON.stringify(body.participants), body.scheduledAt, body.durationMinutes, body.format, body.youtubeLiveUrl || null, req.user.id]);
  
  // Create invitations for participants
  // Create notifications for scholars
  res.json(debate.rows[0]);
});
```

---

# Phase 6: Notifications

## 6.1 Debate Scheduled – সব Scholars কে

```typescript
// After debate created
const scholars = await pool.query('SELECT id FROM users WHERE role = $1', ['scholar']);
for (const u of scholars.rows) {
  await pool.query(
    'INSERT INTO notifications (user_id, type, title, body, link) VALUES ($1, $2, $3, $4, $5)',
    [u.id, 'debate_scheduled', `New debate: ${debate.title}`, `Scheduled at ${scheduledAt}`, `/debates/${debate.id}`]
  );
}
// Optional: Trigger Pusher/Socket for real-time in-app notification
```

## 6.2 Invitation – Participants কে

```typescript
const participants = [positionA.userId, positionB.userId, moderator?.userId, ...extra];
for (const userId of participants) {
  const token = crypto.randomBytes(32).toString('hex');
  await pool.query(
    'INSERT INTO debate_invitations (debate_id, user_id, token, expires_at) VALUES ($1, $2, $3, $4)',
    [debateId, userId, token, new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)]
  );
  await pool.query(
    'INSERT INTO notifications (user_id, type, title, body, link) VALUES ($1, $2, $3, $4, $5)',
    [userId, 'debate_invitation', `You're invited: ${title}`, 'Join as participant', `/debates/${debateId}/join?token=${token}`]
  );
}
```

---

# Phase 7: Live Debate Page

## 7.1 Routes

| Route | Purpose |
|-------|---------|
| `/debates` | Public list |
| `/debates/[id]` | View (YouTube + chat) or redirect |
| `/debates/[id]/join?token=` | Participant join (token validate) |

## 7.2 Join Token Validation

```typescript
// GET /api/debates/:id/join?token=xxx
const inv = await pool.query(
  'SELECT * FROM debate_invitations WHERE debate_id = $1 AND token = $2 AND expires_at > NOW() AND used_at IS NULL',
  [debateId, token]
);
if (inv.rows.length === 0) return res.status(404).json({ error: 'Invalid or expired' });
// Mark used, return join URL
```

## 7.3 Viewer Page

- YouTube iframe (যদি format = video এবং youtubeLiveUrl আছে)
- Chat panel (Socket.io)
- Clarity voting

## 7.4 Participant Page

- Same as viewer + mic/camera controls (WebRTC বা Jitsi)
- Chat

---

# Phase 8: Frontend Integration

## 8.1 Environment

```env
# .env.local (Frontend)
NEXT_PUBLIC_API_URL=http://localhost:4000
NEXT_PUBLIC_WS_URL=http://localhost:4000
```

## 8.2 API Client

```typescript
// lib/api.ts
const API = process.env.NEXT_PUBLIC_API_URL;

export async function fetchDebates() {
  const res = await fetch(`${API}/api/debates`);
  return res.json();
}

export async function sendMessage(debateId: string, text: string, token: string) {
  const res = await fetch(`${API}/api/debates/${debateId}/messages`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ text }),
  });
  return res.json();
}
```

## 8.3 Socket Hook

```typescript
// hooks/useDebateSocket.ts
import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

export function useDebateSocket(debateId: string) {
  const [messages, setMessages] = useState([]);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const s = io(process.env.NEXT_PUBLIC_WS_URL!, { path: '/socket.io' });
    s.emit('join-debate', debateId);
    s.on('new-message', (m) => setMessages(prev => [...prev, m]));
    setSocket(s);
    return () => s.disconnect();
  }, [debateId]);

  const sendMessage = (text: string) => {
    socket?.emit('send-message', { debateId, text, userId: user?.id, name: user?.name });
  };

  return { messages, sendMessage };
}
```

---

# Phase 9: Advanced

## 9.1 Audio Messages

1. Frontend: `MediaRecorder` দিয়ে রেকর্ড
2. Upload: Backend `/api/upload` (multer) বা Cloudinary
3. Message: `{ type: 'audio', url: '...' }` Socket দিয়ে পাঠান

## 9.2 YouTube Embed

```tsx
const videoId = youtubeUrl?.match(/(?:live\/|v=)([a-zA-Z0-9_-]+)/)?.[1];
<iframe
  src={`https://www.youtube.com/embed/${videoId}`}
  allow="accelerometer; autoplay; clipboard-write; encrypted-media"
  allowFullScreen
  className="w-full aspect-video"
/>
```

## 9.3 Hand Raise, Clarity Vote

- Socket events: `hand-raise`, `vote-clarity`
- Backend: DB তে save, Socket দিয়ে broadcast

---

# Phase 10: Deployment (VM)

## 10.1 VM Setup

```bash
# Node.js
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# PostgreSQL
sudo apt install -y postgresql postgresql-contrib

# PM2
npm install -g pm2
```

## 10.2 Backend Deploy

```bash
cd backend
npm run build
pm2 start dist/index.js --name debate-api
pm2 save
pm2 startup
```

## 10.3 Nginx

```nginx
server {
  listen 80;
  server_name api.yourdomain.com;

  location / {
    proxy_pass http://127.0.0.1:4000;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";
    proxy_set_header Host $host;
  }

  location /socket.io/ {
    proxy_pass http://127.0.0.1:4000;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";
  }
}
```

## 10.4 Frontend (Vercel)

```bash
cd frontend
vercel
# Set env: NEXT_PUBLIC_API_URL=https://api.yourdomain.com
```

---

# Checklist (Order of Implementation)

## Basic
- [ ] Phase 1: PostgreSQL schema তৈরি
- [ ] Phase 2: Backend API (health, debates CRUD)
- [ ] Phase 3: Socket.io সংযুক্ত
- [ ] Phase 4: Auth middleware

## Core
- [ ] Phase 5: Admin schedule form + API
- [ ] Phase 6: Notifications + Invitations
- [ ] Phase 7: Live debate page (viewer)
- [ ] Phase 8: Frontend API + Socket hook

## Advanced
- [ ] Phase 9: Audio messages, YouTube, Hand raise, Vote
- [ ] Phase 10: VM deploy, Nginx, PM2

---

*PostgreSQL-based. Version 1.0 | March 2025*
