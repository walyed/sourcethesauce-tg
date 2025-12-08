import Head from 'next/head'
import { useRouter } from 'next/router'
import { styled, keyframes } from 'stitches.config'
import { TelegramLayout } from '@/components/telegram'
import { lightImpact } from '@/lib/telegram/haptics'

const fadeIn = keyframes({
  '0%': { opacity: 0, transform: 'translateY(8px)' },
  '100%': { opacity: 1, transform: 'translateY(0)' },
})

const Container = styled('div', {
  minHeight: '100vh',
  backgroundColor: 'var(--tg-theme-secondary-bg-color, #f8f9fa)',
  paddingBottom: 100,
})

const Header = styled('header', {
  padding: '12px 16px',
  backgroundColor: 'var(--tg-theme-bg-color, #ffffff)',
  position: 'sticky',
  top: 0,
  zIndex: 100,
  display: 'flex',
  alignItems: 'center',
  gap: 12,
  boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
})

const BackButton = styled('button', {
  width: 40,
  height: 40,
  borderRadius: 12,
  background: 'var(--tg-theme-secondary-bg-color, #f5f5f5)',
  border: 'none',
  cursor: 'pointer',
  color: 'var(--tg-theme-text-color, #000000)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  transition: 'all 0.2s ease',
  
  '&:active': {
    transform: 'scale(0.95)',
  },
})

const Title = styled('h1', {
  fontSize: 18,
  fontWeight: 700,
  margin: 0,
  color: 'var(--tg-theme-text-color, #000000)',
})

const Section = styled('div', {
  margin: '12px',
  animation: `${fadeIn} 0.3s ease`,
})

const SectionLabel = styled('div', {
  fontSize: 12,
  fontWeight: 700,
  color: 'var(--tg-theme-hint-color, #999)',
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
  padding: '8px 4px',
  marginBottom: 4,
})

const SettingsCard = styled('div', {
  backgroundColor: 'var(--tg-theme-bg-color, #ffffff)',
  borderRadius: 16,
  overflow: 'hidden',
  boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
})

const SettingsItem = styled('div', {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '14px 16px',
  borderBottom: '1px solid var(--tg-theme-hint-color, #f0f0f0)',
  cursor: 'pointer',
  transition: 'background-color 0.2s ease',
  
  '&:last-child': {
    borderBottom: 'none',
  },
  
  '&:active': {
    backgroundColor: 'var(--tg-theme-secondary-bg-color, #f5f5f5)',
  }
})

const SettingsLabel = styled('div', {
  display: 'flex',
  alignItems: 'center',
  gap: 12,
})

const IconWrapper = styled('div', {
  width: 36,
  height: 36,
  borderRadius: 10,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  
  '& svg': {
    width: 18,
    height: 18,
  },
  
  variants: {
    color: {
      indigo: {
        backgroundColor: 'rgba(99, 102, 241, 0.1)',
        color: '#6366f1',
      },
      green: {
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        color: '#22c55e',
      },
      blue: {
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        color: '#3b82f6',
      },
      orange: {
        backgroundColor: 'rgba(249, 115, 22, 0.1)',
        color: '#f97316',
      },
      gray: {
        backgroundColor: 'rgba(107, 114, 128, 0.1)',
        color: '#6b7280',
      }
    }
  }
})

const SettingsText = styled('span', {
  fontSize: 15,
  fontWeight: 500,
  color: 'var(--tg-theme-text-color, #000)',
})

const SettingsValue = styled('div', {
  display: 'flex',
  alignItems: 'center',
  gap: 8,
  color: 'var(--tg-theme-hint-color, #999)',
  fontSize: 14,
})

const Toggle = styled('div', {
  width: 46,
  height: 26,
  borderRadius: 13,
  backgroundColor: 'var(--tg-theme-hint-color, #e5e5e5)',
  position: 'relative',
  transition: 'background-color 0.2s ease',
  
  '&::after': {
    content: '""',
    position: 'absolute',
    top: 2,
    left: 2,
    width: 22,
    height: 22,
    borderRadius: '50%',
    backgroundColor: '#ffffff',
    boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
    transition: 'transform 0.2s ease',
  },
  
  variants: {
    active: {
      true: {
        background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
        '&::after': {
          transform: 'translateX(20px)',
        }
      }
    }
  }
})

const AppVersion = styled('div', {
  textAlign: 'center',
  padding: '24px 16px',
  color: 'var(--tg-theme-hint-color, #999)',
  fontSize: 13,
})

export default function SettingsPage() {
  const router = useRouter()

  return (
    <>
      <Head>
        <title>Settings | Source The Sauce</title>
      </Head>
      
      <TelegramLayout showNav={false}>
        <Container>
          <Header>
            <BackButton onClick={() => router.back()}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <path d="M19 12H5"/>
                <path d="M12 19l-7-7 7-7"/>
              </svg>
            </BackButton>
            <Title>Settings</Title>
          </Header>

          <Section>
            <SectionLabel>Preferences</SectionLabel>
            <SettingsCard>
              <SettingsItem onClick={() => lightImpact()}>
                <SettingsLabel>
                  <IconWrapper color="indigo">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="5"/>
                      <line x1="12" y1="1" x2="12" y2="3"/>
                      <line x1="12" y1="21" x2="12" y2="23"/>
                      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
                      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
                      <line x1="1" y1="12" x2="3" y2="12"/>
                      <line x1="21" y1="12" x2="23" y2="12"/>
                      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
                      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
                    </svg>
                  </IconWrapper>
                  <SettingsText>Dark Mode</SettingsText>
                </SettingsLabel>
                <Toggle active={false} />
              </SettingsItem>
              
              <SettingsItem onClick={() => lightImpact()}>
                <SettingsLabel>
                  <IconWrapper color="green">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                      <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
                    </svg>
                  </IconWrapper>
                  <SettingsText>Notifications</SettingsText>
                </SettingsLabel>
                <Toggle active={true} />
              </SettingsItem>
              
              <SettingsItem onClick={() => lightImpact()}>
                <SettingsLabel>
                  <IconWrapper color="blue">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10"/>
                      <line x1="2" y1="12" x2="22" y2="12"/>
                      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
                    </svg>
                  </IconWrapper>
                  <SettingsText>Language</SettingsText>
                </SettingsLabel>
                <SettingsValue>
                  English
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="9 18 15 12 9 6"/>
                  </svg>
                </SettingsValue>
              </SettingsItem>

              <SettingsItem onClick={() => lightImpact()}>
                <SettingsLabel>
                  <IconWrapper color="orange">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="12" y1="1" x2="12" y2="23"/>
                      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
                    </svg>
                  </IconWrapper>
                  <SettingsText>Currency</SettingsText>
                </SettingsLabel>
                <SettingsValue>
                  GBP (£)
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="9 18 15 12 9 6"/>
                  </svg>
                </SettingsValue>
              </SettingsItem>
            </SettingsCard>
          </Section>

          <Section>
            <SectionLabel>About</SectionLabel>
            <SettingsCard>
              <SettingsItem onClick={() => lightImpact()}>
                <SettingsLabel>
                  <IconWrapper color="gray">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                      <polyline points="14 2 14 8 20 8"/>
                      <line x1="16" y1="13" x2="8" y2="13"/>
                      <line x1="16" y1="17" x2="8" y2="17"/>
                      <polyline points="10 9 9 9 8 9"/>
                    </svg>
                  </IconWrapper>
                  <SettingsText>Terms of Service</SettingsText>
                </SettingsLabel>
                <SettingsValue>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="9 18 15 12 9 6"/>
                  </svg>
                </SettingsValue>
              </SettingsItem>
              
              <SettingsItem onClick={() => lightImpact()}>
                <SettingsLabel>
                  <IconWrapper color="gray">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                      <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                    </svg>
                  </IconWrapper>
                  <SettingsText>Privacy Policy</SettingsText>
                </SettingsLabel>
                <SettingsValue>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="9 18 15 12 9 6"/>
                  </svg>
                </SettingsValue>
              </SettingsItem>
            </SettingsCard>
          </Section>

          <AppVersion>
            Source The Sauce v1.0.0<br/>
            Made with 💜 for Telegram
          </AppVersion>
        </Container>
      </TelegramLayout>
    </>
  )
}
