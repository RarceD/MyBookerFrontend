let CACHE_NAME = '-site-cache-v1';
const urlsToCache = [
    '/',
    '/index.html',
];
self.addEventListener('install', function (event) {
    // Perform install steps
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(function (cache) {
                return cache.addAll(urlsToCache);
            })
    );
});
self.addEventListener("fetch", (e) => {
});