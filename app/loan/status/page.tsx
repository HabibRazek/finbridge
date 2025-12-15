"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/layout/header"
import { PageShell, PageHeader } from "@/components/shared/page-shell"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  FileText,
  Calendar,
  DollarSign,
  Bell,
  ChevronRight,
  RefreshCw
} from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { getUserByEmail, getLoans } from "@/lib/json-storage"
import { formatTND } from "@/lib/currency"

const getStatusBadge = (status: string) => {
  switch (status) {
    case "pending":
      return <Badge variant="secondary"><Clock className="mr-1 h-3 w-3" />Pending</Badge>
    case "under_review":
      return <Badge className="bg-blue-500"><AlertCircle className="mr-1 h-3 w-3" />Under Review</Badge>
    case "approved":
      return <Badge className="bg-green-500"><CheckCircle2 className="mr-1 h-3 w-3" />Approved</Badge>
    case "rejected":
      return <Badge variant="destructive"><XCircle className="mr-1 h-3 w-3" />Rejected</Badge>
    default:
      return <Badge variant="outline">{status}</Badge>
  }
}

export default function LoanStatus() {
  const { user } = useAuth()
  const [loans, setLoans] = useState<any[]>([])
  const [selectedLoan, setSelectedLoan] = useState<any>(null)
  const [notifications, setNotifications] = useState({
    statusUpdates: true,
    documentRequests: true,
    approvalAlerts: true,
    smsNotifications: false,
  })

  useEffect(() => {
    if (user?.email) {
      const clientUser = getUserByEmail(user.email)
      if (clientUser) {
        const userLoans = getLoans(clientUser.id)
        // Transform loans to match the UI format
        const transformedLoans = userLoans.map((loan, index) => {
          const status = loan.status === "pending" ? "under_review" : loan.status
          const appliedDate = new Date(loan.applicationDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
          const lastUpdate = new Date(loan.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
          
          // Generate timeline steps based on status
          const steps = [
            { name: "Application Submitted", date: appliedDate, status: "completed" },
            { name: "Document Verification", date: status === "pending" ? "Pending" : appliedDate, status: status === "pending" ? "pending" : "completed" },
            { name: "Credit Assessment", date: status === "pending" ? "In Progress" : (status === "approved" || status === "rejected" ? appliedDate : "Pending"), status: status === "pending" ? "current" : (status === "approved" || status === "rejected" ? "completed" : "pending") },
            { name: "Committee Review", date: status === "approved" || status === "rejected" ? appliedDate : "Pending", status: status === "approved" || status === "rejected" ? "completed" : "pending" },
            { name: "Final Decision", date: status === "approved" || status === "rejected" ? lastUpdate : "Pending", status: status === "approved" ? "completed" : (status === "rejected" ? "rejected" : "pending") },
          ]

          return {
            id: loan.id,
            type: loan.purpose,
            amount: loan.amount,
            status: status,
            appliedDate: loan.applicationDate,
            lastUpdate: lastUpdate,
            currentStep: status === "approved" ? 5 : (status === "rejected" ? 4 : 2),
            steps: steps,
            interestRate: loan.interestRate,
            term: loan.term
          }
        })
        
        setLoans(transformedLoans)
        if (transformedLoans.length > 0) {
          setSelectedLoan(transformedLoans[0])
        }
      }
    }
  }, [user])

  const handleRefresh = () => {
    if (user?.email) {
      const clientUser = getUserByEmail(user.email)
      if (clientUser) {
        const userLoans = getLoans(clientUser.id)
        const transformedLoans = userLoans.map((loan) => {
          const status = loan.status === "pending" ? "under_review" : loan.status
          const appliedDate = new Date(loan.applicationDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
          const lastUpdate = new Date(loan.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
          
          const steps = [
            { name: "Application Submitted", date: appliedDate, status: "completed" },
            { name: "Document Verification", date: status === "pending" ? "Pending" : appliedDate, status: status === "pending" ? "pending" : "completed" },
            { name: "Credit Assessment", date: status === "pending" ? "In Progress" : (status === "approved" || status === "rejected" ? appliedDate : "Pending"), status: status === "pending" ? "current" : (status === "approved" || status === "rejected" ? "completed" : "pending") },
            { name: "Committee Review", date: status === "approved" || status === "rejected" ? appliedDate : "Pending", status: status === "approved" || status === "rejected" ? "completed" : "pending" },
            { name: "Final Decision", date: status === "approved" || status === "rejected" ? lastUpdate : "Pending", status: status === "approved" ? "completed" : (status === "rejected" ? "rejected" : "pending") },
          ]

          return {
            id: loan.id,
            type: loan.purpose,
            amount: loan.amount,
            status: status,
            appliedDate: loan.applicationDate,
            lastUpdate: lastUpdate,
            currentStep: status === "approved" ? 5 : (status === "rejected" ? 4 : 2),
            steps: steps,
            interestRate: loan.interestRate,
            term: loan.term
          }
        })
        
        setLoans(transformedLoans)
        if (transformedLoans.length > 0 && selectedLoan) {
          const updated = transformedLoans.find(l => l.id === selectedLoan.id)
          if (updated) setSelectedLoan(updated)
        }
      }
    }
  }

  return (
    <>
      <Header title="Loan Status" description="Track your loan applications" />
      <PageShell>
        <PageHeader 
          title="Loan Status" 
          description="Track the status of your loan applications"
          actions={
            <Button variant="outline" size="sm" onClick={handleRefresh}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh
            </Button>
          }
        />

        <Tabs defaultValue="applications" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="applications">My Applications</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
          </TabsList>

          <TabsContent value="applications" className="mt-6">
            {loans.length === 0 ? (
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center py-12">
                    <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No Loan Applications</h3>
                    <p className="text-muted-foreground mb-4">You haven't submitted any loan applications yet.</p>
                    <Button asChild>
                      <a href="/loan/apply">Apply for a Loan</a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-6 lg:grid-cols-3">
                {/* Applications List */}
                <div className="space-y-4">
                  <h3 className="font-medium text-sm text-muted-foreground">Your Applications</h3>
                  {loans.map((loan) => (
                  <Card
                    key={loan.id}
                    className={`cursor-pointer transition-colors hover:bg-muted/50 ${
                      selectedLoan.id === loan.id ? "border-primary" : ""
                    }`}
                    onClick={() => setSelectedLoan(loan)}
                  >
                    <CardContent className="pt-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-mono text-sm">{loan.id.substring(0, 12)}</p>
                          <p className="font-medium">{loan.type}</p>
                          <p className="text-sm text-muted-foreground">
                            {formatTND(loan.amount)}
                          </p>
                        </div>
                        <div className="text-right">
                          {getStatusBadge(loan.status)}
                          <p className="mt-1 text-xs text-muted-foreground">
                            {loan.appliedDate}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Selected Loan Details */}
              {selectedLoan && (
                <div className="lg:col-span-2">
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="flex items-center gap-2">
                            {selectedLoan.type}
                            {getStatusBadge(selectedLoan.status)}
                          </CardTitle>
                          <CardDescription>Application ID: {selectedLoan.id.substring(0, 12)}</CardDescription>
                        </div>
                      <Button variant="outline" size="sm">
                        <FileText className="mr-2 h-4 w-4" />
                        View Documents
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Loan Summary */}
                    <div className="grid gap-4 md:grid-cols-3">
                      <div className="rounded-lg border p-4">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <DollarSign className="h-4 w-4" />
                          <span className="text-sm">Loan Amount</span>
                        </div>
                        <p className="mt-1 text-xl font-bold">
                          {formatTND(selectedLoan.amount)}
                        </p>
                      </div>
                      <div className="rounded-lg border p-4">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          <span className="text-sm">Applied Date</span>
                        </div>
                        <p className="mt-1 text-xl font-bold">{selectedLoan.appliedDate}</p>
                      </div>
                      <div className="rounded-lg border p-4">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Clock className="h-4 w-4" />
                          <span className="text-sm">Last Update</span>
                        </div>
                        <p className="mt-1 text-xl font-bold">{selectedLoan.lastUpdate}</p>
                      </div>
                    </div>

                    {/* Timeline */}
                    <div>
                      <h4 className="font-medium mb-4">Application Timeline</h4>
                      <div className="relative">
                        {selectedLoan.steps.map((step, index) => {
                          const isCompleted = step.status === "completed"
                          const isCurrent = step.status === "current"
                          const isRejected = step.status === "rejected"
                          const isPending = step.status === "pending"

                          return (
                            <div key={index} className="flex gap-4 pb-6 last:pb-0">
                              {/* Timeline Line */}
                              <div className="flex flex-col items-center">
                                <div
                                  className={`flex h-8 w-8 items-center justify-center rounded-full border-2 ${
                                    isCompleted
                                      ? "border-green-500 bg-green-500 text-white"
                                      : isCurrent
                                      ? "border-blue-500 bg-blue-500 text-white"
                                      : isRejected
                                      ? "border-destructive bg-destructive text-white"
                                      : "border-muted bg-background"
                                  }`}
                                >
                                  {isCompleted ? (
                                    <CheckCircle2 className="h-4 w-4" />
                                  ) : isCurrent ? (
                                    <Clock className="h-4 w-4" />
                                  ) : isRejected ? (
                                    <XCircle className="h-4 w-4" />
                                  ) : (
                                    <span className="text-xs text-muted-foreground">{index + 1}</span>
                                  )}
                                </div>
                                {index < selectedLoan.steps.length - 1 && (
                                  <div
                                    className={`w-0.5 flex-1 ${
                                      isCompleted ? "bg-green-500" : "bg-muted"
                                    }`}
                                  />
                                )}
                              </div>
                              {/* Step Content */}
                              <div className="flex-1 pb-2">
                                <p className={`font-medium ${isPending ? "text-muted-foreground" : ""}`}>
                                  {step.name}
                                </p>
                                <p className="text-sm text-muted-foreground">{step.date}</p>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    {selectedLoan.status === "approved" && (
                      <div className="rounded-lg border border-green-500/30 bg-green-500/10 p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-green-700">Congratulations! Your loan is approved.</p>
                            <p className="text-sm text-green-600">Please visit the nearest branch to complete the disbursement process.</p>
                          </div>
                          <Button className="bg-green-600 hover:bg-green-700">
                            Schedule Visit
                            <ChevronRight className="ml-2 h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    )}

                    {selectedLoan.status === "rejected" && (
                      <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-destructive">Your application was not approved.</p>
                            <p className="text-sm text-destructive/80">You may reapply after 30 days or contact support for more information.</p>
                          </div>
                          <Button variant="outline">
                            Contact Support
                          </Button>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
              )}
            </div>
            )}
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Notification Settings
                </CardTitle>
                <CardDescription>
                  Configure how you want to receive updates about your loan applications
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Status Updates</Label>
                    <p className="text-sm text-muted-foreground">
                      Get notified when your application status changes
                    </p>
                  </div>
                  <Switch
                    checked={notifications.statusUpdates}
                    onCheckedChange={(checked) =>
                      setNotifications({ ...notifications, statusUpdates: checked })
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Document Requests</Label>
                    <p className="text-sm text-muted-foreground">
                      Get notified when additional documents are required
                    </p>
                  </div>
                  <Switch
                    checked={notifications.documentRequests}
                    onCheckedChange={(checked) =>
                      setNotifications({ ...notifications, documentRequests: checked })
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Approval Alerts</Label>
                    <p className="text-sm text-muted-foreground">
                      Get instant notification when your loan is approved
                    </p>
                  </div>
                  <Switch
                    checked={notifications.approvalAlerts}
                    onCheckedChange={(checked) =>
                      setNotifications({ ...notifications, approvalAlerts: checked })
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>SMS Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive updates via SMS in addition to in-app notifications
                    </p>
                  </div>
                  <Switch
                    checked={notifications.smsNotifications}
                    onCheckedChange={(checked) =>
                      setNotifications({ ...notifications, smsNotifications: checked })
                    }
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </PageShell>
    </>
  )
}

