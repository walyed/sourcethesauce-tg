import Link from 'next/link'
import { useRouter } from 'next/router'
import { styled } from 'stitches.config'
import { useCart } from '@/context/telegram-cart'

// Outer shell pinned to bottom
const NavShell = styled('div', {
  position: 'fixed',
  bottom: 0,
  left: 0,
  right: 0,
  padding: '6px 12px',
  paddingBottom: 'max(10px, env(safe-area-inset-bottom))',
  display: 'flex',
  justifyContent: 'center',
  zIndex: 1000,
  pointerEvents: 'none', // only inner dock is clickable
})

// Floating dock
const Dock = styled('nav', {
  pointerEvents: 'auto',
  maxWidth: 460,
  width: '100%',
  borderRadius: 999,
  padding: '6px 10px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  background:
    'linear-gradient(135deg, rgba(15,23,42,0.97), rgba(15,23,42,0.94))',
  boxShadow:
    '0 18px 45px rgba(15,23,42,0.75), 0 0 0 1px rgba(148,163,184,0.35)',
})

// Single tab
const NavItem = styled(Link, {
  position: 'relative',
  flex: 1,
  minWidth: 0,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 3,
  padding: '6px 8px',
  textDecoration: 'none',
  color: 'rgba(148,163,184,0.9)',
  fontSize: 10,
  fontWeight: 600,
  borderRadius: 999,
  transition: 'background 0.15s ease, color 0.15s ease, transform 0.12s ease',

  '& svg': {
    width: 22,
    height: 22,
    transition: 'transform 0.15s ease, color 0.15s ease',
  },

  '&:active': {
    transform: 'scale(0.95)',
  },

  variants: {
    active: {
      true: {
        background:
          'radial-gradient(circle at top, rgba(94,234,212,0.16), transparent 60%)',
        color: '#e5e7eb',

        '& svg': {
          transform: 'scale(1.05)',
        },
      },
    },
    center: {
      true: {
        flex: 1.2,
      },
    },
  },
})

const Label = styled('span', {
  whiteSpace: 'nowrap',
})

// Cart badge
const Badge = styled('span', {
  position: 'absolute',
  top: -4,
  right: -8,
  minWidth: 16,
  height: 16,
  padding: '0 4px',
  borderRadius: 999,
  background: 'linear-gradient(135deg, #ef4444, #dc2626)',
  color: '#ffffff',
  fontSize: 9,
  fontWeight: 700,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  boxShadow: '0 2px 8px rgba(239,68,68,0.55)',
})

// Cart total pill above cart tab
const CartTotalPill = styled('div', {
  position: 'absolute',
  top: -20,
  padding: '2px 8px',
  borderRadius: 999,
  background: 'rgba(15,23,42,0.98)',
  color: '#e5e7eb',
  border: '1px solid rgba(148,163,184,0.85)',
  fontSize: 9,
  fontWeight: 600,
  boxShadow: '0 6px 16px rgba(15,23,42,0.9)',
  whiteSpace: 'nowrap',
})

// Icons
const HomeIcon = ({ active }: { active?: boolean }) => (
  <svg
    viewBox="0 0 24 24"
    fill={active ? 'currentColor' : 'none'}
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9,22 9,12 15,12 15,22" />
  </svg>
)

const CategoryIcon = ({ active }: { active?: boolean }) => (
  <svg
    viewBox="0 0 24 24"
    fill={active ? 'currentColor' : 'none'}
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="3" y="3" width="7" height="7" rx="1" />
    <rect x="14" y="3" width="7" height="7" rx="1" />
    <rect x="14" y="14" width="7" height="7" rx="1" />
    <rect x="3" y="14" width="7" height="7" rx="1" />
  </svg>
)

const CartIcon = ({
  count = 0,
  active,
}: {
  count?: number
  active?: boolean
}) => (
  <div style={{ position: 'relative' }}>
    <svg
      viewBox="0 0 24 24"
      fill={active ? 'currentColor' : 'none'}
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
      <line x1="3" y1="6" x2="21" y2="6" />
      <path d="M16 10a4 4 0 0 1-8 0" />
    </svg>
    {count > 0 && <Badge>{count > 9 ? '9+' : count}</Badge>}
  </div>
)

const WishlistIcon = ({ active }: { active?: boolean }) => (
  <svg
    viewBox="0 0 24 24"
    fill={active ? '#ef4444' : 'none'}
    stroke={active ? '#f97373' : 'currentColor'}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
)

const ProfileIcon = ({ active }: { active?: boolean }) => (
  <svg
    viewBox="0 0 24 24"
    fill={active ? 'currentColor' : 'none'}
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
)

interface BottomNavProps {
  cartCount?: number // kept for compatibility; we rely on context for real values
  wishlistCount?: number
}

export function BottomNav({ cartCount }: BottomNavProps) {
  const router = useRouter()
  const pathname = router.pathname

  // Auto-hide on checkout / order flow
  const hideNav =
    pathname.startsWith('/tg/checkout') || pathname.startsWith('/tg/order')

  const { totalItems, totalPrice } = useCart()
  const effectiveCartCount = totalItems // ignore prop; always trust live cart
  const cartTotal = totalPrice

  if (hideNav) return null

  const isActive = (path: string) => {
    if (path === '/tg') return pathname === '/tg'
    return pathname.startsWith(path)
  }

  const homeActive = isActive('/tg')
  const categoriesActive = isActive('/tg/categories') || isActive('/tg/category')
  const wishlistActive = isActive('/tg/wishlist')
  const cartActive = isActive('/tg/cart')
  const profileActive = isActive('/tg/profile')

  return (
    <NavShell>
      <Dock>
        <NavItem href="/tg" active={homeActive}>
          <HomeIcon active={homeActive} />
          <Label>Home</Label>
        </NavItem>

        <NavItem href="/tg/categories" active={categoriesActive}>
          <CategoryIcon active={categoriesActive} />
          <Label>Categories</Label>
        </NavItem>

        <NavItem href="/tg/wishlist" active={wishlistActive}>
          <WishlistIcon active={wishlistActive} />
          <Label>Wishlist</Label>
        </NavItem>

        <NavItem href="/tg/cart" active={cartActive} center>
          {cartTotal > 0 && (
            <CartTotalPill>£{cartTotal.toFixed(2)}</CartTotalPill>
          )}
          <CartIcon count={effectiveCartCount} active={cartActive} />
          <Label>Cart</Label>
        </NavItem>

        <NavItem href="/tg/profile" active={profileActive}>
          <ProfileIcon active={profileActive} />
          <Label>Profile</Label>
        </NavItem>
      </Dock>
    </NavShell>
  )
}

export default BottomNav
