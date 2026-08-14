import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuthStore } from '@/store/authStore'
import { createDebt } from '@/lib/api'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark, faUserGroup } from '@fortawesome/free-solid-svg-icons'

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function AddDebtDialog({ open, onOpenChange }: Props) {
  const { telegramId } = useAuthStore()
  const queryClient = useQueryClient()

  const [type, setType] = useState<'borrowed' | 'lent'>('borrowed')
  const [personName, setPersonName] = useState('')
  const [personPhone, setPersonPhone] = useState('')
  const [amount, setAmount] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [description, setDescription] = useState('')

  const mutation = useMutation({
    mutationFn: (data: any) => createDebt(telegramId!, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['debts'] })
      queryClient.invalidateQueries({ queryKey: ['debt-summary'] })
      onOpenChange(false)
      resetForm()
    },
  })

  const resetForm = () => {
    setPersonName('')
    setPersonPhone('')
    setAmount('')
    setDueDate('')
    setDescription('')
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    mutation.mutate({
      type,
      person_name: personName,
      person_phone: personPhone || undefined,
      amount: parseFloat(amount),
      debt_date: new Date().toISOString(),
      due_date: dueDate ? new Date(dueDate).toISOString() : undefined,
      description: description || undefined,
    })
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <div className="glass-panel rounded-3xl border border-teal-500/30 max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl relative">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-teal-500/15 bg-teal-950/30">
          <h2 className="text-xl font-extrabold text-white flex items-center gap-3">
            <div className="p-2 rounded-xl bg-cyan-500/15 border border-cyan-400/30 text-cyan-300">
              <FontAwesomeIcon icon={faUserGroup} className="w-5 h-5" />
            </div>
            Qarz Yozuvini Qo'shish
          </h2>
          <button
            onClick={() => onOpenChange(false)}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-teal-900/40 transition-colors"
          >
            <FontAwesomeIcon icon={faXmark} className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Type Toggle */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Qarz Turi</label>
            <div className="grid grid-cols-2 gap-3 p-1 rounded-xl bg-teal-950/60 border border-teal-500/20">
              <button
                type="button"
                onClick={() => setType('borrowed')}
                className={`py-2.5 px-4 rounded-lg font-bold text-xs sm:text-sm transition-all ${
                  type === 'borrowed'
                    ? 'bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-[0_0_15px_rgba(244,63,94,0.4)]'
                    : 'text-slate-400 hover:text-white hover:bg-teal-900/30'
                }`}
              >
                Men qarz oldim
              </button>
              <button
                type="button"
                onClick={() => setType('lent')}
                className={`py-2.5 px-4 rounded-lg font-bold text-xs sm:text-sm transition-all ${
                  type === 'lent'
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 shadow-[0_0_15px_rgba(16,185,129,0.4)]'
                    : 'text-slate-400 hover:text-white hover:bg-teal-900/30'
                }`}
              >
                Men qarz berdim
              </button>
            </div>
          </div>

          {/* Person Name */}
          <div>
            <label htmlFor="personName" className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
              Kimdan / Kimga (Shaxs ismi)
            </label>
            <input
              type="text"
              id="personName"
              value={personName}
              onChange={(e) => setPersonName(e.target.value)}
              placeholder="Masalan: Alisher Vahobov"
              className="w-full px-4 py-2.5 bg-teal-950/50 border border-teal-500/20 rounded-xl text-white font-medium text-sm focus:outline-none focus:border-cyan-400 placeholder:text-slate-600"
              required
            />
          </div>

          {/* Person Phone */}
          <div>
            <label htmlFor="personPhone" className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
              Telefon raqami (ixtiyoriy)
            </label>
            <input
              type="text"
              id="personPhone"
              value={personPhone}
              onChange={(e) => setPersonPhone(e.target.value)}
              placeholder="+998 90 123 45 67"
              className="w-full px-4 py-2.5 bg-teal-950/50 border border-teal-500/20 rounded-xl text-white font-medium text-sm focus:outline-none focus:border-cyan-400 placeholder:text-slate-600 font-mono"
            />
          </div>

          {/* Amount */}
          <div>
            <label htmlFor="debtAmount" className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
              Summa (so'm)
            </label>
            <div className="relative">
              <input
                type="number"
                id="debtAmount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="w-full px-4 py-2.5 bg-teal-950/50 border border-teal-500/20 rounded-xl text-white font-bold text-lg focus:outline-none focus:border-cyan-400 placeholder:text-slate-600"
                required
                min="0"
                step="0.01"
              />
              <span className="absolute right-4 top-3 text-xs text-teal-400/60 font-semibold">UZS</span>
            </div>
          </div>

          {/* Due Date */}
          <div>
            <label htmlFor="dueDate" className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
              Qaytarish muddati (ixtiyoriy)
            </label>
            <input
              type="date"
              id="dueDate"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full px-4 py-2.5 bg-teal-950/50 border border-teal-500/20 rounded-xl text-white font-medium text-sm focus:outline-none focus:border-cyan-400"
            />
          </div>

          {/* Description */}
          <div>
            <label htmlFor="debtDescription" className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
              Izoh (ixtiyoriy)
            </label>
            <textarea
              id="debtDescription"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              placeholder="Qarz haqida izoh..."
              className="w-full px-4 py-2.5 bg-teal-950/50 border border-teal-500/20 rounded-xl text-white text-sm focus:outline-none focus:border-cyan-400 placeholder:text-slate-600"
            />
          </div>

          {/* Submit Action */}
          <button
            type="submit"
            disabled={mutation.isPending}
            className="w-full mt-2 btn-bluish bg-gradient-to-r from-teal-400 via-cyan-400 to-sky-400 hover:from-teal-300 hover:to-sky-300 text-slate-950 font-black py-3.5 px-4 rounded-xl text-sm shadow-[0_0_20px_rgba(0,242,254,0.3)] transition-all disabled:opacity-50"
          >
            {mutation.isPending ? 'Saqlanmoqda...' : 'Qarzni Saqlash'}
          </button>
        </form>
      </div>
    </div>
  )
}
