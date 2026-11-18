'use client';

import { useEffect } from 'react';

export function useOfflineAppCache() {
  useEffect(() => {
    if (!('serviceWorker' in navigator)) return;

    if (process.env.NODE_ENV !== 'production') {
      navigator.serviceWorker.getRegistrations().then((registrations) => {
        const workerUrl = new URL('/service-worker.js', location.origin).href;
        registrations
          .filter((registration) =>
            [registration.active, registration.waiting, registration.installing].some(
              (worker) => worker?.scriptURL === workerUrl,
            ),
          )
          .forEach((registration) => registration.unregister());
      });
      caches
        .keys()
        .then((keys) =>
          Promise.all(
            keys
              .filter((key) => key.startsWith('blinkbox-shell-'))
              .map((key) => caches.delete(key)),
          ),
        );
      return;
    }

    navigator.serviceWorker
      .register('/service-worker.js')
      .then(() =>
        navigator.serviceWorker.ready.then((registration) => {
          const assets = performance
            .getEntriesByType('resource')
            .map((entry) => new URL(entry.name))
            .filter(
              (url) => url.origin === location.origin && url.pathname.startsWith('/_next/static/'),
            )
            .map((url) => url.href);
          registration.active?.postMessage({ type: 'CACHE_APP_ASSETS', assets });
        }),
      )
      .catch(() => {});
  }, []);
}
