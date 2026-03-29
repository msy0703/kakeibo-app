const CACHE_VERSION = '20260329-002';
const CACHE = 'kakeibo-' + CACHE_VERSION;

self.addEventListener('install', (e) => {
  self.skipWaiting();
  e.waitUntil(
    caches.open(CACHE).then(cache =>
      cache.addAll([
        './kakeibo.html',
        'https://unpkg.com/dexie@4/dist/dexie.min.js',
        'https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js'
      ]).catch(err => {
        console.log('Cache add error:', err);
      })
    )
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((names) =>
      Promise.all(
        names
          .filter((name) => name.startsWith('kakeibo-') && !name.includes(CACHE_VERSION))
          .map((name) => caches.delete(name))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (e) => {
  // HTMLはネットワークファースト
  if (e.request.method === 'GET' && (e.request.url.endsWith('.html') || e.request.url.endsWith('/'))) {
    e.respondWith(
      fetch(e.request)
        .then((r) => {
          if (r.ok) {
            caches.open(CACHE).then((cache) => cache.put(e.request, r.clone()));
          }
          return r;
        })
        .catch(() => caches.match(e.request))
    );
  } else {
    // その他はキャッシュファースト
    e.respondWith(
      caches
        .match(e.request)
        .then((r) => r || fetch(e.request))
        .catch(() => new Response('', { status: 503 }))
    );
  }
});
