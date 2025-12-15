"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/layout/header"
import { PageShell, PageHeader } from "@/components/shared/page-shell"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { 
  Search, 
  ArrowUpRight, 
  ArrowDownRight,
  DollarSign,
  Filter,
  Download,
  RefreshCw,
  Receipt
} from "lucide-react"
import { formatTND } from "@/lib/currency"
import { useAuth } from "@/lib/auth-context"
import { getUserByEmail, getTransactions, type Transaction } from "@/lib/json-storage"

const groupTransactionsByDate = (transactions: Transaction[]) => {
  const grouped: { [key: string]: Transaction[] } = {}
  transactions.forEach((txn) => {
    const date = txn.date
    if (!grouped[date]) {
      grouped[date] = []
    }
    grouped[date].push(txn)
  })
  // Sort dates in descending order
  return Object.keys(grouped)
    .sort((a, b) => new Date(b).getTime() - new Date(a).getTime())
    .reduce((acc, date) => {
      acc[date] = grouped[date].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      return acc
    }, {} as { [key: string]: Transaction[] })
}

export default function ClientTransactionHistory() {
  const { user } = useAuth()
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("all")

  useEffect(() => {
    if (user?.email) {
      const clientUser = getUserByEmail(user.email)
      if (clientUser) {
        const userTransactions = getTransactions(clientUser.id)
        setTransactions(userTransactions)
      }
    }
  }, [user])

  const handleRefresh = () => {
    if (user?.email) {
      const clientUser = getUserByEmail(user.email)
      if (clientUser) {
        const userTransactions = getTransactions(clientUser.id)
        setTransactions(userTransactions)
      }
    }
  }

  // Transform transactions for display
  const displayTransactions = transactions.map(txn => {
    const displayAmount = txn.type === 'deposit' ? txn.amount : -txn.amount
    const date = new Date(txn.date)
    const time = new Date(txn.createdAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    
    // Determine category from description or type
    let category = txn.type.charAt(0).toUpperCase() + txn.type.slice(1)
    if (txn.description.toLowerCase().includes('salary')) category = "Salary"
    else if (txn.description.toLowerCase().includes('atm')) category = "ATM"
    else if (txn.description.toLowerCase().includes('agent')) category = "Agent"
    else if (txn.description.toLowerCase().includes('transfer')) category = "Transfer"
    else if (txn.description.toLowerCase().includes('bill')) category = "Bill"
    else if (txn.description.toLowerCase().includes('refund')) category = "Refund"
    else if (txn.description.toLowerCase().includes('investment')) category = "Investment"
    
    return {
      ...txn,
      displayAmount,
      category,
      time,
      date: txn.date
    }
  })

  const filteredTransactions = displayTransactions.filter((txn) => {
    const matchesSearch = 
      txn.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      txn.category.toLowerCase().includes(searchQuery.toLowerCase())
    
    if (activeTab === "all") return matchesSearch
    if (activeTab === "deposits") return matchesSearch && txn.type === "deposit"
    if (activeTab === "withdrawals") return matchesSearch && (txn.type === "withdrawal" || txn.type === "transfer")
    return matchesSearch
  })

  const groupedTransactions = groupTransactionsByDate(filteredTransactions)

  const totalDeposits = transactions
    .filter(t => t.type === "deposit" && t.status === "completed")
    .reduce((sum, t) => sum + t.amount, 0)
  const totalWithdrawals = transactions
    .filter(t => (t.type === "withdrawal" || t.type === "transfer") && t.status === "completed")
    .reduce((sum, t) => sum + t.amount, 0)

  return (
    <>
      <Header title="Transaction History" description="View your complete transaction history" />
      <PageShell className="pb-20 md:pb-6">
        <PageHeader 
          title="Transaction History" 
          description="View deposits, withdrawals, and commissions"
          actions={
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleRefresh}>
                <RefreshCw className="mr-2 h-4 w-4" />
                Refresh
              </Button>
              <Button variant="outline" size="sm">
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
            </div>
          }
        />

        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
                  <ArrowUpRight className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Deposits</p>
                  <p className="text-xl font-bold text-green-600">{formatTND(totalDeposits)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100">
                  <ArrowDownRight className="h-5 w-5 text-red-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Withdrawals</p>
                  <p className="text-xl font-bold text-red-600">{formatTND(totalWithdrawals)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                  <DollarSign className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Net Change</p>
                  <p className={`text-xl font-bold ${(totalDeposits - totalWithdrawals) >= 0 ? "text-green-600" : "text-red-600"}`}>
                    {(totalDeposits - totalWithdrawals) >= 0 ? "+" : ""}{formatTND(totalDeposits - totalWithdrawals)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Transactions */}
        <Card>
          <CardHeader>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <CardTitle>All Transactions</CardTitle>
                <CardDescription>{filteredTransactions.length} transactions found</CardDescription>
              </div>
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search transactions..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full max-w-sm grid-cols-3">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="deposits">Deposits</TabsTrigger>
                <TabsTrigger value="withdrawals">Withdrawals</TabsTrigger>
              </TabsList>
              <TabsContent value={activeTab} className="mt-4">
                {filteredTransactions.length === 0 ? (
                  <div className="text-center py-12">
                    <Receipt className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No Transactions Found</h3>
                    <p className="text-muted-foreground">
                      {searchQuery ? "Try adjusting your search" : "You haven't made any transactions yet"}
                    </p>
                  </div>
                ) : (
                  <ScrollArea className="h-[400px] pr-4">
                    {Object.entries(groupedTransactions).map(([date, txns]) => (
                      <div key={date} className="mb-6">
                        <p className="mb-3 text-sm font-medium text-muted-foreground">
                          {new Date(date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                        </p>
                        <div className="space-y-3">
                          {txns.map((txn) => {
                            const isDeposit = txn.type === "deposit"
                            const displayAmount = isDeposit ? txn.amount : -txn.amount
                            return (
                              <div
                                key={txn.id}
                                className="flex items-center justify-between rounded-lg border p-4"
                              >
                                <div className="flex items-center gap-3">
                                  <div className={`flex h-10 w-10 items-center justify-center rounded-full ${
                                    isDeposit ? "bg-green-100" : "bg-red-100"
                                  }`}>
                                    {isDeposit ? (
                                      <ArrowUpRight className="h-5 w-5 text-green-600" />
                                    ) : (
                                      <ArrowDownRight className="h-5 w-5 text-red-600" />
                                    )}
                                  </div>
                                  <div>
                                    <p className="font-medium">{txn.description}</p>
                                    <div className="flex items-center gap-2">
                                      <Badge variant="outline" className="text-xs">
                                        {txn.category}
                                      </Badge>
                                      <Badge 
                                        variant={txn.status === "completed" ? "default" : txn.status === "pending" ? "secondary" : "destructive"}
                                        className="text-xs"
                                      >
                                        {txn.status}
                                      </Badge>
                                      <span className="text-xs text-muted-foreground">{txn.time}</span>
                                    </div>
                                  </div>
                                </div>
                                <span className={`font-semibold ${
                                  isDeposit ? "text-green-600" : "text-red-600"
                                }`}>
                                  {isDeposit ? "+" : ""}{formatTND(Math.abs(displayAmount))}
                                </span>
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    ))}
                  </ScrollArea>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </PageShell>
    </>
  )
}

