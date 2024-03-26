/**
 * NOTE: Do not MOVE this (sw.js) file. It must stay in the root of the static folder.
 */

// Workbox: https://developers.google.com/web/tools/workbox/modules/workbox-sw
importScripts('https://storage.googleapis.com/workbox-cdn/releases/5.1.2/workbox-sw.js');

// cache name
const CACHE = "sourcery-offline";

// change on update
const SW_VERSION = "1.0.0"; 

const offlineFallbackPage = "/offline.html";

// Additional assets to cache
const offlineAssets = [
    '/favicon.png'
] 

self.addEventListener("message", (event) => {
    if (event.data && event.data.type === "SKIP_WAITING") {
        self.skipWaiting();
    }
});

self.addEventListener('install', async (event) => {
    event.waitUntil(
        caches.open(CACHE)
            // .then((cache) => cache.add(offlineFallbackPage))
            .then((cache) => {
                // Combine all assets to cache
                cache.add(offlineFallbackPage)

                // Add all assets to cache
                cache.addAll(offlineAssets);
            })
    );
});

if (workbox.navigationPreload.isSupported()) {
    workbox.navigationPreload.enable();
}

self.addEventListener('fetch', (event) => {
    if (event.request.mode === 'navigate') {
        event.respondWith((async () => {
            try {
                const preloadResp = await event.preloadResponse;

                if (preloadResp) {
                    return preloadResp;
                }

                const networkResp = await fetch(event.request);
                return networkResp;
            } catch (error) {

                const cache = await caches.open(CACHE);
                const cachedResp = await cache.match(offlineFallbackPage);
                return cachedResp;
            }
        })());
    }
});