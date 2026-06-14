import { useState } from 'react'
import { createPortal } from 'react-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuthStore } from '@/store/authStore'
import { getTransactions, deleteTransaction, getCategories } from '@/lib/api'
import { formatCurrency, formatDate } from '@/lib/utils'
import { Plus, Trash2, Filter, Search, X, ChevronDown } from 'lucide-react'
import AddTransactionDialog from '@/components/AddTransactionDialog'

export default function Transactions() {
  const { telegramId } = useAuthStore()
  const queryClient = useQueryClient()
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
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
        startDate.setDate(now.getDate() - now.getDay()) // Start of week (Sunday)
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
      default:
        break
    }

    return { startDate, endDate }
  }

  const { startDate, endDate } = getDateRange()

  const { data: transactions, isLoading } = useQuery({
    queryKey: ['transactions', telegramId, typeFilter, categoryFilter, dateFilter, customStartDate, customEndDate],
    queryFn: () =>
      getTransactions(telegramId!, {
        type: typeFilter === 'all' ? undefined : typeFilter,
        category_name: categoryFilter || undefined,
        start_date: startDate?.toISOString().split('T')[0],
        end_date: endDate?.toISOString().split('T')[0],
      }).then((res) => res.data),
    enabled: !!telegramId,
  })

  const { data: categories } = useQuery({
    queryKey: ['categories', telegramId],
    queryFn: () => getCategories(telegramId!).then((res) => res.data),
    enabled: !!telegramId,
  })

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteTransaction(telegramId!, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] })
      queryClient.invalidateQueries({ queryKey: ['summary'] })
    },
  })

  // Filter transactions by search query
  const filteredTransactions = transactions?.filter(transaction => {
    if (!searchQuery) return true
    const query = searchQuery.toLowerCase()
    return (
      transaction.category_name?.toLowerCase().includes(query) ||
      transaction.description?.toLowerCase().includes(query) ||
      transaction.amount.toString().includes(query)
    )
  })

  const hasActiveFilters = typeFilter !== 'all' || categoryFilter || searchQuery || dateFilter !== 'all'

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
      {pageActionsContainer && createPortal(
        <div className="flex items-center gap-2">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Qidirish..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-48 pl-8 pr-8 py-1.5 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Add Button */}
          <button
            onClick={() => setIsAddDialogOpen(true)}
            className="flex items-center gap-1.5 text-gray-600 hover:text-gray-900 px-3 py-1.5 rounded-md hover:bg-gray-100 transition-colors text-sm font-medium"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Qo'shish</span>
          </button>

          {/* Filter Button */}
          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-colors text-sm font-medium ${
              hasActiveFilters
                ? 'bg-blue-50 text-blue-600 hover:bg-blue-100'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            <Filter className="w-4 h-4" />
            <span className="hidden sm:inline">Filter</span>
            {hasActiveFilters && (
              <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
            )}
            <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isFilterOpen ? 'rotate-180' : ''}`} />
          </button>
        </div>,
        pageActionsContainer
      )}

      {/* Filter Modal Dropdown */}
      {isFilterOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-40"
            onClick={() => setIsFilterOpen(false)}
          />
          
          {/* Filter Panel */}
          <div className="fixed top-16 right-4 z-50 w-96 bg-white rounded-xl border border-gray-200 shadow-2xl animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-semibold text-gray-900">Filtrlar</h3>
                <button
                  onClick={() => setIsFilterOpen(false)}
                  className="text-gray-400 hover:text-gray-600 p-1 hover:bg-gray-100 rounded transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-4">
                {/* Type Filter */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1.5">Turi</label>
                  <select
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value as any)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">Barchasi</option>
                    <option value="income">Kirim</option>
                    <option value="expense">Chiqim</option>
                  </select>
                </div>

                {/* Category Filter */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1.5">Kategoriya</label>
                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Barcha kategoriyalar</option>
                    {categories?.map((cat) => (
                      <option key={cat.id} value={cat.name}>
                        {cat.icon} {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Date Filter */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1.5">Muddat</label>
                  <select
                    value={dateFilter}
                    onChange={(e) => {
                      setDateFilter(e.target.value as any)
                      if (e.target.value !== 'custom') {
                        setCustomStartDate('')
                        setCustomEndDate('')
                      }
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">Barcha vaqt</option>
                    <option value="today">Bugun</option>
                    <option value="week">Bu hafta</option>
                    <option value="month">Bu oy</option>
                    <option value="custom">Boshqa muddat</option>
                  </select>
                </div>

                {/* Custom Date Range */}
                {dateFilter === 'custom' && (
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1.5">Boshlanish</label>
                      <input
                        type="date"
                        value={customStartDate}
                        onChange={(e) => setCustomStartDate(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1.5">Tugash</label>
                      <input
                        type="date"
                        value={customEndDate}
                        onChange={(e) => setCustomEndDate(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex items-center justify-between pt-2 border-t border-gray-200">
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
                      className="text-sm text-red-600 hover:text-red-700 font-medium"
                    >
                      Tozalash
                    </button>
                  ) : (
                    <div />
                  )}
                  <button
                    onClick={() => setIsFilterOpen(false)}
                    className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Qo'llash
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Transactions List */}
      <div className="space-y-6">
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {filteredTransactions && filteredTransactions.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Sana
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Kategoriya
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Izoh
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Turi
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Summa
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amallar
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredTransactions.map((transaction) => (
                  <tr key={transaction.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatDate(transaction.transaction_date)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{transaction.category_icon || '💰'}</span>
                        <span className="text-sm font-medium text-gray-900">
                          {transaction.category_name || 'Boshqa'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">
                      {transaction.description || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2.5 py-1 text-xs font-semibold rounded-full ${
                          transaction.type === 'income'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {transaction.type === 'income' ? 'Kirim' : 'Chiqim'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <span
                        className={`text-sm font-semibold ${
                          transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                        }`}
                      >
                        {transaction.type === 'income' ? '+' : '-'}
                        {formatCurrency(transaction.amount)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <button
                        onClick={() => {
                          if (confirm("Tranzaksiyani o'chirmoqchimisiz?")) {
                            deleteMutation.mutate(transaction.id)
                          }
                        }}
                        className="text-red-600 hover:text-red-800 p-1 hover:bg-red-50 rounded transition-colors"
                        title="O'chirish"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Filter className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-500 font-medium">Tranzaksiya topilmadi</p>
            {hasActiveFilters && (
              <button
                onClick={() => {
                  setTypeFilter('all')
                  setCategoryFilter('')
                  setSearchQuery('')
                }}
                className="mt-4 text-sm text-blue-600 hover:underline"
              >
                Filtrlarni tozalash
              </button>
            )}
          </div>
        )}
      </div>
      </div>

      <AddTransactionDialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen} />
    </>
  )
}
