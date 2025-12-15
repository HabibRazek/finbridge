"use client"

import { useState, useEffect } from "react"
import { PageShell, PageHeader } from "@/components/shared/page-shell"
import { StatCard } from "@/components/shared/stat-card"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Users,
  DollarSign,
  TrendingUp,
  FileText,
  Target,
  Wallet,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Clock
} from "lucide-react"
import { formatTND } from "@/lib/currency"
import { 
  getAllUsers, 
  getTransactions, 
  getBudgets, 
  getGoals, 
  getLoans,
  type User,
  type Transaction,
  type Budget,
  type Goal,
  type Loan
} from "@/lib/json-storage"

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalClients: 0,
    totalAgents: 0,
    totalAdmins: 0,
    totalTransactions: 0,
    totalVolume: 0,
    pendingLoans: 0,
    approvedLoans: 0,
    totalBudgets: 0,
    totalGoals: 0,
    activeUsers: 0
  })

  useEffect(() => {
    // Load all statistics
    const users = getAllUsers()
    const transactions = getTransactions()
    const budgets = getBudgets()
    const goals = getGoals()
    const loans = getLoans()

    const totalVolume = transactions
      .filter(t => t.status === "completed")
      .reduce((sum, t) => sum + t.amount, 0)

    const pendingLoans = loans.filter(l => l.status === "pending").length
    const approvedLoans = loans.filter(l => l.status === "approved" || l.status === "disbursed").length

    setStats({
      totalUsers: users.length,
      totalClients: users.filter(u => u.role === "client").length,
      totalAgents: users.filter(u => u.role === "agent").length,
      totalAdmins: users.filter(u => u.role === "admin").length,
      totalTransactions: transactions.length,
      totalVolume: totalVolume,
      pendingLoans: pendingLoans,
      approvedLoans: approvedLoans,
      totalBudgets: budgets.length,
      totalGoals: goals.length,
      activeUsers: users.filter(u => !u.email.includes("inactive")).length
    })
  }, [])

  return (
    <PageShell>
      <PageHeader 
        title="Admin Dashboard" 
        description="Overview of your banking platform"
      />

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Users"
          value={stats.totalUsers.toString()}
          icon={Users}
          description={`${stats.totalClients} clients, ${stats.totalAgents} agents`}
        />
        <StatCard
          title="Total Transactions"
          value={stats.totalTransactions.toString()}
          icon={DollarSign}
          description={`${formatTND(stats.totalVolume)} volume`}
        />
        <StatCard
          title="Pending Loans"
          value={stats.pendingLoans.toString()}
          icon={Clock}
          description={`${stats.approvedLoans} approved`}
        />
        <StatCard
          title="Active Budgets"
          value={stats.totalBudgets.toString()}
          icon={Target}
          description={`${stats.totalGoals} goals tracked`}
        />
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">User Distribution</CardTitle>
            <CardDescription>Breakdown by role</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Clients</span>
                <span className="font-semibold">{stats.totalClients}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Agents</span>
                <span className="font-semibold">{stats.totalAgents}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Admins</span>
                <span className="font-semibold">{stats.totalAdmins}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Transaction Status</CardTitle>
            <CardDescription>Recent activity</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  <span className="text-sm text-muted-foreground">Completed</span>
                </div>
                <span className="font-semibold">
                  {getTransactions().filter(t => t.status === "completed").length}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-yellow-500" />
                  <span className="text-sm text-muted-foreground">Pending</span>
                </div>
                <span className="font-semibold">
                  {getTransactions().filter(t => t.status === "pending").length}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <XCircle className="h-4 w-4 text-red-500" />
                  <span className="text-sm text-muted-foreground">Failed</span>
                </div>
                <span className="font-semibold">
                  {getTransactions().filter(t => t.status === "failed").length}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Loan Status</CardTitle>
            <CardDescription>Application overview</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-yellow-500" />
                  <span className="text-sm text-muted-foreground">Pending</span>
                </div>
                <span className="font-semibold">{stats.pendingLoans}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  <span className="text-sm text-muted-foreground">Approved</span>
                </div>
                <span className="font-semibold">{stats.approvedLoans}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <XCircle className="h-4 w-4 text-red-500" />
                  <span className="text-sm text-muted-foreground">Rejected</span>
                </div>
                <span className="font-semibold">
                  {getLoans().filter(l => l.status === "rejected").length}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageShell>
  )
}

