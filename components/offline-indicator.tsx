"use client"

import { useState, useEffect } from "react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { WifiOff, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"

export function OfflineIndicator() {
  const [isOnline, setIsOnline] = useState(true)
  const [showOfflineMessage, setShowOfflineMessage] = useState(false)

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true)
      setShowOfflineMessage(false)
    }

    const handleOffline = () => {
      setIsOnline(false)
      setShowOfflineMessage(true)
    }

    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    // Check initial status
    setIsOnline(navigator.onLine)
    if (!navigator.onLine) {
      setShowOfflineMessage(true)
    }

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [])

  const handleRetry = () => {
    window.location.reload()
  }

  if (!showOfflineMessage) return null

  return (
    <div className="fixed top-0 left-0 right-0 z-50">
      <Alert className="rounded-none bg-red-50 border-red-200 border-x-0 border-t-0">
        <WifiOff className="h-4 w-4 text-red-600" />
        <AlertDescription className="flex items-center justify-between w-full text-red-800">
          <span>You're offline. Some features may be limited.</span>
          <Button variant="outline" size="sm" onClick={handleRetry} className="ml-4 bg-transparent">
            <RefreshCw className="w-3 h-3 mr-1" />
            Retry
          </Button>
        </AlertDescription>
      </Alert>
    </div>
  )
}
