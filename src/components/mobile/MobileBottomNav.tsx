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
      "fixed bottom-0 left-0 right-0 z-40 backdrop-blur-2xl border-t px-2 py-1 flex items-center justify-around shadow-2xl lg:hidden transition-colors duration-300",
      theme === 'dark'
        ? "bg-[#06181f]/95 border-teal-500/20 text-slate-400 shadow-[0_-10px_30px_rgba(0,0,0,0.6)]"
        : "bg-white/95 border-cyan-400/20 text-slate-600 shadow-[0_-10px_30px_rgba(6,182,212,0.12)]"
    )}>
      {/* 1. Boshqaruv */}
      <NavLink
        to="/"
        end
        className={({ isActive }) =>
          cn(
            'flex flex-col items-center justify-center w-12 h-12 rounded-2xl transition-all relative',
            isActive
              ? (theme === 'dark' ? 'text-cyan-300 bg-cyan-500/20 border border-cyan-400/30' : 'text-cyan-700 bg-cyan-50 border border-cyan-400/40 shadow-sm')
              : (theme === 'dark' ? 'text-slate-400 hover:text-slate-200' : 'text-slate-500 hover:text-slate-900')
          )
        }
        title="Boshqaruv"
      >
        {({ isActive }) => (
          <>
            <FontAwesomeIcon icon={faChartPie} className="w-5 h-5" />
            <span className="text-[9px] font-bold mt-0.5 tracking-tight">Boshqaruv</span>
            {isActive && (
              <span className="absolute -bottom-1 w-1.5 h-1.5 bg-cyan-400 rounded-full animate-pulse"></span>
            )}
          </>
        )}
      </NavLink>

      {/* 2. Amallar */}
      <NavLink
        to="/transactions"
        className={({ isActive }) =>
          cn(
            'flex flex-col items-center justify-center w-12 h-12 rounded-2xl transition-all relative',
            isActive
              ? (theme === 'dark' ? 'text-cyan-300 bg-cyan-500/20 border border-cyan-400/30' : 'text-cyan-700 bg-cyan-50 border border-cyan-400/40 shadow-sm')
              : (theme === 'dark' ? 'text-slate-400 hover:text-slate-200' : 'text-slate-500 hover:text-slate-900')
          )
        }
        title="Amallar"
      >
        {({ isActive }) => (
          <>
            <FontAwesomeIcon icon={faReceipt} className="w-5 h-5" />
            <span className="text-[9px] font-bold mt-0.5 tracking-tight">Amallar</span>
            {isActive && (
              <span className="absolute -bottom-1 w-1.5 h-1.5 bg-cyan-400 rounded-full animate-pulse"></span>
            )}
          </>
        )}
      </NavLink>

      {/* 3. Center Quick Action Button */}
      <button
        onClick={onOpenAddDialog}
        className="relative -top-4 w-12 h-12 rounded-2xl bg-gradient-to-r from-teal-400 via-cyan-400 to-sky-400 flex items-center justify-center text-slate-950 shadow-[0_0_20px_rgba(0,242,254,0.6)] border border-cyan-200/50 hover:scale-110 active:scale-95 transition-all flex-shrink-0"
        title="Yangi Amal Qo'shish"
      >
        <FontAwesomeIcon icon={faPlus} className="w-6 h-6 stroke-[2]" />
      </button>

      {/* 4. Tahlil */}
      <NavLink
        to="/analytics"
        className={({ isActive }) =>
          cn(
            'flex flex-col items-center justify-center w-12 h-12 rounded-2xl transition-all relative',
            isActive
              ? (theme === 'dark' ? 'text-cyan-300 bg-cyan-500/20 border border-cyan-400/30' : 'text-cyan-700 bg-cyan-50 border border-cyan-400/40 shadow-sm')
              : (theme === 'dark' ? 'text-slate-400 hover:text-slate-200' : 'text-slate-500 hover:text-slate-900')
          )
        }
        title="Tahlil"
      >
        {({ isActive }) => (
          <>
            <FontAwesomeIcon icon={faArrowTrendUp} className="w-5 h-5" />
            <span className="text-[9px] font-bold mt-0.5 tracking-tight">Tahlil</span>
            {isActive && (
              <span className="absolute -bottom-1 w-1.5 h-1.5 bg-cyan-400 rounded-full animate-pulse"></span>
            )}
          </>
        )}
      </NavLink>

      {/* 5. Profil */}
      <NavLink
        to="/profile"
        className={({ isActive }) =>
          cn(
            'flex flex-col items-center justify-center w-12 h-12 rounded-2xl transition-all relative',
            isActive
              ? (theme === 'dark' ? 'text-cyan-300 bg-cyan-500/20 border border-cyan-400/30' : 'text-cyan-700 bg-cyan-50 border border-cyan-400/40 shadow-sm')
              : (theme === 'dark' ? 'text-slate-400 hover:text-slate-200' : 'text-slate-500 hover:text-slate-900')
          )
        }
        title="Profil"
      >
        {({ isActive }) => (
          <>
            <FontAwesomeIcon icon={faUser} className="w-5 h-5" />
            <span className="text-[9px] font-bold mt-0.5 tracking-tight">Profil</span>
            {isActive && (
              <span className="absolute -bottom-1 w-1.5 h-1.5 bg-cyan-400 rounded-full animate-pulse"></span>
            )}
          </>
        )}
      </NavLink>
    </nav>
  )
}
