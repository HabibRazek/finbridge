"use client"

import { useState, useEffect } from "react"
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
  Heart,
  Loader2,
  CheckCircle2,
  RefreshCw
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { formatTND } from "@/lib/currency"
import { useAuth } from "@/lib/auth-context"
import { getUserByEmail, getGoals, createGoal, updateGoal, deleteGoal, type Goal } from "@/lib/json-storage"

const COLORS = ["#22c55e", "#3b82f6", "#f59e0b", "#8b5cf6", "#ec4899", "#06b6d4"]

// Icon mapping for goal categories
const getIconForCategory = (category: string) => {
  const iconMap: Record<string, any> = {
    "Savings": Shield,
    "Purchase": Sparkles,
    "Travel": Plane,
    "Investment": TrendingUp,
    "Home": Home,
    "Education": GraduationCap,
    "Car": Car,
    "Health": Heart,
  }
  return iconMap[category] || Target
}

const chartConfig = {
  goals: {
    label: "Goals",
  },
}

export default function FinancialGoals() {
  const { user } = useAuth()
  const [goals, setGoals] = useState<Goal[]>([])
  const [showAddGoal, setShowAddGoal] = useState(false)
  const [showEditGoal, setShowEditGoal] = useState(false)
  const [showAddFunds, setShowAddFunds] = useState(false)
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  
  const [formData, setFormData] = useState({
    name: "",
    targetAmount: "",
    currentAmount: "0",
    deadline: "",
    category: "Savings",
  })

  const [addFundsAmount, setAddFundsAmount] = useState("")

  useEffect(() => {
    if (user?.email) {
      const clientUser = getUserByEmail(user.email)
      if (clientUser) {
        const userGoals = getGoals(clientUser.id)
        setGoals(userGoals)
      }
    }
  }, [user])

  const handleRefresh = () => {
    if (user?.email) {
      const clientUser = getUserByEmail(user.email)
      if (clientUser) {
        const userGoals = getGoals(clientUser.id)
        setGoals(userGoals)
      }
    }
  }

  const handleCreateGoal = async () => {
    if (!user?.email) {
      setError("Please log in to create a goal")
      return
    }

    if (!formData.name || !formData.targetAmount || !formData.deadline) {
      setError("Please fill in all required fields")
      return
    }

    setIsSubmitting(true)
    setError("")

    try {
      const clientUser = getUserByEmail(user.email)
      if (!clientUser) {
        setError("User not found")
        setIsSubmitting(false)
        return
      }

      createGoal({
        userId: clientUser.id,
        name: formData.name,
        targetAmount: parseFloat(formData.targetAmount),
        currentAmount: parseFloat(formData.currentAmount),
        deadline: formData.deadline,
        category: formData.category
      })

      setSuccess("Goal created successfully!")
      setFormData({ name: "", targetAmount: "", currentAmount: "0", deadline: "", category: "Savings" })
      handleRefresh()
      
      setTimeout(() => {
        setShowAddGoal(false)
        setSuccess("")
      }, 1500)
    } catch (err: any) {
      setError(err.message || "Failed to create goal")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEditGoal = (goal: Goal) => {
    setSelectedGoal(goal)
    setFormData({
      name: goal.name,
      targetAmount: goal.targetAmount.toString(),
      currentAmount: goal.currentAmount.toString(),
      deadline: goal.deadline,
      category: goal.category
    })
    setShowEditGoal(true)
  }

  const handleUpdateGoal = async () => {
    if (!selectedGoal) return

    if (!formData.name || !formData.targetAmount || !formData.deadline) {
      setError("Please fill in all required fields")
      return
    }

    setIsSubmitting(true)
    setError("")

    try {
      updateGoal(selectedGoal.id, {
        name: formData.name,
        targetAmount: parseFloat(formData.targetAmount),
        currentAmount: parseFloat(formData.currentAmount),
        deadline: formData.deadline,
        category: formData.category
      })

      setSuccess("Goal updated successfully!")
      handleRefresh()
      
      setTimeout(() => {
        setShowEditGoal(false)
        setSelectedGoal(null)
        setSuccess("")
        setFormData({ name: "", targetAmount: "", currentAmount: "0", deadline: "", category: "Savings" })
      }, 1500)
    } catch (err: any) {
      setError(err.message || "Failed to update goal")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteGoal = async (goalId: string) => {
    if (!confirm("Are you sure you want to delete this goal?")) return

    try {
      deleteGoal(goalId)
      setSuccess("Goal deleted successfully!")
      handleRefresh()
      setTimeout(() => setSuccess(""), 2000)
    } catch (err: any) {
      setError(err.message || "Failed to delete goal")
    }
  }

  const handleAddFunds = (goal: Goal) => {
    setSelectedGoal(goal)
    setAddFundsAmount("")
    setShowAddFunds(true)
  }

  const handleSubmitAddFunds = async () => {
    if (!selectedGoal) return

    const amount = parseFloat(addFundsAmount)
    if (isNaN(amount) || amount <= 0) {
      setError("Please enter a valid amount")
      return
    }

    setIsSubmitting(true)
    setError("")

    try {
      updateGoal(selectedGoal.id, {
        currentAmount: selectedGoal.currentAmount + amount
      })

      setSuccess("Funds added successfully!")
      handleRefresh()
      
      setTimeout(() => {
        setShowAddFunds(false)
        setSelectedGoal(null)
        setAddFundsAmount("")
        setSuccess("")
      }, 1500)
    } catch (err: any) {
      setError(err.message || "Failed to add funds")
    } finally {
      setIsSubmitting(false)
    }
  }

  // Separate goals by category
  const savingsGoals = goals.filter(g => g.category === "Savings" || g.category === "Purchase" || g.category === "Travel")
  const investmentGoals = goals.filter(g => g.category === "Investment" || g.category === "Home" || g.category === "Education")
  const allGoals = goals

  // Calculate totals
  const totalSaved = allGoals.reduce((sum, goal) => sum + goal.currentAmount, 0)
  const totalTarget = allGoals.reduce((sum, goal) => sum + goal.targetAmount, 0)
  const overallProgress = totalTarget > 0 ? (totalSaved / totalTarget) * 100 : 0

  // Portfolio data for chart
  const portfolioData = allGoals.map(goal => ({
    name: goal.name,
    value: goal.currentAmount
  }))

  return (
    <>
      <Header title="Financial Goals" description="Track your savings and investment goals" />
      <PageShell className="pb-20 md:pb-6">
        <PageHeader 
          title="Financial Goals" 
          description="Set and track your savings and investment goals"
          actions={
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleRefresh}>
                <RefreshCw className="mr-2 h-4 w-4" />
                Refresh
              </Button>
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
                    <Label>Goal Name <span className="text-red-500">*</span></Label>
                    <Input 
                      placeholder="e.g., Emergency Fund" 
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Category <span className="text-red-500">*</span></Label>
                    <Select 
                      value={formData.category}
                      onValueChange={(value) => setFormData({ ...formData, category: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Savings">Savings</SelectItem>
                        <SelectItem value="Purchase">Purchase</SelectItem>
                        <SelectItem value="Travel">Travel</SelectItem>
                        <SelectItem value="Investment">Investment</SelectItem>
                        <SelectItem value="Home">Home</SelectItem>
                        <SelectItem value="Education">Education</SelectItem>
                        <SelectItem value="Car">Car</SelectItem>
                        <SelectItem value="Health">Health</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Target Amount (TND) <span className="text-red-500">*</span></Label>
                      <Input 
                        type="number" 
                        step="0.001"
                        placeholder="0.000" 
                        value={formData.targetAmount}
                        onChange={(e) => setFormData({ ...formData, targetAmount: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Current Amount (TND)</Label>
                      <Input 
                        type="number" 
                        step="0.001"
                        placeholder="0.000" 
                        value={formData.currentAmount}
                        onChange={(e) => setFormData({ ...formData, currentAmount: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Target Date <span className="text-red-500">*</span></Label>
                    <Input 
                      type="date" 
                      value={formData.deadline}
                      onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                    />
                  </div>
                  {error && (
                    <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">
                      {error}
                    </div>
                  )}
                  {success && (
                    <div className="rounded-lg bg-green-50 p-3 text-sm text-green-600 dark:bg-green-900/20 dark:text-green-400 flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4" />
                      {success}
                    </div>
                  )}
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => {
                    setShowAddGoal(false)
                    setError("")
                    setFormData({ name: "", targetAmount: "", currentAmount: "0", deadline: "", category: "Savings" })
                  }}>Cancel</Button>
                  <Button onClick={handleCreateGoal} disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      "Create Goal"
                    )}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            </div>
          }
        />

        {success && !showAddGoal && !showEditGoal && !showAddFunds && (
          <div className="rounded-lg bg-green-50 p-3 text-sm text-green-600 dark:bg-green-900/20 dark:text-green-400 flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4" />
            {success}
          </div>
        )}

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
                  {portfolioData.length === 0 ? (
                    <div className="h-[250px] flex items-center justify-center">
                      <div className="text-center">
                        <Target className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                        <p className="text-muted-foreground">No goals to display</p>
                      </div>
                    </div>
                  ) : (
                    <>
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
                              style={{ backgroundColor: COLORS[index % COLORS.length] }}
                            />
                            <span className="text-muted-foreground">{item.name}</span>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>

              {/* Goals List */}
              <div className="space-y-4">
                {allGoals.length === 0 ? (
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-center py-8">
                        <Target className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                        <h3 className="text-lg font-semibold mb-2">No Goals Yet</h3>
                        <p className="text-muted-foreground mb-4">Create your first financial goal to get started</p>
                        <Button onClick={() => setShowAddGoal(true)}>
                          <Plus className="mr-2 h-4 w-4" />
                          Create Goal
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  allGoals.map((goal) => {
                    const percentage = (goal.currentAmount / goal.targetAmount) * 100
                    const Icon = getIconForCategory(goal.category)
                    const colorIndex = allGoals.indexOf(goal) % COLORS.length
                    const color = COLORS[colorIndex]
                    return (
                      <Card key={goal.id}>
                        <CardContent className="pt-6">
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-3">
                              <div
                                className="flex h-10 w-10 items-center justify-center rounded-full"
                                style={{ backgroundColor: `${color}20` }}
                              >
                                <Icon className="h-5 w-5" style={{ color: color }} />
                              </div>
                              <div>
                                <p className="font-medium">{goal.name}</p>
                                <Badge variant="outline" className="mt-1 text-xs">
                                  {goal.category}
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
                                <DropdownMenuItem onClick={() => handleEditGoal(goal)}>
                                  <Pencil className="mr-2 h-4 w-4" />
                                  Edit Goal
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleAddFunds(goal)}>
                                  <DollarSign className="mr-2 h-4 w-4" />
                                  Add Funds
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                  className="text-destructive"
                                  onClick={() => handleDeleteGoal(goal.id)}
                                >
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Delete Goal
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                          <div className="mt-4">
                            <div className="flex justify-between text-sm mb-2">
                              <span className="text-muted-foreground">
                                {formatTND(goal.currentAmount)}
                              </span>
                              <span className="font-medium">
                                {formatTND(goal.targetAmount)}
                              </span>
                            </div>
                            <Progress
                              value={percentage}
                              className="h-2"
                            />
                            <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {new Date(goal.deadline).toLocaleDateString()}
                              </span>
                              <span className="font-medium" style={{ color: color }}>
                                {percentage.toFixed(0)}% complete
                              </span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="savings" className="mt-6">
            {savingsGoals.length === 0 ? (
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center py-8">
                    <PiggyBank className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No Savings Goals</h3>
                    <p className="text-muted-foreground">Create a savings goal to get started</p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {savingsGoals.map((goal) => {
                  const percentage = (goal.currentAmount / goal.targetAmount) * 100
                  const Icon = getIconForCategory(goal.category)
                  const colorIndex = allGoals.indexOf(goal) % COLORS.length
                  const color = COLORS[colorIndex]
                  return (
                    <Card key={goal.id}>
                      <CardHeader className="pb-2">
                        <div className="flex items-center gap-3">
                          <div
                            className="flex h-10 w-10 items-center justify-center rounded-full"
                            style={{ backgroundColor: `${color}20` }}
                          >
                            <Icon className="h-5 w-5" style={{ color: color }} />
                          </div>
                          <CardTitle className="text-base">{goal.name}</CardTitle>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <Progress value={percentage} className="h-2" />
                        <div className="mt-2 flex justify-between text-sm">
                          <span className="text-muted-foreground">
                            {formatTND(goal.currentAmount)}
                          </span>
                          <span className="font-medium" style={{ color: color }}>
                            {percentage.toFixed(0)}%
                          </span>
                        </div>
                      </CardContent>
                      <CardFooter className="pt-0">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="w-full"
                          onClick={() => handleAddFunds(goal)}
                        >
                          <DollarSign className="mr-2 h-4 w-4" />
                          Add Funds
                        </Button>
                      </CardFooter>
                    </Card>
                  )
                })}
              </div>
            )}
          </TabsContent>

          <TabsContent value="investment" className="mt-6">
            {investmentGoals.length === 0 ? (
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center py-8">
                    <TrendingUp className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No Investment Goals</h3>
                    <p className="text-muted-foreground">Create an investment goal to get started</p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {investmentGoals.map((goal) => {
                  const percentage = (goal.currentAmount / goal.targetAmount) * 100
                  const Icon = getIconForCategory(goal.category)
                  const colorIndex = allGoals.indexOf(goal) % COLORS.length
                  const color = COLORS[colorIndex]
                  return (
                    <Card key={goal.id}>
                      <CardHeader className="pb-2">
                        <div className="flex items-center gap-3">
                          <div
                            className="flex h-10 w-10 items-center justify-center rounded-full"
                            style={{ backgroundColor: `${color}20` }}
                          >
                            <Icon className="h-5 w-5" style={{ color: color }} />
                          </div>
                          <CardTitle className="text-base">{goal.name}</CardTitle>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <Progress value={percentage} className="h-2" />
                        <div className="mt-2 flex justify-between text-sm">
                          <span className="text-muted-foreground">
                            {formatTND(goal.currentAmount)}
                          </span>
                          <span className="font-medium" style={{ color: color }}>
                            {percentage.toFixed(0)}%
                          </span>
                        </div>
                      </CardContent>
                      <CardFooter className="pt-0">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="w-full"
                          onClick={() => handleAddFunds(goal)}
                        >
                          <TrendingUp className="mr-2 h-4 w-4" />
                          Add Funds
                        </Button>
                      </CardFooter>
                    </Card>
                  )
                })}
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Edit Goal Dialog */}
        <Dialog open={showEditGoal} onOpenChange={setShowEditGoal}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Edit Goal</DialogTitle>
              <DialogDescription>Update your financial goal</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Goal Name <span className="text-red-500">*</span></Label>
                <Input 
                  placeholder="e.g., Emergency Fund" 
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Category <span className="text-red-500">*</span></Label>
                <Select 
                  value={formData.category}
                  onValueChange={(value) => setFormData({ ...formData, category: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Savings">Savings</SelectItem>
                    <SelectItem value="Purchase">Purchase</SelectItem>
                    <SelectItem value="Travel">Travel</SelectItem>
                    <SelectItem value="Investment">Investment</SelectItem>
                    <SelectItem value="Home">Home</SelectItem>
                    <SelectItem value="Education">Education</SelectItem>
                    <SelectItem value="Car">Car</SelectItem>
                    <SelectItem value="Health">Health</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Target Amount (TND) <span className="text-red-500">*</span></Label>
                  <Input 
                    type="number" 
                    step="0.001"
                    placeholder="0.000" 
                    value={formData.targetAmount}
                    onChange={(e) => setFormData({ ...formData, targetAmount: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Current Amount (TND)</Label>
                  <Input 
                    type="number" 
                    step="0.001"
                    placeholder="0.000" 
                    value={formData.currentAmount}
                    onChange={(e) => setFormData({ ...formData, currentAmount: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Target Date <span className="text-red-500">*</span></Label>
                <Input 
                  type="date" 
                  value={formData.deadline}
                  onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                />
              </div>
              {error && (
                <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">
                  {error}
                </div>
              )}
              {success && (
                <div className="rounded-lg bg-green-50 p-3 text-sm text-green-600 dark:bg-green-900/20 dark:text-green-400 flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4" />
                  {success}
                </div>
              )}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => {
                setShowEditGoal(false)
                setSelectedGoal(null)
                setError("")
                setFormData({ name: "", targetAmount: "", currentAmount: "0", deadline: "", category: "Savings" })
              }}>Cancel</Button>
              <Button onClick={handleUpdateGoal} disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  "Update Goal"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Add Funds Dialog */}
        <Dialog open={showAddFunds} onOpenChange={setShowAddFunds}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Add Funds to Goal</DialogTitle>
              <DialogDescription>
                Add money to "{selectedGoal?.name}" goal
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Current Amount</Label>
                <Input 
                  value={formatTND(selectedGoal?.currentAmount || 0)} 
                  disabled
                  className="bg-muted"
                />
              </div>
              <div className="space-y-2">
                <Label>Amount to Add (TND) <span className="text-red-500">*</span></Label>
                <Input 
                  type="number" 
                  step="0.001"
                  placeholder="0.000" 
                  value={addFundsAmount}
                  onChange={(e) => setAddFundsAmount(e.target.value)}
                />
              </div>
              {selectedGoal && (
                <div className="rounded-lg border p-3 bg-muted/50">
                  <div className="text-sm text-muted-foreground">New Total</div>
                  <div className="text-2xl font-bold">
                    {formatTND(selectedGoal.currentAmount + (parseFloat(addFundsAmount) || 0))}
                  </div>
                </div>
              )}
              {error && (
                <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">
                  {error}
                </div>
              )}
              {success && (
                <div className="rounded-lg bg-green-50 p-3 text-sm text-green-600 dark:bg-green-900/20 dark:text-green-400 flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4" />
                  {success}
                </div>
              )}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => {
                setShowAddFunds(false)
                setSelectedGoal(null)
                setAddFundsAmount("")
                setError("")
              }}>Cancel</Button>
              <Button onClick={handleSubmitAddFunds} disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Adding...
                  </>
                ) : (
                  "Add Funds"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </PageShell>
    </>
  )
}

