import { ReactNode, useEffect } from 'react'
import { styled } from 'stitches.config'
import { BottomNav } from './BottomNav'
import { getTelegramWebApp } from '@/lib/telegram/types'

const Container = styled('div', {
  minHeight: '100vh',
  width: '100%',
  backgroundColor: 'var(--tg-theme-bg-color, #ffffff)',
  color: 'var(--tg-theme-text-color, #000000)',
  paddingTop: 'env(safe-area-inset-top)',
  // base bottom padding if no nav
  paddingBottom: 'env(safe-area-inset-bottom)',
  display: 'flex',
  justifyContent: 'center',

  variants: {
    withNav: {
      true: {
        paddingBottom: 'calc(72px + env(safe-area-inset-bottom))',
      },
      false: {
        paddingBottom: 'env(safe-area-inset-bottom)',
      },
    },
  },

  defaultVariants: {
    withNav: true,
  },
})

const Main = styled('main', {
  width: '100%',
  maxWidth: 520, // nice mobile app shell
  minHeight: '100vh',
  overflowX: 'hidden',
  WebkitOverflowScrolling: 'touch',
})

interface TelegramLayoutProps {
  children: ReactNode
  showNav?: boolean
  cartCount?: number
}

export function TelegramLayout({
  children,
  showNav = true,
  cartCount = 0,
}: TelegramLayoutProps) {
  useEffect(() => {
    const webApp = getTelegramWebApp()

    if (webApp) {
      // Use all available height in Telegram
      try {
        webApp.expand()
      } catch {
        // ignore
      }

      const applyTheme = () => {
        const theme = webApp.themeParams
        const root = document.documentElement

        if (!theme || !root) return

        if (theme.bg_color)
          root.style.setProperty('--tg-theme-bg-color', theme.bg_color)
        if (theme.text_color)
          root.style.setProperty('--tg-theme-text-color', theme.text_color)
        if (theme.hint_color)
          root.style.setProperty('--tg-theme-hint-color', theme.hint_color)
        if (theme.link_color)
          root.style.setProperty('--tg-theme-link-color', theme.link_color)
        if (theme.button_color)
          root.style.setProperty('--tg-theme-button-color', theme.button_color)
        if (theme.button_text_color)
          root.style.setProperty(
            '--tg-theme-button-text-color',
            theme.button_text_color
          )
        if (theme.secondary_bg_color)
          root.style.setProperty(
            '--tg-theme-secondary-bg-color',
            theme.secondary_bg_color
          )

        // Sync body background for smoother edges
        if (theme.bg_color) {
          document.body.style.backgroundColor = theme.bg_color
        }
      }

      applyTheme()

      // Handle runtime theme changes (dark/light switch in Telegram)
      const anyWebApp = webApp as any
      if (anyWebApp?.onEvent && anyWebApp?.offEvent) {
        const listener = () => applyTheme()
        anyWebApp.onEvent('themeChanged', listener)
        return () => {
          anyWebApp.offEvent('themeChanged', listener)
        }
      }
    }
  }, [])

  return (
    <Container withNav={showNav}>
      <Main>{children}</Main>
      {showNav && <BottomNav cartCount={cartCount} />}
    </Container>
  )
}

export default TelegramLayout
