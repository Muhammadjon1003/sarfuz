import { useEffect } from 'react'
import { useThemeStore, applyThemeToBody } from '@/store/themeStore'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSun, faMoon, faDesktop } from '@fortawesome/free-solid-svg-icons'
import { cn } from '@/lib/utils'

export default function ThemeToggle() {
  const { theme, toggleTheme, getEffectiveTheme } = useThemeStore()
  const effectiveTheme = getEffectiveTheme()

  useEffect(() => {
    applyThemeToBody(theme)
  }, [theme])

  const getIcon = () => {
    if (theme === 'system') return faDesktop
    return effectiveTheme === 'dark' ? faSun : faMoon
  }

  const getTitle = () => {
    if (theme === 'light') return "Hozirgi rejim: Yorug' (Light). Bosing: Qorong'u rejim"
    if (theme === 'dark') return "Hozirgi rejim: Qorong'u (Dark). Bosing: Tizim rejimi"
    return "Hozirgi rejim: Tizim (System). Bosing: Yorug' rejim"
  }

  return (
    <button
      onClick={toggleTheme}
      className={cn(
        'p-2.5 rounded-xl transition-all duration-300 border flex items-center justify-center group relative',
        effectiveTheme === 'dark'
          ? 'bg-teal-950/40 border-teal-500/20 text-cyan-300 hover:border-cyan-400/40 hover:bg-teal-900/30'
          : 'bg-white/80 border-cyan-400/40 text-cyan-600 hover:border-cyan-500 hover:bg-cyan-50 shadow-sm'
      )}
      title={getTitle()}
    >
      <FontAwesomeIcon
        icon={getIcon()}
        className="w-4 h-4 group-hover:scale-110 transition-transform duration-300"
      />
      {theme === 'system' && (
        <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-cyan-400"></span>
      )}
    </button>
  )
}
