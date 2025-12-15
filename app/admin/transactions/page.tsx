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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Search, RefreshCw, MoreHorizontal, Trash2, Eye, Receipt, CheckCircle2, Clock, XCircle } from "lucide-react"
import { formatTND } from "@/lib/currency"
import { 
  getTransactions, 
  getAllUsers,
  deleteTransaction,
  updateTransaction,
  type Transaction 
} from "@/lib/json-storage"

export default function AdminTransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")

  useEffect(() => {
    loadTransactions()
  }, [])

  const loadTransactions = () => {
    const allTransactions = getTransactions()
    setTransactions(allTransactions.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    ))
  }

  const users = getAllUsers()
  const getUserName = (userId: string) => {
    const user = users.find(u => u.id === userId)
    return user?.name || "Unknown User"
  }

  const getUserEmail = (userId: string) => {
    const user = users.find(u => u.id === userId)
    return user?.email || ""
  }

  const handleDeleteTransaction = async (transactionId: string) => {
    if (!confirm("Are you sure you want to delete this transaction? This action cannot be undone.")) return

    try {
      deleteTransaction(transactionId)
      loadTransactions()
    } catch (err: any) {
      alert(err.message || "Failed to delete transaction")
    }
  }

  const handleUpdateStatus = async (transactionId: string, newStatus: 'completed' | 'pending' | 'failed') => {
    try {
      updateTransaction(transactionId, { status: newStatus })
      loadTransactions()
    } catch (err: any) {
      alert(err.message || "Failed to update transaction")
    }
  }

  const filteredTransactions = transactions.filter(txn => {
    const userName = getUserName(txn.userId)
    const userEmail = getUserEmail(txn.userId)
    const matchesSearch = 
      userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      userEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      txn.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      txn.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesType = typeFilter === "all" || txn.type === typeFilter
    const matchesStatus = statusFilter === "all" || txn.status === statusFilter
    return matchesSearch && matchesType && matchesStatus
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-500">Completed</Badge>
      case "pending":
        return <Badge variant="secondary">Pending</Badge>
      case "failed":
        return <Badge variant="destructive">Failed</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getTypeBadge = (type: string) => {
    switch (type) {
      case "deposit":
        return <Badge variant="outline" className="border-green-500 text-green-600">Deposit</Badge>
      case "withdrawal":
        return <Badge variant="outline" className="border-orange-500 text-orange-600">Withdrawal</Badge>
      case "transfer":
        return <Badge variant="outline" className="border-blue-500 text-blue-600">Transfer</Badge>
      default:
        return <Badge variant="outline">{type}</Badge>
    }
  }

  const stats = {
    total: transactions.length,
    completed: transactions.filter(t => t.status === "completed").length,
    pending: transactions.filter(t => t.status === "pending").length,
    failed: transactions.filter(t => t.status === "failed").length,
    totalVolume: transactions.filter(t => t.status === "completed").reduce((sum, t) => sum + t.amount, 0)
  }

  return (
    <PageShell>
      <PageHeader 
        title="Transaction Management" 
        description="View and manage all transactions"
        actions={
          <Button variant="outline" size="sm" onClick={loadTransactions}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
        }
      />

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-5">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Total</p>
              <p className="text-3xl font-bold">{stats.total}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Completed</p>
              <p className="text-3xl font-bold text-green-600">{stats.completed}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Pending</p>
              <p className="text-3xl font-bold text-yellow-600">{stats.pending}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Failed</p>
              <p className="text-3xl font-bold text-red-600">{stats.failed}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Total Volume</p>
              <p className="text-3xl font-bold">{formatTND(stats.totalVolume)}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Transactions Table */}
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle>All Transactions</CardTitle>
              <CardDescription>{filteredTransactions.length} transactions found</CardDescription>
            </div>
            <div className="flex gap-2">
              <div className="relative flex-1 sm:w-64">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search transactions..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="deposit">Deposit</SelectItem>
                  <SelectItem value="withdrawal">Withdrawal</SelectItem>
                  <SelectItem value="transfer">Transfer</SelectItem>
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTransactions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="h-24 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <Receipt className="h-8 w-8 text-muted-foreground" />
                      <p className="text-muted-foreground">No transactions found</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredTransactions.map((txn) => (
                  <TableRow key={txn.id}>
                    <TableCell className="font-mono text-sm">{txn.id.substring(0, 12)}...</TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{getUserName(txn.userId)}</p>
                        <p className="text-xs text-muted-foreground">{getUserEmail(txn.userId)}</p>
                      </div>
                    </TableCell>
                    <TableCell>{getTypeBadge(txn.type)}</TableCell>
                    <TableCell className="max-w-[200px] truncate">{txn.description}</TableCell>
                    <TableCell className="text-right font-semibold">{formatTND(txn.amount)}</TableCell>
                    <TableCell>{new Date(txn.date).toLocaleDateString()}</TableCell>
                    <TableCell>{getStatusBadge(txn.status)}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {txn.status !== "completed" && (
                            <DropdownMenuItem onClick={() => handleUpdateStatus(txn.id, "completed")}>
                              <CheckCircle2 className="mr-2 h-4 w-4" />
                              Mark Completed
                            </DropdownMenuItem>
                          )}
                          {txn.status !== "pending" && (
                            <DropdownMenuItem onClick={() => handleUpdateStatus(txn.id, "pending")}>
                              <Clock className="mr-2 h-4 w-4" />
                              Mark Pending
                            </DropdownMenuItem>
                          )}
                          {txn.status !== "failed" && (
                            <DropdownMenuItem onClick={() => handleUpdateStatus(txn.id, "failed")}>
                              <XCircle className="mr-2 h-4 w-4" />
                              Mark Failed
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem 
                            className="text-destructive"
                            onClick={() => handleDeleteTransaction(txn.id)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </PageShell>
  )
}

