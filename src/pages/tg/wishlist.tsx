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
  flex: 1,
  color: 'var(--tg-theme-text-color, #000000)',
})

const ItemCount = styled('span', {
  fontSize: 13,
  fontWeight: 600,
  color: 'var(--tg-theme-hint-color, #999)',
})

const ProductGrid = styled('div', {
  display: 'grid',
  gridTemplateColumns: 'repeat(2, 1fr)',
  gap: 10,
  padding: 12,
})

const ProductCard = styled('div', {
  position: 'relative',
  backgroundColor: 'var(--tg-theme-bg-color, #ffffff)',
  borderRadius: 16,
  overflow: 'hidden',
  boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
  animation: `${fadeIn} 0.3s ease`,
})

const ImageContainer = styled(Link, {
  display: 'block',
  position: 'relative',
  aspectRatio: '4/5',
  overflow: 'hidden',
  backgroundColor: '#f5f5f5',
})

const RemoveButton = styled('button', {
  position: 'absolute',
  top: 8,
  right: 8,
  width: 32,
  height: 32,
  borderRadius: '50%',
  backgroundColor: 'rgba(255,255,255,0.95)',
  border: 'none',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: '#ef4444',
  zIndex: 2,
  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  transition: 'all 0.2s ease',
  
  '&:active': {
    transform: 'scale(0.9)',
  }
})

const ProductInfo = styled('div', {
  padding: 12,
})

const ProductName = styled('h3', {
  fontSize: 13,
  fontWeight: 600,
  margin: 0,
  marginBottom: 6,
  color: 'var(--tg-theme-text-color, #000000)',
  display: '-webkit-box',
  WebkitLineClamp: 2,
  WebkitBoxOrient: 'vertical',
  overflow: 'hidden',
  lineHeight: 1.3,
})

const ProductPrice = styled('span', {
  fontSize: 15,
  fontWeight: 800,
  background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
})

const AddToCartButton = styled('button', {
  width: '100%',
  padding: '10px',
  marginTop: 10,
  borderRadius: 10,
  border: 'none',
  background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
  color: '#ffffff',
  fontSize: 12,
  fontWeight: 700,
  cursor: 'pointer',
  transition: 'all 0.2s ease',
  
  '&:active': {
    transform: 'scale(0.97)',
  }
})

const EmptyState = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '64px 16px',
  textAlign: 'center',
  animation: `${fadeIn} 0.3s ease`,
})

const EmptyIcon = styled('div', {
  width: 80,
  height: 80,
  borderRadius: '50%',
  background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(248, 113, 113, 0.1) 100%)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: 16,
  color: '#ef4444',
})

const EmptyTitle = styled('h2', {
  fontSize: 18,
  fontWeight: 700,
  margin: 0,
  marginBottom: 8,
  color: 'var(--tg-theme-text-color, #000000)',
})

const EmptyText = styled('p', {
  fontSize: 14,
  margin: 0,
  marginBottom: 24,
  color: 'var(--tg-theme-hint-color, #999999)',
})

const ShopButton = styled(Link, {
  padding: '14px 32px',
  borderRadius: 14,
  background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
  color: '#ffffff',
  textDecoration: 'none',
  fontSize: 15,
  fontWeight: 700,
  boxShadow: '0 4px 14px rgba(99, 102, 241, 0.35)',
  transition: 'all 0.2s ease',
  
  '&:active': {
    transform: 'scale(0.97)',
  }
})

const LoadingState = styled('div', {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '64px 16px',
  color: 'var(--tg-theme-hint-color, #999999)',
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
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <path d="M19 12H5"/>
                <path d="M12 19l-7-7 7-7"/>
              </svg>
            </BackButton>
            <Title>Wishlist</Title>
            {items.length > 0 && <ItemCount>{items.length} items</ItemCount>}
          </Header>

          {isLoading ? (
            <LoadingState>Loading wishlist...</LoadingState>
          ) : items.length === 0 ? (
            <EmptyState>
              <EmptyIcon>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                </svg>
              </EmptyIcon>
              <EmptyTitle>Your wishlist is empty</EmptyTitle>
              <EmptyText>Save items you love for later</EmptyText>
              <ShopButton href="/tg">Start Shopping</ShopButton>
            </EmptyState>
          ) : (
            <ProductGrid>
              {items.map((item) => (
                <ProductCard key={item.id}>
                  <RemoveButton onClick={() => handleRemove(item.product_id)}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <line x1="18" y1="6" x2="6" y2="18"/>
                      <line x1="6" y1="6" x2="18" y2="18"/>
                    </svg>
                  </RemoveButton>
                  
                  <ImageContainer href={`/tg/product/${item.product.id}/${item.product.sku}`}>
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
                    <ProductPrice>£{item.product.price.toFixed(2)}</ProductPrice>
                    <AddToCartButton onClick={() => router.push(`/tg/product/${item.product.id}/${item.product.sku}`)}>
                      View Product
                    </AddToCartButton>
                  </ProductInfo>
                </ProductCard>
              ))}
            </ProductGrid>
          )}
        </Container>
      </TelegramLayout>
    </>
  )
}
