import Link from 'next/link'
import { useRouter } from 'next/router'
import { styled } from 'stitches.config'

const NavContainer = styled('nav', {
  position: 'fixed',
  bottom: 0,
  left: 0,
  right: 0,
  backgroundColor: 'var(--tg-theme-bg-color, #ffffff)',
  boxShadow: '0 -2px 20px rgba(0,0,0,0.06)',
  display: 'flex',
  justifyContent: 'space-around',
  alignItems: 'center',
  padding: '6px 8px',
  paddingBottom: 'max(10px, env(safe-area-inset-bottom))',
  zIndex: 1000,
})

const NavItem = styled(Link, {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '3px',
  padding: '8px 16px',
  textDecoration: 'none',
  color: 'var(--tg-theme-hint-color, #999999)',
  fontSize: '10px',
  fontWeight: 600,
  transition: 'all 0.2s ease',
  borderRadius: 12,
  
  '& svg': {
    width: 22,
    height: 22,
    transition: 'transform 0.2s ease',
  },
  
  '&:active': {
    transform: 'scale(0.95)',
  },
  
  variants: {
    active: {
      true: {
        color: '#6366f1',
        backgroundColor: 'rgba(99, 102, 241, 0.1)',
        
        '& svg': {
          transform: 'scale(1.1)',
        }
      }
    }
  }
})

const HomeIcon = ({ active }: { active?: boolean }) => (
  <svg viewBox="0 0 24 24" fill={active ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
    <polyline points="9,22 9,12 15,12 15,22"/>
  </svg>
)

const CategoryIcon = ({ active }: { active?: boolean }) => (
  <svg viewBox="0 0 24 24" fill={active ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7" rx="1"/>
    <rect x="14" y="3" width="7" height="7" rx="1"/>
    <rect x="14" y="14" width="7" height="7" rx="1"/>
    <rect x="3" y="14" width="7" height="7" rx="1"/>
  </svg>
)

const CartIcon = ({ count = 0, active }: { count?: number; active?: boolean }) => (
  <div style={{ position: 'relative' }}>
    <svg viewBox="0 0 24 24" fill={active ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
      <line x1="3" y1="6" x2="21" y2="6"/>
      <path d="M16 10a4 4 0 0 1-8 0"/>
    </svg>
    {count > 0 && (
      <span style={{
        position: 'absolute',
        top: -4,
        right: -6,
        background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
        color: '#ffffff',
        borderRadius: 10,
        minWidth: 16,
        height: 16,
        fontSize: 9,
        fontWeight: 700,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0 4px',
        boxShadow: '0 2px 6px rgba(239, 68, 68, 0.4)',
      }}>
        {count > 9 ? '9+' : count}
      </span>
    )}
  </div>
)

const ProfileIcon = ({ active }: { active?: boolean }) => (
  <svg viewBox="0 0 24 24" fill={active ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
    <circle cx="12" cy="7" r="4"/>
  </svg>
)

interface BottomNavProps {
  cartCount?: number
}

export function BottomNav({ cartCount = 0 }: BottomNavProps) {
  const router = useRouter()
  const pathname = router.pathname
  
  const isActive = (path: string) => {
    if (path === '/tg') return pathname === '/tg'
    return pathname.startsWith(path)
  }
  
  return (
    <NavContainer>
      <NavItem href="/tg" active={isActive('/tg')}>
        <HomeIcon active={isActive('/tg')} />
        <span>Home</span>
      </NavItem>
      <NavItem href="/tg/categories" active={isActive('/tg/categories') || isActive('/tg/category')}>
        <CategoryIcon active={isActive('/tg/categories') || isActive('/tg/category')} />
        <span>Categories</span>
      </NavItem>
      <NavItem href="/tg/cart" active={isActive('/tg/cart')}>
        <CartIcon count={cartCount} active={isActive('/tg/cart')} />
        <span>Cart</span>
      </NavItem>
      <NavItem href="/tg/profile" active={isActive('/tg/profile')}>
        <ProfileIcon active={isActive('/tg/profile')} />
        <span>Profile</span>
      </NavItem>
    </NavContainer>
  )
}

export default BottomNav
