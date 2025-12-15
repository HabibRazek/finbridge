"use client"

import { Header } from "@/components/layout/header"
import { PageShell, PageHeader } from "@/components/shared/page-shell"
import { StatCard } from "@/components/shared/stat-card"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, LineChart, Line } from "recharts"
import {
  Banknote,
  Users,
  Receipt,
  TrendingUp,
  ArrowUpRight,
  Clock
} from "lucide-react"
import Link from "next/link"
import { formatTND } from "@/lib/currency"
import { MOCK_COMMISSIONS } from "@/lib/mock-data"

const earningsData = MOCK_COMMISSIONS.slice(0, 6)

const recentTransactions = [
  { id: "TXN001", client: "Ahmed Ben Ali", amount: 500.000, time: "2 min ago", status: "completed" },
  { id: "TXN002", client: "Leila Mansour", amount: 250.000, time: "15 min ago", status: "completed" },
  { id: "TXN003", client: "Karim Trabelsi", amount: 1000.000, time: "1 hour ago", status: "pending" },
  { id: "TXN004", client: "Amira Bouazizi", amount: 350.000, time: "2 hours ago", status: "completed" },
]

const chartConfig = {
  earnings: {
    label: "Earnings",
    color: "var(--color-primary)",
  },
}

export default function AgentDashboard() {
  return (
    <>
      <Header title="Agent Dashboard" description="Overview of your earnings and activity" />
      <PageShell>
        <PageHeader 
          title="Dashboard" 
          description="Track your performance and earnings"
          actions={
            <Button asChild>
              <Link href="/agent/transaction">
                <Receipt className="mr-2 h-4 w-4" />
                New Transaction
              </Link>
            </Button>
          }
        />

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Earnings"
            value={formatTND(9700.000)}
            icon={Banknote}
            trend={{ value: 12.5, isPositive: true }}
            description="vs last month"
          />
          <StatCard
            title="Transactions Today"
            value="24"
            icon={Receipt}
            trend={{ value: 8, isPositive: true }}
            description="vs yesterday"
          />
          <StatCard
            title="Active Clients"
            value="156"
            icon={Users}
            trend={{ value: 3.2, isPositive: true }}
            description="new this week"
          />
          <StatCard
            title="Commission Rate"
            value="0.5%"
            icon={TrendingUp}
            description="Per transaction"
          />
        </div>

        {/* Charts and Recent Activity */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Earnings Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Monthly Earnings</CardTitle>
              <CardDescription>Your commission earnings over the last 6 months</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={earningsData}>
                    <XAxis dataKey="month" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="earnings" fill="var(--color-primary)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Recent Transactions */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Recent Transactions</CardTitle>
                <CardDescription>Latest deposits and transfers</CardDescription>
              </div>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/agent/history">
                  View All
                  <ArrowUpRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentTransactions.map((txn) => (
                  <div key={txn.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                        <Receipt className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">{txn.client}</p>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          {txn.time}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">{formatTND(txn.amount)}</p>
                      <Badge
                        variant={txn.status === "completed" ? "default" : "secondary"}
                        className="text-xs"
                      >
                        {txn.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </PageShell>
    </>
  )
}

