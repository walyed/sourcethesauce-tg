import { GetServerSideProps } from 'next'
import Head from 'next/head'
import Link from 'next/link'
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
  maxWidth: 1200,
  margin: '0 auto',
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

const FilterTabs = styled('div', {
  display: 'flex',
  gap: 8,
})

const FilterTab = styled('button', {
  padding: '8px 16px',
  border: 'none',
  borderRadius: 8,
  cursor: 'pointer',
  fontSize: 14,
  fontWeight: 500,
  backgroundColor: '#ffffff',
  color: '#666666',
  position: 'relative',
  
  variants: {
    active: {
      true: {
        backgroundColor: '#1a1a2e',
        color: '#ffffff',
      }
    }
  }
})

const Badge = styled('span', {
  position: 'absolute',
  top: -4,
  right: -4,
  backgroundColor: '#ff3b30',
  color: '#ffffff',
  fontSize: 11,
  fontWeight: 700,
  padding: '2px 6px',
  borderRadius: 100,
  minWidth: 18,
  textAlign: 'center',
})

const Section = styled('section', {
  backgroundColor: '#ffffff',
  borderRadius: 12,
  padding: 24,
  boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
})

const Table = styled('table', {
  width: '100%',
  borderCollapse: 'collapse',
})

const Th = styled('th', {
  textAlign: 'left',
  padding: '12px 16px',
  borderBottom: '2px solid #f0f0f5',
  fontSize: 14,
  fontWeight: 600,
  color: '#666666',
})

const Td = styled('td', {
  padding: '12px 16px',
  borderBottom: '1px solid #f0f0f5',
  fontSize: 14,
  verticalAlign: 'middle',
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

const StatusSelect = styled('select', {
  padding: '6px 12px',
  borderRadius: 6,
  border: '1px solid #e0e0e0',
  fontSize: 13,
  backgroundColor: '#ffffff',
  cursor: 'pointer',
})

interface Order {
  id: string
  order_number: string | null
  status: string
  total: number
  subtotal: number
  shipping_amount: number
  shipping_name: string | null
  shipping_phone: string | null
  shipping_city: string | null
  created_at: string
  items: Array<{
    qty: number
    product_name: string
  }>
}

interface OrdersPageProps {
  orders: Order[]
}

export default function OrdersPage({ orders: initialOrders }: OrdersPageProps) {
  const [orders, setOrders] = useState(initialOrders)
  const [filter, setFilter] = useState<string>('all')
  const [updatingOrder, setUpdatingOrder] = useState<string | null>(null)

  const statusMap: Record<string, string> = {
    pending: 'Pending',
    confirmed: 'Confirmed',
    shipped: 'Shipped',
    delivered: 'Delivered',
    cancelled: 'Cancelled',
  }

  const filteredOrders = filter === 'all' 
    ? orders 
    : orders.filter(o => o.status === filter)

  const newOrdersCount = orders.filter(o => o.status === 'pending').length

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    setUpdatingOrder(orderId)
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status: newStatus })
        .eq('id', orderId)

      if (error) throw error

      setOrders(prev => prev.map(o => 
        o.id === orderId ? { ...o, status: newStatus } : o
      ))
    } catch (error) {
      console.error('Error updating order:', error)
      alert('Failed to update order status')
    } finally {
      setUpdatingOrder(null)
    }
  }

  return (
    <>
      <Head>
        <title>Orders | Admin Dashboard</title>
      </Head>
      
      <Container>
        <Header>
          <Logo>Admin Dashboard</Logo>
          <Nav>
            <NavLink href="/admin">Dashboard</NavLink>
            <NavLink href="/admin/products">Products</NavLink>
            <NavLink href="/admin/categories">Categories</NavLink>
            <NavLink href="/admin/orders">Orders</NavLink>
          </Nav>
        </Header>

        <Main>
          <PageHeader>
            <Title>Orders ({filteredOrders.length})</Title>
            <FilterTabs>
              <FilterTab active={filter === 'all'} onClick={() => setFilter('all')}>
                All
              </FilterTab>
              <FilterTab active={filter === 'pending'} onClick={() => setFilter('pending')}>
                New Orders
                {newOrdersCount > 0 && <Badge>{newOrdersCount}</Badge>}
              </FilterTab>
              <FilterTab active={filter === 'confirmed'} onClick={() => setFilter('confirmed')}>
                Confirmed
              </FilterTab>
              <FilterTab active={filter === 'shipped'} onClick={() => setFilter('shipped')}>
                Shipped
              </FilterTab>
              <FilterTab active={filter === 'delivered'} onClick={() => setFilter('delivered')}>
                Completed
              </FilterTab>
            </FilterTabs>
          </PageHeader>

          <Section>
            <Table>
              <thead>
                <tr>
                  <Th>Order ID</Th>
                  <Th>Date</Th>
                  <Th>Customer</Th>
                  <Th>Items</Th>
                  <Th>Total</Th>
                  <Th>Status</Th>
                  <Th>Actions</Th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => (
                  <tr key={order.id}>
                    <Td>
                      <Link href={`/admin/orders/${order.id}`} style={{ color: '#1a1a2e', fontWeight: 500 }}>
                        {order.order_number || order.id.slice(0, 8).toUpperCase()}
                      </Link>
                    </Td>
                    <Td>{new Date(order.created_at).toLocaleDateString()}</Td>
                    <Td>
                      <div style={{ fontWeight: 500 }}>{order.shipping_name || 'N/A'}</div>
                      <div style={{ color: '#666666', fontSize: 12 }}>{order.shipping_phone || ''}</div>
                    </Td>
                    <Td>
                      {order.items?.length || 0} item{(order.items?.length || 0) !== 1 ? 's' : ''}
                    </Td>
                    <Td>£{order.total.toFixed(2)}</Td>
                    <Td>
                      <StatusBadge status={order.status as any}>
                        {statusMap[order.status]}
                      </StatusBadge>
                    </Td>
                    <Td>
                      <StatusSelect
                        value={order.status}
                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                        disabled={updatingOrder === order.id}
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </StatusSelect>
                    </Td>
                  </tr>
                ))}
                {filteredOrders.length === 0 && (
                  <tr>
                    <Td colSpan={7} style={{ textAlign: 'center', color: '#666666', padding: 48 }}>
                      No orders found
                    </Td>
                  </tr>
                )}
              </tbody>
            </Table>
          </Section>
        </Main>
      </Container>
    </>
  )
}

export const getServerSideProps: GetServerSideProps<OrdersPageProps> = async () => {
  console.log('Fetching orders from Supabase...')
  
  const { data: orders, error } = await supabase
    .from('orders')
    .select(`
      *,
      items:order_items(
        qty,
        product_name
      )
    `)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching orders:', error)
  }
  
  console.log('Orders fetched:', orders?.length || 0, 'orders')

  return {
    props: {
      orders: orders || [],
    }
  }
}
