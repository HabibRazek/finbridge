"use client"

import { useState, useEffect } from "react"
import { PageShell, PageHeader } from "@/components/shared/page-shell"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { RefreshCw, DollarSign } from "lucide-react"
import { formatTND } from "@/lib/currency"
import { 
  getCommissions,
  getTransactions,
  getAllUsers,
  getData,
  type Commission
} from "@/lib/json-storage"

export default function AdminCommissionsPage() {
  const [commissions, setCommissions] = useState<Commission[]>([])
  const [stats, setStats] = useState({
    total: 0,
    totalAmount: 0,
    byMonth: {} as Record<string, number>
  })

  useEffect(() => {
    loadCommissions()
  }, [])

  const loadCommissions = () => {
    // Get all commissions directly from data
    const data = getData()
    const allCommissions = data.commissions || []
    setCommissions(allCommissions)

    // Calculate stats
    const totalAmount = allCommissions.reduce((sum, c) => sum + c.amount, 0)
    const byMonth: Record<string, number> = {}
    
    allCommissions.forEach(c => {
      const key = `${c.month} ${c.year}`
      byMonth[key] = (byMonth[key] || 0) + c.amount
    })

    setStats({
      total: allCommissions.length,
      totalAmount,
      byMonth
    })
  }

  const users = getAllUsers()
  const getUserName = (agentId: string) => {
    const user = users.find(u => u.id === agentId)
    return user?.name || "Unknown Agent"
  }

  const transactions = getTransactions()
  
  // Calculate commissions from transactions
  const calculateCommissions = () => {
    const completedTransactions = transactions.filter(t => t.status === "completed")
    const commissionRate = 0.005 // 0.5%
    
    // Group by agent (we'll need to track which agent created each transaction)
    // For now, we'll show all commissions
    return completedTransactions.map(txn => ({
      transactionId: txn.id,
      amount: txn.amount * commissionRate,
      date: txn.date
    }))
  }

  const monthlyCommissions = Object.entries(stats.byMonth)
    .sort((a, b) => {
      const [monthA, yearA] = a[0].split(" ")
      const [monthB, yearB] = b[0].split(" ")
      if (yearA !== yearB) return parseInt(yearB) - parseInt(yearA)
      return new Date(`${monthB} 1, ${yearB}`).getTime() - new Date(`${monthA} 1, ${yearA}`).getTime()
    })

  return (
    <PageShell>
      <PageHeader 
        title="Commission Management" 
        description="View all agent commissions"
        actions={
          <Button variant="outline" size="sm" onClick={loadCommissions}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
        }
      />

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Total Commissions</p>
              <p className="text-3xl font-bold">{stats.total}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Total Amount</p>
              <p className="text-3xl font-bold">{formatTND(stats.totalAmount)}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Commission Rate</p>
              <p className="text-3xl font-bold">0.5%</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Monthly Breakdown */}
      {monthlyCommissions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Monthly Breakdown</CardTitle>
            <CardDescription>Commission earnings by month</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Month</TableHead>
                  <TableHead className="text-right">Total Commission</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {monthlyCommissions.map(([month, amount]) => (
                  <TableRow key={month}>
                    <TableCell className="font-medium">{month}</TableCell>
                    <TableCell className="text-right font-semibold">{formatTND(amount)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Commissions Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Commissions</CardTitle>
          <CardDescription>{commissions.length} commission records</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Agent</TableHead>
                <TableHead>Month</TableHead>
                <TableHead>Year</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {commissions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <DollarSign className="h-8 w-8 text-muted-foreground" />
                      <p className="text-muted-foreground">No commissions found</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                commissions.map((commission) => (
                  <TableRow key={commission.id}>
                    <TableCell className="font-medium">{getUserName(commission.agentId)}</TableCell>
                    <TableCell>{commission.month}</TableCell>
                    <TableCell>{commission.year}</TableCell>
                    <TableCell className="text-right font-semibold">{formatTND(commission.amount)}</TableCell>
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

