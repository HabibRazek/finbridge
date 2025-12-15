"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import Link from "next/link"
import { Building2, Mail, Lock, User, ArrowRight, Sparkles, Shield, CheckCircle2, Phone, MapPin, Calendar, Briefcase, Eye, EyeOff } from "lucide-react"
import { useAuth, type UserRole } from "@/lib/auth-context"
import { registerClient, verifyClientCredentials, findClientByEmail } from "@/lib/user-storage"
import { verifyCredentials as verifyUserCredentials } from "@/lib/json-storage"

// Static demo users
const DEMO_USERS = {
  agent: { email: "agent@bankify.tn", password: "agent123", role: "agent" as UserRole },
  client: { email: "client@bankify.tn", password: "client123", role: "client" as UserRole },
  admin: { email: "admin@bankify.tn", password: "admin123", role: "admin" as UserRole }
}

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  
  // Registration form fields
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    address: "",
    dateOfBirth: "",
    gender: "",
    occupation: ""
  })
  
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})
  
  const router = useRouter()
  const { login } = useAuth()

  const validateRegistrationForm = () => {
    const errors: Record<string, string> = {}
    
    if (!formData.name.trim()) {
      errors.name = "Full name is required"
    }
    
    if (!formData.email.trim()) {
      errors.email = "Email is required"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = "Please enter a valid email address"
    } else if (findClientByEmail(formData.email)) {
      errors.email = "This email is already registered"
    }
    
    if (!formData.password) {
      errors.password = "Password is required"
    } else if (formData.password.length < 6) {
      errors.password = "Password must be at least 6 characters"
    }
    
    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = "Passwords do not match"
    }
    
    if (!formData.phone.trim()) {
      errors.phone = "Phone number is required"
    } else if (!/^\+?[0-9]{8,15}$/.test(formData.phone.replace(/\s/g, ""))) {
      errors.phone = "Please enter a valid phone number"
    }
    
    if (!formData.address.trim()) {
      errors.address = "Address is required"
    }
    
    if (!formData.dateOfBirth) {
      errors.dateOfBirth = "Date of birth is required"
    } else {
      const birthDate = new Date(formData.dateOfBirth)
      const today = new Date()
      const age = today.getFullYear() - birthDate.getFullYear()
      if (age < 18) {
        errors.dateOfBirth = "You must be at least 18 years old"
      }
    }
    
    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleRegistration = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess(false)
    
    if (!validateRegistrationForm()) {
      return
    }
    
    setLoading(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    try {
      const newClient = registerClient({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        address: formData.address,
        dateOfBirth: formData.dateOfBirth,
        gender: formData.gender || undefined,
        occupation: formData.occupation || undefined
      })
      
      setSuccess(true)
      
      // Auto login after registration
      setTimeout(() => {
        login({ email: newClient.email, role: "client", name: newClient.name })
        router.push("/client")
      }, 1500)
    } catch (err: any) {
      setError(err.message || "Registration failed. Please try again.")
      setLoading(false)
    }
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    // Simulate loading
    await new Promise(resolve => setTimeout(resolve, 800))

    // Check all users in JSON storage (includes demo users and registered users)
    const user = verifyUserCredentials(email, password)

    if (user) {
      login({ email: user.email, role: user.role, name: user.name })
      if (user.role === "agent") {
        router.push("/agent")
      } else if (user.role === "client") {
        router.push("/client")
      } else if (user.role === "admin") {
        router.push("/admin")
      } else {
        router.push("/client")
      }
    } else {
      setError("Invalid email or password")
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
                  Bankify
                </span>
              </Link>

              <div>
                <h1 className="mb-4 text-4xl font-bold text-slate-900 dark:text-white lg:text-5xl">
                  {isLogin ? "Welcome Back!" : "Create Your Account"}
                </h1>
                <p className="text-lg text-slate-600 dark:text-slate-300">
                  {isLogin 
                    ? "Access your account and manage your finances in Tunisian Dinars (TND)"
                    : "Join Bankify and start managing your finances today"}
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
                  <div><strong>Agent:</strong> agent@bankify.tn / agent123</div>
                  <div><strong>Client:</strong> client@bankify.tn / client123</div>
                  <div><strong>Admin:</strong> admin@bankify.tn / admin123</div>
                </div>
              </div>
            </div>

            {/* Right Side - Auth Form */}
            <div className="flex items-center justify-center">
              <Card className={`w-full max-w-md border-2 shadow-2xl ${!isLogin ? "max-h-[90vh]" : ""}`}>
                <CardHeader className="space-y-1">
                  <CardTitle className="text-2xl font-bold">
                    {isLogin ? "Sign In" : "Create Account"}
                  </CardTitle>
                  <CardDescription>
                    {isLogin
                      ? "Enter your credentials to access your account"
                      : "Fill in your details to get started with Bankify"}
                  </CardDescription>
                </CardHeader>
                <CardContent className={!isLogin ? "pb-6" : ""}>
                  <Tabs value={isLogin ? "login" : "register"} onValueChange={(v) => setIsLogin(v === "login")} className="mb-6">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="login">Login</TabsTrigger>
                      <TabsTrigger value="register">Register</TabsTrigger>
                    </TabsList>
                  </Tabs>

                  {isLogin ? (
                    <form onSubmit={handleLogin} className="space-y-4">
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
                            type={showPassword ? "text" : "password"}
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="pl-10 pr-10"
                            required
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                          >
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
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
                        {loading ? "Signing in..." : (
                          <>
                            Sign In
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </>
                        )}
                      </Button>
                    </form>
                  ) : (
                    <form onSubmit={handleRegistration} className="space-y-4 max-h-[65vh] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-blue-300 scrollbar-track-transparent">
                      {/* Personal Information Section */}
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="name">Full Name <span className="text-red-500">*</span></Label>
                          <div className="relative">
                            <User className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                            <Input
                              id="name"
                              type="text"
                              placeholder="Ahmed Ben Ali"
                              value={formData.name}
                              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                              className={`pl-10 ${formErrors.name ? "border-red-500" : ""}`}
                              required
                            />
                          </div>
                          {formErrors.name && (
                            <p className="text-xs text-red-500">{formErrors.name}</p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="reg-email">Email <span className="text-red-500">*</span></Label>
                          <div className="relative">
                            <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                            <Input
                              id="reg-email"
                              type="email"
                              placeholder="ahmed@example.com"
                              value={formData.email}
                              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                              className={`pl-10 ${formErrors.email ? "border-red-500" : ""}`}
                              required
                            />
                          </div>
                          {formErrors.email && (
                            <p className="text-xs text-red-500">{formErrors.email}</p>
                          )}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="password">Password <span className="text-red-500">*</span></Label>
                            <div className="relative">
                              <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                              <Input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                placeholder="••••••••"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                className={`pl-10 pr-10 ${formErrors.password ? "border-red-500" : ""}`}
                                required
                              />
                              <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                              >
                                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                              </button>
                            </div>
                            {formErrors.password && (
                              <p className="text-xs text-red-500">{formErrors.password}</p>
                            )}
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="confirmPassword">Confirm Password <span className="text-red-500">*</span></Label>
                            <div className="relative">
                              <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                              <Input
                                id="confirmPassword"
                                type={showConfirmPassword ? "text" : "password"}
                                placeholder="••••••••"
                                value={formData.confirmPassword}
                                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                className={`pl-10 pr-10 ${formErrors.confirmPassword ? "border-red-500" : ""}`}
                                required
                              />
                              <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                              >
                                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                              </button>
                            </div>
                            {formErrors.confirmPassword && (
                              <p className="text-xs text-red-500">{formErrors.confirmPassword}</p>
                            )}
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="phone">Phone Number <span className="text-red-500">*</span></Label>
                          <div className="relative">
                            <Phone className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                            <Input
                              id="phone"
                              type="tel"
                              placeholder="+216 98 765 432"
                              value={formData.phone}
                              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                              className={`pl-10 ${formErrors.phone ? "border-red-500" : ""}`}
                              required
                            />
                          </div>
                          {formErrors.phone && (
                            <p className="text-xs text-red-500">{formErrors.phone}</p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="address">Address <span className="text-red-500">*</span></Label>
                          <div className="relative">
                            <MapPin className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                            <Textarea
                              id="address"
                              placeholder="Street, City, Tunisia"
                              value={formData.address}
                              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                              className={`pl-10 min-h-[80px] ${formErrors.address ? "border-red-500" : ""}`}
                              required
                            />
                          </div>
                          {formErrors.address && (
                            <p className="text-xs text-red-500">{formErrors.address}</p>
                          )}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="dateOfBirth">Date of Birth <span className="text-red-500">*</span></Label>
                            <div className="relative">
                              <Calendar className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                              <Input
                                id="dateOfBirth"
                                type="date"
                                value={formData.dateOfBirth}
                                onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                                className={`pl-10 ${formErrors.dateOfBirth ? "border-red-500" : ""}`}
                                max={new Date(new Date().setFullYear(new Date().getFullYear() - 18)).toISOString().split('T')[0]}
                                required
                              />
                            </div>
                            {formErrors.dateOfBirth && (
                              <p className="text-xs text-red-500">{formErrors.dateOfBirth}</p>
                            )}
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="gender">Gender</Label>
                            <Select value={formData.gender} onValueChange={(value) => setFormData({ ...formData, gender: value })}>
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select gender" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="male">Male</SelectItem>
                                <SelectItem value="female">Female</SelectItem>
                                <SelectItem value="other">Other</SelectItem>
                                <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="occupation">Occupation</Label>
                          <div className="relative">
                            <Briefcase className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                            <Input
                              id="occupation"
                              type="text"
                              placeholder="e.g., Teacher, Engineer, Business Owner"
                              value={formData.occupation}
                              onChange={(e) => setFormData({ ...formData, occupation: e.target.value })}
                              className="pl-10"
                            />
                          </div>
                        </div>
                      </div>

                      {error && (
                        <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">
                          {error}
                        </div>
                      )}

                      {success && (
                        <div className="rounded-lg bg-green-50 p-3 text-sm text-green-600 dark:bg-green-900/20 dark:text-green-400 flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4" />
                          Account created successfully! Redirecting...
                        </div>
                      )}

                      <Button
                        type="submit"
                        className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg shadow-blue-500/30"
                        disabled={loading || success}
                      >
                        {loading ? (
                          "Creating Account..."
                        ) : success ? (
                          "Account Created!"
                        ) : (
                          <>
                            Create Account
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </>
                        )}
                      </Button>
                    </form>
                  )}

                  <div className="mt-6 text-center text-sm text-slate-600 dark:text-slate-300">
                    {isLogin ? "Don't have an account? " : "Already have an account? "}
                    <button
                      type="button"
                      onClick={() => {
                        setIsLogin(!isLogin)
                        setError("")
                        setSuccess(false)
                        setFormErrors({})
                        setFormData({
                          name: "",
                          email: "",
                          password: "",
                          confirmPassword: "",
                          phone: "",
                          address: "",
                          dateOfBirth: "",
                          gender: "",
                          occupation: ""
                        })
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
