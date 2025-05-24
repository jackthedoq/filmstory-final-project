const CACHE_NAME = 'static-v1';
const FILES_TO_CACHE = [
  '/',
  '/index.html',
  '/scripts/app.js',
  '/styles/main.css',
  '/manifest.json',
  '/vite.svg'
];

self.addEventListener('install', (event) => {
  console.log('[SW] Installing...');
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(FILES_TO_CACHE);
    })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request).catch(() => caches.match('/index.html'));
    })
  );
});
