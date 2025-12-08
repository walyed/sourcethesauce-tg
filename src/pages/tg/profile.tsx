import Head from 'next/head'
import Link from 'next/link'
import { styled, keyframes } from 'stitches.config'
import { TelegramLayout } from '@/components/telegram'
import { useTelegramAuth } from '@/context/telegram-auth'
import { useWishlist } from '@/context/telegram-wishlist'
import { useCart } from '@/context/telegram-cart'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

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
  padding: '16px',
  backgroundColor: 'var(--tg-theme-bg-color, #ffffff)',
  position: 'sticky',
  top: 0,
  zIndex: 100,
})

const Title = styled('h1', {
  fontSize: 20,
  fontWeight: 700,
  margin: 0,
  color: 'var(--tg-theme-text-color, #000000)',
})

const ProfileSection = styled('div', {
  padding: '32px 16px',
  textAlign: 'center',
  backgroundColor: 'var(--tg-theme-bg-color, #ffffff)',
  marginBottom: 8,
})

const Avatar = styled('div', {
  width: 90,
  height: 90,
  borderRadius: '50%',
  background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
  color: '#ffffff',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: 36,
  fontWeight: 700,
  margin: '0 auto 16px',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  boxShadow: '0 4px 14px rgba(99, 102, 241, 0.3)',
})

const UserName = styled('h2', {
  fontSize: 22,
  fontWeight: 700,
  margin: 0,
  marginBottom: 4,
  color: 'var(--tg-theme-text-color, #000000)',
})

const Username = styled('p', {
  fontSize: 14,
  margin: 0,
  color: 'var(--tg-theme-hint-color, #999999)',
})

const StatsRow = styled('div', {
  display: 'flex',
  justifyContent: 'center',
  gap: 32,
  marginTop: 20,
  paddingTop: 20,
  borderTop: '1px solid var(--tg-theme-hint-color, #e5e5e5)',
})

const StatItem = styled('div', {
  textAlign: 'center',
})

const StatValue = styled('div', {
  fontSize: 20,
  fontWeight: 800,
  color: '#6366f1',
})

const StatLabel = styled('div', {
  fontSize: 12,
  color: 'var(--tg-theme-hint-color, #666)',
  marginTop: 2,
})

const MenuSection = styled('div', {
  padding: '12px',
  animation: `${fadeIn} 0.3s ease`,
})

const SectionLabel = styled('div', {
  fontSize: 12,
  fontWeight: 700,
  color: 'var(--tg-theme-hint-color, #999)',
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
  padding: '8px 12px',
  marginBottom: 4,
})

const MenuItem = styled(Link, {
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  gap: 14,
  padding: '14px 16px',
  backgroundColor: 'var(--tg-theme-bg-color, #ffffff)',
  border: 'none',
  borderRadius: 14,
  marginBottom: 6,
  cursor: 'pointer',
  textAlign: 'left',
  color: 'var(--tg-theme-text-color, #000000)',
  textDecoration: 'none',
  transition: 'all 0.2s ease',
  boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
  
  '&:active': {
    transform: 'scale(0.98)',
  }
})

const Badge = styled('span', {
  background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
  color: '#ffffff',
  fontSize: 11,
  fontWeight: 700,
  padding: '3px 10px',
  borderRadius: 12,
  minWidth: 20,
  textAlign: 'center',
})

const MenuIcon = styled('div', {
  width: 42,
  height: 42,
  borderRadius: 12,
  backgroundColor: 'var(--tg-theme-secondary-bg-color, #f5f5f5)',
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
      red: {
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        color: '#ef4444',
      },
      green: {
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        color: '#22c55e',
      },
      blue: {
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        color: '#3b82f6',
      },
      purple: {
        backgroundColor: 'rgba(168, 85, 247, 0.1)',
        color: '#a855f7',
      }
    }
  }
})

const MenuText = styled('span', {
  flex: 1,
  fontSize: 15,
  fontWeight: 600,
})

const MenuArrow = styled('span', {
  color: 'var(--tg-theme-hint-color, #ccc)',
  fontSize: 18,
})

export default function ProfilePage() {
  const { user, telegramUser, isLoading, isTelegram } = useTelegramAuth()
  const { items: wishlistItems } = useWishlist()
  const { totalItems: cartCount } = useCart()
  const [ordersCount, setOrdersCount] = useState(0)
  const [tgUser, setTgUser] = useState<any>(null)
  
  // Get Telegram user directly from WebApp on client side
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const webApp = (window as any).Telegram?.WebApp
      if (webApp?.initDataUnsafe?.user) {
        setTgUser(webApp.initDataUnsafe.user)
      }
    }
  }, [])
  
  // Use data from multiple sources with fallbacks
  const displayName = user?.full_name || telegramUser?.first_name || tgUser?.first_name || 'Guest'
  const displayUsername = user?.telegram_username || telegramUser?.username || tgUser?.username
  const avatarUrl = user?.avatar_url || telegramUser?.photo_url || tgUser?.photo_url
  const initials = displayName.charAt(0).toUpperCase()
  const wishlistCount = wishlistItems.length

  // Fetch orders count
  useEffect(() => {
    const fetchOrdersCount = async () => {
      if (!user?.id && !telegramUser?.id) return
      
      try {
        let query = supabase
          .from('orders')
          .select('id', { count: 'exact', head: true })
        
        if (user?.id) {
          query = query.eq('user_id', user.id)
        }
        
        const { count } = await query
        setOrdersCount(count || 0)
      } catch (error) {
        console.error('Error fetching orders count:', error)
      }
    }
    
    fetchOrdersCount()
  }, [user?.id, telegramUser?.id])

  return (
    <>
      <Head>
        <title>Profile | Source The Sauce</title>
      </Head>
      
      <TelegramLayout cartCount={cartCount}>
        <Container>
          <Header>
            <Title>Profile</Title>
          </Header>

          <ProfileSection>
            <Avatar style={avatarUrl ? { backgroundImage: `url(${avatarUrl})` } : undefined}>
              {!avatarUrl && initials}
            </Avatar>
            <UserName>{displayName}</UserName>
            {displayUsername && <Username>@{displayUsername}</Username>}
            
            <StatsRow>
              <StatItem>
                <StatValue>{ordersCount}</StatValue>
                <StatLabel>Orders</StatLabel>
              </StatItem>
              <StatItem>
                <StatValue>{wishlistCount}</StatValue>
                <StatLabel>Wishlist</StatLabel>
              </StatItem>
              <StatItem>
                <StatValue>{cartCount}</StatValue>
                <StatLabel>In Cart</StatLabel>
              </StatItem>
            </StatsRow>
          </ProfileSection>

          <MenuSection>
            <SectionLabel>My Account</SectionLabel>
            
            <MenuItem href="/tg/orders">
              <MenuIcon color="indigo">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
                  <line x1="3" y1="6" x2="21" y2="6"/>
                  <path d="M16 10a4 4 0 0 1-8 0"/>
                </svg>
              </MenuIcon>
              <MenuText>My Orders</MenuText>
              {ordersCount > 0 && <Badge>{ordersCount}</Badge>}
              <MenuArrow>›</MenuArrow>
            </MenuItem>

            <MenuItem href="/tg/wishlist">
              <MenuIcon color="red">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                </svg>
              </MenuIcon>
              <MenuText>Wishlist</MenuText>
              {wishlistCount > 0 && <Badge>{wishlistCount}</Badge>}
              <MenuArrow>›</MenuArrow>
            </MenuItem>

            <MenuItem href="/tg/addresses">
              <MenuIcon color="green">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                  <circle cx="12" cy="10" r="3"/>
                </svg>
              </MenuIcon>
              <MenuText>Saved Addresses</MenuText>
              <MenuArrow>›</MenuArrow>
            </MenuItem>
          </MenuSection>

          <MenuSection>
            <SectionLabel>App</SectionLabel>
            
            <MenuItem href="/tg/settings">
              <MenuIcon color="blue">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="3"/>
                  <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
                </svg>
              </MenuIcon>
              <MenuText>Settings</MenuText>
              <MenuArrow>›</MenuArrow>
            </MenuItem>

            <MenuItem href="/tg/help">
              <MenuIcon color="purple">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/>
                  <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
                  <line x1="12" y1="17" x2="12.01" y2="17"/>
                </svg>
              </MenuIcon>
              <MenuText>Help & Support</MenuText>
              <MenuArrow>›</MenuArrow>
            </MenuItem>
          </MenuSection>
        </Container>
      </TelegramLayout>
    </>
  )
}
