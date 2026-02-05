// Service Worker for Ramadan App
const CACHE_NAME = 'ramadan-v4-persistence';
const urlsToCache = [
    '/',
    '/index.html',
    '/quran.html',
    '/prayer.html',
    '/tracker.html',
    '/adhkar.html',
    '/names.html',
    '/quiz.html',
    '/tafsir.html',
    '/bookmarks.html',
    '/hadith.html',
    '/reciters.html',
    '/radio.html',
    '/tasbih.html',
    '/verse.html',
    '/cards.html',
    '/zakat.html',
    '/khatma.html',
    '/moshaf.html',
    '/css/style.css',
    '/js/main.js',
    '/js/notifications.js',
    '/data/adkar.json',
    '/data/Allah-99-names.json'
];

// Install event - cache resources
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('Opened cache');
                return cache.addAll(urlsToCache);
            })
            .catch((err) => {
                console.log('Cache failed:', err);
            })
    );
    self.skipWaiting();
});

// Activate event - clean old caches
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
    self.clients.claim();
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
    // Exclude radio streams from being handled by the Service Worker
    // This prevents "Active Mixed Content" blocking issues
    const url = new URL(event.request.url);
    if (url.hostname.includes('radiojar.com') ||
        url.hostname.includes('qurango.net') ||
        url.hostname.includes('mp3quran.net') ||
        url.hostname.includes('api.aladhan.com')) {
        return; // Bypass Service Worker
    }

    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                // Cache hit - return response
                if (response) {
                    return response;
                }
                return fetch(event.request);
            })
    );
});

// Push notification event
self.addEventListener('push', (event) => {
    const data = event.data ? event.data.json() : {};
    const title = data.title || 'رمضان كريم';
    const options = {
        body: data.body || 'تذكير من تطبيق رمضان',
        icon: '/images/icon-192.png?v=1',
        badge: '/images/icon-192.png?v=1',
        vibrate: [200, 100, 200],
        tag: data.tag || 'ramadan-notification',
        requireInteraction: false,
        data: {
            url: data.url || '/index.html'
        },
        dir: 'rtl',
        lang: 'ar'
    };

    event.waitUntil(
        self.registration.showNotification(title, options)
    );
});

// Notification click event
self.addEventListener('notificationclick', (event) => {
    event.notification.close();

    const urlToOpen = event.notification.data.url || '/index.html';

    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true })
            .then((windowClients) => {
                // Check if there's already a window open
                for (let client of windowClients) {
                    if (client.url === urlToOpen && 'focus' in client) {
                        return client.focus();
                    }
                }
                // Open new window
                if (clients.openWindow) {
                    return clients.openWindow(urlToOpen);
                }
            })
    );
});
