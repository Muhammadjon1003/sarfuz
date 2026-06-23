import { useQuery } from '@tanstack/react-query'
import { useAuthStore } from '@/store/authStore'
import { 
  getDetailedForecast, 
  getSpendingInsights,
  getBudgetRecommendations,
  detectAnomalies,
  getSeasonalPatterns,
  getCategoryForecast
} from '@/lib/api'
import { formatCurrency } from '@/lib/utils'
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts'
import {
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle2,
  Info,
  DollarSign,
  Zap,
  Target,
} from 'lucide-react'

export default function Forecasting() {
  const { telegramId } = useAuthStore()

  const { data: forecast, isLoading } = useQuery({
    queryKey: ['detailed-forecast', telegramId],
    queryFn: () => getDetailedForecast(telegramId!, 30, 90).then((res) => res.data),
    enabled: !!telegramId,
  })

  const { data: insights } = useQuery({
    queryKey: ['spending-insights', telegramId],
    queryFn: () => getSpendingInsights(telegramId!, 30).then((res) => res.data),
    enabled: !!telegramId,
  })

  // Get advanced features
  const { data: budgetRecs } = useQuery({
    queryKey: ['budget-recommendations', telegramId],
    queryFn: () => getBudgetRecommendations(telegramId!).then((res) => res.data),
    enabled: !!telegramId,
  })

  const { data: anomalies } = useQuery({
    queryKey: ['anomalies', telegramId],
    queryFn: () => detectAnomalies(telegramId!, 30).then((res) => res.data),
    enabled: !!telegramId,
  })

  const { data: seasonalPatterns } = useQuery({
    queryKey: ['seasonal-patterns', telegramId],
    queryFn: () => getSeasonalPatterns(telegramId!, 6).then((res) => res.data),
    enabled: !!telegramId,
  })

  const { data: categoryForecast } = useQuery({
    queryKey: ['category-forecast', telegramId],
    queryFn: () => getCategoryForecast(telegramId!, 30).then((res) => res.data),
    enabled: !!telegramId,
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!forecast || !forecast.success) {
    return (
      <div className="bg-orange-50 border border-orange-200 rounded-xl p-6">
        <div className="flex items-start gap-3">
          <Info className="w-6 h-6 text-orange-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-orange-900 mb-1">Prognoz yaratib bo'lmadi</h3>
            <p className="text-orange-800 text-sm">
              {forecast?.message || 'Prognoz uchun yetarli ma\'lumot yo\'q. Kamida 5 ta tranzaksiya kerak.'}
            </p>
          </div>
        </div>
      </div>
    )
  }

  const { summary, warnings, patterns, trends, recurring_transactions } = forecast

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">🔮 Moliyaviy Prognoz</h1>
          <p className="text-gray-500 text-sm mt-1">AI asosida 30 kunlik balans bashorati</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500">Ishonch darajasi</p>
          <p className="text-2xl font-bold text-blue-600">{summary.avg_confidence.toFixed(0)}%</p>
        </div>
      </div>

      {/* Warnings */}
      {warnings.length > 0 && (
        <div className="space-y-3">
          {warnings.map((warning, index) => (
            <div
              key={index}
              className={`rounded-xl border p-4 ${
                warning.severity === 'critical'
                  ? 'bg-red-50 border-red-200'
                  : warning.severity === 'warning'
                  ? 'bg-orange-50 border-orange-200'
                  : 'bg-blue-50 border-blue-200'
              }`}
            >
              <div className="flex items-start gap-3">
                <AlertTriangle
                  className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                    warning.severity === 'critical'
                      ? 'text-red-600'
                      : warning.severity === 'warning'
                      ? 'text-orange-600'
                      : 'text-blue-600'
                  }`}
                />
                <div className="flex-1">
                  <h3
                    className={`font-semibold mb-1 ${
                      warning.severity === 'critical'
                        ? 'text-red-900'
                        : warning.severity === 'warning'
                        ? 'text-orange-900'
                        : 'text-blue-900'
                    }`}
                  >
                    {warning.title}
                  </h3>
                  <p
                    className={`text-sm ${
                      warning.severity === 'critical'
                        ? 'text-red-800'
                        : warning.severity === 'warning'
                        ? 'text-orange-800'
                        : 'text-blue-800'
                    }`}
                  >
                    {warning.message}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {warnings.length === 0 && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-green-900">✅ Moliyaviy ahvol yaxshi</h3>
              <p className="text-green-800 text-sm">Keyingi 30 kunda xavf aniqlanmadi</p>
            </div>
          </div>
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-2 text-gray-600 text-sm mb-2">
            <DollarSign className="w-4 h-4" />
            <span>Joriy balans</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">
            {formatCurrency(forecast.current_balance)}
          </p>
        </div>

        <div className="bg-blue-50 rounded-xl border border-blue-200 p-4">
          <div className="flex items-center gap-2 text-blue-600 text-sm mb-2">
            <Target className="w-4 h-4" />
            <span>30 kun balans</span>
          </div>
          <p className="text-2xl font-bold text-blue-900">
            {formatCurrency(summary.ending_balance)}
          </p>
          <div className="flex items-center gap-1 mt-1 text-xs">
            {summary.balance_change >= 0 ? (
              <TrendingUp className="w-3 h-3 text-green-600" />
            ) : (
              <TrendingDown className="w-3 h-3 text-red-600" />
            )}
            <span
              className={summary.balance_change >= 0 ? 'text-green-600' : 'text-red-600'}
            >
              {summary.balance_change >= 0 ? '+' : ''}
              {formatCurrency(summary.balance_change)}
            </span>
          </div>
        </div>

        <div className="bg-green-50 rounded-xl border border-green-200 p-4">
          <div className="flex items-center gap-2 text-green-600 text-sm mb-2">
            <TrendingUp className="w-4 h-4" />
            <span>Kutilayotgan kirim</span>
          </div>
          <p className="text-2xl font-bold text-green-900">
            {formatCurrency(summary.total_predicted_income)}
          </p>
          <p className="text-xs text-green-700 mt-1">
            ~{formatCurrency(summary.avg_daily_income)}/kun
          </p>
        </div>

        <div className="bg-red-50 rounded-xl border border-red-200 p-4">
          <div className="flex items-center gap-2 text-red-600 text-sm mb-2">
            <TrendingDown className="w-4 h-4" />
            <span>Kutilayotgan chiqim</span>
          </div>
          <p className="text-2xl font-bold text-red-900">
            {formatCurrency(summary.total_predicted_expense)}
          </p>
          <p className="text-xs text-red-700 mt-1">
            ~{formatCurrency(summary.avg_daily_expense)}/kun
          </p>
        </div>
      </div>

      {/* Balance Forecast Chart */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Balans prognozi</h2>
            <p className="text-sm text-gray-500 mt-0.5">
              Kunlik bashorat - keyingi 30 kun
            </p>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-blue-500"></div>
              <span className="text-gray-600">Prognoz balans</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-gray-300"></div>
              <span className="text-gray-600">Xavf chizig'i</span>
            </div>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={350}>
          <AreaChart data={forecast.forecast}>
            <defs>
              <linearGradient id="balanceGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis
              dataKey="date_display"
              tick={{ fontSize: 11 }}
              stroke="#9ca3af"
            />
            <YAxis tick={{ fontSize: 11 }} stroke="#9ca3af" />
            <Tooltip
              formatter={(value: number) => formatCurrency(value)}
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: '12px',
              }}
            />
            <ReferenceLine y={0} stroke="#ef4444" strokeDasharray="3 3" />
            <Area
              type="monotone"
              dataKey="predicted_balance"
              stroke="#3b82f6"
              strokeWidth={2}
              fill="url(#balanceGradient)"
              name="Prognoz balans"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Daily Income vs Expense */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">
          Kunlik kirim va chiqim prognozi
        </h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={forecast.forecast}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="date_display" tick={{ fontSize: 11 }} stroke="#9ca3af" />
            <YAxis tick={{ fontSize: 11 }} stroke="#9ca3af" />
            <Tooltip
              formatter={(value: number) => formatCurrency(value)}
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: '12px',
              }}
            />
            <Legend />
            <Bar dataKey="predicted_income" fill="#10b981" name="Kirim" radius={[4, 4, 0, 0]} />
            <Bar dataKey="predicted_expense" fill="#ef4444" name="Chiqim" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Patterns & Insights Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Spending Patterns */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            📊 Xarajat namunalari
          </h2>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-600 mb-2">O'rtacha kunlik</p>
              <div className="flex items-center justify-between">
                <span className="text-gray-900">Kirim:</span>
                <span className="font-semibold text-green-600">
                  {formatCurrency(patterns.avg_daily_income)}
                </span>
              </div>
              <div className="flex items-center justify-between mt-1">
                <span className="text-gray-900">Chiqim:</span>
                <span className="font-semibold text-red-600">
                  {formatCurrency(patterns.avg_daily_expense)}
                </span>
              </div>
            </div>

            <div className="border-t border-gray-100 pt-4">
              <p className="text-sm text-gray-600 mb-2">O'rtacha oylik</p>
              <div className="flex items-center justify-between">
                <span className="text-gray-900">Kirim:</span>
                <span className="font-semibold text-green-600">
                  {formatCurrency(patterns.avg_monthly_income)}
                </span>
              </div>
              <div className="flex items-center justify-between mt-1">
                <span className="text-gray-900">Chiqim:</span>
                <span className="font-semibold text-red-600">
                  {formatCurrency(patterns.avg_monthly_expense)}
                </span>
              </div>
            </div>

            {patterns.top_expense_categories.length > 0 && (
              <div className="border-t border-gray-100 pt-4">
                <p className="text-sm text-gray-600 mb-3">Eng ko'p xarajatlar</p>
                <div className="space-y-2">
                  {patterns.top_expense_categories.slice(0, 3).map((cat, index) => (
                    <div key={index} className="flex items-center justify-between text-sm">
                      <span className="text-gray-700">{cat.category}</span>
                      <div className="text-right">
                        <span className="font-semibold text-gray-900">
                          {formatCurrency(cat.amount)}
                        </span>
                        <span className="text-gray-500 text-xs ml-2">
                          {cat.percentage.toFixed(0)}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Trends */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            📈 Tendensiyalar
          </h2>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-600 mb-2">Daromad tendensiyasi</p>
              <div className="flex items-center gap-2">
                {trends.income_direction === 'increasing' ? (
                  <TrendingUp className="w-5 h-5 text-green-600" />
                ) : trends.income_direction === 'decreasing' ? (
                  <TrendingDown className="w-5 h-5 text-red-600" />
                ) : (
                  <div className="w-5 h-5 rounded-full bg-gray-300"></div>
                )}
                <span
                  className={`font-semibold ${
                    trends.income_direction === 'increasing'
                      ? 'text-green-600'
                      : trends.income_direction === 'decreasing'
                      ? 'text-red-600'
                      : 'text-gray-600'
                  }`}
                >
                  {trends.income_trend >= 0 ? '+' : ''}
                  {trends.income_trend.toFixed(1)}%
                </span>
                <span className="text-sm text-gray-500 capitalize">
                  {trends.income_direction === 'increasing'
                    ? 'Oshmoqda'
                    : trends.income_direction === 'decreasing'
                    ? 'Kamaymoqda'
                    : 'Barqaror'}
                </span>
              </div>
            </div>

            <div>
              <p className="text-sm text-gray-600 mb-2">Xarajat tendensiyasi</p>
              <div className="flex items-center gap-2">
                {trends.expense_direction === 'increasing' ? (
                  <TrendingUp className="w-5 h-5 text-red-600" />
                ) : trends.expense_direction === 'decreasing' ? (
                  <TrendingDown className="w-5 h-5 text-green-600" />
                ) : (
                  <div className="w-5 h-5 rounded-full bg-gray-300"></div>
                )}
                <span
                  className={`font-semibold ${
                    trends.expense_direction === 'increasing'
                      ? 'text-red-600'
                      : trends.expense_direction === 'decreasing'
                      ? 'text-green-600'
                      : 'text-gray-600'
                  }`}
                >
                  {trends.expense_trend >= 0 ? '+' : ''}
                  {trends.expense_trend.toFixed(1)}%
                </span>
                <span className="text-sm text-gray-500 capitalize">
                  {trends.expense_direction === 'increasing'
                    ? 'Oshmoqda'
                    : trends.expense_direction === 'decreasing'
                    ? 'Kamaymoqda'
                    : 'Barqaror'}
                </span>
              </div>
            </div>

            <div className="border-t border-gray-100 pt-4">
              <p className="text-sm text-gray-600 mb-2">Xarajat tezligi</p>
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-orange-500" />
                <span className="font-semibold text-gray-900">
                  {trends.spending_velocity.toFixed(1)} tranzaksiya/hafta
                </span>
              </div>
              {trends.velocity_change !== 0 && (
                <p className="text-xs text-gray-500 mt-1">
                  {trends.velocity_change >= 0 ? '+' : ''}
                  {trends.velocity_change.toFixed(1)}% o'zgarish
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Recurring Transactions */}
      {recurring_transactions.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            🔁 Takrorlanuvchi tranzaksiyalar
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recurring_transactions.map((rec, index) => (
              <div
                key={index}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow"
              >
                <div className="flex items-start justify-between mb-2">
                  <span className="font-semibold text-gray-900">{rec.category}</span>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full ${
                      rec.type === 'income'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-red-100 text-red-700'
                    }`}
                  >
                    {rec.type === 'income' ? 'Kirim' : 'Chiqim'}
                  </span>
                </div>
                <p className="text-2xl font-bold text-gray-900 mb-1">
                  {formatCurrency(rec.avg_amount)}
                </p>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span className="capitalize">{rec.pattern}</span>
                  <span>{(rec.confidence * 100).toFixed(0)}% ishonch</span>
                </div>
                <p className="text-xs text-gray-400 mt-2">
                  {rec.occurrences} marta, ~{rec.frequency_days.toFixed(0)} kun interval
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* AI Insights */}
      {insights && insights.success && (
        <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl border border-purple-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white text-lg">🤖</span>
            </div>
            <h2 className="text-lg font-semibold text-gray-900">AI Tavsiyalari</h2>
          </div>

          {insights.insights.length > 0 && (
            <div className="mb-4">
              <p className="text-sm font-medium text-gray-700 mb-2">💡 Tushunchalar:</p>
              <ul className="space-y-2">
                {insights.insights.map((insight, index) => (
                  <li key={index} className="text-sm text-gray-700 pl-4 relative">
                    <span className="absolute left-0">•</span>
                    {insight}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {insights.recommendations.length > 0 && (
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">✨ Tavsiyalar:</p>
              <ul className="space-y-2">
                {insights.recommendations.map((rec, index) => (
                  <li key={index} className="text-sm text-gray-700 pl-4 relative">
                    <span className="absolute left-0">•</span>
                    {rec}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Statistics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-xs text-gray-500 mb-1">Foydali kunlar</p>
          <p className="text-2xl font-bold text-green-600">{summary.days_profitable}</p>
          <p className="text-xs text-gray-400">{summary.profit_ratio.toFixed(0)}%</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-xs text-gray-500 mb-1">Zarardagi kunlar</p>
          <p className="text-2xl font-bold text-red-600">{summary.days_loss}</p>
          <p className="text-xs text-gray-400">{(100 - summary.profit_ratio).toFixed(0)}%</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-xs text-gray-500 mb-1">Min balans</p>
          <p className="text-lg font-bold text-gray-900">
            {formatCurrency(summary.min_balance)}
          </p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-xs text-gray-500 mb-1">Max balans</p>
          <p className="text-lg font-bold text-gray-900">
            {formatCurrency(summary.max_balance)}
          </p>
        </div>
      </div>

      {/* Budget Recommendations */}
      {budgetRecs && budgetRecs.success && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-6">
            <Target className="w-6 h-6 text-purple-600" />
            <h2 className="text-lg font-semibold text-gray-900">💰 Byudjet Tavsiyalari</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-blue-50 rounded-lg p-4">
              <p className="text-sm text-blue-600 mb-1">Zaruriy xarajatlar (50%)</p>
              <p className="text-2xl font-bold text-blue-900">
                {formatCurrency(budgetRecs.recommended_budgets.essentials)}
              </p>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <p className="text-sm text-green-600 mb-1">Turmush tarzi (30%)</p>
              <p className="text-2xl font-bold text-green-900">
                {formatCurrency(budgetRecs.recommended_budgets.lifestyle)}
              </p>
            </div>
            <div className="bg-purple-50 rounded-lg p-4">
              <p className="text-sm text-purple-600 mb-1">Jamg'arish (20%)</p>
              <p className="text-2xl font-bold text-purple-900">
                {formatCurrency(budgetRecs.recommended_budgets.savings)}
              </p>
            </div>
          </div>

          {budgetRecs.category_budgets.length > 0 && (
            <div className="mb-4">
              <h3 className="font-medium text-gray-900 mb-3">Kategoriya bo'yicha byudjet</h3>
              <div className="space-y-3">
                {budgetRecs.category_budgets.slice(0, 5).map((cat, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{cat.category}</p>
                      <p className="text-xs text-gray-500">
                        Joriy: {formatCurrency(cat.current)} ({cat.percentage.toFixed(0)}%)
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-green-600">
                        {formatCurrency(cat.recommended)}
                      </p>
                      <p className="text-xs text-gray-500">
                        Tejash: {formatCurrency(cat.savings_potential)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="border-t border-gray-100 pt-4">
            <p className="text-sm font-medium text-gray-700 mb-2">💡 Tavsiyalar:</p>
            <ul className="space-y-1">
              {budgetRecs.recommendations.map((rec, index) => (
                <li key={index} className="text-sm text-gray-600">{rec}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Anomalies Detection */}
      {anomalies && anomalies.success && anomalies.count > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="w-6 h-6 text-orange-600" />
            <h2 className="text-lg font-semibold text-gray-900">
              🔍 G'ayritabiiy Tranzaksiyalar
            </h2>
          </div>

          <div className="mb-4">
            {anomalies.insights.map((insight, index) => (
              <p key={index} className="text-sm text-gray-600">{insight}</p>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {anomalies.anomalies.map((anomaly, index) => (
              <div key={index} className="border border-orange-200 rounded-lg p-3 bg-orange-50">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-orange-600 font-medium">{anomaly.date}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    anomaly.type === 'income' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {anomaly.type === 'income' ? 'Kirim' : 'Chiqim'}
                  </span>
                </div>
                <p className="text-xl font-bold text-gray-900 mb-1">
                  {formatCurrency(anomaly.amount)}
                </p>
                <p className="text-xs text-gray-600">{anomaly.category}</p>
                <p className="text-xs text-orange-600 mt-1">
                  {anomaly.deviation.toFixed(1)}σ yuqori
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Seasonal Patterns */}
      {seasonalPatterns && seasonalPatterns.success && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            📅 Mavsumiy Naqshlar
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
            <div>
              <h3 className="font-medium text-gray-900 mb-2">O'rtacha oylik ko'rsatkichlar</h3>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Kirim:</span>
                  <span className="font-semibold text-green-600">
                    {formatCurrency(seasonalPatterns.avg_monthly_income)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Chiqim:</span>
                  <span className="font-semibold text-red-600">
                    {formatCurrency(seasonalPatterns.avg_monthly_expense)}
                  </span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-medium text-gray-900 mb-2">Eng yuqori oylar</h3>
              <div className="space-y-2">
                {seasonalPatterns.peak_income_months.length > 0 && (
                  <div>
                    <p className="text-xs text-gray-500">Eng ko'p daromad:</p>
                    <p className="text-sm font-medium text-green-600">
                      {seasonalPatterns.peak_income_months.join(', ')}
                    </p>
                  </div>
                )}
                {seasonalPatterns.peak_expense_months.length > 0 && (
                  <div>
                    <p className="text-xs text-gray-500">Eng ko'p xarajat:</p>
                    <p className="text-sm font-medium text-red-600">
                      {seasonalPatterns.peak_expense_months.join(', ')}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {seasonalPatterns.insights.length > 0 && (
            <div className="border-t border-gray-100 pt-4">
              <ul className="space-y-1">
                {seasonalPatterns.insights.map((insight, index) => (
                  <li key={index} className="text-sm text-gray-600">{insight}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Category Forecast */}
      {categoryForecast && categoryForecast.success && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            📊 Kategoriya bo'yicha Prognoz
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top Income Categories */}
            {categoryForecast.top_income_categories.length > 0 && (
              <div>
                <h3 className="font-medium text-gray-900 mb-3">💰 Kutilayotgan Kirimlar</h3>
                <div className="space-y-2">
                  {categoryForecast.top_income_categories.map((cat, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">{cat.category}</p>
                        <p className="text-xs text-gray-500">
                          ~{cat.expected_frequency.toFixed(0)} marta × {formatCurrency(cat.avg_amount)}
                        </p>
                      </div>
                      <p className="font-bold text-green-600">
                        {formatCurrency(cat.predicted_total)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Top Expense Categories */}
            {categoryForecast.top_expense_categories.length > 0 && (
              <div>
                <h3 className="font-medium text-gray-900 mb-3">💸 Kutilayotgan Chiqimlar</h3>
                <div className="space-y-2">
                  {categoryForecast.top_expense_categories.map((cat, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">{cat.category}</p>
                        <p className="text-xs text-gray-500">
                          ~{cat.expected_frequency.toFixed(0)} marta × {formatCurrency(cat.avg_amount)}
                        </p>
                      </div>
                      <p className="font-bold text-red-600">
                        {formatCurrency(cat.predicted_total)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
