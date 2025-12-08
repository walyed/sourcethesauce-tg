import { useEffect, useCallback, useRef } from 'react'
import { getTelegramWebApp } from '@/lib/telegram'

interface MainButtonConfig {
  text: string
  isVisible?: boolean
  isActive?: boolean
  color?: string
  textColor?: string
  onClick?: () => void
}

export function useTelegramMainButton() {
  const callbackRef = useRef<(() => void) | null>(null)

  const configure = useCallback((config: MainButtonConfig) => {
    const webApp = getTelegramWebApp()
    if (!webApp) return

    const { text, isVisible = true, isActive = true, color, textColor, onClick } = config

    // Remove previous callback
    if (callbackRef.current) {
      webApp.MainButton.offClick(callbackRef.current)
    }

    // Set new callback
    if (onClick) {
      callbackRef.current = onClick
      webApp.MainButton.onClick(onClick)
    }

    // Configure button
    webApp.MainButton.setParams({
      text,
      color,
      text_color: textColor,
      is_active: isActive,
      is_visible: isVisible,
    })

    if (isVisible) {
      webApp.MainButton.show()
    } else {
      webApp.MainButton.hide()
    }
  }, [])

  const show = useCallback(() => {
    const webApp = getTelegramWebApp()
    webApp?.MainButton.show()
  }, [])

  const hide = useCallback(() => {
    const webApp = getTelegramWebApp()
    webApp?.MainButton.hide()
  }, [])

  const enable = useCallback(() => {
    const webApp = getTelegramWebApp()
    webApp?.MainButton.enable()
  }, [])

  const disable = useCallback(() => {
    const webApp = getTelegramWebApp()
    webApp?.MainButton.disable()
  }, [])

  const showProgress = useCallback((leaveActive = false) => {
    const webApp = getTelegramWebApp()
    webApp?.MainButton.showProgress(leaveActive)
  }, [])

  const hideProgress = useCallback(() => {
    const webApp = getTelegramWebApp()
    webApp?.MainButton.hideProgress()
  }, [])

  const setText = useCallback((text: string) => {
    const webApp = getTelegramWebApp()
    webApp?.MainButton.setText(text)
  }, [])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      const webApp = getTelegramWebApp()
      if (webApp && callbackRef.current) {
        webApp.MainButton.offClick(callbackRef.current)
      }
    }
  }, [])

  return {
    configure,
    show,
    hide,
    enable,
    disable,
    showProgress,
    hideProgress,
    setText,
  }
}

export default useTelegramMainButton
