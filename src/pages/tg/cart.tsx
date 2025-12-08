import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { styled } from 'stitches.config'
import { TelegramLayout } from '@/components/telegram'
import { useCart } from '@/context/telegram-cart'
import { getTelegramWebApp } from '@/lib/telegram/types'
import { lightImpact, successNotification } from '@/lib/telegram/haptics'

const Container = styled('div', {
  minHeight: '100vh',
  backgroundColor: 'var(--tg-theme-secondary-bg-color, #f5f5f5)',
  paddingBottom: 180,
})

const Header = styled('header', {
  padding: '12px 16px',
  backgroundColor: 'var(--tg-theme-bg-color, #ffffff)',
  display: 'flex',
  alignItems: 'center',
  gap: 12,
  position: 'sticky',
  top: 0,
  zIndex: 100,
})

const BackButton = styled('button', {
  width: 36,
  height: 36,
  borderRadius: 10,
  backgroundColor: 'var(--tg-theme-secondary-bg-color, #f5f5f5)',
  border: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  color: 'var(--tg-theme-text-color, #000)',
  
  '&:active': {
    transform: 'scale(0.95)',
  }
})

const Title = styled('h1', {
  fontSize: 18,
  fontWeight: 700,
  margin: 0,
  color: 'var(--tg-theme-text-color, #000000)',
})

const CartCount = styled('span', {
  marginLeft: 'auto',
  fontSize: 13,
  fontWeight: 600,
  color: 'var(--tg-theme-hint-color, #999)',
})

const CartList = styled('div', {
  padding: '12px 16px',
})

const CartItem = styled('div', {
  display: 'flex',
  gap: 12,
  padding: 12,
  backgroundColor: 'var(--tg-theme-bg-color, #ffffff)',
  borderRadius: 16,
  marginBottom: 10,
  boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
})

const ItemImage = styled('div', {
  position: 'relative',
  width: 80,
  height: 100,
  borderRadius: 12,
  overflow: 'hidden',
  backgroundColor: 'var(--tg-theme-secondary-bg-color, #f5f5f5)',
  flexShrink: 0,
})

const ItemDetails = styled('div', {
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  minWidth: 0,
})

const ItemName = styled(Link, {
  fontSize: 13,
  fontWeight: 600,
  margin: 0,
  marginBottom: 4,
  color: 'var(--tg-theme-text-color, #000000)',
  textDecoration: 'none',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
})

const ItemVariant = styled('span', {
  fontSize: 11,
  color: 'var(--tg-theme-hint-color, #999999)',
  marginBottom: 8,
})

const ItemPrice = styled('span', {
  fontSize: 15,
  fontWeight: 700,
  color: 'var(--tg-theme-text-color, #000000)',
  marginTop: 'auto',
})

const QuantityControls = styled('div', {
  display: 'flex',
  alignItems: 'center',
  gap: 8,
  marginTop: 8,
})

const QuantityButton = styled('button', {
  width: 28,
  height: 28,
  borderRadius: 8,
  border: 'none',
  backgroundColor: 'var(--tg-theme-secondary-bg-color, #f5f5f5)',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: 'var(--tg-theme-text-color, #000000)',
  fontSize: 16,
  fontWeight: 600,
  
  '&:active': {
    transform: 'scale(0.9)',
    backgroundColor: 'var(--tg-theme-hint-color, #e5e5e5)',
  }
})

const QuantityValue = styled('span', {
  fontSize: 14,
  fontWeight: 600,
  minWidth: 20,
  textAlign: 'center',
  color: 'var(--tg-theme-text-color, #000000)',
})

const RemoveButton = styled('button', {
  background: 'none',
  border: 'none',
  padding: 4,
  cursor: 'pointer',
  color: 'var(--tg-theme-hint-color, #999)',
  
  '&:active': {
    color: '#ff3b30',
  }
})

const Summary = styled('div', {
  position: 'fixed',
  bottom: 0,
  left: 0,
  right: 0,
  padding: '16px',
  backgroundColor: 'var(--tg-theme-bg-color, #ffffff)',
  borderTop: '1px solid var(--tg-theme-hint-color, #e5e5e5)',
  boxShadow: '0 -4px 20px rgba(0,0,0,0.08)',
})

const SummaryRow = styled('div', {
  display: 'flex',
  justifyContent: 'space-between',
  marginBottom: 8,
  fontSize: 13,
  color: 'var(--tg-theme-hint-color, #999)',
  
  variants: {
    total: {
      true: {
        fontSize: 16,
        fontWeight: 700,
        color: 'var(--tg-theme-text-color, #000)',
        marginTop: 8,
        paddingTop: 12,
        borderTop: '1px dashed var(--tg-theme-hint-color, #e5e5e5)',
        marginBottom: 0,
      }
    }
  }
})

const CheckoutButton = styled('button', {
  width: '100%',
  padding: '14px',
  borderRadius: 12,
  border: 'none',
  background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
  color: '#ffffff',
  fontSize: 15,
  fontWeight: 700,
  cursor: 'pointer',
  marginTop: 14,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 8,
  boxShadow: '0 4px 15px rgba(99, 102, 241, 0.3)',
  
  '&:active': {
    transform: 'scale(0.98)',
  }
})

const EmptyState = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '80px 24px',
  textAlign: 'center',
})

const EmptyIcon = styled('div', {
  width: 100,
  height: 100,
  borderRadius: 30,
  background: 'linear-gradient(135deg, #f0f0f5 0%, #e5e5ea 100%)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: 20,
  color: 'var(--tg-theme-hint-color, #999999)',
})

const EmptyTitle = styled('h2', {
  fontSize: 20,
  fontWeight: 700,
  margin: 0,
  marginBottom: 8,
  color: 'var(--tg-theme-text-color, #000000)',
})

const EmptyText = styled('p', {
  fontSize: 14,
  margin: 0,
  marginBottom: 28,
  color: 'var(--tg-theme-hint-color, #999999)',
  lineHeight: 1.5,
})

const ShopButton = styled(Link, {
  padding: '14px 36px',
  borderRadius: 12,
  background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
  color: '#ffffff',
  textDecoration: 'none',
  fontSize: 15,
  fontWeight: 700,
  boxShadow: '0 4px 15px rgba(99, 102, 241, 0.3)',
  
  '&:active': {
    transform: 'scale(0.98)',
  }
})

const LoadingState = styled('div', {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '64px 16px',
  color: 'var(--tg-theme-hint-color, #999999)',
})

export default function CartPage() {
  const router = useRouter()
  const { items, isLoading, totalItems, totalPrice, updateQuantity, removeFromCart } = useCart()

  const shippingCost = totalPrice >= 50 ? 0 : 4.99
  const finalTotal = totalPrice + shippingCost

  // Setup Telegram MainButton for checkout
  useEffect(() => {
    const webApp = getTelegramWebApp()
    if (webApp && items.length > 0) {
      webApp.MainButton.setParams({
        text: `Checkout - £${finalTotal.toFixed(2)}`,
        is_visible: true,
        is_active: true,
      })
      
      const handleCheckout = () => {
        successNotification()
        router.push('/tg/checkout')
      }
      
      webApp.MainButton.onClick(handleCheckout)
      
      return () => {
        webApp.MainButton.offClick(handleCheckout)
        webApp.MainButton.hide()
      }
    } else if (webApp) {
      webApp.MainButton.hide()
    }
  }, [items.length, finalTotal, router])

  const handleQuantityChange = async (itemId: string, newQuantity: number) => {
    lightImpact()
    await updateQuantity(itemId, newQuantity)
  }

  const handleRemove = async (itemId: string) => {
    lightImpact()
    await removeFromCart(itemId)
  }

  return (
    <>
      <Head>
        <title>Cart | Source The Sauce</title>
      </Head>
      
      <TelegramLayout cartCount={totalItems}>
        <Container>
          <Header>
            <BackButton onClick={() => router.back()}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 18l-6-6 6-6"/>
              </svg>
            </BackButton>
            <Title>Shopping Cart</Title>
            {items.length > 0 && <CartCount>{totalItems} items</CartCount>}
          </Header>

          {isLoading ? (
            <LoadingState>Loading cart...</LoadingState>
          ) : items.length === 0 ? (
            <EmptyState>
              <EmptyIcon>
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
                  <line x1="3" y1="6" x2="21" y2="6"/>
                  <path d="M16 10a4 4 0 0 1-8 0"/>
                </svg>
              </EmptyIcon>
              <EmptyTitle>Your cart is empty</EmptyTitle>
              <EmptyText>Looks like you haven&apos;t added<br/>any items to your cart yet</EmptyText>
              <ShopButton href="/tg">Start Shopping</ShopButton>
            </EmptyState>
          ) : (
            <>
              <CartList>
                {items.map((item) => (
                  <CartItem key={item.id}>
                    <ItemImage>
                      {item.product?.images?.[0] && (
                        <Image
                          src={item.product.images[0].url}
                          alt={item.product.name}
                          fill
                          style={{ objectFit: 'cover' }}
                        />
                      )}
                    </ItemImage>
                    
                    <ItemDetails>
                      <ItemName href={`/tg/product/${item.product?.id}/${item.product?.sku}`}>
                        {item.product?.name}
                      </ItemName>
                      <ItemVariant>
                        {item.variant?.colour} / {item.variant?.size}
                      </ItemVariant>
                      <ItemPrice>£{((item.product?.price || 0) * item.quantity).toFixed(2)}</ItemPrice>
                      
                      <QuantityControls>
                        <QuantityButton onClick={() => handleQuantityChange(item.id, item.quantity - 1)}>
                          −
                        </QuantityButton>
                        <QuantityValue>{item.quantity}</QuantityValue>
                        <QuantityButton onClick={() => handleQuantityChange(item.id, item.quantity + 1)}>
                          +
                        </QuantityButton>
                      </QuantityControls>
                    </ItemDetails>
                    
                    <RemoveButton onClick={() => handleRemove(item.id)}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M18 6L6 18M6 6l12 12"/>
                      </svg>
                    </RemoveButton>
                  </CartItem>
                ))}
              </CartList>

              <Summary>
                <SummaryRow>
                  <span>Subtotal</span>
                  <span>£{totalPrice.toFixed(2)}</span>
                </SummaryRow>
                <SummaryRow>
                  <span>Shipping</span>
                  <span>{shippingCost === 0 ? 'Free' : `£${shippingCost.toFixed(2)}`}</span>
                </SummaryRow>
                {shippingCost > 0 && (
                  <SummaryRow style={{ fontSize: 11, marginTop: 4 }}>
                    <span>Free shipping on orders over £50</span>
                    <span></span>
                  </SummaryRow>
                )}
                <SummaryRow total>
                  <span>Total</span>
                  <span>£{finalTotal.toFixed(2)}</span>
                </SummaryRow>
                <CheckoutButton onClick={() => router.push('/tg/checkout')}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
                    <line x1="1" y1="10" x2="23" y2="10"/>
                  </svg>
                  Proceed to Checkout
                </CheckoutButton>
              </Summary>
            </>
          )}
        </Container>
      </TelegramLayout>
    </>
  )
}
