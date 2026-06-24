const CACHE_NAME = "gb-tech-solutions-v4";
const APP_SHELL = [
  "/",
  "/index.html",
  "/apps/",
  "/apps/index.html",
  "/apps/gb-live-wallpaper/",
  "/apps/gb-live-wallpaper/index.html",
  "/privacy/gb-live-wallpaper/",
  "/privacy/gb-live-wallpaper/index.html",
  "/css/style.css",
  "/js/script.js",
  "/manifest.webmanifest",
  "/assets/img/logo-white.png",
  "/assets/img/logo-color.png",
  "/assets/img/GB-Live-Wallpaper.png",
  "/assets/img/visualizar.jpeg",
  "/assets/img/pwa-icon-192.png",
  "/assets/img/pwa-icon-512.png"
];

self.addEventListener("install", (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL))
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(
      keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
    )).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  if(event.request.method !== "GET") return;

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        const copy = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
        return response;
      })
      .catch(() => caches.match(event.request).then((cached) => cached || caches.match("/index.html")))
  );
});
