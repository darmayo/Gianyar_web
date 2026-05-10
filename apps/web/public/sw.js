/**
 * Service Worker — Portal Kabupaten Gianyar
 * Fitur: Offline cache, background sync, push notification-ready
 */

const CACHE_NAME = 'gianyar-v1'
const OFFLINE_URL = '/offline'

// Asset yang selalu di-cache saat install
const PRECACHE_URLS = [
  '/',
  '/offline',
  '/darurat',
  '/manifest.json',
  '/icons/icon.svg',
]

// Install: cache halaman penting
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(PRECACHE_URLS).catch((err) => {
        console.warn('[SW] Precache partial fail:', err)
      })
    }).then(() => self.skipWaiting())
  )
})

// Activate: hapus cache lama
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      )
    ).then(() => self.clients.claim())
  )
})

// Fetch: Network-first dengan offline fallback
self.addEventListener('fetch', (event) => {
  // Hanya handle GET request
  if (event.request.method !== 'GET') return
  // Skip chrome-extension dan non-http
  if (!event.request.url.startsWith('http')) return
  // Skip API requests (jangan cache)
  if (event.request.url.includes('/api/')) return

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Cache response yang berhasil
        if (response && response.status === 200) {
          const cloned = response.clone()
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, cloned)
          })
        }
        return response
      })
      .catch(() => {
        // Offline: coba cache dulu
        return caches.match(event.request).then((cached) => {
          if (cached) return cached
          // Untuk navigation, tampilkan halaman offline
          if (event.request.mode === 'navigate') {
            return caches.match(OFFLINE_URL)
          }
          return new Response('Tidak tersedia offline', { status: 503 })
        })
      })
  )
})
