// PWA utility functions
export const isPWAInstalled = (): boolean => {
  if (typeof window === "undefined") return false

  const isStandalone = window.matchMedia("(display-mode: standalone)").matches
  const isInWebAppiOS = (window.navigator as any).standalone === true

  return isStandalone || isInWebAppiOS
}

export const canInstallPWA = (): boolean => {
  if (typeof window === "undefined") return false

  // Check if browser supports PWA installation
  return "serviceWorker" in navigator && "PushManager" in window
}

export const registerServiceWorker = async (): Promise<ServiceWorkerRegistration | null> => {
  if (!("serviceWorker" in navigator)) {
    console.log("Service Worker not supported")
    return null
  }

  try {
    const registration = await navigator.serviceWorker.register("/sw.js", {
      scope: "/",
    })

    console.log("Service Worker registered successfully:", registration)

    // Handle updates
    registration.addEventListener("updatefound", () => {
      const newWorker = registration.installing
      if (newWorker) {
        newWorker.addEventListener("statechange", () => {
          if (newWorker.state === "installed" && navigator.serviceWorker.controller) {
            // New content is available, prompt user to refresh
            if (confirm("New version available! Refresh to update?")) {
              window.location.reload()
            }
          }
        })
      }
    })

    return registration
  } catch (error) {
    console.error("Service Worker registration failed:", error)
    return null
  }
}

export const unregisterServiceWorker = async (): Promise<boolean> => {
  if (!("serviceWorker" in navigator)) return false

  try {
    const registration = await navigator.serviceWorker.getRegistration()
    if (registration) {
      await registration.unregister()
      console.log("Service Worker unregistered")
      return true
    }
    return false
  } catch (error) {
    console.error("Service Worker unregistration failed:", error)
    return false
  }
}

// Cache management
export const clearAppCache = async (): Promise<void> => {
  if ("caches" in window) {
    const cacheNames = await caches.keys()
    await Promise.all(cacheNames.map((cacheName) => caches.delete(cacheName)))
    console.log("App cache cleared")
  }
}

// Offline storage utilities
export const saveToOfflineStorage = (key: string, data: any): void => {
  try {
    localStorage.setItem(
      `offline_${key}`,
      JSON.stringify({
        data,
        timestamp: Date.now(),
      }),
    )
  } catch (error) {
    console.error("Failed to save to offline storage:", error)
  }
}

export const getFromOfflineStorage = (key: string): any => {
  try {
    const stored = localStorage.getItem(`offline_${key}`)
    if (stored) {
      const parsed = JSON.parse(stored)
      return parsed.data
    }
    return null
  } catch (error) {
    console.error("Failed to get from offline storage:", error)
    return null
  }
}

export const clearOfflineStorage = (): void => {
  try {
    const keys = Object.keys(localStorage)
    keys.forEach((key) => {
      if (key.startsWith("offline_")) {
        localStorage.removeItem(key)
      }
    })
    console.log("Offline storage cleared")
  } catch (error) {
    console.error("Failed to clear offline storage:", error)
  }
}
