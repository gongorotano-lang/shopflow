import { SignIn } from "@clerk/nextjs"

export default function Page() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-amber-50">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-amber-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">SF</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">ShopFlow</h1>
          </div>
          <p className="text-gray-600">Sign in to your retail management dashboard</p>
        </div>
        <SignIn
          appearance={{
            elements: {
              formButtonPrimary: "bg-orange-500 hover:bg-orange-600 text-sm normal-case",
              card: "shadow-lg",
              headerTitle: "text-gray-900",
              headerSubtitle: "text-gray-600",
            },
          }}
        />
      </div>
    </div>
  )
}
