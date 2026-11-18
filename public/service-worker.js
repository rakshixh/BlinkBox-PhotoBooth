const CACHE_NAME = 'blinkbox-shell-v3';
const SHELL_URLS = ['/', '/manifest.webmanifest', '/icon.svg', '/icon-192.svg', '/icon-512.svg'];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(SHELL_URLS)));
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))),
      ),
  );
  self.clients.claim();
});

self.addEventListener('message', (event) => {
  if (event.data?.type !== 'CACHE_APP_ASSETS' || !Array.isArray(event.data.assets)) return;
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      await Promise.all(
        event.data.assets.map(async (asset) => {
          const url = new URL(asset);
          if (url.origin !== self.location.origin || !url.pathname.startsWith('/_next/static/'))
            return;
          if (await cache.match(url.href)) return;

          try {
            const response = await fetch(url.href);
            if (response.ok) await cache.put(url.href, response);
          } catch {
            // Keep other cached assets available if one asset cannot be fetched.
          }
        }),
      );
    })(),
  );
});

self.addEventListener('fetch', (event) => {
  const request = event.request;
  if (request.method !== 'GET' || new URL(request.url).origin !== self.location.origin) return;

  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put('/', copy));
          return response;
        })
        .catch(() => caches.match('/')),
    );
    return;
  }

  if (new URL(request.url).pathname.startsWith('/_next/static/')) {
    event.respondWith(
      (async () => {
        const cache = await caches.open(CACHE_NAME);
        const cached = await cache.match(request);
        if (cached) return cached;

        const response = await fetch(request);
        if (response.ok) await cache.put(request, response.clone());
        return response;
      })().catch(() => caches.match(request)),
    );
  }
});
