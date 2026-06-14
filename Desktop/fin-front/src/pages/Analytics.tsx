import { useQuery } from '@tanstack/react-query'
import { useAuthStore } from '@/store/authStore'
import { getTrends, getCategoryBreakdown, getForecast } from '@/lib/api'
import { formatCurrency } from '@/lib/utils'
import { LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { TrendingUp, AlertTriangle } from 'lucide-react'

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6']

export default function Analytics() {
  const { telegramId } = useAuthStore()

  const { data: trends } = useQuery({
    queryKey: ['trends', telegramId, 30],
    queryFn: () => getTrends(telegramId!, 30).then((res) => res.data),
    enabled: !!telegramId,
  })

  // Don't filter by date - show all data
  const { data: incomeBreakdown } = useQuery({
    queryKey: ['category-breakdown', telegramId, 'income'],
    queryFn: () => getCategoryBreakdown(telegramId!, 'income').then((res) => res.data),
    enabled: !!telegramId,
  })

  const { data: expenseBreakdown } = useQuery({
    queryKey: ['category-breakdown', telegramId, 'expense'],
    queryFn: () => getCategoryBreakdown(telegramId!, 'expense').then((res) => res.data),
    enabled: !!telegramId,
  })

  const { data: forecast } = useQuery({
    queryKey: ['forecast', telegramId, 30],
    queryFn: () => getForecast(telegramId!, 30).then((res) => res.data),
    enabled: !!telegramId,
  })

  return (
    <div className="space-y-6">

      {/* Forecast Warnings */}
      {forecast && forecast.warnings && forecast.warnings.length > 0 && (
        <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-orange-600 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-orange-900 mb-2">⚠️ Ogohlantirish</h3>
              <ul className="space-y-1">
                {forecast.warnings.map((warning, index) => (
                  <li key={index} className="text-sm text-orange-800">{warning}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Trends Chart */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">
            Oxirgi 30 kun tendensiyasi
          </h2>
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-gray-600">Kirim</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span className="text-gray-600">Chiqim</span>
            </div>
          </div>
        </div>
        {trends && trends.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={trends}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip formatter={(value: number) => formatCurrency(value)} />
              <Legend />
              <Line type="monotone" dataKey="income" stroke="#10b981" name="Kirim" strokeWidth={2} />
              <Line type="monotone" dataKey="expense" stroke="#ef4444" name="Chiqim" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-gray-500 text-center py-12">Ma'lumot yo'q</p>
        )}
      </div>

      {/* Category Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Income Breakdown */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900">
              Kirim bo'yicha taqsimot
            </h2>
          </div>
          <div className="p-6">
            {incomeBreakdown && incomeBreakdown.length > 0 ? (
              <>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={incomeBreakdown}
                      dataKey="total"
                      nameKey="category"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      label={(entry) => `${entry.category}: ${((entry.total / incomeBreakdown.reduce((sum, item) => sum + item.total, 0)) * 100).toFixed(0)}%`}
                    >
                      {incomeBreakdown.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color || COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: number) => formatCurrency(value)} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="mt-4 space-y-2">
                  {incomeBreakdown.map((item, index) => (
                    <div key={index} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: item.color || COLORS[index % COLORS.length] }}
                        />
                        <span>{item.icon} {item.category}</span>
                      </div>
                      <span className="font-semibold">{formatCurrency(item.total)}</span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <p className="text-gray-500 text-center py-12">Ma'lumot yo'q</p>
            )}
          </div>
        </div>

        {/* Expense Breakdown */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900">
              Chiqim bo'yicha taqsimot
            </h2>
          </div>
          <div className="p-6">
            {expenseBreakdown && expenseBreakdown.length > 0 ? (
              <>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={expenseBreakdown}
                      dataKey="total"
                      nameKey="category"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      label={(entry) => `${entry.category}: ${((entry.total / expenseBreakdown.reduce((sum, item) => sum + item.total, 0)) * 100).toFixed(0)}%`}
                    >
                      {expenseBreakdown.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color || COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: number) => formatCurrency(value)} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="mt-4 space-y-2">
                  {expenseBreakdown.map((item, index) => (
                    <div key={index} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: item.color || COLORS[index % COLORS.length] }}
                        />
                        <span>{item.icon} {item.category}</span>
                      </div>
                      <span className="font-semibold">{formatCurrency(item.total)}</span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <p className="text-gray-500 text-center py-12">Ma'lumot yo'q</p>
            )}
          </div>
        </div>
      </div>

      {/* Forecast */}
      {forecast && forecast.forecast && forecast.forecast.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            <h2 className="text-lg font-semibold text-gray-900">
              30 kunlik prognoz (AI)
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-blue-50 rounded-lg p-4">
              <p className="text-sm text-blue-600 mb-1">O'rtacha kunlik kirim</p>
              <p className="text-xl font-bold text-blue-900">
                {formatCurrency(forecast.avg_daily_income)}
              </p>
            </div>
            <div className="bg-red-50 rounded-lg p-4">
              <p className="text-sm text-red-600 mb-1">O'rtacha kunlik chiqim</p>
              <p className="text-xl font-bold text-red-900">
                {formatCurrency(forecast.avg_daily_expense)}
              </p>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <p className="text-sm text-green-600 mb-1">Prognoz balans (30 kun)</p>
              <p className="text-xl font-bold text-green-900">
                {formatCurrency(forecast.forecast[forecast.forecast.length - 1].predicted_balance)}
              </p>
            </div>
          </div>

          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={forecast.forecast}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip formatter={(value: number) => formatCurrency(value)} />
              <Legend />
              <Line
                type="monotone"
                dataKey="predicted_balance"
                stroke="#3b82f6"
                name="Prognoz balans"
                strokeWidth={2}
                strokeDasharray="5 5"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  )
}
