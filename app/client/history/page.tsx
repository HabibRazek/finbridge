"use client"

import { useState } from "react"
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
  Download
} from "lucide-react"

const transactions = [
  { id: 1, type: "deposit", category: "Salary", description: "Monthly Salary - ABC Corp", amount: 125000, date: "2024-01-15", time: "09:00 AM" },
  { id: 2, type: "withdrawal", category: "ATM", description: "ATM Withdrawal - Kigali", amount: -5000, date: "2024-01-15", time: "02:30 PM" },
  { id: 3, type: "deposit", category: "Agent", description: "Cash Deposit via Agent Jean", amount: 15000, date: "2024-01-14", time: "11:45 AM" },
  { id: 4, type: "fee", category: "Commission", description: "Agent Commission Fee", amount: -375, date: "2024-01-14", time: "11:45 AM" },
  { id: 5, type: "withdrawal", category: "Transfer", description: "Transfer to Marie Claire", amount: -20000, date: "2024-01-13", time: "04:15 PM" },
  { id: 6, type: "deposit", category: "Refund", description: "Merchant Refund - Shop XYZ", amount: 2500, date: "2024-01-12", time: "10:00 AM" },
  { id: 7, type: "withdrawal", category: "Bill", description: "Electricity Bill Payment", amount: -8500, date: "2024-01-11", time: "08:30 AM" },
  { id: 8, type: "deposit", category: "Investment", description: "Investment Returns", amount: 5000, date: "2024-01-10", time: "03:00 PM" },
]

type Transaction = (typeof transactions)[number]

const groupTransactionsByDate = (transactions: Transaction[]) => {
  const grouped: { [key: string]: Transaction[] } = {}
  transactions.forEach((txn) => {
    if (!grouped[txn.date]) {
      grouped[txn.date] = []
    }
    grouped[txn.date].push(txn)
  })
  return grouped
}

export default function ClientTransactionHistory() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("all")

  const filteredTransactions = transactions.filter((txn) => {
    const matchesSearch = 
      txn.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      txn.category.toLowerCase().includes(searchQuery.toLowerCase())
    
    if (activeTab === "all") return matchesSearch
    if (activeTab === "deposits") return matchesSearch && txn.amount > 0
    if (activeTab === "withdrawals") return matchesSearch && txn.amount < 0
    return matchesSearch
  })

  const groupedTransactions = groupTransactionsByDate(filteredTransactions)

  const totalDeposits = transactions.filter(t => t.amount > 0).reduce((sum, t) => sum + t.amount, 0)
  const totalWithdrawals = Math.abs(transactions.filter(t => t.amount < 0).reduce((sum, t) => sum + t.amount, 0))

  return (
    <>
      <Header title="Transaction History" description="View your complete transaction history" />
      <PageShell className="pb-20 md:pb-6">
        <PageHeader 
          title="Transaction History" 
          description="View deposits, withdrawals, and commissions"
          actions={
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
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
                  <p className="text-xl font-bold text-green-600">+${totalDeposits.toLocaleString()}</p>
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
                  <p className="text-xl font-bold text-red-600">-${totalWithdrawals.toLocaleString()}</p>
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
                  <p className="text-xl font-bold">${(totalDeposits - totalWithdrawals).toLocaleString()}</p>
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
                <ScrollArea className="h-[400px] pr-4">
                  {Object.entries(groupedTransactions).map(([date, txns]) => (
                    <div key={date} className="mb-6">
                      <p className="mb-3 text-sm font-medium text-muted-foreground">{date}</p>
                      <div className="space-y-3">
                        {txns.map((txn) => (
                          <div
                            key={txn.id}
                            className="flex items-center justify-between rounded-lg border p-4"
                          >
                            <div className="flex items-center gap-3">
                              <div className={`flex h-10 w-10 items-center justify-center rounded-full ${
                                txn.amount > 0 ? "bg-green-100" : "bg-red-100"
                              }`}>
                                {txn.amount > 0 ? (
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
                                  <span className="text-xs text-muted-foreground">{txn.time}</span>
                                </div>
                              </div>
                            </div>
                            <span className={`font-semibold ${
                              txn.amount > 0 ? "text-green-600" : "text-red-600"
                            }`}>
                              {txn.amount > 0 ? "+" : ""}${Math.abs(txn.amount).toLocaleString()}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </ScrollArea>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </PageShell>
    </>
  )
}

