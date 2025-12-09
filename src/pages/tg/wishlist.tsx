import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { styled, keyframes } from 'stitches.config'
import { TelegramLayout } from '@/components/telegram'
import { useWishlist } from '@/context/telegram-wishlist'
import { useCart } from '@/context/telegram-cart'
import { lightImpact } from '@/lib/telegram/haptics'

const fadeIn = keyframes({
  '0%': { opacity: 0, transform: 'translateY(8px)' },
  '100%': { opacity: 1, transform: 'translateY(0)' },
})

const Container = styled('div', {
  minHeight: '100vh',
  background:
    'radial-gradient(circle at top, rgba(99,102,241,0.12) 0, transparent 55%), radial-gradient(circle at bottom, rgba(15,23,42,0.95) 0, #020617 70%)',
  paddingBottom: 120,
})

const Header = styled('header', {
  padding: '12px 16px',
  background: 'color-mix(in srgb, var(--tg-theme-bg-color, #020617) 80%, #000000 20%)',
  position: 'sticky',
  top: 0,
  zIndex: 100,
  display: 'flex',
  alignItems: 'center',
  gap: 12,
  borderBottom: '1px solid rgba(148,163,184,0.35)',
  backdropFilter: 'blur(10px)',
})

const BackButton = styled('button', {
  width: 40,
  height: 40,
  borderRadius: 12,
  background: 'rgba(15,23,42,0.9)',
  border: '1px solid rgba(148,163,184,0.5)',
  cursor: 'pointer',
  color: '#e5e7eb',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  transition: 'all 0.15s ease',
  
  '&:active': {
    transform: 'scale(0.95)',
    boxShadow: '0 0 0 1px rgba(94,234,212,0.35)',
  },
})

const HeaderText = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  flex: 1,
})

const Title = styled('h1', {
  fontSize: 18,
  fontWeight: 700,
  margin: 0,
  color: '#e5e7eb',
})

const Subtitle = styled('span', {
  fontSize: 11,
  color: 'rgba(148,163,184,0.95)',
})

const ItemCount = styled('span', {
  fontSize: 12,
  fontWeight: 600,
  color: 'rgba(148,163,184,0.95)',
})

const ProductGrid = styled('div', {
  display: 'grid',
  gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
  gap: 12,
  padding: '12px 12px 16px',
})

const ProductCard = styled('div', {
  position: 'relative',
  background: 'rgba(15,23,42,0.96)',
  borderRadius: 18,
  overflow: 'hidden',
  boxShadow: '0 10px 28px rgba(15,23,42,0.95)',
  border: '1px solid rgba(148,163,184,0.55)',
  animation: `${fadeIn} 0.25s ease`,
})

const ImageContainer = styled(Link, {
  display: 'block',
  position: 'relative',
  aspectRatio: '4/5',
  overflow: 'hidden',
  background:
    'radial-gradient(circle at top, rgba(148,163,184,0.35), rgba(15,23,42,1))',
})

const RemoveButton = styled('button', {
  position: 'absolute',
  top: 8,
  right: 8,
  width: 30,
  height: 30,
  borderRadius: 999,
  backgroundColor: 'rgba(15,23,42,0.9)',
  border: '1px solid rgba(248,113,113,0.8)',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: '#fecaca',
  zIndex: 2,
  boxShadow: '0 6px 18px rgba(15,23,42,0.9)',
  transition: 'all 0.18s ease',
  
  '&:active': {
    transform: 'scale(0.9)',
    backgroundColor: 'rgba(239,68,68,0.18)',
  },
})

const HeartBadge = styled('div', {
  position: 'absolute',
  left: 10,
  top: 10,
  padding: '4px 9px',
  borderRadius: 999,
  background: 'rgba(15,23,42,0.9)',
  border: '1px solid rgba(248,250,252,0.25)',
  fontSize: 10,
  fontWeight: 600,
  color: '#f97373',
  display: 'flex',
  alignItems: 'center',
  gap: 4,
})

const ProductInfo = styled('div', {
  padding: '10px 10px 12px',
})

const ProductName = styled('h3', {
  fontSize: 13,
  fontWeight: 600,
  margin: 0,
  marginBottom: 6,
  color: '#e5e7eb',
  display: '-webkit-box',
  WebkitLineClamp: 2,
  WebkitBoxOrient: 'vertical' as any,
  overflow: 'hidden',
  lineHeight: 1.3,
})

const ProductMetaRow = styled('div', {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: 6,
})

const ProductPrice = styled('span', {
  fontSize: 15,
  fontWeight: 800,
  background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
})

const ProductSku = styled('span', {
  fontSize: 10,
  color: 'rgba(148,163,184,0.9)',
})

const AddToCartButton = styled('button', {
  width: '100%',
  padding: '9px',
  marginTop: 6,
  borderRadius: 999,
  border: 'none',
  background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
  color: '#f9fafb',
  fontSize: 12,
  fontWeight: 700,
  cursor: 'pointer',
  transition: 'all 0.16s ease',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 6,
  boxShadow: '0 10px 26px rgba(79,70,229,0.7)',
  
  '&:active': {
    transform: 'scale(0.96)',
  },
})

const EmptyState = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '80px 20px',
  textAlign: 'center',
  animation: `${fadeIn} 0.25s ease`,
})

const EmptyIcon = styled('div', {
  width: 90,
  height: 90,
  borderRadius: 30,
  background:
    'radial-gradient(circle at top, rgba(248,113,113,0.18), rgba(15,23,42,1))',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: 18,
  color: '#fecaca',
  boxShadow: '0 16px 40px rgba(15,23,42,0.9)',
})

const EmptyTitle = styled('h2', {
  fontSize: 19,
  fontWeight: 700,
  margin: 0,
  marginBottom: 8,
  color: '#e5e7eb',
})

const EmptyText = styled('p', {
  fontSize: 14,
  margin: 0,
  marginBottom: 22,
  color: 'rgba(148,163,184,0.95)',
  lineHeight: 1.5,
})

const ShopButton = styled(Link, {
  padding: '13px 32px',
  borderRadius: 999,
  background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
  color: '#f9fafb',
  textDecoration: 'none',
  fontSize: 14,
  fontWeight: 700,
  boxShadow: '0 12px 32px rgba(79,70,229,0.75)',
  transition: 'all 0.16s ease',
  
  '&:active': {
    transform: 'scale(0.96)',
  },
})

const LoadingState = styled('div', {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '64px 16px',
  color: 'rgba(148,163,184,0.95)',
})

const BottomBar = styled('div', {
  position: 'fixed',
  left: 0,
  right: 0,
  bottom: 0,
  padding: '8px 10px 10px',
  zIndex: 120,
  background:
    'linear-gradient(to top, rgba(15,23,42,0.98), rgba(15,23,42,0.9))',
  borderTop: '1px solid rgba(148,163,184,0.4)',
  backdropFilter: 'blur(10px)',
})

const BottomBarInner = styled('div', {
  maxWidth: 480,
  margin: '0 auto',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 10,
})

const BottomText = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  fontSize: 11,
  color: 'rgba(226,232,240,0.98)',
})

const BottomLine = styled('span', {
  '&:last-child': {
    fontSize: 10,
    color: 'rgba(148,163,184,0.95)',
  },
})

const BottomAction = styled(Link, {
  padding: '8px 14px',
  borderRadius: 999,
  background:
    'linear-gradient(135deg, #22c55e, #4ade80)',
  color: '#022c22',
  fontSize: 12,
  fontWeight: 700,
  textDecoration: 'none',
  display: 'flex',
  alignItems: 'center',
  gap: 6,
  boxShadow: '0 10px 25px rgba(22,163,74,0.6)',
  
  '&:active': {
    transform: 'scale(0.96)',
  },
})

export default function WishlistPage() {
  const router = useRouter()
  const { items, isLoading, removeFromWishlist } = useWishlist()
  const { totalItems } = useCart()

  const handleRemove = async (productId: string) => {
    lightImpact()
    await removeFromWishlist(productId)
  }

  return (
    <>
      <Head>
        <title>Wishlist | Source The Sauce</title>
      </Head>

      <TelegramLayout showNav={false} cartCount={totalItems}>
        <Container>
          <Header>
            <BackButton onClick={() => router.back()}>
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
              >
                <path d="M19 12H5" />
                <path d="M12 19l-7-7 7-7" />
              </svg>
            </BackButton>
            <HeaderText>
              <Title>Wishlist</Title>
              <Subtitle>Saved for later heat</Subtitle>
            </HeaderText>
            {items.length > 0 && (
              <ItemCount>{items.length} saved</ItemCount>
            )}
          </Header>

          {isLoading ? (
            <LoadingState>Loading wishlist...</LoadingState>
          ) : items.length === 0 ? (
            <EmptyState>
              <EmptyIcon>
                <svg
                  width="34"
                  height="34"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
              </EmptyIcon>
              <EmptyTitle>No favourites yet</EmptyTitle>
              <EmptyText>
                Tap the heart on any product to park it here and come back later.
              </EmptyText>
              <ShopButton href="/tg">Browse drops</ShopButton>
            </EmptyState>
          ) : (
            <ProductGrid>
              {items.map((item) => (
                <ProductCard key={item.id}>
                  <RemoveButton
                    onClick={() => handleRemove(item.product_id)}
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                    >
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </RemoveButton>

                  <HeartBadge>
                    <svg
                      width="10"
                      height="10"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                    </svg>
                    Saved
                  </HeartBadge>

                  <ImageContainer
                    href={`/tg/product/${item.product.id}/${item.product.sku}`}
                  >
                    {item.product.images[0] && (
                      <Image
                        src={item.product.images[0].url}
                        alt={item.product.name}
                        fill
                        style={{ objectFit: 'cover' }}
                      />
                    )}
                  </ImageContainer>

                  <ProductInfo>
                    <ProductName>{item.product.name}</ProductName>
                    <ProductMetaRow>
                      <ProductPrice>
                        £{item.product.price.toFixed(2)}
                      </ProductPrice>
                      {item.product.sku && (
                        <ProductSku>{item.product.sku}</ProductSku>
                      )}
                    </ProductMetaRow>
                    <AddToCartButton
                      onClick={() =>
                        router.push(
                          `/tg/product/${item.product.id}/${item.product.sku}`
                        )
                      }
                    >
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                        <line x1="3" y1="6" x2="21" y2="6" />
                      </svg>
                      View product
                    </AddToCartButton>
                  </ProductInfo>
                </ProductCard>
              ))}
            </ProductGrid>
          )}

          {totalItems > 0 && (
            <BottomBar>
              <BottomBarInner>
                <BottomText>
                  <BottomLine>
                    {totalItems} item{totalItems > 1 ? 's' : ''} in your bag
                  </BottomLine>
                  <BottomLine>Ready to move from wish → checkout.</BottomLine>
                </BottomText>
                <BottomAction href="/tg/cart">
                  View cart
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M9 18l6-6-6-6" />
                  </svg>
                </BottomAction>
              </BottomBarInner>
            </BottomBar>
          )}
        </Container>
      </TelegramLayout>
    </>
  )
}
