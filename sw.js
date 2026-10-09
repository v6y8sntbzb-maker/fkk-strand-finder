const CACHE_NAME = "fkk-strand-finder-v58.20";
const APP_SHELL = [
  "./", "./index.html", "./style.css", "./app-v57.js", "./beach-background.png", "./manifest.webmanifest", "./app-icon.svg"
];
self.addEventListener("install", event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(APP_SHELL)).then(()=>self.skipWaiting()));
});
self.addEventListener("activate", event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k=>k!==CACHE_NAME).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));
});
self.addEventListener("fetch", event => {
  const req = event.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  // App-Dateien: Cache zuerst, damit die App auch ohne Netz startet.
  if (url.origin === location.origin) {
    event.respondWith(caches.match(req).then(cached => cached || fetch(req).then(res=>{
      const copy=res.clone(); caches.open(CACHE_NAME).then(c=>c.put(req,copy)); return res;
    }).catch(()=>caches.match("./index.html"))));
    return;
  }
  // Leaflet und Kartenkacheln: online laden und bereits gesehene Inhalte offline weiterverwenden.
  if (url.hostname.includes("unpkg.com") || url.hostname.endsWith("tile.openstreetmap.org")) {
    event.respondWith(caches.match(req).then(cached => cached || fetch(req, {mode:"no-cors"}).then(res=>{
      const copy=res.clone(); caches.open(CACHE_NAME).then(c=>c.put(req,copy)); return res;
    }).catch(()=>cached || new Response("", {status:504}))));
  }
});
