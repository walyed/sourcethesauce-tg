import { GetServerSideProps } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import { styled } from 'stitches.config'
import { TelegramLayout } from '@/components/telegram'
import { supabase } from '@/lib/supabase'

const Container = styled('div', {
  padding: '24px 16px',
  textAlign: 'center',
})

const SuccessIcon = styled('div', {
  width: 80,
  height: 80,
  borderRadius: '50%',
  backgroundColor: '#e8f5e9',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  margin: '0 auto 24px',
  color: '#4caf50',
})

const Title = styled('h1', {
  fontSize: 24,
  fontWeight: 700,
  margin: 0,
  marginBottom: 8,
  color: 'var(--tg-theme-text-color, #000000)',
})

const Subtitle = styled('p', {
  fontSize: 14,
  color: 'var(--tg-theme-hint-color, #999999)',
  margin: 0,
  marginBottom: 32,
})

const OrderCard = styled('div', {
  backgroundColor: 'var(--tg-theme-secondary-bg-color, #f5f5f5)',
  borderRadius: 12,
  padding: 16,
  textAlign: 'left',
  marginBottom: 24,
})

const OrderNumber = styled('div', {
  fontSize: 12,
  color: 'var(--tg-theme-hint-color, #999999)',
  marginBottom: 4,
})

const OrderId = styled('div', {
  fontSize: 16,
  fontWeight: 600,
  color: 'var(--tg-theme-text-color, #000000)',
  marginBottom: 16,
  fontFamily: 'monospace',
})

const OrderRow = styled('div', {
  display: 'flex',
  justifyContent: 'space-between',
  marginBottom: 8,
  fontSize: 14,
  color: 'var(--tg-theme-text-color, #000000)',
})

const StatusBadge = styled('span', {
  display: 'inline-block',
  padding: '4px 12px',
  borderRadius: 100,
  fontSize: 12,
  fontWeight: 600,
  
  variants: {
    status: {
      pending: {
        backgroundColor: '#fff3e0',
        color: '#f57c00',
      },
      confirmed: {
        backgroundColor: '#e3f2fd',
        color: '#1976d2',
      },
      shipped: {
        backgroundColor: '#e8f5e9',
        color: '#388e3c',
      },
      delivered: {
        backgroundColor: '#e8f5e9',
        color: '#2e7d32',
      },
      cancelled: {
        backgroundColor: '#ffebee',
        color: '#c62828',
      }
    }
  }
})

const ContinueButton = styled(Link, {
  display: 'block',
  width: '100%',
  padding: '16px',
  borderRadius: 12,
  backgroundColor: 'var(--tg-theme-button-color, #007aff)',
  color: 'var(--tg-theme-button-text-color, #ffffff)',
  textDecoration: 'none',
  fontSize: 16,
  fontWeight: 600,
  textAlign: 'center',
})

interface OrderPageProps {
  order: {
    id: string
    order_number: string | null
    status: string
    total: number
    subtotal: number
    shipping_amount: number
    created_at: string
    shipping_name: string
    shipping_address: string
    shipping_city: string
    shipping_country: string
  } | null
}

export default function OrderPage({ order }: OrderPageProps) {
  if (!order) {
    return (
      <TelegramLayout>
        <Container>
          <Title>Order not found</Title>
          <ContinueButton href="/tg">Back to Home</ContinueButton>
        </Container>
      </TelegramLayout>
    )
  }

  const statusMap: Record<string, string> = {
    pending: 'Pending',
    confirmed: 'Confirmed',
    shipped: 'Shipped',
    delivered: 'Delivered',
    cancelled: 'Cancelled',
  }

  return (
    <>
      <Head>
        <title>Order Confirmed | Source The Sauce</title>
      </Head>
      
      <TelegramLayout>
        <Container>
          <SuccessIcon>
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 6L9 17l-5-5"/>
            </svg>
          </SuccessIcon>
          
          <Title>Order Confirmed!</Title>
          <Subtitle>Thank you for your order. We&apos;ll send you updates via Telegram.</Subtitle>

          <OrderCard>
            <OrderNumber>Order Number</OrderNumber>
            <OrderId>{order.order_number || order.id.slice(0, 8).toUpperCase()}</OrderId>
            
            <OrderRow>
              <span>Status</span>
              <StatusBadge status={order.status as any}>{statusMap[order.status]}</StatusBadge>
            </OrderRow>
            <OrderRow>
              <span>Subtotal</span>
              <span>£{order.subtotal.toFixed(2)}</span>
            </OrderRow>
            <OrderRow>
              <span>Shipping</span>
              <span>{order.shipping_amount === 0 ? 'Free' : `£${order.shipping_amount.toFixed(2)}`}</span>
            </OrderRow>
            <OrderRow style={{ fontWeight: 600, marginTop: 8, paddingTop: 8, borderTop: '1px solid var(--tg-theme-hint-color, #e5e5e5)' }}>
              <span>Total</span>
              <span>£{order.total.toFixed(2)}</span>
            </OrderRow>
          </OrderCard>

          <OrderCard>
            <OrderNumber>Delivery Address</OrderNumber>
            <div style={{ fontSize: 14, color: 'var(--tg-theme-text-color, #000000)', lineHeight: 1.5 }}>
              {order.shipping_name}<br />
              {order.shipping_address}<br />
              {order.shipping_city}, {order.shipping_country}
            </div>
          </OrderCard>

          <ContinueButton href="/tg">Continue Shopping</ContinueButton>
        </Container>
      </TelegramLayout>
    </>
  )
}

export const getServerSideProps: GetServerSideProps<OrderPageProps> = async ({ params }) => {
  const id = params?.id as string

  const { data: order } = await supabase
    .from('orders')
    .select('*')
    .eq('id', id)
    .single()

  return {
    props: {
      order: order || null,
    }
  }
}
