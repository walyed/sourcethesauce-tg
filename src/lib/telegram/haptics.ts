import { getTelegramWebApp } from './types'

/**
 * Haptic feedback functions for Telegram Mini App
 */

export function lightImpact() {
  const webApp = getTelegramWebApp()
  webApp?.HapticFeedback?.impactOccurred('light')
}

export function mediumImpact() {
  const webApp = getTelegramWebApp()
  webApp?.HapticFeedback?.impactOccurred('medium')
}

export function heavyImpact() {
  const webApp = getTelegramWebApp()
  webApp?.HapticFeedback?.impactOccurred('heavy')
}

export function rigidImpact() {
  const webApp = getTelegramWebApp()
  webApp?.HapticFeedback?.impactOccurred('rigid')
}

export function softImpact() {
  const webApp = getTelegramWebApp()
  webApp?.HapticFeedback?.impactOccurred('soft')
}

export function successNotification() {
  const webApp = getTelegramWebApp()
  webApp?.HapticFeedback?.notificationOccurred('success')
}

export function errorNotification() {
  const webApp = getTelegramWebApp()
  webApp?.HapticFeedback?.notificationOccurred('error')
}

export function warningNotification() {
  const webApp = getTelegramWebApp()
  webApp?.HapticFeedback?.notificationOccurred('warning')
}

export function selectionChanged() {
  const webApp = getTelegramWebApp()
  webApp?.HapticFeedback?.selectionChanged()
}
