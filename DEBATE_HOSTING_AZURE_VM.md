# Debate Platform – Hosting with Azure + VM

## আপনার বর্তমান সেটআপ

- **Microsoft Azure Student Account** – $100–200 credit, অনেক সার্ভিস ফ্রি
- **VM + cPanel** – সব সময় চালু, sleep নেই

এই সেটআপে **Pusher, Koyeb, Render** এর দরকার নেই। সবকিছু নিজের ইনফ্রাস্ট্রাকচারে রাখা যায়।

---

## 1. আপডেটেড আর্কিটেকচার (Azure + VM)

| Component | Hosting | কারণ |
|-----------|---------|------|
| **Frontend** | Vercel / Azure Static Web Apps / VM | Vercel এখনো ভালো; Azure Static Web Apps ফ্রি টিয়ারে |
| **Backend API** | VM (Node.js) বা Azure App Service | VM সবসময় চালু, sleep নেই |
| **Real-time (Socket.io)** | VM (Node.js) | VM এ Socket.io সরাসরি চালানো যায় |
| **Database** | Azure Cosmos DB / MongoDB Atlas / VM MySQL | Azure Student এ Cosmos DB ফ্রি টিয়ার |
| **Video (Debaters)** | Jitsi / Daily.co / VM এ self-hosted Jitsi | VM এ Jitsi রাখা যায় |
| **Video (Viewers)** | YouTube Live | Unlimited viewers |

---

## 2. দুটি রিকমেন্ডেড পথ

### পথ A: VM-Centric (সবকিছু VM এ)

```
[Frontend] → Vercel (বা VM এ nginx + static files)
[Backend + Socket.io] → VM (Node.js, PM2)
[Database] → VM MySQL/PostgreSQL বা MongoDB
[Video] → Jitsi on VM বা meet.jit.si
```

**সুবিধা:** এক জায়গায় সব, কন্ট্রোল বেশি  
**অসুবিধা:** VM রিসোর্স শেয়ার করতে হবে

### পথ B: Azure + VM Hybrid

```
[Frontend] → Azure Static Web Apps (ফ্রি)
[Backend API] → Azure App Service (Node.js) – Student credit
[Socket.io] → VM (কেবল real-time সার্ভার)
[Database] → Azure Cosmos DB / MongoDB Atlas
[Video] → YouTube Live + Jitsi
```

**সুবিধা:** স্কেল করা সহজ, Azure ম্যানেজ করে  
**অসুবিধা:** কনফিগ একটু জটিল

---

## 3. রিকমেন্ডেশন: VM-Centric (পথ A)

যেহেতু VM + cPanel ইতিমধ্যে আছে:

1. **Frontend:** Vercel এ deploy করুন (Next.js) – বিনামূল্যে, দ্রুত
2. **Backend + Socket.io:** VM এ Node.js চালান (PM2 দিয়ে)
3. **Database:** VM এ MongoDB/MySQL অথবা MongoDB Atlas ফ্রি টিয়ার
4. **Real-time:** Socket.io VM এ – Pusher লাগবে না

---

## 4. VM এ Backend + Socket.io সেটআপ

### 4.1 Node.js ইনস্টল (যদি না থাকে)

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
```

### 4.2 প্রজেক্ট স্ট্রাকচার

```
/var/www/debate-backend/
├── server.js
├── package.json
└── .env
```

### 4.3 সার্ভার কোড (Socket.io সহ)

```javascript
// server.js
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors({ origin: '*' })); // Production এ আপনার frontend URL দিন
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*' },
  pingTimeout: 60000,
  pingInterval: 25000,
});

// REST API
app.post('/api/debates/:id/messages', (req, res) => {
  const { id } = req.params;
  const msg = req.body;
  io.to(`debate-${id}`).emit('new-message', msg);
  res.json({ ok: true });
});

// Socket.io
io.on('connection', (socket) => {
  socket.on('join-debate', (debateId) => {
    socket.join(`debate-${debateId}`);
  });
  socket.on('send-message', ({ debateId, ...msg }) => {
    io.to(`debate-${debateId}`).emit('new-message', msg);
  });
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => console.log(`Server on ${PORT}`));
```

### 4.4 PM2 দিয়ে চালানো

```bash
npm install -g pm2
cd /var/www/debate-backend
npm install
pm2 start server.js --name debate-api
pm2 save
pm2 startup
```

### 4.5 Nginx রিভার্স প্রক্সি (যদি থাকে)

```nginx
location /socket.io/ {
  proxy_http_version 1.1;
  proxy_set_header Upgrade $http_upgrade;
  proxy_set_header Connection "upgrade";
  proxy_pass http://127.0.0.1:4000;
}
```

---

## 5. Frontend থেকে Socket.io কানেক্ট

```bash
npm install socket.io-client
```

```javascript
// hooks/useDebateSocket.js
import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

export function useDebateSocket(debateId) {
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const s = io(process.env.NEXT_PUBLIC_API_URL, {
      path: '/socket.io',
      transports: ['websocket', 'polling'],
    });
    s.emit('join-debate', debateId);
    s.on('new-message', (msg) => setMessages(prev => [...prev, msg]));
    setSocket(s);
    return () => s.disconnect();
  }, [debateId]);

  const sendMessage = (text) => {
    socket?.emit('send-message', {
      debateId,
      userId: user?.id,
      name: user?.name,
      text,
      timestamp: new Date().toISOString(),
    });
  };

  return { messages, sendMessage };
}
```

---

## 6. Pusher vs Socket.io (আপনার ক্ষেত্রে)

| | Pusher | Socket.io (VM) |
|---|--------|----------------|
| **Cost** | Free tier limit | আপনার VM এ বিনামূল্যে |
| **Sleep** | নেই | VM এ sleep নেই |
| **Setup** | সহজ | একটু বেশি কনফিগ |
| **Control** | কম | পুরো কন্ট্রোল |

**সিদ্ধান্ত:** VM থাকলে **Socket.io** ব্যবহার করুন। Pusher শুধু তখনই দরকার যখন কোনো persistent server নেই (শুধু Vercel)।

---

## 7. Audio Messages (Messenger স্টাইল)

1. **Record:** `MediaRecorder` API
2. **Upload:** VM এ multer + একটা `/upload` endpoint অথবা Cloudinary
3. **Send:** Socket.io দিয়ে `{ type: 'audio', url: '...' }` পাঠান
4. **Play:** `<audio controls src={url} />`

### Cloudinary (ফ্রি) দিয়ে Audio

```javascript
// Frontend: Cloudinary unsigned upload
const formData = new FormData();
formData.append('file', audioBlob);
formData.append('upload_preset', 'your_unsigned_preset');
const res = await fetch('https://api.cloudinary.com/v1_1/YOUR_CLOUD/upload', {
  method: 'POST',
  body: formData,
});
const { secure_url } = await res.json();
// secure_url পাঠান Socket.io দিয়ে
```

---

## 8. Azure Student এ কী কী ফ্রি/সস্তা

- **App Service:** Free tier (F1)
- **Cosmos DB:** Free tier
- **Static Web Apps:** Free
- **Blob Storage:** ছোট প্রজেক্টের জন্য কম খরচ

চাইলে Database বা File Storage Azure এ নিয়ে যেতে পারেন।

---

## 9. পরবর্তী স্টেপ

1. VM এ Node.js + Socket.io backend চালু করুন
2. Frontend থেকে `NEXT_PUBLIC_API_URL` সেট করে কানেক্ট করুন
3. Chat টেস্ট করুন (২টা ব্রাউজার)
4. তারপর Audio message, YouTube embed যোগ করুন

---

## 10. সংক্ষিপ্ত তুলনা

| আগের প্ল্যান (Free only) | আপনার প্ল্যান (Azure + VM) |
|--------------------------|----------------------------|
| Pusher (signaling) | Socket.io VM এ |
| Koyeb/Render (sleep) | VM (no sleep) |
| MongoDB Atlas | VM MySQL বা Azure Cosmos DB |
| Vercel frontend | একই (Vercel) |

**উপসংহার:** আপনার সেটআপে Pusher/Koyeb/Render এর দরকার নেই। VM + Azure দিয়ে পুরো স্ট্যাক নিজেদের কন্ট্রোলে রাখা যায়।
