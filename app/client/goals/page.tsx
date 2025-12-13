"use client"

import { useState } from "react"
import { Header } from "@/components/layout/header"
import { PageShell, PageHeader } from "@/components/shared/page-shell"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts"
import { 
  Plus,
  Target,
  PiggyBank,
  TrendingUp,
  Calendar,
  DollarSign,
  MoreHorizontal,
  Pencil,
  Trash2,
  Sparkles,
  Home,
  Car,
  GraduationCap,
  Plane,
  Shield,
  Heart
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { formatTND } from "@/lib/currency"

const savingsGoals = [
  { id: 1, name: "Emergency Fund", type: "savings", icon: Shield, current: 150000, target: 300000, deadline: "2024-12-31", color: "#22c55e", monthlyContribution: 25000 },
  { id: 2, name: "New Laptop", type: "savings", icon: Sparkles, current: 80000, target: 120000, deadline: "2024-06-30", color: "#3b82f6", monthlyContribution: 10000 },
  { id: 3, name: "Vacation Fund", type: "savings", icon: Plane, current: 45000, target: 200000, deadline: "2024-08-15", color: "#f59e0b", monthlyContribution: 15000 },
]

const investmentGoals = [
  { id: 4, name: "Retirement Fund", type: "investment", icon: TrendingUp, current: 500000, target: 2000000, deadline: "2040-01-01", color: "#8b5cf6", monthlyContribution: 50000 },
  { id: 5, name: "House Down Payment", type: "investment", icon: Home, current: 800000, target: 1500000, deadline: "2026-01-01", color: "#ec4899", monthlyContribution: 40000 },
  { id: 6, name: "Education Fund", type: "investment", icon: GraduationCap, current: 200000, target: 500000, deadline: "2028-09-01", color: "#06b6d4", monthlyContribution: 20000 },
]

const allGoals = [...savingsGoals, ...investmentGoals]

const portfolioData = [
  { name: "Emergency", value: 150000 },
  { name: "Laptop", value: 80000 },
  { name: "Vacation", value: 45000 },
  { name: "Retirement", value: 500000 },
  { name: "House", value: 800000 },
  { name: "Education", value: 200000 },
]

const COLORS = ["#22c55e", "#3b82f6", "#f59e0b", "#8b5cf6", "#ec4899", "#06b6d4"]

const chartConfig = {
  goals: {
    label: "Goals",
  },
}

export default function FinancialGoals() {
  const [showAddGoal, setShowAddGoal] = useState(false)

  const totalSaved = allGoals.reduce((sum, goal) => sum + goal.current, 0)
  const totalTarget = allGoals.reduce((sum, goal) => sum + goal.target, 0)
  const overallProgress = (totalSaved / totalTarget) * 100

  return (
    <>
      <Header title="Financial Goals" description="Track your savings and investment goals" />
      <PageShell className="pb-20 md:pb-6">
        <PageHeader 
          title="Financial Goals" 
          description="Set and track your savings and investment goals"
          actions={
            <Dialog open={showAddGoal} onOpenChange={setShowAddGoal}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  New Goal
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Create New Goal</DialogTitle>
                  <DialogDescription>Set up a new savings or investment goal</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label>Goal Name</Label>
                    <Input placeholder="e.g., Emergency Fund" />
                  </div>
                  <div className="space-y-2">
                    <Label>Goal Type</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="savings">Savings Goal</SelectItem>
                        <SelectItem value="investment">Investment Goal</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Target Amount</Label>
                      <Input type="number" placeholder="0.00" />
                    </div>
                    <div className="space-y-2">
                      <Label>Monthly Contribution</Label>
                      <Input type="number" placeholder="0.00" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Target Date</Label>
                    <Input type="date" />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setShowAddGoal(false)}>Cancel</Button>
                  <Button onClick={() => setShowAddGoal(false)}>Create Goal</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          }
        />

        {/* Overview Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card className="md:col-span-2">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Progress</p>
                  <p className="text-3xl font-bold">{formatTND(totalSaved)}</p>
                  <p className="text-sm text-muted-foreground">of {formatTND(totalTarget)} target</p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-primary">{overallProgress.toFixed(1)}%</div>
                  <p className="text-sm text-muted-foreground">Complete</p>
                </div>
              </div>
              <Progress value={overallProgress} className="mt-4 h-3" />
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <PiggyBank className="h-8 w-8 text-green-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Savings Goals</p>
                  <p className="text-xl font-bold">{savingsGoals.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <TrendingUp className="h-8 w-8 text-purple-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Investment Goals</p>
                  <p className="text-xl font-bold">{investmentGoals.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Goals Tabs */}
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-3">
            <TabsTrigger value="all">All Goals</TabsTrigger>
            <TabsTrigger value="savings">Savings</TabsTrigger>
            <TabsTrigger value="investment">Investment</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-6">
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Goals Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>Portfolio Distribution</CardTitle>
                  <CardDescription>Breakdown of your goals by value</CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={chartConfig} className="h-[250px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={portfolioData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={100}
                          paddingAngle={2}
                          dataKey="value"
                        >
                          {portfolioData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <ChartTooltip content={<ChartTooltipContent />} />
                      </PieChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                  <div className="mt-4 grid grid-cols-2 gap-2">
                    {portfolioData.map((item, index) => (
                      <div key={item.name} className="flex items-center gap-2 text-sm">
                        <div
                          className="h-3 w-3 rounded-full"
                          style={{ backgroundColor: COLORS[index] }}
                        />
                        <span className="text-muted-foreground">{item.name}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Goals List */}
              <div className="space-y-4">
                {allGoals.map((goal) => {
                  const percentage = (goal.current / goal.target) * 100
                  const Icon = goal.icon
                  return (
                    <Card key={goal.id}>
                      <CardContent className="pt-6">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <div
                              className="flex h-10 w-10 items-center justify-center rounded-full"
                              style={{ backgroundColor: `${goal.color}20` }}
                            >
                              <Icon className="h-5 w-5" style={{ color: goal.color }} />
                            </div>
                            <div>
                              <p className="font-medium">{goal.name}</p>
                              <Badge variant="outline" className="mt-1 text-xs">
                                {goal.type === "savings" ? "Savings" : "Investment"}
                              </Badge>
                            </div>
                          </div>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <Pencil className="mr-2 h-4 w-4" />
                                Edit Goal
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <DollarSign className="mr-2 h-4 w-4" />
                                Add Funds
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-destructive">
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete Goal
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                        <div className="mt-4">
                          <div className="flex justify-between text-sm mb-2">
                            <span className="text-muted-foreground">
                              {formatTND(goal.current)}
                            </span>
                            <span className="font-medium">
                              {formatTND(goal.target)}
                            </span>
                          </div>
                          <Progress
                            value={percentage}
                            className="h-2"
                            style={{ ["--progress-color" as string]: goal.color }}
                          />
                          <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {goal.deadline}
                            </span>
                            <span className="font-medium" style={{ color: goal.color }}>
                              {percentage.toFixed(0)}% complete
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="savings" className="mt-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {savingsGoals.map((goal) => {
                const percentage = (goal.current / goal.target) * 100
                const Icon = goal.icon
                return (
                  <Card key={goal.id}>
                    <CardHeader className="pb-2">
                      <div className="flex items-center gap-3">
                        <div
                          className="flex h-10 w-10 items-center justify-center rounded-full"
                          style={{ backgroundColor: `${goal.color}20` }}
                        >
                          <Icon className="h-5 w-5" style={{ color: goal.color }} />
                        </div>
                        <CardTitle className="text-base">{goal.name}</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <Progress value={percentage} className="h-2" />
                      <div className="mt-2 flex justify-between text-sm">
                        <span className="text-muted-foreground">
                          {formatTND(goal.current)}
                        </span>
                        <span className="font-medium" style={{ color: goal.color }}>
                          {percentage.toFixed(0)}%
                        </span>
                      </div>
                    </CardContent>
                    <CardFooter className="pt-0">
                      <Button variant="outline" size="sm" className="w-full">
                        <DollarSign className="mr-2 h-4 w-4" />
                        Add Funds
                      </Button>
                    </CardFooter>
                  </Card>
                )
              })}
            </div>
          </TabsContent>

          <TabsContent value="investment" className="mt-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {investmentGoals.map((goal) => {
                const percentage = (goal.current / goal.target) * 100
                const Icon = goal.icon
                return (
                  <Card key={goal.id}>
                    <CardHeader className="pb-2">
                      <div className="flex items-center gap-3">
                        <div
                          className="flex h-10 w-10 items-center justify-center rounded-full"
                          style={{ backgroundColor: `${goal.color}20` }}
                        >
                          <Icon className="h-5 w-5" style={{ color: goal.color }} />
                        </div>
                        <CardTitle className="text-base">{goal.name}</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <Progress value={percentage} className="h-2" />
                      <div className="mt-2 flex justify-between text-sm">
                        <span className="text-muted-foreground">
                          {formatTND(goal.current)}
                        </span>
                        <span className="font-medium" style={{ color: goal.color }}>
                          {percentage.toFixed(0)}%
                        </span>
                      </div>
                    </CardContent>
                    <CardFooter className="pt-0">
                      <Button variant="outline" size="sm" className="w-full">
                        <TrendingUp className="mr-2 h-4 w-4" />
                        View Details
                      </Button>
                    </CardFooter>
                  </Card>
                )
              })}
            </div>
          </TabsContent>
        </Tabs>
      </PageShell>
    </>
  )
}

