const CACHE_NAME = 'lista-compras-v1';
const ASSETS = [
  './Lista%20de%20Compras_29_GitHub.html',
  './manifest.json',
  './icons/icon-192.svg',
  './icons/icon-512.svg'
];

self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(
    keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
  )));
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(resp => {
      return resp || fetch(event.request).then(fetchResp => {
        return caches.open(CACHE_NAME).then(cache => {
          try { cache.put(event.request, fetchResp.clone()); } catch (e) {}
          return fetchResp;
        });
      });
    }).catch(() => caches.match('./Lista%20de%20Compras_29_GitHub.html'))
  );
});
