/**
 * Telegram Mini App integration utilities
 */

interface TelegramWebApp {
  initData: string
  initDataUnsafe: {
    user?: {
      id: number
      first_name: string
      last_name?: string
      username?: string
      language_code?: string
    }
    start_param?: string
  }
  version: string
  platform: string
  colorScheme: 'light' | 'dark'
  themeParams: {
    bg_color?: string
    text_color?: string
    hint_color?: string
    link_color?: string
    button_color?: string
    button_text_color?: string
  }
  isExpanded: boolean
  viewportHeight: number
  viewportStableHeight: number
  headerColor: string
  backgroundColor: string
  BackButton: {
    isVisible: boolean
    onClick: (callback: () => void) => void
    offClick: (callback: () => void) => void
    show: () => void
    hide: () => void
  }
  MainButton: {
    text: string
    color: string
    textColor: string
    isVisible: boolean
    isActive: boolean
    isProgressVisible: boolean
    setText: (text: string) => void
    onClick: (callback: () => void) => void
    offClick: (callback: () => void) => void
    show: () => void
    hide: () => void
    enable: () => void
    disable: () => void
    showProgress: (leaveActive?: boolean) => void
    hideProgress: () => void
  }
  HapticFeedback: {
    impactOccurred: (style: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft') => void
    notificationOccurred: (type: 'error' | 'success' | 'warning') => void
    selectionChanged: () => void
  }
  ready: () => void
  expand: () => void
  close: () => void
  sendData: (data: string) => void
  openLink: (url: string) => void
  openTelegramLink: (url: string) => void
  showPopup: (params: {
    title?: string
    message: string
    buttons?: Array<{ id?: string; type?: string; text: string }>
  }, callback?: (buttonId: string) => void) => void
  showAlert: (message: string, callback?: () => void) => void
  showConfirm: (message: string, callback?: (confirmed: boolean) => void) => void
}

declare global {
  interface Window {
    Telegram?: {
      WebApp: TelegramWebApp
    }
  }
}

/**
 * Check if app is running inside Telegram
 */
export function isTelegramMiniApp(): boolean {
  return typeof window !== 'undefined' && !!window.Telegram?.WebApp
}

/**
 * Get Telegram WebApp instance
 */
export function getTelegramWebApp(): TelegramWebApp | null {
  if (isTelegramMiniApp()) {
    return window.Telegram!.WebApp
  }
  return null
}

/**
 * Initialize Telegram Mini App
 */
export function initTelegramMiniApp() {
  const webApp = getTelegramWebApp()
  if (webApp) {
    webApp.ready()
    webApp.expand()
    return webApp
  }
  return null
}

/**
 * Get Telegram user data
 */
export function getTelegramUser() {
  const webApp = getTelegramWebApp()
  if (webApp && webApp.initDataUnsafe.user) {
    return {
      id: webApp.initDataUnsafe.user.id,
      firstName: webApp.initDataUnsafe.user.first_name,
      lastName: webApp.initDataUnsafe.user.last_name,
      username: webApp.initDataUnsafe.user.username,
      languageCode: webApp.initDataUnsafe.user.language_code,
    }
  }
  return null
}

/**
 * Apply Telegram theme to app
 */
export function applyTelegramTheme() {
  const webApp = getTelegramWebApp()
  if (webApp) {
    const theme = webApp.themeParams
    
    // Apply theme colors to CSS variables
    if (theme.bg_color) {
      document.documentElement.style.setProperty('--tg-bg-color', theme.bg_color)
    }
    if (theme.text_color) {
      document.documentElement.style.setProperty('--tg-text-color', theme.text_color)
    }
    if (theme.button_color) {
      document.documentElement.style.setProperty('--tg-button-color', theme.button_color)
    }
    if (theme.button_text_color) {
      document.documentElement.style.setProperty('--tg-button-text-color', theme.button_text_color)
    }
    
    // Apply color scheme
    if (webApp.colorScheme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }
}

/**
 * Show Telegram back button
 */
export function showBackButton(onClick: () => void) {
  const webApp = getTelegramWebApp()
  if (webApp) {
    webApp.BackButton.onClick(onClick)
    webApp.BackButton.show()
  }
}

/**
 * Hide Telegram back button
 */
export function hideBackButton() {
  const webApp = getTelegramWebApp()
  if (webApp) {
    webApp.BackButton.hide()
  }
}

/**
 * Show Telegram main button
 */
export function showMainButton(text: string, onClick: () => void) {
  const webApp = getTelegramWebApp()
  if (webApp) {
    webApp.MainButton.setText(text)
    webApp.MainButton.onClick(onClick)
    webApp.MainButton.show()
  }
}

/**
 * Hide Telegram main button
 */
export function hideMainButton() {
  const webApp = getTelegramWebApp()
  if (webApp) {
    webApp.MainButton.hide()
  }
}

/**
 * Trigger haptic feedback
 */
export function hapticFeedback(type: 'light' | 'medium' | 'heavy' | 'success' | 'error' | 'warning') {
  const webApp = getTelegramWebApp()
  if (webApp) {
    if (type === 'success' || type === 'error' || type === 'warning') {
      webApp.HapticFeedback.notificationOccurred(type)
    } else {
      webApp.HapticFeedback.impactOccurred(type)
    }
  }
}

/**
 * Close Telegram Mini App
 */
export function closeTelegramMiniApp() {
  const webApp = getTelegramWebApp()
  if (webApp) {
    webApp.close()
  }
}

/**
 * Show Telegram alert
 */
export function showTelegramAlert(message: string, callback?: () => void) {
  const webApp = getTelegramWebApp()
  if (webApp) {
    webApp.showAlert(message, callback)
  } else {
    alert(message)
    callback?.()
  }
}

/**
 * Show Telegram confirm dialog
 */
export function showTelegramConfirm(message: string, callback?: (confirmed: boolean) => void) {
  const webApp = getTelegramWebApp()
  if (webApp) {
    webApp.showConfirm(message, callback)
  } else {
    const confirmed = confirm(message)
    callback?.(confirmed)
  }
}
