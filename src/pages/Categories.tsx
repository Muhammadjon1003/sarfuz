import { useState } from 'react'
import { createPortal } from 'react-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuthStore } from '@/store/authStore'
import { getCategories, createCategory, deleteCategory } from '@/lib/api'
import { Plus, Trash2 } from 'lucide-react'

export default function Categories() {
  const { telegramId } = useAuthStore()
  const queryClient = useQueryClient()
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [newCategory, setNewCategory] = useState({
    name: '',
    type: 'expense' as 'income' | 'expense',
    icon: '📦',
    color: '#3b82f6',
  })

  const { data: categories, isLoading } = useQuery({
    queryKey: ['categories', telegramId],
    queryFn: () => getCategories(telegramId!).then((res) => res.data),
    enabled: !!telegramId,
  })

  const createMutation = useMutation({
    mutationFn: (data: any) => createCategory(telegramId!, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] })
      setIsAddDialogOpen(false)
      setNewCategory({ name: '', type: 'expense', icon: '📦', color: '#3b82f6' })
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteCategory(telegramId!, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] })
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    createMutation.mutate(newCategory)
  }

  const incomeCategories = categories?.filter((c) => c.type === 'income') || []
  const expenseCategories = categories?.filter((c) => c.type === 'expense') || []

  const pageActionsContainer = document.getElementById('page-actions')

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <>
      {/* Render button in portal */}
      {pageActionsContainer && createPortal(
        <button
          onClick={() => setIsAddDialogOpen(true)}
          className="flex items-center gap-1.5 text-gray-600 hover:text-gray-900 px-3 py-1.5 rounded-md hover:bg-gray-100 transition-colors text-sm font-medium"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">Yangi</span>
        </button>,
        pageActionsContainer
      )}

      <div className="space-y-6">

      {/* Categories Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Income Categories */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <span className="text-green-600">💰</span>
            Kirim kategoriyalari
          </h2>
          <div className="space-y-2">
            {incomeCategories.length > 0 ? (
              incomeCategories.map((category) => (
                <div
                  key={category.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center text-xl"
                      style={{ backgroundColor: category.color + '20' }}
                    >
                      {category.icon || '📁'}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{category.name}</p>
                      {category.is_default && (
                        <p className="text-xs text-gray-500">Standart</p>
                      )}
                    </div>
                  </div>
                  {!category.is_default && (
                    <button
                      onClick={() => {
                        if (confirm("Kategoriyani o'chirmoqchimisiz?")) {
                          deleteMutation.mutate(category.id)
                        }
                      }}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-8">Kategoriya yo'q</p>
            )}
          </div>
        </div>

        {/* Expense Categories */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <span className="text-red-600">💸</span>
            Chiqim kategoriyalari
          </h2>
          <div className="space-y-2">
            {expenseCategories.length > 0 ? (
              expenseCategories.map((category) => (
                <div
                  key={category.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center text-xl"
                      style={{ backgroundColor: category.color + '20' }}
                    >
                      {category.icon || '📁'}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{category.name}</p>
                      {category.is_default && (
                        <p className="text-xs text-gray-500">Standart</p>
                      )}
                    </div>
                  </div>
                  {!category.is_default && (
                    <button
                      onClick={() => {
                        if (confirm("Kategoriyani o'chirmoqchimisiz?")) {
                          deleteMutation.mutate(category.id)
                        }
                      }}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-8">Kategoriya yo'q</p>
            )}
          </div>
        </div>
      </div>

      {/* Add Category Dialog */}
      {isAddDialogOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold">Yangi kategoriya</h2>
              <button
                onClick={() => setIsAddDialogOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Turi</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setNewCategory({ ...newCategory, type: 'income' })}
                    className={`py-2 px-4 rounded-lg font-medium transition-colors ${
                      newCategory.type === 'income'
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Kirim
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewCategory({ ...newCategory, type: 'expense' })}
                    className={`py-2 px-4 rounded-lg font-medium transition-colors ${
                      newCategory.type === 'expense'
                        ? 'bg-red-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Chiqim
                  </button>
                </div>
              </div>

              {/* Name */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Nomi
                </label>
                <input
                  type="text"
                  id="name"
                  value={newCategory.name}
                  onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  required
                />
              </div>

              {/* Icon */}
              <div>
                <label htmlFor="icon" className="block text-sm font-medium text-gray-700 mb-2">
                  Emoji
                </label>
                <input
                  type="text"
                  id="icon"
                  value={newCategory.icon}
                  onChange={(e) => setNewCategory({ ...newCategory, icon: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="📦"
                />
              </div>

              {/* Color */}
              <div>
                <label htmlFor="color" className="block text-sm font-medium text-gray-700 mb-2">
                  Rang
                </label>
                <input
                  type="color"
                  id="color"
                  value={newCategory.color}
                  onChange={(e) => setNewCategory({ ...newCategory, color: e.target.value })}
                  className="w-full h-10 border border-gray-300 rounded-lg cursor-pointer"
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={createMutation.isPending}
                className="w-full bg-primary text-white py-2 px-4 rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
              >
                {createMutation.isPending ? 'Saqlanmoqda...' : 'Saqlash'}
              </button>
            </form>
          </div>
        </div>
      )}
      </div>
    </>
  )
}
