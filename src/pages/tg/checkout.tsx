import Head from 'next/head'
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import { styled, keyframes } from 'stitches.config'
import { TelegramLayout } from '@/components/telegram'
import { useCart } from '@/context/telegram-cart'
import { useTelegramAuth } from '@/context/telegram-auth'
import { supabase } from '@/lib/supabase'
import { getTelegramWebApp } from '@/lib/telegram/types'
import { successNotification, errorNotification, lightImpact } from '@/lib/telegram/haptics'

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

const StepIndicator = styled('div', {
  display: 'flex',
  justifyContent: 'center',
  gap: 8,
  padding: '16px',
  backgroundColor: 'var(--tg-theme-bg-color, #ffffff)',
})

const Step = styled('div', {
  display: 'flex',
  alignItems: 'center',
  gap: 6,
  fontSize: 12,
  fontWeight: 600,
  color: 'var(--tg-theme-hint-color, #999)',
  
  '& .dot': {
    width: 24,
    height: 24,
    borderRadius: '50%',
    backgroundColor: 'var(--tg-theme-hint-color, #e5e5e5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 11,
    color: '#fff',
  },
  
  variants: {
    active: {
      true: {
        color: '#6366f1',
        '& .dot': {
          background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
        }
      }
    },
    completed: {
      true: {
        color: '#22c55e',
        '& .dot': {
          backgroundColor: '#22c55e',
        }
      }
    }
  }
})

const StepLine = styled('div', {
  width: 30,
  height: 2,
  backgroundColor: 'var(--tg-theme-hint-color, #e5e5e5)',
  borderRadius: 1,
  
  variants: {
    active: {
      true: {
        backgroundColor: '#6366f1',
      }
    }
  }
})

const Section = styled('section', {
  padding: '16px',
  margin: '8px 12px',
  backgroundColor: 'var(--tg-theme-bg-color, #ffffff)',
  borderRadius: 16,
  boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
  animation: `${fadeIn} 0.3s ease`,
})

const SectionTitle = styled('h2', {
  fontSize: 14,
  fontWeight: 700,
  margin: 0,
  marginBottom: 16,
  color: 'var(--tg-theme-text-color, #000000)',
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
  display: 'flex',
  alignItems: 'center',
  gap: 8,
  
  '& svg': {
    width: 18,
    height: 18,
    color: '#6366f1',
  }
})

const FormGroup = styled('div', {
  marginBottom: 14,
})

const Label = styled('label', {
  display: 'block',
  fontSize: 13,
  fontWeight: 600,
  marginBottom: 6,
  color: 'var(--tg-theme-hint-color, #666)',
})

const Input = styled('input', {
  width: '100%',
  padding: '14px 16px',
  borderRadius: 12,
  border: '2px solid transparent',
  backgroundColor: 'var(--tg-theme-secondary-bg-color, #f5f5f5)',
  color: 'var(--tg-theme-text-color, #000000)',
  fontSize: 15,
  fontWeight: 500,
  transition: 'all 0.2s ease',
  
  '&:focus': {
    outline: 'none',
    borderColor: '#6366f1',
    backgroundColor: 'var(--tg-theme-bg-color, #ffffff)',
  },
  
  '&::placeholder': {
    color: 'var(--tg-theme-hint-color, #aaa)',
    fontWeight: 400,
  }
})

const TextArea = styled('textarea', {
  width: '100%',
  padding: '14px 16px',
  borderRadius: 12,
  border: '2px solid transparent',
  backgroundColor: 'var(--tg-theme-secondary-bg-color, #f5f5f5)',
  color: 'var(--tg-theme-text-color, #000000)',
  fontSize: 15,
  fontWeight: 500,
  minHeight: 80,
  resize: 'vertical',
  transition: 'all 0.2s ease',
  
  '&:focus': {
    outline: 'none',
    borderColor: '#6366f1',
    backgroundColor: 'var(--tg-theme-bg-color, #ffffff)',
  },
})

const OrderSummary = styled('div', {
  padding: '16px',
  backgroundColor: 'var(--tg-theme-secondary-bg-color, #f8f9fa)',
  borderRadius: 14,
})

const SummaryRow = styled('div', {
  display: 'flex',
  justifyContent: 'space-between',
  marginBottom: 10,
  color: 'var(--tg-theme-hint-color, #666)',
  fontSize: 14,
  
  variants: {
    total: {
      true: {
        fontSize: 18,
        fontWeight: 800,
        marginTop: 14,
        paddingTop: 14,
        borderTop: '1px dashed var(--tg-theme-hint-color, #e5e5e5)',
        marginBottom: 0,
        color: 'var(--tg-theme-text-color, #000)',
      }
    }
  }
})

const BottomBar = styled('div', {
  position: 'fixed',
  bottom: 0,
  left: 0,
  right: 0,
  backgroundColor: 'var(--tg-theme-bg-color, #ffffff)',
  padding: '12px 16px',
  paddingBottom: 'max(12px, env(safe-area-inset-bottom))',
  boxShadow: '0 -4px 20px rgba(0,0,0,0.08)',
  zIndex: 100,
})

const PlaceOrderButton = styled('button', {
  width: '100%',
  padding: '16px',
  borderRadius: 14,
  border: 'none',
  background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
  color: '#ffffff',
  fontSize: 16,
  fontWeight: 700,
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 8,
  boxShadow: '0 4px 14px rgba(99, 102, 241, 0.35)',
  transition: 'all 0.2s ease',
  
  '&:active': {
    transform: 'scale(0.98)',
  },
  
  '&:disabled': {
    opacity: 0.6,
    cursor: 'not-allowed',
  }
})

const ErrorMessage = styled('div', {
  padding: '12px 16px',
  margin: '8px 12px',
  background: 'linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)',
  color: '#dc2626',
  borderRadius: 12,
  fontSize: 13,
  fontWeight: 600,
  display: 'flex',
  alignItems: 'center',
  gap: 8,
})

const FreeShippingBadge = styled('div', {
  display: 'flex',
  alignItems: 'center',
  gap: 6,
  padding: '8px 12px',
  backgroundColor: 'rgba(34, 197, 94, 0.1)',
  borderRadius: 8,
  color: '#22c55e',
  fontSize: 12,
  fontWeight: 600,
  marginTop: 8,
})

export default function CheckoutPage() {
  const router = useRouter()
  const { items, totalItems, totalPrice, clearCart } = useCart()
  const { user, telegramUser } = useTelegramAuth()
  
  const [formData, setFormData] = useState({
    fullName: user?.full_name || telegramUser?.first_name || '',
    phone: '',
    email: '',
    address: '',
    city: '',
    postalCode: '',
    notes: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  const shippingCost = totalPrice >= 50 ? 0 : 4.99
  const finalTotal = totalPrice + shippingCost

  // Setup Telegram MainButton
  useEffect(() => {
    const webApp = getTelegramWebApp()
    if (webApp && items.length > 0) {
      webApp.MainButton.setParams({
        text: `Place Order - £${finalTotal.toFixed(2)}`,
        is_visible: true,
        is_active: !isSubmitting,
      })
      
      const handleSubmit = () => {
        handlePlaceOrder()
      }
      
      webApp.MainButton.onClick(handleSubmit)
      
      return () => {
        webApp.MainButton.offClick(handleSubmit)
        webApp.MainButton.hide()
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items.length, finalTotal, isSubmitting])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const validateForm = () => {
    if (!formData.fullName.trim()) return 'Please enter your full name'
    if (!formData.phone.trim()) return 'Please enter your phone number'
    if (!formData.address.trim()) return 'Please enter your delivery address'
    if (!formData.city.trim()) return 'Please enter your city'
    if (!formData.postalCode.trim()) return 'Please enter your postal code'
    return null
  }

  const handlePlaceOrder = async () => {
    const validationError = validateForm()
    if (validationError) {
      setError(validationError)
      errorNotification()
      return
    }

    setIsSubmitting(true)
    setError('')

    try {
      // Ensure we have a user_id for the order
      let userId = user?.id
      
      // If no user, try to create or find a guest user based on telegram_id
      if (!userId && telegramUser?.id) {
        // Check if telegram user exists
        const { data: existingUser } = await supabase
          .from('telegram_users')
          .select('id')
          .eq('telegram_id', telegramUser.id.toString())
          .single()
        
        if (existingUser) {
          userId = existingUser.id
        } else {
          // Create a telegram user record
          const { data: newUser, error: userError } = await supabase
            .from('telegram_users')
            .insert({
              telegram_id: telegramUser.id.toString(),
              first_name: telegramUser.first_name || formData.fullName,
              last_name: telegramUser.last_name || '',
              username: telegramUser.username || '',
            })
            .select('id')
            .single()
          
          if (userError) {
            console.error('Error creating user:', userError)
            throw new Error('Could not create user account')
          }
          userId = newUser.id
        }
      }
      
      // If still no userId, create a guest user with phone as identifier
      if (!userId) {
        const guestTelegramId = `guest_${formData.phone.replace(/\D/g, '')}_${Date.now()}`
        const { data: guestUser, error: guestError } = await supabase
          .from('telegram_users')
          .insert({
            telegram_id: guestTelegramId,
            first_name: formData.fullName,
          })
          .select('id')
          .single()
        
        if (guestError) {
          console.error('Error creating guest user:', guestError)
          throw new Error('Could not create guest account')
        }
        userId = guestUser.id
      }

      // Generate order number
      const orderNumber = `ORD-${Date.now().toString(36).toUpperCase()}`

      // Create order with schema-correct fields
      const orderData = {
        order_number: orderNumber,
        user_id: userId,
        status: 'pending',
        payment_status: 'pending',
        subtotal: totalPrice,
        shipping_amount: shippingCost,
        total: finalTotal,
        shipping_name: formData.fullName,
        shipping_phone: formData.phone,
        shipping_address: formData.address,
        shipping_city: formData.city,
        shipping_country: 'UK',
        notes: formData.notes || null,
      }

      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert(orderData)
        .select()
        .single()

      if (orderError) throw orderError

      // Create order items with schema-correct fields
      const orderItems = items.map(item => ({
        order_id: order.id,
        product_id: item.product_id,
        variant_id: item.variant_id,
        product_name: item.product?.name || 'Unknown Product',
        product_image: item.product?.images?.[0]?.url || null,
        colour: item.variant?.colour || null,
        size: item.variant?.size || null,
        qty: item.quantity,
        price: item.product?.price || 0,
        total: (item.product?.price || 0) * item.quantity,
      }))

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems)

      if (itemsError) throw itemsError

      // Clear cart
      await clearCart()

      successNotification()

      // Redirect to order confirmation
      router.push(`/tg/order/${order.id}`)
    } catch (err: any) {
      console.error('Error placing order:', err)
      setError(err.message || 'Failed to place order. Please try again.')
      errorNotification()
    } finally {
      setIsSubmitting(false)
    }
  }

  if (items.length === 0) {
    router.push('/tg/cart')
    return null
  }

  return (
    <>
      <Head>
        <title>Checkout | Source The Sauce</title>
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
            <Title>Checkout</Title>
          </Header>

          <StepIndicator>
            <Step completed>
              <span className="dot">✓</span>
              <span>Cart</span>
            </Step>
            <StepLine active />
            <Step active>
              <span className="dot">2</span>
              <span>Details</span>
            </Step>
            <StepLine />
            <Step>
              <span className="dot">3</span>
              <span>Done</span>
            </Step>
          </StepIndicator>

          {error && (
            <ErrorMessage>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
              </svg>
              {error}
            </ErrorMessage>
          )}

          <Section>
            <SectionTitle>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
              Contact Information
            </SectionTitle>
            <FormGroup>
              <Label>Full Name *</Label>
              <Input
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                placeholder="John Smith"
              />
            </FormGroup>
            <FormGroup>
              <Label>Phone Number *</Label>
              <Input
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="+44 7700 900000"
              />
            </FormGroup>
            <FormGroup>
              <Label>Email (Optional)</Label>
              <Input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="john@example.com"
              />
            </FormGroup>
          </Section>

          <Section>
            <SectionTitle>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                <circle cx="12" cy="10" r="3"/>
              </svg>
              Delivery Address
            </SectionTitle>
            <FormGroup>
              <Label>Street Address *</Label>
              <Input
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                placeholder="123 Main Street, Apt 4B"
              />
            </FormGroup>
            <FormGroup>
              <Label>City *</Label>
              <Input
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                placeholder="London"
              />
            </FormGroup>
            <FormGroup>
              <Label>Postal Code *</Label>
              <Input
                name="postalCode"
                value={formData.postalCode}
                onChange={handleInputChange}
                placeholder="SW1A 1AA"
              />
            </FormGroup>
            <FormGroup>
              <Label>Order Notes (Optional)</Label>
              <TextArea
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                placeholder="Leave at door, ring bell twice..."
              />
            </FormGroup>
          </Section>

          <Section>
            <SectionTitle>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
                <line x1="3" y1="6" x2="21" y2="6"/>
                <path d="M16 10a4 4 0 0 1-8 0"/>
              </svg>
              Order Summary
            </SectionTitle>
            <OrderSummary>
              <SummaryRow>
                <span>Subtotal ({totalItems} {totalItems === 1 ? 'item' : 'items'})</span>
                <span>£{totalPrice.toFixed(2)}</span>
              </SummaryRow>
              <SummaryRow>
                <span>Shipping</span>
                <span style={{ color: shippingCost === 0 ? '#22c55e' : undefined, fontWeight: shippingCost === 0 ? 600 : 400 }}>
                  {shippingCost === 0 ? 'FREE' : `£${shippingCost.toFixed(2)}`}
                </span>
              </SummaryRow>
              {shippingCost === 0 && (
                <FreeShippingBadge>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                  </svg>
                  Free shipping on orders £50+
                </FreeShippingBadge>
              )}
              <SummaryRow total>
                <span>Total</span>
                <span>£{finalTotal.toFixed(2)}</span>
              </SummaryRow>
            </OrderSummary>
          </Section>
        </Container>

        <BottomBar>
          <PlaceOrderButton
            onClick={handlePlaceOrder}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>Processing...</>
            ) : (
              <>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14"/>
                  <path d="M12 5l7 7-7 7"/>
                </svg>
                Place Order · £{finalTotal.toFixed(2)}
              </>
            )}
          </PlaceOrderButton>
        </BottomBar>
      </TelegramLayout>
    </>
  )
}
