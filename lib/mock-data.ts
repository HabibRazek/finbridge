/**
 * Static mock data for demo purposes (no database)
 */

export interface User {
  id: string
  name: string
  email: string
  role: 'agent' | 'client' | 'admin'
  balance?: number
  phone?: string
  address?: string
}

export interface Transaction {
  id: string
  amount: number
  type: 'deposit' | 'withdrawal' | 'transfer'
  description: string
  date: string
  status: 'completed' | 'pending' | 'failed'
  from?: string
  to?: string
}

export interface Budget {
  id: string
  name: string
  amount: number
  spent: number
  category: string
  period: 'monthly' | 'weekly' | 'yearly'
}

export interface Goal {
  id: string
  name: string
  targetAmount: number
  currentAmount: number
  deadline: string
  category: string
}

export interface Loan {
  id: string
  amount: number
  purpose: string
  status: 'pending' | 'approved' | 'rejected' | 'disbursed'
  applicationDate: string
  interestRate: number
  term: number // months
}

// Mock Users
export const MOCK_USERS: Record<string, User> = {
  agent: {
    id: '1',
    name: 'Ahmed Ben Salem',
    email: 'agent@bankify.tn',
    role: 'agent',
    phone: '+216 98 765 432',
    address: 'Tunis, Tunisia'
  },
  client: {
    id: '2',
    name: 'Fatima Mansour',
    email: 'client@bankify.tn',
    role: 'client',
    balance: 15750.500,
    phone: '+216 22 123 456',
    address: 'Sfax, Tunisia'
  },
  admin: {
    id: '3',
    name: 'Mohamed Trabelsi',
    email: 'admin@bankify.tn',
    role: 'admin',
    phone: '+216 55 987 654',
    address: 'Sousse, Tunisia'
  }
}

// Mock Transactions
export const MOCK_TRANSACTIONS: Transaction[] = [
  {
    id: 'tx1',
    amount: 500.000,
    type: 'deposit',
    description: 'Salary deposit',
    date: '2024-12-10',
    status: 'completed',
    to: 'client@bankify.tn'
  },
  {
    id: 'tx2',
    amount: 150.500,
    type: 'withdrawal',
    description: 'ATM withdrawal',
    date: '2024-12-09',
    status: 'completed',
    from: 'client@bankify.tn'
  },
  {
    id: 'tx3',
    amount: 75.250,
    type: 'transfer',
    description: 'Utility payment',
    date: '2024-12-08',
    status: 'completed',
    from: 'client@bankify.tn',
    to: 'STEG'
  },
  {
    id: 'tx4',
    amount: 1200.000,
    type: 'deposit',
    description: 'Freelance payment',
    date: '2024-12-05',
    status: 'completed',
    to: 'client@bankify.tn'
  },
  {
    id: 'tx5',
    amount: 300.000,
    type: 'withdrawal',
    description: 'Shopping',
    date: '2024-12-03',
    status: 'completed',
    from: 'client@bankify.tn'
  }
]

// Mock Budgets
export const MOCK_BUDGETS: Budget[] = [
  {
    id: 'b1',
    name: 'Groceries',
    amount: 800.000,
    spent: 450.500,
    category: 'Food',
    period: 'monthly'
  },
  {
    id: 'b2',
    name: 'Transportation',
    amount: 300.000,
    spent: 180.000,
    category: 'Transport',
    period: 'monthly'
  },
  {
    id: 'b3',
    name: 'Entertainment',
    amount: 200.000,
    spent: 125.750,
    category: 'Leisure',
    period: 'monthly'
  },
  {
    id: 'b4',
    name: 'Utilities',
    amount: 400.000,
    spent: 350.000,
    category: 'Bills',
    period: 'monthly'
  }
]

// Mock Goals
export const MOCK_GOALS: Goal[] = [
  {
    id: 'g1',
    name: 'Emergency Fund',
    targetAmount: 10000.000,
    currentAmount: 6500.000,
    deadline: '2025-06-30',
    category: 'Savings'
  },
  {
    id: 'g2',
    name: 'New Car',
    targetAmount: 25000.000,
    currentAmount: 8750.000,
    deadline: '2025-12-31',
    category: 'Purchase'
  },
  {
    id: 'g3',
    name: 'Vacation',
    targetAmount: 5000.000,
    currentAmount: 3200.000,
    deadline: '2025-08-15',
    category: 'Travel'
  }
]

// Mock Loans
export const MOCK_LOANS: Loan[] = [
  {
    id: 'l1',
    amount: 15000.000,
    purpose: 'Small Business',
    status: 'approved',
    applicationDate: '2024-11-15',
    interestRate: 7.5,
    term: 36
  },
  {
    id: 'l2',
    amount: 8000.000,
    purpose: 'Home Improvement',
    status: 'pending',
    applicationDate: '2024-12-01',
    interestRate: 6.8,
    term: 24
  }
]

// Commission data for agents
export const MOCK_COMMISSIONS = [
  { month: 'Jan', amount: 450.000 },
  { month: 'Feb', amount: 520.000 },
  { month: 'Mar', amount: 680.000 },
  { month: 'Apr', amount: 590.000 },
  { month: 'May', amount: 720.000 },
  { month: 'Jun', amount: 850.000 },
  { month: 'Jul', amount: 920.000 },
  { month: 'Aug', amount: 780.000 },
  { month: 'Sep', amount: 890.000 },
  { month: 'Oct', amount: 950.000 },
  { month: 'Nov', amount: 1100.000 },
  { month: 'Dec', amount: 1250.000 }
]

