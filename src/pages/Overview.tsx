import { useQuery } from '@tanstack/react-query'
import { useAuthStore } from '@/store/authStore'
import { getSummary, getTransactions, getCategoryBreakdown, getTrends, getDebtSummary, getForecastWarnings } from '@/lib/api'
import { formatCurrency, formatDate } from '@/lib/utils'
import { DollarSign, Receipt, ArrowUpRight, ArrowDownRight, TrendingUp, AlertTriangle } from 'lucide-react'
import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import AddTransactionDialog from '@/components/AddTransactionDialog'
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts'

export default function Overview() {
  const { telegramId } = useAuthStore()
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)

  const { data: summary, isLoading: summaryLoading } = useQuery({
    queryKey: ['summary', telegramId],
    queryFn: () => getSummary(telegramId!).then((res) => res.data),
    enabled: !!telegramId,
  })

  const { data: debtSummary } = useQuery({
    queryKey: ['debt-summary', telegramId],
    queryFn: () => getDebtSummary(telegramId!).then((res) => res.data),
    enabled: !!telegramId,
  })

  const { data: recentTransactions } = useQuery({
    queryKey: ['transactions', telegramId, 'recent'],
    queryFn: () => getTransactions(telegramId!, { limit: 5 }).then((res) => res.data),
    enabled: !!telegramId,
  })

  const { data: topExpenses } = useQuery({
    queryKey: ['category-breakdown', telegramId, 'expense'],
    queryFn: () =>
      getCategoryBreakdown(telegramId!, 'expense').then((res) => res.data),
    enabled: !!telegramId,
  })

  // Get trends for financial freedom chart
  const { data: trends } = useQuery({
    queryKey: ['trends', telegramId, 30],
    queryFn: () => getTrends(telegramId!, 30).then((res) => res.data),
    enabled: !!telegramId,
  })

  // Get forecast warnings
  const { data: forecastWarnings } = useQuery({
    queryKey: ['forecast-warnings', telegramId],
    queryFn: () => getForecastWarnings(telegramId!, 30).then((res) => res.data),
    enabled: !!telegramId,
  })

  // Calculate cumulative balance (financial freedom)
  const financialFreedomData = useMemo(() => {
    if (!trends) return []
    
    let cumulativeBalance = 0
    return trends.map((trend) => {
      cumulativeBalance += trend.income - trend.expense
      return {
        date: trend.date,
        balance: cumulativeBalance,
        income: trend.income,
        expense: trend.expense,
      }
    })
  }, [trends])

  if (summaryLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  const hasData = summary && summary.transaction_count > 0

  return (
    <div className="space-y-6">
      {!hasData ? (
        /* Empty State */
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Receipt className="w-8 h-8 text-gray-400" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Tranzaksiya yo'q
          </h2>
          <p className="text-gray-500 mb-6 max-w-md mx-auto">
            Birinchi tranzaksiyangizni qo'shing. Telegram bot orqali ovozli xabar yuboring.
          </p>
        </div>
      ) : (
        <>
          {/* Forecast Warnings */}
          {forecastWarnings && forecastWarnings.warnings && forecastWarnings.warnings.length > 0 && (
            <Link to="/forecasting">
              <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 hover:shadow-md transition-shadow cursor-pointer">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-orange-600 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-orange-900">⚠️ Moliyaviy ogohlantirishlar</h3>
                      <span className="text-xs text-orange-600 bg-orange-100 px-2 py-1 rounded-full">
                        {forecastWarnings.warnings.length} ta
                      </span>
                    </div>
                    <ul className="space-y-1">
                      {forecastWarnings.warnings.slice(0, 2).map((warning, index) => (
                        <li key={index} className="text-sm text-orange-800">{warning.title}</li>
                      ))}
                    </ul>
                    <p className="text-xs text-orange-600 mt-2 font-medium">
                      Batafsil prognoz uchun bosing →
                    </p>
                  </div>
                </div>
              </div>
            </Link>
          )}

          {/* Financial Freedom Chart */}
          {financialFreedomData.length > 0 && (
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-blue-600" />
                  <h2 className="text-lg font-semibold text-gray-900">Moliyaviy Erkinlik</h2>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">Joriy balans</p>
                  <p className={`text-xl font-bold ${
                    financialFreedomData[financialFreedomData.length - 1]?.balance >= 0 
                      ? 'text-green-600' 
                      : 'text-red-600'
                  }`}>
                    {formatCurrency(financialFreedomData[financialFreedomData.length - 1]?.balance || 0)}
                  </p>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={financialFreedomData}>
                  <defs>
                    <linearGradient id="balanceGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="date" 
                    tick={{ fontSize: 11 }}
                    stroke="#9ca3af"
                  />
                  <YAxis 
                    tick={{ fontSize: 11 }}
                    stroke="#9ca3af"
                  />
                  <Tooltip 
                    formatter={(value: number) => formatCurrency(value)}
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      fontSize: '12px'
                    }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="balance" 
                    stroke="#3b82f6" 
                    strokeWidth={2}
                    fill="url(#balanceGradient)"
                    name="Balans"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Income */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-green-50 rounded-lg">
                    <ArrowUpRight className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Kirim</p>
                    <p className="text-2xl font-bold text-gray-900 mt-0.5">
                      {formatCurrency(summary.total_income)}
                    </p>
                  </div>
                </div>
              </div>
              {summary.income_change !== undefined && (
                <div className="flex items-center gap-1 text-sm">
                  <span
                    className={`font-medium ${
                      summary.income_change >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}
                  >
                    {summary.income_change >= 0 ? '+' : ''}
                    {summary.income_change.toFixed(1)}%
                  </span>
                  <span className="text-gray-500">oldingi davr</span>
                </div>
              )}
            </div>

            {/* Expense */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-red-50 rounded-lg">
                    <ArrowDownRight className="w-5 h-5 text-red-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Chiqim</p>
                    <p className="text-2xl font-bold text-gray-900 mt-0.5">
                      {formatCurrency(summary.total_expense)}
                    </p>
                  </div>
                </div>
              </div>
              {summary.expense_change !== undefined && (
                <div className="flex items-center gap-1 text-sm">
                  <span
                    className={`font-medium ${
                      summary.expense_change <= 0 ? 'text-green-600' : 'text-red-600'
                    }`}
                  >
                    {summary.expense_change >= 0 ? '+' : ''}
                    {summary.expense_change.toFixed(1)}%
                  </span>
                  <span className="text-gray-500">oldingi davr</span>
                </div>
              )}
            </div>

            {/* Debt Balance */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-orange-50 rounded-lg">
                    <span className="text-xl">🤝</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Qarz</p>
                    <p
                      className={`text-2xl font-bold mt-0.5 ${
                        debtSummary && debtSummary.net_debt > 0 
                          ? 'text-red-600' 
                          : debtSummary && debtSummary.net_debt < 0 
                          ? 'text-green-600' 
                          : 'text-gray-900'
                      }`}
                    >
                      {debtSummary ? formatCurrency(Math.abs(debtSummary.net_debt)) : formatCurrency(0)}
                    </p>
                  </div>
                </div>
              </div>
              <div className="text-sm text-gray-500">
                {debtSummary && debtSummary.net_debt > 0 
                  ? 'Men qarzdorman' 
                  : debtSummary && debtSummary.net_debt < 0 
                  ? 'Menga qarzdor' 
                  : 'Qarz yo\'q'}
              </div>
            </div>

            {/* Net */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-blue-50 rounded-lg">
                    <DollarSign className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Sof foyda</p>
                    <p
                      className={`text-2xl font-bold mt-0.5 ${
                        summary.net >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}
                    >
                      {formatCurrency(summary.net)}
                    </p>
                  </div>
                </div>
              </div>
              <div className="text-sm text-gray-500">
                {summary.transaction_count} tranzaksiya
              </div>
            </div>
          </div>

          {/* Recent Transactions & Top Expenses */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Transactions */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100">
                <h2 className="text-lg font-semibold text-gray-900">
                  Oxirgi tranzaksiyalar
                </h2>
              </div>
              <div className="p-6">
                {recentTransactions && recentTransactions.length > 0 ? (
                  <div className="space-y-3">
                    {recentTransactions.map((transaction) => (
                      <div
                        key={transaction.id}
                        className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className="w-10 h-10 rounded-lg flex items-center justify-center text-lg"
                            style={{ backgroundColor: transaction.category_color + '15' }}
                          >
                            {transaction.category_icon || '💰'}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900 text-sm">
                              {transaction.category_name || 'Boshqa'}
                            </p>
                            <p className="text-xs text-gray-500">
                              {formatDate(transaction.transaction_date)}
                            </p>
                          </div>
                        </div>
                        <span
                          className={`font-semibold text-sm ${
                            transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                          }`}
                        >
                          {transaction.type === 'income' ? '+' : '-'}
                          {formatCurrency(transaction.amount)}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-8 text-sm">Tranzaksiya yo'q</p>
                )}
              </div>
            </div>

            {/* Top Expenses */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100">
                <h2 className="text-lg font-semibold text-gray-900">
                  Eng ko'p xarajatlar
                </h2>
              </div>
              <div className="p-6">
                {topExpenses && topExpenses.length > 0 ? (
                  <div className="space-y-4">
                    {topExpenses.slice(0, 5).map((item, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-lg">{item.icon || '💸'}</span>
                            <span className="font-medium text-gray-900 text-sm">{item.category}</span>
                          </div>
                          <span className="font-semibold text-gray-900 text-sm">
                            {formatCurrency(item.total)}
                          </span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-1.5">
                          <div
                            className="h-1.5 rounded-full transition-all"
                            style={{
                              width: `${(item.total / summary.total_expense) * 100}%`,
                              backgroundColor: item.color || '#3b82f6',
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-8 text-sm">Ma'lumot yo'q</p>
                )}
              </div>
            </div>
          </div>
        </>
      )}

      <AddTransactionDialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen} />
    </div>
  )
}
