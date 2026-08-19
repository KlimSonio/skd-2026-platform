const CACHE_NAME = 'skd-2026-v6';

const ASSETS_TO_CACHE = [
  '/',
  '/app.html',
  '/app.js',
  '/manifest.json',
  '/assets/Images/logo_konferencja_skd_2026_250x146_01.png',
  '/assets/Images/Abbott.webp',
  '/assets/Images/ai_body.png',
  '/assets/Images/BostonScientific.webp',
  '/assets/Images/GE.webp',
  '/assets/Images/hammermed-logo.webp',
  '/assets/Images/Medtronic.webp',
  '/assets/Images/Phillips.webp',
  '/assets/Images/Samsung_Orig_Lettermark_BLUE_RGB.webp',
  '/assets/Images/Symico.webp'
];

// 1. Natychmiastowe przejście do działania
self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

// 2. Usunięcie wszystkich starych wersji cache
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// 3. Strategia Network-First z fallbackiem do cache
self.addEventListener('fetch', (event) => {
  if (!event.request.url.startsWith('http')) return;

  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200) {
          const responseClone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone);
          });
        }
        return networkResponse;
      })
      .catch(() => {
        return caches.match(event.request);
      })
  );
});