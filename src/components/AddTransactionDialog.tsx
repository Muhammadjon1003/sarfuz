import { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuthStore } from '@/store/authStore'
import { getCategories, createTransaction, updateTransaction, Transaction } from '@/lib/api'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faPenToSquare, faXmark } from '@fortawesome/free-solid-svg-icons'

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  editTransaction?: Transaction | null
}

export default function AddTransactionDialog({ open, onOpenChange, editTransaction }: Props) {
  const { telegramId } = useAuthStore()
  const queryClient = useQueryClient()
  const [type, setType] = useState<'income' | 'expense'>('expense')
  const [amount, setAmount] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [description, setDescription] = useState('')

  useEffect(() => {
    if (editTransaction) {
      setType(editTransaction.type)
      setAmount(editTransaction.amount.toString())
      setCategoryId(editTransaction.category_id ? editTransaction.category_id.toString() : '')
      setDescription(editTransaction.description || '')
    } else {
      resetForm()
    }
  }, [editTransaction, open])

  const { data: categories } = useQuery({
    queryKey: ['categories', telegramId, type],
    queryFn: () => getCategories(telegramId!, type).then((res) => res.data),
    enabled: !!telegramId && open,
  })

  const mutation = useMutation({
    mutationFn: (data: any) => {
      if (editTransaction) {
        return updateTransaction(telegramId!, editTransaction.id, data)
      }
      return createTransaction(telegramId!, data)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] })
      queryClient.invalidateQueries({ queryKey: ['summary'] })
      queryClient.invalidateQueries({ queryKey: ['category-breakdown'] })
      onOpenChange(false)
      resetForm()
    },
  })

  const resetForm = () => {
    setType('expense')
    setAmount('')
    setCategoryId('')
    setDescription('')
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    mutation.mutate({
      amount: parseFloat(amount),
      type,
      category_id: categoryId ? parseInt(categoryId) : null,
      description: description || null,
      transaction_date: editTransaction ? editTransaction.transaction_date : new Date().toISOString(),
    })
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <div className="glass-panel rounded-3xl border border-teal-500/30 max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl relative">
        <div className="flex items-center justify-between p-6 border-b border-teal-500/15 bg-teal-950/30">
          <h2 className="text-xl font-extrabold text-white flex items-center gap-3">
            <div className="p-2 rounded-xl bg-cyan-500/15 border border-cyan-400/30 text-cyan-300">
              <FontAwesomeIcon icon={editTransaction ? faPenToSquare : faPlus} className="w-5 h-5" />
            </div>
            {editTransaction ? "Amalni Tahrirlash" : "Amal Qo'shish"}
          </h2>
          <button
            onClick={() => onOpenChange(false)}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-teal-900/40 transition-colors"
          >
            <FontAwesomeIcon icon={faXmark} className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Type Toggle */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Turi</label>
            <div className="grid grid-cols-2 gap-3 p-1 rounded-xl bg-teal-950/60 border border-teal-500/20">
              <button
                type="button"
                onClick={() => setType('income')}
                className={`py-2.5 px-4 rounded-lg font-bold text-sm transition-all ${
                  type === 'income'
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 shadow-[0_0_15px_rgba(16,185,129,0.4)]'
                    : 'text-slate-400 hover:text-white hover:bg-teal-900/30'
                }`}
              >
                + Daromad
              </button>
              <button
                type="button"
                onClick={() => setType('expense')}
                className={`py-2.5 px-4 rounded-lg font-bold text-sm transition-all ${
                  type === 'expense'
                    ? 'bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-[0_0_15px_rgba(244,63,94,0.4)]'
                    : 'text-slate-400 hover:text-white hover:bg-teal-900/30'
                }`}
              >
                - Chiqim
              </button>
            </div>
          </div>

          {/* Amount Input */}
          <div>
            <label htmlFor="amount" className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              Summa (so'm)
            </label>
            <div className="relative">
              <input
                type="number"
                id="amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="w-full px-4 py-3 bg-teal-950/50 border border-teal-500/20 rounded-xl text-white font-bold text-lg focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20 placeholder:text-slate-600"
                required
                min="0"
                step="0.01"
              />
              <span className="absolute right-4 top-3.5 text-xs text-teal-400/60 font-semibold">UZS</span>
            </div>
          </div>

          {/* Category Select */}
          <div>
            <label htmlFor="category" className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              Kategoriya
            </label>
            <select
              id="category"
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full px-4 py-3 bg-teal-950/50 border border-teal-500/20 rounded-xl text-white font-medium text-sm focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20"
            >
              <option value="" className="bg-[#071d24] text-slate-300">Tanlang...</option>
              {categories?.map((cat) => (
                <option key={cat.id} value={cat.id} className="bg-[#071d24] text-slate-200">
                  {cat.icon} {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              Izoh (ixtiyoriy)
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder="Amal haqida qisqacha..."
              className="w-full px-4 py-3 bg-teal-950/50 border border-teal-500/20 rounded-xl text-white text-sm focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20 placeholder:text-slate-600"
            />
          </div>

          {/* Submit Action */}
          <button
            type="submit"
            disabled={mutation.isPending}
            className="w-full bg-gradient-to-r from-teal-400 via-cyan-400 to-sky-400 hover:from-teal-300 hover:to-sky-300 text-slate-950 font-black py-3.5 px-4 rounded-xl text-sm shadow-[0_0_20px_rgba(0,242,254,0.3)] transition-all disabled:opacity-50"
          >
            {mutation.isPending ? 'Saqlanmoqda...' : editTransaction ? "O'zgarishlarni Saqlash" : 'Amalni Saqlash'}
          </button>
        </form>
      </div>
    </div>
  )
}
