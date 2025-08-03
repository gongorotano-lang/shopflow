const CACHE_NAME = "shopflow-v1.0.0"
const STATIC_CACHE_NAME = "shopflow-static-v1.0.0"
const DYNAMIC_CACHE_NAME = "shopflow-dynamic-v1.0.0"

// Assets to cache immediately
const STATIC_ASSETS = [
  "/",
  "/sign-in",
  "/sign-up",
  "/manifest.json",
  "/icons/icon-192x192.png",
  "/icons/icon-512x512.png",
  // Add other critical assets
]

// API endpoints to cache
const API_CACHE_PATTERNS = [/\/api\/products/, /\/api\/inventory/, /\/api\/customers/, /\/api\/shop/]

// Install event - cache static assets
self.addEventListener("install", (event) => {
  console.log("Service Worker installing...")

  event.waitUntil(
    caches
      .open(STATIC_CACHE_NAME)
      .then((cache) => {
        console.log("Caching static assets")
        return cache.addAll(STATIC_ASSETS)
      })
      .then(() => {
        return self.skipWaiting()
      }),
  )
})

// Activate event - clean up old caches
self.addEventListener("activate", (event) => {
  console.log("Service Worker activating...")

  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== STATIC_CACHE_NAME && cacheName !== DYNAMIC_CACHE_NAME && cacheName !== CACHE_NAME) {
              console.log("Deleting old cache:", cacheName)
              return caches.delete(cacheName)
            }
          }),
        )
      })
      .then(() => {
        return self.clients.claim()
      }),
  )
})

// Fetch event - serve from cache, fallback to network
self.addEventListener("fetch", (event) => {
  const { request } = event
  const url = new URL(request.url)

  // Handle API requests
  if (url.pathname.startsWith("/api/")) {
    event.respondWith(handleApiRequest(request))
    return
  }

  // Handle navigation requests
  if (request.mode === "navigate") {
    event.respondWith(handleNavigationRequest(request))
    return
  }

  // Handle static assets
  event.respondWith(handleStaticRequest(request))
})

// Handle API requests with network-first strategy
async function handleApiRequest(request) {
  const cacheName = DYNAMIC_CACHE_NAME

  try {
    // Try network first
    const networkResponse = await fetch(request)

    // Cache successful responses
    if (networkResponse.ok) {
      const cache = await caches.open(cacheName)
      cache.put(request, networkResponse.clone())
    }

    return networkResponse
  } catch (error) {
    console.log("Network failed, trying cache for:", request.url)

    // Fallback to cache
    const cachedResponse = await caches.match(request)
    if (cachedResponse) {
      return cachedResponse
    }

    // Return offline response for critical API calls
    if (API_CACHE_PATTERNS.some((pattern) => pattern.test(request.url))) {
      return new Response(
        JSON.stringify({
          error: "Offline",
          message: "This data is not available offline",
          offline: true,
        }),
        {
          status: 503,
          statusText: "Service Unavailable",
          headers: { "Content-Type": "application/json" },
        },
      )
    }

    throw error
  }
}

// Handle navigation requests
async function handleNavigationRequest(request) {
  try {
    // Try network first
    const networkResponse = await fetch(request)
    return networkResponse
  } catch (error) {
    // Fallback to cached page or offline page
    const cachedResponse = await caches.match(request)
    if (cachedResponse) {
      return cachedResponse
    }

    // Return cached index page as fallback
    const fallbackResponse = await caches.match("/")
    if (fallbackResponse) {
      return fallbackResponse
    }

    // Return basic offline page
    return new Response(
      `
      <!DOCTYPE html>
      <html>
        <head>
          <title>ShopFlow - Offline</title>
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <style>
            body { 
              font-family: system-ui, sans-serif; 
              text-align: center; 
              padding: 2rem;
              background: linear-gradient(135deg, #fff7ed 0%, #fef3c7 100%);
              min-height: 100vh;
              margin: 0;
              display: flex;
              align-items: center;
              justify-content: center;
            }
            .container {
              max-width: 400px;
              background: white;
              padding: 2rem;
              border-radius: 1rem;
              box-shadow: 0 10px 25px rgba(0,0,0,0.1);
            }
            .logo {
              width: 64px;
              height: 64px;
              background: linear-gradient(135deg, #f97316 0%, #f59e0b 100%);
              border-radius: 12px;
              display: flex;
              align-items: center;
              justify-content: center;
              margin: 0 auto 1rem;
              color: white;
              font-weight: bold;
              font-size: 1.5rem;
            }
            h1 { color: #1f2937; margin-bottom: 0.5rem; }
            p { color: #6b7280; margin-bottom: 1.5rem; }
            button {
              background: #f97316;
              color: white;
              border: none;
              padding: 0.75rem 1.5rem;
              border-radius: 0.5rem;
              cursor: pointer;
              font-size: 1rem;
            }
            button:hover { background: #ea580c; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="logo">SF</div>
            <h1>You're Offline</h1>
            <p>ShopFlow is not available right now. Please check your internet connection and try again.</p>
            <button onclick="window.location.reload()">Try Again</button>
          </div>
        </body>
      </html>
      `,
      {
        status: 200,
        headers: { "Content-Type": "text/html" },
      },
    )
  }
}

// Handle static requests with cache-first strategy
async function handleStaticRequest(request) {
  const cachedResponse = await caches.match(request)

  if (cachedResponse) {
    return cachedResponse
  }

  try {
    const networkResponse = await fetch(request)

    // Cache successful responses
    if (networkResponse.ok) {
      const cache = await caches.open(STATIC_CACHE_NAME)
      cache.put(request, networkResponse.clone())
    }

    return networkResponse
  } catch (error) {
    console.log("Failed to fetch:", request.url)
    throw error
  }
}

// Background sync for offline actions
self.addEventListener("sync", (event) => {
  console.log("Background sync triggered:", event.tag)

  if (event.tag === "sync-sales") {
    event.waitUntil(syncOfflineSales())
  }

  if (event.tag === "sync-inventory") {
    event.waitUntil(syncOfflineInventory())
  }
})

// Sync offline sales data
async function syncOfflineSales() {
  try {
    // Get offline sales from IndexedDB or localStorage
    const offlineSales = getOfflineData("sales")

    if (offlineSales && offlineSales.length > 0) {
      for (const sale of offlineSales) {
        try {
          await fetch("/api/sales", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(sale),
          })

          // Remove synced sale from offline storage
          removeOfflineData("sales", sale.id)
        } catch (error) {
          console.error("Failed to sync sale:", error)
        }
      }
    }
  } catch (error) {
    console.error("Background sync failed:", error)
  }
}

// Sync offline inventory updates
async function syncOfflineInventory() {
  try {
    const offlineInventory = getOfflineData("inventory")

    if (offlineInventory && offlineInventory.length > 0) {
      for (const item of offlineInventory) {
        try {
          await fetch(`/api/inventory/${item.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(item),
          })

          removeOfflineData("inventory", item.id)
        } catch (error) {
          console.error("Failed to sync inventory:", error)
        }
      }
    }
  } catch (error) {
    console.error("Inventory sync failed:", error)
  }
}

// Helper functions for offline data management
function getOfflineData(type) {
  // This would typically use IndexedDB
  // For now, we'll use a simple approach
  return []
}

function removeOfflineData(type, id) {
  // Remove specific item from offline storage
  console.log(`Removing ${type} item ${id} from offline storage`)
}

// Push notification handling
self.addEventListener("push", (event) => {
  if (!event.data) return

  const data = event.data.json()
  const options = {
    body: data.body,
    icon: "/icons/icon-192x192.png",
    badge: "/icons/icon-72x72.png",
    data: data.data,
    actions: [
      {
        action: "view",
        title: "View",
        icon: "/icons/action-view.png",
      },
      {
        action: "dismiss",
        title: "Dismiss",
        icon: "/icons/action-dismiss.png",
      },
    ],
  }

  event.waitUntil(self.registration.showNotification(data.title, options))
})

// Notification click handling
self.addEventListener("notificationclick", (event) => {
  event.notification.close()

  if (event.action === "view") {
    event.waitUntil(clients.openWindow(event.notification.data.url || "/"))
  }
})
