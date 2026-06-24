/**
 * Service Worker for Hassan Mohamed Portfolio
 * Enables offline functionality and caching
 */

const CACHE_NAME = 'hassan-portfolio-v25';
const ASSETS_TO_CACHE = [
    '/My_Portfolio/',
    '/My_Portfolio/index.html',
    '/My_Portfolio/about.html',
    '/My_Portfolio/projects.html',
    '/My_Portfolio/contact.html',
    '/My_Portfolio/css/style.css',
    '/My_Portfolio/css/fonts.css',
    '/My_Portfolio/css/bootstrap.min.css',
    '/My_Portfolio/css/bootstrap-icons.css',
    '/My_Portfolio/js/main.js',
    '/My_Portfolio/js/particles.js',
    '/My_Portfolio/js/bootstrap.bundle.min.js',
    '/My_Portfolio/images/h.webp',
    '/My_Portfolio/images/logo.png'
];

// Install event - cache assets
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('Caching app assets');
                return cache.addAll(ASSETS_TO_CACHE);
            })
            .catch((error) => {
                console.log('Cache failed:', error);
            })
    );
    self.skipWaiting();
});

// Activate event - clean old caches
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames
                    .filter((name) => name !== CACHE_NAME)
                    .map((name) => caches.delete(name))
            );
        })
    );
    self.clients.claim();
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
    // Skip non-GET requests
    if (event.request.method !== 'GET') return;

    event.respondWith(
        caches.match(event.request)
            .then((cachedResponse) => {
                if (cachedResponse) {
                    return cachedResponse;
                }

                return fetch(event.request)
                    .then((response) => {
                        // Don't cache non-successful responses
                        if (!response || response.status !== 200) {
                            return response;
                        }

                        // Clone and cache the response
                        const responseToCache = response.clone();
                        caches.open(CACHE_NAME)
                            .then((cache) => {
                                cache.put(event.request, responseToCache);
                            });

                        return response;
                    })
                    .catch(() => {
                        // Return offline page for navigation requests
                        if (event.request.mode === 'navigate') {
                            return caches.match('/My_Portfolio/index.html');
                        }
                    });
            })
    );
});
