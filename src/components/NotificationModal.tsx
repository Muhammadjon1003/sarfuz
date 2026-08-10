import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { useAuthStore } from '@/store/authStore'
import { getForecastWarnings, getOverdueDebts } from '@/lib/api'
import { formatCurrency } from '@/lib/utils'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faBell,
  faTriangleExclamation,
  faCircleCheck,
  faClock,
  faXmark,
  faChevronRight,
  faShieldHalved,
} from '@fortawesome/free-solid-svg-icons'

export default function NotificationModal() {
  const { telegramId } = useAuthStore()
  const [isOpen, setIsOpen] = useState(false)
  const popoverRef = useRef<HTMLDivElement>(null)

  // Fetch forecast warnings
  const { data: forecastWarnings } = useQuery({
    queryKey: ['forecast-warnings', telegramId],
    queryFn: () => getForecastWarnings(telegramId!, 30).then((res) => res.data),
    enabled: !!telegramId,
  })

  // Fetch overdue debts
  const { data: overdueDebts } = useQuery({
    queryKey: ['overdue-debts', telegramId],
    queryFn: () => getOverdueDebts(telegramId!).then((res) => res.data),
    enabled: !!telegramId,
  })

  const warningsList = forecastWarnings?.warnings || []
  const debtsList = overdueDebts || []

  const totalNotifications = warningsList.length + debtsList.length

  // Close popover on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  return (
    <div className="relative" ref={popoverRef}>
      {/* Bell Action Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2.5 rounded-xl bg-teal-950/40 border border-teal-500/20 text-slate-300 hover:text-cyan-300 hover:border-cyan-400/40 transition-all group"
        title="Bildirishnomalar"
      >
        <FontAwesomeIcon icon={faBell} className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform" />
        
        {totalNotifications > 0 ? (
          <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-rose-500 text-[9px] font-black text-white items-center justify-center">
              {totalNotifications}
            </span>
          </span>
        ) : (
          <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(16,185,129,0.8)]"></span>
        )}
      </button>

      {/* Notification Dropdown Popover */}
      {isOpen && (
        <div className="absolute right-0 mt-3 w-[calc(100vw-2rem)] max-w-sm sm:w-96 z-50 glass-panel rounded-3xl border border-teal-500/30 shadow-2xl p-5 animate-in fade-in slide-in-from-top-2 duration-200">
          {/* Header */}
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-teal-500/15">
            <div className="flex items-center gap-2">
              <FontAwesomeIcon icon={faBell} className="w-4 h-4 text-cyan-400" />
              <h3 className="font-bold text-white text-sm">Bildirishnomalar</h3>
              {totalNotifications > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 border border-cyan-400/30 text-[10px] font-bold text-cyan-300">
                  {totalNotifications} ta yangi
                </span>
              )}
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-teal-900/40 transition-colors"
            >
              <FontAwesomeIcon icon={faXmark} className="w-4 h-4" />
            </button>
          </div>

          {/* Body List */}
          <div className="space-y-3 max-h-[360px] overflow-y-auto pr-1">
            {/* Forecast Financial Risk Warnings */}
            {warningsList.map((warning, index) => (
              <div
                key={index}
                className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/25 flex items-start gap-3 group hover:border-amber-400/50 transition-all"
              >
                <div className="p-2 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-400/30 flex-shrink-0">
                  <FontAwesomeIcon icon={faTriangleExclamation} className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-amber-200 truncate">{warning.title}</p>
                  <p className="text-[11px] text-amber-100/70 mt-0.5 line-clamp-2">{warning.message}</p>
                  <Link
                    to="/forecasting"
                    onClick={() => setIsOpen(false)}
                    className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-300 hover:text-amber-200 mt-2"
                  >
                    <span>Prognozni ko'rish</span>
                    <FontAwesomeIcon icon={faChevronRight} className="w-2.5 h-2.5" />
                  </Link>
                </div>
              </div>
            ))}

            {/* Overdue Debts Notifications */}
            {debtsList.map((debt) => (
              <div
                key={debt.id}
                className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/25 flex items-start gap-3 group hover:border-rose-400/50 transition-all"
              >
                <div className="p-2 rounded-xl bg-rose-500/20 text-rose-300 border border-rose-400/30 flex-shrink-0">
                  <FontAwesomeIcon icon={faClock} className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-bold text-rose-200 truncate">{debt.person_name}</p>
                    <span className="text-[10px] font-mono font-bold text-rose-300">
                      {formatCurrency(debt.remaining_amount)}
                    </span>
                  </div>
                  <p className="text-[11px] text-rose-100/70 mt-0.5">
                    Qaytarish muddati o'tib ketgan
                  </p>
                  <Link
                    to="/debts"
                    onClick={() => setIsOpen(false)}
                    className="inline-flex items-center gap-1 text-[10px] font-bold text-rose-300 hover:text-rose-200 mt-2"
                  >
                    <span>Qarzlarni boshqarish</span>
                    <FontAwesomeIcon icon={faChevronRight} className="w-2.5 h-2.5" />
                  </Link>
                </div>
              </div>
            ))}

            {/* All clear state */}
            {totalNotifications === 0 && (
              <div className="text-center py-8 px-4 bg-emerald-500/5 border border-emerald-500/20 rounded-2xl">
                <div className="w-12 h-12 bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 rounded-2xl flex items-center justify-center mx-auto mb-3">
                  <FontAwesomeIcon icon={faCircleCheck} className="w-6 h-6" />
                </div>
                <p className="text-sm font-bold text-emerald-300">Barchasi joyida!</p>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  Moliyaviy xavflar va kechikkan qarzlar mavjud emas.
                </p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="pt-3 mt-4 border-t border-teal-500/15 flex items-center justify-between text-[11px] text-slate-400">
            <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
              <FontAwesomeIcon icon={faShieldHalved} className="w-3.5 h-3.5" /> Himoyalangan
            </span>
            <Link
              to="/forecasting"
              onClick={() => setIsOpen(false)}
              className="text-cyan-400 hover:text-cyan-300 font-semibold transition-colors"
            >
              Tahlillar Sahifasi →
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
