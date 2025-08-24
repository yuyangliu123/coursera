importScripts('https://storage.googleapis.com/workbox-cdn/releases/5.1.4/workbox-sw.js');

// const CACHE_NAME = 'my-cache-v1';
// const urlsToCache = [
//   '/',
//   '/styles/main.css',
//   '/script/main.js'
// ];

// self.addEventListener('install', (event) => {
//   event.waitUntil(
//     caches.open(CACHE_NAME)
//       .then((cache) => {
//         console.log('Opened cache');
//         return cache.addAll(urlsToCache);
//       })
//   );
//   self.skipWaiting(); // 新增這行
// });

// self.addEventListener('activate', (event) => {
//   const cacheWhitelist = [CACHE_NAME];
//   event.waitUntil(
//     caches.keys().then((cacheNames) => {
//       return Promise.all(
//         cacheNames.map((cacheName) => {
//           if (cacheWhitelist.indexOf(cacheName) === -1) {
//             return caches.delete(cacheName);
//           }
//         })
//       );
//     })
//   );
//   self.clients.claim()
// });

// self.addEventListener('fetch', (event) => {
//   event.respondWith(
//     caches.match(event.request)
//       .then((response) => {
//         if (response) {
//           return response;
//         }
//         return fetch(event.request);
//       })
//   );
// });

workbox.routing.registerRoute(
  new RegExp('localhost'),
  new workbox.strategies.NetworkFirst()
);
workbox.routing.registerRoute(
  new RegExp('order2'),
  new workbox.strategies.NetworkFirst()
);
workbox.routing.registerRoute(
  new RegExp('.*\.js'),
  new workbox.strategies.NetworkFirst()
);

const networkFetch=['http://localhost:5000/reservation/',"http://localhost:5000/login2/"]

workbox.routing.registerRoute(
  ({ url, request }) => {
    return networkFetch.some((fetchUrl) => url.href.startsWith(fetchUrl)) && request.method === 'GET';
  },
  new workbox.strategies.NetworkOnly()
);

workbox.routing.registerRoute(
  new RegExp('.*\.css'),
  new workbox.strategies.StaleWhileRevalidate()
);

workbox.routing.registerRoute(
  new RegExp('.*\.webp'),
  new workbox.strategies.CacheFirst()
);

workbox.routing.registerRoute(
  new RegExp('.*\/images\/.*\.svg'),
  new workbox.strategies.CacheFirst()
);

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        if (response) {
          return response;
        }
        return fetch(event.request).catch(() => {
        });
      })
  );
});