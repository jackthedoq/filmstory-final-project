// file: server/server.js

import express from 'express';
import webpush from 'web-push';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { resolve } from 'path';
import cors from 'cors';

const { setVapidDetails, sendNotification } = webpush;

const app = express();
const PORT = process.env.PORT || 8000;

setVapidDetails(
  'mailto:301103aajr@gmail.com',
  'BJQjAMpxWGi5oLOx-42CvpCrtRC1EEd7RgBZ9njuMUXcgDmajNvESbeBZfx_hkDLBtux6mM0inl7dHjbrg9C-MY',
  'VvfjfLWXwv2wEiootL2t-yRmm6vVWRiHrlgeCrPhyEw'
);

app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  console.log(`📩 ${req.method} ${req.url}`);
  next();
});

const SUB_FILE = resolve('./server/subscriptions.json');

function loadSubscriptions() {
  if (!existsSync(SUB_FILE)) return [];
  return JSON.parse(readFileSync(SUB_FILE));
}

function saveSubscriptions(subs) {
  writeFileSync(SUB_FILE, JSON.stringify(subs, null, 2));
}

app.post('/save-subscription', (req, res) => {
  const subs = loadSubscriptions();
  const exists = subs.some(s => s.endpoint === req.body.endpoint);
  if (!exists) {
    subs.push(req.body);
    saveSubscriptions(subs);
    console.log('✅ Subscription saved:', req.body.endpoint);
  }
  res.status(201).json({ message: 'Subscription saved.' });
});

app.post('/send-notification', async (req, res) => {
  const subs = loadSubscriptions();

  const payload = JSON.stringify({
    title: '🎬 Cerita Baru!',
    body: 'Ada cerita film baru di FilmStory!',
    url: '/#/home'
  });

app.post('/trigger-notification', async (req, res) => {
  const { title = '🎬 Cerita Baru!', body = 'Ada cerita film baru di FilmStory!', url = '/#/home' } = req.body;
  const subs = loadSubscriptions();

  const payload = JSON.stringify({ title, body, url });

  const results = await Promise.allSettled(
    subs.map(sub => sendNotification(sub, payload))
  );

  res.status(200).json({ message: 'Notification triggered.', results });
});


  const results = await Promise.allSettled(
    subs.map(sub => sendNotification(sub, payload))
  );

  res.status(200).json({ message: 'Notifications sent.', results });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
