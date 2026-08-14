import { cn } from '@/lib/utils'
import { useThemeStore } from '@/store/themeStore'
import NotificationModal from '@/components/NotificationModal'
import ThemeToggle from '@/components/ThemeToggle'
import logoDark from '@/assets/logo-dark.png'
import logoLight from '@/assets/logo-light.png'

interface MobileHeaderProps {
  currentPageName: string
}

export default function MobileHeader({ currentPageName }: MobileHeaderProps) {
  const { theme } = useThemeStore()
  const logo = theme === 'light' ? logoLight : logoDark

  return (
    <header className={cn(
      "sticky top-0 z-30 w-full backdrop-blur-2xl border-b transition-colors duration-300 lg:hidden px-4 py-3",
      theme === 'dark'
        ? "bg-[#06181f]/90 border-teal-500/20 text-white shadow-[0_4px_20px_rgba(0,0,0,0.4)]"
        : "bg-white/90 border-cyan-400/20 text-slate-900 shadow-[0_4px_20px_rgba(6,182,212,0.08)]"
    )}>
      <div className="flex items-center justify-between gap-2 max-w-7xl mx-auto">
        {/* Brand & Active Page Title */}
        <div className="flex items-center gap-2.5">
          <img
            src={logo}
            alt="SARF"
            className="w-8 h-8 rounded-xl object-cover border border-cyan-400/40 shadow-[0_0_10px_rgba(6,182,212,0.3)]"
          />
          <div>
            <h1 className={cn(
              "text-lg font-black tracking-tight leading-none",
              theme === 'dark' ? "text-white" : "text-slate-900"
            )}>
              {currentPageName}
            </h1>
            <p className={cn(
              "text-[10px] font-semibold mt-0.5",
              theme === 'dark' ? "text-teal-300/70" : "text-cyan-800/80"
            )}>
              SARF Moliya
            </p>
          </div>
        </div>

        {/* Right Header Actions */}
        <div className="flex items-center gap-2">
          {/* Header Action Portal for Page-specific buttons */}
          <div id="page-actions" className="flex items-center gap-1.5"></div>
          <NotificationModal />
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}
