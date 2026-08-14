import { NavLink } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  faChartPie, 
  faReceipt, 
  faArrowTrendUp, 
  faUser,
  faPlus
} from '@fortawesome/free-solid-svg-icons'
import { cn } from '@/lib/utils'
import { useThemeStore } from '@/store/themeStore'

interface MobileBottomNavProps {
  onOpenAddDialog: () => void
}

export default function MobileBottomNav({ onOpenAddDialog }: MobileBottomNavProps) {
  const { theme } = useThemeStore()

  return (
    <nav className={cn(
      "fixed bottom-4 inset-x-4 max-w-sm mx-auto z-40 backdrop-blur-3xl border px-3 py-2 flex items-center justify-around rounded-full lg:hidden transition-all duration-300 select-none shadow-2xl",
      theme === 'dark'
        ? "bg-teal-950/40 border-teal-500/30 text-slate-300 shadow-[0_12px_40px_rgba(0,0,0,0.65)]"
        : "bg-white/45 border-white/60 text-slate-800 shadow-[0_12px_36px_rgba(6,182,212,0.22)]"
    )}>
      {/* 1. Boshqaruv */}
      <NavLink
        to="/"
        end
        className={({ isActive }) =>
          cn(
            'flex items-center justify-center w-11 h-11 rounded-full transition-all duration-200 active:scale-90 relative',
            isActive
              ? (theme === 'dark' ? 'text-cyan-300 bg-cyan-500/25 border border-cyan-400/40 shadow-sm' : 'text-cyan-800 bg-white/70 border border-cyan-400/50 shadow-md')
              : (theme === 'dark' ? 'text-slate-400 hover:text-slate-200' : 'text-slate-600 hover:text-slate-900')
          )
        }
        title="Boshqaruv"
      >
        {({ isActive }) => (
          <>
            <FontAwesomeIcon icon={faChartPie} className="w-5 h-5" />
            {isActive && (
              <span className="absolute -bottom-1 w-2 h-1 bg-cyan-400 rounded-full animate-pulse shadow-[0_0_8px_rgba(6,182,212,0.9)]"></span>
            )}
          </>
        )}
      </NavLink>

      {/* 2. Amallar */}
      <NavLink
        to="/transactions"
        className={({ isActive }) =>
          cn(
            'flex items-center justify-center w-11 h-11 rounded-full transition-all duration-200 active:scale-90 relative',
            isActive
              ? (theme === 'dark' ? 'text-cyan-300 bg-cyan-500/25 border border-cyan-400/40 shadow-sm' : 'text-cyan-800 bg-white/70 border border-cyan-400/50 shadow-md')
              : (theme === 'dark' ? 'text-slate-400 hover:text-slate-200' : 'text-slate-600 hover:text-slate-900')
          )
        }
        title="Amallar"
      >
        {({ isActive }) => (
          <>
            <FontAwesomeIcon icon={faReceipt} className="w-5 h-5" />
            {isActive && (
              <span className="absolute -bottom-1 w-2 h-1 bg-cyan-400 rounded-full animate-pulse shadow-[0_0_8px_rgba(6,182,212,0.9)]"></span>
            )}
          </>
        )}
      </NavLink>

      {/* 3. Center Floating Quick Action Plus Button */}
      <button
        onClick={onOpenAddDialog}
        className="w-11 h-11 rounded-full bg-gradient-to-r from-teal-400 via-cyan-400 to-sky-400 flex items-center justify-center text-slate-950 shadow-[0_0_22px_rgba(0,242,254,0.7)] border border-white/60 hover:scale-105 active:scale-90 transition-all duration-200 flex-shrink-0"
        title="Yangi Amal Qo'shish"
      >
        <FontAwesomeIcon icon={faPlus} className="w-5 h-5 stroke-[2]" />
      </button>

      {/* 4. Tahlil */}
      <NavLink
        to="/analytics"
        className={({ isActive }) =>
          cn(
            'flex items-center justify-center w-11 h-11 rounded-full transition-all duration-200 active:scale-90 relative',
            isActive
              ? (theme === 'dark' ? 'text-cyan-300 bg-cyan-500/25 border border-cyan-400/40 shadow-sm' : 'text-cyan-800 bg-white/70 border border-cyan-400/50 shadow-md')
              : (theme === 'dark' ? 'text-slate-400 hover:text-slate-200' : 'text-slate-600 hover:text-slate-900')
          )
        }
        title="Tahlil"
      >
        {({ isActive }) => (
          <>
            <FontAwesomeIcon icon={faArrowTrendUp} className="w-5 h-5" />
            {isActive && (
              <span className="absolute -bottom-1 w-2 h-1 bg-cyan-400 rounded-full animate-pulse shadow-[0_0_8px_rgba(6,182,212,0.9)]"></span>
            )}
          </>
        )}
      </NavLink>

      {/* 5. Profil */}
      <NavLink
        to="/profile"
        className={({ isActive }) =>
          cn(
            'flex items-center justify-center w-11 h-11 rounded-full transition-all duration-200 active:scale-90 relative',
            isActive
              ? (theme === 'dark' ? 'text-cyan-300 bg-cyan-500/25 border border-cyan-400/40 shadow-sm' : 'text-cyan-700 bg-white/70 border border-cyan-400/50 shadow-md')
              : (theme === 'dark' ? 'text-slate-400 hover:text-slate-200' : 'text-slate-600 hover:text-slate-900')
          )
        }
        title="Profil"
      >
        {({ isActive }) => (
          <>
            <FontAwesomeIcon icon={faUser} className="w-5 h-5" />
            {isActive && (
              <span className="absolute -bottom-1 w-2 h-1 bg-cyan-400 rounded-full animate-pulse shadow-[0_0_8px_rgba(6,182,212,0.9)]"></span>
            )}
          </>
        )}
      </NavLink>
    </nav>
  )
}
