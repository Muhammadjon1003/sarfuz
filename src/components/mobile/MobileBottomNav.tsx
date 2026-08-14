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
      "fixed bottom-3 inset-x-4 max-w-md mx-auto z-40 backdrop-blur-2xl border px-2 py-1.5 flex items-center justify-around rounded-3xl lg:hidden transition-all duration-300 select-none",
      theme === 'dark'
        ? "bg-[#06181f]/80 border-teal-500/30 text-slate-400 shadow-[0_12px_40px_rgba(0,0,0,0.65)]"
        : "bg-white/80 border-cyan-400/30 text-slate-600 shadow-[0_12px_40px_rgba(6,182,212,0.18)]"
    )}>
      {/* 1. Boshqaruv */}
      <NavLink
        to="/"
        end
        className={({ isActive }) =>
          cn(
            'flex flex-col items-center justify-center w-12 h-11 rounded-2xl transition-all duration-200 active:scale-90 relative',
            isActive
              ? (theme === 'dark' ? 'text-cyan-300 bg-cyan-500/20 border border-cyan-400/30 shadow-sm' : 'text-cyan-700 bg-cyan-50 border border-cyan-400/40 shadow-sm')
              : (theme === 'dark' ? 'text-slate-400 hover:text-slate-200' : 'text-slate-500 hover:text-slate-900')
          )
        }
        title="Boshqaruv"
      >
        {({ isActive }) => (
          <>
            <FontAwesomeIcon icon={faChartPie} className="w-4 h-4" />
            <span className="text-[9px] font-bold mt-0.5 tracking-tight">Boshqaruv</span>
            {isActive && (
              <span className="absolute -bottom-1 w-1.5 h-1.5 bg-cyan-400 rounded-full animate-pulse shadow-[0_0_8px_rgba(6,182,212,0.8)]"></span>
            )}
          </>
        )}
      </NavLink>

      {/* 2. Amallar */}
      <NavLink
        to="/transactions"
        className={({ isActive }) =>
          cn(
            'flex flex-col items-center justify-center w-12 h-11 rounded-2xl transition-all duration-200 active:scale-90 relative',
            isActive
              ? (theme === 'dark' ? 'text-cyan-300 bg-cyan-500/20 border border-cyan-400/30 shadow-sm' : 'text-cyan-700 bg-cyan-50 border border-cyan-400/40 shadow-sm')
              : (theme === 'dark' ? 'text-slate-400 hover:text-slate-200' : 'text-slate-500 hover:text-slate-900')
          )
        }
        title="Amallar"
      >
        {({ isActive }) => (
          <>
            <FontAwesomeIcon icon={faReceipt} className="w-4 h-4" />
            <span className="text-[9px] font-bold mt-0.5 tracking-tight">Amallar</span>
            {isActive && (
              <span className="absolute -bottom-1 w-1.5 h-1.5 bg-cyan-400 rounded-full animate-pulse shadow-[0_0_8px_rgba(6,182,212,0.8)]"></span>
            )}
          </>
        )}
      </NavLink>

      {/* 3. Center iOS Floating Quick Action Button */}
      <button
        onClick={onOpenAddDialog}
        className="w-11 h-11 rounded-2xl bg-gradient-to-r from-teal-400 via-cyan-400 to-sky-400 flex items-center justify-center text-slate-950 shadow-[0_0_20px_rgba(0,242,254,0.6)] border border-cyan-200/60 hover:scale-105 active:scale-90 transition-all duration-200 flex-shrink-0"
        title="Yangi Amal Qo'shish"
      >
        <FontAwesomeIcon icon={faPlus} className="w-5 h-5 stroke-[2]" />
      </button>

      {/* 4. Tahlil */}
      <NavLink
        to="/analytics"
        className={({ isActive }) =>
          cn(
            'flex flex-col items-center justify-center w-12 h-11 rounded-2xl transition-all duration-200 active:scale-90 relative',
            isActive
              ? (theme === 'dark' ? 'text-cyan-300 bg-cyan-500/20 border border-cyan-400/30 shadow-sm' : 'text-cyan-700 bg-cyan-50 border border-cyan-400/40 shadow-sm')
              : (theme === 'dark' ? 'text-slate-400 hover:text-slate-200' : 'text-slate-500 hover:text-slate-900')
          )
        }
        title="Tahlil"
      >
        {({ isActive }) => (
          <>
            <FontAwesomeIcon icon={faArrowTrendUp} className="w-4 h-4" />
            <span className="text-[9px] font-bold mt-0.5 tracking-tight">Tahlil</span>
            {isActive && (
              <span className="absolute -bottom-1 w-1.5 h-1.5 bg-cyan-400 rounded-full animate-pulse shadow-[0_0_8px_rgba(6,182,212,0.8)]"></span>
            )}
          </>
        )}
      </NavLink>

      {/* 5. Profil */}
      <NavLink
        to="/profile"
        className={({ isActive }) =>
          cn(
            'flex flex-col items-center justify-center w-12 h-11 rounded-2xl transition-all duration-200 active:scale-90 relative',
            isActive
              ? (theme === 'dark' ? 'text-cyan-300 bg-cyan-500/20 border border-cyan-400/30 shadow-sm' : 'text-cyan-700 bg-cyan-50 border border-cyan-400/40 shadow-sm')
              : (theme === 'dark' ? 'text-slate-400 hover:text-slate-200' : 'text-slate-500 hover:text-slate-900')
          )
        }
        title="Profil"
      >
        {({ isActive }) => (
          <>
            <FontAwesomeIcon icon={faUser} className="w-4 h-4" />
            <span className="text-[9px] font-bold mt-0.5 tracking-tight">Profil</span>
            {isActive && (
              <span className="absolute -bottom-1 w-1.5 h-1.5 bg-cyan-400 rounded-full animate-pulse shadow-[0_0_8px_rgba(6,182,212,0.8)]"></span>
            )}
          </>
        )}
      </NavLink>
    </nav>
  )
}
