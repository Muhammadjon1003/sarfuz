import { useEffect } from 'react'
import { useThemeStore } from '@/store/themeStore'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSun, faMoon } from '@fortawesome/free-solid-svg-icons'
import { cn } from '@/lib/utils'

export default function ThemeToggle() {
  const { theme, toggleTheme } = useThemeStore()

  useEffect(() => {
    const root = document.body
    if (theme === 'light') {
      root.classList.remove('dark')
      root.classList.add('light')
    } else {
      root.classList.remove('light')
      root.classList.add('dark')
    }
  }, [theme])

  return (
    <button
      onClick={toggleTheme}
      className={cn(
        'p-2.5 rounded-xl transition-all duration-300 border flex items-center justify-center group',
        theme === 'dark'
          ? 'bg-teal-950/40 border-teal-500/20 text-cyan-300 hover:border-cyan-400/40 hover:bg-teal-900/30'
          : 'bg-white/80 border-cyan-400/40 text-cyan-600 hover:border-cyan-500 hover:bg-cyan-50 shadow-sm'
      )}
      title={theme === 'dark' ? "Yorug' rejimga o'tish (Light Mode)" : "Qorong'u rejimga o'tish (Dark Mode)"}
    >
      <FontAwesomeIcon
        icon={theme === 'dark' ? faSun : faMoon}
        className="w-4 h-4 group-hover:rotate-45 transition-transform duration-300"
      />
    </button>
  )
}
