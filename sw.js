const CACHE_NAME = 'skd-2026-v1.5';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/index-en.html',
  '/css/style.css',
  '/css/splash.css',
  '/data/schedule.js?v=1.5',
  '/js/app.js?v=1.5',
  '/js/config.js',
  '/manifest.json',
  '/assets/Images/logo_konferencja_skd_2026_250x146_01.png'
];

// Instalacja i natychmiastowe przejęcie kontroli
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS_TO_CACHE))
  );
  self.skipWaiting();
});

// Czyszczenie starych wersji pamięci podręcznej
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      )
    )
  );
  self.clients.claim();
});

// Strategia: Network First dla danych i stron HTML, Cache Fallback w trybie offline
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Dla HTML i danych dynamicznych pobieraj z sieci, a z cache tylko offline
  if (event.request.mode === 'navigate' || url.pathname.endsWith('.html') || url.pathname.includes('/data/')) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
          return response;
        })
        .catch(() => caches.match(event.request))
    );
    return;
  }

  // Dla assetów statycznych (grafiki, fonty)
  event.respondWith(
    caches.match(event.request).then((cached) => cached || fetch(event.request))
  );
});