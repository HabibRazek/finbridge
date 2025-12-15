"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/layout/header"
import { PageShell, PageHeader } from "@/components/shared/page-shell"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import {
  ChevronRight,
  ChevronLeft,
  User,
  Briefcase,
  DollarSign,
  FileText,
  CheckCircle2,
  AlertCircle,
  Loader2
} from "lucide-react"
import { formatTND } from "@/lib/currency"
import { useAuth } from "@/lib/auth-context"
import { getUserByEmail, createLoan } from "@/lib/json-storage"

const steps = [
  { id: 1, name: "Personal Info", icon: User },
  { id: 2, name: "Employment", icon: Briefcase },
  { id: 3, name: "Loan Details", icon: DollarSign },
  { id: 4, name: "Review", icon: FileText },
]

export default function LoanApplication() {
  const { user } = useAuth()
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  
  const [formData, setFormData] = useState({
    // Personal Info
    fullName: "",
    dateOfBirth: "",
    nationalId: "",
    phone: "",
    email: "",
    address: "",
    // Employment
    employmentStatus: "",
    employerName: "",
    jobTitle: "",
    monthlyIncome: "",
    yearsEmployed: "",
    // Loan Details
    loanType: "",
    loanAmount: "",
    loanPurpose: "",
    loanTerm: "",
    // Terms
    agreeTerms: false,
    agreeCredit: false,
  })

  // Pre-fill form with user data if logged in
  useEffect(() => {
    if (user?.email) {
      const clientUser = getUserByEmail(user.email)
      if (clientUser) {
        setFormData(prev => ({
          ...prev,
          fullName: clientUser.name || prev.fullName,
          email: clientUser.email || prev.email,
          phone: clientUser.phone || prev.phone,
          address: clientUser.address || prev.address,
          dateOfBirth: clientUser.dateOfBirth || prev.dateOfBirth,
        }))
      }
    }
  }, [user])

  const progress = (currentStep / steps.length) * 100

  const handleNext = () => {
    // Validate current step before proceeding
    if (currentStep === 1) {
      if (!formData.fullName || !formData.dateOfBirth || !formData.nationalId || !formData.phone || !formData.address) {
        setError("Please fill in all required fields")
        return
      }
    } else if (currentStep === 2) {
      if (!formData.employmentStatus || !formData.employerName || !formData.jobTitle || !formData.monthlyIncome || !formData.yearsEmployed) {
        setError("Please fill in all required fields")
        return
      }
    } else if (currentStep === 3) {
      if (!formData.loanType || !formData.loanAmount || !formData.loanPurpose || !formData.loanTerm) {
        setError("Please fill in all required fields")
        return
      }
    }
    setError("")
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    setError("")
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = async () => {
    if (!formData.agreeTerms || !formData.agreeCredit) {
      setError("Please agree to the terms and conditions")
      return
    }

    if (!user?.email) {
      setError("Please log in to submit a loan application")
      return
    }

    setIsSubmitting(true)
    setError("")

    try {
      const clientUser = getUserByEmail(user.email)
      if (!clientUser) {
        setError("User not found. Please log in again.")
        setIsSubmitting(false)
        return
      }

      // Calculate interest rate based on loan type and term
      const baseRate = 6.5
      const termMonths = parseInt(formData.loanTerm)
      let interestRate = baseRate
      
      if (formData.loanType === "business") {
        interestRate = baseRate + 0.5
      } else if (formData.loanType === "agriculture") {
        interestRate = baseRate - 0.5
      }

      // Create loan application
      const newLoan = createLoan({
        userId: clientUser.id,
        amount: parseFloat(formData.loanAmount),
        purpose: formData.loanPurpose,
        status: "pending",
        applicationDate: new Date().toISOString().split('T')[0],
        interestRate: interestRate,
        term: termMonths
      })

      setSuccess(true)
      
      // Redirect to loan status page after 2 seconds
      setTimeout(() => {
        router.push("/loan/status")
      }, 2000)
    } catch (err: any) {
      setError(err.message || "Failed to submit loan application. Please try again.")
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <Header title="Loan Application" description="Apply for a new loan" />
      <PageShell>
        <PageHeader 
          title="Loan Application" 
          description="Complete the form below to apply for a loan"
        />

        {/* Progress Indicator */}
        <Card>
          <CardContent className="pt-6">
            <div className="mb-4">
              <div className="flex justify-between text-sm mb-2">
                <span className="font-medium">Step {currentStep} of {steps.length}</span>
                <span className="text-muted-foreground">{progress.toFixed(0)}% Complete</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
            <div className="flex justify-between">
              {steps.map((step) => {
                const Icon = step.icon
                const isActive = step.id === currentStep
                const isCompleted = step.id < currentStep
                return (
                  <div
                    key={step.id}
                    className={`flex flex-col items-center gap-2 ${
                      isActive ? "text-primary" : isCompleted ? "text-green-500" : "text-muted-foreground"
                    }`}
                  >
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-full border-2 ${
                        isActive
                          ? "border-primary bg-primary/10"
                          : isCompleted
                          ? "border-green-500 bg-green-500/10"
                          : "border-muted"
                      }`}
                    >
                      {isCompleted ? (
                        <CheckCircle2 className="h-5 w-5" />
                      ) : (
                        <Icon className="h-5 w-5" />
                      )}
                    </div>
                    <span className="text-xs font-medium hidden sm:block">{step.name}</span>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Form Steps */}
        <Card>
          <CardHeader>
            <CardTitle>
              {steps[currentStep - 1].name}
            </CardTitle>
            <CardDescription>
              {currentStep === 1 && "Please provide your personal information"}
              {currentStep === 2 && "Tell us about your employment"}
              {currentStep === 3 && "Specify your loan requirements"}
              {currentStep === 4 && "Review your application before submitting"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Step 1: Personal Information */}
            {currentStep === 1 && (
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name *</Label>
                  <Input
                    id="fullName"
                    placeholder="Enter your full name"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dob">Date of Birth *</Label>
                  <Input
                    id="dob"
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nationalId">National ID *</Label>
                  <Input
                    id="nationalId"
                    placeholder="Enter your national ID"
                    value={formData.nationalId}
                    onChange={(e) => setFormData({ ...formData, nationalId: e.target.value })}
                  />
                </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+216 XX XXX XXX"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="address">Residential Address *</Label>
                  <Textarea
                    id="address"
                    placeholder="Enter your full address"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  />
                </div>
              </div>
            )}

            {/* Step 2: Employment Information */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div className="space-y-3">
                  <Label>Employment Status *</Label>
                  <RadioGroup
                    value={formData.employmentStatus}
                    onValueChange={(value) => setFormData({ ...formData, employmentStatus: value })}
                    className="grid grid-cols-2 gap-4 md:grid-cols-4"
                  >
                    {["Employed", "Self-Employed", "Business Owner", "Other"].map((status) => (
                      <div key={status} className="flex items-center space-x-2">
                        <RadioGroupItem value={status.toLowerCase()} id={status} />
                        <Label htmlFor={status} className="cursor-pointer">{status}</Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="employer">Employer Name *</Label>
                    <Input
                      id="employer"
                      placeholder="Company name"
                      value={formData.employerName}
                      onChange={(e) => setFormData({ ...formData, employerName: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="jobTitle">Job Title *</Label>
                    <Input
                      id="jobTitle"
                      placeholder="Your position"
                      value={formData.jobTitle}
                      onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="income">Monthly Income (TND) *</Label>
                    <Input
                      id="income"
                      type="number"
                      placeholder="0.000"
                      step="0.001"
                      value={formData.monthlyIncome}
                      onChange={(e) => setFormData({ ...formData, monthlyIncome: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="years">Years at Current Job *</Label>
                    <Select
                      value={formData.yearsEmployed}
                      onValueChange={(value) => setFormData({ ...formData, yearsEmployed: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select duration" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0-1">Less than 1 year</SelectItem>
                        <SelectItem value="1-3">1-3 years</SelectItem>
                        <SelectItem value="3-5">3-5 years</SelectItem>
                        <SelectItem value="5+">More than 5 years</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Loan Details */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div className="space-y-3">
                  <Label>Loan Type *</Label>
                  <RadioGroup
                    value={formData.loanType}
                    onValueChange={(value) => setFormData({ ...formData, loanType: value })}
                    className="grid gap-4 md:grid-cols-3"
                  >
                    {[
                      { value: "personal", label: "Personal Loan", desc: "For personal expenses" },
                      { value: "business", label: "Business Loan", desc: "For business growth" },
                      { value: "agriculture", label: "Agriculture Loan", desc: "For farming activities" },
                    ].map((type) => (
                      <div key={type.value} className="relative">
                        <RadioGroupItem
                          value={type.value}
                          id={type.value}
                          className="peer sr-only"
                        />
                        <Label
                          htmlFor={type.value}
                          className="flex flex-col items-center justify-center rounded-lg border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary cursor-pointer"
                        >
                          <span className="font-medium">{type.label}</span>
                          <span className="text-xs text-muted-foreground">{type.desc}</span>
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="amount">Loan Amount (TND) *</Label>
                    <Input
                      id="amount"
                      type="number"
                      placeholder="Enter amount"
                      step="0.001"
                      value={formData.loanAmount}
                      onChange={(e) => setFormData({ ...formData, loanAmount: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="term">Loan Term *</Label>
                    <Select
                      value={formData.loanTerm}
                      onValueChange={(value) => setFormData({ ...formData, loanTerm: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select term" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="6">6 months</SelectItem>
                        <SelectItem value="12">12 months</SelectItem>
                        <SelectItem value="24">24 months</SelectItem>
                        <SelectItem value="36">36 months</SelectItem>
                        <SelectItem value="48">48 months</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="purpose">Purpose of Loan *</Label>
                  <Textarea
                    id="purpose"
                    placeholder="Describe how you plan to use the loan"
                    value={formData.loanPurpose}
                    onChange={(e) => setFormData({ ...formData, loanPurpose: e.target.value })}
                  />
                </div>
              </div>
            )}

            {/* Step 4: Review */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-4">
                    <h4 className="font-medium flex items-center gap-2">
                      <User className="h-4 w-4" /> Personal Information
                    </h4>
                    <div className="rounded-lg border p-4 space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Full Name</span>
                        <span className="font-medium">{formData.fullName || "—"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">National ID</span>
                        <span className="font-medium">{formData.nationalId || "—"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Phone</span>
                        <span className="font-medium">{formData.phone || "—"}</span>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h4 className="font-medium flex items-center gap-2">
                      <Briefcase className="h-4 w-4" /> Employment
                    </h4>
                    <div className="rounded-lg border p-4 space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Status</span>
                        <span className="font-medium capitalize">{formData.employmentStatus || "—"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Employer</span>
                        <span className="font-medium">{formData.employerName || "—"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Monthly Income</span>
                        <span className="font-medium">{formData.monthlyIncome ? formatTND(parseFloat(formData.monthlyIncome)) : "—"}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <h4 className="font-medium flex items-center gap-2">
                    <DollarSign className="h-4 w-4" /> Loan Details
                  </h4>
                  <div className="rounded-lg border p-4 grid gap-4 md:grid-cols-3 text-sm">
                    <div>
                      <span className="text-muted-foreground">Loan Type</span>
                      <p className="font-medium capitalize">{formData.loanType || "—"}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Amount</span>
                      <p className="font-medium">{formData.loanAmount ? formatTND(parseFloat(formData.loanAmount)) : "—"}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Term</span>
                      <p className="font-medium">{formData.loanTerm ? `${formData.loanTerm} months` : "—"}</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4 rounded-lg border p-4 bg-muted/50">
                  <div className="flex items-start space-x-3">
                    <Checkbox
                      id="terms"
                      checked={formData.agreeTerms}
                      onCheckedChange={(checked) => setFormData({ ...formData, agreeTerms: checked as boolean })}
                    />
                    <Label htmlFor="terms" className="text-sm leading-relaxed cursor-pointer">
                      I agree to the Terms and Conditions and understand that this application will be reviewed by the loan committee.
                    </Label>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Checkbox
                      id="credit"
                      checked={formData.agreeCredit}
                      onCheckedChange={(checked) => setFormData({ ...formData, agreeCredit: checked as boolean })}
                    />
                    <Label htmlFor="credit" className="text-sm leading-relaxed cursor-pointer">
                      I authorize the bank to perform a credit check and verify the information provided.
                    </Label>
                  </div>
                </div>
              </div>
            )}

            {error && (
              <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">
                {error}
              </div>
            )}

            {success && (
              <div className="rounded-lg bg-green-50 p-3 text-sm text-green-600 dark:bg-green-900/20 dark:text-green-400 flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4" />
                Loan application submitted successfully! Redirecting...
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 1 || isSubmitting}
            >
              <ChevronLeft className="mr-2 h-4 w-4" />
              Previous
            </Button>
            {currentStep < steps.length ? (
              <Button onClick={handleNext} disabled={isSubmitting}>
                Next
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={!formData.agreeTerms || !formData.agreeCredit || isSubmitting || success}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : success ? (
                  <>
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                    Submitted!
                  </>
                ) : (
                  <>
                    Submit Application
                    <CheckCircle2 className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            )}
          </CardFooter>
        </Card>
      </PageShell>
    </>
  )
}

