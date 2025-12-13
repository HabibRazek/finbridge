"use client"

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
import { MOCK_USERS, MOCK_TRANSACTIONS, MOCK_GOALS } from "@/lib/mock-data"

const balanceHistory = [
  { day: "Mon", balance: 12500.000 },
  { day: "Tue", balance: 13200.000 },
  { day: "Wed", balance: 14100.000 },
  { day: "Thu", balance: 14800.000 },
  { day: "Fri", balance: 15200.000 },
  { day: "Sat", balance: 15500.000 },
  { day: "Sun", balance: 15750.500 },
]

const recentActivity = MOCK_TRANSACTIONS.slice(0, 4).map((tx, idx) => ({
  id: tx.id,
  type: tx.type,
  description: tx.description,
  amount: tx.type === 'withdrawal' ? -tx.amount : tx.amount,
  date: idx === 0 ? "Today, 10:30 AM" : idx === 1 ? "Today, 8:15 AM" : "Yesterday"
}))

const savingsGoals = MOCK_GOALS.slice(0, 2).map(goal => ({
  name: goal.name,
  current: goal.currentAmount,
  target: goal.targetAmount,
  color: "bg-primary"
}))

const chartConfig = {
  balance: {
    label: "Balance",
    color: "var(--color-primary)",
  },
}

export default function ClientDashboard() {
  const currentBalance = MOCK_USERS.client.balance || 15750.500
  const lastUpdated = new Date().toLocaleTimeString()

  return (
    <>
      <Header title="Client Dashboard" description="Your financial overview" />
      <PageShell className="pb-24 md:pb-6">
        <PageHeader
          title="My Dashboard"
          description="Real-time overview of your finances in TND"
          actions={
            <Button variant="outline" size="sm">
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
            value={formatTND(1700.000)}
            icon={ArrowUpRight}
            trend={{ value: 8.2, isPositive: true }}
            description="this month"
          />
          <StatCard
            title="Total Withdrawals"
            value={formatTND(525.750)}
            icon={ArrowDownRight}
            description="this month"
          />
          <StatCard
            title="Savings Progress"
            value={formatTND(18450.000)}
            icon={PiggyBank}
            trend={{ value: 15, isPositive: true }}
            description="towards goals"
          />
          <StatCard
            title="Active Goals"
            value="3"
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

