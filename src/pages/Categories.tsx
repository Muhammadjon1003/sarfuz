import { useState } from 'react'
import { createPortal } from 'react-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuthStore } from '@/store/authStore'
import { getCategories, createCategory, deleteCategory } from '@/lib/api'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  faPlus, 
  faTrashCan, 
  faArrowTrendUp, 
  faArrowTrendDown, 
  faWandMagicSparkles, 
  faXmark 
} from '@fortawesome/free-solid-svg-icons'
import Loader from '@/components/Loader'
import { CategoryIcon } from '@/lib/categoryIcons'

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
    return <Loader />
  }

  return (
    <>
      {/* Portal action button */}
      {pageActionsContainer && createPortal(
        <button
          onClick={() => setIsAddDialogOpen(true)}
          className="flex items-center gap-1.5 bg-gradient-to-r from-teal-400 to-cyan-400 hover:from-teal-300 hover:to-cyan-300 text-slate-950 font-bold px-3.5 py-2 rounded-xl text-xs sm:text-sm transition-all shadow-[0_0_15px_rgba(0,242,254,0.3)]"
        >
          <FontAwesomeIcon icon={faPlus} className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Yangi Kategoriya</span>
        </button>,
        pageActionsContainer
      )}

      <div className="space-y-6">
        {/* Categories Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Income Categories */}
          <div className="glass-panel rounded-3xl p-6 border border-teal-500/20 shadow-2xl">
            <h2 className="text-lg font-bold text-white mb-5 flex items-center gap-3 border-b border-teal-500/15 pb-3">
              <div className="p-2 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.2)]">
                <FontAwesomeIcon icon={faArrowTrendUp} className="w-5 h-5" />
              </div>
              Daromad Kategoriyalari
            </h2>
            <div className="space-y-3">
              {incomeCategories.length > 0 ? (
                incomeCategories.map((category) => (
                  <div
                    key={category.id}
                    className="flex items-center justify-between p-3.5 bg-teal-950/40 border border-teal-500/10 rounded-2xl hover:border-cyan-500/30 transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center text-lg font-bold border border-white/10 shadow-sm text-cyan-300"
                        style={{ backgroundColor: (category.color || '#00f2fe') + '25' }}
                      >
                        <CategoryIcon name={category.name} icon={category.icon} className="w-4 h-4 text-cyan-300" />
                      </div>
                      <div>
                        <p className="font-bold text-slate-100 text-sm group-hover:text-cyan-300 transition-colors">{category.name}</p>
                        {category.is_default && (
                          <p className="text-[11px] text-teal-400/60 font-medium">Tizim kiritgan</p>
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
                        className="text-slate-400 hover:text-rose-400 p-2 hover:bg-rose-500/10 rounded-xl transition-colors"
                      >
                        <FontAwesomeIcon icon={faTrashCan} className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-slate-400 text-center py-10 text-sm">Kategoriya yo'q</p>
              )}
            </div>
          </div>

          {/* Expense Categories */}
          <div className="glass-panel rounded-3xl p-6 border border-teal-500/20 shadow-2xl">
            <h2 className="text-lg font-bold text-white mb-5 flex items-center gap-3 border-b border-teal-500/15 pb-3">
              <div className="p-2 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-400 shadow-[0_0_10px_rgba(244,63,94,0.2)]">
                <FontAwesomeIcon icon={faArrowTrendDown} className="w-5 h-5" />
              </div>
              Chiqim Kategoriyalari
            </h2>
            <div className="space-y-3">
              {expenseCategories.length > 0 ? (
                expenseCategories.map((category) => (
                  <div
                    key={category.id}
                    className="flex items-center justify-between p-3.5 bg-teal-950/40 border border-teal-500/10 rounded-2xl hover:border-cyan-500/30 transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center text-lg font-bold border border-white/10 shadow-sm text-rose-400"
                        style={{ backgroundColor: (category.color || '#f43f5e') + '25' }}
                      >
                        <CategoryIcon name={category.name} icon={category.icon} className="w-4 h-4 text-rose-400" />
                      </div>
                      <div>
                        <p className="font-bold text-slate-100 text-sm group-hover:text-cyan-300 transition-colors">{category.name}</p>
                        {category.is_default && (
                          <p className="text-[11px] text-teal-400/60 font-medium">Tizim kiritgan</p>
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
                        className="text-slate-400 hover:text-rose-400 p-2 hover:bg-rose-500/10 rounded-xl transition-colors"
                      >
                        <FontAwesomeIcon icon={faTrashCan} className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-slate-400 text-center py-10 text-sm">Kategoriya yo'q</p>
              )}
            </div>
          </div>
        </div>

        {/* Add Category Modal Dialog */}
        {isAddDialogOpen && (
          <div className="fixed inset-0 bg-black/75 backdrop-blur-md flex items-center justify-center z-50 p-4">
            <div className="glass-panel rounded-3xl border border-teal-500/30 max-w-md w-full shadow-2xl overflow-hidden relative">
              <div className="flex items-center justify-between p-6 border-b border-teal-500/15 bg-teal-950/30">
                <h2 className="text-xl font-extrabold text-white flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-cyan-500/15 border border-cyan-400/30 text-cyan-300">
                    <FontAwesomeIcon icon={faWandMagicSparkles} className="w-5 h-5" />
                  </div>
                  Yangi Kategoriya
                </h2>
                <button
                  onClick={() => setIsAddDialogOpen(false)}
                  className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-teal-900/30"
                >
                  <FontAwesomeIcon icon={faXmark} className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-5">
                {/* Type Selection */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Turi</label>
                  <div className="grid grid-cols-2 gap-3 p-1 rounded-xl bg-teal-950/60 border border-teal-500/20">
                    <button
                      type="button"
                      onClick={() => setNewCategory({ ...newCategory, type: 'income' })}
                      className={`py-2.5 px-4 rounded-lg font-bold text-sm transition-all ${
                        newCategory.type === 'income'
                          ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 shadow-[0_0_15px_rgba(16,185,129,0.4)]'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      + Daromad
                    </button>
                    <button
                      type="button"
                      onClick={() => setNewCategory({ ...newCategory, type: 'expense' })}
                      className={`py-2.5 px-4 rounded-lg font-bold text-sm transition-all ${
                        newCategory.type === 'expense'
                          ? 'bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-[0_0_15px_rgba(244,63,94,0.4)]'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      - Chiqim
                    </button>
                  </div>
                </div>

                {/* Name */}
                <div>
                  <label htmlFor="name" className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                    Kategoriya Nomi
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={newCategory.name}
                    onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                    className="w-full px-4 py-3 bg-teal-950/50 border border-teal-500/20 rounded-xl text-white text-sm focus:border-cyan-400 focus:outline-none placeholder:text-slate-600"
                    placeholder="Masalan: Maosh, Oziq-ovqat..."
                    required
                  />
                </div>

                {/* Icon */}
                <div>
                  <label htmlFor="icon" className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                    Emoji / Belgisi
                  </label>
                  <input
                    type="text"
                    id="icon"
                    value={newCategory.icon}
                    onChange={(e) => setNewCategory({ ...newCategory, icon: e.target.value })}
                    className="w-full px-4 py-3 bg-teal-950/50 border border-teal-500/20 rounded-xl text-white text-lg focus:border-cyan-400 focus:outline-none"
                    placeholder="📦"
                  />
                </div>

                {/* Color Picker */}
                <div>
                  <label htmlFor="color" className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                    Rangini Tanlang
                  </label>
                  <input
                    type="color"
                    id="color"
                    value={newCategory.color}
                    onChange={(e) => setNewCategory({ ...newCategory, color: e.target.value })}
                    className="w-full h-12 bg-teal-950/50 border border-teal-500/20 rounded-xl cursor-pointer p-1"
                  />
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={createMutation.isPending}
                  className="w-full bg-gradient-to-r from-teal-400 via-cyan-400 to-sky-400 hover:from-teal-300 hover:to-sky-300 text-slate-950 font-black py-3.5 px-4 rounded-xl text-sm shadow-[0_0_20px_rgba(0,242,254,0.3)] transition-all disabled:opacity-50"
                >
                  {createMutation.isPending ? 'Saqlanmoqda...' : 'Kategoriyani Yaratish'}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
