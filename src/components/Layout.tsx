import { Outlet, NavLink, useLocation } from 'react-router-dom'
import { LayoutDashboard, Receipt, TrendingUp, FolderOpen, Menu, X, User, ChevronLeft, ChevronRight, Users, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useState, useEffect } from 'react'
import { useAuthStore } from '@/store/authStore'
import { getUser } from '@/lib/api'

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Tranzaksiyalar', href: '/transactions', icon: Receipt },
  { name: 'Qarzlar', href: '/debts', icon: Users },
  { name: 'Tahlil', href: '/analytics', icon: TrendingUp },
  { name: 'Prognoz', href: '/forecasting', icon: Sparkles },
  { name: 'Kategoriyalar', href: '/categories', icon: FolderOpen },
]

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    // Load collapsed state from localStorage
    const saved = localStorage.getItem('sidebar-collapsed')
    return saved === 'true'
  })
  const { telegramId, user, setUser } = useAuthStore()
  const location = useLocation()

  // Fetch user data
  useEffect(() => {
    if (telegramId && !user) {
      getUser(telegramId)
        .then((res) => setUser(res.data))
        .catch((err) => console.error('Failed to fetch user:', err))
    }
  }, [telegramId, user, setUser])

  // Get current page name
  const currentPage = navigation.find(item => {
    if (item.href === '/') {
      return location.pathname === '/'
    }
    return location.pathname.startsWith(item.href)
  })

  // Save collapsed state to localStorage
  const toggleSidebar = () => {
    const newState = !sidebarCollapsed
    setSidebarCollapsed(newState)
    localStorage.setItem('sidebar-collapsed', String(newState))
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-gray-900/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          'fixed inset-y-0 left-0 bg-white border-r border-gray-200 z-50 transform transition-all duration-300 ease-in-out lg:translate-x-0',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full',
          sidebarCollapsed ? 'w-20' : 'w-64'
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between h-16 px-6 border-b border-gray-100">
            {!sidebarCollapsed ? (
              <>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-sm">FM</span>
                  </div>
                  <h1 className="text-lg font-semibold text-gray-900">Finance Manager</h1>
                </div>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="lg:hidden text-gray-500 hover:text-gray-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </>
            ) : (
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center mx-auto">
                <span className="text-white font-bold text-sm">FM</span>
              </div>
            )}
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-3 py-6 space-y-1">
            {navigation.map((item) => (
              <NavLink
                key={item.name}
                to={item.href}
                end={item.href === '/'}
                onClick={() => setSidebarOpen(false)}
                title={sidebarCollapsed ? item.name : undefined}
                className={({ isActive }) =>
                  cn(
                    'flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-150',
                    isActive
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900',
                    sidebarCollapsed && 'justify-center'
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    <item.icon className={cn('w-5 h-5', !sidebarCollapsed && 'mr-3', isActive ? 'text-blue-600' : 'text-gray-400')} />
                    {!sidebarCollapsed && item.name}
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          {/* Collapse Toggle Button - Desktop only */}
          <div className="hidden lg:block p-3 border-t border-gray-100">
            <button
              onClick={toggleSidebar}
              className="w-full flex items-center justify-center px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
              title={sidebarCollapsed ? "Kengaytirish" : "Yig'ish"}
            >
              {sidebarCollapsed ? (
                <ChevronRight className="w-5 h-5" />
              ) : (
                <>
                  <ChevronLeft className="w-5 h-5 mr-2" />
                  <span className="text-sm font-medium">Yig'ish</span>
                </>
              )}
            </button>
          </div>

          {/* User info */}
          {!sidebarCollapsed && (
            <div className="p-4 border-t border-gray-100">
              <div className="flex items-center gap-3 px-3 py-2 bg-gray-50 rounded-lg">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  {user ? (
                    <>
                      <p className="text-xs font-medium text-gray-900 truncate">
                        {user.first_name} {user.last_name}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        @{user.username || telegramId}
                      </p>
                    </>
                  ) : (
                    <>
                      <p className="text-xs font-medium text-gray-900 truncate">Telegram ID</p>
                      <p className="text-xs text-gray-500 truncate">{telegramId || 'Not set'}</p>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}
          
          {/* User icon only when collapsed */}
          {sidebarCollapsed && (
            <div className="p-4 border-t border-gray-100">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mx-auto" title={user ? `${user.first_name} ${user.last_name}` : telegramId || ''}>
                <User className="w-5 h-5 text-blue-600" />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main content */}
      <div className={cn('transition-all duration-300', sidebarCollapsed ? 'lg:pl-20' : 'lg:pl-64')}>
        {/* Top bar */}
        <div className="sticky top-0 z-30 bg-white border-b border-gray-200">
          <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden text-gray-500 hover:text-gray-700"
              >
                <Menu className="w-6 h-6" />
              </button>
              
              {/* Page Title */}
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center lg:hidden">
                  <span className="text-white font-bold text-sm">FM</span>
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">{currentPage?.name || 'Dashboard'}</h1>
                </div>
              </div>
            </div>
            
            {/* Right side - will be filled by page content */}
            <div id="page-actions"></div>
          </div>
        </div>

        {/* Page content */}
        <main className="p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
