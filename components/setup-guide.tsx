"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Copy, ExternalLink, CheckCircle, AlertCircle, Eye, EyeOff } from "lucide-react"

export function SetupGuide() {
  const [showKeys, setShowKeys] = useState(false)
  const [copiedKey, setCopiedKey] = useState<string | null>(null)

  const copyToClipboard = (text: string, keyType: string) => {
    navigator.clipboard.writeText(text)
    setCopiedKey(keyType)
    setTimeout(() => setCopiedKey(null), 2000)
  }

  const steps = [
    {
      title: "Create Clerk Account",
      description: "Sign up for a free Clerk account",
      action: "Visit clerk.com",
      link: "https://clerk.com",
    },
    {
      title: "Create Application",
      description: "Create a new application in your Clerk dashboard",
      action: "Go to Dashboard",
      link: "https://dashboard.clerk.com",
    },
    {
      title: "Get API Keys",
      description: "Copy your publishable and secret keys",
      action: "API Keys Section",
    },
    {
      title: "Configure Environment",
      description: "Add keys to your .env.local file",
      action: "Update .env.local",
    },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Clerk Authentication Setup</h1>
          <p className="text-gray-600">Configure your ShopFlow app with Clerk authentication</p>
        </div>

        <Tabs defaultValue="guide" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="guide">Setup Guide</TabsTrigger>
            <TabsTrigger value="env">Environment Variables</TabsTrigger>
            <TabsTrigger value="verification">Verification</TabsTrigger>
          </TabsList>

          <TabsContent value="guide" className="space-y-6">
            <div className="grid gap-4">
              {steps.map((step, index) => (
                <Card key={index}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center font-bold">
                        {index + 1}
                      </div>
                      <div>
                        <CardTitle className="text-lg">{step.title}</CardTitle>
                        <CardDescription>{step.description}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {step.link ? (
                      <Button variant="outline" asChild>
                        <a href={step.link} target="_blank" rel="noopener noreferrer">
                          {step.action}
                          <ExternalLink className="w-4 h-4 ml-2" />
                        </a>
                      </Button>
                    ) : (
                      <Badge variant="secondary">{step.action}</Badge>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>

            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <strong>Important:</strong> Never commit your secret key to version control. Always use environment
                variables and add .env.local to your .gitignore file.
              </AlertDescription>
            </Alert>
          </TabsContent>

          <TabsContent value="env" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Environment Variables Configuration</CardTitle>
                <CardDescription>Create or update your .env.local file with these variables</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">Required Variables</h4>
                    <Button variant="ghost" size="sm" onClick={() => setShowKeys(!showKeys)}>
                      {showKeys ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      {showKeys ? "Hide" : "Show"} Keys
                    </Button>
                  </div>

                  <div className="space-y-3 font-mono text-sm">
                    <div className="flex items-center justify-between bg-white p-3 rounded border">
                      <span className="text-gray-600">NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=</span>
                      <div className="flex items-center gap-2">
                        <span className="text-orange-600">
                          {showKeys ? "pk_test_your_key_here" : "pk_test_••••••••"}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            copyToClipboard("NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_key_here", "publishable")
                          }
                        >
                          {copiedKey === "publishable" ? (
                            <CheckCircle className="w-4 h-4 text-green-500" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </Button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between bg-white p-3 rounded border">
                      <span className="text-gray-600">CLERK_SECRET_KEY=</span>
                      <div className="flex items-center gap-2">
                        <span className="text-red-600">
                          {showKeys ? "sk_test_your_secret_key_here" : "sk_test_••••••••"}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard("CLERK_SECRET_KEY=sk_test_your_secret_key_here", "secret")}
                        >
                          {copiedKey === "secret" ? (
                            <CheckCircle className="w-4 h-4 text-green-500" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-medium mb-2">Optional Variables (with defaults)</h4>
                  <div className="space-y-2 font-mono text-sm text-gray-600">
                    <div>NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in</div>
                    <div>NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up</div>
                    <div>NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/</div>
                    <div>NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/</div>
                  </div>
                </div>

                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Replace "your_key_here" with your actual keys from the Clerk dashboard. The publishable key starts
                    with "pk_" and the secret key starts with "sk_".
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Where to Find Your Keys</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">Publishable Key</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Safe to expose in client-side code</li>
                      <li>• Starts with "pk_test_" or "pk_live_"</li>
                      <li>• Found in API Keys section</li>
                      <li>• Used for frontend authentication</li>
                    </ul>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">Secret Key</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Keep secret, server-side only</li>
                      <li>• Starts with "sk_test_" or "sk_live_"</li>
                      <li>• Found in API Keys section</li>
                      <li>• Used for backend operations</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="verification" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Configuration Verification</CardTitle>
                <CardDescription>Check if your Clerk configuration is set up correctly</CardDescription>
              </CardHeader>
              <CardContent>
                <EnvironmentCheck />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

function EnvironmentCheck() {
  const [checking, setChecking] = useState(false)
  const [results, setResults] = useState<any>(null)

  const checkEnvironment = async () => {
    setChecking(true)

    // Simulate environment check
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
    const hasSecretKey = typeof window === "undefined" // Can't check secret key on client

    setResults({
      publishableKey: {
        present: !!publishableKey,
        valid: publishableKey?.startsWith("pk_"),
        value: publishableKey ? `${publishableKey.substring(0, 20)}...` : null,
      },
      secretKey: {
        present: hasSecretKey,
        note: "Secret key validation happens server-side",
      },
    })

    setChecking(false)
  }

  return (
    <div className="space-y-4">
      <Button onClick={checkEnvironment} disabled={checking} className="w-full">
        {checking ? "Checking Configuration..." : "Check Environment Variables"}
      </Button>

      {results && (
        <div className="space-y-3">
          <div className="flex items-center gap-2 p-3 bg-gray-50 rounded">
            {results.publishableKey.present && results.publishableKey.valid ? (
              <CheckCircle className="w-5 h-5 text-green-500" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-500" />
            )}
            <div>
              <div className="font-medium">Publishable Key</div>
              <div className="text-sm text-gray-600">
                {results.publishableKey.present
                  ? `Found: ${results.publishableKey.value}`
                  : "Not found in environment variables"}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 p-3 bg-gray-50 rounded">
            <CheckCircle className="w-5 h-5 text-blue-500" />
            <div>
              <div className="font-medium">Secret Key</div>
              <div className="text-sm text-gray-600">{results.secretKey.note}</div>
            </div>
          </div>

          {results.publishableKey.present && results.publishableKey.valid ? (
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                Configuration looks good! You can now use Clerk authentication in your app.
              </AlertDescription>
            </Alert>
          ) : (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Please check your environment variables and restart your development server.
              </AlertDescription>
            </Alert>
          )}
        </div>
      )}
    </div>
  )
}
