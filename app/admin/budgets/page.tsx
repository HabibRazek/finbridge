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
import { Search, RefreshCw, Trash2, PiggyBank } from "lucide-react"
import { formatTND } from "@/lib/currency"
import { 
  getBudgets,
  getAllUsers,
  deleteBudget,
  getData,
  type Budget 
} from "@/lib/json-storage"

export default function AdminBudgetsPage() {
  const [budgets, setBudgets] = useState<Budget[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")

  useEffect(() => {
    loadBudgets()
  }, [])

  const loadBudgets = () => {
    // Get all budgets directly from data
    const data = getData()
    setBudgets(data.budgets || [])
  }

  const users = getAllUsers()
  const getUserName = (userId: string) => {
    const user = users.find(u => u.id === userId)
    return user?.name || "Unknown User"
  }

  const handleDeleteBudget = async (budgetId: string) => {
    if (!confirm("Are you sure you want to delete this budget?")) return

    try {
      deleteBudget(budgetId)
      loadBudgets()
    } catch (err: any) {
      alert(err.message || "Failed to delete budget")
    }
  }

  const filteredBudgets = budgets.filter(budget => {
    const userName = getUserName(budget.userId)
    const matchesSearch = 
      userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      budget.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      budget.category.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = categoryFilter === "all" || budget.category === categoryFilter
    return matchesSearch && matchesCategory
  })

  const categories = Array.from(new Set(budgets.map(b => b.category)))

  const stats = {
    total: budgets.length,
    totalBudget: budgets.reduce((sum, b) => sum + b.amount, 0),
    totalSpent: budgets.reduce((sum, b) => sum + b.spent, 0),
    overBudget: budgets.filter(b => b.spent > b.amount).length
  }

  return (
    <PageShell>
      <PageHeader 
        title="Budget Management" 
        description="View and manage all user budgets"
        actions={
          <Button variant="outline" size="sm" onClick={loadBudgets}>
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
              <p className="text-sm text-muted-foreground">Total Budgets</p>
              <p className="text-3xl font-bold">{stats.total}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Total Budget</p>
              <p className="text-3xl font-bold">{formatTND(stats.totalBudget)}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Total Spent</p>
              <p className="text-3xl font-bold text-orange-600">{formatTND(stats.totalSpent)}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Over Budget</p>
              <p className="text-3xl font-bold text-red-600">{stats.overBudget}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Budgets Table */}
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle>All Budgets</CardTitle>
              <CardDescription>{filteredBudgets.length} budgets found</CardDescription>
            </div>
            <div className="flex gap-2">
              <div className="relative flex-1 sm:w-64">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search budgets..."
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
                <TableHead>Period</TableHead>
                <TableHead className="text-right">Budget</TableHead>
                <TableHead className="text-right">Spent</TableHead>
                <TableHead className="text-right">Remaining</TableHead>
                <TableHead className="text-right">Usage</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredBudgets.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="h-24 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <PiggyBank className="h-8 w-8 text-muted-foreground" />
                      <p className="text-muted-foreground">No budgets found</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredBudgets.map((budget) => {
                  const percentage = (budget.spent / budget.amount) * 100
                  const remaining = budget.amount - budget.spent
                  const isOverBudget = budget.spent > budget.amount
                  
                  return (
                    <TableRow key={budget.id}>
                      <TableCell className="font-medium">{getUserName(budget.userId)}</TableCell>
                      <TableCell>{budget.name}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{budget.category}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">{budget.period}</Badge>
                      </TableCell>
                      <TableCell className="text-right">{formatTND(budget.amount)}</TableCell>
                      <TableCell className="text-right">{formatTND(budget.spent)}</TableCell>
                      <TableCell className={`text-right font-semibold ${isOverBudget ? "text-red-600" : "text-green-600"}`}>
                        {formatTND(remaining)}
                      </TableCell>
                      <TableCell className="text-right">
                        <span className={isOverBudget ? "text-red-600" : ""}>
                          {percentage.toFixed(1)}%
                        </span>
                      </TableCell>
                      <TableCell>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleDeleteBudget(budget.id)}
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

