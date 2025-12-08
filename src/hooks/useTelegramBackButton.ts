import { useEffect, useRef, useCallback } from 'react'
import { getTelegramWebApp } from '@/lib/telegram'

export function useTelegramBackButton(onBack?: () => void) {
  const callbackRef = useRef<(() => void) | null>(null)

  const show = useCallback(() => {
    const webApp = getTelegramWebApp()
    webApp?.BackButton.show()
  }, [])

  const hide = useCallback(() => {
    const webApp = getTelegramWebApp()
    webApp?.BackButton.hide()
  }, [])

  const setCallback = useCallback((callback: () => void) => {
    const webApp = getTelegramWebApp()
    if (!webApp) return

    // Remove previous callback
    if (callbackRef.current) {
      webApp.BackButton.offClick(callbackRef.current)
    }

    callbackRef.current = callback
    webApp.BackButton.onClick(callback)
  }, [])

  useEffect(() => {
    const webApp = getTelegramWebApp()
    if (!webApp) return

    if (onBack) {
      callbackRef.current = onBack
      webApp.BackButton.onClick(onBack)
      webApp.BackButton.show()
    }

    return () => {
      if (callbackRef.current) {
        webApp.BackButton.offClick(callbackRef.current)
      }
      webApp.BackButton.hide()
    }
  }, [onBack])

  return {
    show,
    hide,
    setCallback,
  }
}

export default useTelegramBackButton
