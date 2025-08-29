// Service Worker for OneFeed TH UI
const CACHE_NAME = 'onefeed-v1'
const API_CACHE_NAME = 'onefeed-api-v1'

// Static assets to cache
const STATIC_CACHE = [
  '/',
  '/manifest.json',
  // Next.js static assets will be cached automatically
]

// API endpoints to cache
const API_ENDPOINTS = [
  '/api/v1/news',
  '/api/v1/tags',
]

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('Service Worker installing...')
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Caching static assets')
        return cache.addAll(STATIC_CACHE)
      })
      .then(() => {
        // Skip waiting to activate immediately
        return self.skipWaiting()
      })
  )
})

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker activating...')
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME && cacheName !== API_CACHE_NAME) {
            console.log('Deleting old cache:', cacheName)
            return caches.delete(cacheName)
          }
        })
      )
    }).then(() => {
      // Take control of all clients immediately
      return self.clients.claim()
    })
  )
})

// Fetch event - implement caching strategy
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url)
  
  // Only handle GET requests
  if (event.request.method !== 'GET') {
    return
  }
  
  // Handle API requests
  if (url.hostname === 'onefeed-th-api.artzakub.com') {
    event.respondWith(handleApiRequest(event.request))
    return
  }
  
  // Handle static assets with cache-first strategy
  if (event.request.destination === 'image' || 
      event.request.destination === 'script' ||
      event.request.destination === 'style') {
    event.respondWith(handleStaticAssets(event.request))
    return
  }
  
  // Handle navigation requests (pages)
  if (event.request.mode === 'navigate') {
    event.respondWith(handleNavigation(event.request))
    return
  }
  
  // For everything else, try network first
  event.respondWith(
    fetch(event.request).catch(() => {
      return caches.match(event.request)
    })
  )
})

// Handle API requests with network-first, cache fallback
async function handleApiRequest(request) {
  try {
    // Try network first
    const networkResponse = await fetch(request)
    
    if (networkResponse.ok) {
      // Cache successful responses
      const cache = await caches.open(API_CACHE_NAME)
      cache.put(request, networkResponse.clone())
      
      // Add timestamp for cache management
      const responseWithTimestamp = networkResponse.clone()
      
      return networkResponse
    }
    
    // If network response is not ok, try cache
    throw new Error('Network response not ok')
    
  } catch (error) {
    console.log('Network failed for API request, trying cache:', request.url)
    
    // Try to get from cache
    const cachedResponse = await caches.match(request)
    
    if (cachedResponse) {
      // Add a header to indicate this is from cache
      const response = cachedResponse.clone()
      response.headers.set('X-Served-From', 'sw-cache')
      return response
    }
    
    // Return a fallback response for news API
    if (request.url.includes('/news')) {
      return new Response(JSON.stringify({
        data: [],
        error: 'ไม่สามารถโหลดข่าวได้ในขณะนี้ กรุณาตรวจสอบการเชื่อมต่ออินเทอร์เน็ต',
        offline: true
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      })
    }
    
    // For other API requests, return the error
    return new Response(JSON.stringify({
      error: 'ไม่สามารถเชื่อมต่อได้',
      offline: true
    }), {
      status: 503,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}

// Handle static assets with cache-first strategy
async function handleStaticAssets(request) {
  const cachedResponse = await caches.match(request)
  
  if (cachedResponse) {
    // Update cache in background if needed
    fetch(request).then((response) => {
      if (response.ok) {
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(request, response)
        })
      }
    }).catch(() => {
      // Ignore network errors for background updates
    })
    
    return cachedResponse
  }
  
  try {
    const networkResponse = await fetch(request)
    
    if (networkResponse.ok) {
      const cache = await caches.open(CACHE_NAME)
      cache.put(request, networkResponse.clone())
    }
    
    return networkResponse
  } catch (error) {
    // Return a placeholder for images if offline
    if (request.destination === 'image') {
      return new Response(
        '<svg width="400" height="300" xmlns="http://www.w3.org/2000/svg"><rect width="100%" height="100%" fill="#f3f4f6"/><text x="50%" y="50%" text-anchor="middle" fill="#9ca3af">ไม่สามารถโหลดรูปภาพได้</text></svg>',
        { headers: { 'Content-Type': 'image/svg+xml' } }
      )
    }
    
    throw error
  }
}

// Handle navigation with network-first strategy
async function handleNavigation(request) {
  try {
    const networkResponse = await fetch(request)
    
    if (networkResponse.ok) {
      // Cache the page
      const cache = await caches.open(CACHE_NAME)
      cache.put(request, networkResponse.clone())
    }
    
    return networkResponse
  } catch (error) {
    // Try to get from cache
    const cachedResponse = await caches.match(request)
    
    if (cachedResponse) {
      return cachedResponse
    }
    
    // Return offline page fallback
    return caches.match('/') || new Response(
      '<!DOCTYPE html><html><head><title>ออฟไลน์</title></head><body><h1>ไม่สามารถเชื่อมต่อได้</h1><p>กรุณาตรวจสอบการเชื่อมต่ออินเทอร์เน็ต</p></body></html>',
      { headers: { 'Content-Type': 'text/html; charset=utf-8' } }
    )
  }
}

// Handle background sync (for future implementation)
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync-news') {
    console.log('Background syncing news...')
    event.waitUntil(doBackgroundSync())
  }
})

async function doBackgroundSync() {
  // This could be used to sync news in the background
  // For now, just clear old API cache entries
  try {
    const cache = await caches.open(API_CACHE_NAME)
    const requests = await cache.keys()
    
    // Remove cache entries older than 1 hour
    const oneHourAgo = Date.now() - (60 * 60 * 1000)
    
    for (const request of requests) {
      const response = await cache.match(request)
      if (response) {
        const dateHeader = response.headers.get('date')
        if (dateHeader && new Date(dateHeader).getTime() < oneHourAgo) {
          await cache.delete(request)
        }
      }
    }
  } catch (error) {
    console.error('Background sync error:', error)
  }
}

// Handle push notifications (for future implementation)
self.addEventListener('push', (event) => {
  if (event.data) {
    const data = event.data.json()
    
    const options = {
      body: data.body || 'ข่าวใหม่จาก OneFeed TH',
      icon: '/icon-192.png',
      badge: '/icon-192.png',
      tag: 'news-update',
      data: {
        url: data.url || '/'
      }
    }
    
    event.waitUntil(
      self.registration.showNotification(data.title || 'OneFeed TH', options)
    )
  }
})

// Handle notification click
self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  
  const url = event.notification.data?.url || '/'
  
  event.waitUntil(
    clients.openWindow(url)
  )
})