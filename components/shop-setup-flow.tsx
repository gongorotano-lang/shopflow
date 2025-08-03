"use client"

import { useState } from "react"
import { useUser } from "@clerk/nextjs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Store,
  MapPin,
  Users,
  CreditCard,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  Building2,
  ShoppingCart,
  Milk,
  Coffee,
  Shirt,
  Wrench,
  Heart,
  Zap,
} from "lucide-react"

interface ShopData {
  basicInfo: {
    name: string
    type: string
    description: string
    phone: string
    email: string
  }
  location: {
    address: string
    city: string
    state: string
    country: string
    postalCode: string
  }
  business: {
    currency: string
    taxRate: string
    businessHours: {
      open: string
      close: string
    }
    operatingDays: string[]
  }
  team: {
    role: string
    teamSize: string
  }
}

const shopTypes = [
  { id: "dairy", name: "Dairy Shop", icon: Milk, description: "Milk, yogurt, cheese, and dairy products" },
  {
    id: "general",
    name: "General Store",
    icon: Store,
    description: "Groceries, household items, and daily essentials",
  },
  { id: "pharmacy", name: "Pharmacy", icon: Heart, description: "Medicines, health products, and medical supplies" },
  { id: "electronics", name: "Electronics", icon: Zap, description: "Mobile phones, accessories, and gadgets" },
  { id: "clothing", name: "Clothing Store", icon: Shirt, description: "Fashion, apparel, and accessories" },
  { id: "hardware", name: "Hardware Store", icon: Wrench, description: "Tools, building materials, and hardware" },
  { id: "cafe", name: "Café/Restaurant", icon: Coffee, description: "Food, beverages, and dining services" },
  {
    id: "supermarket",
    name: "Supermarket",
    icon: ShoppingCart,
    description: "Large retail store with various products",
  },
]

const currencies = [
  { code: "NGN", name: "Nigerian Naira (₦)", symbol: "₦" },
  { code: "KES", name: "Kenyan Shilling (KSh)", symbol: "KSh" },
  { code: "GHS", name: "Ghanaian Cedi (₵)", symbol: "₵" },
  { code: "ZAR", name: "South African Rand (R)", symbol: "R" },
  { code: "USD", name: "US Dollar ($)", symbol: "$" },
  { code: "EUR", name: "Euro (€)", symbol: "€" },
]

const roles = [
  { id: "owner", name: "Shop Owner", description: "Full access to all features and settings" },
  { id: "manager", name: "Store Manager", description: "Manage daily operations, staff, and inventory" },
  { id: "cashier", name: "Cashier", description: "Handle sales, payments, and customer service" },
  { id: "staff", name: "Staff Member", description: "Basic access to inventory and sales" },
]

const operatingDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

export function ShopSetupFlow() {
  const { user } = useUser()
  const [currentStep, setCurrentStep] = useState(1)
  const [shopData, setShopData] = useState<ShopData>({
    basicInfo: {
      name: "",
      type: "",
      description: "",
      phone: "",
      email: user?.emailAddresses[0]?.emailAddress || "",
    },
    location: {
      address: "",
      city: "",
      state: "",
      country: "Nigeria",
      postalCode: "",
    },
    business: {
      currency: "NGN",
      taxRate: "7.5",
      businessHours: {
        open: "08:00",
        close: "20:00",
      },
      operatingDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    },
    team: {
      role: "owner",
      teamSize: "1-5",
    },
  })

  const totalSteps = 4
  const progress = (currentStep / totalSteps) * 100

  const updateShopData = (section: keyof ShopData, data: any) => {
    setShopData((prev) => ({
      ...prev,
      [section]: { ...prev[section], ...data },
    }))
  }

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = async () => {
    // Here you would typically save to your database
    console.log("Shop setup data:", shopData)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Redirect to dashboard or show success
    window.location.href = "/dashboard"
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-amber-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">SF</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900">ShopFlow Setup</h1>
          </div>
          <p className="text-gray-600 mb-6">Let's set up your retail business in a few simple steps</p>

          {/* Progress Bar */}
          <div className="max-w-md mx-auto">
            <div className="flex justify-between text-sm text-gray-500 mb-2">
              <span>
                Step {currentStep} of {totalSteps}
              </span>
              <span>{Math.round(progress)}% Complete</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </div>

        <Card className="shadow-lg">
          <CardContent className="p-8">
            {/* Step 1: Basic Information */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <Building2 className="w-16 h-16 text-orange-500 mx-auto mb-4" />
                  <h2 className="text-2xl font-bold text-gray-900">Basic Shop Information</h2>
                  <p className="text-gray-600">Tell us about your business</p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="shopName">Shop Name *</Label>
                      <Input
                        id="shopName"
                        value={shopData.basicInfo.name}
                        onChange={(e) => updateShopData("basicInfo", { name: e.target.value })}
                        placeholder="e.g., Mama Ngozi's Store"
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label htmlFor="phone">Phone Number *</Label>
                      <Input
                        id="phone"
                        value={shopData.basicInfo.phone}
                        onChange={(e) => updateShopData("basicInfo", { phone: e.target.value })}
                        placeholder="+234 xxx xxx xxxx"
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        value={shopData.basicInfo.email}
                        onChange={(e) => updateShopData("basicInfo", { email: e.target.value })}
                        placeholder="shop@example.com"
                        className="mt-1"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Label>Shop Type *</Label>
                      <div className="grid grid-cols-2 gap-2 mt-2">
                        {shopTypes.slice(0, 6).map((type) => (
                          <button
                            key={type.id}
                            onClick={() => updateShopData("basicInfo", { type: type.id })}
                            className={`p-3 border rounded-lg text-left transition-colors ${
                              shopData.basicInfo.type === type.id
                                ? "border-orange-500 bg-orange-50"
                                : "border-gray-200 hover:border-gray-300"
                            }`}
                          >
                            <type.icon className="w-5 h-5 mb-1 text-orange-500" />
                            <div className="text-sm font-medium">{type.name}</div>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={shopData.basicInfo.description}
                        onChange={(e) => updateShopData("basicInfo", { description: e.target.value })}
                        placeholder="Brief description of your business..."
                        rows={3}
                        className="mt-1"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Location */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <MapPin className="w-16 h-16 text-orange-500 mx-auto mb-4" />
                  <h2 className="text-2xl font-bold text-gray-900">Shop Location</h2>
                  <p className="text-gray-600">Where is your business located?</p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="address">Street Address *</Label>
                      <Input
                        id="address"
                        value={shopData.location.address}
                        onChange={(e) => updateShopData("location", { address: e.target.value })}
                        placeholder="123 Main Street"
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label htmlFor="city">City *</Label>
                      <Input
                        id="city"
                        value={shopData.location.city}
                        onChange={(e) => updateShopData("location", { city: e.target.value })}
                        placeholder="Lagos"
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label htmlFor="state">State/Region *</Label>
                      <Input
                        id="state"
                        value={shopData.location.state}
                        onChange={(e) => updateShopData("location", { state: e.target.value })}
                        placeholder="Lagos State"
                        className="mt-1"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="country">Country *</Label>
                      <select
                        id="country"
                        value={shopData.location.country}
                        onChange={(e) => updateShopData("location", { country: e.target.value })}
                        className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                      >
                        <option value="Nigeria">Nigeria</option>
                        <option value="Kenya">Kenya</option>
                        <option value="Ghana">Ghana</option>
                        <option value="South Africa">South Africa</option>
                        <option value="Uganda">Uganda</option>
                        <option value="Tanzania">Tanzania</option>
                      </select>
                    </div>

                    <div>
                      <Label htmlFor="postalCode">Postal Code</Label>
                      <Input
                        id="postalCode"
                        value={shopData.location.postalCode}
                        onChange={(e) => updateShopData("location", { postalCode: e.target.value })}
                        placeholder="100001"
                        className="mt-1"
                      />
                    </div>

                    <Alert>
                      <MapPin className="h-4 w-4" />
                      <AlertDescription>
                        This information helps with local tax calculations and delivery services.
                      </AlertDescription>
                    </Alert>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Business Settings */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <CreditCard className="w-16 h-16 text-orange-500 mx-auto mb-4" />
                  <h2 className="text-2xl font-bold text-gray-900">Business Settings</h2>
                  <p className="text-gray-600">Configure your business operations</p>
                </div>

                <Tabs defaultValue="currency" className="space-y-6">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="currency">Currency & Tax</TabsTrigger>
                    <TabsTrigger value="hours">Operating Hours</TabsTrigger>
                    <TabsTrigger value="days">Operating Days</TabsTrigger>
                  </TabsList>

                  <TabsContent value="currency" className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <Label>Primary Currency *</Label>
                        <div className="mt-2 space-y-2">
                          {currencies.slice(0, 4).map((currency) => (
                            <button
                              key={currency.code}
                              onClick={() => updateShopData("business", { currency: currency.code })}
                              className={`w-full p-3 border rounded-lg text-left transition-colors ${
                                shopData.business.currency === currency.code
                                  ? "border-orange-500 bg-orange-50"
                                  : "border-gray-200 hover:border-gray-300"
                              }`}
                            >
                              <div className="font-medium">
                                {currency.symbol} {currency.code}
                              </div>
                              <div className="text-sm text-gray-600">{currency.name}</div>
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="taxRate">Tax Rate (%)</Label>
                        <Input
                          id="taxRate"
                          type="number"
                          value={shopData.business.taxRate}
                          onChange={(e) => updateShopData("business", { taxRate: e.target.value })}
                          placeholder="7.5"
                          className="mt-1"
                        />
                        <p className="text-sm text-gray-500 mt-1">Standard VAT rate in Nigeria is 7.5%</p>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="hours" className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="openTime">Opening Time</Label>
                        <Input
                          id="openTime"
                          type="time"
                          value={shopData.business.businessHours.open}
                          onChange={(e) =>
                            updateShopData("business", {
                              businessHours: { ...shopData.business.businessHours, open: e.target.value },
                            })
                          }
                          className="mt-1"
                        />
                      </div>

                      <div>
                        <Label htmlFor="closeTime">Closing Time</Label>
                        <Input
                          id="closeTime"
                          type="time"
                          value={shopData.business.businessHours.close}
                          onChange={(e) =>
                            updateShopData("business", {
                              businessHours: { ...shopData.business.businessHours, close: e.target.value },
                            })
                          }
                          className="mt-1"
                        />
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="days" className="space-y-4">
                    <div>
                      <Label>Operating Days</Label>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
                        {operatingDays.map((day) => (
                          <button
                            key={day}
                            onClick={() => {
                              const currentDays = shopData.business.operatingDays
                              const newDays = currentDays.includes(day)
                                ? currentDays.filter((d) => d !== day)
                                : [...currentDays, day]
                              updateShopData("business", { operatingDays: newDays })
                            }}
                            className={`p-2 border rounded-lg text-sm transition-colors ${
                              shopData.business.operatingDays.includes(day)
                                ? "border-orange-500 bg-orange-50 text-orange-700"
                                : "border-gray-200 hover:border-gray-300"
                            }`}
                          >
                            {day.slice(0, 3)}
                          </button>
                        ))}
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            )}

            {/* Step 4: Team & Role */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <Users className="w-16 h-16 text-orange-500 mx-auto mb-4" />
                  <h2 className="text-2xl font-bold text-gray-900">Team Setup</h2>
                  <p className="text-gray-600">Define your role and team size</p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Label>Your Role *</Label>
                    <div className="mt-2 space-y-2">
                      {roles.map((role) => (
                        <button
                          key={role.id}
                          onClick={() => updateShopData("team", { role: role.id })}
                          className={`w-full p-4 border rounded-lg text-left transition-colors ${
                            shopData.team.role === role.id
                              ? "border-orange-500 bg-orange-50"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                        >
                          <div className="font-medium">{role.name}</div>
                          <div className="text-sm text-gray-600">{role.description}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label>Team Size</Label>
                    <div className="mt-2 space-y-2">
                      {["1-5", "6-10", "11-25", "26-50", "50+"].map((size) => (
                        <button
                          key={size}
                          onClick={() => updateShopData("team", { teamSize: size })}
                          className={`w-full p-3 border rounded-lg text-center transition-colors ${
                            shopData.team.teamSize === size
                              ? "border-orange-500 bg-orange-50"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                        >
                          {size} {size === "1-5" ? "employees" : "employees"}
                        </button>
                      ))}
                    </div>

                    <Alert className="mt-4">
                      <Users className="h-4 w-4" />
                      <AlertDescription>
                        You can invite team members and assign roles after completing the setup.
                      </AlertDescription>
                    </Alert>
                  </div>
                </div>

                {/* Setup Summary */}
                <Card className="bg-gray-50">
                  <CardHeader>
                    <CardTitle className="text-lg">Setup Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Shop Name:</span>
                      <span className="font-medium">{shopData.basicInfo.name || "Not set"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Type:</span>
                      <span className="font-medium">
                        {shopTypes.find((t) => t.id === shopData.basicInfo.type)?.name || "Not set"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Location:</span>
                      <span className="font-medium">
                        {shopData.location.city}, {shopData.location.country}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Currency:</span>
                      <span className="font-medium">
                        {currencies.find((c) => c.code === shopData.business.currency)?.name}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Your Role:</span>
                      <span className="font-medium">{roles.find((r) => r.id === shopData.team.role)?.name}</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between pt-6 border-t">
              <Button
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 1}
                className="flex items-center gap-2 bg-transparent"
              >
                <ArrowLeft className="w-4 h-4" />
                Previous
              </Button>

              {currentStep < totalSteps ? (
                <Button
                  onClick={nextStep}
                  className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600"
                  disabled={
                    (currentStep === 1 && (!shopData.basicInfo.name || !shopData.basicInfo.type)) ||
                    (currentStep === 2 && (!shopData.location.address || !shopData.location.city))
                  }
                >
                  Next
                  <ArrowRight className="w-4 h-4" />
                </Button>
              ) : (
                <Button onClick={handleSubmit} className="flex items-center gap-2 bg-green-600 hover:bg-green-700">
                  <CheckCircle className="w-4 h-4" />
                  Complete Setup
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
