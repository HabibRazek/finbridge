"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
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
import { useAuth } from "@/lib/auth-context"
import { getUserByEmail, createTransaction, getAllUsers } from "@/lib/json-storage"

export default function RecordTransaction() {
  const { user } = useAuth()
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")
  const [formData, setFormData] = useState({
    amount: "",
    clientEmail: "",
    transactionType: "",
    notes: "",
  })

  const currentTime = new Date().toLocaleString()
  const currentLocation = "Tunis, Tunisia" // Would be fetched from GPS

  // Get all clients for dropdown
  const clients = getAllUsers().filter(u => u.role === 'client')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess(false)
    
    if (!formData.amount || !formData.clientEmail || !formData.transactionType) {
      setError("Please fill in all required fields")
      return
    }

    const amount = parseFloat(formData.amount)
    if (isNaN(amount) || amount <= 0) {
      setError("Please enter a valid amount")
      return
    }

    setIsSubmitting(true)

    try {
      // Find client user
      const clientUser = getUserByEmail(formData.clientEmail)
      if (!clientUser) {
        setError("Client not found")
        setIsSubmitting(false)
        return
      }

      // Create transaction
      createTransaction({
        userId: clientUser.id,
        amount: amount,
        type: formData.transactionType as 'deposit' | 'withdrawal' | 'transfer',
        description: formData.notes || `${formData.transactionType} transaction`,
        date: new Date().toISOString().split('T')[0],
        status: 'completed',
        from: formData.transactionType === 'withdrawal' ? clientUser.email : null,
        to: formData.transactionType === 'deposit' ? clientUser.email : null
      })

      setSuccess(true)
      
      // Reset form after 2 seconds
      setTimeout(() => {
        setFormData({
          amount: "",
          clientEmail: "",
          transactionType: "",
          notes: "",
        })
        setSuccess(false)
      }, 2000)
    } catch (err: any) {
      setError(err.message || "Failed to create transaction")
    } finally {
      setIsSubmitting(false)
    }
  }

  const commission = formData.amount ? (parseFloat(formData.amount) * 0.005).toFixed(2) : "0.00"

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

                {/* Client Selection */}
                <div className="space-y-2">
                  <Label htmlFor="clientEmail">Select Client <span className="text-red-500">*</span></Label>
                  <Select
                    value={formData.clientEmail}
                    onValueChange={(value) => setFormData({ ...formData, clientEmail: value })}
                  >
                    <SelectTrigger id="clientEmail">
                      <SelectValue placeholder="Select a client" />
                    </SelectTrigger>
                    <SelectContent>
                      {clients.map((client) => (
                        <SelectItem key={client.id} value={client.email}>
                          {client.name} ({client.email})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Notes */}
                <div className="space-y-2">
                  <Label htmlFor="notes">Description/Notes</Label>
                  <Textarea
                    id="notes"
                    placeholder="Add transaction description or notes..."
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  />
                </div>

                {error && (
                  <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">
                    {error}
                  </div>
                )}

                {success && (
                  <div className="rounded-lg bg-green-50 p-3 text-sm text-green-600 dark:bg-green-900/20 dark:text-green-400 flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4" />
                    Transaction recorded successfully!
                  </div>
                )}

                <Separator />

                {/* Submit Button */}
                <Button type="submit" className="w-full" size="lg" disabled={isSubmitting || success}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : success ? (
                    <>
                      <CheckCircle2 className="mr-2 h-4 w-4" />
                      Transaction Saved!
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
                  <span className="font-medium">0.5%</span>
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
                  {formData.clientEmail ? (
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

