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
import { Switch } from "@/components/ui/switch"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { 
  Plus,
  TrendingUp,
  TrendingDown,
  ShoppingCart,
  Home,
  Car,
  Utensils,
  Zap,
  Heart,
  GraduationCap,
  Plane,
  Bell,
  AlertTriangle,
  CheckCircle2,
  MoreHorizontal,
  Pencil,
  Trash2,
  Loader2,
  RefreshCw,
  DollarSign
} from "lucide-react"
import { formatTND } from "@/lib/currency"
import { useAuth } from "@/lib/auth-context"
import { getUserByEmail, getBudgets, createBudget, updateBudget, deleteBudget, type Budget } from "@/lib/json-storage"

// Category icon mapping
const getCategoryIcon = (category: string) => {
  const iconMap: Record<string, any> = {
    "Food": Utensils,
    "Transport": Car,
    "Bills": Zap,
    "Leisure": ShoppingCart,
    "Housing": Home,
    "Healthcare": Heart,
    "Education": GraduationCap,
    "Travel": Plane,
  }
  return iconMap[category] || ShoppingCart
}

// Category color mapping
const getCategoryColor = (category: string, index: number) => {
  const colorMap: Record<string, string> = {
    "Food": "bg-orange-500",
    "Transport": "bg-purple-500",
    "Bills": "bg-yellow-500",
    "Leisure": "bg-pink-500",
    "Housing": "bg-blue-500",
    "Healthcare": "bg-red-500",
    "Education": "bg-green-500",
    "Travel": "bg-cyan-500",
  }
  return colorMap[category] || "bg-gray-500"
}

export default function BudgetPlanner() {
  const { user } = useAuth()
  const [budgets, setBudgets] = useState<Budget[]>([])
  const [showAddBudget, setShowAddBudget] = useState(false)
  const [showEditBudget, setShowEditBudget] = useState(false)
  const [showAddExpense, setShowAddExpense] = useState(false)
  const [selectedBudget, setSelectedBudget] = useState<Budget | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  
  const [budgetFormData, setBudgetFormData] = useState({
    name: "",
    amount: "",
    category: "Food",
    period: "monthly" as "monthly" | "weekly" | "yearly"
  })

  const [expenseFormData, setExpenseFormData] = useState({
    budgetId: "",
    amount: "",
    description: "",
    date: new Date().toISOString().split('T')[0]
  })

  useEffect(() => {
    if (user?.email) {
      const clientUser = getUserByEmail(user.email)
      if (clientUser) {
        const userBudgets = getBudgets(clientUser.id)
        setBudgets(userBudgets)
      }
    }
  }, [user])

  const handleRefresh = () => {
    if (user?.email) {
      const clientUser = getUserByEmail(user.email)
      if (clientUser) {
        const userBudgets = getBudgets(clientUser.id)
        setBudgets(userBudgets)
      }
    }
  }

  const handleCreateBudget = async () => {
    if (!user?.email) {
      setError("Please log in to create a budget")
      return
    }

    if (!budgetFormData.name || !budgetFormData.amount) {
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

      createBudget({
        userId: clientUser.id,
        name: budgetFormData.name,
        amount: parseFloat(budgetFormData.amount),
        spent: 0,
        category: budgetFormData.category,
        period: budgetFormData.period
      })

      setSuccess("Budget created successfully!")
      setBudgetFormData({ name: "", amount: "", category: "Food", period: "monthly" })
      handleRefresh()
      
      setTimeout(() => {
        setShowAddBudget(false)
        setSuccess("")
      }, 1500)
    } catch (err: any) {
      setError(err.message || "Failed to create budget")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEditBudget = (budget: Budget) => {
    setSelectedBudget(budget)
    setBudgetFormData({
      name: budget.name,
      amount: budget.amount.toString(),
      category: budget.category,
      period: budget.period
    })
    setShowEditBudget(true)
  }

  const handleUpdateBudget = async () => {
    if (!selectedBudget) return

    if (!budgetFormData.name || !budgetFormData.amount) {
      setError("Please fill in all required fields")
      return
    }

    setIsSubmitting(true)
    setError("")

    try {
      updateBudget(selectedBudget.id, {
        name: budgetFormData.name,
        amount: parseFloat(budgetFormData.amount),
        category: budgetFormData.category,
        period: budgetFormData.period
      })

      setSuccess("Budget updated successfully!")
      handleRefresh()
      
      setTimeout(() => {
        setShowEditBudget(false)
        setSelectedBudget(null)
        setSuccess("")
        setBudgetFormData({ name: "", amount: "", category: "Food", period: "monthly" })
      }, 1500)
    } catch (err: any) {
      setError(err.message || "Failed to update budget")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteBudget = async (budgetId: string) => {
    if (!confirm("Are you sure you want to delete this budget?")) return

    try {
      deleteBudget(budgetId)
      setSuccess("Budget deleted successfully!")
      handleRefresh()
      setTimeout(() => setSuccess(""), 2000)
    } catch (err: any) {
      setError(err.message || "Failed to delete budget")
    }
  }

  const handleAddExpense = (budget: Budget) => {
    setSelectedBudget(budget)
    setExpenseFormData({
      budgetId: budget.id,
      amount: "",
      description: "",
      date: new Date().toISOString().split('T')[0]
    })
    setShowAddExpense(true)
  }

  const handleSubmitExpense = async () => {
    if (!selectedBudget) return

    const amount = parseFloat(expenseFormData.amount)
    if (isNaN(amount) || amount <= 0) {
      setError("Please enter a valid amount")
      return
    }

    if (!expenseFormData.description) {
      setError("Please enter a description")
      return
    }

    setIsSubmitting(true)
    setError("")

    try {
      updateBudget(selectedBudget.id, {
        spent: selectedBudget.spent + amount
      })

      setSuccess("Expense added successfully!")
      handleRefresh()
      
      setTimeout(() => {
        setShowAddExpense(false)
        setSelectedBudget(null)
        setExpenseFormData({ budgetId: "", amount: "", description: "", date: new Date().toISOString().split('T')[0] })
        setSuccess("")
      }, 1500)
    } catch (err: any) {
      setError(err.message || "Failed to add expense")
    } finally {
      setIsSubmitting(false)
    }
  }

  // Calculate totals
  const totalBudget = budgets.reduce((sum, budget) => sum + budget.amount, 0)
  const totalSpent = budgets.reduce((sum, budget) => sum + budget.spent, 0)
  const remaining = totalBudget - totalSpent

  // Generate alerts dynamically
  const alerts = budgets
    .filter(budget => {
      const percentage = (budget.spent / budget.amount) * 100
      return percentage >= 100 || percentage >= 80
    })
    .map((budget, index) => {
      const percentage = (budget.spent / budget.amount) * 100
      const overAmount = budget.spent - budget.amount
      return {
        id: `alert-${budget.id}`,
        type: percentage >= 100 ? "warning" : "success",
        category: budget.name,
        message: percentage >= 100 
          ? `Budget exceeded by ${formatTND(overAmount)}`
          : `${Math.round(100 - percentage)}% budget remaining`,
        isRead: false
      }
    })

  return (
    <>
      <Header title="Budget Planner" description="Track your income and expenses" />
      <PageShell className="pb-20 md:pb-6">
        <PageHeader 
          title="Budget Planner" 
          description="Manage your monthly budget and track expenses"
          actions={
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleRefresh}>
                <RefreshCw className="mr-2 h-4 w-4" />
                Refresh
              </Button>
              <Dialog open={showAddBudget} onOpenChange={setShowAddBudget}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    New Budget
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create New Budget</DialogTitle>
                    <DialogDescription>Set up a new budget category</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label>Budget Name <span className="text-red-500">*</span></Label>
                      <Input 
                        placeholder="e.g., Groceries" 
                        value={budgetFormData.name}
                        onChange={(e) => setBudgetFormData({ ...budgetFormData, name: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Category <span className="text-red-500">*</span></Label>
                      <Select 
                        value={budgetFormData.category}
                        onValueChange={(value) => setBudgetFormData({ ...budgetFormData, category: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Food">Food</SelectItem>
                          <SelectItem value="Transport">Transport</SelectItem>
                          <SelectItem value="Bills">Bills</SelectItem>
                          <SelectItem value="Leisure">Leisure</SelectItem>
                          <SelectItem value="Housing">Housing</SelectItem>
                          <SelectItem value="Healthcare">Healthcare</SelectItem>
                          <SelectItem value="Education">Education</SelectItem>
                          <SelectItem value="Travel">Travel</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Budget Amount (TND) <span className="text-red-500">*</span></Label>
                        <Input 
                          type="number" 
                          step="0.001"
                          placeholder="0.000" 
                          value={budgetFormData.amount}
                          onChange={(e) => setBudgetFormData({ ...budgetFormData, amount: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Period <span className="text-red-500">*</span></Label>
                        <Select 
                          value={budgetFormData.period}
                          onValueChange={(value: "monthly" | "weekly" | "yearly") => setBudgetFormData({ ...budgetFormData, period: value })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="monthly">Monthly</SelectItem>
                            <SelectItem value="weekly">Weekly</SelectItem>
                            <SelectItem value="yearly">Yearly</SelectItem>
                          </SelectContent>
                        </Select>
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
                        {success}
                      </div>
                    )}
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => {
                      setShowAddBudget(false)
                      setError("")
                      setBudgetFormData({ name: "", amount: "", category: "Food", period: "monthly" })
                    }}>Cancel</Button>
                    <Button onClick={handleCreateBudget} disabled={isSubmitting}>
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Creating...
                        </>
                      ) : (
                        "Create Budget"
                      )}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          }
        />

        {success && !showAddBudget && !showEditBudget && !showAddExpense && (
          <div className="rounded-lg bg-green-50 p-3 text-sm text-green-600 dark:bg-green-900/20 dark:text-green-400 flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4" />
            {success}
          </div>
        )}

        {/* Budget Overview */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Total Budget</p>
                <p className="text-3xl font-bold">{formatTND(totalBudget)}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Spent This Month</p>
                <p className="text-3xl font-bold text-orange-500">{formatTND(totalSpent)}</p>
              </div>
            </CardContent>
          </Card>
          <Card className={remaining < 0 ? "border-destructive" : "border-green-500/30"}>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Remaining</p>
                <p className={`text-3xl font-bold ${remaining < 0 ? "text-destructive" : "text-green-500"}`}>
                  {formatTND(remaining)}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="categories" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-3">
            <TabsTrigger value="categories">Categories</TabsTrigger>
            <TabsTrigger value="alerts">Alerts</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          {/* Categories Tab */}
          <TabsContent value="categories" className="mt-6">
            {budgets.length === 0 ? (
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center py-12">
                    <ShoppingCart className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No Budgets Yet</h3>
                    <p className="text-muted-foreground mb-4">Create your first budget category to get started</p>
                    <Button onClick={() => setShowAddBudget(true)}>
                      <Plus className="mr-2 h-4 w-4" />
                      Create Budget
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {budgets.map((budget, index) => {
                  const percentage = (budget.spent / budget.amount) * 100
                  const isOverBudget = budget.spent > budget.amount
                  const Icon = getCategoryIcon(budget.category)
                  const color = getCategoryColor(budget.category, index)
                  return (
                    <Card key={budget.id} className={isOverBudget ? "border-destructive/50" : ""}>
                      <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className={`flex h-10 w-10 items-center justify-center rounded-full ${color}/20`}>
                              <Icon className={`h-5 w-5`} />
                            </div>
                            <div>
                              <CardTitle className="text-base">{budget.name}</CardTitle>
                              <Badge variant="outline" className="mt-1 text-xs">
                                {budget.category} • {budget.period}
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
                              <DropdownMenuItem onClick={() => handleEditBudget(budget)}>
                                <Pencil className="mr-2 h-4 w-4" />
                                Edit Budget
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleAddExpense(budget)}>
                                <DollarSign className="mr-2 h-4 w-4" />
                                Add Expense
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                className="text-destructive"
                                onClick={() => handleDeleteBudget(budget.id)}
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete Budget
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                        {isOverBudget && (
                          <Badge variant="destructive" className="mt-2">Over Budget</Badge>
                        )}
                      </CardHeader>
                      <CardContent>
                        <Progress
                          value={Math.min(percentage, 100)}
                          className={`h-2 ${isOverBudget ? "[&>div]:bg-destructive" : ""}`}
                        />
                        <div className="mt-2 flex justify-between text-sm">
                          <span className="text-muted-foreground">
                            {formatTND(budget.spent)} spent
                          </span>
                          <span className="font-medium">
                            {formatTND(budget.amount)} budget
                          </span>
                        </div>
                        <div className="mt-2 text-xs text-muted-foreground">
                          {percentage.toFixed(1)}% used
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="w-full"
                          onClick={() => handleAddExpense(budget)}
                        >
                          <DollarSign className="mr-2 h-4 w-4" />
                          Add Expense
                        </Button>
                      </CardFooter>
                    </Card>
                  )
                })}
              </div>
            )}
          </TabsContent>

          {/* Alerts Tab */}
          <TabsContent value="alerts" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Budget Alerts</CardTitle>
                <CardDescription>Notifications about your budget status</CardDescription>
              </CardHeader>
              <CardContent>
                {alerts.length === 0 ? (
                  <div className="text-center py-8">
                    <CheckCircle2 className="mx-auto h-12 w-12 text-green-500 mb-4" />
                    <h3 className="text-lg font-semibold mb-2">All Good!</h3>
                    <p className="text-muted-foreground">No budget alerts at this time</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {alerts.map((alert) => (
                      <div
                        key={alert.id}
                        className={`flex items-center justify-between rounded-lg border p-4 ${
                          !alert.isRead ? "bg-muted/50" : ""
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          {alert.type === "warning" ? (
                            <AlertTriangle className="h-5 w-5 text-destructive" />
                          ) : (
                            <CheckCircle2 className="h-5 w-5 text-green-500" />
                          )}
                          <div>
                            <p className="font-medium">{alert.category}</p>
                            <p className="text-sm text-muted-foreground">{alert.message}</p>
                          </div>
                        </div>
                        {!alert.isRead && (
                          <Badge variant="secondary">New</Badge>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Alert Settings</CardTitle>
                <CardDescription>Configure when you receive budget alerts</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Budget Exceeded Alert</Label>
                    <p className="text-sm text-muted-foreground">
                      Get notified when you exceed a category budget
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>80% Budget Warning</Label>
                    <p className="text-sm text-muted-foreground">
                      Get warned when you reach 80% of a budget
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Goal Reached Notification</Label>
                    <p className="text-sm text-muted-foreground">
                      Celebrate when you reach a savings goal
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Weekly Summary</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive a weekly spending summary
                    </p>
                  </div>
                  <Switch />
                </div>
              </CardContent>
              <CardFooter>
                <Button>Save Settings</Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Edit Budget Dialog */}
        <Dialog open={showEditBudget} onOpenChange={setShowEditBudget}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Budget</DialogTitle>
              <DialogDescription>Update your budget category</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Budget Name <span className="text-red-500">*</span></Label>
                <Input 
                  placeholder="e.g., Groceries" 
                  value={budgetFormData.name}
                  onChange={(e) => setBudgetFormData({ ...budgetFormData, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Category <span className="text-red-500">*</span></Label>
                <Select 
                  value={budgetFormData.category}
                  onValueChange={(value) => setBudgetFormData({ ...budgetFormData, category: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Food">Food</SelectItem>
                    <SelectItem value="Transport">Transport</SelectItem>
                    <SelectItem value="Bills">Bills</SelectItem>
                    <SelectItem value="Leisure">Leisure</SelectItem>
                    <SelectItem value="Housing">Housing</SelectItem>
                    <SelectItem value="Healthcare">Healthcare</SelectItem>
                    <SelectItem value="Education">Education</SelectItem>
                    <SelectItem value="Travel">Travel</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Budget Amount (TND) <span className="text-red-500">*</span></Label>
                  <Input 
                    type="number" 
                    step="0.001"
                    placeholder="0.000" 
                    value={budgetFormData.amount}
                    onChange={(e) => setBudgetFormData({ ...budgetFormData, amount: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Period <span className="text-red-500">*</span></Label>
                  <Select 
                    value={budgetFormData.period}
                    onValueChange={(value: "monthly" | "weekly" | "yearly") => setBudgetFormData({ ...budgetFormData, period: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="yearly">Yearly</SelectItem>
                    </SelectContent>
                  </Select>
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
                  {success}
                </div>
              )}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => {
                setShowEditBudget(false)
                setSelectedBudget(null)
                setError("")
                setBudgetFormData({ name: "", amount: "", category: "Food", period: "monthly" })
              }}>Cancel</Button>
              <Button onClick={handleUpdateBudget} disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  "Update Budget"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Add Expense Dialog */}
        <Dialog open={showAddExpense} onOpenChange={setShowAddExpense}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Expense</DialogTitle>
              <DialogDescription>
                Record an expense for "{selectedBudget?.name}" budget
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Budget Category</Label>
                <Input 
                  value={selectedBudget?.name || ""} 
                  disabled
                  className="bg-muted"
                />
              </div>
              <div className="space-y-2">
                <Label>Amount (TND) <span className="text-red-500">*</span></Label>
                <Input 
                  type="number" 
                  step="0.001"
                  placeholder="0.000" 
                  value={expenseFormData.amount}
                  onChange={(e) => setExpenseFormData({ ...expenseFormData, amount: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Description <span className="text-red-500">*</span></Label>
                <Input 
                  placeholder="What was this expense for?" 
                  value={expenseFormData.description}
                  onChange={(e) => setExpenseFormData({ ...expenseFormData, description: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Date</Label>
                <Input 
                  type="date" 
                  value={expenseFormData.date}
                  onChange={(e) => setExpenseFormData({ ...expenseFormData, date: e.target.value })}
                />
              </div>
              {selectedBudget && (
                <div className="rounded-lg border p-3 bg-muted/50">
                  <div className="text-sm text-muted-foreground">Current Spent</div>
                  <div className="text-xl font-bold">{formatTND(selectedBudget.spent)}</div>
                  <div className="text-sm text-muted-foreground mt-1">
                    New Total: {formatTND(selectedBudget.spent + (parseFloat(expenseFormData.amount) || 0))}
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
                setShowAddExpense(false)
                setSelectedBudget(null)
                setExpenseFormData({ budgetId: "", amount: "", description: "", date: new Date().toISOString().split('T')[0] })
                setError("")
              }}>Cancel</Button>
              <Button onClick={handleSubmitExpense} disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Adding...
                  </>
                ) : (
                  "Add Expense"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </PageShell>
    </>
  )
}

