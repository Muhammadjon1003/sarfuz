import { useState } from 'react'
import { createPortal } from 'react-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuthStore } from '@/store/authStore'
import { getDebts, getDebtSummary, deleteDebt, type Debt } from '@/lib/api'
import { formatCurrency, formatDate } from '@/lib/utils'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  faPlus, 
  faTrashCan, 
  faDollarSign, 
  faClock, 
  faCircleCheck, 
  faArrowTrendDown, 
  faArrowTrendUp, 
  faUserGroup 
} from '@fortawesome/free-solid-svg-icons'
import Loader from '@/components/Loader'
import AddDebtDialog from '@/components/AddDebtDialog'

export default function Debts() {
  const { telegramId } = useAuthStore()
  const queryClient = useQueryClient()
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [filterType, setFilterType] = useState<'all' | 'borrowed' | 'lent'>('all')
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'paid'>('all')

  const { data: debtSummary } = useQuery({
    queryKey: ['debt-summary', telegramId],
    queryFn: () => getDebtSummary(telegramId!).then((res) => res.data),
    enabled: !!telegramId,
  })

  const { data: debts, isLoading } = useQuery({
    queryKey: ['debts', telegramId, filterType, filterStatus],
    queryFn: () =>
      getDebts(
        telegramId!,
        filterType === 'all' ? undefined : filterType,
        filterStatus === 'all' ? undefined : filterStatus
      ).then((res) => res.data),
    enabled: !!telegramId,
  })

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteDebt(telegramId!, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['debts'] })
      queryClient.invalidateQueries({ queryKey: ['debt-summary'] })
    },
  })

  if (isLoading) {
    return <Loader />
  }

  const pageActionsContainer = document.getElementById('page-actions')

  return (
    <>
      {/* Header portal button */}
      {pageActionsContainer &&
        createPortal(
          <button
            onClick={() => setIsAddDialogOpen(true)}
            className="btn-bluish flex items-center gap-1.5 bg-gradient-to-r from-teal-400 to-cyan-400 hover:from-teal-300 hover:to-cyan-300 text-slate-950 font-bold px-3.5 py-2 rounded-xl text-xs sm:text-sm transition-all shadow-[0_0_15px_rgba(0,242,254,0.3)]"
          >
            <FontAwesomeIcon icon={faPlus} className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Qarz qo'shish</span>
          </button>,
          pageActionsContainer
        )}

      <div className="space-y-6">
        {/* Summary Cards */}
        {debtSummary && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Borrowed */}
            <div className="glass-panel-interactive rounded-2xl p-6 border border-rose-500/20">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2.5 bg-rose-500/15 border border-rose-500/30 text-rose-400 rounded-xl">
                  <FontAwesomeIcon icon={faArrowTrendDown} className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Men qarz oldim</p>
                  <p className="text-2xl font-black text-rose-400">
                    {formatCurrency(debtSummary.total_borrowed)}
                  </p>
                </div>
              </div>
              <p className="text-xs text-slate-400 font-medium">{debtSummary.active_borrowed_count} ta faol qarz</p>
            </div>

            {/* Lent */}
            <div className="glass-panel-interactive rounded-2xl p-6 border border-emerald-500/20">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2.5 bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 rounded-xl">
                  <FontAwesomeIcon icon={faArrowTrendUp} className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Men qarz berdim</p>
                  <p className="text-2xl font-black text-emerald-400">
                    {formatCurrency(debtSummary.total_lent)}
                  </p>
                </div>
              </div>
              <p className="text-xs text-slate-400 font-medium">{debtSummary.active_lent_count} ta faol qarz</p>
            </div>

            {/* Net Balance */}
            <div className="glass-panel-interactive rounded-2xl p-6 border border-cyan-500/20">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2.5 bg-cyan-500/15 border border-cyan-500/30 text-cyan-400 rounded-xl">
                  <FontAwesomeIcon icon={faDollarSign} className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Net Qarz Balansi</p>
                  <p
                    className={`text-2xl font-black ${
                      debtSummary.net_debt > 0
                        ? 'text-rose-400'
                        : debtSummary.net_debt < 0
                        ? 'text-emerald-400'
                        : 'text-white'
                    }`}
                  >
                    {formatCurrency(Math.abs(debtSummary.net_debt))}
                  </p>
                </div>
              </div>
              <p className="text-xs text-slate-400 font-medium">
                {debtSummary.net_debt > 0
                  ? 'Men qarzdorman'
                  : debtSummary.net_debt < 0
                  ? 'Menga qarzdor'
                  : "Qarzdorlik yo'q"}
              </p>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="glass-panel rounded-2xl p-4 border border-teal-500/20">
          <div className="flex flex-wrap gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">Turi</label>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value as any)}
                className="px-3.5 py-2 bg-teal-950/60 border border-teal-500/20 rounded-xl text-sm text-white focus:border-cyan-400 focus:outline-none"
              >
                <option value="all" className="bg-[#071d24]">Barchasi</option>
                <option value="borrowed" className="bg-[#071d24]">Men qarz oldim</option>
                <option value="lent" className="bg-[#071d24]">Men qarz berdim</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">Status</label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as any)}
                className="px-3.5 py-2 bg-teal-950/60 border border-teal-500/20 rounded-xl text-sm text-white focus:border-cyan-400 focus:outline-none"
              >
                <option value="all" className="bg-[#071d24]">Barchasi</option>
                <option value="active" className="bg-[#071d24]">Faol</option>
                <option value="paid" className="bg-[#071d24]">To'langan</option>
              </select>
            </div>
          </div>
        </div>

        {/* Debts List */}
        <div className="glass-panel rounded-3xl border border-teal-500/20 overflow-hidden shadow-2xl">
          {debts && debts.length > 0 ? (
            <div className="divide-y divide-teal-500/10">
              {debts.map((debt: Debt) => (
                <div key={debt.id} className="p-4 sm:p-6 hover:bg-teal-900/20 transition-colors">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 sm:gap-4 flex-1 min-w-0">
                      <div
                        className={`p-2.5 sm:p-3 rounded-2xl border ${
                          debt.type === 'borrowed' 
                            ? 'bg-rose-500/10 border-rose-500/30 text-rose-400' 
                            : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                        }`}
                      >
                        {debt.type === 'borrowed' ? (
                          <FontAwesomeIcon icon={faArrowTrendDown} className="w-5 h-5" />
                        ) : (
                          <FontAwesomeIcon icon={faArrowTrendUp} className="w-5 h-5" />
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <h3 className="font-bold text-white text-sm sm:text-base truncate">{debt.person_name}</h3>
                          {debt.status === 'paid' && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-semibold rounded-full">
                              <FontAwesomeIcon icon={faCircleCheck} className="w-3.5 h-3.5" />
                              To'langan
                            </span>
                          )}
                          {debt.status === 'partially_paid' && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-amber-500/15 border border-amber-500/30 text-amber-400 text-xs font-semibold rounded-full">
                              <FontAwesomeIcon icon={faClock} className="w-3.5 h-3.5" />
                              Qisman
                            </span>
                          )}
                        </div>

                        {debt.person_phone && (
                          <p className="text-xs text-slate-400 mb-2 font-mono">{debt.person_phone}</p>
                        )}

                        {debt.description && (
                          <p className="text-sm text-slate-300 mb-3">{debt.description}</p>
                        )}

                        <div className="flex flex-wrap gap-2 sm:gap-4 text-xs font-semibold">
                          <div className="bg-teal-950/40 border border-teal-500/15 px-3 py-1.5 rounded-xl">
                            <span className="text-slate-400">Summa:</span>
                            <span className="ml-1 text-white font-bold">
                              {formatCurrency(debt.amount)}
                            </span>
                          </div>
                          {debt.paid_amount > 0 && (
                            <div className="bg-teal-950/40 border border-teal-500/15 px-3 py-1.5 rounded-xl">
                              <span className="text-slate-400">To'langan:</span>
                              <span className="ml-1 text-emerald-400 font-bold">
                                {formatCurrency(debt.paid_amount)}
                              </span>
                            </div>
                          )}
                          {debt.remaining_amount > 0 && (
                            <div className="bg-teal-950/40 border border-teal-500/15 px-3 py-1.5 rounded-xl">
                              <span className="text-slate-400">Qolgan:</span>
                              <span className="ml-1 text-rose-400 font-bold">
                                {formatCurrency(debt.remaining_amount)}
                              </span>
                            </div>
                          )}
                        </div>

                        <div className="flex flex-wrap gap-4 text-xs text-slate-400 mt-3">
                          <div>Sana: {formatDate(debt.debt_date)}</div>
                          {debt.due_date && <div>Muddat: {formatDate(debt.due_date)}</div>}
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        if (confirm("Qarzni o'chirmoqchimisiz?")) {
                          deleteMutation.mutate(debt.id)
                        }
                      }}
                      className="text-slate-400 hover:text-rose-400 p-2 hover:bg-rose-500/10 rounded-xl transition-colors"
                      title="O'chirish"
                    >
                      <FontAwesomeIcon icon={faTrashCan} className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="w-16 h-16 bg-teal-950/60 border border-teal-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4 text-cyan-400">
                <FontAwesomeIcon icon={faUserGroup} className="w-7 h-7 text-cyan-400" />
              </div>
              <p className="text-slate-300 font-semibold">Qarz topilmadi</p>
            </div>
          )}
        </div>
      </div>

      <AddDebtDialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen} />
    </>
  )
}
