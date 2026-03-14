# Debates Feature – Deep Analysis

> **Updated:** Fixes applied – shared storage, Schedule Dialog, /debates/[id] route, live page fallbacks, useDebate(debateId).

## 1. Public Page: `/debates`

### Features
| Feature | Status | Notes |
|---------|--------|-------|
| Hero section | ✅ | "Scholarly Debates" with Ikhtilaf Panel badge |
| Stats grid | ✅ | Active Debates, Scholars, Topics, Clarity Votes (hardcoded) |
| Live banner | ✅ | Shows upcoming live debate, RSVP button |
| Search | ✅ | Filters by title/topic |
| Tab filters | ✅ | All, Active, Upcoming, Concluded, Written, Live |
| Debate cards | ✅ | DebateCard with status, format, participants |
| Scholar login modal | ✅ | ScholarLoginModal |
| RSVP modal | ✅ | DebateRSVPModal for upcoming debates |
| Scholar Dashboard toggle | ✅ | "My Dashboard" shows ScholarDashboardHome inline |
| Role cards | ✅ | Scholar + Reader cards |
| Adab notice | ✅ | Ethics of scholarly disagreement |
| Admin "Schedule New Debate" | ❌ **BROKEN** | Button sets `showScheduleDialog(true)` but **no Dialog component** – does nothing |

### Data Source
- **mockDebates** (3 items, hardcoded in page)
- Status: `active` | `upcoming` | `concluded`
- Format: `async` | `live`
- **NOT connected** to DebateService or any API

### Navigation Flow
| User Action | Result |
|-------------|--------|
| Click debate (upcoming) | Opens DebateRSVPModal |
| Click debate (active + live) | `/debates/livevideo/[id]` |
| Click debate (active/concluded + async) | `/debates/livechat/[id]` |
| "Browse Debates" (Reader card) | `handleViewDebate("1", "async", "active")` → `/debates/livechat/1` |

### Mock Data IDs
- **1**: Is Shura Binding (active, async) → livechat/1 ✓
- **2**: Modern Applications of Khilafah (upcoming, live) → RSVP or livevideo/2 ✓
- **3**: Conditions for Valid Bay'ah (concluded, async) → livechat/3 ✓

---

## 2. Dashboard Page: `/dashboard/debates`

### Access
- **Scholar role only** – redirects to `/dashboard` if not scholar

### Features
| Feature | Status | Notes |
|---------|--------|-------|
| Header + stats | ✅ | Total, Moderator, Completed, Upcoming |
| Schedule dialog | ✅ | Title, topic, date, time – toast only, no persistence |
| Live banner | ✅ | Shows live debate if exists |
| Filter tabs | ✅ | All, Live, Upcoming, Completed |
| Debate list | ✅ | Click opens LiveDebateRoom inline |
| Live room | ✅ | LiveDebateRoom with mock speakers |

### Data Source
- **Local `debates` array** (5 items, hardcoded in ScholarDebates.tsx)
- Structure: `{ id: number, title, status, participants, myRole, time, topic, duration }`
- Status: `live` | `upcoming` | `completed`
- **NOT connected** to public page or DebateService

### Issues
- Schedule dialog: saves to toast only, **no persistence**
- "Completed" click: toast "Summary view coming soon" – no actual view
- Different debate IDs (1–5) than public page (1–3)

---

## 3. Sub-pages

### `/debates/livevideo/[id]`
- **Mock data**: Only id `"2"` exists
- Renders LiveDebateRoom (video-style UI)
- IDs 1, 3 → "Live debate not found"

### `/debates/livechat/[id]`
- **Mock data**: IDs `"1"` and `"3"` exist
- Renders DebatePanel (text-based debate with positions, evidence)
- ID 2 → "Debate not found"

---

## 4. DebateService & useDebate

### DebateService
- Uses `Debate` type: `scheduled` | `live` | `completed` | `cancelled`
- Methods: getDebates, startDebate, voteClarity, submitQuestion, upvoteQuestion, approveQuestion, answerQuestion, endDebate, joinDebate, leaveDebate
- **Mock**: 1 debate only (different structure from public/dashboard mocks)

### useDebate(debateId?)
- Subscribes to DebateService
- Returns: debates, currentDebate, voteClarity, submitQuestion, etc.
- **Used by**: ScholarDebatesEnhanced only

### ScholarDebatesEnhanced
- Uses `useDebate()` but displays **MOCK_SCHOLAR_DEBATES** (4 items) – **service data ignored**
- `joinDebate()` / `endDebate()` from hook don't receive debateId – hook expects it from param
- **Not used** – dashboard renders ScholarDebates, not ScholarDebatesEnhanced

---

## 5. Connection & Sync Summary

| Component | Data Source | Connected To |
|-----------|-------------|--------------|
| Public /debates | mockDebates (3) | Nothing |
| Dashboard /dashboard/debates | ScholarDebates local (5) | Nothing |
| livevideo/[id] | mockLiveDebates (id 2) | Public mock id 2 only |
| livechat/[id] | mockTextDebates (id 1,3) | Public mock id 1, 3 |
| DebateService | 1 debate | useDebate → ScholarDebatesEnhanced (unused) |
| ScholarDebatesEnhanced | MOCK_SCHOLAR_DEBATES | useDebate (partial) |

**Result**: No shared data layer. Public, dashboard, live pages, and service all use separate mocks.

---

## 6. Bugs & Missing Features

### Bugs
1. **Admin "Schedule New Debate"** on `/debates` – no Dialog, button does nothing
2. **DebateCardEnhanced** links to `/debates/[id]` – route does not exist (404)
3. **useDebate** `joinDebate`/`endDebate` – require debateId but ScholarDebatesEnhanced calls without passing it

### Missing / Incomplete
1. Schedule dialog on public page (admin)
2. Persistence for scheduled debates (dashboard)
3. Sync between public debates list and dashboard
4. DebateService integration with UI
5. `/debates/[id]` route for debate detail (if using DebateCardEnhanced)
6. "Completed" debate summary view

---

## 7. Data Structure Mismatch

| Source | Status Values | ID Type | Key Fields |
|--------|---------------|---------|------------|
| Public mockDebates | active, upcoming, concluded | string | participants.positionA/B, format |
| Dashboard ScholarDebates | live, upcoming, completed | number | myRole, participants |
| DebateService | scheduled, live, completed, cancelled | string | positions.a/b, moderator |
| livevideo mock | - | string | speakers, moderator |
| livechat mock | active, concluded | string | positionA, positionB |

---

## 8. Recommendations

1. **Add Schedule Dialog** to public `/debates` for admin role
2. **Unify data** – single source (DebateService or API) for all debate lists
3. **Map statuses** – align active↔live, concluded↔completed across components
4. **Wire ScholarDebatesEnhanced** – use it in dashboard and connect to DebateService properly
5. **Fix useDebate** – pass debateId when calling joinDebate/endDebate
6. **Add `/debates/[id]`** route if DebateCardEnhanced is used, or remove that link
7. **Persist schedules** – save to localStorage/API when scholar schedules debate
