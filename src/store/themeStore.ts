import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type ThemeMode = 'light' | 'dark' | 'system'

interface ThemeState {
  theme: ThemeMode
  setTheme: (theme: ThemeMode) => void
  toggleTheme: () => void
  getEffectiveTheme: () => 'light' | 'dark'
}

export const getSystemTheme = (): 'light' | 'dark' => {
  if (typeof window !== 'undefined' && window.matchMedia) {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  }
  return 'light'
}

export const applyThemeToBody = (theme: ThemeMode) => {
  if (typeof document === 'undefined') return
  const effectiveTheme = theme === 'system' ? getSystemTheme() : theme
  if (effectiveTheme === 'dark') {
    document.body.classList.remove('light')
    document.body.classList.add('dark')
  } else {
    document.body.classList.remove('dark')
    document.body.classList.add('light')
  }
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      theme: 'light', // Default initial mode is Light Mode
      setTheme: (theme: ThemeMode) => {
        applyThemeToBody(theme)
        set({ theme })
      },
      toggleTheme: () => {
        const current = get().theme
        const nextTheme: ThemeMode = current === 'light' ? 'dark' : current === 'dark' ? 'system' : 'light'
        applyThemeToBody(nextTheme)
        set({ theme: nextTheme })
      },
      getEffectiveTheme: () => {
        const current = get().theme
        return current === 'system' ? getSystemTheme() : current
      },
    }),
    {
      name: 'sarf-theme-preference',
      onRehydrateStorage: () => (state) => {
        if (state) {
          applyThemeToBody(state.theme)
        }
      },
    }
  )
)

// Listen to system color scheme changes when mode is 'system'
if (typeof window !== 'undefined' && window.matchMedia) {
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    const currentTheme = useThemeStore.getState().theme
    if (currentTheme === 'system') {
      applyThemeToBody('system')
    }
  })
}
