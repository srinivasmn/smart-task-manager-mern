// Basic service worker caching for offline support
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", () => console.log("Service Worker active"));

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.open("app-cache").then((cache) =>
      cache.match(event.request).then((res) =>
        res || fetch(event.request).then((response) => {
          cache.put(event.request, response.clone());
          return response;
        })
      )
    )
  );
});
