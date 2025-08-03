import type React from "react"
import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import { ClerkProvider } from "@clerk/nextjs"
import { validateClerkConfig } from "@/lib/clerk-config"
import { PWAInstallPrompt } from "@/components/pwa-install-prompt"
import { OfflineIndicator } from "@/components/offline-indicator"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "ShopFlow - African Retail Management",
  description: "Comprehensive retail management system for African businesses",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "ShopFlow",
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: "website",
    siteName: "ShopFlow",
    title: "ShopFlow - African Retail Management",
    description: "Comprehensive retail management system for African businesses",
  },
  twitter: {
    card: "summary",
    title: "ShopFlow - African Retail Management",
    description: "Comprehensive retail management system for African businesses",
  },
    generator: 'v0.dev'
}

export const viewport: Viewport = {
  themeColor: "#f97316",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Validate Clerk configuration in development
  if (process.env.NODE_ENV === "development") {
    try {
      validateClerkConfig()
    } catch (error) {
      console.error("Clerk Configuration Error:", error)
    }
  }

  return (
    <ClerkProvider
      appearance={{
        elements: {
          formButtonPrimary: "bg-orange-500 hover:bg-orange-600 text-sm normal-case",
          card: "shadow-lg",
        },
      }}
    >
      <html lang="en">
        <head>
          {/* PWA meta tags */}
          <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
          <meta name="apple-mobile-web-app-capable" content="yes" />
          <meta name="apple-mobile-web-app-status-bar-style" content="default" />
          <meta name="apple-mobile-web-app-title" content="ShopFlow" />
          <meta name="mobile-web-app-capable" content="yes" />
          <meta name="msapplication-TileColor" content="#f97316" />
          <meta name="msapplication-tap-highlight" content="no" />

          {/* Service Worker Registration */}
          <script
            dangerouslySetInnerHTML={{
              __html: `
                if ('serviceWorker' in navigator) {
                  window.addEventListener('load', function() {
                    navigator.serviceWorker.register('/sw.js')
                      .then(function(registration) {
                        console.log('SW registered: ', registration);
                      })
                      .catch(function(registrationError) {
                        console.log('SW registration failed: ', registrationError);
                      });
                  });
                }
              `,
            }}
          />
        </head>
        <body className={inter.className}>
          <OfflineIndicator />
          {children}
          <PWAInstallPrompt />
        </body>
      </html>
    </ClerkProvider>
  )
}
