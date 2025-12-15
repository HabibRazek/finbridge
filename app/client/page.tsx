"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/layout/header"
import { PageShell, PageHeader } from "@/components/shared/page-shell"
import { StatCard } from "@/components/shared/stat-card"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from "recharts"
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
  CreditCard,
  PiggyBank,
  Target,
  Bell,
  RefreshCw
} from "lucide-react"
import Link from "next/link"
import { formatTND } from "@/lib/currency"
import { useAuth } from "@/lib/auth-context"
import { getUserByEmail, getTransactions, getGoals } from "@/lib/json-storage"

const chartConfig = {
  balance: {
    label: "Balance",
    color: "var(--color-primary)",
  },
}

export default function ClientDashboard() {
  const { user } = useAuth()
  const [currentBalance, setCurrentBalance] = useState(0)
  const [transactions, setTransactions] = useState<any[]>([])
  const [goals, setGoals] = useState<any[]>([])
  const [lastUpdated, setLastUpdated] = useState(new Date().toLocaleTimeString())

  useEffect(() => {
    if (user?.email) {
      const clientUser = getUserByEmail(user.email)
      if (clientUser) {
        setCurrentBalance(clientUser.balance || 0)
        
        // Get transactions
        const userTransactions = getTransactions(clientUser.id)
        setTransactions(userTransactions)
        
        // Get goals
        const userGoals = getGoals(clientUser.id)
        setGoals(userGoals)
        
        setLastUpdated(new Date().toLocaleTimeString())
      }
    }
  }, [user])

  const handleRefresh = () => {
    if (user?.email) {
      const clientUser = getUserByEmail(user.email)
      if (clientUser) {
        setCurrentBalance(clientUser.balance || 0)
        const userTransactions = getTransactions(clientUser.id)
        setTransactions(userTransactions)
        const userGoals = getGoals(clientUser.id)
        setGoals(userGoals)
        setLastUpdated(new Date().toLocaleTimeString())
      }
    }
  }

  // Calculate stats from transactions
  const thisMonthTransactions = transactions.filter(tx => {
    const txDate = new Date(tx.date)
    const now = new Date()
    return txDate.getMonth() === now.getMonth() && txDate.getFullYear() === now.getFullYear()
  })

  const totalDeposits = thisMonthTransactions
    .filter(tx => tx.type === 'deposit' && tx.status === 'completed')
    .reduce((sum, tx) => sum + tx.amount, 0)

  const totalWithdrawals = thisMonthTransactions
    .filter(tx => tx.type === 'withdrawal' && tx.status === 'completed')
    .reduce((sum, tx) => sum + tx.amount, 0)

  const totalSavings = goals.reduce((sum, goal) => sum + goal.currentAmount, 0)

  // Balance history (last 7 days) - simplified version
  const balanceHistory = Array.from({ length: 7 }, (_, i) => {
    const date = new Date()
    date.setDate(date.getDate() - (6 - i))
    // For now, show current balance for all days
    // In a real app, you'd calculate historical balance from transactions
    return {
      day: date.toLocaleDateString('en-US', { weekday: 'short' }),
      balance: currentBalance
    }
  })

  const recentActivity = transactions
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 4)
    .map((tx, idx) => ({
      id: tx.id,
      type: tx.type,
      description: tx.description,
      amount: tx.type === 'withdrawal' ? -tx.amount : tx.amount,
      date: idx === 0 ? "Today" : idx === 1 ? "Yesterday" : new Date(tx.date).toLocaleDateString()
    }))

  const savingsGoals = goals.slice(0, 2).map(goal => ({
    name: goal.name,
    current: goal.currentAmount,
    target: goal.targetAmount,
    color: "bg-primary"
  }))

  return (
    <>
      <Header title="Client Dashboard" description="Your financial overview" />
      <PageShell className="pb-24 md:pb-6">
        <PageHeader
          title="My Dashboard"
          description="Real-time overview of your finances in TND"
          actions={
            <Button variant="outline" size="sm" onClick={handleRefresh}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh
            </Button>
          }
        />

        {/* Main Balance Card */}
        <Card className="border-primary/20 bg-linear-to-br from-primary/5 to-primary/10">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center md:flex-row md:justify-between md:text-left">
              <div>
                <p className="text-sm text-muted-foreground">Available Balance</p>
                <p className="text-4xl font-bold tracking-tight">{formatTND(currentBalance)}</p>
                <div className="mt-2 flex items-center gap-2 text-sm">
                  <Badge variant="secondary" className="gap-1">
                    <TrendingUp className="h-3 w-3 text-green-500" />
                    +12.5%
                  </Badge>
                  <span className="text-muted-foreground">vs last week</span>
                </div>
              </div>
              <div className="mt-4 flex gap-2 md:mt-0">
                <Button className="bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                  <ArrowUpRight className="mr-2 h-4 w-4" />
                  Send Money
                </Button>
                <Button variant="outline">
                  <ArrowDownRight className="mr-2 h-4 w-4" />
                  Request
                </Button>
              </div>
            </div>
            <p className="mt-4 text-xs text-muted-foreground text-center md:text-left">
              Last updated: {lastUpdated}
            </p>
          </CardContent>
        </Card>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Deposits"
            value={formatTND(totalDeposits)}
            icon={ArrowUpRight}
            trend={{ value: 8.2, isPositive: true }}
            description="this month"
          />
          <StatCard
            title="Total Withdrawals"
            value={formatTND(totalWithdrawals)}
            icon={ArrowDownRight}
            description="this month"
          />
          <StatCard
            title="Savings Progress"
            value={formatTND(totalSavings)}
            icon={PiggyBank}
            trend={{ value: 15, isPositive: true }}
            description="towards goals"
          />
          <StatCard
            title="Active Goals"
            value={goals.length.toString()}
            icon={Target}
            description="savings goals"
          />
        </div>

        {/* Charts and Activity Row */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Balance Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Balance Trend</CardTitle>
              <CardDescription>Your balance over the past week</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-[250px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={balanceHistory}>
                    <XAxis dataKey="day" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Line 
                      type="monotone" 
                      dataKey="balance" 
                      stroke="var(--color-primary)" 
                      strokeWidth={2}
                      dot={{ fill: "var(--color-primary)" }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Your latest transactions</CardDescription>
              </div>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/client/history">View All</Link>
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`flex h-10 w-10 items-center justify-center rounded-full ${
                        activity.amount > 0 ? "bg-green-100" : "bg-red-100"
                      }`}>
                        {activity.amount > 0 ? (
                          <ArrowUpRight className="h-5 w-5 text-green-600" />
                        ) : (
                          <ArrowDownRight className="h-5 w-5 text-red-600" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-sm">{activity.description}</p>
                        <p className="text-xs text-muted-foreground">{activity.date}</p>
                      </div>
                    </div>
                    <span className={`font-semibold ${
                      activity.amount > 0 ? "text-green-600" : "text-red-600"
                    }`}>
                      {activity.amount > 0 ? "+" : ""}{formatTND(Math.abs(activity.amount))}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Savings Goals */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Savings Goals</CardTitle>
              <CardDescription>Track your progress towards financial goals</CardDescription>
            </div>
            <Button variant="outline" size="sm" asChild>
              <Link href="/client/goals">
                Manage Goals
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-2">
              {savingsGoals.map((goal) => (
                <div key={goal.name} className="rounded-lg border p-4">
                  <div className="flex items-center justify-between">
                    <p className="font-medium">{goal.name}</p>
                    <span className="text-sm text-muted-foreground">
                      {Math.round((goal.current / goal.target) * 100)}%
                    </span>
                  </div>
                  <Progress
                    value={(goal.current / goal.target) * 100}
                    className="mt-3 h-2"
                  />
                  <div className="mt-2 flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      {formatTND(goal.current)}
                    </span>
                    <span className="font-medium">
                      {formatTND(goal.target)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions - Mobile Friendly */}
        <div className="fixed bottom-0 left-0 right-0 border-t bg-background p-4 md:hidden">
          <div className="flex justify-around">
            <Button variant="ghost" className="flex-col gap-1 h-auto py-2">
              <Wallet className="h-5 w-5" />
              <span className="text-xs">Balance</span>
            </Button>
            <Button variant="ghost" className="flex-col gap-1 h-auto py-2">
              <CreditCard className="h-5 w-5" />
              <span className="text-xs">Cards</span>
            </Button>
            <Button variant="ghost" className="flex-col gap-1 h-auto py-2">
              <PiggyBank className="h-5 w-5" />
              <span className="text-xs">Budget</span>
            </Button>
            <Button variant="ghost" className="flex-col gap-1 h-auto py-2">
              <Bell className="h-5 w-5" />
              <span className="text-xs">Alerts</span>
            </Button>
          </div>
        </div>
      </PageShell>
    </>
  )
}

