import { useState } from 'react'
import { createPortal } from 'react-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuthStore } from '@/store/authStore'
import { getDebts, getDebtSummary, deleteDebt, type Debt } from '@/lib/api'
import { formatCurrency, formatDate } from '@/lib/utils'
import { Plus, Trash2, DollarSign, Clock, CheckCircle2 } from 'lucide-react'

export default function Debts() {
  const { telegramId } = useAuthStore()
  const queryClient = useQueryClient()
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
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  const pageActionsContainer = document.getElementById('page-actions')

  return (
    <>
      {/* Render actions in portal */}
      {pageActionsContainer &&
        createPortal(
          <button
            onClick={() => {}}
            className="flex items-center gap-1.5 text-gray-600 hover:text-gray-900 px-3 py-1.5 rounded-md hover:bg-gray-100 transition-colors text-sm font-medium"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Qarz qo'shish</span>
          </button>,
          pageActionsContainer
        )}

      <div className="space-y-6">
        {/* Summary Cards */}
        {debtSummary && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Borrowed */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-red-50 rounded-lg">
                  <span className="text-xl">📥</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Men qarz oldim</p>
                  <p className="text-2xl font-bold text-red-600">
                    {formatCurrency(debtSummary.total_borrowed)}
                  </p>
                </div>
              </div>
              <p className="text-sm text-gray-500">{debtSummary.active_borrowed_count} ta faol</p>
            </div>

            {/* Lent */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-green-50 rounded-lg">
                  <span className="text-xl">📤</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Men qarz berdim</p>
                  <p className="text-2xl font-bold text-green-600">
                    {formatCurrency(debtSummary.total_lent)}
                  </p>
                </div>
              </div>
              <p className="text-sm text-gray-500">{debtSummary.active_lent_count} ta faol</p>
            </div>

            {/* Net */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <DollarSign className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Balans</p>
                  <p
                    className={`text-2xl font-bold ${
                      debtSummary.net_debt > 0
                        ? 'text-red-600'
                        : debtSummary.net_debt < 0
                        ? 'text-green-600'
                        : 'text-gray-900'
                    }`}
                  >
                    {formatCurrency(Math.abs(debtSummary.net_debt))}
                  </p>
                </div>
              </div>
              <p className="text-sm text-gray-500">
                {debtSummary.net_debt > 0
                  ? 'Men qarzdorman'
                  : debtSummary.net_debt < 0
                  ? 'Menga qarzdor'
                  : "Qarz yo'q"}
              </p>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex flex-wrap gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">Turi</label>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value as any)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">Barchasi</option>
                <option value="borrowed">Men qarz oldim</option>
                <option value="lent">Men qarz berdim</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">Status</label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as any)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">Barchasi</option>
                <option value="active">Faol</option>
                <option value="paid">To'langan</option>
              </select>
            </div>
          </div>
        </div>

        {/* Debts List */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          {debts && debts.length > 0 ? (
            <div className="divide-y divide-gray-200">
              {debts.map((debt: Debt) => (
                <div key={debt.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4 flex-1">
                      <div
                        className={`p-3 rounded-lg ${
                          debt.type === 'borrowed' ? 'bg-red-50' : 'bg-green-50'
                        }`}
                      >
                        <span className="text-2xl">{debt.type === 'borrowed' ? '📥' : '📤'}</span>
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-gray-900">{debt.person_name}</h3>
                          {debt.status === 'paid' && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                              <CheckCircle2 className="w-3 h-3" />
                              To'langan
                            </span>
                          )}
                          {debt.status === 'partially_paid' && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-yellow-100 text-yellow-700 text-xs font-medium rounded-full">
                              <Clock className="w-3 h-3" />
                              Qisman
                            </span>
                          )}
                        </div>

                        {debt.person_phone && (
                          <p className="text-sm text-gray-500 mb-2">{debt.person_phone}</p>
                        )}

                        {debt.description && (
                          <p className="text-sm text-gray-600 mb-3">{debt.description}</p>
                        )}

                        <div className="flex flex-wrap gap-4 text-sm">
                          <div>
                            <span className="text-gray-500">Summa:</span>
                            <span className="ml-1 font-semibold text-gray-900">
                              {formatCurrency(debt.amount)}
                            </span>
                          </div>
                          {debt.paid_amount > 0 && (
                            <div>
                              <span className="text-gray-500">To'langan:</span>
                              <span className="ml-1 font-semibold text-green-600">
                                {formatCurrency(debt.paid_amount)}
                              </span>
                            </div>
                          )}
                          {debt.remaining_amount > 0 && (
                            <div>
                              <span className="text-gray-500">Qolgan:</span>
                              <span className="ml-1 font-semibold text-red-600">
                                {formatCurrency(debt.remaining_amount)}
                              </span>
                            </div>
                          )}
                        </div>

                        <div className="flex flex-wrap gap-4 text-xs text-gray-500 mt-2">
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
                      className="text-red-600 hover:text-red-800 p-2 hover:bg-red-50 rounded transition-colors"
                      title="O'chirish"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🤝</span>
              </div>
              <p className="text-gray-500 font-medium">Qarz topilmadi</p>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
