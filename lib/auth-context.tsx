"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"
import { useRouter, usePathname } from "next/navigation"

export type UserRole = "agent" | "client" | "admin"

export interface User {
  email: string
  role: UserRole
  name?: string
}

interface AuthContextType {
  user: User | null
  login: (user: User) => void
  logout: () => void
  isAuthenticated: boolean
  hasRole: (role: UserRole | UserRole[]) => boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  // Load user from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("finbridge_user")
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser))
      } catch (error) {
        console.error("Failed to parse user data:", error)
        localStorage.removeItem("finbridge_user")
      }
    }
    setIsLoading(false)
  }, [])

  // Protect routes based on role
  useEffect(() => {
    if (isLoading) return

    const publicPaths = ["/", "/login"]
    const isPublicPath = publicPaths.includes(pathname)

    // If not authenticated and trying to access protected route
    if (!user && !isPublicPath) {
      router.push("/login")
      return
    }

    // If authenticated, check role-based access
    if (user && !isPublicPath) {
      // Agent routes
      if (pathname.startsWith("/agent") && user.role !== "agent" && user.role !== "admin") {
        router.push(`/${user.role}`)
        return
      }

      // Client routes
      if (pathname.startsWith("/client") && user.role !== "client" && user.role !== "admin") {
        router.push(`/${user.role}`)
        return
      }

      // Loan routes - accessible by clients and agents
      if (pathname.startsWith("/loan") && user.role === "admin") {
        router.push("/dashboard")
        return
      }
    }
  }, [user, pathname, isLoading, router])

  const login = (userData: User) => {
    setUser(userData)
    localStorage.setItem("finbridge_user", JSON.stringify(userData))
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("finbridge_user")
    router.push("/login")
  }

  const hasRole = (role: UserRole | UserRole[]) => {
    if (!user) return false
    if (Array.isArray(role)) {
      return role.includes(user.role)
    }
    return user.role === role
  }

  const value = {
    user,
    login,
    logout,
    isAuthenticated: !!user,
    hasRole,
  }

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

