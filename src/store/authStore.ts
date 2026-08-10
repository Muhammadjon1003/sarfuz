import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface User {
  telegram_id: number
  username?: string
  first_name?: string
  last_name?: string
  photo_url?: string
}

interface AuthState {
  telegramId: string | null
  user: User | null
  setTelegramId: (id: string) => void
  setUser: (user: User) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      telegramId: null,
      user: null,
      setTelegramId: (id: string) => {
        localStorage.setItem('telegram_id', id)
        set({ telegramId: id })
      },
      setUser: (user: User) => set({ user }),
      logout: () => {
        localStorage.removeItem('telegram_id')
        set({ telegramId: null, user: null })
      },
    }),
    {
      name: 'auth-storage',
    }
  )
)
