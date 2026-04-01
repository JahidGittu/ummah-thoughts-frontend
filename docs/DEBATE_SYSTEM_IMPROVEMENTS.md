# Debate System – Review & Improvement Suggestions

## What’s Implemented

### 1. Debates page – real-time dynamic tabs
- **Polling**: Debates list refreshes every 30 seconds + on window focus.
- **Tab counts**: Each tab (All, Active, Upcoming, Concluded, Written, Live) shows live count.
- **Active indicator**: Pulsing dot when there are active debates.

### 2. Custom background – localStorage
- Custom uploaded images are stored in localStorage as base64 (max ~2MB).
- On next visit, the last custom background is auto-loaded.
- When a new image is uploaded, it replaces the previous one in storage.

### 3. Dynamic tabs (public/visitor – Live debate room)
- Tabs are shown based on phase and permissions:
  - **Q&A**: When `canUseQa` or there are approved questions, or user is moderator.
  - **Evidence**: When there is evidence or phase is position_a/position_b/rebuttal.
- Tab auto-switches when phase changes:
  - Q&A phase → Q&A tab
  - Position/rebuttal phases → Evidence tab

### 4. Debate flow and timing
- **Auto**: Phase countdown runs when debate is started and not paused.
- **Manual**: Moderator can advance phase with the “Next” button.
- Phase order: Opening → Position A → Position B → Rebuttal → Q&A → Closing.
- When time reaches 0, phase auto-advances to the next.

---

## Suggested Improvements

### Backend / API

1. **Phase sync**
   - Phase state is local to each client.
   - For multi-user debate, phases should be synced via API (e.g. `PUT /api/debates/:id/phase`) and Pusher.
   - All participants should receive the same phase from the server.

2. **Debate API**
   - Add `GET /api/debates/:id/phase` to get current phase.
   - Add `PUT /api/debates/:id/phase` for moderator to change phase.
   - Emit events when phase changes (e.g. `debate-phase-changed`).

3. **Evidence**
   - Add `GET /api/debates/:id/evidences` for live evidence.
   - Add `POST /api/debates/:id/evidences` for scholars to submit evidence during debate.

4. **Q&A**
   - Add `GET /api/debates/:id/questions` for live questions.
   - Add `POST /api/debates/:id/questions` for viewers to submit.
   - Add `PATCH /api/debates/:id/questions/:qId/approve` for moderator approval.

### UI / UX

5. **Speaker indicators**
   - Show which participant is speaking in the current phase (e.g. “Position A speaking”).
   - Visual cue (e.g. border or ring) when it’s a participant’s turn.

6. **Phase duration**
   - Phase durations are hardcoded.
   - Consider making them configurable per debate (e.g. in debate settings).

7. **Notifications**
   - Show toast when phase changes.
   - Notify when Q&A is unlocked, when hand raise is admitted, etc.

8. **Mobile**
   - Review layout on small screens.
   - Ensure touch targets and controls are usable.

### Security

9. **Permissions**
   - Moderator unlock (Q&A, chat, hand raise) is local state.
   - These should be persisted and synced via API.

10. **Rate limiting**
    - Add rate limits for chat, Q&A, and hand raise.

### Performance

11. **Reconnection**
    - Handle LiveKit disconnection and reconnection.
    - Restore phase and UI state after reconnect.

12. **Caching**
    - Cache debate list and details.
    - Use `stale-while-revalidate` for debate data.

---

## Current Limitations

- Phase state is local; no sync between participants.
- Evidence is mock data; not from API.
- Q&A questions are local; no persistence.
- Moderator unlocks (Q&A, chat, hand raise) are local only.

---

## Files to Update for Phase Sync

1. `src/app/api/debates/[id]/phase/route.ts` – add phase API.
2. `src/components/debates/LiveDebateRoom.tsx` – fetch phase, subscribe to Pusher.
3. `src/app/debates/[id]/page.tsx` – pass initial phase from API.
