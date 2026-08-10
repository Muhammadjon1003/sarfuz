import { useQuery } from '@tanstack/react-query'
import { useAuthStore } from '@/store/authStore'
import { getSummary, getTransactions, getCategoryBreakdown, getTrends, getDebtSummary } from '@/lib/api'
import { formatCurrency, formatDate, fillDailyTrendTimeline } from '@/lib/utils'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  faPlus, 
  faReceipt, 
  faArrowTrendUp, 
  faArrowTrendDown, 
  faDollarSign, 
  faUserGroup, 
  faWandMagicSparkles 
} from '@fortawesome/free-solid-svg-icons'
import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import AddTransactionDialog from '@/components/AddTransactionDialog'
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts'

import Loader from '@/components/Loader'
import { CategoryIcon } from '@/lib/categoryIcons'
import StackedCards from '@/components/StackedCards'

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

  const { data: trends } = useQuery({
    queryKey: ['trends', telegramId, 30],
    queryFn: () => getTrends(telegramId!, 30).then((res) => res.data),
    enabled: !!telegramId,
  })

  const financialFreedomData = useMemo(() => {
    return fillDailyTrendTimeline(trends, 30)
  }, [trends])

  if (summaryLoading) {
    return <Loader />
  }

  const hasData = summary && summary.transaction_count > 0

  return (
    <div className="space-y-8">
      {/* Top Banner & Quick Add Action */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
            Umumiy Sharh
            <span className="text-xs px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-400/30 text-cyan-300 font-medium">
              Jonli Rejim
            </span>
          </h2>
          <p className="text-sm text-teal-200/60 mt-1">Moliyaviy hisobotlar va dinamik tahlillar</p>
        </div>

        <button
          onClick={() => setIsAddDialogOpen(true)}
          className="hidden sm:inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-teal-400 via-cyan-400 to-sky-400 hover:from-teal-300 hover:to-sky-300 text-slate-950 font-bold text-sm shadow-[0_0_25px_rgba(0,242,254,0.4)] transition-all duration-200 hover:scale-105 active:scale-95"
        >
          <FontAwesomeIcon icon={faPlus} className="w-4 h-4" />
          <span>Yangi Amal</span>
        </button>
      </div>

      {!hasData ? (
        /* Empty State */
        <div className="glass-panel rounded-3xl p-12 text-center border border-teal-500/20 shadow-2xl relative overflow-hidden">
          <div className="w-20 h-20 bg-gradient-to-br from-cyan-500/20 to-teal-500/10 border border-cyan-400/30 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(0,242,254,0.15)]">
            <FontAwesomeIcon icon={faReceipt} className="w-8 h-8 text-cyan-300" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">
            Amal topilmadi
          </h2>
          <p className="text-teal-200/60 mb-8 max-w-md mx-auto text-sm leading-relaxed">
            Birinchi amalingizni qo'shing yoki Telegram bot orqali ovozli xabar yuboring.
          </p>
          <button
            onClick={() => setIsAddDialogOpen(true)}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-500 text-slate-950 font-semibold text-sm shadow-lg hover:shadow-cyan-500/20 transition-all"
          >
            Amal yaratish
          </button>
        </div>
      ) : (
        <>
          {/* Top Hero Grid: Credit Card Preview & Financial Freedom Overview */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Credit Card / Business Account Showcase */}
            <StackedCards
              netBalance={summary.net}
              totalExpense={summary.total_expense}
              totalIncome={summary.total_income}
              formatCurrency={formatCurrency}
            />

            {/* Financial Freedom Chart */}
            <div className="lg:col-span-2 glass-panel rounded-3xl p-6 flex flex-col justify-between relative overflow-hidden">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-400/30 text-cyan-400">
                    <FontAwesomeIcon icon={faArrowTrendUp} className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-white">Moliyaviy Erkinlik Dinamikasi</h2>
                    <p className="text-xs text-teal-200/60">Oxirgi 30 kunlik jamg'arma grafigi</p>
                  </div>
                </div>

                {financialFreedomData.length > 0 && (
                  <div className="text-left sm:text-right">
                    <span className="text-[11px] uppercase tracking-wider text-teal-200/60 font-medium">O'sish Trendi</span>
                    <p className={`text-lg font-extrabold ${
                      financialFreedomData[financialFreedomData.length - 1]?.balance >= 0 
                        ? 'text-cyan-300' 
                        : 'text-rose-400'
                    }`}>
                      {formatCurrency(financialFreedomData[financialFreedomData.length - 1]?.balance || 0)}
                    </p>
                  </div>
                )}
              </div>

              {financialFreedomData.length > 0 && (
                <div className="h-[180px] w-full mt-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={financialFreedomData}>
                      <defs>
                        <linearGradient id="balanceGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#00f2fe" stopOpacity={0.4}/>
                          <stop offset="95%" stopColor="#00f2fe" stopOpacity={0}/>
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
                      <YAxis 
                        tick={{ fontSize: 10, fill: '#94a3b8' }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <Tooltip 
                        formatter={(value: number) => [formatCurrency(value), "Balans"]}
                        contentStyle={{ 
                          backgroundColor: '#071d24', 
                          borderColor: 'rgba(6, 182, 212, 0.3)',
                          borderRadius: '12px',
                          color: '#fff',
                          boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
                          fontSize: '12px'
                        }}
                      />
                      <Area 
                        type="natural" 
                        dataKey="balance" 
                        stroke="#00f2fe" 
                        strokeWidth={3}
                        fill="url(#balanceGradient)"
                        name="Balans"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>
          </div>

          {/* 4 Primary Metric Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Kirim / Daromad (Income) */}
            <div className="glass-panel-interactive rounded-2xl p-5 border border-emerald-500/20 flex flex-col justify-between">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Jami Daromad</span>
                <div className="p-2 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.2)]">
                  <FontAwesomeIcon icon={faArrowTrendUp} className="w-4 h-4" />
                </div>
              </div>
              <div>
                <p className="text-2xl font-black text-white tracking-tight">
                  {formatCurrency(summary.total_income)}
                </p>
                {summary.income_change !== undefined && (
                  <p className={`text-xs mt-2 font-semibold flex items-center gap-1 ${
                    summary.income_change >= 0 ? 'text-emerald-400' : 'text-rose-400'
                  }`}>
                    {summary.income_change >= 0 ? '+' : ''}
                    {summary.income_change.toFixed(1)}%
                    <span className="text-slate-500 font-normal">oldingi davrdan</span>
                  </p>
                )}
              </div>
            </div>

            {/* Chiqim (Expense) */}
            <div className="glass-panel-interactive rounded-2xl p-5 border border-rose-500/20 flex flex-col justify-between">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Jami Chiqim</span>
                <div className="p-2 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-400 shadow-[0_0_10px_rgba(244,63,94,0.2)]">
                  <FontAwesomeIcon icon={faArrowTrendDown} className="w-4 h-4" />
                </div>
              </div>
              <div>
                <p className="text-2xl font-black text-white tracking-tight">
                  {formatCurrency(summary.total_expense)}
                </p>
                {summary.expense_change !== undefined && (
                  <p className={`text-xs mt-2 font-semibold flex items-center gap-1 ${
                    summary.expense_change <= 0 ? 'text-emerald-400' : 'text-rose-400'
                  }`}>
                    {summary.expense_change >= 0 ? '+' : ''}
                    {summary.expense_change.toFixed(1)}%
                    <span className="text-slate-500 font-normal">oldingi davrdan</span>
                  </p>
                )}
              </div>
            </div>

            {/* Qarz (Debt Balance) */}
            <div className="glass-panel-interactive rounded-2xl p-5 border border-amber-500/20 flex flex-col justify-between">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Qarz Balansi</span>
                <div className="p-2 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-400 shadow-[0_0_10px_rgba(245,158,11,0.2)]">
                  <FontAwesomeIcon icon={faUserGroup} className="w-4 h-4" />
                </div>
              </div>
              <div>
                <p className={`text-2xl font-black tracking-tight ${
                  debtSummary && debtSummary.net_debt > 0 
                    ? 'text-rose-400' 
                    : debtSummary && debtSummary.net_debt < 0 
                    ? 'text-emerald-400' 
                    : 'text-white'
                }`}>
                  {debtSummary ? formatCurrency(Math.abs(debtSummary.net_debt)) : formatCurrency(0)}
                </p>
                <p className="text-xs text-slate-400 mt-2 font-medium">
                  {debtSummary && debtSummary.net_debt > 0 
                    ? 'Men qarzdorman' 
                    : debtSummary && debtSummary.net_debt < 0 
                    ? 'Menga qarzdor' 
                    : 'Qarzdorlik yo\'q'}
                </p>
              </div>
            </div>

            {/* Sof foyda (Net Balance) */}
            <div className="glass-panel-interactive rounded-2xl p-5 border border-cyan-500/20 flex flex-col justify-between">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Sof Foyda</span>
                <div className="p-2 rounded-xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-400 shadow-[0_0_10px_rgba(0,242,254,0.2)]">
                  <FontAwesomeIcon icon={faDollarSign} className="w-4 h-4" />
                </div>
              </div>
              <div>
                <p className={`text-2xl font-black tracking-tight ${
                  summary.net >= 0 ? 'text-cyan-300' : 'text-rose-400'
                }`}>
                  {formatCurrency(summary.net)}
                </p>
                <p className="text-xs text-slate-400 mt-2 font-medium">
                  {summary.transaction_count} ta amal bajarildi
                </p>
              </div>
            </div>
          </div>

          {/* Recent Transactions & Top Expenses Lists */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Oxirgi Amallar Panel */}
            <div className="glass-panel rounded-3xl overflow-hidden border border-teal-500/20 flex flex-col justify-between">
              <div className="px-6 py-4 border-b border-teal-500/15 flex items-center justify-between">
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <FontAwesomeIcon icon={faReceipt} className="w-4 h-4 text-cyan-400" />
                  Oxirgi Amallar
                </h2>
                <Link to="/transactions" className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold transition-colors">
                  Barchasini ko'rish →
                </Link>
              </div>
              <div className="p-6 flex-1">
                {recentTransactions && recentTransactions.length > 0 ? (
                  <div className="space-y-3">
                    {recentTransactions.map((transaction) => (
                      <div
                        key={transaction.id}
                        className="flex items-center justify-between p-3.5 rounded-xl bg-teal-950/30 border border-teal-500/10 hover:border-cyan-500/30 hover:bg-teal-900/30 transition-all group"
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className="w-10 h-10 rounded-xl flex items-center justify-center text-lg border border-white/10 shadow-sm text-cyan-300 font-bold"
                            style={{ backgroundColor: (transaction.category_color || '#00f2fe') + '25' }}
                          >
                            <CategoryIcon name={transaction.category_name} icon={transaction.category_icon} className="w-4 h-4 text-cyan-300" />
                          </div>
                          <div>
                            <p className="font-semibold text-slate-100 text-sm group-hover:text-cyan-300 transition-colors">
                              {transaction.category_name || 'Boshqa'}
                            </p>
                            <p className="text-[11px] text-slate-400">
                              {formatDate(transaction.transaction_date)}
                            </p>
                          </div>
                        </div>
                        <span
                          className={`font-black text-sm ${
                            transaction.type === 'income' ? 'text-emerald-400' : 'text-rose-400'
                          }`}
                        >
                          {transaction.type === 'income' ? '+' : '-'}
                          {formatCurrency(transaction.amount)}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-400 text-center py-10 text-sm">Amal yo'q</p>
                )}
              </div>
            </div>

            {/* Eng ko'p xarajatlar Panel */}
            <div className="glass-panel rounded-3xl overflow-hidden border border-teal-500/20 flex flex-col justify-between">
              <div className="px-6 py-4 border-b border-teal-500/15 flex items-center justify-between">
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <FontAwesomeIcon icon={faWandMagicSparkles} className="w-4 h-4 text-cyan-400" />
                  Eng Ko'p Xarajatlar
                </h2>
                <span className="text-xs text-teal-300/60">Kategoriyalar bo'yicha</span>
              </div>
              <div className="p-6 flex-1">
                {topExpenses && topExpenses.length > 0 ? (
                  <div className="space-y-4">
                    {topExpenses.slice(0, 5).map((item, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2.5">
                            <div className="w-7 h-7 bg-teal-950/60 rounded-lg border border-teal-500/20 flex items-center justify-center text-xs font-bold text-cyan-300">
                              <CategoryIcon name={item.category} icon={item.icon} className="w-3.5 h-3.5 text-cyan-400" />
                            </div>
                            <span className="font-semibold text-slate-200 text-sm">{item.category}</span>
                          </div>
                          <span className="font-bold text-white text-sm">
                            {formatCurrency(item.total)}
                          </span>
                        </div>
                        <div className="w-full bg-slate-900/60 rounded-full h-2 overflow-hidden border border-teal-500/10">
                          <div
                            className="h-full rounded-full transition-all duration-500 shadow-[0_0_10px_rgba(0,242,254,0.5)]"
                            style={{
                              width: `${Math.min(100, (item.total / summary.total_expense) * 100)}%`,
                              backgroundColor: item.color || '#00f2fe',
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-400 text-center py-10 text-sm">Ma'lumot yo'q</p>
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
