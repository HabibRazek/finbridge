"use client"

import { useState } from "react"
import { Header } from "@/components/layout/header"
import { PageShell, PageHeader } from "@/components/shared/page-shell"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { 
  Upload, 
  Camera,
  FileText,
  CheckCircle2,
  AlertCircle,
  XCircle,
  User,
  Calendar,
  MapPin,
  Phone,
  Mail,
  CreditCard,
  Loader2,
  Eye
} from "lucide-react"

interface DocumentUpload {
  name: string
  status: "pending" | "uploaded" | "verified" | "rejected"
  file?: string
}

export default function ClientVerification() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [documents, setDocuments] = useState<DocumentUpload[]>([
    { name: "National ID (Front)", status: "pending" },
    { name: "National ID (Back)", status: "pending" },
    { name: "Proof of Address", status: "pending" },
  ])

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    gender: "",
    nationalId: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    occupation: "",
  })

  const getStatusBadge = (status: DocumentUpload["status"]) => {
    switch (status) {
      case "verified":
        return <Badge className="bg-green-500">Verified</Badge>
      case "uploaded":
        return <Badge variant="secondary">Uploaded</Badge>
      case "rejected":
        return <Badge variant="destructive">Rejected</Badge>
      default:
        return <Badge variant="outline">Pending</Badge>
    }
  }

  const getStatusIcon = (status: DocumentUpload["status"]) => {
    switch (status) {
      case "verified":
        return <CheckCircle2 className="h-5 w-5 text-green-500" />
      case "uploaded":
        return <AlertCircle className="h-5 w-5 text-yellow-500" />
      case "rejected":
        return <XCircle className="h-5 w-5 text-destructive" />
      default:
        return <FileText className="h-5 w-5 text-muted-foreground" />
    }
  }

  const handleFileUpload = (index: number) => {
    const updatedDocs = [...documents]
    updatedDocs[index].status = "uploaded"
    updatedDocs[index].file = "document.jpg"
    setDocuments(updatedDocs)
  }

  return (
    <>
      <Header title="Client Verification" description="KYC verification and document collection" />
      <PageShell>
        <PageHeader 
          title="Client Identity Verification" 
          description="Complete KYC verification for new clients"
        />

        <Tabs defaultValue="kyc" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-3">
            <TabsTrigger value="kyc">KYC Form</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
            <TabsTrigger value="status">Status</TabsTrigger>
          </TabsList>

          {/* KYC Form Tab */}
          <TabsContent value="kyc" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>Enter client&apos;s personal details for verification</CardDescription>
              </CardHeader>
              <CardContent>
                <form className="space-y-6">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          id="firstName"
                          placeholder="Enter first name"
                          className="pl-10"
                          value={formData.firstName}
                          onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        placeholder="Enter last name"
                        value={formData.lastName}
                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="dateOfBirth">Date of Birth</Label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          id="dateOfBirth"
                          type="date"
                          className="pl-10"
                          value={formData.dateOfBirth}
                          onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="gender">Gender</Label>
                      <Select
                        value={formData.gender}
                        onValueChange={(value) => setFormData({ ...formData, gender: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="nationalId">National ID Number</Label>
                      <div className="relative">
                        <CreditCard className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          id="nationalId"
                          placeholder="Enter national ID"
                          className="pl-10"
                          value={formData.nationalId}
                          onChange={(e) => setFormData({ ...formData, nationalId: e.target.value })}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          id="phone"
                          placeholder="+250 xxx xxx xxx"
                          className="pl-10"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="email@example.com"
                        className="pl-10"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="address"
                        placeholder="Enter full address"
                        className="pl-10"
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      />
                    </div>
                  </div>

                  <Separator />

                  <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="mr-2 h-4 w-4" />
                        Save & Continue to Documents
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Documents Tab */}
          <TabsContent value="documents" className="mt-6">
            <div className="grid gap-6 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Document Upload</CardTitle>
                  <CardDescription>Upload required identification documents</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {documents.map((doc, index) => (
                    <div
                      key={doc.name}
                      className="flex items-center justify-between rounded-lg border p-4"
                    >
                      <div className="flex items-center gap-3">
                        {getStatusIcon(doc.status)}
                        <div>
                          <p className="font-medium">{doc.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {doc.file || "No file uploaded"}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusBadge(doc.status)}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleFileUpload(index)}
                        >
                          <Upload className="mr-2 h-4 w-4" />
                          Upload
                        </Button>
                      </div>
                    </div>
                  ))}

                  <Separator />

                  <div className="rounded-lg border-2 border-dashed p-8 text-center">
                    <Camera className="mx-auto h-12 w-12 text-muted-foreground" />
                    <p className="mt-4 font-medium">Capture Document</p>
                    <p className="text-sm text-muted-foreground">
                      Use camera to scan ID documents
                    </p>
                    <Button variant="outline" className="mt-4">
                      <Camera className="mr-2 h-4 w-4" />
                      Open Camera
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Document Preview</CardTitle>
                  <CardDescription>Review uploaded documents</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex h-[300px] items-center justify-center rounded-lg bg-muted">
                    <div className="text-center">
                      <Eye className="mx-auto h-12 w-12 text-muted-foreground" />
                      <p className="mt-4 text-muted-foreground">
                        Select a document to preview
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Status Tab */}
          <TabsContent value="status" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Verification Status</CardTitle>
                <CardDescription>Current status of client verification</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="flex items-center gap-4 rounded-lg border p-4">
                    <CheckCircle2 className="h-8 w-8 text-green-500" />
                    <div className="flex-1">
                      <p className="font-medium">Personal Information</p>
                      <p className="text-sm text-muted-foreground">All required fields completed</p>
                    </div>
                    <Badge className="bg-green-500">Complete</Badge>
                  </div>

                  <div className="flex items-center gap-4 rounded-lg border p-4">
                    <AlertCircle className="h-8 w-8 text-yellow-500" />
                    <div className="flex-1">
                      <p className="font-medium">Document Verification</p>
                      <p className="text-sm text-muted-foreground">2 of 3 documents uploaded</p>
                    </div>
                    <Badge variant="secondary">In Progress</Badge>
                  </div>

                  <div className="flex items-center gap-4 rounded-lg border p-4">
                    <FileText className="h-8 w-8 text-muted-foreground" />
                    <div className="flex-1">
                      <p className="font-medium">KYC Review</p>
                      <p className="text-sm text-muted-foreground">Pending document completion</p>
                    </div>
                    <Badge variant="outline">Pending</Badge>
                  </div>

                  <div className="flex items-center gap-4 rounded-lg border p-4">
                    <FileText className="h-8 w-8 text-muted-foreground" />
                    <div className="flex-1">
                      <p className="font-medium">Account Activation</p>
                      <p className="text-sm text-muted-foreground">Waiting for KYC approval</p>
                    </div>
                    <Badge variant="outline">Pending</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </PageShell>
    </>
  )
}

