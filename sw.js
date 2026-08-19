// Service Worker SKD 2026 - Wymuszenie aktualizacji
const CACHE_NAME = 'skd-2026-v2.3.0';

const PRECACHE_ASSETS = [
  '/app.html',
  '/css/style.css',
  '/css/splash.css',
  '/data/schedule.js',
  '/app.js',
  '/manifest.json'
];

// Instalacja i natychmiastowe pominięcie oczekiwania
self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(PRECACHE_ASSETS);
    })
  );
});

// Aktywacja i wyczyszczenie starych wersji cache
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log('Usuwanie starego cache PWA:', cache);
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Strategia Network-First (zawsze sprawdzaj sieć najpierw dla HTML/JS/CSS)
self.addEventListener('fetch', (event) => {
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