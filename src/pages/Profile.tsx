import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { useAuthStore } from '@/store/authStore'
import { useThemeStore } from '@/store/themeStore'
import { getSummary } from '@/lib/api'
import { formatCurrency, cn } from '@/lib/utils'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faUser,
  faRightFromBracket,
  faCheckCircle,
  faWallet,
  faArrowTrendUp,
  faArrowTrendDown,
  faUserGroup,
  faWandMagicSparkles,
  faFolderOpen,
  faChevronRight,
  faSun,
  faMoon,
  faDesktop
} from '@fortawesome/free-solid-svg-icons'
import Loader from '@/components/Loader'

export default function Profile() {
  const { user, telegramId, logout } = useAuthStore()
  const { theme, setTheme } = useThemeStore()

  const { data: summary, isLoading } = useQuery({
    queryKey: ['summary', telegramId],
    queryFn: () => getSummary(telegramId!).then((res) => res.data),
    enabled: !!telegramId,
  })

  if (isLoading) {
    return <Loader />
  }

  const additionalFeatures = [
    {
      title: 'Qarzlar',
      description: 'Qarzdorliklar, berilgan va olingan qarzlar nazorati',
      href: '/debts',
      icon: faUserGroup,
      badgeColor: 'bg-cyan-500/15 border-cyan-400/30 text-cyan-300',
    },
    {
      title: 'AI Prognoz',
      description: 'Kelajakdagi pul oqimi va moliyaviy bashoratlar',
      href: '/forecasting',
      icon: faWandMagicSparkles,
      badgeColor: 'bg-sky-500/15 border-sky-400/30 text-sky-300',
    },
    {
      title: 'Kategoriyalar',
      description: 'Daromad va chiqim kategoriyalarini boshqarish',
      href: '/categories',
      icon: faFolderOpen,
      badgeColor: 'bg-emerald-500/15 border-emerald-400/30 text-emerald-300',
    },
  ]

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

      {/* Qo'shimcha funksiyalar Section */}
      <div className="space-y-4">
        <h2 className="text-lg font-extrabold text-white flex items-center gap-2 border-b border-teal-500/15 pb-3">
          Qo'shimcha funksiyalar
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {additionalFeatures.map((feature) => (
            <Link
              key={feature.href}
              to={feature.href}
              className="glass-panel-interactive p-6 rounded-3xl border border-teal-500/20 hover:border-cyan-400/40 transition-all group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 rounded-2xl border ${feature.badgeColor} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                    <FontAwesomeIcon icon={feature.icon} className="w-5 h-5" />
                  </div>
                  <FontAwesomeIcon icon={faChevronRight} className="w-4 h-4 text-slate-500 group-hover:text-cyan-300 group-hover:translate-x-1 transition-all" />
                </div>
                <h3 className="text-base font-bold text-white mb-1 group-hover:text-cyan-300 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Mavzu Sozlamalari (Theme Settings) Section */}
      <div className="space-y-4 pt-2">
        <h2 className="text-lg font-extrabold text-white flex items-center gap-2 border-b border-teal-500/15 pb-3">
          Mavzu Sozlamalari (Theme Settings)
        </h2>

        <div className="glass-panel p-6 rounded-3xl border border-teal-500/20 space-y-4">
          <p className="text-xs text-slate-400">
            Dastur interfeysi uchun doimiy rejimni tanlang. Tanlangan sozlama saqlanadi.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* 1. Light Mode */}
            <button
              onClick={() => setTheme('light')}
              className={cn(
                "flex items-center justify-between p-4 rounded-2xl border transition-all text-left group",
                theme === 'light'
                  ? "bg-cyan-500/15 border-cyan-400/50 shadow-[0_0_20px_rgba(6,182,212,0.25)] text-cyan-300"
                  : "bg-teal-950/30 border-teal-500/20 text-slate-400 hover:border-cyan-400/30"
              )}
            >
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-amber-500/15 border border-amber-400/30 text-amber-400">
                  <FontAwesomeIcon icon={faSun} className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white group-hover:text-cyan-300">Yorug' rejim</h4>
                  <p className="text-[10px] text-slate-400">Default (Oq fon)</p>
                </div>
              </div>
              {theme === 'light' && (
                <div className="w-3 h-3 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.8)]"></div>
              )}
            </button>

            {/* 2. Dark Mode */}
            <button
              onClick={() => setTheme('dark')}
              className={cn(
                "flex items-center justify-between p-4 rounded-2xl border transition-all text-left group",
                theme === 'dark'
                  ? "bg-cyan-500/15 border-cyan-400/50 shadow-[0_0_20px_rgba(6,182,212,0.25)] text-cyan-300"
                  : "bg-teal-950/30 border-teal-500/20 text-slate-400 hover:border-cyan-400/30"
              )}
            >
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-cyan-500/15 border border-cyan-400/30 text-cyan-300">
                  <FontAwesomeIcon icon={faMoon} className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white group-hover:text-cyan-300">Qorong'u rejim</h4>
                  <p className="text-[10px] text-slate-400">Deep Cyber Cyan</p>
                </div>
              </div>
              {theme === 'dark' && (
                <div className="w-3 h-3 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.8)]"></div>
              )}
            </button>

            {/* 3. System Mode */}
            <button
              onClick={() => setTheme('system')}
              className={cn(
                "flex items-center justify-between p-4 rounded-2xl border transition-all text-left group",
                theme === 'system'
                  ? "bg-cyan-500/15 border-cyan-400/50 shadow-[0_0_20px_rgba(6,182,212,0.25)] text-cyan-300"
                  : "bg-teal-950/30 border-teal-500/20 text-slate-400 hover:border-cyan-400/30"
              )}
            >
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-purple-500/15 border border-purple-400/30 text-purple-300">
                  <FontAwesomeIcon icon={faDesktop} className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white group-hover:text-cyan-300">Tizim rejimi</h4>
                  <p className="text-[10px] text-slate-400">Brauzer/OS rejimi</p>
                </div>
              </div>
              {theme === 'system' && (
                <div className="w-3 h-3 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.8)]"></div>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

