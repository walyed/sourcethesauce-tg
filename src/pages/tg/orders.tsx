import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import { styled, keyframes } from 'stitches.config'
import { TelegramLayout } from '@/components/telegram'
import { useTelegramAuth } from '@/context/telegram-auth'
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

const OrdersList = styled('div', {
  padding: 12,
})

const OrderCard = styled(Link, {
  display: 'block',
  backgroundColor: 'var(--tg-theme-bg-color, #ffffff)',
  borderRadius: 16,
  padding: 16,
  marginBottom: 10,
  textDecoration: 'none',
  boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
  animation: `${fadeIn} 0.3s ease`,
  transition: 'all 0.2s ease',
  
  '&:active': {
    transform: 'scale(0.98)',
  }
})

const OrderHeader = styled('div', {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: 12,
})

const OrderId = styled('span', {
  fontSize: 13,
  fontWeight: 700,
  color: '#6366f1',
  fontFamily: 'monospace',
})

const StatusBadge = styled('span', {
  display: 'inline-block',
  padding: '5px 12px',
  borderRadius: 20,
  fontSize: 11,
  fontWeight: 700,
  textTransform: 'uppercase',
  letterSpacing: '0.3px',
  
  variants: {
    status: {
      pending: {
        background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
        color: '#b45309',
      },
      confirmed: {
        background: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)',
        color: '#1d4ed8',
      },
      shipped: {
        background: 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)',
        color: '#047857',
      },
      delivered: {
        background: 'linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)',
        color: '#15803d',
      },
      cancelled: {
        background: 'linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)',
        color: '#b91c1c',
      }
    }
  }
})

const OrderDetails = styled('div', {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  fontSize: 14,
  color: 'var(--tg-theme-hint-color, #999999)',
})

const OrderDate = styled('span', {
  display: 'flex',
  alignItems: 'center',
  gap: 4,
})

const OrderTotal = styled('span', {
  fontSize: 17,
  fontWeight: 800,
  background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
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
  background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: 16,
  color: '#6366f1',
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

interface Order {
  id: string
  order_number: string
  status: string
  total: number
  created_at: string
  items: Array<{ qty: number }>  
}

export default function OrdersPage() {
  const router = useRouter()
  const { user, telegramUser } = useTelegramAuth()
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const statusMap: Record<string, string> = {
    pending: 'Pending',
    confirmed: 'Confirmed',
    shipped: 'Shipped',
    delivered: 'Delivered',
    cancelled: 'Cancelled',
  }

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user?.id && !telegramUser?.id) {
        setIsLoading(false)
        return
      }

      try {
        let query = supabase
          .from('orders')
          .select(`
            id,
            order_number,
            status,
            total,
            created_at,
            items:order_items(qty)
          `)
          .order('created_at', { ascending: false })

        if (user?.id) {
          query = query.eq('user_id', user.id)
        } else if (telegramUser?.id) {
          query = query.eq('telegram_id', telegramUser.id)
        }

        const { data, error } = await query

        if (error) {
          console.error('Error fetching orders:', error)
        } else {
          setOrders(data || [])
        }
      } catch (error) {
        console.error('Error fetching orders:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchOrders()
  }, [user?.id, telegramUser?.id])

  return (
    <>
      <Head>
        <title>My Orders | Source The Sauce</title>
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
            <Title>My Orders</Title>
          </Header>

          {isLoading ? (
            <LoadingState>Loading orders...</LoadingState>
          ) : orders.length === 0 ? (
            <EmptyState>
              <EmptyIcon>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
                  <line x1="3" y1="6" x2="21" y2="6"/>
                  <path d="M16 10a4 4 0 0 1-8 0"/>
                </svg>
              </EmptyIcon>
              <EmptyTitle>No orders yet</EmptyTitle>
              <EmptyText>Once you place an order, it will appear here</EmptyText>
              <ShopButton href="/tg">Start Shopping</ShopButton>
            </EmptyState>
          ) : (
            <OrdersList>
              {orders.map((order) => {
                const itemCount = order.items?.reduce((sum, item) => sum + (item.qty || 0), 0) || 0
                
                return (
                  <OrderCard key={order.id} href={`/tg/order/${order.id}`}>
                    <OrderHeader>
                      <OrderId>{order.order_number || `#${order.id.slice(0, 8).toUpperCase()}`}</OrderId>
                      <StatusBadge status={order.status as any}>
                        {statusMap[order.status] || order.status}
                      </StatusBadge>
                    </OrderHeader>
                    <OrderDetails>
                      <OrderDate>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                          <line x1="16" y1="2" x2="16" y2="6"/>
                          <line x1="8" y1="2" x2="8" y2="6"/>
                          <line x1="3" y1="10" x2="21" y2="10"/>
                        </svg>
                        {new Date(order.created_at).toLocaleDateString()} · {itemCount} item{itemCount !== 1 ? 's' : ''}
                      </OrderDate>
                      <OrderTotal>£{(order.total || 0).toFixed(2)}</OrderTotal>
                    </OrderDetails>
                  </OrderCard>
                )
              })}
            </OrdersList>
          )}
        </Container>
      </TelegramLayout>
    </>
  )
}
