# Ummah Thoughts – Islamic Knowledge Platform

A comprehensive Next.js frontend for an Islamic knowledge and debate platform. Built with modern web technologies to support scholars, learners, and the wider Muslim community.

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Project Structure](#project-structure)
- [Key Features in Detail](#key-features-in-detail)
- [Deployment](#deployment)

---

## Overview

**Ummah Thoughts** is a full-featured Islamic knowledge platform that enables:

- **Live debates** between scholars with real-time video, chat, and clarity voting
- **Virtual backgrounds** with Islamic-themed images (mosque, geometric patterns, etc.)
- **Article publishing** with rich text editing and scholar verification
- **Historical battles** visualization on interactive maps
- **Multi-language support** (English, Bengali)
- **Role-based access** for scholars, moderators, writers, and learners

---

## Features

### 🎙️ Live Debates

- **Structured debate phases**: Opening → Position A → Position B → Rebuttal → Q&A → Closing
- **Real-time video** via LiveKit (when configured) or local WebRTC
- **Virtual backgrounds**:
  - **Blur** – Blur background behind the speaker (MediaPipe selfie segmentation)
  - **Islamic presets** – Mosque, Geometric, Teal Gradient, Arabesque, Minimal
- **Camera effects** – Grayscale, Sepia, Vintage, Warm, Cool, Invert
- **Clarity voting** – Viewers vote on which side is clearer
- **Q&A queue** – Submit questions, moderator approval, upvoting
- **Hand raise** – Request to speak
- **Evidence panel** – Quran, Hadith, scholarly references
- **YouTube Live streaming** – OBS Browser Source + Stream View for moderators

### 📝 Articles & Content

- **Rich text editor** (TipTap) – Tables, images, links, formatting
- **Writer dashboard** – Drafts, submissions, topics
- **Scholar verification** – Admin approval for scholar role
- **Archive** – Published articles and debate recordings

### 🗺️ Battles & History

- **Interactive maps** – Leaflet / MapLibre 3D
- **Timeline view** – Historical battle chronology
- **Battle quiz** – Test knowledge

### 👤 User & Dashboard

- **Auth** – Login, register, OAuth callback
- **Dashboard** – Profile, notifications, bookmarks, progress
- **Admin** – Users, moderation, audit log, analytics
- **i18n** – English and Bengali

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 16 (App Router, Turbopack) |
| UI | React 18, Tailwind CSS, Radix UI, Framer Motion |
| Video | LiveKit, MediaPipe Selfie Segmentation |
| Real-time | Pusher |
| Rich Text | TipTap |
| Maps | Leaflet, MapLibre GL |
| i18n | react-i18next |
| State | React Query, React Hook Form, Zod |

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm, yarn, pnpm, or bun

### Install

```bash
npm install
# or
yarn install
# or
pnpm install
```

### Run Development Server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

### Build

```bash
npm run build
```

### Start Production Server

```bash
npm start
```

---

## Environment Variables

Create `.env` from `.env.example`:

```env
# Backend API base URL (no trailing slash)
NEXT_PUBLIC_API_URL=http://localhost:4000

# Pusher (for real-time debate chat)
NEXT_PUBLIC_PUSHER_KEY=your-pusher-key
NEXT_PUBLIC_PUSHER_CLUSTER=ap1

# LiveKit (for live video debates)
LIVEKIT_API_KEY=your-api-key
LIVEKIT_API_SECRET=your-api-secret
LIVEKIT_URL=wss://your-project.livekit.cloud
NEXT_PUBLIC_LIVEKIT_ENABLED=false
```

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_API_URL` | Backend API base URL |
| `NEXT_PUBLIC_PUSHER_KEY` | Pusher app key for real-time chat |
| `NEXT_PUBLIC_PUSHER_CLUSTER` | Pusher cluster (e.g. `ap1`) |
| `LIVEKIT_API_KEY` | LiveKit API key |
| `LIVEKIT_API_SECRET` | LiveKit API secret |
| `LIVEKIT_URL` | LiveKit WebSocket URL |
| `NEXT_PUBLIC_LIVEKIT_ENABLED` | Enable LiveKit video (`true` / `false`) |

---

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── page.tsx            # Home
│   ├── debates/            # Debate pages
│   │   ├── [id]/           # Debate room
│   │   │   └── stream/     # OBS stream view
│   │   ├── livechat/       # Chat-only debate
│   │   └── livevideo/      # Video debate
│   ├── dashboard/          # User dashboard
│   ├── auth/               # Login, register, callback
│   ├── archive/            # Archived content
│   ├── battles/            # Historical battles
│   └── ...
├── components/
│   ├── debates/            # LiveDebateRoom, DebateVideoConference, etc.
│   ├── dashboard/          # Dashboard sections
│   ├── home/               # Landing page sections
│   ├── battles/            # Map, timeline, quiz
│   └── ui/                 # Shadcn-style components
├── contexts/               # Auth, Service, AdminActivity
├── hooks/                  # useVirtualBackground, useServices, etc.
├── lib/                    # API, utils, virtualBackgroundProcessor
├── services/               # API service layer
└── i18n/                   # Translations
```

---

## Key Features in Detail

### Virtual Backgrounds

Virtual backgrounds use **MediaPipe Selfie Segmentation** (loaded from CDN) to segment the person from the background and replace it with:

- **Blur** – Blurred camera feed
- **Islamic images** – SVG backgrounds in `public/backgrounds/`:
  - `mosque.svg` – Mosque silhouette
  - `geometric.svg` – Islamic geometric pattern
  - `teal-gradient.svg` – Teal gradient
  - `arabesque.svg` – Arabesque pattern
  - `minimal.svg` – Minimal teal gradient

Available in the debate room when using **non-LiveKit** mode. Access via the **Sparkles** (effects) button in the video controls.

### LiveKit Video

When `NEXT_PUBLIC_LIVEKIT_ENABLED=true` and credentials are set:

- Participants get real-time video via LiveKit
- ControlBar: mic, camera, screen share
- Grid layout for moderator + speakers

### OBS / YouTube Live

Moderators can stream debates to YouTube Live:

1. Start the debate
2. Open **Stream View** (`/debates/[id]/stream`)
3. Add OBS Browser Source with that URL
4. Configure YouTube Studio stream key
5. Start streaming from OBS

See `docs/YOUTUBE_LIVE_STREAMING_GUIDE.md` for full steps.

### Clarity Voting

Viewers vote on which side (A or B) presents their position more clearly. Results shown as percentages.

### Q&A Queue

- Viewers submit questions
- Moderator approves/rejects
- Upvoting for priority
- Approved questions visible to all

---

## Deployment

### Vercel (recommended)

1. Push to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### Other platforms

- Build: `npm run build`
- Start: `npm start`
- Ensure `NEXT_PUBLIC_*` vars are set at build time

---

## License

Private – Ummah Thoughts project.
