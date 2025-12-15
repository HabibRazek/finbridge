/**
 * JSON Storage System for Bankify
 * Uses localStorage to simulate JSON file storage
 * All data is stored in a single JSON structure
 */

import { initialData } from "./initial-data"

export interface User {
  id: string
  name: string
  email: string
  password: string
  role: 'agent' | 'client' | 'admin'
  phone?: string
  address?: string
  balance?: number
  dateOfBirth?: string
  gender?: string
  occupation?: string
  createdAt: string
}

export interface Transaction {
  id: string
  userId: string
  amount: number
  type: 'deposit' | 'withdrawal' | 'transfer'
  description: string
  date: string
  status: 'completed' | 'pending' | 'failed'
  from?: string | null
  to?: string | null
  createdAt: string
}

export interface Budget {
  id: string
  userId: string
  name: string
  amount: number
  spent: number
  category: string
  period: 'monthly' | 'weekly' | 'yearly'
  createdAt: string
}

export interface Goal {
  id: string
  userId: string
  name: string
  targetAmount: number
  currentAmount: number
  deadline: string
  category: string
  createdAt: string
}

export interface Loan {
  id: string
  userId: string
  amount: number
  purpose: string
  status: 'pending' | 'approved' | 'rejected' | 'disbursed'
  applicationDate: string
  interestRate: number
  term: number
  createdAt: string
}

export interface Commission {
  id: string
  agentId: string
  month: string
  amount: number
  year: number
}

export interface BankifyData {
  users: User[]
  transactions: Transaction[]
  budgets: Budget[]
  goals: Goal[]
  loans: Loan[]
  commissions: Commission[]
}

const STORAGE_KEY = "bankify_json_data"

/**
 * Initialize storage with default data if empty
 */
function initializeStorage(): BankifyData {
  if (typeof window === "undefined") {
    return initialData as BankifyData
  }

  const stored = localStorage.getItem(STORAGE_KEY)
  if (!stored) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initialData))
    return initialData as BankifyData
  }

  try {
    return JSON.parse(stored) as BankifyData
  } catch (error) {
    console.error("Failed to parse stored data, resetting to initial data:", error)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initialData))
    return initialData as BankifyData
  }
}

/**
 * Get all data from storage
 */
export function getData(): BankifyData {
  return initializeStorage()
}

/**
 * Save data to storage
 */
function saveData(data: BankifyData): void {
  if (typeof window === "undefined") return
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

/**
 * Export data as JSON string (for backup/download)
 */
export function exportData(): string {
  return JSON.stringify(getData(), null, 2)
}

/**
 * Import data from JSON string
 */
export function importData(jsonString: string): boolean {
  try {
    const data = JSON.parse(jsonString) as BankifyData
    saveData(data)
    return true
  } catch (error) {
    console.error("Failed to import data:", error)
    return false
  }
}

// ==================== USER OPERATIONS ====================

export function getAllUsers(): User[] {
  return getData().users
}

export function getUserById(id: string): User | undefined {
  return getData().users.find(u => u.id === id)
}

export function getUserByEmail(email: string): User | undefined {
  return getData().users.find(u => u.email.toLowerCase() === email.toLowerCase())
}

export function createUser(userData: Omit<User, 'id' | 'createdAt'>): User {
  const data = getData()
  const newUser: User = {
    ...userData,
    id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    createdAt: new Date().toISOString(),
    balance: userData.balance || 0
  }
  data.users.push(newUser)
  saveData(data)
  return newUser
}

export function updateUser(id: string, updates: Partial<User>): User | null {
  const data = getData()
  const userIndex = data.users.findIndex(u => u.id === id)
  if (userIndex === -1) return null

  data.users[userIndex] = { ...data.users[userIndex], ...updates }
  saveData(data)
  return data.users[userIndex]
}

export function deleteUser(id: string): boolean {
  const data = getData()
  const initialLength = data.users.length
  data.users = data.users.filter(u => u.id !== id)
  
  // Also delete related data
  data.transactions = data.transactions.filter(t => t.userId !== id)
  data.budgets = data.budgets.filter(b => b.userId !== id)
  data.goals = data.goals.filter(g => g.userId !== id)
  data.loans = data.loans.filter(l => l.userId !== id)
  
  saveData(data)
  return data.users.length < initialLength
}

// ==================== TRANSACTION OPERATIONS ====================

export function getTransactions(userId?: string): Transaction[] {
  const data = getData()
  if (userId) {
    return data.transactions.filter(t => t.userId === userId)
  }
  return data.transactions
}

export function getTransactionById(id: string): Transaction | undefined {
  return getData().transactions.find(t => t.id === id)
}

export function createTransaction(transactionData: Omit<Transaction, 'id' | 'createdAt'>): Transaction {
  const data = getData()
  const newTransaction: Transaction = {
    ...transactionData,
    id: `tx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    createdAt: new Date().toISOString()
  }
  data.transactions.push(newTransaction)
  
  // Update user balance if transaction is completed
  if (newTransaction.status === 'completed') {
    const user = data.users.find(u => u.id === newTransaction.userId)
    if (user) {
      if (newTransaction.type === 'deposit') {
        user.balance = (user.balance || 0) + newTransaction.amount
      } else if (newTransaction.type === 'withdrawal') {
        user.balance = (user.balance || 0) - newTransaction.amount
      }
    }
  }
  
  saveData(data)
  return newTransaction
}

export function updateTransaction(id: string, updates: Partial<Transaction>): Transaction | null {
  const data = getData()
  const transactionIndex = data.transactions.findIndex(t => t.id === id)
  if (transactionIndex === -1) return null

  data.transactions[transactionIndex] = { ...data.transactions[transactionIndex], ...updates }
  saveData(data)
  return data.transactions[transactionIndex]
}

export function deleteTransaction(id: string): boolean {
  const data = getData()
  const initialLength = data.transactions.length
  data.transactions = data.transactions.filter(t => t.id !== id)
  saveData(data)
  return data.transactions.length < initialLength
}

// ==================== BUDGET OPERATIONS ====================

export function getBudgets(userId: string): Budget[] {
  return getData().budgets.filter(b => b.userId === userId)
}

export function getBudgetById(id: string): Budget | undefined {
  return getData().budgets.find(b => b.id === id)
}

export function createBudget(budgetData: Omit<Budget, 'id' | 'createdAt'>): Budget {
  const data = getData()
  const newBudget: Budget = {
    ...budgetData,
    id: `budget_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    createdAt: new Date().toISOString()
  }
  data.budgets.push(newBudget)
  saveData(data)
  return newBudget
}

export function updateBudget(id: string, updates: Partial<Budget>): Budget | null {
  const data = getData()
  const budgetIndex = data.budgets.findIndex(b => b.id === id)
  if (budgetIndex === -1) return null

  data.budgets[budgetIndex] = { ...data.budgets[budgetIndex], ...updates }
  saveData(data)
  return data.budgets[budgetIndex]
}

export function deleteBudget(id: string): boolean {
  const data = getData()
  const initialLength = data.budgets.length
  data.budgets = data.budgets.filter(b => b.id !== id)
  saveData(data)
  return data.budgets.length < initialLength
}

// ==================== GOAL OPERATIONS ====================

export function getGoals(userId: string): Goal[] {
  return getData().goals.filter(g => g.userId === userId)
}

export function getGoalById(id: string): Goal | undefined {
  return getData().goals.find(g => g.id === id)
}

export function createGoal(goalData: Omit<Goal, 'id' | 'createdAt'>): Goal {
  const data = getData()
  const newGoal: Goal = {
    ...goalData,
    id: `goal_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    createdAt: new Date().toISOString()
  }
  data.goals.push(newGoal)
  saveData(data)
  return newGoal
}

export function updateGoal(id: string, updates: Partial<Goal>): Goal | null {
  const data = getData()
  const goalIndex = data.goals.findIndex(g => g.id === id)
  if (goalIndex === -1) return null

  data.goals[goalIndex] = { ...data.goals[goalIndex], ...updates }
  saveData(data)
  return data.goals[goalIndex]
}

export function deleteGoal(id: string): boolean {
  const data = getData()
  const initialLength = data.goals.length
  data.goals = data.goals.filter(g => g.id !== id)
  saveData(data)
  return data.goals.length < initialLength
}

// ==================== LOAN OPERATIONS ====================

export function getLoans(userId?: string): Loan[] {
  const data = getData()
  if (userId) {
    return data.loans.filter(l => l.userId === userId)
  }
  return data.loans
}

export function getLoanById(id: string): Loan | undefined {
  return getData().loans.find(l => l.id === id)
}

export function createLoan(loanData: Omit<Loan, 'id' | 'createdAt'>): Loan {
  const data = getData()
  const newLoan: Loan = {
    ...loanData,
    id: `loan_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    createdAt: new Date().toISOString()
  }
  data.loans.push(newLoan)
  saveData(data)
  return newLoan
}

export function updateLoan(id: string, updates: Partial<Loan>): Loan | null {
  const data = getData()
  const loanIndex = data.loans.findIndex(l => l.id === id)
  if (loanIndex === -1) return null

  data.loans[loanIndex] = { ...data.loans[loanIndex], ...updates }
  saveData(data)
  return data.loans[loanIndex]
}

export function deleteLoan(id: string): boolean {
  const data = getData()
  const initialLength = data.loans.length
  data.loans = data.loans.filter(l => l.id !== id)
  saveData(data)
  return data.loans.length < initialLength
}

// ==================== COMMISSION OPERATIONS ====================

export function getCommissions(agentId: string, year?: number): Commission[] {
  const data = getData()
  let commissions = data.commissions.filter(c => c.agentId === agentId)
  if (year) {
    commissions = commissions.filter(c => c.year === year)
  }
  return commissions
}

export function createCommission(commissionData: Omit<Commission, 'id'>): Commission {
  const data = getData()
  const newCommission: Commission = {
    ...commissionData,
    id: `comm_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }
  data.commissions.push(newCommission)
  saveData(data)
  return newCommission
}

// ==================== VERIFICATION ====================

export function verifyCredentials(email: string, password: string): User | null {
  const user = getUserByEmail(email)
  if (user && user.password === password) {
    return user
  }
  return null
}

