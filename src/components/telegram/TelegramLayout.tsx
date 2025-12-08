import { ReactNode, useEffect } from 'react'
import { styled } from 'stitches.config'
import { BottomNav } from './BottomNav'
import { getTelegramWebApp } from '@/lib/telegram/types'

const Container = styled('div', {
  minHeight: '100vh',
  backgroundColor: 'var(--tg-theme-bg-color, #ffffff)',
  color: 'var(--tg-theme-text-color, #000000)',
  paddingBottom: '80px', // Space for bottom nav
})

const Main = styled('main', {
  width: '100%',
  maxWidth: '100vw',
  overflowX: 'hidden',
})

interface TelegramLayoutProps {
  children: ReactNode
  showNav?: boolean
  cartCount?: number
}

export function TelegramLayout({ 
  children, 
  showNav = true,
  cartCount = 0 
}: TelegramLayoutProps) {
  useEffect(() => {
    // Apply Telegram theme colors as CSS variables
    const webApp = getTelegramWebApp()
    if (webApp?.themeParams) {
      const root = document.documentElement
      const theme = webApp.themeParams
      
      if (theme.bg_color) root.style.setProperty('--tg-theme-bg-color', theme.bg_color)
      if (theme.text_color) root.style.setProperty('--tg-theme-text-color', theme.text_color)
      if (theme.hint_color) root.style.setProperty('--tg-theme-hint-color', theme.hint_color)
      if (theme.link_color) root.style.setProperty('--tg-theme-link-color', theme.link_color)
      if (theme.button_color) root.style.setProperty('--tg-theme-button-color', theme.button_color)
      if (theme.button_text_color) root.style.setProperty('--tg-theme-button-text-color', theme.button_text_color)
      if (theme.secondary_bg_color) root.style.setProperty('--tg-theme-secondary-bg-color', theme.secondary_bg_color)
    }
  }, [])

  return (
    <Container>
      <Main>{children}</Main>
      {showNav && <BottomNav cartCount={cartCount} />}
    </Container>
  )
}

export default TelegramLayout
