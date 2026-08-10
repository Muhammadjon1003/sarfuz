import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1'

export const api = axios.create({
  baseURL: API_URL,
  timeout: 30000, // 30s timeout for cold start resiliency
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

export interface DetailedForecast {
  success: boolean
  message?: string
  forecast: DailyForecast[]
  patterns: ForecastPatterns
  recurring_transactions: RecurringTransaction[]
  trends: ForecastTrends
  warnings: ForecastWarning[]
  summary: ForecastSummary
  current_balance: number
  forecast_period: {
    start: string
    end: string
    days: number
  }
}

export interface DailyForecast {
  date: string
  date_display: string
  weekday: string
  predicted_income: number
  predicted_expense: number
  predicted_net: number
  predicted_balance: number
  confidence: number
  has_recurring: boolean
}

export interface ForecastPatterns {
  avg_daily_income: number
  avg_daily_expense: number
  avg_weekly_income: number
  avg_weekly_expense: number
  avg_monthly_income: number
  avg_monthly_expense: number
  weekday_income_pattern: number[]
  weekday_expense_pattern: number[]
  top_income_categories: CategoryPattern[]
  top_expense_categories: CategoryPattern[]
  total_income: number
  total_expense: number
  net: number
}

export interface CategoryPattern {
  category: string
  amount: number
  percentage: number
}

export interface RecurringTransaction {
  type: string
  category: string
  avg_amount: number
  pattern: string
  frequency_days: number
  occurrences: number
  confidence: number
}

export interface ForecastTrends {
  income_trend: number
  expense_trend: number
  income_direction: string
  expense_direction: string
  spending_velocity: number
  velocity_change: number
}

export interface ForecastWarning {
  type: string
  severity: string
  title: string
  message: string
  amount?: number
  date?: string
  threshold?: number
  trend?: number
  velocity?: number
  balance?: number
}

export interface ForecastSummary {
  total_predicted_income: number
  total_predicted_expense: number
  total_predicted_net: number
  avg_daily_income: number
  avg_daily_expense: number
  avg_confidence: number
  min_balance: number
  max_balance: number
  balance_volatility: number
  days_profitable: number
  days_loss: number
  profit_ratio: number
  starting_balance: number
  ending_balance: number
  balance_change: number
}

export interface SpendingInsights {
  success: boolean
  message?: string
  insights: string[]
  recommendations: string[]
  patterns: ForecastPatterns
  trends: ForecastTrends
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

export const getDetailedForecast = (telegramId: string, forecastDays: number = 30, historicalDays: number = 90) =>
  api.get<DetailedForecast>('/forecast/', {
    params: { telegram_id: telegramId, forecast_days: forecastDays, historical_days: historicalDays }
  })

export const getSpendingInsights = (telegramId: string, days: number = 30) =>
  api.get<SpendingInsights>('/forecast/insights', { params: { telegram_id: telegramId, days } })

export const getForecastWarnings = (telegramId: string, forecastDays: number = 30) =>
  api.get<{ warnings: ForecastWarning[]; summary: ForecastSummary }>('/forecast/warnings', {
    params: { telegram_id: telegramId, forecast_days: forecastDays }
  })

// User
export interface User {
  id: number
  telegram_id: number
  username?: string
  first_name?: string
  last_name?: string
  photo_url?: string
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


// Advanced Forecasting
export interface SeasonalPattern {
  success: boolean
  monthly_data: Record<string, { income: number; expense: number; count: number }>
  avg_monthly_income: number
  avg_monthly_expense: number
  peak_income_months: string[]
  peak_expense_months: string[]
  insights: string[]
}

export interface CategoryForecast {
  category: string
  type: string
  predicted_total: number
  avg_amount: number
  expected_frequency: number
  historical_count: number
}

export interface CategoryForecastResponse {
  success: boolean
  forecasts: CategoryForecast[]
  top_income_categories: CategoryForecast[]
  top_expense_categories: CategoryForecast[]
}

export interface ScenarioSimulation {
  success: boolean
  scenario_type: string
  scenario_description: string
  base_ending_balance: number
  modified_ending_balance: number
  balance_difference: number
  modified_forecast: DailyForecast[]
  modified_summary: any
  recommendation: string
}

export interface Anomaly {
  date: string
  amount: number
  category: string
  type: string
  deviation: number
}

export interface AnomalyDetection {
  success: boolean
  anomalies: Anomaly[]
  count: number
  mean_amount: number
  threshold: number
  insights: string[]
}

export interface BudgetRecommendation {
  success: boolean
  monthly_income: number
  current_monthly_expense: number
  savings_rate: number
  recommended_budgets: {
    essentials: number
    lifestyle: number
    savings: number
  }
  category_budgets: Array<{
    category: string
    current: number
    percentage: number
    recommended: number
    savings_potential: number
  }>
  recommendations: string[]
}

export const getSeasonalPatterns = (telegramId: string, months: number = 6) =>
  api.get<SeasonalPattern>('/forecast/seasonal-patterns', { 
    params: { telegram_id: telegramId, months } 
  })

export const getCategoryForecast = (telegramId: string, days: number = 30) =>
  api.get<CategoryForecastResponse>('/forecast/category-forecast', { 
    params: { telegram_id: telegramId, days } 
  })

export const simulateScenario = (telegramId: string, scenario: any, forecastDays: number = 30) =>
  api.post<ScenarioSimulation>(`/forecast/simulate`, scenario, { 
    params: { telegram_id: telegramId, forecast_days: forecastDays } 
  })

export const detectAnomalies = (telegramId: string, days: number = 30) =>
  api.get<AnomalyDetection>('/forecast/anomalies', { 
    params: { telegram_id: telegramId, days } 
  })

export const getBudgetRecommendations = (telegramId: string) =>
  api.get<BudgetRecommendation>('/forecast/budget-recommendations', { 
    params: { telegram_id: telegramId } 
  })
