"use client"

import { useState } from "react"
import { Header } from "@/components/layout/header"
import { PageShell, PageHeader } from "@/components/shared/page-shell"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  MapPin,
  Clock,
  Banknote,
  CreditCard,
  CheckCircle2,
  AlertCircle,
  Loader2
} from "lucide-react"

export default function RecordTransaction() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    amount: "",
    accountNumber: "",
    accountName: "",
    transactionType: "",
    notes: "",
  })

  const currentTime = new Date().toLocaleString()
  const currentLocation = "Kigali, Rwanda" // Would be fetched from GPS

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))
    setIsSubmitting(false)
  }

  const commission = formData.amount ? (parseFloat(formData.amount) * 0.025).toFixed(2) : "0.00"

  return (
    <>
      <Header title="Record Transaction" description="Process a new deposit or withdrawal" />
      <PageShell>
        <PageHeader 
          title="Record Transaction" 
          description="Enter transaction details to process a new deposit"
        />

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Form */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Transaction Details</CardTitle>
              <CardDescription>Fill in the client&apos;s transaction information</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Transaction Type */}
                <div className="space-y-2">
                  <Label htmlFor="transactionType">Transaction Type</Label>
                  <Select
                    value={formData.transactionType}
                    onValueChange={(value) => setFormData({ ...formData, transactionType: value })}
                  >
                    <SelectTrigger id="transactionType">
                      <SelectValue placeholder="Select transaction type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="deposit">Cash Deposit</SelectItem>
                      <SelectItem value="withdrawal">Cash Withdrawal</SelectItem>
                      <SelectItem value="transfer">Bank Transfer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Amount */}
                <div className="space-y-2">
                  <Label htmlFor="amount">Amount (TND)</Label>
                  <div className="relative">
                    <Banknote className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="amount"
                      type="number"
                      placeholder="Enter amount"
                      className="pl-10"
                      value={formData.amount}
                      onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    />
                  </div>
                </div>

                {/* Account Number */}
                <div className="space-y-2">
                  <Label htmlFor="accountNumber">Client Bank Account Number</Label>
                  <div className="relative">
                    <CreditCard className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="accountNumber"
                      placeholder="Enter account number"
                      className="pl-10"
                      value={formData.accountNumber}
                      onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
                    />
                  </div>
                </div>

                {/* Account Name */}
                <div className="space-y-2">
                  <Label htmlFor="accountName">Account Holder Name</Label>
                  <Input
                    id="accountName"
                    placeholder="Enter account holder name"
                    value={formData.accountName}
                    onChange={(e) => setFormData({ ...formData, accountName: e.target.value })}
                  />
                </div>

                {/* Notes */}
                <div className="space-y-2">
                  <Label htmlFor="notes">Notes (Optional)</Label>
                  <Textarea
                    id="notes"
                    placeholder="Add any additional notes..."
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  />
                </div>

                <Separator />

                {/* Submit Button */}
                <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="mr-2 h-4 w-4" />
                      Submit Transaction
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Side Panel - Transaction Summary */}
          <div className="space-y-6">
            {/* Auto-captured Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Auto-captured Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Timestamp</p>
                    <p className="text-sm text-muted-foreground">{currentTime}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Location</p>
                    <p className="text-sm text-muted-foreground">{currentLocation}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Commission Summary */}
            <Card className="border-primary/20 bg-primary/5">
              <CardHeader>
                <CardTitle className="text-base">Commission Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Transaction Amount</span>
                  <span className="font-medium">TND {formData.amount || "0.00"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Commission Rate</span>
                  <span className="font-medium">2.5%</span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Your Commission</span>
                  <span className="text-lg font-bold text-primary">TND {commission}</span>
                </div>
              </CardContent>
            </Card>

            {/* Validation Status */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Validation Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2">
                  {formData.amount ? (
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                  ) : (
                    <AlertCircle className="h-4 w-4 text-muted-foreground" />
                  )}
                  <span className="text-sm">Amount entered</span>
                </div>
                <div className="flex items-center gap-2">
                  {formData.accountNumber ? (
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                  ) : (
                    <AlertCircle className="h-4 w-4 text-muted-foreground" />
                  )}
                  <span className="text-sm">Account number provided</span>
                </div>
                <div className="flex items-center gap-2">
                  {formData.transactionType ? (
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                  ) : (
                    <AlertCircle className="h-4 w-4 text-muted-foreground" />
                  )}
                  <span className="text-sm">Transaction type selected</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </PageShell>
    </>
  )
}

