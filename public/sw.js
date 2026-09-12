// NUTRI-OPTIMA Bulletproof Service Worker
const CACHE_NAME = 'nutri-optima-v2';

// Safe assets to cache
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.webmanifest',
  '/favicon.png',
  '/favicon.svg',
  '/icon.svg',
  '/pwa-192x192.png',
  '/pwa-512x512.png',
  '/pwa-maskable-512x512.png'
];

self.addEventListener('install', (event) => {
  // Activate immediately without waiting
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return Promise.all(
        STATIC_ASSETS.map((url) => {
          return fetch(url, { cache: 'no-cache' })
            .then((res) => {
              if (res.ok) {
                return cache.put(url, res);
              }
            })
            .catch(() => {
              // Ignore individual asset cache failure
            });
        })
      );
    })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const request = event.request;

  // Only handle HTTP/HTTPS GET requests, exclude API calls and chrome-extension
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  if (url.pathname.startsWith('/api/') || !url.protocol.startsWith('http')) return;

  // Google fonts: Cache-first
  if (url.origin.includes('fonts.googleapis.com') || url.origin.includes('fonts.gstatic.com')) {
    event.respondWith(
      caches.match(request).then((cached) => {
        if (cached) return cached;
        return fetch(request).then((networkRes) => {
          if (networkRes && networkRes.ok) {
            const clone = networkRes.clone();
            caches.open('google-fonts-cache').then((c) => c.put(request, clone));
          }
          return networkRes;
        }).catch(() => new Response('', { status: 200 }));
      })
    );
    return;
  }

  // Network-First with Cache Fallback for maximum reliability on mobile devices
  event.respondWith(
    fetch(request)
      .then((networkRes) => {
        // Cache valid 200 responses
        if (networkRes && networkRes.status === 200 && (networkRes.type === 'basic' || networkRes.type === 'cors')) {
          const clone = networkRes.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, clone);
          });
        }
        return networkRes;
      })
      .catch(async () => {
        // If network fails (offline / disconnected), try cache
        const cachedRes = await caches.match(request);
        if (cachedRes) return cachedRes;

        // If navigation request fails, return cached index.html
        if (request.mode === 'navigate') {
          const indexRes = await caches.match('/index.html') || await caches.match('/');
          if (indexRes) return indexRes;
        }

        // Never return undefined to respondWith - return a clean fallback Response
        return new Response(
          '<!DOCTYPE html><html><head><meta charset="utf-8"><title>NUTRI-OPTIMA Offline</title></head><body style="font-family:sans-serif;text-align:center;padding:40px;"><h2>NUTRI-OPTIMA</h2><p>Koneksi internet Anda sedang terputus. Silakan hubungkan kembali perangkat Anda ke internet lalu muat ulang halaman.</p><button onclick="location.reload()" style="padding:10px 20px;background:#059669;color:white;border:none;border-radius:8px;cursor:pointer;">Muat Ulang</button></body></html>',
          {
            status: 200,
            headers: { 'Content-Type': 'text/html; charset=utf-8' }
          }
        );
      })
  );
});
