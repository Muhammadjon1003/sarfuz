import { NavLink } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  faUser, 
  faBars, 
  faBarsStaggered,
  IconDefinition
} from '@fortawesome/free-solid-svg-icons'
import { cn } from '@/lib/utils'
import logoDark from '@/assets/logo-dark.png'

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
  return (
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
        {/* Hamburger Menu Toggle Button */}
        <div className="hidden lg:block p-3 border-t border-teal-500/10">
          <button
            onClick={toggleSidebar}
            className="w-full flex items-center justify-center py-2.5 px-3 text-slate-400 hover:text-cyan-300 hover:bg-teal-950/40 rounded-xl transition-all group"
            title={sidebarCollapsed ? "Menyuni Kengaytirish" : "Menyuni Yig'ish"}
          >
            <FontAwesomeIcon 
              icon={sidebarCollapsed ? faBars : faBarsStaggered} 
              className="w-5 h-5 group-hover:scale-110 transition-transform" 
            />
            {!sidebarCollapsed && (
              <span className="text-xs font-semibold uppercase tracking-wider ml-2.5">Yig'ish</span>
            )}
          </button>
        </div>

        {/* User info Link to Profile Page (Single Primary Gateway) */}
        <div className="p-3 border-t border-teal-500/10">
          <NavLink
            to="/profile"
            title={sidebarCollapsed ? (user ? `${user.first_name} ${user.last_name || ''}` : telegramId || '') : undefined}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 p-2.5 rounded-xl transition-all duration-200 border',
                isActive
                  ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.2)]'
                  : 'bg-teal-950/40 text-slate-300 border-teal-500/15 hover:border-cyan-400/30 hover:bg-teal-900/30',
                sidebarCollapsed && 'justify-center p-2'
              )
            }
          >
            {!sidebarCollapsed ? (
              <>
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
                <div className="flex-1 min-w-0">
                  {user ? (
                    <>
                      <p className="text-xs font-semibold text-slate-200 truncate">
                        {user.first_name} {user.last_name || ''}
                      </p>
                      <p className="text-[11px] text-cyan-400/70 truncate">
                        @{user.username || telegramId}
                      </p>
                    </>
                  ) : (
                    <>
                      <p className="text-xs font-semibold text-slate-200 truncate">Telegram User</p>
                      <p className="text-[11px] text-cyan-400/70 truncate">{telegramId || 'Not connected'}</p>
                    </>
                  )}
                </div>
              </>
            ) : (
              <div className="w-9 h-9 overflow-hidden border border-cyan-400/30 rounded-xl flex items-center justify-center text-cyan-300 shadow-[0_0_10px_rgba(6,182,212,0.2)] bg-teal-950/60">
                {user?.photo_url ? (
                  <img src={user.photo_url} alt="Profile" className="w-full h-full object-cover" />
                ) : user?.first_name ? (
                  <img
                    src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.first_name + ' ' + (user.last_name || ''))}&background=06b6d4&color=ffffff&bold=true`}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <FontAwesomeIcon icon={faUser} className="w-4 h-4" />
                )}
              </div>
            )}
          </NavLink>
        </div>
      </div>
    </aside>
  )
}
