const CACHE_NAME = "notedown-shell-v1";
const APP_SHELL = ["/", "/index.html", "/icons/noteDownIcon.svg"];
const DATABASE_NAME = "notedown";
const STORE_NAME = "images";

self.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => cache.addAll(APP_SHELL))
            .then(() => self.skipWaiting())
    );
});

self.addEventListener("activate", (event) => {
    event.waitUntil(self.clients.claim());
});

self.addEventListener("fetch", (event) => {
    if (event.request.method !== "GET") return;
    const requestURL = new URL(event.request.url);
    if (requestURL.origin === self.location.origin && requestURL.pathname.startsWith("/api/")) {
        event.respondWith(getImageResponse(requestURL.pathname.slice("/api/".length)));
        return;
    }
    event.respondWith(
        caches.match(event.request).then((cachedResponse) => (
            cachedResponse || fetch(event.request).then((networkResponse) => {
                if (new URL(event.request.url).origin === self.location.origin) {
                    const responseToCache = networkResponse.clone();
                    caches.open(CACHE_NAME).then((cache) => cache.put(event.request, responseToCache));
                }
                return networkResponse;
            })
        ))
    );
});

const getImageResponse = (id) => new Promise((resolve) => {
    const request = indexedDB.open(DATABASE_NAME);
    request.onsuccess = () => {
        const database = request.result;
        const imageRequest = database.transaction(STORE_NAME, "readonly")
            .objectStore(STORE_NAME)
            .get(id);
        imageRequest.onsuccess = () => {
            database.close();
            const image = imageRequest.result;
            resolve(image
                ? new Response(image.blob, { headers: { "Content-Type": image.type || image.blob.type } })
                : new Response("Image not found", { status: 404 }));
        };
        imageRequest.onerror = () => {
            database.close();
            resolve(new Response("Unable to load image", { status: 500 }));
        };
    };
    request.onerror = () => resolve(new Response("Image storage unavailable", { status: 500 }));
});
