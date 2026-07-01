const CACHE_NAME = 'docshare-v2';
const ASSETS = [
  '/',
  '/index.html',
  '/css/styles.css',
  '/js/app.js',
  '/manifest.json'
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
});

self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;
  // Network first cho API
  if (e.request.url.includes('/api/')) {
    e.respondWith(
      fetch(e.request).catch(() => caches.match(e.request))
    );
    return;
  }
  
  // Cache first cho assets tĩnh
  e.respondWith(
    caches.match(e.request).then((res) => res || fetch(e.request))
  );
});
