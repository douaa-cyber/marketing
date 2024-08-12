
const CACHE_NAME = "my-cache-v1";
const cacheFiles = [
  '/',
  '/login',
  '/signup',
  '/styles.css',
 
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(cacheFiles))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});