//file: push.cjs

const webpush = require('web-push');

webpush.setVapidDetails(
  'mailto:301103aajr@gmail.com',
  'BJQjAMpxWGi5oLOx-42CvpCrtRC1EEd7RgBZ9njuMUXcgDmajNvESbeBZfx_hkDLBtux6mM0inl7dHjbrg9C-MY',
  'VvfjfLWXwv2wEiootL2t-yRmm6vVWRiHrlgeCrPhyEw'
);

const subscription = {
  endpoint: 'https://fcm.googleapis.com/fcm/send/cPXLHuZo4dQ:APA91bH75Opp7r-3eaqKCiUtLrXDLDs0zjZK61RLwtfebeflexFTv3Bv--iU0PvH2E7PBVrwajaIt3bVbOONPJRn5XXIDum8LEA_2FBII2FYwaW70CG-uyy3qh1GF9QjJ-Po7DjyE3Z6',
  keys: {
    p256dh: 'BDpjQ25lRQTWaDx71-7CSmVnx4OsdxaWPY1N31QWPNmDrnnJugzj_v5J01c6Oo6CoaFVSHthAOXf7WzKpUAm7uw',
    auth: 'N_8L2WeSsDb9QKIytuBuuw'
  }
};

const payload = JSON.stringify({
  "title": "🎬 Cerita Baru!",
  "body": "Ada cerita film baru di FilmStory!",
  "url": "/#/home"
});

webpush.sendNotification(subscription, payload)
  .then(() => console.log('✅ Notification sent!'))
  .catch(console.error);
