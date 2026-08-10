import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('uz-UZ', {
    style: 'decimal',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount) + ' so\'m'
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat('uz-UZ', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(date))
}

export function formatDateTime(date: string | Date): string {
  return new Intl.DateTimeFormat('uz-UZ', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date))
}

export const UZ_MONTHS_SHORT = [
  'Yan', 'Fev', 'Mar', 'Apr', 'May', 'Iyun',
  'Iyul', 'Avg', 'Sen', 'Okt', 'Noy', 'Dek'
]

/**
 * Ensures monthly dataset spans all 12 months for year charts,
 * filling missing months with 0 so the line chart doesn't look awkward with only 1 month.
 */
export function fillMissing12Months(
  monthlyMap?: Record<string, { income: number; expense: number; count?: number }>
): Array<{ month: string; income: number; expense: number; net: number }> {
  const currentYear = new Date().getFullYear()

  return UZ_MONTHS_SHORT.map((monthName, idx) => {
    const monthNumStr = String(idx + 1).padStart(2, '0')
    const keyWithYear = `${currentYear}-${monthNumStr}`

    let foundData = monthlyMap ? (monthlyMap[keyWithYear] || monthlyMap[monthNumStr] || monthlyMap[monthName]) : undefined

    if (!foundData && monthlyMap) {
      const matchingKey = Object.keys(monthlyMap).find(k => k.includes(`-${monthNumStr}`) || k.includes(monthName))
      if (matchingKey) {
        foundData = monthlyMap[matchingKey]
      }
    }

    const income = foundData?.income || 0
    const expense = foundData?.expense || 0

    return {
      month: monthName,
      income,
      expense,
      net: income - expense,
    }
  })
}

/**
 * Ensures daily trend dataset spans full timeline (e.g. 30 days),
 * filling missing days with 0 and applying a smooth Gaussian interpolation pass
 * so single-day surges curve and bend gracefully instead of forming stiff vertical spikes.
 */
export function fillDailyTrendTimeline(
  trends?: Array<{ date: string; income: number; expense: number }>,
  daysCount = 30,
  smooth = true
): Array<{ date: string; date_display: string; income: number; expense: number; balance: number }> {
  const raw: Array<{ date: string; date_display: string; income: number; expense: number; balance: number }> = []

  const trendMap = new Map<string, { income: number; expense: number }>()
  if (trends) {
    trends.forEach((t) => {
      const dateStr = t.date ? t.date.split('T')[0] : ''
      if (dateStr) {
        trendMap.set(dateStr, { income: t.income || 0, expense: t.expense || 0 })
      }
    })
  }

  const today = new Date()
  let cumulativeBalance = 0

  for (let i = daysCount - 1; i >= 0; i--) {
    const d = new Date(today)
    d.setDate(d.getDate() - i)

    const year = d.getFullYear()
    const month = String(d.getMonth() + 1).padStart(2, '0')
    const day = String(d.getDate()).padStart(2, '0')
    const isoDate = `${year}-${month}-${day}`
    const dateDisplay = `${day}.${month}`

    const existing = trendMap.get(isoDate)
    const income = existing ? existing.income : 0
    const expense = existing ? existing.expense : 0
    cumulativeBalance += income - expense

    raw.push({
      date: isoDate,
      date_display: dateDisplay,
      income,
      expense,
      balance: cumulativeBalance,
    })
  }

  if (!smooth || raw.length < 3) return raw

  // 3-point Gaussian-weighted smoothing pass for organic, gradual curve bending on surges
  return raw.map((item, idx) => {
    const prev = raw[idx - 1] || item
    const next = raw[idx + 1] || item

    const smoothedIncome = Math.round(item.income * 0.5 + (prev.income + next.income) * 0.25)
    const smoothedExpense = Math.round(item.expense * 0.5 + (prev.expense + next.expense) * 0.25)
    const smoothedBalance = Math.round(item.balance * 0.5 + (prev.balance + next.balance) * 0.25)

    return {
      ...item,
      income: smoothedIncome,
      expense: smoothedExpense,
      balance: smoothedBalance,
    }
  })
}
