import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1'

export const api = axios.create({
  baseURL: API_URL,
})

export interface Transaction {
  id: number
  user_id: number
  amount: number
  type: 'income' | 'expense'
  category_id?: number
  category_name?: string
  category_icon?: string
  category_color?: string
  description?: string
  transaction_date: string
  source: string
  created_at: string
  updated_at: string
}

export interface Category {
  id: number
  user_id: number
  name: string
  type: 'income' | 'expense'
  icon?: string
  color?: string
  is_default: boolean
  created_at: string
}

export interface Summary {
  total_income: number
  total_expense: number
  net: number
  debt_balance: number
  transaction_count: number
  previous_income?: number
  previous_expense?: number
  previous_net?: number
  income_change?: number
  expense_change?: number
}

export interface CategorySummary {
  category: string
  icon?: string
  color?: string
  total: number
  count: number
}

export interface Trend {
  date: string
  income: number
  expense: number
}

export interface Forecast {
  forecast: Array<{
    date: string
    predicted_balance: number
    predicted_income: number
    predicted_expense: number
  }>
  warnings: string[]
  avg_daily_income: number
  avg_daily_expense: number
}

// Transactions
export const getTransactions = (telegramId: string, params?: any) =>
  api.get<Transaction[]>('/transactions/', { params: { telegram_id: telegramId, ...params } })

export const createTransaction = (telegramId: string, data: any) =>
  api.post<Transaction>('/transactions/', data, { params: { telegram_id: telegramId } })

export const updateTransaction = (telegramId: string, id: number, data: any) =>
  api.put<Transaction>(`/transactions/${id}`, data, { params: { telegram_id: telegramId } })

export const deleteTransaction = (telegramId: string, id: number) =>
  api.delete(`/transactions/${id}`, { params: { telegram_id: telegramId } })

// Categories
export const getCategories = (telegramId: string, type?: 'income' | 'expense') =>
  api.get<Category[]>('/categories/', { params: { telegram_id: telegramId, type } })

export const createCategory = (telegramId: string, data: any) =>
  api.post<Category>('/categories/', data, { params: { telegram_id: telegramId } })

export const deleteCategory = (telegramId: string, id: number) =>
  api.delete(`/categories/${id}`, { params: { telegram_id: telegramId } })

// Analytics
export const getSummary = (telegramId: string, startDate?: string, endDate?: string) =>
  api.get<Summary>('/analytics/summary', {
    params: { telegram_id: telegramId, start_date: startDate, end_date: endDate },
  })

export const getCategoryBreakdown = (
  telegramId: string,
  type?: 'income' | 'expense',
  startDate?: string,
  endDate?: string
) =>
  api.get<CategorySummary[]>('/analytics/by-category', {
    params: { telegram_id: telegramId, type, start_date: startDate, end_date: endDate },
  })

export const getTrends = (telegramId: string, days: number = 30) =>
  api.get<Trend[]>('/analytics/trends', { params: { telegram_id: telegramId, days } })

export const getForecast = (telegramId: string, days: number = 30) =>
  api.get<Forecast>('/analytics/forecast', { params: { telegram_id: telegramId, days } })

// User
export interface User {
  id: number
  telegram_id: number
  username?: string
  first_name?: string
  last_name?: string
  language?: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export const getUser = (telegramId: string) =>
  api.get<User>(`/users/${telegramId}`)

// Debts
export interface Debt {
  id: number
  user_id: number
  type: 'borrowed' | 'lent'
  amount: number
  paid_amount: number
  remaining_amount: number
  person_name: string
  person_phone?: string
  debt_date: string
  due_date?: string
  paid_date?: string
  status: 'active' | 'paid' | 'partially_paid'
  description?: string
  reminder_enabled: boolean
  last_reminder_date?: string
  created_at: string
  updated_at: string
  payments: DebtPayment[]
}

export interface DebtPayment {
  id: number
  debt_id: number
  amount: number
  payment_date: string
  description?: string
  created_at: string
}

export interface DebtSummary {
  total_borrowed: number
  active_borrowed_count: number
  total_lent: number
  active_lent_count: number
  net_debt: number
  total_debts: number
}

export const getDebts = (telegramId: string, type?: 'borrowed' | 'lent', status?: string) =>
  api.get<Debt[]>('/debts/', { params: { telegram_id: telegramId, type, status } })

export const getDebtSummary = (telegramId: string) =>
  api.get<DebtSummary>('/debts/summary', { params: { telegram_id: telegramId } })

export const createDebt = (telegramId: string, data: any) =>
  api.post<Debt>('/debts/', data, { params: { telegram_id: telegramId } })

export const updateDebt = (telegramId: string, id: number, data: any) =>
  api.put<Debt>(`/debts/${id}`, data, { params: { telegram_id: telegramId } })

export const addDebtPayment = (telegramId: string, debtId: number, data: any) =>
  api.post<Debt>(`/debts/${debtId}/payments`, data, { params: { telegram_id: telegramId } })

export const deleteDebt = (telegramId: string, id: number) =>
  api.delete(`/debts/${id}`, { params: { telegram_id: telegramId } })

export const getOverdueDebts = (telegramId: string) =>
  api.get<Debt[]>('/debts/overdue', { params: { telegram_id: telegramId } })

export const getUpcomingDebts = (telegramId: string, days: number = 7) =>
  api.get<Debt[]>('/debts/upcoming', { params: { telegram_id: telegramId, days } })
