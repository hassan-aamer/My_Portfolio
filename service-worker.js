/**
 * Service Worker for Hassan Mohamed 3D Single-Page Backend Portfolio.
 * Uses relative paths so offline caching works seamlessly on both root and subpath origins.
 */

const CACHE_NAME = 'hassan-backend-3d-v5';
const ASSETS_TO_CACHE = [
    './',
    './index.html',
    './css/fonts.css',
    './css/style.css',
    './js/math3d.js',
    './js/data.js',
    './js/scene3d.js',
    './js/topology3d.js',
    './js/sphere3d.js',
    './js/app.js',
    './fonts/pxiEyp8kv8JHgFVrJJfecg.woff2',
    './fonts/pxiByp8kv8JHgFVrLCz7Z1xlFQ.woff2',
    './fonts/Yq6W-LOTXCb04q32xlpwu8Zf.woff2',
    './fonts/tDbv2o-flEEny0FZhsfKu5WU4zr3E_BX0PnT8RD8yKwBNntkaToggR7BYRbKPxDcwg.woff2',
    './favicon.ico',
    './images/h.webp',
    './images/favicon.svg',
    './images/favicon.png',
    './images/logo.png',
    './Hassan Mohamed - Software Engineer CV.pdf',
    './manifest.json'
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches
            .open(CACHE_NAME)
            .then((cache) => cache.addAll(ASSETS_TO_CACHE))
            .catch(() => {
                // Ignore individual cache errors during installation
            })
    );
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) =>
            Promise.all(
                cacheNames
                    .filter((name) => name !== CACHE_NAME)
                    .map((name) => caches.delete(name))
            )
        )
    );
    self.clients.claim();
});

self.addEventListener('fetch', (event) => {
    if (event.request.method !== 'GET') return;

    const requestUrl = new URL(event.request.url);
    if (requestUrl.origin !== self.location.origin) return;

    event.respondWith(
        caches
            .match(event.request)
            .then((cachedResponse) => cachedResponse || caches.match(event.request, { ignoreSearch: true }))
            .then((cachedResponse) => {
                if (cachedResponse) {
                    return cachedResponse;
                }

                return fetch(event.request)
                    .then((response) => {
                        if (!response || response.status !== 200) {
                            return response;
                        }
                        const responseToCache = response.clone();
                        caches.open(CACHE_NAME).then((cache) => {
                            cache.put(event.request, responseToCache);
                        });
                        return response;
                    })
                    .catch(() => {
                        if (event.request.mode === 'navigate') {
                            return caches.match('./index.html');
                        }
                        return undefined;
                    });
            })
    );
});
