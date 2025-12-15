"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
} from "@/components/ui/sidebar"
import {
  LayoutDashboard,
  Receipt,
  DollarSign,
  UserCheck,
  History,
  Wallet,
  PiggyBank,
  Target,
  FileText,
  Clock,
  Upload,
  ClipboardCheck,
  Building2,
  Users,
  Settings,
  Shield,
} from "lucide-react"
import { useAuth } from "@/lib/auth-context"

const agentMenuItems = [
  { title: "Dashboard", url: "/agent", icon: LayoutDashboard },
  { title: "Record Transaction", url: "/agent/transaction", icon: Receipt },
  { title: "Commission", url: "/agent/commission", icon: DollarSign },
  { title: "Client Verification", url: "/agent/verification", icon: UserCheck },
  { title: "User Management", url: "/agent/users", icon: Users },
  { title: "Transaction History", url: "/agent/history", icon: History },
]

const clientMenuItems = [
  { title: "Dashboard", url: "/client", icon: Wallet },
  { title: "Transaction History", url: "/client/history", icon: History },
  { title: "Budget Planner", url: "/client/budget", icon: PiggyBank },
  { title: "Financial Goals", url: "/client/goals", icon: Target },
]

const loanMenuItems = [
  { title: "Apply for Loan", url: "/loan/apply", icon: FileText },
  { title: "Loan Status", url: "/loan/status", icon: Clock },
  { title: "Document Upload", url: "/loan/documents", icon: Upload },
  { title: "Compliance", url: "/loan/compliance", icon: ClipboardCheck },
]

const adminMenuItems = [
  { title: "Dashboard", url: "/admin", icon: LayoutDashboard },
  { title: "User Management", url: "/admin/users", icon: Users },
  { title: "Transactions", url: "/admin/transactions", icon: Receipt },
  { title: "Budgets", url: "/admin/budgets", icon: PiggyBank },
  { title: "Goals", url: "/admin/goals", icon: Target },
  { title: "Loans", url: "/admin/loans", icon: FileText },
  { title: "Commissions", url: "/admin/commissions", icon: DollarSign },
  { title: "Settings", url: "/admin/settings", icon: Settings },
]

export function AppSidebar() {
  const pathname = usePathname()
  const { user } = useAuth()

  // Determine which menu items to show based on user role
  const getMenuSections = () => {
    if (!user) return []

    switch (user.role) {
      case "agent":
        return [
          { label: "Agent Portal", items: agentMenuItems },
          { label: "Loan Management", items: loanMenuItems },
        ]
      case "client":
        return [
          { label: "Client Portal", items: clientMenuItems },
          { label: "Loan Management", items: loanMenuItems },
        ]
      case "admin":
        return [
          { label: "Admin Portal", items: adminMenuItems },
          { label: "Agent Portal", items: agentMenuItems },
          { label: "Client Portal", items: clientMenuItems },
          { label: "Loan Management", items: loanMenuItems },
        ]
      default:
        return []
    }
  }

  const menuSections = getMenuSections()

  return (
    <Sidebar>
      <SidebarHeader className="border-b border-sidebar-border px-6 py-4">
        <Link href="/" className="flex items-center gap-3">
          <Building2 className="h-8 w-8 text-sidebar-primary" />
          <div>
            <h1 className="text-lg font-bold text-sidebar-foreground">Bankify</h1>
            <p className="text-xs text-sidebar-foreground/70">Rural Banking Platform</p>
          </div>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        {menuSections.map((section) => (
          <SidebarGroup key={section.label}>
            <SidebarGroupLabel>{section.label}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {section.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={pathname === item.url}>
                      <Link href={item.url}>
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarFooter className="border-t border-sidebar-border p-4">
        <div className="text-xs text-sidebar-foreground/60">
          © 2024 Bankify
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}

