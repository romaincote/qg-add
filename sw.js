const CACHE = 'qg-add-v1';
const PAGE = self.location.pathname.replace(/sw\.js$/, '');

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.add(PAGE)));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  if (url.pathname !== PAGE && url.pathname !== PAGE.replace(/\/$/, '')) return;
  e.respondWith(fetch(e.request).catch(() => caches.match(PAGE)));
});
