"use client"

import { useState, useEffect } from "react"
import { useAuth, useUser } from "@clerk/nextjs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertCircle, CheckCircle, Loader2, Server, Key, User, Store, Plus, Package } from "lucide-react"
import { ShopSetupFlow } from "./shop-setup-flow"

export function Dashboard() {
  const { getToken, userId } = useAuth()
  const { user } = useUser()
  const [hasShop, setHasShop] = useState(false)
  const [loading, setLoading] = useState(true)
  const [shops, setShops] = useState<any[]>([])

  // Check if user has completed shop setup
  useEffect(() => {
    const checkShopSetup = async () => {
      // Simulate checking if user has shops
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // For demo purposes, check localStorage or user metadata
      const hasCompletedSetup = localStorage.getItem(`shop_setup_${userId}`)
      setHasShop(!!hasCompletedSetup)

      if (hasCompletedSetup) {
        // Load user's shops
        setShops([
          {
            id: "1",
            name: "Mama Ngozi's Store",
            type: "general",
            location: "Lagos, Nigeria",
            status: "active",
          },
        ])
      }

      setLoading(false)
    }

    checkShopSetup()
  }, [userId])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-orange-500" />
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  // Show shop setup flow if user hasn't set up a shop
  if (!hasShop) {
    return <ShopSetupFlow />
  }

  // Show main dashboard if user has shops
  return <MainDashboard shops={shops} />
}

function MainDashboard({ shops }: { shops: any[] }) {
  const { getToken, userId } = useAuth()
  const [apiUrl, setApiUrl] = useState("http://localhost:3001/api")
  const [endpoint, setEndpoint] = useState("/protected")
  const [method, setMethod] = useState("GET")
  const [requestBody, setRequestBody] = useState("")
  const [response, setResponse] = useState("")
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle")

  const makeAuthenticatedRequest = async () => {
    setLoading(true)
    setStatus("idle")
    setResponse("")

    try {
      const token = await getToken()

      const options: RequestInit = {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }

      if (method !== "GET" && requestBody) {
        options.body = requestBody
      }

      const res = await fetch(`${apiUrl}${endpoint}`, options)
      const data = await res.text()

      setResponse(`Status: ${res.status} ${res.statusText}\n\n${data}`)
      setStatus(res.ok ? "success" : "error")
    } catch (error) {
      setResponse(`Error: ${error instanceof Error ? error.message : "Unknown error"}`)
      setStatus("error")
    } finally {
      setLoading(false)
    }
  }

  const testEndpoints = [
    { name: "Shop Info", endpoint: "/shop/info", method: "GET" },
    { name: "Products", endpoint: "/products", method: "GET" },
    { name: "Add Product", endpoint: "/products", method: "POST" },
    { name: "Sales Today", endpoint: "/sales/today", method: "GET" },
    { name: "Inventory", endpoint: "/inventory", method: "GET" },
    { name: "Customers", endpoint: "/customers", method: "GET" },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">ShopFlow Dashboard</h2>
        <p className="text-gray-600">Manage your retail business and test API integration</p>
      </div>

      {/* Shop Overview */}
      <div className="grid lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Active Shops</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{shops.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Today's Sales</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">₦45,230</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Products</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">1,247</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Low Stock Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">23</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* API Testing Section */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="request" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="request">API Testing</TabsTrigger>
              <TabsTrigger value="shops">My Shops</TabsTrigger>
              <TabsTrigger value="auth">Auth Info</TabsTrigger>
            </TabsList>

            <TabsContent value="request" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Server className="w-5 h-5" />
                    API Configuration
                  </CardTitle>
                  <CardDescription>Test authenticated requests to your Express API</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="apiUrl">API Base URL</Label>
                      <Input
                        id="apiUrl"
                        value={apiUrl}
                        onChange={(e) => setApiUrl(e.target.value)}
                        placeholder="http://localhost:3001/api"
                      />
                    </div>
                    <div>
                      <Label htmlFor="endpoint">Endpoint</Label>
                      <Input
                        id="endpoint"
                        value={endpoint}
                        onChange={(e) => setEndpoint(e.target.value)}
                        placeholder="/protected"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="method">HTTP Method</Label>
                    <select
                      id="method"
                      value={method}
                      onChange={(e) => setMethod(e.target.value)}
                      className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                    >
                      <option value="GET">GET</option>
                      <option value="POST">POST</option>
                      <option value="PUT">PUT</option>
                      <option value="DELETE">DELETE</option>
                    </select>
                  </div>

                  {method !== "GET" && (
                    <div>
                      <Label htmlFor="requestBody">Request Body (JSON)</Label>
                      <Textarea
                        id="requestBody"
                        value={requestBody}
                        onChange={(e) => setRequestBody(e.target.value)}
                        placeholder='{"name": "Product Name", "price": 29.99}'
                        rows={4}
                      />
                    </div>
                  )}

                  <Button
                    onClick={makeAuthenticatedRequest}
                    disabled={loading}
                    className="w-full bg-orange-500 hover:bg-orange-600"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Making Request...
                      </>
                    ) : (
                      "Send Authenticated Request"
                    )}
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    Response
                    {status === "success" && <CheckCircle className="w-5 h-5 text-green-500" />}
                    {status === "error" && <AlertCircle className="w-5 h-5 text-red-500" />}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Textarea
                    value={response}
                    readOnly
                    placeholder="Response will appear here..."
                    rows={10}
                    className="font-mono text-sm"
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="shops" className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <Store className="w-5 h-5" />
                        My Shops
                      </CardTitle>
                      <CardDescription>Manage your retail locations</CardDescription>
                    </div>
                    <Button variant="outline" size="sm">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Shop
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {shops.map((shop) => (
                      <div key={shop.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <h3 className="font-medium">{shop.name}</h3>
                          <p className="text-sm text-gray-600">{shop.location}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={shop.status === "active" ? "default" : "secondary"}>{shop.status}</Badge>
                          <Button variant="outline" size="sm">
                            Manage
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="auth" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Key className="w-5 h-5" />
                    Authentication Details
                  </CardTitle>
                  <CardDescription>Current authentication state and token information</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    <span className="font-medium">User ID:</span>
                    <Badge variant="secondary">{userId}</Badge>
                  </div>

                  <div>
                    <Label>JWT Token Preview</Label>
                    <Button
                      variant="outline"
                      onClick={async () => {
                        const token = await getToken()
                        setResponse(`Bearer Token:\n${token}`)
                      }}
                      className="w-full mt-2"
                    >
                      Get Current Token
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Quick Actions Sidebar */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Quick Test Endpoints</CardTitle>
              <CardDescription>Common retail API endpoints</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {testEndpoints.map((test, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="w-full justify-start bg-transparent"
                  onClick={() => {
                    setEndpoint(test.endpoint)
                    setMethod(test.method)
                  }}
                >
                  <Badge variant="secondary" className="mr-2 text-xs">
                    {test.method}
                  </Badge>
                  {test.name}
                </Button>
              ))}
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Shop Management</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start bg-transparent">
                <Package className="w-4 h-4 mr-2" />
                Manage Inventory
              </Button>
              <Button variant="outline" className="w-full justify-start bg-transparent">
                <User className="w-4 h-4 mr-2" />
                Team Members
              </Button>
              <Button variant="outline" className="w-full justify-start bg-transparent">
                <Server className="w-4 h-4 mr-2" />
                API Settings
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
