"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import {
  Users,
  Wallet,
  FileText,
  ArrowRight,
  Building2,
  Shield,
  Sparkles,
  CheckCircle2,
  Globe,
  Zap,
  BarChart3
} from "lucide-react"
export default function Home() {
  const isLoggedIn = false

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-gradient-to-br from-blue-400/20 to-indigo-400/20 blur-3xl animate-pulse" />
          <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-gradient-to-br from-purple-400/20 to-pink-400/20 blur-3xl animate-pulse delay-1000" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-96 w-96 rounded-full bg-gradient-to-br from-cyan-400/10 to-blue-400/10 blur-3xl animate-pulse delay-500" />
        </div>

        {/* Navigation */}
        <nav className="relative z-10 border-b border-white/20 bg-white/50 backdrop-blur-xl dark:bg-slate-900/50">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 shadow-lg shadow-blue-500/50">
                  <Building2 className="h-6 w-6 text-white" />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  FinBridge
                </span>
              </div>
              <div className="flex items-center gap-4">
                {!isLoggedIn ? (
                  <>
                    <Button variant="ghost" asChild>
                      <Link href="/login">Sign In</Link>
                    </Button>
                    <Button asChild className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg shadow-blue-500/30">
                      <Link href="/login">
                        Get Started
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </>
                ) : (
                  <Button asChild className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                    <Link href="/dashboard">Dashboard</Link>
                  </Button>
                )}
              </div>
            </div>
          </div>
        </nav>

        {/* Hero Content */}
        <div className="relative z-10 mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-32">
          <div className="text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white/80 px-4 py-2 text-sm font-medium text-blue-700 shadow-lg backdrop-blur-sm dark:border-blue-800 dark:bg-slate-800/80 dark:text-blue-300">
              <Sparkles className="h-4 w-4" />
              Empowering Rural Communities with Modern Banking
            </div>

            <h1 className="mb-6 text-5xl font-extrabold tracking-tight sm:text-6xl lg:text-7xl">
              <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Banking Made Simple
              </span>
              <br />
              <span className="text-slate-900 dark:text-white">
                For Everyone
              </span>
            </h1>

            <p className="mx-auto mb-10 max-w-2xl text-lg text-slate-600 dark:text-slate-300 sm:text-xl">
              Experience seamless financial services with FinBridge. Manage your money,
              track budgets, and achieve your financial goals - all in Tunisian Dinars (TND).
            </p>

            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button asChild size="lg" className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-xl shadow-blue-500/30 text-base px-8 py-6">
                <Link href="/login">
                  Start Your Journey
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-2 text-base px-8 py-6 bg-white/50 backdrop-blur-sm hover:bg-white/80">
                <Link href="#features">
                  Explore Features
                  <Sparkles className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>

            {/* Stats */}
            <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-3">
              <div className="rounded-2xl border border-white/20 bg-white/60 p-6 backdrop-blur-xl dark:bg-slate-800/60">
                <div className="text-3xl font-bold text-blue-600">10,000+</div>
                <div className="text-sm text-slate-600 dark:text-slate-300">Active Users</div>
              </div>
              <div className="rounded-2xl border border-white/20 bg-white/60 p-6 backdrop-blur-xl dark:bg-slate-800/60">
                <div className="text-3xl font-bold text-indigo-600">50M+ TND</div>
                <div className="text-sm text-slate-600 dark:text-slate-300">Transactions Processed</div>
              </div>
              <div className="rounded-2xl border border-white/20 bg-white/60 p-6 backdrop-blur-xl dark:bg-slate-800/60">
                <div className="text-3xl font-bold text-purple-600">99.9%</div>
                <div className="text-sm text-slate-600 dark:text-slate-300">Uptime Guarantee</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div id="features" className="relative z-10 mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-4xl font-bold text-slate-900 dark:text-white">
            Powerful Features for Everyone
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-300">
            Everything you need to manage your finances effectively
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {/* Agent Portal Card */}
          <Card className="group relative overflow-hidden border-2 transition-all duration-300 hover:border-blue-500 hover:shadow-2xl hover:shadow-blue-500/20 hover:-translate-y-2">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-indigo-500/5 opacity-0 transition-opacity group-hover:opacity-100" />
            <CardHeader>
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-500 shadow-lg shadow-blue-500/50">
                <Users className="h-7 w-7 text-white" />
              </div>
              <CardTitle className="text-2xl">Agent Portal</CardTitle>
              <CardDescription className="text-base">
                Manage transactions, commissions, and client verification
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="mb-6 space-y-3">
                <li className="flex items-center gap-3 text-sm">
                  <CheckCircle2 className="h-5 w-5 text-blue-500" />
                  <span>Record deposits & transactions in TND</span>
                </li>
                <li className="flex items-center gap-3 text-sm">
                  <CheckCircle2 className="h-5 w-5 text-blue-500" />
                  <span>Track commission earnings</span>
                </li>
                <li className="flex items-center gap-3 text-sm">
                  <CheckCircle2 className="h-5 w-5 text-blue-500" />
                  <span>Verify client identities</span>
                </li>
              </ul>
              <Button asChild className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                <Link href="/agent">
                  Enter Agent Portal
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Client Portal Card */}
          <Card className="group relative overflow-hidden border-2 transition-all duration-300 hover:border-purple-500 hover:shadow-2xl hover:shadow-purple-500/20 hover:-translate-y-2">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5 opacity-0 transition-opacity group-hover:opacity-100" />
            <CardHeader>
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 shadow-lg shadow-purple-500/50">
                <Wallet className="h-7 w-7 text-white" />
              </div>
              <CardTitle className="text-2xl">Client Portal</CardTitle>
              <CardDescription className="text-base">
                View balances, track budgets, and set financial goals
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="mb-6 space-y-3">
                <li className="flex items-center gap-3 text-sm">
                  <CheckCircle2 className="h-5 w-5 text-purple-500" />
                  <span>Real-time balance tracking in TND</span>
                </li>
                <li className="flex items-center gap-3 text-sm">
                  <CheckCircle2 className="h-5 w-5 text-purple-500" />
                  <span>Smart budget planning tools</span>
                </li>
                <li className="flex items-center gap-3 text-sm">
                  <CheckCircle2 className="h-5 w-5 text-purple-500" />
                  <span>Savings & investment goals</span>
                </li>
              </ul>
              <Button asChild className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                <Link href="/client">
                  Enter Client Portal
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Loan Management Card */}
          <Card className="group relative overflow-hidden border-2 transition-all duration-300 hover:border-emerald-500 hover:shadow-2xl hover:shadow-emerald-500/20 hover:-translate-y-2">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-teal-500/5 opacity-0 transition-opacity group-hover:opacity-100" />
            <CardHeader>
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 shadow-lg shadow-emerald-500/50">
                <FileText className="h-7 w-7 text-white" />
              </div>
              <CardTitle className="text-2xl">Loan Management</CardTitle>
              <CardDescription className="text-base">
                Apply for loans and track application status
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="mb-6 space-y-3">
                <li className="flex items-center gap-3 text-sm">
                  <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                  <span>Smart loan applications in TND</span>
                </li>
                <li className="flex items-center gap-3 text-sm">
                  <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                  <span>Track approval status</span>
                </li>
                <li className="flex items-center gap-3 text-sm">
                  <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                  <span>Secure document upload</span>
                </li>
              </ul>
              <Button asChild className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700">
                <Link href="/loan/apply">
                  Start Loan Application
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="relative z-10 mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-2">
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="group rounded-2xl border border-white/20 bg-white/60 p-6 backdrop-blur-xl transition-all hover:shadow-xl dark:bg-slate-800/60">
              <Shield className="mb-4 h-10 w-10 text-blue-600 transition-transform group-hover:scale-110" />
              <h3 className="mb-2 text-lg font-semibold">Secure & Compliant</h3>
              <p className="text-sm text-slate-600 dark:text-slate-300">
                Bank-grade security with KYC/AML verification
              </p>
            </div>

            <div className="group rounded-2xl border border-white/20 bg-white/60 p-6 backdrop-blur-xl transition-all hover:shadow-xl dark:bg-slate-800/60">
              <Zap className="mb-4 h-10 w-10 text-yellow-600 transition-transform group-hover:scale-110" />
              <h3 className="mb-2 text-lg font-semibold">Lightning Fast</h3>
              <p className="text-sm text-slate-600 dark:text-slate-300">
                Real-time updates and instant notifications
              </p>
            </div>

            <div className="group rounded-2xl border border-white/20 bg-white/60 p-6 backdrop-blur-xl transition-all hover:shadow-xl dark:bg-slate-800/60">
              <Globe className="mb-4 h-10 w-10 text-green-600 transition-transform group-hover:scale-110" />
              <h3 className="mb-2 text-lg font-semibold">Rural Focus</h3>
              <p className="text-sm text-slate-600 dark:text-slate-300">
                Tailored for rural communities in Tunisia
              </p>
            </div>

            <div className="group rounded-2xl border border-white/20 bg-white/60 p-6 backdrop-blur-xl transition-all hover:shadow-xl dark:bg-slate-800/60">
              <BarChart3 className="mb-4 h-10 w-10 text-purple-600 transition-transform group-hover:scale-110" />
              <h3 className="mb-2 text-lg font-semibold">Smart Analytics</h3>
              <p className="text-sm text-slate-600 dark:text-slate-300">
                Track spending and achieve financial goals
              </p>
            </div>
          </div>

          <div className="flex flex-col justify-center">
            <h2 className="mb-6 text-4xl font-bold text-slate-900 dark:text-white">
              Why Choose FinBridge?
            </h2>
            <p className="mb-6 text-lg text-slate-600 dark:text-slate-300">
              We're revolutionizing rural banking in Tunisia with cutting-edge technology
              and user-friendly interfaces. Our platform is designed to make financial
              services accessible to everyone, everywhere.
            </p>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <div className="mt-1 flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900">
                  <CheckCircle2 className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <div className="font-semibold">No Hidden Fees</div>
                  <div className="text-sm text-slate-600 dark:text-slate-300">
                    Transparent pricing in TND with no surprises
                  </div>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="mt-1 flex h-6 w-6 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900">
                  <CheckCircle2 className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <div className="font-semibold">24/7 Support</div>
                  <div className="text-sm text-slate-600 dark:text-slate-300">
                    Always here to help you succeed
                  </div>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="mt-1 flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                  <div className="font-semibold">Easy to Use</div>
                  <div className="text-sm text-slate-600 dark:text-slate-300">
                    Intuitive design that anyone can master
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="relative z-10 mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-12 shadow-2xl">
          <div className="absolute inset-0 bg-grid-white/10" />
          <div className="relative z-10 text-center">
            <h2 className="mb-4 text-4xl font-bold text-white">
              Ready to Transform Your Financial Future?
            </h2>
            <p className="mb-8 text-xl text-blue-100">
              Join thousands of satisfied users managing their finances with FinBridge
            </p>
            <Button asChild size="lg" className="bg-white text-blue-600 hover:bg-blue-50 shadow-xl text-base px-8 py-6">
              <Link href="/login">
                Get Started Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/20 bg-white/50 backdrop-blur-xl dark:bg-slate-900/50">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="mb-4 flex items-center justify-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600">
                <Building2 className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                FinBridge
              </span>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              © 2024 FinBridge. Empowering rural communities with modern banking.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
