// Service Worker with Auto-Update logic
const CACHE_NAME = 'khiyar-app-v2';

self.addEventListener('install', (event) => {
  // Activate new service worker immediately
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache); // Delete old app versions automatically
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  // Always try network first to get the latest update from GitHub/Server
  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request))
);
});
