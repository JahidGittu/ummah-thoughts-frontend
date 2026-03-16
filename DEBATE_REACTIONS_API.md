# Debate Message Reactions – Backend API

## Overview

Users can react to chat messages with emojis (👍 🤔 💡 ❤️ 🔥 📖). Reactions are stored per message and per user (one reaction per user per message; toggling replaces previous).

---

## Database

```sql
-- Message reactions: one reaction per user per message
CREATE TABLE debate_message_reactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  debate_id UUID NOT NULL REFERENCES debates(id) ON DELETE CASCADE,
  message_id UUID NOT NULL,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  emoji VARCHAR(10) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(debate_id, message_id, user_id)
);

CREATE INDEX idx_reactions_message ON debate_message_reactions(debate_id, message_id);
```

---

## API Endpoint

### POST `/api/debates/:id/messages/:messageId/reactions`

**Auth:** Required (Bearer token)

**Body:**
```json
{ "emoji": "👍" }
```

**Valid emojis:** `👍` `🤔` `💡` `❤️` `🔥` `📖`

**Behavior:** Toggle reaction. If user already reacted with same emoji → remove. If different emoji → replace (user can change reaction). If no reaction → add.

**Response:**
```json
{
  "success": true,
  "reactions": {
    "👍": 2,
    "❤️": 1
  },
  "myReaction": "👍"
}
```
`myReaction`: Current user's emoji for this message, or `""`/`null` if none.

---

## Example Implementation (Node.js/Express)

```javascript
// POST /api/debates/:id/messages/:messageId/reactions
app.post('/api/debates/:id/messages/:messageId/reactions', authMiddleware, async (req, res) => {
  const { id: debateId, messageId } = req.params;
  const { emoji } = req.body;
  const userId = req.user.id;

  const VALID = ['👍', '🤔', '💡', '❤️', '🔥', '📖'];
  if (!emoji || !VALID.includes(emoji)) {
    return res.status(400).json({ error: 'Invalid emoji' });
  }

  // Check if message exists and belongs to debate
  const msg = await db.query(
    'SELECT id FROM debate_messages WHERE id = $1 AND debate_id = $2',
    [messageId, debateId]
  );
  if (!msg.rows[0]) return res.status(404).json({ error: 'Message not found' });

  // Upsert: delete existing, insert new (toggle if same emoji)
  const existing = await db.query(
    'SELECT emoji FROM debate_message_reactions WHERE debate_id = $1 AND message_id = $2 AND user_id = $3',
    [debateId, messageId, userId]
  );

  if (existing.rows[0]) {
    if (existing.rows[0].emoji === emoji) {
      await db.query(
        'DELETE FROM debate_message_reactions WHERE debate_id = $1 AND message_id = $2 AND user_id = $3',
        [debateId, messageId, userId]
      );
    } else {
      await db.query(
        'UPDATE debate_message_reactions SET emoji = $1 WHERE debate_id = $2 AND message_id = $3 AND user_id = $4',
        [emoji, debateId, messageId, userId]
      );
    }
  } else {
    await db.query(
      'INSERT INTO debate_message_reactions (debate_id, message_id, user_id, emoji) VALUES ($1, $2, $3, $4)',
      [debateId, messageId, userId, emoji]
    );
  }

  // Get aggregated counts
  const counts = await db.query(
    `SELECT emoji, COUNT(*) as c FROM debate_message_reactions 
     WHERE debate_id = $1 AND message_id = $2 GROUP BY emoji`,
    [debateId, messageId]
  );
  const reactions = {};
  counts.rows.forEach(r => { reactions[r.emoji] = parseInt(r.c, 10); });

  res.json({ success: true, reactions });
});
```

---

## Required: Include reactions in GET messages (for persistence on reload)

**GET /api/debates/:id/messages** must return each message with `reactions` and `myReaction` so reactions persist and user can change on reload:

```json
{
  "success": true,
  "messages": [
    {
      "id": "...",
      "userId": "...",
      "userName": "...",
      "text": "...",
      "createdAt": "...",
      "reactions": { "👍": 2, "❤️": 1 },
      "myReaction": "👍"
    }
  ]
}
```

- `reactions`: Aggregated counts per emoji.
- `myReaction`: Current user's emoji for this message (when authenticated), or omit/empty if none. Needed so user can see and change their reaction after reload.

Query (include reactions + current user's reaction):
```sql
SELECT m.*, 
  (SELECT jsonb_object_agg(emoji, cnt) FROM (
    SELECT emoji, COUNT(*)::int as cnt 
    FROM debate_message_reactions 
    WHERE debate_id = m.debate_id AND message_id = m.id 
    GROUP BY emoji
  ) t) as reactions,
  (SELECT emoji FROM debate_message_reactions 
   WHERE debate_id = m.debate_id AND message_id = m.id AND user_id = $2) as "myReaction"
FROM debate_messages m
WHERE debate_id = $1
ORDER BY created_at;
```
(Pass current user id as $2 when authenticated.)

---

## Pusher (optional real-time)

Broadcast when someone reacts so other clients update:

```javascript
pusher.trigger(`debate-${debateId}`, 'message-reaction', {
  messageId,
  reactions: { "👍": 2, "❤️": 1 }
});
```

Frontend can listen and update `liveReactions` state.
