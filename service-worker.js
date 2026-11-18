/**
 * Service Worker for Hassan Mohamed 3D Single-Page Backend Portfolio.
 * Uses relative paths so offline caching works seamlessly on both root and subpath origins.
 */

const CACHE_NAME = 'hassan-backend-3d-07a2739b90';
const ASSETS_TO_CACHE = [
    './',
    './index.html',
    './css/fonts.css',
    './css/style.css',
    './js/analytics.js',
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
    './images/apple-touch-icon.png',
    './images/app-icon-maskable.png',
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

function cacheMatchWithFallback(request) {
    return caches
        .match(request)
        .then((cached) => cached || caches.match(request, { ignoreSearch: true }));
}

function storeInCache(request, response) {
    if (!response || response.status !== 200) {
        return response;
    }
    const responseToCache = response.clone();
    caches.open(CACHE_NAME).then((cache) => {
        cache.put(request, responseToCache);
    });
    return response;
}

self.addEventListener('fetch', (event) => {
    if (event.request.method !== 'GET') return;

    const requestUrl = new URL(event.request.url);
    if (requestUrl.origin !== self.location.origin) return;

    // Network-first for HTML navigation so GitHub Pages updates propagate on reload
    if (event.request.mode === 'navigate') {
        event.respondWith(
            fetch(event.request, { cache: 'no-cache' })
                .then((response) => storeInCache(event.request, response))
                .catch(() => cacheMatchWithFallback('./index.html'))
        );
        return;
    }

    // Cache-first for fonts, images, and PDF assets (instant repeat loads)
    const pathname = requestUrl.pathname;
    if (/\.(?:woff2?|png|webp|jpg|jpeg|svg|ico|pdf)$/i.test(pathname)) {
        event.respondWith(
            cacheMatchWithFallback(event.request).then((cachedResponse) => {
                if (cachedResponse) return cachedResponse;
                return fetch(event.request).then((response) => storeInCache(event.request, response));
            })
        );
        return;
    }

    // Stale-while-revalidate for CSS, JS, and manifest
    event.respondWith(
        cacheMatchWithFallback(event.request).then((cachedResponse) => {
            const networkUpdate = fetch(event.request, { cache: 'no-cache' })
                .then((response) => storeInCache(event.request, response))
                .catch(() => cachedResponse);

            return cachedResponse || networkUpdate;
        })
    );
});
