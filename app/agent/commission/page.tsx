"use client"

import { Header } from "@/components/layout/header"
import { PageShell, PageHeader } from "@/components/shared/page-shell"
import { StatCard } from "@/components/shared/stat-card"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
import {
  Banknote,
  TrendingUp,
  Calendar,
  Download,
  Wallet,
  ArrowUpRight
} from "lucide-react"
import { formatTND } from "@/lib/currency"

const monthlyData = [
  { month: "Jan", deposits: 45000, withdrawals: 12000, commission: 1425 },
  { month: "Feb", deposits: 52000, withdrawals: 15000, commission: 1675 },
  { month: "Mar", deposits: 48000, withdrawals: 18000, commission: 1650 },
  { month: "Apr", deposits: 61000, withdrawals: 20000, commission: 2025 },
  { month: "May", deposits: 55000, withdrawals: 22000, commission: 1925 },
  { month: "Jun", deposits: 70000, withdrawals: 25000, commission: 2375 },
]

const commissionHistory = [
  { id: "COM001", date: "2024-01-15", transaction: "TXN-2024-001", amount: 50000, rate: "2.5%", commission: 1250, status: "paid" },
  { id: "COM002", date: "2024-01-14", transaction: "TXN-2024-002", amount: 25000, rate: "2.5%", commission: 625, status: "paid" },
  { id: "COM003", date: "2024-01-14", transaction: "TXN-2024-003", amount: 100000, rate: "2.5%", commission: 2500, status: "pending" },
  { id: "COM004", date: "2024-01-13", transaction: "TXN-2024-004", amount: 35000, rate: "2.5%", commission: 875, status: "paid" },
  { id: "COM005", date: "2024-01-12", transaction: "TXN-2024-005", amount: 80000, rate: "2.5%", commission: 2000, status: "paid" },
]

const tierData = [
  { name: "Standard", value: 60 },
  { name: "Premium", value: 30 },
  { name: "VIP", value: 10 },
]

const COLORS = ["var(--color-primary)", "var(--color-chart-2)", "var(--color-chart-3)"]

const chartConfig = {
  commission: {
    label: "Commission",
    color: "var(--color-primary)",
  },
}

export default function CommissionPage() {
  return (
    <>
      <Header title="Commission Management" description="Track your earnings and commission history" />
      <PageShell>
        <PageHeader 
          title="Commission & Earnings" 
          description="View your commission calculations and earnings dashboard"
          actions={
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Export Report
            </Button>
          }
        />

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Earned (This Month)"
            value={formatTND(2375)}
            icon={Banknote}
            trend={{ value: 15.2, isPositive: true }}
            description="vs last month"
          />
          <StatCard
            title="Pending Commission"
            value={formatTND(2500)}
            icon={Wallet}
            description="3 transactions pending"
          />
          <StatCard
            title="Average Per Transaction"
            value={formatTND(47.50)}
            icon={TrendingUp}
            trend={{ value: 5.8, isPositive: true }}
            description="vs last month"
          />
          <StatCard
            title="Commission Rate"
            value="2.5%"
            icon={Calendar}
            description="Standard tier"
          />
        </div>

        {/* Charts Row */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Earnings Trend */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Earnings Trend</CardTitle>
              <CardDescription>Your commission earnings over the last 6 months</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={monthlyData}>
                    <defs>
                      <linearGradient id="colorCommission" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="month" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Area 
                      type="monotone" 
                      dataKey="commission" 
                      stroke="var(--color-primary)" 
                      fillOpacity={1} 
                      fill="url(#colorCommission)" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Commission Tiers */}
          <Card>
            <CardHeader>
              <CardTitle>Transaction Distribution</CardTitle>
              <CardDescription>By client tier</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={tierData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {tierData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 space-y-2">
                {tierData.map((tier, index) => (
                  <div key={tier.name} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div 
                        className="h-3 w-3 rounded-full" 
                        style={{ backgroundColor: COLORS[index] }}
                      />
                      <span>{tier.name}</span>
                    </div>
                    <span className="font-medium">{tier.value}%</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Commission History Table */}
        <Card>
          <CardHeader>
            <CardTitle>Commission History</CardTitle>
            <CardDescription>Detailed breakdown of your commission earnings</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="all" className="w-full">
              <TabsList>
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="paid">Paid</TabsTrigger>
                <TabsTrigger value="pending">Pending</TabsTrigger>
              </TabsList>
              <TabsContent value="all" className="mt-4">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Transaction ID</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                      <TableHead className="text-right">Rate</TableHead>
                      <TableHead className="text-right">Commission</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {commissionHistory.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>{item.date}</TableCell>
                        <TableCell className="font-mono text-sm">{item.transaction}</TableCell>
                        <TableCell className="text-right">{formatTND(item.amount)}</TableCell>
                        <TableCell className="text-right">{item.rate}</TableCell>
                        <TableCell className="text-right font-semibold text-primary">
                          {formatTND(item.commission)}
                        </TableCell>
                        <TableCell>
                          <Badge variant={item.status === "paid" ? "default" : "secondary"}>
                            {item.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TabsContent>
              <TabsContent value="paid" className="mt-4">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Transaction ID</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                      <TableHead className="text-right">Commission</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {commissionHistory.filter(item => item.status === "paid").map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>{item.date}</TableCell>
                        <TableCell className="font-mono text-sm">{item.transaction}</TableCell>
                        <TableCell className="text-right">{formatTND(item.amount)}</TableCell>
                        <TableCell className="text-right font-semibold text-primary">
                          {formatTND(item.commission)}
                        </TableCell>
                        <TableCell>
                          <Badge>paid</Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TabsContent>
              <TabsContent value="pending" className="mt-4">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Transaction ID</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                      <TableHead className="text-right">Commission</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {commissionHistory.filter(item => item.status === "pending").map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>{item.date}</TableCell>
                        <TableCell className="font-mono text-sm">{item.transaction}</TableCell>
                        <TableCell className="text-right">{formatTND(item.amount)}</TableCell>
                        <TableCell className="text-right font-semibold text-primary">
                          {formatTND(item.commission)}
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary">pending</Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </PageShell>
    </>
  )
}

