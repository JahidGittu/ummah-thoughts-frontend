# রিলোডের পর রিয়্যাকশন দেখাতে ব্যাকএন্ড চেকলিস্ট

রিলোডের পর রিয়্যাকশন দেখা যাচ্ছে না কারণ **ব্যাকএন্ড GET messages রেসপন্সে `reactions` পাঠাচ্ছে না**।

---

## যা করতে হবে

### ১. POST – রিয়্যাকশন সেভ করা (ইতিমধ্যে থাকলে স্কিপ করুন)
```
POST /api/debates/:id/messages/:messageId/reactions
Body: { "emoji": "👍" }
```
- রিয়্যাকশন ডাটাবেজে সেভ করুন
- একই ইমোজি = রিমুভ, ভিন্ন ইমোজি = চেঞ্জ

### ২. GET messages – প্রতিটি মেসেজে reactions ও myReaction পাঠানো (জরুরি)

**GET /api/debates/:id/messages** রেসপন্সে প্রতিটি মেসেজে এই দুটো ফিল্ড থাকতে হবে:

```json
{
  "success": true,
  "messages": [
    {
      "id": "msg-123",
      "userId": "user-1",
      "userName": "Ahmad",
      "text": "Hello",
      "createdAt": "2025-03-14T10:00:00Z",
      "reactions": { "👍": 2, "❤️": 1 },
      "myReaction": "👍"
    }
  ]
}
```

- **reactions**: প্রতিটি ইমোজির কাউন্ট
- **myReaction**: লগইন ইউজারের রিয়্যাকশন (নেইলে omit বা `""`)

---

## ডাটাবেজ টেবিল

```sql
CREATE TABLE debate_message_reactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  debate_id UUID NOT NULL,
  message_id UUID NOT NULL,
  user_id UUID NOT NULL,
  emoji VARCHAR(10) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(debate_id, message_id, user_id)
);
```

---

## চেক করুন

1. Browser DevTools → Network → `GET .../messages` রিকোয়েস্ট
2. Response-এ প্রতিটি মেসেজে `reactions` ও `myReaction` আছে কিনা দেখুন
3. না থাকলে ব্যাকএন্ডে এই ফিল্ডগুলো যোগ করুন

বিস্তারিত: `DEBATE_REACTIONS_API.md`
