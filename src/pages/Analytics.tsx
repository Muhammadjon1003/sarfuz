import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useAuthStore } from '@/store/authStore'
import { getTrends, getCategoryBreakdown, getForecast } from '@/lib/api'
import { formatCurrency, fillDailyTrendTimeline } from '@/lib/utils'
import { AreaChart, Area, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  faArrowTrendUp, 
  faTriangleExclamation, 
  faChartPie, 
  faChartLine 
} from '@fortawesome/free-solid-svg-icons'
import Loader from '@/components/Loader'
import { CategoryIcon } from '@/lib/categoryIcons'

const COLORS = ['#00f2fe', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6', '#38bdf8', '#14b8a6']

export default function Analytics() {
  const { telegramId } = useAuthStore()

  const { data: trends, isLoading: trendsLoading } = useQuery({
    queryKey: ['trends', telegramId, 30],
    queryFn: () => getTrends(telegramId!, 30).then((res) => res.data),
    enabled: !!telegramId,
  })

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

  const dailyTrendsTimeline = useMemo(() => {
    return fillDailyTrendTimeline(trends, 30)
  }, [trends])

  if (trendsLoading) {
    return <Loader />
  }

  return (
    <div className="space-y-8">
      {/* Forecast Warnings Banner */}
      {forecast && forecast.warnings && forecast.warnings.length > 0 && (
        <div className="glass-panel rounded-2xl p-4 border border-amber-500/30 bg-amber-500/5">
          <div className="flex items-start gap-3">
            <FontAwesomeIcon icon={faTriangleExclamation} className="w-5 h-5 text-amber-400 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-bold text-amber-200 text-sm mb-1">Ogohlantirishlar</h3>
              <ul className="space-y-1">
                {forecast.warnings.map((warning, index) => (
                  <li key={index} className="text-xs text-amber-100/80">{warning}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* 30-Day Trends Chart */}
      <div className="glass-panel rounded-3xl p-6 border border-teal-500/20 shadow-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-400/30 text-cyan-400">
              <FontAwesomeIcon icon={faChartLine} className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Oxirgi 30 Kun Tendensiyasi</h2>
              <p className="text-xs text-teal-300/60">Daromad va chiqimlar taqqoslamasi</p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs font-semibold">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-emerald-400 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
              <span className="text-slate-300">Daromad</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-rose-400 rounded-full shadow-[0_0_8px_rgba(244,63,94,0.5)]"></div>
              <span className="text-slate-300">Chiqim</span>
            </div>
          </div>
        </div>

        <ResponsiveContainer width="100%" height={320}>
          <AreaChart data={dailyTrendsTimeline}>
            <defs>
              <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(20, 184, 166, 0.15)" vertical={false} />
            <XAxis 
              dataKey="date_display" 
              tick={{ fontSize: 10, fill: '#94a3b8' }} 
              axisLine={false} 
              tickLine={false}
              minTickGap={25}
              interval="preserveStartEnd"
            />
            <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
            <Tooltip 
              formatter={(value: number) => formatCurrency(value)} 
              contentStyle={{ 
                backgroundColor: '#071d24', 
                borderColor: 'rgba(6, 182, 212, 0.3)',
                borderRadius: '12px',
                color: '#fff',
                boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
                fontSize: '12px'
              }}
            />
            <Legend wrapperStyle={{ paddingTop: '15px' }} />
            <Area 
              type="natural" 
              dataKey="income" 
              stroke="#10b981" 
              strokeWidth={2.5} 
              fill="url(#incomeGradient)" 
              name="Daromad" 
              dot={false}
              activeDot={{ r: 4, fill: '#10b981' }} 
            />
            <Area 
              type="natural" 
              dataKey="expense" 
              stroke="#f43f5e" 
              strokeWidth={2.5} 
              fill="url(#expenseGradient)" 
              name="Chiqim" 
              dot={false}
              activeDot={{ r: 4, fill: '#f43f5e' }} 
            />
          </AreaChart>
        </ResponsiveContainer>
        </div>

      {/* Category Breakdown Pies */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Income Breakdown */}
        <div className="glass-panel rounded-3xl overflow-hidden border border-teal-500/20 p-6 flex flex-col justify-between">
          <div className="flex items-center gap-2 mb-4 border-b border-teal-500/15 pb-3">
            <FontAwesomeIcon icon={faChartPie} className="w-5 h-5 text-emerald-400" />
            <h2 className="text-base font-bold text-white">Daromad Bo'yicha Taqsimot</h2>
          </div>
          <div className="flex-1">
            {incomeBreakdown && incomeBreakdown.length > 0 ? (
              <>
                <ResponsiveContainer width="100%" height={240}>
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
                    <Tooltip 
                      formatter={(value: number) => formatCurrency(value)}
                      contentStyle={{ 
                        backgroundColor: '#071d24', 
                        borderColor: 'rgba(6, 182, 212, 0.3)',
                        borderRadius: '12px',
                        color: '#fff'
                      }} 
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="mt-4 space-y-2.5">
                  {incomeBreakdown.map((item, index) => (
                    <div key={index} className="flex items-center justify-between text-xs p-2 rounded-xl bg-teal-950/30 border border-teal-500/10">
                      <div className="flex items-center gap-2.5">
                        <div
                          className="w-3 h-3 rounded-full shadow-sm"
                          style={{ backgroundColor: item.color || COLORS[index % COLORS.length] }}
                        />
                        <span className="font-semibold text-slate-200 flex items-center gap-1.5">
                          <CategoryIcon name={item.category} icon={item.icon} className="w-3.5 h-3.5 text-cyan-400" />
                          {item.category}
                        </span>
                      </div>
                      <span className="font-extrabold text-white">{formatCurrency(item.total)}</span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <p className="text-slate-400 text-center py-12 text-sm">Ma'lumot yo'q</p>
            )}
          </div>
        </div>

        {/* Expense Breakdown */}
        <div className="glass-panel rounded-3xl overflow-hidden border border-teal-500/20 p-6 flex flex-col justify-between">
          <div className="flex items-center gap-2 mb-4 border-b border-teal-500/15 pb-3">
            <FontAwesomeIcon icon={faChartPie} className="w-5 h-5 text-rose-400" />
            <h2 className="text-base font-bold text-white">Chiqim Bo'yicha Taqsimot</h2>
          </div>
          <div className="flex-1">
            {expenseBreakdown && expenseBreakdown.length > 0 ? (
              <>
                <ResponsiveContainer width="100%" height={240}>
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
                    <Tooltip 
                      formatter={(value: number) => formatCurrency(value)}
                      contentStyle={{ 
                        backgroundColor: '#071d24', 
                        borderColor: 'rgba(6, 182, 212, 0.3)',
                        borderRadius: '12px',
                        color: '#fff'
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="mt-4 space-y-2.5">
                  {expenseBreakdown.map((item, index) => (
                    <div key={index} className="flex items-center justify-between text-xs p-2 rounded-xl bg-teal-950/30 border border-teal-500/10">
                      <div className="flex items-center gap-2.5">
                        <div
                          className="w-3 h-3 rounded-full shadow-sm"
                          style={{ backgroundColor: item.color || COLORS[index % COLORS.length] }}
                        />
                        <span className="font-semibold text-slate-200 flex items-center gap-1.5">
                          <CategoryIcon name={item.category} icon={item.icon} className="w-3.5 h-3.5 text-rose-400" />
                          {item.category}
                        </span>
                      </div>
                      <span className="font-extrabold text-white">{formatCurrency(item.total)}</span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <p className="text-slate-400 text-center py-12 text-sm">Ma'lumot yo'q</p>
            )}
          </div>
        </div>
      </div>

      {/* AI Forecast Overview */}
      {forecast && forecast.forecast && forecast.forecast.length > 0 && (
        <div className="glass-panel rounded-3xl p-6 border border-teal-500/20 shadow-2xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-400/30 text-cyan-400">
              <FontAwesomeIcon icon={faArrowTrendUp} className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">30 Kunlik AI Prognoz</h2>
              <p className="text-xs text-teal-300/60">Algoritmlar asosida kutilayotgan moliyaviy dinamika</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="glass-panel-interactive rounded-2xl p-4 border border-cyan-500/20">
              <p className="text-xs font-semibold text-cyan-400 uppercase tracking-wider mb-1">O'rtacha kunlik daromad</p>
              <p className="text-2xl font-black text-white">
                {formatCurrency(forecast.avg_daily_income)}
              </p>
            </div>
            <div className="glass-panel-interactive rounded-2xl p-4 border border-rose-500/20">
              <p className="text-xs font-semibold text-rose-400 uppercase tracking-wider mb-1">O'rtacha kunlik chiqim</p>
              <p className="text-2xl font-black text-white">
                {formatCurrency(forecast.avg_daily_expense)}
              </p>
            </div>
            <div className="glass-panel-interactive rounded-2xl p-4 border border-emerald-500/20">
              <p className="text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-1">Kutilayotgan Balans (30-kun)</p>
              <p className="text-2xl font-black text-white">
                {formatCurrency(forecast.forecast[forecast.forecast.length - 1].predicted_balance)}
              </p>
            </div>
          </div>

          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={forecast.forecast}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(20, 184, 166, 0.15)" vertical={false} />
              <XAxis 
                dataKey="date_display" 
                tick={{ fontSize: 10, fill: '#94a3b8' }} 
                axisLine={false} 
                tickLine={false}
                minTickGap={25}
                interval="preserveStartEnd"
              />
              <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <Tooltip 
                formatter={(value: number) => formatCurrency(value)} 
                contentStyle={{ 
                  backgroundColor: '#071d24', 
                  borderColor: 'rgba(6, 182, 212, 0.3)',
                  borderRadius: '12px',
                  color: '#fff'
                }}
              />
              <Legend wrapperStyle={{ paddingTop: '10px' }} />
              <Line
                type="monotone"
                dataKey="predicted_balance"
                stroke="#00f2fe"
                name="Prognoz balans"
                strokeWidth={2.5}
                strokeDasharray="5 5"
                dot={false}
                activeDot={{ r: 4, fill: '#00f2fe' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  )
}
