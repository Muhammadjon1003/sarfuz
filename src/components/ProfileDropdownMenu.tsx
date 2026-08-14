import { useState, useRef, useEffect } from 'react'
import { useAuthStore } from '@/store/authStore'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  faUser, 
  faRightFromBracket, 
  faXmark, 
  faShieldHalved, 
  faPaperPlane, 
  faCheckCircle,
  faBolt
} from '@fortawesome/free-solid-svg-icons'

export default function ProfileDropdownMenu() {
  const { user, telegramId, logout } = useAuthStore()
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  // Close popover on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  return (
    <div className="relative" ref={menuRef}>
      {/* Profile Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 p-1.5 rounded-xl bg-teal-950/40 border border-teal-500/20 hover:border-cyan-400/40 hover:bg-teal-900/30 transition-all group"
        title="Profil Menyusi"
      >
        {user?.photo_url ? (
          <img
            src={user.photo_url}
            alt={user.first_name || 'Profile'}
            className="w-8 h-8 rounded-lg object-cover border border-cyan-400/40 shadow-[0_0_8px_rgba(6,182,212,0.3)]"
          />
        ) : user?.first_name ? (
          <img
            src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.first_name + ' ' + (user.last_name || ''))}&background=06b6d4&color=ffffff&bold=true`}
            alt={user.first_name}
            className="w-8 h-8 rounded-lg object-cover border border-cyan-400/40 shadow-[0_0_8px_rgba(6,182,212,0.3)]"
          />
        ) : (
          <div className="w-8 h-8 bg-gradient-to-br from-cyan-500/30 to-teal-500/20 border border-cyan-400/30 rounded-lg flex items-center justify-center text-cyan-300 shadow-[0_0_8px_rgba(6,182,212,0.2)]">
            <FontAwesomeIcon icon={faUser} className="w-4 h-4" />
          </div>
        )}
        <span className="text-xs font-bold text-slate-200 hidden md:inline truncate max-w-[100px]">
          {user?.first_name || 'Profil'}
        </span>
      </button>

      {/* Mobile Full Backdrop Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 sm:hidden bg-black/60 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Adaptive Profile Container: Full-Screen Page on Mobile (< sm), Centered Modal on Desktop (sm:) */}
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-[#040e12] sm:bg-transparent sm:absolute sm:inset-auto sm:right-0 sm:top-full sm:mt-3 sm:w-80 w-full h-full sm:h-auto glass-panel-modal rounded-none sm:rounded-3xl border-0 sm:border sm:border-teal-500/30 shadow-2xl p-6 overflow-y-auto animate-in fade-in slide-in-from-top-2 duration-200 flex flex-col justify-between sm:justify-start">
          <div>
            {/* Header / Top Bar */}
            <div className="flex items-center justify-between pb-4 border-b border-teal-500/15">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-cyan-500/15 border border-cyan-400/30 flex items-center justify-center text-cyan-300">
                  <FontAwesomeIcon icon={faUser} className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-white text-base">Foydalanuvchi Profili</h3>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-slate-400 hover:text-white p-1.5 rounded-xl hover:bg-teal-900/40 transition-colors"
              >
                <FontAwesomeIcon icon={faXmark} className="w-5 h-5" />
              </button>
            </div>

            {/* Profile Avatar & Details */}
            <div className="py-6 text-center border-b border-teal-500/15">
              {user?.photo_url ? (
                <img
                  src={user.photo_url}
                  alt={user.first_name || 'Profile'}
                  className="w-20 h-20 rounded-2xl object-cover border-2 border-cyan-400/50 shadow-[0_0_20px_rgba(6,182,212,0.4)] mx-auto mb-3"
                />
              ) : user?.first_name ? (
                <img
                  src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.first_name + ' ' + (user.last_name || ''))}&background=06b6d4&color=ffffff&bold=true`}
                  alt={user.first_name}
                  className="w-20 h-20 rounded-2xl object-cover border-2 border-cyan-400/50 shadow-[0_0_20px_rgba(6,182,212,0.4)] mx-auto mb-3"
                />
              ) : (
                <div className="w-20 h-20 bg-gradient-to-br from-cyan-500/30 to-teal-500/20 border-2 border-cyan-400/40 rounded-2xl flex items-center justify-center text-cyan-300 mx-auto mb-3 shadow-[0_0_20px_rgba(6,182,212,0.3)]">
                  <FontAwesomeIcon icon={faUser} className="w-9 h-9" />
                </div>
              )}

              <h4 className="text-lg font-black text-white">
                {user ? `${user.first_name} ${user.last_name || ''}` : 'Telegram Foydalanuvchisi'}
              </h4>
              <p className="text-xs text-cyan-400/80 font-mono mt-0.5">
                @{user?.username || telegramId || 'Ulanmagan'}
              </p>

              <div className="inline-flex items-center gap-1.5 mt-3 px-3 py-1 bg-emerald-500/15 border border-emerald-400/30 rounded-full text-[11px] font-bold text-emerald-300">
                <FontAwesomeIcon icon={faCheckCircle} className="w-3 h-3 text-emerald-400" />
                Hisob Faol • Telegram Bot Sync
              </div>
            </div>

            {/* Account Information List */}
            <div className="py-4 space-y-3">
              <div className="flex items-center justify-between p-3 rounded-2xl bg-teal-950/40 border border-teal-500/15 text-xs">
                <span className="text-slate-400 flex items-center gap-2 font-medium">
                  <FontAwesomeIcon icon={faPaperPlane} className="w-3.5 h-3.5 text-cyan-400" />
                  Telegram ID:
                </span>
                <span className="font-mono font-bold text-slate-200">{telegramId || '-'}</span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-2xl bg-teal-950/40 border border-teal-500/15 text-xs">
                <span className="text-slate-400 flex items-center gap-2 font-medium">
                  <FontAwesomeIcon icon={faBolt} className="w-3.5 h-3.5 text-cyan-400" />
                  Tizim Holati:
                </span>
                <span className="font-semibold text-emerald-400">Onlayn</span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-2xl bg-teal-950/40 border border-teal-500/15 text-xs">
                <span className="text-slate-400 flex items-center gap-2 font-medium">
                  <FontAwesomeIcon icon={faShieldHalved} className="w-3.5 h-3.5 text-cyan-400" />
                  Xavfsizlik:
                </span>
                <span className="font-semibold text-cyan-300">Shifrlangan</span>
              </div>
            </div>
          </div>

          {/* Logout Action Button */}
          <div className="pt-4 border-t border-teal-500/15">
            <button
              onClick={() => {
                if (confirm("Hisobdan chiqmoqchimisiz?")) {
                  setIsOpen(false)
                  logout()
                }
              }}
              className="w-full flex items-center justify-center gap-2 p-3 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-300 font-bold text-xs hover:bg-rose-500/25 transition-all shadow-lg shadow-rose-500/10"
            >
              <FontAwesomeIcon icon={faRightFromBracket} className="w-4 h-4" />
              <span>Hisobdan chiqish</span>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
