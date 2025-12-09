import { GetServerSideProps } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { styled } from 'stitches.config'
import { supabase } from '@/lib/supabase'

const Container = styled('div', {
  minHeight: '100vh',
  backgroundColor: '#f5f5f5',
})

const Header = styled('header', {
  backgroundColor: '#1a1a2e',
  color: '#ffffff',
  padding: '16px 24px',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
})

const Logo = styled('h1', {
  fontSize: 20,
  fontWeight: 700,
  margin: 0,
})

const Nav = styled('nav', {
  display: 'flex',
  gap: 24,
})

const NavLink = styled(Link, {
  color: '#ffffff',
  textDecoration: 'none',
  opacity: 0.8,
})

const Main = styled('main', {
  padding: 24,
  maxWidth: 800,
  margin: '0 auto',
})

const BackLink = styled(Link, {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 8,
  color: '#666666',
  textDecoration: 'none',
  marginBottom: 24,
  fontSize: 14,
})

const PageHeader = styled('div', {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: 24,
})

const Title = styled('h2', {
  fontSize: 24,
  fontWeight: 700,
  margin: 0,
  color: '#1a1a2e',
})

const StatusBadge = styled('span', {
  display: 'inline-block',
  padding: '6px 16px',
  borderRadius: 100,
  fontSize: 14,
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

const Section = styled('section', {
  backgroundColor: '#ffffff',
  borderRadius: 12,
  padding: 24,
  boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
  marginBottom: 24,
})

const SectionTitle = styled('h3', {
  fontSize: 16,
  fontWeight: 600,
  margin: 0,
  marginBottom: 16,
  color: '#1a1a2e',
})

const InfoRow = styled('div', {
  display: 'flex',
  justifyContent: 'space-between',
  padding: '12px 0',
  borderBottom: '1px solid #f0f0f5',
  
  '&:last-child': {
    borderBottom: 'none',
  }
})

const InfoLabel = styled('span', {
  color: '#666666',
  fontSize: 14,
})

const InfoValue = styled('span', {
  color: '#1a1a2e',
  fontSize: 14,
  fontWeight: 500,
})

const ItemRow = styled('div', {
  display: 'flex',
  gap: 16,
  padding: '16px 0',
  borderBottom: '1px solid #f0f0f5',
  
  '&:last-child': {
    borderBottom: 'none',
  }
})

const ItemImage = styled('div', {
  position: 'relative',
  width: 64,
  height: 80,
  borderRadius: 8,
  overflow: 'hidden',
  backgroundColor: '#f5f5f5',
  flexShrink: 0,
})

const ItemDetails = styled('div', {
  flex: 1,
})

const ItemName = styled('div', {
  fontWeight: 500,
  marginBottom: 4,
})

const ItemVariant = styled('div', {
  fontSize: 12,
  color: '#666666',
  marginBottom: 4,
})

const ItemPrice = styled('div', {
  fontSize: 14,
})

const StatusSelect = styled('select', {
  padding: '8px 16px',
  borderRadius: 8,
  border: '1px solid #e0e0e0',
  fontSize: 14,
  backgroundColor: '#ffffff',
  cursor: 'pointer',
})

const UpdateButton = styled('button', {
  padding: '8px 24px',
  backgroundColor: '#1a1a2e',
  color: '#ffffff',
  border: 'none',
  borderRadius: 8,
  cursor: 'pointer',
  fontSize: 14,
  fontWeight: 500,
  marginLeft: 12,
  
  '&:disabled': {
    opacity: 0.6,
    cursor: 'not-allowed',
  }
})

const CompleteOrderButton = styled('button', {
  width: '100%',
  padding: '16px 24px',
  backgroundColor: '#2e7d32',
  color: '#ffffff',
  border: 'none',
  borderRadius: 8,
  cursor: 'pointer',
  fontSize: 16,
  fontWeight: 600,
  
  '&:disabled': {
    opacity: 0.6,
    cursor: 'not-allowed',
  }
})

const WarningNote = styled('div', {
  padding: '12px 16px',
  backgroundColor: '#fff3e0',
  border: '1px solid #ffcc80',
  borderRadius: 8,
  fontSize: 14,
  color: '#e65100',
  marginBottom: 16,
  display: 'flex',
  alignItems: 'flex-start',
  gap: 10,
})

const PaymentMethod = styled('div', {
  display: 'inline-block',
  padding: '6px 12px',
  backgroundColor: '#e8f5e9',
  color: '#2e7d32',
  borderRadius: 6,
  fontSize: 13,
  fontWeight: 600,
})

interface OrderItem {
  id: string
  qty: number
  price: number
  total: number
  product_name: string
  product_image: string | null
  colour: string | null
  size: string | null
}

interface OrderDetailProps {
  order: {
    id: string
    order_number: string | null
    status: string
    total: number
    subtotal: number
    shipping_amount: number
    shipping_name: string | null
    shipping_phone: string | null
    shipping_address: string | null
    shipping_city: string | null
    shipping_country: string | null
    notes?: string
    created_at: string
    items: OrderItem[]
  } | null
}

export default function OrderDetailPage({ order }: OrderDetailProps) {
  const [status, setStatus] = useState(order?.status || 'pending')
  const [isUpdating, setIsUpdating] = useState(false)
  const [isCompleting, setIsCompleting] = useState(false)
  const router = useRouter()

  const statusMap: Record<string, string> = {
    pending: 'Pending',
    confirmed: 'Confirmed',
    shipped: 'Shipped',
    delivered: 'Delivered',
    cancelled: 'Cancelled',
  }

  const handleUpdateStatus = async () => {
    if (!order) return
    
    setIsUpdating(true)
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status })
        .eq('id', order.id)

      if (error) throw error
      alert('Status updated successfully')
    } catch (error) {
      console.error('Error updating status:', error)
      alert('Failed to update status')
    } finally {
      setIsUpdating(false)
    }
  }

  const handleCompleteOrder = async () => {
    if (!order) return
    
    const confirmed = window.confirm(
      '⚠️ Are you sure you want to mark this order as completed?\n\nMake sure the order has been delivered to the customer before clicking OK.'
    )
    
    if (!confirmed) return
    
    setIsCompleting(true)
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status: 'delivered' })
        .eq('id', order.id)

      if (error) throw error
      
      alert('Order marked as completed!')
      router.push('/admin/orders')
    } catch (error) {
      console.error('Error completing order:', error)
      alert('Failed to complete order')
    } finally {
      setIsCompleting(false)
    }
  }

  if (!order) {
    return (
      <Container>
        <Header>
          <Logo>Admin Dashboard</Logo>
        </Header>
        <Main>
          <Title>Order not found</Title>
          <Link href="/admin/orders">Back to Orders</Link>
        </Main>
      </Container>
    )
  }

  return (
    <>
      <Head>
        <title>Order {order.id.slice(0, 8).toUpperCase()} | Admin Dashboard</title>
      </Head>
      
      <Container>
        <Header>
          <Logo>Admin Dashboard</Logo>
          <Nav>
            <NavLink href="/admin">Dashboard</NavLink>
            <NavLink href="/admin/products">Products</NavLink>
            <NavLink href="/admin/categories">Categories</NavLink>
            <NavLink href="/admin/subcategories">Subcategories</NavLink>
            <NavLink href="/admin/orders">Orders</NavLink>
          </Nav>
        </Header>

        <Main>
          <BackLink href="/admin/orders">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5"/>
              <path d="M12 19l-7-7 7-7"/>
            </svg>
            Back to Orders
          </BackLink>

          <PageHeader>
            <Title>Order #{order.order_number || order.id.slice(0, 8).toUpperCase()}</Title>
            <StatusBadge status={order.status as any}>{statusMap[order.status]}</StatusBadge>
          </PageHeader>

          <Section>
            <SectionTitle>Update Status</SectionTitle>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <StatusSelect value={status} onChange={(e) => setStatus(e.target.value)}>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </StatusSelect>
              <UpdateButton onClick={handleUpdateStatus} disabled={isUpdating || status === order.status}>
                {isUpdating ? 'Updating...' : 'Update Status'}
              </UpdateButton>
            </div>
          </Section>

          {order.status !== 'delivered' && order.status !== 'cancelled' && (
            <Section>
              <SectionTitle>Complete Order</SectionTitle>
              <WarningNote>
                <span style={{ fontSize: 18 }}>⚠️</span>
                <div>
                  <strong>Important:</strong> Make sure the order has been delivered to the customer and payment (Cash on Delivery) has been collected before marking this order as complete. This action cannot be undone.
                </div>
              </WarningNote>
              <CompleteOrderButton onClick={handleCompleteOrder} disabled={isCompleting}>
                {isCompleting ? 'Completing...' : '✓ Mark Order as Completed'}
              </CompleteOrderButton>
            </Section>
          )}

          <Section>
            <SectionTitle>Order Details</SectionTitle>
            <InfoRow>
              <InfoLabel>Order Date</InfoLabel>
              <InfoValue>{new Date(order.created_at).toLocaleString()}</InfoValue>
            </InfoRow>
            <InfoRow>
              <InfoLabel>Payment Method</InfoLabel>
              <InfoValue><PaymentMethod>💵 Cash on Delivery</PaymentMethod></InfoValue>
            </InfoRow>
            <InfoRow>
              <InfoLabel>Subtotal</InfoLabel>
              <InfoValue>£{order.subtotal.toFixed(2)}</InfoValue>
            </InfoRow>
            <InfoRow>
              <InfoLabel>Shipping</InfoLabel>
              <InfoValue>{order.shipping_amount === 0 ? 'Free' : `£${order.shipping_amount.toFixed(2)}`}</InfoValue>
            </InfoRow>
            <InfoRow>
              <InfoLabel>Total</InfoLabel>
              <InfoValue style={{ fontSize: 18, fontWeight: 700 }}>£{order.total.toFixed(2)}</InfoValue>
            </InfoRow>
          </Section>

          <Section>
            <SectionTitle>Customer & Shipping</SectionTitle>
            <InfoRow>
              <InfoLabel>Name</InfoLabel>
              <InfoValue>{order.shipping_name || 'N/A'}</InfoValue>
            </InfoRow>
            <InfoRow>
              <InfoLabel>Phone</InfoLabel>
              <InfoValue>{order.shipping_phone || 'N/A'}</InfoValue>
            </InfoRow>
            <InfoRow>
              <InfoLabel>Address</InfoLabel>
              <InfoValue>
                {order.shipping_address || 'N/A'}<br />
                {order.shipping_city}{order.shipping_country ? `, ${order.shipping_country}` : ''}
              </InfoValue>
            </InfoRow>
            {order.notes && (
              <InfoRow>
                <InfoLabel>Notes</InfoLabel>
                <InfoValue>{order.notes}</InfoValue>
              </InfoRow>
            )}
          </Section>

          <Section>
            <SectionTitle>Items ({order.items.length})</SectionTitle>
            {order.items.map((item) => (
              <ItemRow key={item.id}>
                <ItemImage>
                  {item.product_image && (
                    <Image
                      src={item.product_image}
                      alt={item.product_name}
                      fill
                      style={{ objectFit: 'cover' }}
                    />
                  )}
                </ItemImage>
                <ItemDetails>
                  <ItemName>{item.product_name}</ItemName>
                  <ItemVariant>
                    {item.colour} / {item.size} × {item.qty}
                  </ItemVariant>
                  <ItemPrice>
                    £{item.price.toFixed(2)} each
                  </ItemPrice>
                </ItemDetails>
                <div style={{ textAlign: 'right', fontWeight: 600 }}>
                  £{item.total.toFixed(2)}
                </div>
              </ItemRow>
            ))}
          </Section>
        </Main>
      </Container>
    </>
  )
}

export const getServerSideProps: GetServerSideProps<OrderDetailProps> = async ({ params }) => {
  const id = params?.id as string

  const { data: order } = await supabase
    .from('orders')
    .select(`
      *,
      items:order_items(
        id,
        qty,
        price,
        total,
        product_name,
        product_image,
        colour,
        size
      )
    `)
    .eq('id', id)
    .single()

  return {
    props: {
      order: order || null,
    }
  }
}
