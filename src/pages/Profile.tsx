import { useQuery } from '@tanstack/react-query'
import { useAuthStore } from '@/store/authStore'
import { getSummary } from '@/lib/api'
import { formatCurrency } from '@/lib/utils'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faUser,
  faRightFromBracket,
  faShieldHalved,
  faPaperPlane,
  faCheckCircle,
  faBolt,
  faWallet,
  faArrowTrendUp,
  faArrowTrendDown,
  faClock
} from '@fortawesome/free-solid-svg-icons'
import Loader from '@/components/Loader'

export default function Profile() {
  const { user, telegramId, logout } = useAuthStore()

  const { data: summary, isLoading } = useQuery({
    queryKey: ['summary', telegramId],
    queryFn: () => getSummary(telegramId!).then((res) => res.data),
    enabled: !!telegramId,
  })

  if (isLoading) {
    return <Loader />
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header Profile Hero Card */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-teal-500/20 shadow-2xl relative overflow-hidden">
        {/* Glow accent behind avatar */}
        <div className="absolute -top-24 -left-24 w-64 h-64 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex flex-col sm:flex-row items-center gap-6 relative z-10 text-center sm:text-left">
          {/* Avatar */}
          {user?.photo_url ? (
            <img
              src={user.photo_url}
              alt={user.first_name || 'Profile'}
              className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl object-cover border-2 border-cyan-400/50 shadow-[0_0_25px_rgba(6,182,212,0.4)] flex-shrink-0"
            />
          ) : user?.first_name ? (
            <img
              src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.first_name + ' ' + (user.last_name || ''))}&background=06b6d4&color=ffffff&bold=true`}
              alt={user.first_name}
              className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl object-cover border-2 border-cyan-400/50 shadow-[0_0_25px_rgba(6,182,212,0.4)] flex-shrink-0"
            />
          ) : (
            <div className="w-24 h-24 sm:w-28 sm:h-28 bg-gradient-to-br from-cyan-500/30 to-teal-500/20 border-2 border-cyan-400/40 rounded-3xl flex items-center justify-center text-cyan-300 shadow-[0_0_25px_rgba(6,182,212,0.3)] flex-shrink-0">
              <FontAwesomeIcon icon={faUser} className="w-12 h-12" />
            </div>
          )}

          {/* Details */}
          <div className="flex-1 min-w-0">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/15 border border-emerald-400/30 rounded-full text-xs font-bold text-emerald-300 mb-3">
              <FontAwesomeIcon icon={faCheckCircle} className="w-3.5 h-3.5 text-emerald-400" />
              Hisob Faol • Telegram Bot Sync
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              {user ? `${user.first_name} ${user.last_name || ''}` : 'Telegram Foydalanuvchisi'}
            </h1>
            <p className="text-sm text-cyan-400 font-mono mt-1">
              @{user?.username || telegramId || 'Ulanmagan'}
            </p>
          </div>

          {/* Logout button */}
          <button
            onClick={() => {
              if (confirm("Hisobdan chiqmoqchimisiz?")) {
                logout()
              }
            }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-300 font-bold text-xs hover:bg-rose-500/25 transition-all shadow-lg shadow-rose-500/10 flex-shrink-0"
          >
            <FontAwesomeIcon icon={faRightFromBracket} className="w-4 h-4" />
            <span>Hisobdan chiqish</span>
          </button>
        </div>
      </div>

      {/* Summary Financial Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="glass-panel p-5 rounded-3xl border border-teal-500/20">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Joriy Balans</span>
            <div className="w-9 h-9 rounded-xl bg-cyan-500/15 border border-cyan-400/30 flex items-center justify-center text-cyan-300">
              <FontAwesomeIcon icon={faWallet} className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-white">
            {formatCurrency(summary?.net || 0)}
          </p>
        </div>

        <div className="glass-panel p-5 rounded-3xl border border-teal-500/20">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Jami Daromad</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-500/15 border border-emerald-400/30 flex items-center justify-center text-emerald-400">
              <FontAwesomeIcon icon={faArrowTrendUp} className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-emerald-400">
            {formatCurrency(summary?.total_income || 0)}
          </p>
        </div>

        <div className="glass-panel p-5 rounded-3xl border border-teal-500/20">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Jami Chiqim</span>
            <div className="w-9 h-9 rounded-xl bg-rose-500/15 border border-rose-400/30 flex items-center justify-center text-rose-400">
              <FontAwesomeIcon icon={faArrowTrendDown} className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-rose-400">
            {formatCurrency(summary?.total_expense || 0)}
          </p>
        </div>
      </div>

      {/* Profile Details & System Preferences Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Connection Details */}
        <div className="glass-panel p-6 rounded-3xl border border-teal-500/20 space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2 border-b border-teal-500/15 pb-3">
            <FontAwesomeIcon icon={faPaperPlane} className="w-4 h-4 text-cyan-400" />
            Ulanish Ma'lumotlari
          </h3>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-teal-950/40 border border-teal-500/15 text-sm">
              <span className="text-slate-400 font-medium">Telegram ID:</span>
              <span className="font-mono font-bold text-cyan-300">{telegramId || '-'}</span>
            </div>

            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-teal-950/40 border border-teal-500/15 text-sm">
              <span className="text-slate-400 font-medium">Foydalanuvchi nomi:</span>
              <span className="font-semibold text-slate-200">@{user?.username || 'Mavjud emas'}</span>
            </div>

            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-teal-950/40 border border-teal-500/15 text-sm">
              <span className="text-slate-400 font-medium">Til:</span>
              <span className="font-semibold text-slate-200">O'zbek tili (UZ)</span>
            </div>
          </div>
        </div>

        {/* System & Security Status */}
        <div className="glass-panel p-6 rounded-3xl border border-teal-500/20 space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2 border-b border-teal-500/15 pb-3">
            <FontAwesomeIcon icon={faShieldHalved} className="w-4 h-4 text-cyan-400" />
            Tizim & Xavfsizlik
          </h3>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-teal-950/40 border border-teal-500/15 text-sm">
              <span className="text-slate-400 font-medium flex items-center gap-2">
                <FontAwesomeIcon icon={faBolt} className="w-4 h-4 text-emerald-400" />
                Tizim Holati:
              </span>
              <span className="font-bold text-emerald-400">Onlayn • Real-vaqt</span>
            </div>

            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-teal-950/40 border border-teal-500/15 text-sm">
              <span className="text-slate-400 font-medium flex items-center gap-2">
                <FontAwesomeIcon icon={faClock} className="w-4 h-4 text-cyan-400" />
                Avto-Sinxronizatsiya:
              </span>
              <span className="font-semibold text-cyan-300">Har soniyada</span>
            </div>

            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-teal-950/40 border border-teal-500/15 text-sm">
              <span className="text-slate-400 font-medium flex items-center gap-2">
                <FontAwesomeIcon icon={faShieldHalved} className="w-4 h-4 text-cyan-400" />
                Ma'lumotlar Shifrlanishi:
              </span>
              <span className="font-semibold text-slate-200">256-bit AES</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
