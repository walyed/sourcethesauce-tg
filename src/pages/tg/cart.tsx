import Head from 'next/head'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { styled } from 'stitches.config'
import { TelegramLayout } from '@/components/telegram'
import { useCart } from '@/context/telegram-cart'
import { getTelegramWebApp } from '@/lib/telegram/types'
import { lightImpact, successNotification } from '@/lib/telegram/haptics'

const Container = styled('div', {
  minHeight: '100vh',
  background:
    'radial-gradient(circle at top, rgba(99,102,241,0.18) 0, transparent 55%), radial-gradient(circle at bottom, rgba(15,23,42,0.96) 0, #020617 70%)',
  paddingBottom: 180,
})

const Header = styled('header', {
  padding: '12px 16px',
  background:
    'linear-gradient(to right, rgba(15,23,42,0.98), rgba(15,23,42,0.96))',
  display: 'flex',
  alignItems: 'center',
  gap: 12,
  position: 'sticky',
  top: 0,
  zIndex: 100,
  borderBottom: '1px solid rgba(148,163,184,0.5)',
  backdropFilter: 'blur(10px)',
})

const BackButton = styled('button', {
  width: 36,
  height: 36,
  borderRadius: 999,
  backgroundColor: '#020617',
  border: '1px solid rgba(148,163,184,0.7)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  color: '#e5e7eb',
  boxShadow: '0 8px 20px rgba(15,23,42,0.85)',

  '&:active': {
    transform: 'scale(0.95)',
  },
})

const Title = styled('h1', {
  fontSize: 17,
  fontWeight: 700,
  margin: 0,
  color: '#e5e7eb',
})

const CartCount = styled('span', {
  marginLeft: 'auto',
  fontSize: 12,
  fontWeight: 600,
  color: 'rgba(148,163,184,0.95)',
})

const CartList = styled('div', {
  padding: '12px 16px 24px',
})

const CartItem = styled('div', {
  display: 'flex',
  gap: 12,
  padding: 12,
  background:
    'linear-gradient(to bottom right, rgba(15,23,42,0.95), rgba(15,23,42,0.9))',
  borderRadius: 18,
  marginBottom: 10,
  boxShadow: '0 14px 30px rgba(15,23,42,0.9)',
  border: '1px solid rgba(30,64,175,0.6)',
})

const ItemImage = styled('div', {
  position: 'relative',
  width: 80,
  height: 100,
  borderRadius: 12,
  overflow: 'hidden',
  background:
    'radial-gradient(circle at top, rgba(15,23,42,0.85), #020617)',
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
  color: '#e5e7eb',
  textDecoration: 'none',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
})

const ItemVariant = styled('span', {
  fontSize: 11,
  color: 'rgba(148,163,184,0.95)',
  marginBottom: 4,
})

const ItemPrice = styled('span', {
  fontSize: 15,
  fontWeight: 700,
  color: '#a5b4fc',
  marginTop: 'auto',
})

const QuantityControls = styled('div', {
  display: 'flex',
  alignItems: 'center',
  gap: 8,
  marginTop: 8,
})

const QuantityButton = styled('button', {
  width: 26,
  height: 26,
  borderRadius: 999,
  border: 'none',
  backgroundColor: '#020617',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: '#e5e7eb',
  fontSize: 16,
  fontWeight: 600,
  boxShadow: '0 6px 16px rgba(15,23,42,0.9)',

  '&:active': {
    transform: 'scale(0.9)',
  },

  '&:disabled': {
    opacity: 0.4,
  },
})

const QuantityValue = styled('span', {
  fontSize: 13,
  fontWeight: 600,
  minWidth: 20,
  textAlign: 'center',
  color: '#e5e7eb',
})

const RemoveButton = styled('button', {
  background: 'none',
  border: 'none',
  padding: 4,
  cursor: 'pointer',
  color: 'rgba(148,163,184,0.85)',
  alignSelf: 'flex-start',

  '&:active': {
    color: '#f97373',
  },
})

const Summary = styled('div', {
  position: 'fixed',
  bottom: 0,
  left: 0,
  right: 0,
  padding: '10px 10px 12px',
  background:
    'linear-gradient(to top, rgba(15,23,42,0.98), rgba(15,23,42,0.95))',
  borderTop: '1px solid rgba(148,163,184,0.6)',
  boxShadow: '0 -16px 40px rgba(15,23,42,0.95)',
  zIndex: 120,
  backdropFilter: 'blur(10px)',
})

const SummaryInner = styled('div', {
  maxWidth: 480,
  margin: '0 auto',
})

const SummaryRow = styled('div', {
  display: 'flex',
  justifyContent: 'space-between',
  marginBottom: 6,
  fontSize: 12,
  color: 'rgba(148,163,184,0.96)',

  variants: {
    total: {
      true: {
        fontSize: 15,
        fontWeight: 700,
        color: '#e5e7eb',
        marginTop: 8,
        paddingTop: 10,
        borderTop: '1px dashed rgba(148,163,184,0.7)',
        marginBottom: 0,
      },
    },
  },
})

const ShippingHint = styled('div', {
  fontSize: 11,
  marginTop: 2,
  marginBottom: 4,
  color: 'rgba(129,140,248,0.95)',
})

const CheckoutButton = styled('button', {
  width: '100%',
  padding: '12px',
  borderRadius: 999,
  border: 'none',
  background:
    'linear-gradient(135deg, #22c55e, #4ade80)',
  color: '#022c22',
  fontSize: 14,
  fontWeight: 800,
  cursor: 'pointer',
  marginTop: 12,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 8,
  boxShadow: '0 14px 32px rgba(22,163,74,0.75)',

  '&:active': {
    transform: 'scale(0.97)',
  },
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
  width: 96,
  height: 96,
  borderRadius: 30,
  background:
    'radial-gradient(circle at top, rgba(15,23,42,0.9), #020617)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: 20,
  color: 'rgba(148,163,184,0.95)',
  boxShadow: '0 18px 40px rgba(15,23,42,0.95)',
})

const EmptyTitle = styled('h2', {
  fontSize: 18,
  fontWeight: 700,
  margin: 0,
  marginBottom: 8,
  color: '#e5e7eb',
})

const EmptyText = styled('p', {
  fontSize: 13,
  margin: 0,
  marginBottom: 22,
  color: 'rgba(148,163,184,0.96)',
  lineHeight: 1.5,
})

const ShopButton = styled(Link, {
  padding: '12px 32px',
  borderRadius: 999,
  background:
    'linear-gradient(135deg, #6366f1, #8b5cf6)',
  color: '#e5e7eb',
  textDecoration: 'none',
  fontSize: 14,
  fontWeight: 700,
  boxShadow: '0 14px 32px rgba(79,70,229,0.8)',

  '&:active': {
    transform: 'scale(0.97)',
  },
})

const LoadingState = styled('div', {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '64px 16px',
  color: 'rgba(148,163,184,0.96)',
  fontSize: 13,
})

export default function CartPage() {
  const router = useRouter()
  const { items, isLoading, totalItems, totalPrice, updateQuantity, removeFromCart } =
    useCart()

  const shippingCost = totalPrice >= 50 ? 0 : 4.99
  const finalTotal = totalPrice + shippingCost

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
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </BackButton>
            <Title>Shopping Bag</Title>
            {items.length > 0 && (
              <CartCount>{totalItems} item{totalItems > 1 ? 's' : ''}</CartCount>
            )}
          </Header>

          {isLoading ? (
            <LoadingState>Loading your bag…</LoadingState>
          ) : items.length === 0 ? (
            <EmptyState>
              <EmptyIcon>
                <svg
                  width="40"
                  height="40"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <path d="M16 10a4 4 0 0 1-8 0" />
                </svg>
              </EmptyIcon>
              <EmptyTitle>Your bag is empty</EmptyTitle>
              <EmptyText>
                Add something from the latest drop
                <br />
                and it will show up here.
              </EmptyText>
              <ShopButton href="/tg">Browse the sauce</ShopButton>
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
                      <ItemName
                        href={`/tg/product/${item.product?.id}/${item.product?.sku}`}
                      >
                        {item.product?.name}
                      </ItemName>
                      <ItemVariant>
                        {item.variant?.colour} / {item.variant?.size}
                      </ItemVariant>
                      <ItemPrice>
                        £{((item.product?.price || 0) * item.quantity).toFixed(2)}
                      </ItemPrice>

                      <QuantityControls>
                        <QuantityButton
                          onClick={() =>
                            handleQuantityChange(item.id, item.quantity - 1)
                          }
                          disabled={item.quantity <= 1}
                        >
                          −
                        </QuantityButton>
                        <QuantityValue>{item.quantity}</QuantityValue>
                        <QuantityButton
                          onClick={() =>
                            handleQuantityChange(item.id, item.quantity + 1)
                          }
                        >
                          +
                        </QuantityButton>
                      </QuantityControls>
                    </ItemDetails>

                    <RemoveButton onClick={() => handleRemove(item.id)}>
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M18 6L6 18M6 6l12 12" />
                      </svg>
                    </RemoveButton>
                  </CartItem>
                ))}
              </CartList>

              <Summary>
                <SummaryInner>
                  <SummaryRow>
                    <span>Subtotal</span>
                    <span>£{totalPrice.toFixed(2)}</span>
                  </SummaryRow>
                  <SummaryRow>
                    <span>Shipping</span>
                    <span>
                      {shippingCost === 0
                        ? 'Free'
                        : `£${shippingCost.toFixed(2)}`}
                    </span>
                  </SummaryRow>
                  {shippingCost > 0 && (
                    <ShippingHint>
                      Free shipping unlocks at £50+
                    </ShippingHint>
                  )}
                  <SummaryRow total>
                    <span>Total</span>
                    <span>£{finalTotal.toFixed(2)}</span>
                  </SummaryRow>
                  <CheckoutButton onClick={() => router.push('/tg/checkout')}>
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
                      <line x1="1" y1="10" x2="23" y2="10" />
                    </svg>
                    Proceed to checkout
                  </CheckoutButton>
                </SummaryInner>
              </Summary>
            </>
          )}
        </Container>
      </TelegramLayout>
    </>
  )
}
