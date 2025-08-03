import { SignInButton, SignUpButton } from "@clerk/nextjs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ShoppingCart, BarChart3, Users, Package } from "lucide-react"

export function AuthLanding() {
  const features = [
    {
      icon: ShoppingCart,
      title: "Point of Sale",
      description: "Modern POS system designed for African retail businesses",
    },
    {
      icon: Package,
      title: "Inventory Management",
      description: "Track stock levels, manage suppliers, and automate reordering",
    },
    {
      icon: BarChart3,
      title: "Sales Analytics",
      description: "Comprehensive reporting and business intelligence tools",
    },
    {
      icon: Users,
      title: "Customer Management",
      description: "Build customer relationships with loyalty programs and CRM",
    },
  ]

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="text-center mb-16">
        <h2 className="text-4xl font-bold text-gray-900 mb-4">Empowering African Retail Businesses</h2>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          ShopFlow provides comprehensive retail management solutions tailored for the African market. Sign up to test
          our authentication system and API integration.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <SignUpButton mode="modal">
            <button className="px-8 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-semibold text-lg transition-colors">
              Start Free Trial
            </button>
          </SignUpButton>
          <SignInButton mode="modal">
            <button className="px-8 py-3 border-2 border-orange-500 text-orange-600 hover:bg-orange-50 rounded-lg font-semibold text-lg transition-colors">
              Sign In to Dashboard
            </button>
          </SignInButton>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
        {features.map((feature, index) => (
          <Card key={index} className="text-center hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <feature.icon className="w-6 h-6 text-orange-600" />
              </div>
              <CardTitle className="text-lg">{feature.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>{feature.description}</CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="max-w-2xl mx-auto bg-gradient-to-r from-orange-500 to-amber-500 text-white">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Ready to Get Started?</CardTitle>
          <CardDescription className="text-orange-100 text-center">
            This demo app showcases Clerk authentication integration with your secured Express API
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <SignUpButton mode="modal">
            <button className="px-6 py-3 bg-white text-orange-600 hover:bg-gray-100 rounded-lg font-semibold transition-colors">
              Create Account
            </button>
          </SignUpButton>
        </CardContent>
      </Card>
    </div>
  )
}
