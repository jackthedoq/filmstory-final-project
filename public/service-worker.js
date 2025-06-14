// file: service-worker.js

const CACHE_NAME = 'filmstory-cache-v1';
const FILES_TO_CACHE = [
  '/',
  '/index.html',
  '/manifest.json',
  '/styles/main.css',
  '/scripts/app.js',
  '/scripts/utils/api.js',
  '/scripts/utils/indexeddb.js',
  '/scripts/views/home-view.js',
  '/scripts/views/login-view.js',
  '/scripts/views/register-view.js',
  '/scripts/views/detail-view.js',
  '/scripts/views/add-story-view.js',
  '/scripts/presenters/home-presenter.js',
  '/scripts/presenters/auth-presenter.js',
  '/scripts/presenters/detail-presenter.js',
  '/scripts/presenters/add-story-presenter.js',
  '/movie-128.png',
  '/movie-192.png',
  '/movie-512.png',
];


// Install event
self.addEventListener('install', (event) => {
  console.log('[SW] Installing...');
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(FILES_TO_CACHE);
    })
  );
  self.skipWaiting(); // langsung aktif
});

// Activate event
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('[SW] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch event
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request).catch(() => caches.match('/index.html'));
    })
  );
});

// ✅ PUSH: Show Notification
self.addEventListener('push', function (event) {
  console.log('[SW] Push received');

  let payloadText = '';
  try {
    payloadText = event.data?.text();
  } catch (e) {
    console.warn('[SW] No event.data received');
  }

  console.log('[SW] Payload:', payloadText);

  let data = {
    title: 'FilmStory',
    body: 'Ada cerita baru di FilmStory!',
    url: '/#/home'
  };

  if (event.data) {
    try {
      const json = event.data.json();
      data = { ...data, ...json };
    } catch (e) {
      console.warn('[SW] Push payload not JSON, using default');
    }
  }

  const options = {
    body: data.body,
    icon: '/movie-128.png',
    badge: '/movie-128.png',
    data: {
      url: data.url
    }
  };

event.waitUntil(
  self.registration.showNotification(data.title || 'FilmStory', options)
    .catch(err => {
      console.error('[SW] Error showing notification:', err);
    })
  );
});


// ✅ NOTIFICATION CLICK: Navigate to URL
self.addEventListener('notificationclick', function (event) {
  event.notification.close();

  const urlToOpen = new URL(event.notification.data.url, self.location.origin).href;

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url === urlToOpen && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(urlToOpen);
      }
    })
  );
});