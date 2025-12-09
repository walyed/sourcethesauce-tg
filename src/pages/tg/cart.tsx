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
  paddingBottom: 190,
  background:
    'radial-gradient(circle at top, rgba(99,102,241,0.12) 0, transparent 55%), radial-gradient(circle at bottom, rgba(15,23,42,0.95) 0, #020617 70%)',
  color: '#e5e7eb',
})

const Header = styled('header', {
  padding: '12px 16px',
  backgroundColor: 'rgba(15,23,42,0.96)',
  display: 'flex',
  alignItems: 'center',
  gap: 12,
  position: 'sticky',
  top: 0,
  zIndex: 100,
  borderBottom: '1px solid rgba(148,163,184,0.35)',
  backdropFilter: 'blur(10px)',
})

const BackButton = styled('button', {
  width: 36,
  height: 36,
  borderRadius: 999,
  backgroundColor: 'rgba(15,23,42,0.9)',
  border: '1px solid rgba(148,163,184,0.5)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  color: '#e5e7eb',
  transition: 'transform 0.12s ease, box-shadow 0.12s ease',

  '&:active': {
    transform: 'scale(0.94)',
    boxShadow: '0 0 0 1px rgba(94,234,212,0.5)',
  },
})

const TitleWrap = styled('div', {
  display: 'flex',
  flexDirection: 'column',
})

const Title = styled('h1', {
  fontSize: 17,
  fontWeight: 700,
  margin: 0,
  color: '#e5e7eb',
})

const Subtitle = styled('span', {
  fontSize: 11,
  color: 'rgba(148,163,184,0.95)',
})

const CartCount = styled('span', {
  marginLeft: 'auto',
  fontSize: 12,
  fontWeight: 600,
  padding: '4px 10px',
  borderRadius: 999,
  backgroundColor: 'rgba(15,23,42,0.9)',
  border: '1px solid rgba(148,163,184,0.5)',
  color: 'rgba(226,232,240,0.98)',
})

const CartList = styled('div', {
  padding: '12px 16px 24px',
})

const CartItem = styled('div', {
  display: 'flex',
  gap: 12,
  padding: 12,
  background:
    'radial-gradient(circle at top left, rgba(148,163,184,0.1), rgba(15,23,42,0.96))',
  borderRadius: 18,
  marginBottom: 12,
  boxShadow: '0 14px 35px rgba(15,23,42,0.9)',
  border: '1px solid rgba(30,64,175,0.6)',
})

const ItemImage = styled('div', {
  position: 'relative',
  width: 80,
  height: 100,
  borderRadius: 14,
  overflow: 'hidden',
  backgroundColor: 'rgba(15,23,42,0.9)',
  flexShrink: 0,
  border: '1px solid rgba(148,163,184,0.5)',
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
  color: 'rgba(226,232,240,0.98)',
  textDecoration: 'none',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
})

const ItemVariant = styled('span', {
  fontSize: 11,
  color: 'rgba(148,163,184,0.95)',
  marginBottom: 6,
})

const ItemPriceRow = styled('div', {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginTop: 'auto',
})

const ItemPrice = styled('span', {
  fontSize: 15,
  fontWeight: 700,
  color: '#f9fafb',
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
  borderRadius: 999,
  border: '1px solid rgba(148,163,184,0.7)',
  backgroundColor: 'rgba(15,23,42,0.9)',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: '#e5e7eb',
  fontSize: 16,
  fontWeight: 600,
  transition: 'transform 0.12s ease, background-color 0.12s ease',

  '&:active': {
    transform: 'scale(0.9)',
    backgroundColor: 'rgba(30,64,175,0.95)',
  },
})

const QuantityValue = styled('span', {
  fontSize: 14,
  fontWeight: 600,
  minWidth: 20,
  textAlign: 'center',
  color: 'rgba(226,232,240,0.98)',
})

const RemoveButton = styled('button', {
  background: 'none',
  border: 'none',
  padding: 4,
  cursor: 'pointer',
  color: 'rgba(148,163,184,0.9)',
  alignSelf: 'flex-start',
  transition: 'transform 0.12s ease, color 0.12s ease',

  '&:active': {
    transform: 'scale(0.9)',
    color: '#f97373',
  },
})

// Summary bottom panel

const Summary = styled('div', {
  position: 'fixed',
  bottom: 0,
  left: 0,
  right: 0,
  padding: '12px 14px 16px',
  background:
    'linear-gradient(to top, rgba(15,23,42,0.98), rgba(15,23,42,0.94))',
  borderTop: '1px solid rgba(148,163,184,0.45)',
  boxShadow: '0 -12px 35px rgba(15,23,42,1)',
  backdropFilter: 'blur(12px)',
  zIndex: 120,
})

const SummaryInner = styled('div', {
  maxWidth: 480,
  margin: '0 auto',
})

const SummaryRow = styled('div', {
  display: 'flex',
  justifyContent: 'space-between',
  marginBottom: 6,
  fontSize: 13,
  color: 'rgba(148,163,184,0.95)',

  variants: {
    total: {
      true: {
        fontSize: 17,
        fontWeight: 700,
        color: '#f9fafb',
        marginTop: 8,
        paddingTop: 10,
        borderTop: '1px dashed rgba(148,163,184,0.6)',
        marginBottom: 0,
      },
    },
  },
})

const ShippingHint = styled('div', {
  fontSize: 11,
  color: 'rgba(148,163,184,0.95)',
  marginTop: 4,
})

const CheckoutButton = styled('button', {
  width: '100%',
  padding: '13px',
  borderRadius: 999,
  border: 'none',
  marginTop: 12,
  background: 'linear-gradient(135deg, #22c55e, #4ade80)',
  color: '#022c22',
  fontSize: 14,
  fontWeight: 800,
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 8,
  boxShadow: '0 12px 32px rgba(22,163,74,0.75)',
  letterSpacing: 0.03,

  '&:active': {
    transform: 'scale(0.97)',
  },
})

// Empty / loading

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
  background:
    'radial-gradient(circle at top, rgba(148,163,184,0.2), rgba(15,23,42,1))',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: 20,
  color: 'rgba(148,163,184,0.95)',
  boxShadow: '0 18px 40px rgba(15,23,42,1)',
})

const EmptyTitle = styled('h2', {
  fontSize: 20,
  fontWeight: 700,
  margin: 0,
  marginBottom: 8,
  color: '#e5e7eb',
})

const EmptyText = styled('p', {
  fontSize: 14,
  margin: 0,
  marginBottom: 24,
  color: 'rgba(148,163,184,0.95)',
  lineHeight: 1.5,
})

const ShopButton = styled(Link, {
  padding: '12px 30px',
  borderRadius: 999,
  background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
  color: '#f9fafb',
  textDecoration: 'none',
  fontSize: 14,
  fontWeight: 700,
  boxShadow: '0 12px 28px rgba(99,102,241,0.7)',

  '&:active': {
    transform: 'scale(0.97)',
  },
})

const LoadingState = styled('div', {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '64px 16px',
  color: 'rgba(148,163,184,0.95)',
  fontSize: 13,
})

export default function CartPage() {
  const router = useRouter()
  const { items, isLoading, totalItems, totalPrice, updateQuantity, removeFromCart } = useCart()

  const shippingCost = totalPrice >= 50 ? 0 : 4.99
  const finalTotal = totalPrice + shippingCost

  // Telegram MainButton checkout
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
            <TitleWrap>
              <Title>Shopping Cart</Title>
              <Subtitle>Review your picks before checkout</Subtitle>
            </TitleWrap>
            {items.length > 0 && <CartCount>{totalItems} item{totalItems > 1 ? 's' : ''}</CartCount>}
          </Header>

          {isLoading ? (
            <LoadingState>Loading cart…</LoadingState>
          ) : items.length === 0 ? (
            <EmptyState>
              <EmptyIcon>
                <svg
                  width="40"
                  height="40"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                >
                  <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <path d="M16 10a4 4 0 0 1-8 0" />
                </svg>
              </EmptyIcon>
              <EmptyTitle>Your cart is empty</EmptyTitle>
              <EmptyText>
                Nothing in the bag yet.
                <br />
                Jump back in and add your favourites.
              </EmptyText>
              <ShopButton href="/tg">Back to shop</ShopButton>
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
                      <ItemPriceRow>
                        <ItemPrice>
                          £{((item.product?.price || 0) * item.quantity).toFixed(2)}
                        </ItemPrice>
                      </ItemPriceRow>

                      <QuantityControls>
                        <QuantityButton
                          onClick={() =>
                            handleQuantityChange(item.id, item.quantity - 1)
                          }
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
                      Free shipping kicks in at £50+
                    </ShippingHint>
                  )}
                  <SummaryRow total>
                    <span>Total</span>
                    <span>£{finalTotal.toFixed(2)}</span>
                  </SummaryRow>
                  <CheckoutButton onClick={() => router.push('/tg/checkout')}>
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <rect
                        x="1"
                        y="4"
                        width="22"
                        height="16"
                        rx="2"
                        ry="2"
                      />
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
