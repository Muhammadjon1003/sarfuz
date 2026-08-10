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
import { formatCurrency, fillMissing12Months } from '@/lib/utils'
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
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  faWandMagicSparkles, 
  faTriangleExclamation, 
  faCircleCheck, 
  faCircleInfo, 
  faDollarSign, 
  faBullseye, 
  faArrowTrendUp, 
  faArrowTrendDown, 
  faBolt, 
  faRotateLeft, 
  faMagnifyingGlass, 
  faCalendarDays, 
  faLayerGroup,
  faChartSimple 
} from '@fortawesome/free-solid-svg-icons'
import Loader from '@/components/Loader'
import { CategoryIcon } from '@/lib/categoryIcons'

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
    return <Loader />
  }

  if (!forecast || !forecast.success) {
    return (
      <div className="glass-panel rounded-3xl p-8 border border-amber-500/30 bg-amber-500/5">
        <div className="flex items-start gap-4">
          <FontAwesomeIcon icon={faCircleInfo} className="w-6 h-6 text-amber-400 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-bold text-amber-200 text-base mb-1">Prognoz yaratib bo'lmadi</h3>
            <p className="text-amber-100/80 text-sm">
              {forecast?.message || 'Prognoz uchun yetarli ma\'lumot yo\'q. Kamida 5 ta tranzaksiya kerak.'}
            </p>
          </div>
        </div>
      </div>
    )
  }

  const { summary, warnings, patterns, trends, recurring_transactions } = forecast

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-cyan-500/20 to-teal-500/10 border border-cyan-400/30 text-cyan-300 shadow-[0_0_15px_rgba(0,242,254,0.3)]">
              <FontAwesomeIcon icon={faWandMagicSparkles} className="w-6 h-6" />
            </div>
            Moliyaviy Prognoz
          </h1>
          <p className="text-sm text-teal-300/60 mt-1">AI algoritmlari asosida 30 kunlik balans bashorati</p>
        </div>
        <div className="glass-panel rounded-2xl px-5 py-3 border border-cyan-500/30 bg-cyan-500/10 text-right">
          <p className="text-xs text-teal-300/70 font-semibold uppercase tracking-wider">Ishonch darajasi</p>
          <p className="text-2xl font-black text-cyan-300">{summary.avg_confidence.toFixed(0)}%</p>
        </div>
      </div>

      {/* Warnings Banner */}
      {warnings.length > 0 && (
        <div className="space-y-3">
          {warnings.map((warning, index) => (
            <div
              key={index}
              className={`glass-panel rounded-2xl p-4 border transition-all ${
                warning.severity === 'critical'
                  ? 'border-rose-500/40 bg-rose-500/10 text-rose-200'
                  : warning.severity === 'warning'
                  ? 'border-amber-500/40 bg-amber-500/10 text-amber-200'
                  : 'border-cyan-500/40 bg-cyan-500/10 text-cyan-200'
              }`}
            >
              <div className="flex items-start gap-3">
                <FontAwesomeIcon
                  icon={
                    warning.severity === 'critical' || warning.severity === 'warning'
                      ? faTriangleExclamation
                      : faCircleInfo
                  }
                  className={`w-4 h-4 flex-shrink-0 mt-0.5 ${
                    warning.severity === 'critical'
                      ? 'text-rose-400'
                      : warning.severity === 'warning'
                      ? 'text-amber-400'
                      : 'text-cyan-400'
                  }`}
                />
                <div className="flex-1">
                  <h3 className="font-bold text-white text-sm mb-0.5">
                    {warning.title}
                  </h3>
                  <p className="text-xs opacity-90 leading-relaxed">
                    {warning.message}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {warnings.length === 0 && (
        <div className="glass-panel rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-4">
          <div className="flex items-start gap-3">
            <FontAwesomeIcon icon={faCircleCheck} className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-bold text-emerald-200 text-sm">Moliyaviy ahvol barqaror</h3>
              <p className="text-emerald-100/70 text-xs">Keyingi 30 kunda hech qanday xavf aniqlanmadi</p>
            </div>
          </div>
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="glass-panel-interactive rounded-2xl p-5 border border-teal-500/20">
          <div className="flex items-center gap-2 text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <FontAwesomeIcon icon={faDollarSign} className="w-4 h-4 text-cyan-400" />
            <span>Joriy Balans</span>
          </div>
          <p className="text-2xl font-black text-white">
            {formatCurrency(forecast.current_balance)}
          </p>
        </div>

        <div className="glass-panel-interactive rounded-2xl p-5 border border-cyan-500/30 bg-cyan-500/5">
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <FontAwesomeIcon icon={faBullseye} className="w-4 h-4" />
            <span>30 Kunlik Kutilayotgan Balans</span>
          </div>
          <p className="text-2xl font-black text-cyan-300">
            {formatCurrency(summary.ending_balance)}
          </p>
          <div className="flex items-center gap-1.5 mt-2 text-xs font-bold">
            <FontAwesomeIcon
              icon={summary.balance_change >= 0 ? faArrowTrendUp : faArrowTrendDown}
              className={`w-3.5 h-3.5 ${summary.balance_change >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}
            />
            <span
              className={summary.balance_change >= 0 ? 'text-emerald-400' : 'text-rose-400'}
            >
              {summary.balance_change >= 0 ? '+' : ''}
              {formatCurrency(summary.balance_change)}
            </span>
          </div>
        </div>

        <div className="glass-panel-interactive rounded-2xl p-5 border border-emerald-500/20">
          <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <FontAwesomeIcon icon={faArrowTrendUp} className="w-4 h-4" />
            <span>Kutilayotgan Daromad</span>
          </div>
          <p className="text-2xl font-black text-white">
            {formatCurrency(summary.total_predicted_income)}
          </p>
          <p className="text-xs text-emerald-400/80 mt-2 font-medium">
            ~{formatCurrency(summary.avg_daily_income)} / kun
          </p>
        </div>

        <div className="glass-panel-interactive rounded-2xl p-5 border border-rose-500/20">
          <div className="flex items-center gap-2 text-rose-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <FontAwesomeIcon icon={faArrowTrendDown} className="w-4 h-4" />
            <span>Kutilayotgan Chiqim</span>
          </div>
          <p className="text-2xl font-black text-white">
            {formatCurrency(summary.total_predicted_expense)}
          </p>
          <p className="text-xs text-rose-400/80 mt-2 font-medium">
            ~{formatCurrency(summary.avg_daily_expense)} / kun
          </p>
        </div>
      </div>

      {/* Balance Forecast Area Chart */}
      <div className="glass-panel rounded-3xl p-6 border border-teal-500/20 shadow-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <FontAwesomeIcon icon={faArrowTrendUp} className="w-5 h-5 text-cyan-400" /> Balans Prognozi
            </h2>
            <p className="text-xs text-teal-300/60 mt-0.5">
              Kunlik bashorat — keyingi 30 kunlik jamg'arma grafigi
            </p>
          </div>
          <div className="flex items-center gap-4 text-xs font-semibold">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(0,242,254,0.6)]"></div>
              <span className="text-slate-300">Prognoz balans</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-rose-500"></div>
              <span className="text-slate-300">Xavf chizig'i</span>
            </div>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={340}>
          <AreaChart data={forecast.forecast}>
            <defs>
              <linearGradient id="balanceForecastGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#00f2fe" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#00f2fe" stopOpacity={0} />
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
                fontSize: '12px',
              }}
            />
            <ReferenceLine y={0} stroke="#f43f5e" strokeDasharray="3 3" />
            <Area
              type="monotone"
              dataKey="predicted_balance"
              stroke="#00f2fe"
              strokeWidth={2.5}
              fill="url(#balanceForecastGradient)"
              name="Prognoz balans"
              dot={false}
              activeDot={{ r: 4, fill: '#00f2fe' }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Daily Income vs Expense Bar Chart */}
      <div className="glass-panel rounded-3xl p-6 border border-teal-500/20 shadow-2xl">
        <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
          <FontAwesomeIcon icon={faChartSimple} className="w-5 h-5 text-cyan-400" /> Kunlik Daromad Va Chiqim Prognozi
        </h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={forecast.forecast}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(20, 184, 166, 0.15)" vertical={false} />
            <XAxis 
              dataKey="date_display" 
              tick={{ fontSize: 10, fill: '#94a3b8' }} 
              axisLine={false} 
              tickLine={false}
              minTickGap={25}
              interval="preserveStartEnd"
            />
            <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
            <Tooltip
              formatter={(value: number) => formatCurrency(value)}
              contentStyle={{
                backgroundColor: '#071d24',
                borderColor: 'rgba(6, 182, 212, 0.3)',
                borderRadius: '12px',
                color: '#fff',
                fontSize: '12px',
              }}
            />
            <Legend wrapperStyle={{ paddingTop: '10px' }} />
            <Bar dataKey="predicted_income" fill="#10b981" name="Daromad" radius={[4, 4, 0, 0]} />
            <Bar dataKey="predicted_expense" fill="#f43f5e" name="Chiqim" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Patterns & Insights Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Spending Patterns */}
        <div className="glass-panel rounded-3xl p-6 border border-teal-500/20 shadow-2xl">
          <h2 className="text-lg font-bold text-white mb-5 flex items-center gap-2 border-b border-teal-500/15 pb-3">
            <FontAwesomeIcon icon={faChartSimple} className="w-5 h-5 text-cyan-400" /> Xarajat Namunalari
          </h2>
          <div className="space-y-4">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">O'rtacha kunlik</p>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-300">Daromad:</span>
                <span className="font-extrabold text-emerald-400">
                  {formatCurrency(patterns.avg_daily_income)}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm mt-1.5">
                <span className="text-slate-300">Chiqim:</span>
                <span className="font-extrabold text-rose-400">
                  {formatCurrency(patterns.avg_daily_expense)}
                </span>
              </div>
            </div>

            <div className="border-t border-teal-500/15 pt-4">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">O'rtacha oylik</p>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-300">Daromad:</span>
                <span className="font-extrabold text-emerald-400">
                  {formatCurrency(patterns.avg_monthly_income)}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm mt-1.5">
                <span className="text-slate-300">Chiqim:</span>
                <span className="font-extrabold text-rose-400">
                  {formatCurrency(patterns.avg_monthly_expense)}
                </span>
              </div>
            </div>

            {patterns.top_expense_categories.length > 0 && (
              <div className="border-t border-teal-500/15 pt-4">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Eng ko'p xarajatlar</p>
                <div className="space-y-2.5">
                  {patterns.top_expense_categories.slice(0, 3).map((cat, index) => (
                    <div key={index} className="flex items-center justify-between text-sm p-2.5 bg-teal-950/40 rounded-xl border border-teal-500/10">
                      <span className="text-slate-200 font-medium flex items-center gap-2">
                        <CategoryIcon name={cat.category} className="w-3.5 h-3.5 text-cyan-400" />
                        {cat.category}
                      </span>
                      <div className="text-right">
                        <span className="font-extrabold text-white">
                          {formatCurrency(cat.amount)}
                        </span>
                        <span className="text-cyan-400 text-xs ml-2 font-bold">
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
        <div className="glass-panel rounded-3xl p-6 border border-teal-500/20 shadow-2xl">
          <h2 className="text-lg font-bold text-white mb-5 flex items-center gap-2 border-b border-teal-500/15 pb-3">
            <FontAwesomeIcon icon={faArrowTrendUp} className="w-5 h-5 text-cyan-400" /> Tendensiyalar
          </h2>
          <div className="space-y-4">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Daromad tendensiyasi</p>
              <div className="flex items-center gap-2.5">
                {trends.income_direction === 'increasing' ? (
                  <FontAwesomeIcon icon={faArrowTrendUp} className="w-5 h-5 text-emerald-400" />
                ) : trends.income_direction === 'decreasing' ? (
                  <FontAwesomeIcon icon={faArrowTrendDown} className="w-5 h-5 text-rose-400" />
                ) : (
                  <div className="w-4 h-4 rounded-full bg-slate-600"></div>
                )}
                <span
                  className={`font-black ${
                    trends.income_direction === 'increasing'
                      ? 'text-emerald-400'
                      : trends.income_direction === 'decreasing'
                      ? 'text-rose-400'
                      : 'text-slate-400'
                  }`}
                >
                  {trends.income_trend >= 0 ? '+' : ''}
                  {trends.income_trend.toFixed(1)}%
                </span>
                <span className="text-xs text-slate-300 font-semibold uppercase tracking-wider">
                  ({trends.income_direction === 'increasing'
                    ? 'Oshmoqda'
                    : trends.income_direction === 'decreasing'
                    ? 'Kamaymoqda'
                    : 'Barqaror'})
                </span>
              </div>
            </div>

            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Xarajat tendensiyasi</p>
              <div className="flex items-center gap-2.5">
                {trends.expense_direction === 'increasing' ? (
                  <FontAwesomeIcon icon={faArrowTrendUp} className="w-5 h-5 text-rose-400" />
                ) : trends.expense_direction === 'decreasing' ? (
                  <FontAwesomeIcon icon={faArrowTrendDown} className="w-5 h-5 text-emerald-400" />
                ) : (
                  <div className="w-4 h-4 rounded-full bg-slate-600"></div>
                )}
                <span
                  className={`font-black ${
                    trends.expense_direction === 'increasing'
                      ? 'text-rose-400'
                      : trends.expense_direction === 'decreasing'
                      ? 'text-emerald-400'
                      : 'text-slate-400'
                  }`}
                >
                  {trends.expense_trend >= 0 ? '+' : ''}
                  {trends.expense_trend.toFixed(1)}%
                </span>
                <span className="text-xs text-slate-300 font-semibold uppercase tracking-wider">
                  ({trends.expense_direction === 'increasing'
                    ? 'Oshmoqda'
                    : trends.expense_direction === 'decreasing'
                    ? 'Kamaymoqda'
                    : 'Barqaror'})
                </span>
              </div>
            </div>

            <div className="border-t border-teal-500/15 pt-4">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Xarajat tezligi</p>
              <div className="flex items-center gap-2 text-amber-400">
                <FontAwesomeIcon icon={faBolt} className="w-5 h-5" />
                <span className="font-black text-white text-base">
                  {trends.spending_velocity.toFixed(1)} amal/hafta
                </span>
              </div>
              {trends.velocity_change !== 0 && (
                <p className="text-xs text-slate-400 mt-1 font-medium">
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
        <div className="glass-panel rounded-3xl p-6 border border-teal-500/20 shadow-2xl">
          <h2 className="text-lg font-bold text-white mb-5 flex items-center gap-2 border-b border-teal-500/15 pb-3">
            <FontAwesomeIcon icon={faRotateLeft} className="w-5 h-5 text-cyan-400" /> Takrorlanuvchi Amallar
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recurring_transactions.map((rec, index) => (
              <div
                key={index}
                className="glass-panel-interactive rounded-2xl p-4 border border-teal-500/20"
              >
                <div className="flex items-start justify-between mb-2">
                  <span className="font-bold text-white text-sm">{rec.category}</span>
                  <span
                    className={`text-[11px] px-2.5 py-0.5 rounded-full font-bold border ${
                      rec.type === 'income'
                        ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                        : 'bg-rose-500/15 text-rose-400 border-rose-500/30'
                    }`}
                  >
                    {rec.type === 'income' ? 'Daromad' : 'Chiqim'}
                  </span>
                </div>
                <p className="text-2xl font-black text-white mb-2">
                  {formatCurrency(rec.avg_amount)}
                </p>
                <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
                  <span className="capitalize">{rec.pattern}</span>
                  <span className="text-cyan-400 font-bold">{(rec.confidence * 100).toFixed(0)}% ishonch</span>
                </div>
                <p className="text-xs text-slate-500 mt-2">
                  {rec.occurrences} marta, ~{rec.frequency_days.toFixed(0)} kun interval
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* AI Insights */}
      {insights && insights.success && (
        <div className="glass-card-gradient rounded-3xl border border-cyan-400/30 p-6 shadow-2xl relative overflow-hidden">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 bg-cyan-500/20 border border-cyan-400/40 rounded-xl flex items-center justify-center shadow-[0_0_15px_rgba(0,242,254,0.3)]">
              <FontAwesomeIcon icon={faWandMagicSparkles} className="w-5 h-5 text-cyan-300" />
            </div>
            <h2 className="text-lg font-black text-white">AI Tavsiyalari & Tahlili</h2>
          </div>

          {insights.insights.length > 0 && (
            <div className="mb-5">
              <p className="text-xs font-bold uppercase tracking-wider text-cyan-300 mb-2 flex items-center gap-1.5">
                <FontAwesomeIcon icon={faWandMagicSparkles} className="w-3.5 h-3.5" /> Tushunchalar:
              </p>
              <ul className="space-y-2">
                {insights.insights.map((insight, index) => (
                  <li key={index} className="text-sm text-slate-100 flex items-start gap-2">
                    <span className="text-cyan-400 font-bold">•</span>
                    {insight}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {insights.recommendations.length > 0 && (
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-cyan-300 mb-2 flex items-center gap-1.5">
                <FontAwesomeIcon icon={faBolt} className="w-3.5 h-3.5" /> Tavsiyalar:
              </p>
              <ul className="space-y-2">
                {insights.recommendations.map((rec, index) => (
                  <li key={index} className="text-sm text-slate-100 flex items-start gap-2">
                    <span className="text-cyan-400 font-bold">•</span>
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
        <div className="glass-panel rounded-2xl p-4 border border-teal-500/20">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Foydali kunlar</p>
          <p className="text-2xl font-black text-emerald-400">{summary.days_profitable}</p>
          <p className="text-xs text-slate-500 font-medium">{summary.profit_ratio.toFixed(0)}% jami kunlardan</p>
        </div>
        <div className="glass-panel rounded-2xl p-4 border border-teal-500/20">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Zarardagi kunlar</p>
          <p className="text-2xl font-black text-rose-400">{summary.days_loss}</p>
          <p className="text-xs text-slate-500 font-medium">{(100 - summary.profit_ratio).toFixed(0)}% jami kunlardan</p>
        </div>
        <div className="glass-panel rounded-2xl p-4 border border-teal-500/20">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Min balans</p>
          <p className="text-xl font-black text-white">
            {formatCurrency(summary.min_balance)}
          </p>
        </div>
        <div className="glass-panel rounded-2xl p-4 border border-teal-500/20">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Max balans</p>
          <p className="text-xl font-black text-white">
            {formatCurrency(summary.max_balance)}
          </p>
        </div>
      </div>

      {/* Budget Recommendations */}
      {budgetRecs && budgetRecs.success && (
        <div className="glass-panel rounded-3xl p-6 border border-teal-500/20 shadow-2xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-400/30 text-cyan-400">
              <FontAwesomeIcon icon={faBullseye} className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-bold text-white">Byudjet Tavsiyalari (50/30/20 Qoidasi)</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="glass-panel-interactive rounded-2xl p-4 border border-cyan-500/20">
              <p className="text-xs font-semibold text-cyan-400 uppercase tracking-wider mb-1">Zaruriy Xarajatlar (50%)</p>
              <p className="text-2xl font-black text-white">
                {formatCurrency(budgetRecs.recommended_budgets.essentials)}
              </p>
            </div>
            <div className="glass-panel-interactive rounded-2xl p-4 border border-emerald-500/20">
              <p className="text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-1">Turmush Tarzi (30%)</p>
              <p className="text-2xl font-black text-white">
                {formatCurrency(budgetRecs.recommended_budgets.lifestyle)}
              </p>
            </div>
            <div className="glass-panel-interactive rounded-2xl p-4 border border-sky-500/20">
              <p className="text-xs font-semibold text-sky-400 uppercase tracking-wider mb-1">Jamg'arish (20%)</p>
              <p className="text-2xl font-black text-white">
                {formatCurrency(budgetRecs.recommended_budgets.savings)}
              </p>
            </div>
          </div>

          {budgetRecs.category_budgets.length > 0 && (
            <div className="mb-5">
              <h3 className="text-sm font-bold text-white mb-3">Kategoriya Bo'yicha Byudjet</h3>
              <div className="space-y-3">
                {budgetRecs.category_budgets.slice(0, 5).map((cat, index) => (
                  <div key={index} className="flex items-center justify-between p-3.5 bg-teal-950/40 border border-teal-500/10 rounded-2xl">
                    <div className="flex-1">
                      <p className="font-bold text-white text-sm">{cat.category}</p>
                      <p className="text-xs text-slate-400">
                        Joriy: {formatCurrency(cat.current)} ({cat.percentage.toFixed(0)}%)
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-emerald-400 text-sm">
                        Tavsiya: {formatCurrency(cat.recommended)}
                      </p>
                      <p className="text-xs text-cyan-400 font-semibold">
                        Tejash: {formatCurrency(cat.savings_potential)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="border-t border-teal-500/15 pt-4">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Tavsiyalar:</p>
            <ul className="space-y-1">
              {budgetRecs.recommendations.map((rec, index) => (
                <li key={index} className="text-xs text-slate-300 leading-relaxed">• {rec}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Anomalies Detection */}
      {anomalies && anomalies.success && anomalies.count > 0 && (
        <div className="glass-panel rounded-3xl p-6 border border-amber-500/30 bg-amber-500/5 shadow-2xl">
          <div className="flex items-center gap-3 mb-4">
            <FontAwesomeIcon icon={faMagnifyingGlass} className="w-5 h-5 text-amber-400" />
            <h2 className="text-lg font-bold text-white">
              G'ayritabiiy Amallar
            </h2>
          </div>

          <div className="mb-4">
            {anomalies.insights.map((insight, index) => (
              <p key={index} className="text-xs text-amber-100/80 font-medium">{insight}</p>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {anomalies.anomalies.map((anomaly, index) => (
              <div key={index} className="glass-panel rounded-2xl p-4 border border-amber-500/30">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-amber-300 font-semibold">{anomaly.date}</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                    anomaly.type === 'income' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
                  }`}>
                    {anomaly.type === 'income' ? 'Daromad' : 'Chiqim'}
                  </span>
                </div>
                <p className="text-xl font-black text-white mb-1">
                  {formatCurrency(anomaly.amount)}
                </p>
                <p className="text-xs text-slate-300">{anomaly.category}</p>
                <p className="text-xs text-amber-400 font-semibold mt-1">
                  {anomaly.deviation.toFixed(1)}σ me'yordan yuqori
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Seasonal Patterns */}
      {seasonalPatterns && seasonalPatterns.success && (
        <div className="glass-panel rounded-3xl p-6 border border-teal-500/20 shadow-2xl">
          <h2 className="text-lg font-bold text-white mb-5 flex items-center gap-2 border-b border-teal-500/15 pb-3">
            <FontAwesomeIcon icon={faCalendarDays} className="w-5 h-5 text-cyan-400" /> Mavsumiy Naqshlar
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
            <div>
              <h3 className="font-semibold text-slate-300 text-xs uppercase tracking-wider mb-3">O'rtacha oylik ko'rsatkichlar</h3>
              <div className="space-y-2">
                <div className="flex justify-between items-center text-sm p-3 bg-teal-950/40 rounded-xl border border-teal-500/10">
                  <span className="text-slate-300">Daromad:</span>
                  <span className="font-black text-emerald-400">
                    {formatCurrency(seasonalPatterns.avg_monthly_income)}
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm p-3 bg-teal-950/40 rounded-xl border border-teal-500/10">
                  <span className="text-slate-300">Chiqim:</span>
                  <span className="font-black text-rose-400">
                    {formatCurrency(seasonalPatterns.avg_monthly_expense)}
                  </span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-slate-300 text-xs uppercase tracking-wider mb-3">Eng yuqori oylar</h3>
              <div className="space-y-3">
                {seasonalPatterns.peak_income_months.length > 0 && (
                  <div className="p-3 bg-teal-950/40 rounded-xl border border-teal-500/10">
                    <p className="text-xs text-slate-400">Eng ko'p daromad oylari:</p>
                    <p className="text-sm font-bold text-emerald-400 mt-0.5">
                      {seasonalPatterns.peak_income_months.join(', ')}
                    </p>
                  </div>
                )}
                {seasonalPatterns.peak_expense_months.length > 0 && (
                  <div className="p-3 bg-teal-950/40 rounded-xl border border-teal-500/10">
                    <p className="text-xs text-slate-400">Eng ko'p xarajat oylari:</p>
                    <p className="text-sm font-bold text-rose-400 mt-0.5">
                      {seasonalPatterns.peak_expense_months.join(', ')}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 12-Month Year Linear Line Chart */}
          <div className="mt-6 border-t border-teal-500/15 pt-5">
            <h3 className="font-semibold text-slate-200 text-xs uppercase tracking-wider mb-4 flex items-center justify-between">
              <span>12 Oylik Mavsumiy Dinamika (Yillik Chiziqli Grafik)</span>
              <span className="text-teal-400/70 text-[11px] normal-case font-normal">Mavjud bo'lmagan oylar 0 bilan to'ldirilgan</span>
            </h3>
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={fillMissing12Months(seasonalPatterns.monthly_data)}>
                <defs>
                  <linearGradient id="seasonIncomeGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="seasonExpenseGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="seasonNetGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00f2fe" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#00f2fe" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(20, 184, 166, 0.15)" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <Tooltip
                  formatter={(value: number) => formatCurrency(value)}
                  contentStyle={{
                    backgroundColor: '#071d24',
                    borderColor: 'rgba(6, 182, 212, 0.3)',
                    borderRadius: '12px',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                />
                <Legend wrapperStyle={{ paddingTop: '10px' }} />
                <Area type="monotone" dataKey="income" stroke="#10b981" strokeWidth={3} fill="url(#seasonIncomeGradient)" name="Daromad" dot={{ r: 4, fill: '#10b981' }} />
                <Area type="monotone" dataKey="expense" stroke="#f43f5e" strokeWidth={3} fill="url(#seasonExpenseGradient)" name="Chiqim" dot={{ r: 4, fill: '#f43f5e' }} />
                <Area type="monotone" dataKey="net" stroke="#00f2fe" strokeWidth={2} strokeDasharray="4 4" fill="url(#seasonNetGradient)" name="Net Balans" dot={{ r: 3, fill: '#00f2fe' }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {seasonalPatterns.insights.length > 0 && (
            <div className="border-t border-teal-500/15 pt-4">
              <ul className="space-y-1">
                {seasonalPatterns.insights.map((insight, index) => (
                  <li key={index} className="text-xs text-slate-300">• {insight}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Category Forecast */}
      {categoryForecast && categoryForecast.success && (
        <div className="glass-panel rounded-3xl p-6 border border-teal-500/20 shadow-2xl">
          <h2 className="text-lg font-bold text-white mb-5 flex items-center gap-2 border-b border-teal-500/15 pb-3">
            <FontAwesomeIcon icon={faLayerGroup} className="w-5 h-5 text-cyan-400" /> Kategoriya Bo'yicha Prognoz
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top Income Categories */}
            {categoryForecast.top_income_categories.length > 0 && (
              <div>
                <h3 className="font-bold text-slate-200 text-sm mb-3 flex items-center gap-1.5">
                  <FontAwesomeIcon icon={faArrowTrendUp} className="w-4 h-4 text-emerald-400" /> Kutilayotgan Daromadlar
                </h3>
                <div className="space-y-2.5">
                  {categoryForecast.top_income_categories.map((cat, index) => (
                    <div key={index} className="flex items-center justify-between p-3.5 bg-teal-950/40 rounded-2xl border border-teal-500/10">
                      <div>
                        <p className="font-bold text-white text-sm">{cat.category}</p>
                        <p className="text-xs text-slate-400 mt-0.5">
                          ~{cat.expected_frequency.toFixed(0)} marta × {formatCurrency(cat.avg_amount)}
                        </p>
                      </div>
                      <p className="font-black text-emerald-400 text-sm">
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
                <h3 className="font-bold text-slate-200 text-sm mb-3 flex items-center gap-1.5">
                  <FontAwesomeIcon icon={faArrowTrendDown} className="w-4 h-4 text-rose-400" /> Kutilayotgan Chiqimlar
                </h3>
                <div className="space-y-2.5">
                  {categoryForecast.top_expense_categories.map((cat, index) => (
                    <div key={index} className="flex items-center justify-between p-3.5 bg-teal-950/40 rounded-2xl border border-teal-500/10">
                      <div>
                        <p className="font-bold text-white text-sm">{cat.category}</p>
                        <p className="text-xs text-slate-400 mt-0.5">
                          ~{cat.expected_frequency.toFixed(0)} marta × {formatCurrency(cat.avg_amount)}
                        </p>
                      </div>
                      <p className="font-black text-rose-400 text-sm">
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
