import { SignedIn, SignedOut } from "@clerk/nextjs"
import { UserButton } from "@clerk/nextjs"
import { Dashboard } from "@/components/dashboard"
import { AuthLanding } from "@/components/auth-landing"
import Link from "next/link"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50">
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-amber-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">SF</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">ShopFlow</h1>
            <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">African Retail Management</span>
          </Link>
          <div className="flex items-center space-x-4">
            <SignedIn>
              <UserButton afterSignOutUrl="/" />
            </SignedIn>
            <SignedOut>
              <Link href="/sign-in">
                <button className="px-4 py-2 text-orange-600 hover:text-orange-700 font-medium">Sign In</button>
              </Link>
              <Link href="/sign-up">
                <button className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium transition-colors">
                  Get Started
                </button>
              </Link>
            </SignedOut>
          </div>
        </div>
      </header>

      <main>
        <SignedOut>
          <AuthLanding />
        </SignedOut>
        <SignedIn>
          <Dashboard />
        </SignedIn>
      </main>
    </div>
  )
}
