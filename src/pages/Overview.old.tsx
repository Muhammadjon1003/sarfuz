import { useQuery } from '@tanstack/react-query'
import { useAuthStore } from '@/store/authStore'
import { getSummary, getTransactions, getCategoryBreakdown } from '@/lib/api'
import { formatCurrency, formatDate } from '@/lib/utils'
import { TrendingUp, TrendingDown, DollarSign, Receipt, Plus } from 'lucide-react'
import { useState } from 'react'
import AddTransactionDialog from '@/components/AddTransactionDialog'

export default function Overview() {
  const { telegramId } = useAuthStore()
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)

  // Don't filter by date - show all data
  const { data: summary, isLoading: summaryLoading } = useQuery({
    queryKey: ['summary', telegramId],
    queryFn: () => getSummary(telegramId!).then((res) => res.data),
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

  if (summaryLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  const hasData = summary && summary.transaction_count > 0

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Umumiy ko'rinish</h1>
          <p className="text-gray-600 mt-1">Barcha tranzaksiyalar</p>
        </div>
        <button
          onClick={() => setIsAddDialogOpen(true)}
          className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Tranzaksiya qo'shish
        </button>
      </div>

      {!hasData ? (
        /* Empty State */
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <Receipt className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">
            Hali tranzaksiya yo'q
          </h2>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            Birinchi tranzaksiyangizni qo'shing. Telegram bot orqali ovozli xabar yuboring yoki
            yuqoridagi tugmani bosing.
          </p>
          <button
            onClick={() => setIsAddDialogOpen(true)}
            className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors inline-flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Birinchi tranzaksiya
          </button>
        </div>
      ) : (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Income */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-green-100 rounded-lg">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                </div>
                {summary.income_change !== undefined && (
                  <span
                    className={`text-sm font-medium ${
                      summary.income_change >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}
                  >
                    {summary.income_change >= 0 ? '+' : ''}
                    {summary.income_change.toFixed(1)}%
                  </span>
                )}
              </div>
              <h3 className="text-sm font-medium text-gray-600 mb-1">Kirim</h3>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(summary.total_income)}
              </p>
            </div>

            {/* Expense */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-red-100 rounded-lg">
                  <TrendingDown className="w-6 h-6 text-red-600" />
                </div>
                {summary.expense_change !== undefined && (
                  <span
                    className={`text-sm font-medium ${
                      summary.expense_change <= 0 ? 'text-green-600' : 'text-red-600'
                    }`}
                  >
                    {summary.expense_change >= 0 ? '+' : ''}
                    {summary.expense_change.toFixed(1)}%
                  </span>
                )}
              </div>
              <h3 className="text-sm font-medium text-gray-600 mb-1">Chiqim</h3>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(summary.total_expense)}
              </p>
            </div>

            {/* Net */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <DollarSign className="w-6 h-6 text-blue-600" />
                </div>
              </div>
              <h3 className="text-sm font-medium text-gray-600 mb-1">Sof foyda</h3>
              <p
                className={`text-2xl font-bold ${
                  summary.net >= 0 ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {formatCurrency(summary.net)}
              </p>
            </div>
          </div>

          {/* Recent Transactions & Top Expenses */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Transactions */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Oxirgi tranzaksiyalar
              </h2>
              {recentTransactions && recentTransactions.length > 0 ? (
                <div className="space-y-3">
                  {recentTransactions.map((transaction) => (
                    <div
                      key={transaction.id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="w-10 h-10 rounded-lg flex items-center justify-center text-xl"
                          style={{ backgroundColor: transaction.category_color + '20' }}
                        >
                          {transaction.category_icon || '💰'}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            {transaction.category_name || 'Boshqa'}
                          </p>
                          <p className="text-sm text-gray-500">
                            {formatDate(transaction.transaction_date)}
                          </p>
                        </div>
                      </div>
                      <span
                        className={`font-semibold ${
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
                <p className="text-gray-500 text-center py-8">Tranzaksiya yo'q</p>
              )}
            </div>

            {/* Top Expenses */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Eng ko'p xarajatlar
              </h2>
              {topExpenses && topExpenses.length > 0 ? (
                <div className="space-y-3">
                  {topExpenses.slice(0, 5).map((item, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">{item.icon || '💸'}</span>
                          <span className="font-medium text-gray-900">{item.category}</span>
                        </div>
                        <span className="font-semibold text-gray-900">
                          {formatCurrency(item.total)}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="h-2 rounded-full"
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
                <p className="text-gray-500 text-center py-8">Ma'lumot yo'q</p>
              )}
            </div>
          </div>
        </>
      )}

      <AddTransactionDialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen} />
    </div>
  )
}
