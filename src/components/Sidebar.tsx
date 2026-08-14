import { NavLink } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  faUser, 
  faBars, 
  faBarsStaggered,
  IconDefinition
} from '@fortawesome/free-solid-svg-icons'
import { cn } from '@/lib/utils'
import { useThemeStore } from '@/store/themeStore'
import logoDark from '@/assets/logo-dark.png'
import logoLight from '@/assets/logo-light.png'

export interface NavigationItem {
  name: string
  href: string
  icon: IconDefinition
}

interface SidebarProps {
  sidebarCollapsed: boolean
  toggleSidebar: () => void
  navigation: NavigationItem[]
  user: any
  telegramId: string | null
}

export default function Sidebar({
  sidebarCollapsed,
  toggleSidebar,
  navigation,
  user,
  telegramId,
}: SidebarProps) {
  const { theme } = useThemeStore()
  const logo = theme === 'light' ? logoLight : logoDark

  return (
    <aside
      className={cn(
        'hidden lg:flex fixed inset-y-0 left-0 z-50 flex-col justify-between shadow-2xl transition-all duration-300 ease-in-out border-r',
        theme === 'dark' 
          ? 'bg-[#06181f]/90 backdrop-blur-2xl border-teal-500/15' 
          : 'bg-white/90 backdrop-blur-2xl border-cyan-400/20 shadow-cyan-900/5',
        sidebarCollapsed ? 'w-20' : 'w-64'
      )}
    >
      <div className="flex flex-col flex-1 min-h-0">
        {/* Logo & Top Hamburger Header */}
        <div className="flex items-center justify-between h-20 px-4 border-b border-teal-500/10">
          {!sidebarCollapsed ? (
            <>
              <div className="flex items-center gap-3 min-w-0">
                <img
                  src={logo}
                  alt="SARF"
                  className="w-10 h-10 rounded-xl object-cover border border-cyan-400/30 shadow-[0_0_15px_rgba(6,182,212,0.3)] flex-shrink-0"
                />
                <div className="min-w-0">
                  <h1 className={cn(
                    'text-lg font-black tracking-wider uppercase truncate',
                    theme === 'dark' ? 'bg-gradient-to-r from-white via-cyan-100 to-teal-200 bg-clip-text text-transparent' : 'text-slate-900'
                  )}>
                    SARF
                  </h1>
                  <p className="text-[10px] text-cyan-500 uppercase tracking-widest font-semibold truncate">
                    Biznes Moliya
                  </p>
                </div>
              </div>

              {/* Hamburger Button next to Logo & Name when Expanded */}
              <button
                onClick={toggleSidebar}
                className={cn(
                  'p-2 rounded-xl transition-all duration-200 group flex-shrink-0',
                  theme === 'dark' 
                    ? 'text-slate-400 hover:text-cyan-300 hover:bg-teal-950/40' 
                    : 'text-slate-500 hover:text-cyan-600 hover:bg-cyan-50'
                )}
                title="Menyuni Yig'ish"
              >
                <FontAwesomeIcon 
                  icon={faBarsStaggered} 
                  className="w-5 h-5 group-hover:scale-110 transition-transform" 
                />
              </button>
            </>
          ) : (
            /* Hamburger Button replacing Header when Collapsed */
            <button
              onClick={toggleSidebar}
              className={cn(
                'w-full h-full flex items-center justify-center transition-all group',
                theme === 'dark' ? 'text-cyan-400 hover:text-white' : 'text-cyan-600 hover:text-slate-900'
              )}
              title="Menyuni Kengaytirish"
            >
              <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-400/30 group-hover:scale-110 transition-transform shadow-[0_0_12px_rgba(6,182,212,0.2)]">
                <FontAwesomeIcon icon={faBars} className="w-5 h-5" />
              </div>
            </button>
          )}
        </div>

        {/* Navigation links with smooth text animations */}
        <nav className="px-3 py-6 space-y-1.5 flex-1 overflow-y-auto">
          {navigation.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              end={item.href === '/'}
              title={sidebarCollapsed ? item.name : undefined}
              className={({ isActive }) =>
                cn(
                  'flex items-center px-3.5 py-3 text-sm font-medium rounded-xl transition-all duration-300 relative group overflow-hidden',
                  isActive
                    ? theme === 'dark'
                      ? 'bg-gradient-to-r from-cyan-500/20 via-teal-500/10 to-transparent text-cyan-300 border-l-2 border-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.15)]'
                      : 'bg-gradient-to-r from-cyan-500/15 via-teal-500/10 to-transparent text-cyan-700 border-l-2 border-cyan-500 shadow-sm'
                    : theme === 'dark'
                      ? 'text-slate-400 hover:text-slate-100 hover:bg-teal-950/40'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-cyan-50/80',
                  sidebarCollapsed && 'justify-center px-0'
                )
              }
            >
              {({ isActive }) => (
                <>
                  <FontAwesomeIcon
                    icon={item.icon}
                    className={cn(
                      'w-5 h-5 flex-shrink-0 transition-transform duration-300 group-hover:scale-110',
                      isActive 
                        ? (theme === 'dark' ? 'text-cyan-400' : 'text-cyan-600') 
                        : (theme === 'dark' ? 'text-slate-400 group-hover:text-cyan-300' : 'text-slate-500 group-hover:text-cyan-600'),
                      !sidebarCollapsed && 'mr-3'
                    )}
                  />
                  <span
                    className={cn(
                      'whitespace-nowrap transition-all duration-300 ease-in-out',
                      sidebarCollapsed ? 'w-0 opacity-0 pointer-events-none hidden' : 'w-auto opacity-100'
                    )}
                  >
                    {item.name}
                  </span>
                </>
              )}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Sidebar Footer User info Link to Profile Page */}
      <div className="p-3 border-t border-teal-500/10">
        <NavLink
          to="/profile"
          title={sidebarCollapsed ? (user ? `${user.first_name} ${user.last_name || ''}` : telegramId || '') : undefined}
          className={({ isActive }) =>
            cn(
              'flex items-center gap-3 p-2.5 rounded-xl transition-all duration-300 border overflow-hidden',
              isActive
                ? theme === 'dark'
                  ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.2)]'
                  : 'bg-cyan-50 text-cyan-700 border-cyan-400 shadow-sm'
                : theme === 'dark'
                  ? 'bg-teal-950/40 text-slate-300 border-teal-500/15 hover:border-cyan-400/30 hover:bg-teal-900/30'
                  : 'bg-slate-50 text-slate-700 border-cyan-400/20 hover:border-cyan-400/40 hover:bg-cyan-50/80',
              sidebarCollapsed && 'justify-center p-2'
            )
          }
        >
          {user?.photo_url ? (
            <img
              src={user.photo_url}
              alt={user.first_name || 'Profile'}
              className="w-9 h-9 rounded-lg object-cover border border-cyan-400/40 shadow-[0_0_10px_rgba(6,182,212,0.3)] flex-shrink-0"
            />
          ) : user?.first_name ? (
            <img
              src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.first_name + ' ' + (user.last_name || ''))}&background=06b6d4&color=ffffff&bold=true`}
              alt={user.first_name}
              className="w-9 h-9 rounded-lg object-cover border border-cyan-400/40 shadow-[0_0_10px_rgba(6,182,212,0.3)] flex-shrink-0"
            />
          ) : (
            <div className="w-9 h-9 bg-gradient-to-br from-cyan-500/30 to-teal-500/20 border border-cyan-400/30 rounded-lg flex items-center justify-center text-cyan-300 shadow-[0_0_10px_rgba(6,182,212,0.2)] flex-shrink-0">
              <FontAwesomeIcon icon={faUser} className="w-4 h-4" />
            </div>
          )}

          <div
            className={cn(
              'flex-1 min-w-0 whitespace-nowrap transition-all duration-300 ease-in-out',
              sidebarCollapsed ? 'w-0 opacity-0 pointer-events-none hidden' : 'w-auto opacity-100'
            )}
          >
            {user ? (
              <>
                <p className={cn("text-xs font-semibold truncate", theme === 'dark' ? "text-slate-200" : "text-slate-800")}>
                  {user.first_name} {user.last_name || ''}
                </p>
                <p className={cn("text-[11px] truncate", theme === 'dark' ? "text-cyan-400/70" : "text-cyan-600/80")}>
                  @{user.username || telegramId}
                </p>
              </>
            ) : (
              <>
                <p className={cn("text-xs font-semibold truncate", theme === 'dark' ? "text-slate-200" : "text-slate-800")}>
                  Telegram User
                </p>
                <p className={cn("text-[11px] truncate", theme === 'dark' ? "text-cyan-400/70" : "text-cyan-600/80")}>
                  {telegramId || 'Not connected'}
                </p>
              </>
            )}
          </div>
        </NavLink>
      </div>
    </aside>
  )
}
