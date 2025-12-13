"use client"

import { useState } from "react"
import { Header } from "@/components/layout/header"
import { PageShell, PageHeader } from "@/components/shared/page-shell"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { 
  Upload,
  FileText,
  Image,
  CheckCircle2,
  Clock,
  XCircle,
  Eye,
  Trash2,
  AlertCircle,
  Shield,
  Lock
} from "lucide-react"

interface Document {
  id: string
  name: string
  type: string
  required: boolean
  status: "pending" | "uploaded" | "verified" | "rejected"
  fileName?: string
  uploadDate?: string
  rejectionReason?: string
}

const requiredDocuments: Document[] = [
  { id: "1", name: "National ID (Front)", type: "id", required: true, status: "verified", fileName: "id_front.jpg", uploadDate: "Jan 10, 2024" },
  { id: "2", name: "National ID (Back)", type: "id", required: true, status: "verified", fileName: "id_back.jpg", uploadDate: "Jan 10, 2024" },
  { id: "3", name: "Pay Slip (Last 3 months)", type: "income", required: true, status: "uploaded", fileName: "payslips.pdf", uploadDate: "Jan 11, 2024" },
  { id: "4", name: "Bank Statement", type: "income", required: true, status: "rejected", fileName: "statement.pdf", uploadDate: "Jan 11, 2024", rejectionReason: "Document is older than 3 months" },
  { id: "5", name: "Employment Letter", type: "employment", required: true, status: "pending" },
  { id: "6", name: "Proof of Address", type: "address", required: false, status: "pending" },
]

const getStatusBadge = (status: string) => {
  switch (status) {
    case "pending":
      return <Badge variant="secondary"><Clock className="mr-1 h-3 w-3" />Pending</Badge>
    case "uploaded":
      return <Badge className="bg-blue-500"><Upload className="mr-1 h-3 w-3" />Uploaded</Badge>
    case "verified":
      return <Badge className="bg-green-500"><CheckCircle2 className="mr-1 h-3 w-3" />Verified</Badge>
    case "rejected":
      return <Badge variant="destructive"><XCircle className="mr-1 h-3 w-3" />Rejected</Badge>
    default:
      return <Badge variant="outline">{status}</Badge>
  }
}

const getDocumentIcon = (type: string) => {
  switch (type) {
    case "id":
      return <Image className="h-5 w-5" />
    default:
      return <FileText className="h-5 w-5" />
  }
}

export default function LoanDocuments() {
  const [documents, setDocuments] = useState(requiredDocuments)
  const [previewDoc, setPreviewDoc] = useState<Document | null>(null)

  const uploadedCount = documents.filter(d => d.status !== "pending").length
  const verifiedCount = documents.filter(d => d.status === "verified").length
  const requiredCount = documents.filter(d => d.required).length
  const progress = (verifiedCount / requiredCount) * 100

  return (
    <>
      <Header title="Document Upload" description="Upload required documents for your loan" />
      <PageShell>
        <PageHeader 
          title="Document Upload" 
          description="Securely upload your documents for loan verification"
        />

        {/* Security Notice */}
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                <Shield className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h4 className="font-medium">Your documents are secure</h4>
                <p className="text-sm text-muted-foreground">
                  All documents are encrypted and stored securely. Only authorized personnel can access your files.
                </p>
              </div>
              <Lock className="h-5 w-5 text-primary ml-auto" />
            </div>
          </CardContent>
        </Card>

        {/* Progress Overview */}
        <Card>
          <CardHeader>
            <CardTitle>Upload Progress</CardTitle>
            <CardDescription>
              {verifiedCount} of {requiredCount} required documents verified
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Progress value={progress} className="h-3" />
            <div className="mt-4 grid grid-cols-4 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold">{documents.length}</p>
                <p className="text-xs text-muted-foreground">Total</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-blue-500">{uploadedCount}</p>
                <p className="text-xs text-muted-foreground">Uploaded</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-green-500">{verifiedCount}</p>
                <p className="text-xs text-muted-foreground">Verified</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-destructive">
                  {documents.filter(d => d.status === "rejected").length}
                </p>
                <p className="text-xs text-muted-foreground">Rejected</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Documents List */}
        <Card>
          <CardHeader>
            <CardTitle>Required Documents</CardTitle>
            <CardDescription>Upload the following documents to complete your application</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {documents.map((doc) => (
                <div
                  key={doc.id}
                  className={`rounded-lg border p-4 ${
                    doc.status === "rejected" ? "border-destructive/50 bg-destructive/5" : ""
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                        {getDocumentIcon(doc.type)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-medium">{doc.name}</p>
                          {doc.required && (
                            <span className="text-xs text-destructive">*Required</span>
                          )}
                        </div>
                        {doc.fileName && (
                          <p className="text-sm text-muted-foreground">
                            {doc.fileName} • {doc.uploadDate}
                          </p>
                        )}
                        {doc.rejectionReason && (
                          <p className="text-sm text-destructive flex items-center gap-1 mt-1">
                            <AlertCircle className="h-3 w-3" />
                            {doc.rejectionReason}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusBadge(doc.status)}
                      {doc.status === "pending" || doc.status === "rejected" ? (
                        <Button size="sm">
                          <Upload className="mr-2 h-4 w-4" />
                          Upload
                        </Button>
                      ) : (
                        <div className="flex gap-1">
                          <Button variant="ghost" size="icon" onClick={() => setPreviewDoc(doc)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="text-destructive">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </PageShell>
    </>
  )
}

