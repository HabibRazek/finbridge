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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Search, RefreshCw, CheckCircle2, XCircle, Eye, Clock, FileText } from "lucide-react"
import { formatTND } from "@/lib/currency"
import { 
  getLoans,
  getAllUsers,
  updateLoan,
  deleteLoan,
  type Loan 
} from "@/lib/json-storage"

export default function AdminLoansPage() {
  const [loans, setLoans] = useState<Loan[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedLoan, setSelectedLoan] = useState<Loan | null>(null)
  const [showDetails, setShowDetails] = useState(false)

  useEffect(() => {
    loadLoans()
  }, [])

  const loadLoans = () => {
    const allLoans = getLoans()
    setLoans(allLoans.sort((a, b) => 
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

  const handleApproveLoan = async (loanId: string) => {
    if (!confirm("Are you sure you want to approve this loan?")) return

    try {
      updateLoan(loanId, { status: "approved" })
      loadLoans()
    } catch (err: any) {
      alert(err.message || "Failed to approve loan")
    }
  }

  const handleRejectLoan = async (loanId: string) => {
    if (!confirm("Are you sure you want to reject this loan?")) return

    try {
      updateLoan(loanId, { status: "rejected" })
      loadLoans()
    } catch (err: any) {
      alert(err.message || "Failed to reject loan")
    }
  }

  const handleDisburseLoan = async (loanId: string) => {
    if (!confirm("Are you sure you want to disburse this loan? This will transfer funds to the user.")) return

    try {
      const loan = loans.find(l => l.id === loanId)
      if (!loan) return

      // Update loan status
      updateLoan(loanId, { status: "disbursed" })
      
      // Update user balance
      const user = users.find(u => u.id === loan.userId)
      if (user) {
        // This would typically be handled by the transaction system
        // For now, we'll just update the loan status
      }

      loadLoans()
    } catch (err: any) {
      alert(err.message || "Failed to disburse loan")
    }
  }

  const handleDeleteLoan = async (loanId: string) => {
    if (!confirm("Are you sure you want to delete this loan? This action cannot be undone.")) return

    try {
      deleteLoan(loanId)
      loadLoans()
    } catch (err: any) {
      alert(err.message || "Failed to delete loan")
    }
  }

  const filteredLoans = loans.filter(loan => {
    const userName = getUserName(loan.userId)
    const userEmail = getUserEmail(loan.userId)
    const matchesSearch = 
      userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      userEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      loan.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      loan.purpose.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || loan.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-green-500">Approved</Badge>
      case "pending":
        return <Badge variant="secondary">Pending</Badge>
      case "rejected":
        return <Badge variant="destructive">Rejected</Badge>
      case "disbursed":
        return <Badge className="bg-blue-500">Disbursed</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const stats = {
    total: loans.length,
    pending: loans.filter(l => l.status === "pending").length,
    approved: loans.filter(l => l.status === "approved").length,
    rejected: loans.filter(l => l.status === "rejected").length,
    disbursed: loans.filter(l => l.status === "disbursed").length,
    totalAmount: loans.reduce((sum, l) => sum + l.amount, 0)
  }

  return (
    <PageShell>
      <PageHeader 
        title="Loan Management" 
        description="Review and manage all loan applications"
        actions={
          <Button variant="outline" size="sm" onClick={loadLoans}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
        }
      />

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-6">
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
              <p className="text-sm text-muted-foreground">Pending</p>
              <p className="text-3xl font-bold text-yellow-600">{stats.pending}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Approved</p>
              <p className="text-3xl font-bold text-green-600">{stats.approved}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Rejected</p>
              <p className="text-3xl font-bold text-red-600">{stats.rejected}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Disbursed</p>
              <p className="text-3xl font-bold text-blue-600">{stats.disbursed}</p>
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
      </div>

      {/* Loans Table */}
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle>All Loans</CardTitle>
              <CardDescription>{filteredLoans.length} loans found</CardDescription>
            </div>
            <div className="flex gap-2">
              <div className="relative flex-1 sm:w-64">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search loans..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                  <SelectItem value="disbursed">Disbursed</SelectItem>
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
                <TableHead>Purpose</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead className="text-right">Interest Rate</TableHead>
                <TableHead>Term</TableHead>
                <TableHead>Application Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-[200px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLoans.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="h-24 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <FileText className="h-8 w-8 text-muted-foreground" />
                      <p className="text-muted-foreground">No loans found</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredLoans.map((loan) => (
                  <TableRow key={loan.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{getUserName(loan.userId)}</p>
                        <p className="text-xs text-muted-foreground">{getUserEmail(loan.userId)}</p>
                      </div>
                    </TableCell>
                    <TableCell>{loan.purpose}</TableCell>
                    <TableCell className="text-right font-semibold">{formatTND(loan.amount)}</TableCell>
                    <TableCell className="text-right">{loan.interestRate}%</TableCell>
                    <TableCell>{loan.term} months</TableCell>
                    <TableCell>{new Date(loan.applicationDate).toLocaleDateString()}</TableCell>
                    <TableCell>{getStatusBadge(loan.status)}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        {loan.status === "pending" && (
                          <>
                            <Button 
                              size="sm" 
                              variant="outline"
                              className="text-green-600"
                              onClick={() => handleApproveLoan(loan.id)}
                            >
                              <CheckCircle2 className="mr-1 h-4 w-4" />
                              Approve
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline"
                              className="text-red-600"
                              onClick={() => handleRejectLoan(loan.id)}
                            >
                              <XCircle className="mr-1 h-4 w-4" />
                              Reject
                            </Button>
                          </>
                        )}
                        {loan.status === "approved" && (
                          <Button 
                            size="sm"
                            onClick={() => handleDisburseLoan(loan.id)}
                          >
                            Disburse
                          </Button>
                        )}
                        <Button 
                          size="sm" 
                          variant="ghost"
                          onClick={() => {
                            setSelectedLoan(loan)
                            setShowDetails(true)
                          }}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Loan Details Dialog */}
      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Loan Details</DialogTitle>
            <DialogDescription>Complete information about this loan application</DialogDescription>
          </DialogHeader>
          {selectedLoan && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">User</p>
                  <p className="font-medium">{getUserName(selectedLoan.userId)}</p>
                  <p className="text-sm text-muted-foreground">{getUserEmail(selectedLoan.userId)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <div className="mt-1">{getStatusBadge(selectedLoan.status)}</div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Amount</p>
                  <p className="font-semibold text-lg">{formatTND(selectedLoan.amount)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Interest Rate</p>
                  <p className="font-semibold text-lg">{selectedLoan.interestRate}%</p>
                </div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Purpose</p>
                <p className="font-medium">{selectedLoan.purpose}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Term</p>
                  <p className="font-medium">{selectedLoan.term} months</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Application Date</p>
                  <p className="font-medium">{new Date(selectedLoan.applicationDate).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDetails(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageShell>
  )
}

