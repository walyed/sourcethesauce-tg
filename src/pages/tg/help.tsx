import Head from 'next/head'
import { useRouter } from 'next/router'
import { styled, keyframes } from 'stitches.config'
import { TelegramLayout } from '@/components/telegram'
import { lightImpact } from '@/lib/telegram/haptics'
import { getTelegramWebApp } from '@/lib/telegram/types'

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

const HeroSection = styled('div', {
  padding: '32px 24px',
  textAlign: 'center',
  backgroundColor: 'var(--tg-theme-bg-color, #ffffff)',
  marginBottom: 12,
})

const HeroIcon = styled('div', {
  width: 80,
  height: 80,
  borderRadius: 20,
  background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  margin: '0 auto 16px',
  boxShadow: '0 4px 14px rgba(99, 102, 241, 0.3)',
  color: '#ffffff',
})

const HeroTitle = styled('h2', {
  fontSize: 22,
  fontWeight: 700,
  margin: 0,
  marginBottom: 8,
  color: 'var(--tg-theme-text-color, #000)',
})

const HeroText = styled('p', {
  fontSize: 14,
  lineHeight: 1.6,
  color: 'var(--tg-theme-hint-color, #666)',
  margin: 0,
})

const Section = styled('div', {
  margin: '0 12px 12px',
  animation: `${fadeIn} 0.3s ease`,
})

const SectionLabel = styled('div', {
  fontSize: 12,
  fontWeight: 700,
  color: 'var(--tg-theme-hint-color, #999)',
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
  padding: '8px 4px',
})

const HelpCard = styled('div', {
  backgroundColor: 'var(--tg-theme-bg-color, #ffffff)',
  borderRadius: 16,
  overflow: 'hidden',
  boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
})

const HelpItem = styled('button', {
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  gap: 14,
  padding: '14px 16px',
  backgroundColor: 'transparent',
  border: 'none',
  borderBottom: '1px solid var(--tg-theme-hint-color, #f0f0f0)',
  cursor: 'pointer',
  textAlign: 'left',
  transition: 'background-color 0.2s ease',
  
  '&:last-child': {
    borderBottom: 'none',
  },
  
  '&:active': {
    backgroundColor: 'var(--tg-theme-secondary-bg-color, #f5f5f5)',
  }
})

const IconWrapper = styled('div', {
  width: 42,
  height: 42,
  borderRadius: 12,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  
  '& svg': {
    width: 20,
    height: 20,
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
      }
    }
  }
})

const HelpContent = styled('div', {
  flex: 1,
})

const HelpTitle = styled('div', {
  fontSize: 15,
  fontWeight: 600,
  color: 'var(--tg-theme-text-color, #000)',
  marginBottom: 2,
})

const HelpDesc = styled('div', {
  fontSize: 13,
  color: 'var(--tg-theme-hint-color, #999)',
})

const Arrow = styled('span', {
  color: 'var(--tg-theme-hint-color, #ccc)',
})

const FAQSection = styled('div', {
  margin: '0 12px',
})

const FAQItem = styled('div', {
  backgroundColor: 'var(--tg-theme-bg-color, #ffffff)',
  borderRadius: 14,
  marginBottom: 8,
  overflow: 'hidden',
  boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
})

const FAQQuestion = styled('button', {
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '14px 16px',
  backgroundColor: 'transparent',
  border: 'none',
  cursor: 'pointer',
  fontSize: 14,
  fontWeight: 600,
  color: 'var(--tg-theme-text-color, #000)',
  textAlign: 'left',
})

export default function HelpPage() {
  const router = useRouter()

  const handleContact = (method: string) => {
    lightImpact()
    const webApp = getTelegramWebApp()
    
    if (method === 'telegram') {
      // Open telegram support chat
      webApp?.openTelegramLink('https://t.me/sourcethesauce_support')
    } else if (method === 'email') {
      window.location.href = 'mailto:support@sourcethesauce.com'
    }
  }

  return (
    <>
      <Head>
        <title>Help & Support | Source The Sauce</title>
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
            <Title>Help & Support</Title>
          </Header>

          <HeroSection>
            <HeroIcon>
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
                <line x1="12" y1="17" x2="12.01" y2="17"/>
              </svg>
            </HeroIcon>
            <HeroTitle>How can we help?</HeroTitle>
            <HeroText>
              We are here to assist you with any questions or issues you may have.
            </HeroText>
          </HeroSection>

          <Section>
            <SectionLabel>Contact Us</SectionLabel>
            <HelpCard>
              <HelpItem onClick={() => handleContact('telegram')}>
                <IconWrapper color="blue">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z"/>
                  </svg>
                </IconWrapper>
                <HelpContent>
                  <HelpTitle>Chat on Telegram</HelpTitle>
                  <HelpDesc>Get instant support via Telegram</HelpDesc>
                </HelpContent>
                <Arrow>›</Arrow>
              </HelpItem>
              
              <HelpItem onClick={() => handleContact('email')}>
                <IconWrapper color="indigo">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                    <polyline points="22,6 12,13 2,6"/>
                  </svg>
                </IconWrapper>
                <HelpContent>
                  <HelpTitle>Email Support</HelpTitle>
                  <HelpDesc>support@sourcethesauce.com</HelpDesc>
                </HelpContent>
                <Arrow>›</Arrow>
              </HelpItem>
            </HelpCard>
          </Section>

          <Section>
            <SectionLabel>Quick Help</SectionLabel>
            <HelpCard>
              <HelpItem onClick={() => lightImpact()}>
                <IconWrapper color="green">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="1" y="3" width="15" height="13"/>
                    <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/>
                    <circle cx="5.5" cy="18.5" r="2.5"/>
                    <circle cx="18.5" cy="18.5" r="2.5"/>
                  </svg>
                </IconWrapper>
                <HelpContent>
                  <HelpTitle>Shipping Information</HelpTitle>
                  <HelpDesc>Delivery times and tracking</HelpDesc>
                </HelpContent>
                <Arrow>›</Arrow>
              </HelpItem>
              
              <HelpItem onClick={() => lightImpact()}>
                <IconWrapper color="orange">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="23 4 23 10 17 10"/>
                    <polyline points="1 20 1 14 7 14"/>
                    <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>
                  </svg>
                </IconWrapper>
                <HelpContent>
                  <HelpTitle>Returns & Refunds</HelpTitle>
                  <HelpDesc>How to return items</HelpDesc>
                </HelpContent>
                <Arrow>›</Arrow>
              </HelpItem>
            </HelpCard>
          </Section>

          <FAQSection>
            <SectionLabel>Frequently Asked Questions</SectionLabel>
            
            <FAQItem>
              <FAQQuestion onClick={() => lightImpact()}>
                How long does delivery take?
                <Arrow>›</Arrow>
              </FAQQuestion>
            </FAQItem>
            
            <FAQItem>
              <FAQQuestion onClick={() => lightImpact()}>
                Can I change my order after placing it?
                <Arrow>›</Arrow>
              </FAQQuestion>
            </FAQItem>
            
            <FAQItem>
              <FAQQuestion onClick={() => lightImpact()}>
                What payment methods do you accept?
                <Arrow>›</Arrow>
              </FAQQuestion>
            </FAQItem>
            
            <FAQItem>
              <FAQQuestion onClick={() => lightImpact()}>
                How do I track my order?
                <Arrow>›</Arrow>
              </FAQQuestion>
            </FAQItem>
          </FAQSection>
        </Container>
      </TelegramLayout>
    </>
  )
}
