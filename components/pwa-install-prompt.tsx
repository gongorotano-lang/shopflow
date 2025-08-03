"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Download, Smartphone, X, Wifi, WifiOff } from "lucide-react"

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[]
  readonly userChoice: Promise<{
    outcome: "accepted" | "dismissed"
    platform: string
  }>
  prompt(): Promise<void>
}

export function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [showInstallPrompt, setShowInstallPrompt] = useState(false)
  const [isInstalled, setIsInstalled] = useState(false)
  const [isOnline, setIsOnline] = useState(true)

  useEffect(() => {
    // Check if app is already installed
    const isStandalone = window.matchMedia("(display-mode: standalone)").matches
    const isInWebAppiOS = (window.navigator as any).standalone === true
    setIsInstalled(isStandalone || isInWebAppiOS)

    // Listen for beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e as BeforeInstallPromptEvent)

      // Don't show prompt immediately, wait for user interaction
      setTimeout(() => {
        if (!localStorage.getItem("pwa-install-dismissed")) {
          setShowInstallPrompt(true)
        }
      }, 5000) // Show after 5 seconds
    }

    // Listen for app installed event
    const handleAppInstalled = () => {
      setIsInstalled(true)
      setShowInstallPrompt(false)
      setDeferredPrompt(null)
    }

    // Listen for online/offline events
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt)
    window.addEventListener("appinstalled", handleAppInstalled)
    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    // Check initial online status
    setIsOnline(navigator.onLine)

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt)
      window.removeEventListener("appinstalled", handleAppInstalled)
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [])

  const handleInstallClick = async () => {
    if (!deferredPrompt) return

    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice

    if (outcome === "accepted") {
      setDeferredPrompt(null)
      setShowInstallPrompt(false)
    }
  }

  const dismissPrompt = () => {
    setShowInstallPrompt(false)
    localStorage.setItem("pwa-install-dismissed", "true")
  }

  if (isInstalled) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Alert className="bg-green-50 border-green-200">
          <Smartphone className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            ShopFlow is installed! Access it from your home screen.
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  if (!showInstallPrompt || !deferredPrompt) {
    return (
      <>
        {/* Offline indicator */}
        {!isOnline && (
          <div className="fixed top-0 left-0 right-0 z-50 bg-red-500 text-white text-center py-2 text-sm">
            <WifiOff className="inline w-4 h-4 mr-2" />
            You're offline. Some features may be limited.
          </div>
        )}
      </>
    )
  }

  return (
    <>
      {/* Offline indicator */}
      {!isOnline && (
        <div className="fixed top-0 left-0 right-0 z-50 bg-red-500 text-white text-center py-2 text-sm">
          <WifiOff className="inline w-4 h-4 mr-2" />
          You're offline. Some features may be limited.
        </div>
      )}

      {/* Install prompt */}
      <div className="fixed bottom-4 right-4 z-40 max-w-sm">
        <Card className="shadow-lg border-orange-200">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-amber-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">SF</span>
                </div>
                <div>
                  <CardTitle className="text-lg">Install ShopFlow</CardTitle>
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={dismissPrompt}>
                <X className="w-4 h-4" />
              </Button>
            </div>
            <CardDescription>
              Install ShopFlow for faster access and offline capabilities. Perfect for managing your shop on the go!
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Wifi className="w-4 h-4 text-green-500" />
                <span>Works offline</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Smartphone className="w-4 h-4 text-blue-500" />
                <span>Native app experience</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Download className="w-4 h-4 text-purple-500" />
                <span>Quick access from home screen</span>
              </div>

              <div className="flex gap-2 pt-2">
                <Button onClick={handleInstallClick} className="flex-1 bg-orange-500 hover:bg-orange-600">
                  <Download className="w-4 h-4 mr-2" />
                  Install App
                </Button>
                <Button variant="outline" onClick={dismissPrompt}>
                  Later
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  )
}
