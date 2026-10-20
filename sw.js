/* Zorgt dat Tafelkampioen ook zonder internet start. Verhoog VERSIE na een aanpassing. */
var VERSIE = 'tafelkampioen-v1';
var BESTANDEN = [
  './', 'index.html', 'manifest.webmanifest', 'icon-192.png', 'icon-512.png', 'apple-touch-icon.png',
  'fonts/baloo-2-latin-600-normal.woff2', 'fonts/baloo-2-latin-800-normal.woff2',
  'fonts/lexend-latin-400-normal.woff2', 'fonts/lexend-latin-500-normal.woff2', 'fonts/lexend-latin-600-normal.woff2'
];
self.addEventListener('install', function (e) {
  e.waitUntil(caches.open(VERSIE).then(function (c) { return c.addAll(BESTANDEN); }).then(function () { return self.skipWaiting(); }));
});
self.addEventListener('activate', function (e) {
  e.waitUntil(caches.keys().then(function (namen) {
    return Promise.all(namen.filter(function (n) { return n !== VERSIE; }).map(function (n) { return caches.delete(n); }));
  }).then(function () { return self.clients.claim(); }));
});
self.addEventListener('fetch', function (e) {
  if (e.request.method !== 'GET') return;
  e.respondWith(caches.open(VERSIE).then(function (cache) {
    return cache.match(e.request, { ignoreSearch: true }).then(function (hit) {
      var net = fetch(e.request).then(function (res) {
        if (res && res.ok && res.type === 'basic') cache.put(e.request, res.clone());
        return res;
      }).catch(function () { return hit; });
      return hit || net;
    });
  }));
});
