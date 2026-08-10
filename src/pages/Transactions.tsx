import { useState } from 'react'
import { createPortal } from 'react-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuthStore } from '@/store/authStore'
import { getTransactions, deleteTransaction, getCategories, Transaction } from '@/lib/api'
import { formatCurrency, formatDate } from '@/lib/utils'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  faPlus, 
  faTrashCan, 
  faFilter, 
  faMagnifyingGlass, 
  faXmark, 
  faChevronDown,
  faChevronUp,
  faPenToSquare,
  faCalendarDays,
  faTag
} from '@fortawesome/free-solid-svg-icons'
import AddTransactionDialog from '@/components/AddTransactionDialog'
import { CategoryIcon } from '@/lib/categoryIcons'
import Loader from '@/components/Loader'

export default function Transactions() {
  const { telegramId } = useAuthStore()
  const queryClient = useQueryClient()
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null)
  const [expandedRows, setExpandedRows] = useState<Record<number, boolean>>({})

  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [typeFilter, setTypeFilter] = useState<'all' | 'income' | 'expense'>('all')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [dateFilter, setDateFilter] = useState<'all' | 'today' | 'week' | 'month' | 'custom'>('all')
  const [customStartDate, setCustomStartDate] = useState('')
  const [customEndDate, setCustomEndDate] = useState('')

  // Calculate date range based on filter
  const getDateRange = () => {
    const now = new Date()
    let startDate: Date | undefined
    let endDate: Date | undefined

    switch (dateFilter) {
      case 'today':
        startDate = new Date(now.setHours(0, 0, 0, 0))
        endDate = new Date(now.setHours(23, 59, 59, 999))
        break
      case 'week':
        startDate = new Date(now)
        startDate.setDate(now.getDate() - now.getDay())
        startDate.setHours(0, 0, 0, 0)
        endDate = new Date()
        break
      case 'month':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1)
        endDate = new Date()
        break
      case 'custom':
        if (customStartDate) startDate = new Date(customStartDate)
        if (customEndDate) endDate = new Date(customEndDate)
        break
    }

    return {
      startDate: startDate ? startDate.toISOString() : undefined,
      endDate: endDate ? endDate.toISOString() : undefined,
    }
  }

  const { startDate, endDate } = getDateRange()

  const { data: transactions, isLoading } = useQuery({
    queryKey: ['transactions', telegramId, typeFilter, categoryFilter, startDate, endDate],
    queryFn: () =>
      getTransactions(telegramId!, {
        type: typeFilter !== 'all' ? typeFilter : undefined,
        category: categoryFilter || undefined,
        start_date: startDate,
        end_date: endDate,
      }).then((res) => res.data),
    enabled: !!telegramId,
  })

  const { data: categories } = useQuery({
    queryKey: ['categories', telegramId],
    queryFn: () => getCategories(telegramId!).then((res) => res.data),
    enabled: !!telegramId,
  })

  // Client-side search filtering
  const filteredTransactions = transactions?.filter((t) => {
    if (!searchQuery) return true
    const query = searchQuery.toLowerCase()
    const categoryMatch = t.category_name?.toLowerCase().includes(query)
    const descriptionMatch = t.description?.toLowerCase().includes(query)
    const amountMatch = t.amount.toString().includes(query)
    return categoryMatch || descriptionMatch || amountMatch
  })

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteTransaction(telegramId!, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] })
      queryClient.invalidateQueries({ queryKey: ['summary'] })
      queryClient.invalidateQueries({ queryKey: ['category-breakdown'] })
    },
  })

  const toggleRowExpand = (id: number) => {
    setExpandedRows((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))
  }

  const handleOpenEdit = (t: Transaction) => {
    setEditingTransaction(t)
    setIsAddDialogOpen(true)
  }

  const handleOpenAdd = () => {
    setEditingTransaction(null)
    setIsAddDialogOpen(true)
  }

  const hasActiveFilters = typeFilter !== 'all' || categoryFilter || searchQuery || dateFilter !== 'all'

  if (isLoading) {
    return <Loader />
  }

  const pageActionsContainer = document.getElementById('page-actions')

  return (
    <>
      {/* Render actions in header portal */}
      {pageActionsContainer && createPortal(
        <div className="flex items-center gap-2">
          {/* Search bar */}
          <div className="relative">
            <FontAwesomeIcon icon={faMagnifyingGlass} className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-teal-400/60" />
            <input
              type="text"
              placeholder="Qidirish..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-36 sm:w-56 pl-9 pr-8 py-2 bg-teal-950/40 border border-teal-500/20 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-cyan-400 placeholder:text-slate-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                <FontAwesomeIcon icon={faXmark} className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Add Action Button */}
          <button
            onClick={handleOpenAdd}
            className="flex items-center gap-1.5 bg-gradient-to-r from-teal-400 to-cyan-400 hover:from-teal-300 hover:to-cyan-300 text-slate-950 font-bold px-3.5 py-2 rounded-xl text-xs sm:text-sm transition-all shadow-[0_0_15px_rgba(0,242,254,0.3)]"
          >
            <FontAwesomeIcon icon={faPlus} className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Qo'shish</span>
          </button>

          {/* Filter Dropdown Toggle */}
          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl transition-all text-xs sm:text-sm font-semibold border ${
              hasActiveFilters
                ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400/40 shadow-[0_0_12px_rgba(6,182,212,0.3)]'
                : 'bg-teal-950/40 text-slate-300 border-teal-500/20 hover:border-cyan-500/30'
            }`}
          >
            <FontAwesomeIcon icon={faFilter} className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">Filter</span>
            {hasActiveFilters && (
              <span className="w-2 h-2 bg-cyan-400 rounded-full animate-ping"></span>
            )}
            <FontAwesomeIcon icon={faChevronDown} className={`w-3 h-3 transition-transform ${isFilterOpen ? 'rotate-180' : ''}`} />
          </button>
        </div>,
        pageActionsContainer
      )}

      {/* Filter Popover */}
      {isFilterOpen && (
        <>
          <div 
            className="fixed inset-0 z-40"
            onClick={() => setIsFilterOpen(false)}
          />
          
          <div className="fixed top-20 right-4 z-50 w-[calc(100vw-2rem)] max-w-sm sm:w-96 glass-panel rounded-3xl border border-teal-500/30 shadow-2xl p-6 animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="flex items-center justify-between mb-5 border-b border-teal-500/15 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <FontAwesomeIcon icon={faFilter} className="w-4 h-4 text-cyan-400" /> Filtr Parametrlari
              </h3>
              <button
                onClick={() => setIsFilterOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-teal-900/30"
              >
                <FontAwesomeIcon icon={faXmark} className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Type Filter */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">Turi</label>
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 bg-teal-950/60 border border-teal-500/20 rounded-xl text-sm text-white focus:border-cyan-400 focus:outline-none"
                >
                  <option value="all" className="bg-[#071d24]">Barchasi</option>
                  <option value="income" className="bg-[#071d24]">Daromad</option>
                  <option value="expense" className="bg-[#071d24]">Chiqim</option>
                </select>
              </div>

              {/* Category Filter */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">Kategoriya</label>
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-teal-950/60 border border-teal-500/20 rounded-xl text-sm text-white focus:border-cyan-400 focus:outline-none"
                >
                  <option value="" className="bg-[#071d24]">Barcha kategoriyalar</option>
                  {categories?.map((cat) => (
                    <option key={cat.id} value={cat.name} className="bg-[#071d24]">
                      {cat.icon} {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Date Filter */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">Muddat</label>
                <select
                  value={dateFilter}
                  onChange={(e) => {
                    setDateFilter(e.target.value as any)
                    if (e.target.value !== 'custom') {
                      setCustomStartDate('')
                      setCustomEndDate('')
                    }
                  }}
                  className="w-full px-3.5 py-2.5 bg-teal-950/60 border border-teal-500/20 rounded-xl text-sm text-white focus:border-cyan-400 focus:outline-none"
                >
                  <option value="all" className="bg-[#071d24]">Barchasi</option>
                  <option value="today" className="bg-[#071d24]">Bugun</option>
                  <option value="week" className="bg-[#071d24]">Shu hafta</option>
                  <option value="month" className="bg-[#071d24]">Shu oy</option>
                  <option value="custom" className="bg-[#071d24]">Tanlangan sana</option>
                </select>
              </div>

              {/* Custom Date Inputs */}
              {dateFilter === 'custom' && (
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Boshlanish</label>
                    <input
                      type="date"
                      value={customStartDate}
                      onChange={(e) => setCustomStartDate(e.target.value)}
                      className="w-full px-3 py-1.5 bg-teal-950/60 border border-teal-500/20 rounded-lg text-xs text-white focus:border-cyan-400 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Tugash</label>
                    <input
                      type="date"
                      value={customEndDate}
                      onChange={(e) => setCustomEndDate(e.target.value)}
                      className="w-full px-3 py-1.5 bg-teal-950/60 border border-teal-500/20 rounded-lg text-xs text-white focus:border-cyan-400 focus:outline-none"
                    />
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-3 border-t border-teal-500/15">
                {hasActiveFilters ? (
                  <button
                    onClick={() => {
                      setTypeFilter('all')
                      setCategoryFilter('')
                      setSearchQuery('')
                      setDateFilter('all')
                      setCustomStartDate('')
                      setCustomEndDate('')
                    }}
                    className="text-xs text-rose-400 hover:text-rose-300 font-semibold"
                  >
                    Filtrlarni tozalash
                  </button>
                ) : (
                  <div />
                )}
                <button
                  onClick={() => setIsFilterOpen(false)}
                  className="px-4 py-2 bg-gradient-to-r from-teal-400 to-cyan-400 text-slate-950 text-xs font-bold rounded-xl shadow-lg hover:shadow-cyan-500/20 transition-all"
                >
                  Qo'llash
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Transactions Container */}
      <div className="space-y-6">
        <div className="glass-panel rounded-3xl overflow-hidden border border-teal-500/20 shadow-2xl">
          {filteredTransactions && filteredTransactions.length > 0 ? (
            <>
              {/* Mobile & Tablet Accordion View (< lg: NO Scroll X) */}
              <div className="block lg:hidden divide-y divide-teal-500/10">
                {filteredTransactions.map((transaction) => {
                  const isExpanded = !!expandedRows[transaction.id]

                  return (
                    <div key={transaction.id} className="p-4 transition-colors hover:bg-teal-900/20">
                      {/* Collapsed Header Bar */}
                      <div
                        onClick={() => toggleRowExpand(transaction.id)}
                        className="flex items-center justify-between gap-3 cursor-pointer select-none"
                      >
                        <div className="flex items-center gap-3 min-w-0 flex-1">
                          <div className="w-10 h-10 bg-teal-950/60 rounded-2xl border border-white/10 flex items-center justify-center text-cyan-300 flex-shrink-0">
                            <CategoryIcon name={transaction.category_name} icon={transaction.category_icon} className="w-4 h-4 text-cyan-300" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <h3 className="font-bold text-white text-sm truncate">
                              {transaction.category_name || 'Boshqa'}
                            </h3>
                            <p className="text-xs text-slate-400 truncate">
                              {transaction.description || '-'}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 flex-shrink-0">
                          <span
                            className={`font-black text-sm ${
                              transaction.type === 'income' ? 'text-emerald-400' : 'text-rose-400'
                            }`}
                          >
                            {transaction.type === 'income' ? '+' : '-'}
                            {formatCurrency(transaction.amount)}
                          </span>

                          <button
                            className="p-1.5 rounded-xl bg-teal-950/60 border border-teal-500/20 text-slate-400 hover:text-white transition-colors"
                            aria-label="Expand details"
                          >
                            <FontAwesomeIcon
                              icon={isExpanded ? faChevronUp : faChevronDown}
                              className="w-3.5 h-3.5"
                            />
                          </button>
                        </div>
                      </div>

                      {/* Expanded Accordion Content */}
                      {isExpanded && (
                        <div className="mt-3 pt-3 border-t border-teal-500/15 space-y-2.5 animate-in fade-in slide-in-from-top-1 duration-200">
                          <div className="flex items-center justify-between text-xs text-slate-300">
                            <span className="flex items-center gap-1.5 text-slate-400 font-medium">
                              <FontAwesomeIcon icon={faCalendarDays} className="w-3.5 h-3.5 text-cyan-400" />
                              Sana:
                            </span>
                            <span className="font-semibold text-slate-200">
                              {formatDate(transaction.transaction_date)}
                            </span>
                          </div>

                          <div className="flex items-center justify-between text-xs text-slate-300">
                            <span className="flex items-center gap-1.5 text-slate-400 font-medium">
                              <FontAwesomeIcon icon={faTag} className="w-3.5 h-3.5 text-cyan-400" />
                              Turi:
                            </span>
                            <span
                              className={`px-2.5 py-0.5 text-[11px] font-bold rounded-full border ${
                                transaction.type === 'income'
                                  ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                                  : 'bg-rose-500/15 text-rose-400 border-rose-500/30'
                              }`}
                            >
                              {transaction.type === 'income' ? 'Daromad' : 'Chiqim'}
                            </span>
                          </div>

                          {/* Action Buttons: Edit & Delete */}
                          <div className="flex items-center justify-end gap-2 pt-2 border-t border-teal-500/10">
                            <button
                              onClick={() => handleOpenEdit(transaction)}
                              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-500/15 border border-cyan-400/30 text-cyan-300 text-xs font-semibold hover:bg-cyan-500/25 transition-all"
                            >
                              <FontAwesomeIcon icon={faPenToSquare} className="w-3.5 h-3.5" />
                              Tahrirlash
                            </button>
                            <button
                              onClick={() => {
                                if (confirm("Amalni o'chirmoqchimisiz?")) {
                                  deleteMutation.mutate(transaction.id)
                                }
                              }}
                              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-400 text-xs font-semibold hover:bg-rose-500/25 transition-all"
                            >
                              <FontAwesomeIcon icon={faTrashCan} className="w-3.5 h-3.5" />
                              O'chirish
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>

              {/* Desktop Full Table View (>= lg) */}
              <div className="hidden lg:block overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-teal-950/40 border-b border-teal-500/15">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-bold text-slate-300 uppercase tracking-wider">
                        Sana
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-slate-300 uppercase tracking-wider">
                        Kategoriya
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-slate-300 uppercase tracking-wider">
                        Izoh
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-slate-300 uppercase tracking-wider">
                        Turi
                      </th>
                      <th className="px-6 py-4 text-right text-xs font-bold text-slate-300 uppercase tracking-wider">
                        Summa
                      </th>
                      <th className="px-6 py-4 text-right text-xs font-bold text-slate-300 uppercase tracking-wider">
                        Amallar
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-teal-500/10">
                    {filteredTransactions.map((transaction) => (
                      <tr key={transaction.id} className="hover:bg-teal-900/30 transition-colors group">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">
                          {formatDate(transaction.transaction_date)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 bg-teal-950/50 rounded-xl border border-white/10 flex items-center justify-center text-cyan-300">
                              <CategoryIcon name={transaction.category_name} icon={transaction.category_icon} className="w-4 h-4 text-cyan-300" />
                            </div>
                            <span className="text-sm font-semibold text-white group-hover:text-cyan-300 transition-colors">
                              {transaction.category_name || 'Boshqa'}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-400 max-w-xs truncate">
                          {transaction.description || '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex px-3 py-1 text-xs font-bold rounded-full border ${
                              transaction.type === 'income'
                                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                                : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                            }`}
                          >
                            {transaction.type === 'income' ? 'Daromad' : 'Chiqim'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <span
                            className={`text-sm font-black ${
                              transaction.type === 'income' ? 'text-emerald-400' : 'text-rose-400'
                            }`}
                          >
                            {transaction.type === 'income' ? '+' : '-'}
                            {formatCurrency(transaction.amount)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right space-x-1">
                          <button
                            onClick={() => handleOpenEdit(transaction)}
                            className="text-slate-400 hover:text-cyan-300 p-2 hover:bg-cyan-500/10 rounded-xl transition-colors"
                            title="Tahrirlash"
                          >
                            <FontAwesomeIcon icon={faPenToSquare} className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm("Amalni o'chirmoqchimisiz?")) {
                                deleteMutation.mutate(transaction.id)
                              }
                            }}
                            className="text-slate-400 hover:text-rose-400 p-2 hover:bg-rose-500/10 rounded-xl transition-colors"
                            title="O'chirish"
                          >
                            <FontAwesomeIcon icon={faTrashCan} className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          ) : (
            <div className="text-center py-16 p-6">
              <div className="w-16 h-16 bg-teal-950/60 border border-teal-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4 text-slate-400">
                <FontAwesomeIcon icon={faFilter} className="w-7 h-7 text-cyan-400" />
              </div>
              <p className="text-slate-300 font-semibold text-lg">Amal topilmadi</p>
              <p className="text-slate-500 text-xs mt-1">Filtr parametrlariga mos yozuvlar mavjud emas</p>
              {hasActiveFilters && (
                <button
                  onClick={() => {
                    setTypeFilter('all')
                    setCategoryFilter('')
                    setSearchQuery('')
                    setDateFilter('all')
                  }}
                  className="mt-5 px-4 py-2 rounded-xl bg-cyan-500/10 border border-cyan-400/30 text-cyan-300 text-xs font-semibold hover:bg-cyan-500/20 transition-all"
                >
                  Filtrlarni tozalash
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      <AddTransactionDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        editTransaction={editingTransaction}
      />
    </>
  )
}
