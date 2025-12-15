"use client"

import { useState } from "react"
import { PageShell, PageHeader } from "@/components/shared/page-shell"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { CheckCircle2, Loader2, AlertCircle } from "lucide-react"

export default function AdminSettingsPage() {
  const [isSaving, setIsSaving] = useState(false)
  const [success, setSuccess] = useState("")
  const [error, setError] = useState("")

  const [settings, setSettings] = useState({
    commissionRate: 0.5,
    minLoanAmount: 1000,
    maxLoanAmount: 100000,
    defaultInterestRate: 5.0,
    enableNotifications: true,
    enableEmailAlerts: true,
    maintenanceMode: false,
    allowNewRegistrations: true
  })

  const handleSave = async () => {
    setIsSaving(true)
    setError("")
    setSuccess("")

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Save to localStorage
      localStorage.setItem("bankify_settings", JSON.stringify(settings))
      
      setSuccess("Settings saved successfully!")
      setTimeout(() => setSuccess(""), 3000)
    } catch (err: any) {
      setError(err.message || "Failed to save settings")
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <PageShell>
      <PageHeader 
        title="System Settings" 
        description="Configure system-wide settings"
        actions={
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <CheckCircle2 className="mr-2 h-4 w-4" />
                Save Settings
              </>
            )}
          </Button>
        }
      />

      {success && (
        <div className="rounded-lg bg-green-50 p-3 text-sm text-green-600 dark:bg-green-900/20 dark:text-green-400 flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4" />
          {success}
        </div>
      )}

      {error && (
        <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400 flex items-center gap-2">
          <AlertCircle className="h-4 w-4" />
          {error}
        </div>
      )}

      <div className="grid gap-6">
        {/* Commission Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Commission Settings</CardTitle>
            <CardDescription>Configure commission rates and calculations</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Default Commission Rate (%)</Label>
              <Input 
                type="number" 
                step="0.1"
                value={settings.commissionRate}
                onChange={(e) => setSettings({ ...settings, commissionRate: parseFloat(e.target.value) })}
              />
              <p className="text-sm text-muted-foreground">Current rate: {settings.commissionRate}%</p>
            </div>
          </CardContent>
        </Card>

        {/* Loan Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Loan Settings</CardTitle>
            <CardDescription>Configure loan parameters</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Minimum Loan Amount (TND)</Label>
                <Input 
                  type="number" 
                  value={settings.minLoanAmount}
                  onChange={(e) => setSettings({ ...settings, minLoanAmount: parseInt(e.target.value) })}
                />
              </div>
              <div className="space-y-2">
                <Label>Maximum Loan Amount (TND)</Label>
                <Input 
                  type="number" 
                  value={settings.maxLoanAmount}
                  onChange={(e) => setSettings({ ...settings, maxLoanAmount: parseInt(e.target.value) })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Default Interest Rate (%)</Label>
              <Input 
                type="number" 
                step="0.1"
                value={settings.defaultInterestRate}
                onChange={(e) => setSettings({ ...settings, defaultInterestRate: parseFloat(e.target.value) })}
              />
            </div>
          </CardContent>
        </Card>

        {/* System Settings */}
        <Card>
          <CardHeader>
            <CardTitle>System Settings</CardTitle>
            <CardDescription>General system configuration</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Maintenance Mode</Label>
                <p className="text-sm text-muted-foreground">
                  Temporarily disable the system for maintenance
                </p>
              </div>
              <Switch 
                checked={settings.maintenanceMode}
                onCheckedChange={(checked) => setSettings({ ...settings, maintenanceMode: checked })}
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Allow New Registrations</Label>
                <p className="text-sm text-muted-foreground">
                  Enable or disable new user registrations
                </p>
              </div>
              <Switch 
                checked={settings.allowNewRegistrations}
                onCheckedChange={(checked) => setSettings({ ...settings, allowNewRegistrations: checked })}
              />
            </div>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Notification Settings</CardTitle>
            <CardDescription>Configure notification preferences</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Enable Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Send system notifications to users
                </p>
              </div>
              <Switch 
                checked={settings.enableNotifications}
                onCheckedChange={(checked) => setSettings({ ...settings, enableNotifications: checked })}
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Enable Email Alerts</Label>
                <p className="text-sm text-muted-foreground">
                  Send email notifications for important events
                </p>
              </div>
              <Switch 
                checked={settings.enableEmailAlerts}
                onCheckedChange={(checked) => setSettings({ ...settings, enableEmailAlerts: checked })}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </PageShell>
  )
}

