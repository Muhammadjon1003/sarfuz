import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useEffect } from 'react'
import { useAuthStore } from './store/authStore'
import Layout from './components/Layout'
import Overview from './pages/Overview'
import Transactions from './pages/Transactions'
import Analytics from './pages/Analytics'
import Categories from './pages/Categories'
import Debts from './pages/Debts'
import Forecasting from './pages/Forecasting'
import Onboarding from './pages/Onboarding'
import { initTelegramMiniApp, getTelegramUser, applyTelegramTheme, isTelegramMiniApp } from './lib/telegram'

function App() {
  const { telegramId, setTelegramId } = useAuthStore()

  useEffect(() => {
    // Initialize Telegram Mini App if running inside Telegram
    if (isTelegramMiniApp()) {
      initTelegramMiniApp()
      applyTelegramTheme()
      
      // Get user from Telegram
      const telegramUser = getTelegramUser()
      if (telegramUser) {
        setTelegramId(telegramUser.id.toString())
        localStorage.setItem('telegram_id', telegramUser.id.toString())
        console.log('Telegram Mini App initialized for user:', telegramUser.id)
      }
    } else {
      // Get telegram ID from env or localStorage (web version)
      const envTelegramId = import.meta.env.VITE_TELEGRAM_ID
      const storedTelegramId = localStorage.getItem('telegram_id')
      
      if (envTelegramId) {
        setTelegramId(envTelegramId)
      } else if (storedTelegramId) {
        setTelegramId(storedTelegramId)
      }
    }
  }, [setTelegramId])

  if (!telegramId) {
    return <Onboarding />
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Overview />} />
          <Route path="transactions" element={<Transactions />} />
          <Route path="debts" element={<Debts />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="forecasting" element={<Forecasting />} />
          <Route path="categories" element={<Categories />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
