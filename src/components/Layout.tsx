import { Outlet, NavLink, useLocation } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  faChartPie, 
  faReceipt, 
  faUserGroup, 
  faArrowTrendUp, 
  faWandMagicSparkles, 
  faFolderOpen, 
  faChevronLeft, 
  faChevronRight,
  faPlus
} from '@fortawesome/free-solid-svg-icons'
import { cn } from '@/lib/utils'
import { useState, useEffect } from 'react'
import { useAuthStore } from '@/store/authStore'
import { getUser } from '@/lib/api'
import NotificationModal from '@/components/NotificationModal'
import AddTransactionDialog from '@/components/AddTransactionDialog'
import ProfileDropdownMenu from '@/components/ProfileDropdownMenu'
import logoDark from '@/assets/logo-dark.png'

const navigation = [
  { name: "Boshqaruv bo'limi", href: '/', icon: faChartPie },
  { name: 'Amallar', href: '/transactions', icon: faReceipt },
  { name: 'Qarzlar', href: '/debts', icon: faUserGroup },
  { name: 'Tahlil', href: '/analytics', icon: faArrowTrendUp },
  { name: 'Prognoz', href: '/forecasting', icon: faWandMagicSparkles },
  { name: 'Kategoriyalar', href: '/categories', icon: faFolderOpen },
]

export default function Layout() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    const saved = localStorage.getItem('sidebar-collapsed')
    return saved === 'true'
  })
  const { telegramId, user, setUser } = useAuthStore()
  const location = useLocation()

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

  const currentPage = navigation.find((item) => item.href === location.pathname)

  return (
    <div className="min-h-screen bg-[#040e12] text-slate-100 relative selection:bg-cyan-500/30 selection:text-cyan-200 overflow-x-hidden">
      {/* Background ambient lighting */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-40 -left-40 w-[40rem] h-[40rem] bg-cyan-500/10 rounded-full blur-[140px]"></div>
        <div className="absolute top-1/2 left-1/3 -translate-y-1/2 w-[35rem] h-[35rem] bg-teal-500/10 rounded-full blur-[140px]"></div>
        <div className="absolute -bottom-44 -right-44 w-[45rem] h-[45rem] bg-black/90 rounded-full blur-[120px]"></div>
      </div>

      {/* Sidebar (Desktop Only) */}
      <aside
        className={cn(
          'hidden lg:flex fixed inset-y-0 left-0 bg-[#06181f]/80 backdrop-blur-2xl border-r border-teal-500/15 z-50 flex-col justify-between shadow-2xl transition-all duration-300 ease-in-out',
          sidebarCollapsed ? 'w-20' : 'w-64'
        )}
      >
        <div>
          {/* Logo header */}
          <div className="flex items-center justify-between h-20 px-5 border-b border-teal-500/10">
            {!sidebarCollapsed ? (
              <div className="flex items-center gap-3">
                <img
                  src={logoDark}
                  alt="SARF"
                  className="w-10 h-10 rounded-xl object-cover border border-cyan-400/30 shadow-[0_0_15px_rgba(6,182,212,0.4)]"
                />
                <div>
                  <h1 className="text-lg font-black tracking-wider bg-gradient-to-r from-white via-cyan-100 to-teal-200 bg-clip-text text-transparent uppercase">
                    SARF
                  </h1>
                  <p className="text-[10px] text-teal-400/70 uppercase tracking-widest font-semibold">Biznes Moliya</p>
                </div>
              </div>
            ) : (
              <img
                src={logoDark}
                alt="SARF"
                className="w-10 h-10 rounded-xl object-cover mx-auto border border-cyan-400/30 shadow-[0_0_15px_rgba(6,182,212,0.4)]"
              />
            )}
          </div>

          {/* Navigation links */}
          <nav className="px-3 py-6 space-y-1.5">
            {navigation.map((item) => (
              <NavLink
                key={item.name}
                to={item.href}
                end={item.href === '/'}
                title={sidebarCollapsed ? item.name : undefined}
                className={({ isActive }) =>
                  cn(
                    'flex items-center px-3.5 py-3 text-sm font-medium rounded-xl transition-all duration-200 relative group',
                    isActive
                      ? 'bg-gradient-to-r from-cyan-500/20 via-teal-500/10 to-transparent text-cyan-300 border-l-2 border-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.15)]'
                      : 'text-slate-400 hover:text-slate-100 hover:bg-teal-950/40',
                    sidebarCollapsed && 'justify-center px-0'
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    <FontAwesomeIcon
                      icon={item.icon}
                      className={cn(
                        'w-5 h-5 transition-transform group-hover:scale-110',
                        isActive ? 'text-cyan-400' : 'text-slate-400 group-hover:text-cyan-300',
                        !sidebarCollapsed && 'mr-3'
                      )}
                    />
                    {!sidebarCollapsed && <span>{item.name}</span>}
                  </>
                )}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div>
          {/* Collapse Toggle */}
          <div className="hidden lg:block p-3 border-t border-teal-500/10">
            <button
              onClick={toggleSidebar}
              className="w-full flex items-center justify-center py-2 text-slate-400 hover:text-cyan-300 hover:bg-teal-950/40 rounded-xl transition-colors"
              title={sidebarCollapsed ? "Kengaytirish" : "Yig'ish"}
            >
              {sidebarCollapsed ? (
                <FontAwesomeIcon icon={faChevronRight} className="w-5 h-5" />
              ) : (
                <>
                  <FontAwesomeIcon icon={faChevronLeft} className="w-5 h-5 mr-2" />
                  <span className="text-xs font-semibold uppercase tracking-wider">Yig'ish</span>
                </>
              )}
            </button>
          </div>

          {/* User info & Profile Dropdown */}
          <div className="p-3 border-t border-teal-500/10">
            <ProfileDropdownMenu sidebarCollapsed={sidebarCollapsed} />
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className={cn('transition-all duration-300 relative z-10', sidebarCollapsed ? 'lg:pl-20' : 'lg:pl-64')}>
        {/* Header Bar - Scrolls naturally with page */}
        <header className="w-full bg-transparent">
          <div className="flex items-center justify-between min-h-[5rem] py-3 px-4 sm:px-6 lg:px-8 gap-2">
            <div className="flex items-center gap-3">
              {/* Page Header Title */}
              <div className="flex items-center gap-3">
                <img
                  src={logoDark}
                  alt="SARF"
                  className="w-9 h-9 rounded-xl object-cover lg:hidden border border-cyan-400/30 shadow-[0_0_12px_rgba(6,182,212,0.4)]"
                />
                <div>
                  <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2">
                    {currentPage?.name || "Boshqaruv bo'limi"}
                  </h1>
                  <p className="text-xs text-teal-300/60 hidden sm:block">Real-vaqt rejimida moliyaviy nazorat</p>
                </div>
              </div>
            </div>
            
            {/* Header Right Actions */}
            <div className="flex items-center gap-2 sm:gap-3">
              <div id="page-actions" className="flex items-center gap-2 sm:gap-3"></div>
              <NotificationModal />
            </div>
          </div>
        </header>

        {/* Page Content Rendered Here */}
        <main className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto pb-24 lg:pb-8">
          <Outlet />
        </main>
      </div>

      {/* Mobile & Tablet Bottom Navigation Bar (All Sections + Center Floating Plus Button) */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#06181f]/95 backdrop-blur-2xl border-t border-teal-500/20 px-2 py-1.5 flex items-center justify-around shadow-[0_-10px_30px_rgba(0,0,0,0.6)] lg:hidden">
        {/* Boshqaruv bo'limi */}
        <NavLink
          to="/"
          end
          className={({ isActive }) =>
            cn(
              'flex flex-col items-center justify-center w-10 h-10 sm:w-11 sm:h-11 rounded-xl transition-all',
              isActive ? 'text-cyan-400 bg-cyan-500/15 border border-cyan-400/30' : 'text-slate-400 hover:text-slate-200'
            )
          }
          title="Boshqaruv bo'limi"
        >
          <FontAwesomeIcon icon={faChartPie} className="w-4 h-4 sm:w-5 sm:h-5" />
        </NavLink>

        {/* Amallar */}
        <NavLink
          to="/transactions"
          className={({ isActive }) =>
            cn(
              'flex flex-col items-center justify-center w-10 h-10 sm:w-11 sm:h-11 rounded-xl transition-all',
              isActive ? 'text-cyan-400 bg-cyan-500/15 border border-cyan-400/30' : 'text-slate-400 hover:text-slate-200'
            )
          }
          title="Amallar"
        >
          <FontAwesomeIcon icon={faReceipt} className="w-4 h-4 sm:w-5 sm:h-5" />
        </NavLink>

        {/* Qarzlar */}
        <NavLink
          to="/debts"
          className={({ isActive }) =>
            cn(
              'flex flex-col items-center justify-center w-10 h-10 sm:w-11 sm:h-11 rounded-xl transition-all',
              isActive ? 'text-cyan-400 bg-cyan-500/15 border border-cyan-400/30' : 'text-slate-400 hover:text-slate-200'
            )
          }
          title="Qarzlar"
        >
          <FontAwesomeIcon icon={faUserGroup} className="w-4 h-4 sm:w-5 sm:h-5" />
        </NavLink>

        {/* Center Floating Plus Action Button (Yangi Amal) */}
        <button
          onClick={() => setIsAddDialogOpen(true)}
          className="relative -top-3 sm:-top-4 w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-r from-teal-400 via-cyan-400 to-sky-400 flex items-center justify-center text-slate-950 shadow-[0_0_20px_rgba(0,242,254,0.6)] border border-cyan-200/50 hover:scale-105 active:scale-95 transition-all flex-shrink-0"
          title="Yangi Amal Qo'shish"
        >
          <FontAwesomeIcon icon={faPlus} className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2]" />
        </button>

        {/* Tahlil */}
        <NavLink
          to="/analytics"
          className={({ isActive }) =>
            cn(
              'flex flex-col items-center justify-center w-10 h-10 sm:w-11 sm:h-11 rounded-xl transition-all',
              isActive ? 'text-cyan-400 bg-cyan-500/15 border border-cyan-400/30' : 'text-slate-400 hover:text-slate-200'
            )
          }
          title="Tahlil"
        >
          <FontAwesomeIcon icon={faArrowTrendUp} className="w-4 h-4 sm:w-5 sm:h-5" />
        </NavLink>

        {/* Prognoz */}
        <NavLink
          to="/forecasting"
          className={({ isActive }) =>
            cn(
              'flex flex-col items-center justify-center w-10 h-10 sm:w-11 sm:h-11 rounded-xl transition-all',
              isActive ? 'text-cyan-400 bg-cyan-500/15 border border-cyan-400/30' : 'text-slate-400 hover:text-slate-200'
            )
          }
          title="Prognoz"
        >
          <FontAwesomeIcon icon={faWandMagicSparkles} className="w-4 h-4 sm:w-5 sm:h-5" />
        </NavLink>

        {/* Kategoriyalar */}
        <NavLink
          to="/categories"
          className={({ isActive }) =>
            cn(
              'flex flex-col items-center justify-center w-10 h-10 sm:w-11 sm:h-11 rounded-xl transition-all',
              isActive ? 'text-cyan-400 bg-cyan-500/15 border border-cyan-400/30' : 'text-slate-400 hover:text-slate-200'
            )
          }
          title="Kategoriyalar"
        >
          <FontAwesomeIcon icon={faFolderOpen} className="w-4 h-4 sm:w-5 sm:h-5" />
        </NavLink>
      </nav>

      {/* Add Transaction Dialog (Triggered globally via mobile bottom + button) */}
      <AddTransactionDialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen} />
    </div>
  )
}
