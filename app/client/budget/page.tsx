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
  CheckCircle2
} from "lucide-react"
import { formatTND } from "@/lib/currency"

const categories = [
  { name: "Housing", icon: Home, budget: 30000, spent: 28000, color: "bg-blue-500" },
  { name: "Food & Dining", icon: Utensils, budget: 15000, spent: 12500, color: "bg-orange-500" },
  { name: "Transportation", icon: Car, budget: 10000, spent: 11200, color: "bg-purple-500" },
  { name: "Utilities", icon: Zap, budget: 8000, spent: 6500, color: "bg-yellow-500" },
  { name: "Healthcare", icon: Heart, budget: 5000, spent: 2000, color: "bg-red-500" },
  { name: "Education", icon: GraduationCap, budget: 12000, spent: 8000, color: "bg-green-500" },
  { name: "Shopping", icon: ShoppingCart, budget: 8000, spent: 9500, color: "bg-pink-500" },
  { name: "Travel", icon: Plane, budget: 15000, spent: 5000, color: "bg-cyan-500" },
]

const alerts = [
  { id: 1, type: "warning", category: "Transportation", message: "Budget exceeded by 1,200 DT", isRead: false },
  { id: 2, type: "warning", category: "Shopping", message: "Budget exceeded by 1,500 DT", isRead: false },
  { id: 3, type: "success", category: "Healthcare", message: "60% budget remaining", isRead: true },
]

export default function BudgetPlanner() {
  const [showAddExpense, setShowAddExpense] = useState(false)

  const totalBudget = categories.reduce((sum, cat) => sum + cat.budget, 0)
  const totalSpent = categories.reduce((sum, cat) => sum + cat.spent, 0)
  const remaining = totalBudget - totalSpent

  return (
    <>
      <Header title="Budget Planner" description="Track your income and expenses" />
      <PageShell className="pb-20 md:pb-6">
        <PageHeader 
          title="Budget Planner" 
          description="Manage your monthly budget and track expenses"
          actions={
            <Dialog open={showAddExpense} onOpenChange={setShowAddExpense}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Expense
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Expense</DialogTitle>
                  <DialogDescription>Record a new expense to track against your budget</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label>Category</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((cat) => (
                          <SelectItem key={cat.name} value={cat.name.toLowerCase()}>
                            {cat.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Amount</Label>
                    <Input type="number" placeholder="Enter amount" />
                  </div>
                  <div className="space-y-2">
                    <Label>Description</Label>
                    <Input placeholder="What was this expense for?" />
                  </div>
                  <div className="space-y-2">
                    <Label>Date</Label>
                    <Input type="date" />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setShowAddExpense(false)}>Cancel</Button>
                  <Button onClick={() => setShowAddExpense(false)}>Add Expense</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          }
        />

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
            <div className="grid gap-4 md:grid-cols-2">
              {categories.map((category) => {
                const percentage = (category.spent / category.budget) * 100
                const isOverBudget = category.spent > category.budget
                return (
                  <Card key={category.name} className={isOverBudget ? "border-destructive/50" : ""}>
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`flex h-10 w-10 items-center justify-center rounded-full ${category.color}/20`}>
                            <category.icon className={`h-5 w-5`} />
                          </div>
                          <CardTitle className="text-base">{category.name}</CardTitle>
                        </div>
                        {isOverBudget && (
                          <Badge variant="destructive">Over Budget</Badge>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <Progress
                        value={Math.min(percentage, 100)}
                        className={`h-2 ${isOverBudget ? "[&>div]:bg-destructive" : ""}`}
                      />
                      <div className="mt-2 flex justify-between text-sm">
                        <span className="text-muted-foreground">
                          {formatTND(category.spent)} spent
                        </span>
                        <span className="font-medium">
                          {formatTND(category.budget)} budget
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </TabsContent>

          {/* Alerts Tab */}
          <TabsContent value="alerts" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Budget Alerts</CardTitle>
                <CardDescription>Notifications about your budget status</CardDescription>
              </CardHeader>
              <CardContent>
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
      </PageShell>
    </>
  )
}

