"use client"

import { Header } from "@/components/layout/header"
import { PageShell, PageHeader } from "@/components/shared/page-shell"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  CheckCircle2,
  Clock,
  XCircle,
  AlertTriangle,
  Shield,
  FileCheck,
  UserCheck,
  Building2,
  Scale,
  RefreshCw,
  ChevronRight
} from "lucide-react"

interface ChecklistItem {
  id: string
  name: string
  description: string
  status: "completed" | "pending" | "in_progress" | "failed"
  category: "kyc" | "aml" | "document" | "regulatory"
  lastChecked?: string
}

const complianceChecklist: ChecklistItem[] = [
  // KYC Items
  { id: "1", name: "Identity Verification", description: "National ID verified against government database", status: "completed", category: "kyc", lastChecked: "Jan 12, 2024" },
  { id: "2", name: "Address Verification", description: "Proof of residence document verified", status: "completed", category: "kyc", lastChecked: "Jan 12, 2024" },
  { id: "3", name: "Phone Number Verification", description: "Mobile number verified via OTP", status: "completed", category: "kyc", lastChecked: "Jan 10, 2024" },
  { id: "4", name: "Email Verification", description: "Email address confirmed", status: "pending", category: "kyc" },
  // AML Items
  { id: "5", name: "Sanctions Screening", description: "Checked against international sanctions lists", status: "completed", category: "aml", lastChecked: "Jan 12, 2024" },
  { id: "6", name: "PEP Check", description: "Politically Exposed Person screening", status: "completed", category: "aml", lastChecked: "Jan 12, 2024" },
  { id: "7", name: "Adverse Media Check", description: "Screening for negative news coverage", status: "in_progress", category: "aml" },
  { id: "8", name: "Source of Funds", description: "Verification of income source", status: "pending", category: "aml" },
  // Document Items
  { id: "9", name: "ID Document Authenticity", description: "Document verified for authenticity", status: "completed", category: "document", lastChecked: "Jan 11, 2024" },
  { id: "10", name: "Income Documents", description: "Pay slips and bank statements verified", status: "in_progress", category: "document" },
  { id: "11", name: "Employment Verification", description: "Employment letter verified with employer", status: "pending", category: "document" },
  // Regulatory Items
  { id: "12", name: "Credit Bureau Check", description: "Credit history retrieved and analyzed", status: "completed", category: "regulatory", lastChecked: "Jan 12, 2024" },
  { id: "13", name: "Debt-to-Income Ratio", description: "DTI calculated and within limits", status: "completed", category: "regulatory", lastChecked: "Jan 12, 2024" },
  { id: "14", name: "Loan Eligibility", description: "Meets all eligibility criteria", status: "in_progress", category: "regulatory" },
]

const getStatusIcon = (status: string) => {
  switch (status) {
    case "completed":
      return <CheckCircle2 className="h-5 w-5 text-green-500" />
    case "in_progress":
      return <Clock className="h-5 w-5 text-blue-500" />
    case "pending":
      return <Clock className="h-5 w-5 text-muted-foreground" />
    case "failed":
      return <XCircle className="h-5 w-5 text-destructive" />
    default:
      return <Clock className="h-5 w-5" />
  }
}

const getStatusBadge = (status: string) => {
  switch (status) {
    case "completed":
      return <Badge className="bg-green-500">Completed</Badge>
    case "in_progress":
      return <Badge className="bg-blue-500">In Progress</Badge>
    case "pending":
      return <Badge variant="secondary">Pending</Badge>
    case "failed":
      return <Badge variant="destructive">Failed</Badge>
    default:
      return <Badge variant="outline">{status}</Badge>
  }
}

const getCategoryIcon = (category: string) => {
  switch (category) {
    case "kyc":
      return <UserCheck className="h-5 w-5" />
    case "aml":
      return <Shield className="h-5 w-5" />
    case "document":
      return <FileCheck className="h-5 w-5" />
    case "regulatory":
      return <Scale className="h-5 w-5" />
    default:
      return <Building2 className="h-5 w-5" />
  }
}

export default function ComplianceChecklist() {
  const completedCount = complianceChecklist.filter(item => item.status === "completed").length
  const totalCount = complianceChecklist.length
  const progress = (completedCount / totalCount) * 100

  const kycItems = complianceChecklist.filter(item => item.category === "kyc")
  const amlItems = complianceChecklist.filter(item => item.category === "aml")
  const documentItems = complianceChecklist.filter(item => item.category === "document")
  const regulatoryItems = complianceChecklist.filter(item => item.category === "regulatory")

  const getCategoryProgress = (items: ChecklistItem[]) => {
    const completed = items.filter(i => i.status === "completed").length
    return (completed / items.length) * 100
  }

  return (
    <>
      <Header title="Compliance" description="KYC/AML verification status" />
      <PageShell>
        <PageHeader 
          title="Compliance Checklist" 
          description="Track KYC/AML verification and regulatory compliance"
          actions={
            <Button variant="outline" size="sm">
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh Status
            </Button>
          }
        />

        {/* Overall Progress */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Overall Compliance Status</CardTitle>
                <CardDescription>
                  {completedCount} of {totalCount} checks completed
                </CardDescription>
              </div>
              {progress === 100 ? (
                <Badge className="bg-green-500 text-lg px-4 py-1">
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  Fully Compliant
                </Badge>
              ) : (
                <Badge variant="secondary" className="text-lg px-4 py-1">
                  <Clock className="mr-2 h-4 w-4" />
                  In Progress
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <Progress value={progress} className="h-4" />
            <p className="mt-2 text-sm text-muted-foreground text-right">
              {progress.toFixed(0)}% Complete
            </p>
          </CardContent>
        </Card>

        {/* Category Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[
            { name: "KYC Verification", icon: UserCheck, items: kycItems, color: "text-blue-500" },
            { name: "AML Screening", icon: Shield, items: amlItems, color: "text-purple-500" },
            { name: "Document Verification", icon: FileCheck, items: documentItems, color: "text-orange-500" },
            { name: "Regulatory Checks", icon: Scale, items: regulatoryItems, color: "text-green-500" },
          ].map((category) => (
            <Card key={category.name}>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3 mb-4">
                  <category.icon className={`h-6 w-6 ${category.color}`} />
                  <div>
                    <p className="font-medium text-sm">{category.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {category.items.filter(i => i.status === "completed").length}/{category.items.length} completed
                    </p>
                  </div>
                </div>
                <Progress value={getCategoryProgress(category.items)} className="h-2" />
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Detailed Checklist */}
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full max-w-lg grid-cols-5">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="kyc">KYC</TabsTrigger>
            <TabsTrigger value="aml">AML</TabsTrigger>
            <TabsTrigger value="document">Docs</TabsTrigger>
            <TabsTrigger value="regulatory">Regulatory</TabsTrigger>
          </TabsList>

          {["all", "kyc", "aml", "document", "regulatory"].map((tab) => (
            <TabsContent key={tab} value={tab} className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>
                    {tab === "all" ? "All Compliance Checks" :
                     tab === "kyc" ? "KYC Verification" :
                     tab === "aml" ? "AML Screening" :
                     tab === "document" ? "Document Verification" : "Regulatory Checks"}
                  </CardTitle>
                  <CardDescription>
                    Detailed status of each verification step
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {(tab === "all" ? complianceChecklist : complianceChecklist.filter(item => item.category === tab)).map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between rounded-lg border p-4"
                      >
                        <div className="flex items-center gap-4">
                          {getStatusIcon(item.status)}
                          <div>
                            <p className="font-medium">{item.name}</p>
                            <p className="text-sm text-muted-foreground">{item.description}</p>
                            {item.lastChecked && (
                              <p className="text-xs text-muted-foreground mt-1">
                                Last checked: {item.lastChecked}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {getStatusBadge(item.status)}
                          {item.status !== "completed" && (
                            <Button variant="ghost" size="sm">
                              <ChevronRight className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>

        {/* Warning Notice */}
        {complianceChecklist.some(item => item.status === "failed") && (
          <Card className="border-destructive/50 bg-destructive/5">
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <AlertTriangle className="h-6 w-6 text-destructive" />
                <div>
                  <h4 className="font-medium text-destructive">Compliance Issues Detected</h4>
                  <p className="text-sm text-destructive/80">
                    Some verification checks have failed. Please contact support for assistance.
                  </p>
                </div>
                <Button variant="outline" className="ml-auto">
                  Contact Support
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </PageShell>
    </>
  )
}

