const CACHE_NAME = 'v1';
const urlsToCache = [
  '/',
  '/login' ,
  'form'
 
  
];

// Install event: caching resources
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
      .then(() => self.skipWaiting())
  );
});

// Activate event: cleaning up old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  return self.clients.claim();
});
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        return response || fetch(event.request)
          .then(networkResponse => {
            if (event.request.url.includes('/summary/')) {
              return caches.open(CACHE_NAME).then(cache => {
                cache.put(event.request.url, networkResponse.clone());
                return networkResponse;
              });
            }
            return networkResponse;
          });
      })
  );
});

