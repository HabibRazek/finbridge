"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"
import { Building2, Mail, Lock, User, ArrowRight, Sparkles, Shield, CheckCircle2 } from "lucide-react"
import { useAuth, type UserRole } from "@/lib/auth-context"

// Static demo users
const DEMO_USERS = {
  agent: { email: "agent@finbridge.tn", password: "agent123", role: "agent" as UserRole },
  client: { email: "client@finbridge.tn", password: "client123", role: "client" as UserRole },
  admin: { email: "admin@finbridge.tn", password: "admin123", role: "admin" as UserRole }
}

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { login } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    // Simulate loading
    await new Promise(resolve => setTimeout(resolve, 800))

    if (isLogin) {
      // Check static demo users
      const user = Object.values(DEMO_USERS).find(
        u => u.email === email && u.password === password
      )

      if (user) {
        // Use auth context to login
        login({ email: user.email, role: user.role })

        // Redirect based on role
        if (user.role === "agent") {
          router.push("/agent")
        } else if (user.role === "client") {
          router.push("/client")
        } else {
          router.push("/dashboard")
        }
      } else {
        setError("Invalid email or password")
      }
    } else {
      // Simple registration - just redirect to client portal
      if (email && password && name) {
        login({ email, role: "client", name })
        router.push("/client")
      } else {
        setError("Please fill in all fields")
      }
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-gradient-to-br from-blue-400/20 to-indigo-400/20 blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-gradient-to-br from-purple-400/20 to-pink-400/20 blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-12">
        <div className="w-full max-w-6xl">
          <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
            {/* Left Side - Branding */}
            <div className="flex flex-col justify-center space-y-6">
              <Link href="/" className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 shadow-lg shadow-blue-500/50">
                  <Building2 className="h-7 w-7 text-white" />
                </div>
                <span className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  FinBridge
                </span>
              </Link>

              <div>
                <h1 className="mb-4 text-4xl font-bold text-slate-900 dark:text-white lg:text-5xl">
                  Welcome Back!
                </h1>
                <p className="text-lg text-slate-600 dark:text-slate-300">
                  Access your account and manage your finances in Tunisian Dinars (TND)
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="mt-1 flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900">
                    <Shield className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <div className="font-semibold text-slate-900 dark:text-white">Bank-Grade Security</div>
                    <div className="text-sm text-slate-600 dark:text-slate-300">
                      Your data is encrypted and protected
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="mt-1 flex h-8 w-8 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-900">
                    <Sparkles className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <div className="font-semibold text-slate-900 dark:text-white">Smart Features</div>
                    <div className="text-sm text-slate-600 dark:text-slate-300">
                      AI-powered insights for better decisions
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="mt-1 flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 dark:bg-emerald-900">
                    <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div>
                    <div className="font-semibold text-slate-900 dark:text-white">Always Available</div>
                    <div className="text-sm text-slate-600 dark:text-slate-300">
                      24/7 access to your accounts
                    </div>
                  </div>
                </div>
              </div>

              {/* Demo Credentials */}
              <div className="rounded-xl border border-blue-200 bg-blue-50/50 p-4 dark:border-blue-800 dark:bg-blue-900/20">
                <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-blue-900 dark:text-blue-100">
                  <Sparkles className="h-4 w-4" />
                  Demo Credentials
                </div>
                <div className="space-y-1 text-xs text-blue-800 dark:text-blue-200">
                  <div><strong>Agent:</strong> agent@finbridge.tn / agent123</div>
                  <div><strong>Client:</strong> client@finbridge.tn / client123</div>
                  <div><strong>Admin:</strong> admin@finbridge.tn / admin123</div>
                </div>
              </div>
            </div>

            {/* Right Side - Auth Form */}
            <div className="flex items-center justify-center">
              <Card className="w-full max-w-md border-2 shadow-2xl">
                <CardHeader className="space-y-1">
                  <CardTitle className="text-2xl font-bold">
                    {isLogin ? "Sign In" : "Create Account"}
                  </CardTitle>
                  <CardDescription>
                    {isLogin
                      ? "Enter your credentials to access your account"
                      : "Fill in your details to get started"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Tabs value={isLogin ? "login" : "register"} onValueChange={(v) => setIsLogin(v === "login")} className="mb-6">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="login">Login</TabsTrigger>
                      <TabsTrigger value="register">Register</TabsTrigger>
                    </TabsList>
                  </Tabs>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    {!isLogin && (
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <div className="relative">
                          <User className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                          <Input
                            id="name"
                            type="text"
                            placeholder="Ahmed Ben Ali"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="pl-10"
                            required={!isLogin}
                          />
                        </div>
                      </div>
                    )}

                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                        <Input
                          id="email"
                          type="email"
                          placeholder="you@example.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                        <Input
                          id="password"
                          type="password"
                          placeholder="••••••••"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>

                    {error && (
                      <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">
                        {error}
                      </div>
                    )}

                    <Button
                      type="submit"
                      className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg shadow-blue-500/30"
                      disabled={loading}
                    >
                      {loading ? (
                        "Processing..."
                      ) : (
                        <>
                          {isLogin ? "Sign In" : "Create Account"}
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </>
                      )}
                    </Button>
                  </form>

                  <div className="mt-6 text-center text-sm text-slate-600 dark:text-slate-300">
                    {isLogin ? "Don't have an account? " : "Already have an account? "}
                    <button
                      onClick={() => {
                        setIsLogin(!isLogin)
                        setError("")
                      }}
                      className="font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400"
                    >
                      {isLogin ? "Sign up" : "Sign in"}
                    </button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
