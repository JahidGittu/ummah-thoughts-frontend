# Video Debate – Professional Review & Improvement Suggestions

## Current State (What’s Done)

- LiveKit integration for real-time video
- Role-based access (participant, registered viewer, public)
- Moderator controls in side panel (participants, viewers, debate flow)
- Moderator mic/camera controls
- Evidence layout: পক্ষ (A) left, বিপক্ষ (B) right
- Tooltips on important buttons
- YouTube Live streaming instructions
- Dynamic data (no mock defaults)
- Clarity voting synced with API

---

## Improvement Suggestions

### 1. Backend API

- **Evidence API**: `GET /api/debates/:id/evidences` – return evidence for each position
- **Q&A API**: Real-time Q&A via Pusher or WebSocket
- **Viewer count**: Real-time viewer count from LiveKit or Pusher
- **Debate state**: Sync phase, pause, start/end via API so all clients stay in sync

### 2. YouTube Live

- **OBS integration**: Add RTMP URL + stream key input in debate settings
- **Stream status**: Show “Streaming to YouTube” when OBS is connected
- **Embed**: When `youtubeLiveUrl` is set, show embed for non-participants

### 3. UX

- **Network indicator**: Show connection status (LiveKit/Pusher)
- **Reconnection**: Auto-reconnect on disconnect
- **Loading states**: Skeletons for video tiles
- **Mobile**: Improve touch targets and layout on small screens

### 4. Accessibility

- **Keyboard shortcuts**: Mute (M), camera (V), raise hand (H)
- **Screen reader**: ARIA labels for controls
- **Focus management**: Focus trap in dialogs

### 5. Performance

- **Lazy load**: Load LiveKit only when `useLiveKit` is true
- **Video quality**: Allow viewer to choose quality (LiveKit)
- **Bandwidth**: Detect low bandwidth and suggest lower quality

### 6. Moderation

- **Recording**: Start/stop recording (LiveKit Egress)
- **Chat moderation**: Mute/ban users in chat
- **Hand raise queue**: Show queue order, allow “call next”

### 7. Analytics

- **Viewer engagement**: Peak viewers, average watch time
- **Q&A stats**: Questions asked, approved, rejected
- **Vote summary**: Final clarity vote breakdown

---

## Priority Order

1. Evidence API + real-time Q&A
2. Debate state sync (phase, pause)
3. Viewer count
4. OBS/YouTube stream key in settings
5. Recording (LiveKit Egress)
6. Keyboard shortcuts
7. Mobile UX
