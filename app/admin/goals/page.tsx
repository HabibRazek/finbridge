"use client"

import { useState, useEffect } from "react"
import { PageShell, PageHeader } from "@/components/shared/page-shell"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Search, RefreshCw, Trash2, Target } from "lucide-react"
import { formatTND } from "@/lib/currency"
import { 
  getGoals,
  getAllUsers,
  deleteGoal,
  getData,
  type Goal 
} from "@/lib/json-storage"

export default function AdminGoalsPage() {
  const [goals, setGoals] = useState<Goal[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")

  useEffect(() => {
    loadGoals()
  }, [])

  const loadGoals = () => {
    // Get all goals directly from data
    const data = getData()
    setGoals(data.goals || [])
  }

  const users = getAllUsers()
  const getUserName = (userId: string) => {
    const user = users.find(u => u.id === userId)
    return user?.name || "Unknown User"
  }

  const handleDeleteGoal = async (goalId: string) => {
    if (!confirm("Are you sure you want to delete this goal?")) return

    try {
      deleteGoal(goalId)
      loadGoals()
    } catch (err: any) {
      alert(err.message || "Failed to delete goal")
    }
  }

  const filteredGoals = goals.filter(goal => {
    const userName = getUserName(goal.userId)
    const matchesSearch = 
      userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      goal.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      goal.category.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = categoryFilter === "all" || goal.category === categoryFilter
    return matchesSearch && matchesCategory
  })

  const categories = Array.from(new Set(goals.map(g => g.category)))

  const stats = {
    total: goals.length,
    totalTarget: goals.reduce((sum, g) => sum + g.targetAmount, 0),
    totalCurrent: goals.reduce((sum, g) => sum + g.currentAmount, 0),
    completed: goals.filter(g => g.currentAmount >= g.targetAmount).length
  }

  return (
    <PageShell>
      <PageHeader 
        title="Goals Management" 
        description="View and manage all user financial goals"
        actions={
          <Button variant="outline" size="sm" onClick={loadGoals}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
        }
      />

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Total Goals</p>
              <p className="text-3xl font-bold">{stats.total}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Total Target</p>
              <p className="text-3xl font-bold">{formatTND(stats.totalTarget)}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Total Saved</p>
              <p className="text-3xl font-bold text-green-600">{formatTND(stats.totalCurrent)}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Completed</p>
              <p className="text-3xl font-bold text-blue-600">{stats.completed}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Goals Table */}
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle>All Goals</CardTitle>
              <CardDescription>{filteredGoals.length} goals found</CardDescription>
            </div>
            <div className="flex gap-2">
              <div className="relative flex-1 sm:w-64">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search goals..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map(cat => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead className="text-right">Target</TableHead>
                <TableHead className="text-right">Current</TableHead>
                <TableHead className="text-right">Remaining</TableHead>
                <TableHead className="text-right">Progress</TableHead>
                <TableHead>Deadline</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredGoals.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="h-24 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <Target className="h-8 w-8 text-muted-foreground" />
                      <p className="text-muted-foreground">No goals found</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredGoals.map((goal) => {
                  const percentage = (goal.currentAmount / goal.targetAmount) * 100
                  const remaining = goal.targetAmount - goal.currentAmount
                  const isCompleted = goal.currentAmount >= goal.targetAmount
                  
                  return (
                    <TableRow key={goal.id}>
                      <TableCell className="font-medium">{getUserName(goal.userId)}</TableCell>
                      <TableCell>{goal.name}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{goal.category}</Badge>
                      </TableCell>
                      <TableCell className="text-right">{formatTND(goal.targetAmount)}</TableCell>
                      <TableCell className="text-right">{formatTND(goal.currentAmount)}</TableCell>
                      <TableCell className={`text-right font-semibold ${isCompleted ? "text-green-600" : ""}`}>
                        {formatTND(remaining)}
                      </TableCell>
                      <TableCell className="text-right">
                        <span className={isCompleted ? "text-green-600 font-semibold" : ""}>
                          {percentage.toFixed(1)}%
                        </span>
                      </TableCell>
                      <TableCell>{new Date(goal.deadline).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleDeleteGoal(goal.id)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  )
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </PageShell>
  )
}

