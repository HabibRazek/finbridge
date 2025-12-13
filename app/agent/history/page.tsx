"use client"

import { useState } from "react"
import { Header } from "@/components/layout/header"
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
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { 
  Search, 
  Download, 
  Filter,
  CalendarIcon,
  ArrowUpDown,
  MoreHorizontal,
  Eye,
  FileText,
  Receipt
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { format } from "date-fns"

const transactions = [
  { id: "TXN-2024-001", date: "2024-01-15", client: "Jean Baptiste", accountNo: "****1234", type: "deposit", amount: 50000, status: "completed", commission: 1250 },
  { id: "TXN-2024-002", date: "2024-01-14", client: "Marie Claire", accountNo: "****5678", type: "deposit", amount: 25000, status: "completed", commission: 625 },
  { id: "TXN-2024-003", date: "2024-01-14", client: "Pierre Martin", accountNo: "****9012", type: "withdrawal", amount: 100000, status: "pending", commission: 2500 },
  { id: "TXN-2024-004", date: "2024-01-13", client: "Sophie Durand", accountNo: "****3456", type: "deposit", amount: 35000, status: "completed", commission: 875 },
  { id: "TXN-2024-005", date: "2024-01-12", client: "Paul Mugisha", accountNo: "****7890", type: "transfer", amount: 80000, status: "completed", commission: 2000 },
  { id: "TXN-2024-006", date: "2024-01-11", client: "Grace Uwimana", accountNo: "****2345", type: "deposit", amount: 45000, status: "failed", commission: 0 },
  { id: "TXN-2024-007", date: "2024-01-10", client: "Emmanuel Habimana", accountNo: "****6789", type: "deposit", amount: 120000, status: "completed", commission: 3000 },
  { id: "TXN-2024-008", date: "2024-01-09", client: "Diane Mukamana", accountNo: "****0123", type: "withdrawal", amount: 60000, status: "completed", commission: 1500 },
]

export default function TransactionHistory() {
  const [searchQuery, setSearchQuery] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [date, setDate] = useState<Date>()

  const filteredTransactions = transactions.filter((txn) => {
    const matchesSearch = 
      txn.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
      txn.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      txn.accountNo.includes(searchQuery)
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

  return (
    <>
      <Header title="Transaction History" description="View and manage all transactions" />
      <PageShell>
        <PageHeader 
          title="Transaction History" 
          description="Complete record of all deposits and transactions"
          actions={
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Export to PDF
            </Button>
          }
        />

        <Card>
          <CardHeader>
            <CardTitle>All Transactions</CardTitle>
            <CardDescription>
              Filter and search through your transaction history
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Filters */}
            <div className="mb-6 flex flex-col gap-4 sm:flex-row">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search by client, ID, or account..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Type" />
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
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                </SelectContent>
              </Select>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-[150px]">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PP") : "Pick date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" selected={date} onSelect={setDate} />
                </PopoverContent>
              </Popover>
            </div>

            {/* Transactions Table */}
            <div className="rounded-lg border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>
                      <div className="flex items-center gap-2">
                        Transaction ID
                        <ArrowUpDown className="h-4 w-4" />
                      </div>
                    </TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Client</TableHead>
                    <TableHead>Account</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead className="text-right">Commission</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTransactions.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={9} className="h-24 text-center">
                        <div className="flex flex-col items-center gap-2">
                          <Receipt className="h-8 w-8 text-muted-foreground" />
                          <p className="text-muted-foreground">No transactions found</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredTransactions.map((txn) => (
                      <TableRow key={txn.id}>
                        <TableCell className="font-mono text-sm">{txn.id}</TableCell>
                        <TableCell>{txn.date}</TableCell>
                        <TableCell className="font-medium">{txn.client}</TableCell>
                        <TableCell className="font-mono text-sm">{txn.accountNo}</TableCell>
                        <TableCell>{getTypeBadge(txn.type)}</TableCell>
                        <TableCell className="text-right font-semibold">
                          ${txn.amount.toLocaleString()}
                        </TableCell>
                        <TableCell className="text-right text-primary">
                          ${txn.commission.toLocaleString()}
                        </TableCell>
                        <TableCell>{getStatusBadge(txn.status)}</TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <Eye className="mr-2 h-4 w-4" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <FileText className="mr-2 h-4 w-4" />
                                Download Receipt
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            <div className="mt-4 flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Showing {filteredTransactions.length} of {transactions.length} transactions
              </p>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" disabled>
                  Previous
                </Button>
                <Button variant="outline" size="sm">
                  Next
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </PageShell>
    </>
  )
}

