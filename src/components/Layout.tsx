import { Outlet, useLocation } from 'react-router-dom'
import { 
  faChartPie, 
  faReceipt, 
  faArrowTrendUp
} from '@fortawesome/free-solid-svg-icons'
import { cn } from '@/lib/utils'
import { useState, useEffect } from 'react'
import { useAuthStore } from '@/store/authStore'
import { getUser } from '@/lib/api'
import NotificationModal from '@/components/NotificationModal'
import AddTransactionDialog from '@/components/AddTransactionDialog'
import Sidebar from '@/components/Sidebar'
import ThemeToggle from '@/components/ThemeToggle'
import MobileLayout from '@/components/mobile/MobileLayout'
import { useThemeStore } from '@/store/themeStore'
import logoDark from '@/assets/logo-dark.png'
import logoLight from '@/assets/logo-light.png'

const navigation = [
  { name: "Boshqaruv bo'limi", href: '/', icon: faChartPie },
  { name: 'Amallar', href: '/transactions', icon: faReceipt },
  { name: 'Tahlil', href: '/analytics', icon: faArrowTrendUp },
]

export default function Layout() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    const saved = localStorage.getItem('sidebar-collapsed')
    return saved === 'true'
  })
  const { telegramId, user, setUser } = useAuthStore()
  const { theme } = useThemeStore()
  const location = useLocation()
  const logo = theme === 'light' ? logoLight : logoDark

  useEffect(() => {
    if (telegramId && !user) {
      getUser(telegramId)
        .then((res) => {
          if (res.data) setUser(res.data)
        })
        .catch((err) => console.error('Failed to fetch user:', err))
    }
  }, [telegramId, user, setUser])

  const toggleSidebar = () => {
    const nextState = !sidebarCollapsed
    setSidebarCollapsed(nextState)
    localStorage.setItem('sidebar-collapsed', String(nextState))
  }

  const currentPageName = location.pathname === '/profile' 
    ? 'Profil' 
    : navigation.find((item) => item.href === location.pathname)?.name || "Boshqaruv bo'limi"

  return (
    <>
      {/* 1. DEDICATED MOBILE LAYOUT (< lg viewports) */}
      <div className="block lg:hidden">
        <MobileLayout currentPageName={currentPageName} />
      </div>

      {/* 2. DEDICATED DESKTOP LAYOUT (>= lg viewports) */}
      <div className={cn(
        "hidden lg:block min-h-screen relative selection:bg-cyan-500/30 selection:text-cyan-200 overflow-x-hidden transition-colors duration-300",
        theme === 'dark' ? 'bg-[#040e12] text-slate-100' : 'bg-[#f0fdfa] text-slate-900'
      )}>
        {/* Background ambient lighting */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
          {theme === 'dark' ? (
            <>
              <div className="absolute -top-40 -left-40 w-[40rem] h-[40rem] bg-cyan-500/10 rounded-full blur-[140px]"></div>
              <div className="absolute top-1/2 left-1/3 -translate-y-1/2 w-[35rem] h-[35rem] bg-teal-500/10 rounded-full blur-[140px]"></div>
              <div className="absolute -bottom-44 -right-44 w-[45rem] h-[45rem] bg-black/90 rounded-full blur-[120px]"></div>
            </>
          ) : (
            <>
              <div className="absolute -top-40 -left-40 w-[40rem] h-[40rem] bg-cyan-400/20 rounded-full blur-[140px]"></div>
              <div className="absolute top-1/2 left-1/3 -translate-y-1/2 w-[35rem] h-[35rem] bg-sky-300/20 rounded-full blur-[140px]"></div>
              <div className="absolute -bottom-44 -right-44 w-[45rem] h-[45rem] bg-teal-200/30 rounded-full blur-[120px]"></div>
            </>
          )}
        </div>

        {/* Separate Desktop Sidebar Component */}
        <Sidebar
          sidebarCollapsed={sidebarCollapsed}
          toggleSidebar={toggleSidebar}
          navigation={navigation}
          user={user}
          telegramId={telegramId}
        />

        {/* Main Content Area */}
        <div className={cn('transition-all duration-300 relative z-10', sidebarCollapsed ? 'lg:pl-20' : 'lg:pl-64')}>
          {/* Desktop Header Bar */}
          <header className="w-full bg-transparent">
            <div className="flex items-center justify-between min-h-[5rem] py-3 px-4 sm:px-6 lg:px-8 gap-2">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-3">
                  <img
                    src={logo}
                    alt="SARF"
                    className="w-9 h-9 rounded-xl object-cover border border-cyan-400/30 shadow-[0_0_12px_rgba(6,182,212,0.4)]"
                  />
                  <div>
                    <h1 className={cn("text-2xl font-black tracking-tight flex items-center gap-2", theme === 'dark' ? "text-white" : "text-slate-900")}>
                      {currentPageName}
                    </h1>
                    <p className={cn("text-xs font-medium", theme === 'dark' ? "text-teal-300/60" : "text-slate-500")}>
                      Real-vaqt rejimida moliyaviy nazorat
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Header Right Actions */}
              <div className="flex items-center gap-2 sm:gap-3">
                <div id="page-actions" className="flex items-center gap-2 sm:gap-3"></div>
                <NotificationModal />
                <ThemeToggle />
              </div>
            </div>
          </header>

          {/* Page Content Rendered Here */}
          <main className="p-6 lg:p-8 max-w-7xl mx-auto pb-8">
            <Outlet />
          </main>
        </div>

        {/* Add Transaction Dialog */}
        <AddTransactionDialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen} />
      </div>
    </>
  )
}
