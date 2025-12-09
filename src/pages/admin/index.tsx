import { GetServerSideProps } from 'next'
import Head from 'next/head'
import Link from 'next/link'
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
  transition: 'opacity 0.2s',
  
  '&:hover': {
    opacity: 1,
  }
})

const Main = styled('main', {
  padding: 24,
  maxWidth: 1200,
  margin: '0 auto',
})

const StatsGrid = styled('div', {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
  gap: 16,
  marginBottom: 32,
})

const StatCard = styled('div', {
  backgroundColor: '#ffffff',
  borderRadius: 12,
  padding: 24,
  boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
})

const StatLabel = styled('div', {
  fontSize: 14,
  color: '#666666',
  marginBottom: 8,
})

const StatValue = styled('div', {
  fontSize: 32,
  fontWeight: 700,
  color: '#1a1a2e',
})

const QuickActions = styled('div', {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
  gap: 16,
  marginBottom: 32,
})

const ActionCard = styled(Link, {
  backgroundColor: '#ffffff',
  borderRadius: 12,
  padding: 24,
  boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
  textDecoration: 'none',
  color: '#1a1a2e',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: 12,
  transition: 'transform 0.2s, box-shadow 0.2s',
  
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
  }
})

const ActionIcon = styled('div', {
  width: 48,
  height: 48,
  borderRadius: 12,
  backgroundColor: '#f0f0f5',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: '#1a1a2e',
})

const ActionTitle = styled('span', {
  fontSize: 16,
  fontWeight: 600,
})

const Section = styled('section', {
  backgroundColor: '#ffffff',
  borderRadius: 12,
  padding: 24,
  boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
  marginBottom: 24,
})

const SectionTitle = styled('h2', {
  fontSize: 18,
  fontWeight: 600,
  margin: 0,
  marginBottom: 16,
  color: '#1a1a2e',
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

interface AdminDashboardProps {
  stats: {
    totalProducts: number
    totalCategories: number
    totalOrders: number
    totalRevenue: number
  }
  recentOrders: Array<{
    id: string
    order_number: string | null
    status: string
    total: number
    created_at: string
  }>
}

export default function AdminDashboard({ stats, recentOrders }: AdminDashboardProps) {
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
        <title>Admin Dashboard | Source The Sauce</title>
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
          <StatsGrid>
            <StatCard>
              <StatLabel>Total Products</StatLabel>
              <StatValue>{stats.totalProducts}</StatValue>
            </StatCard>
            <StatCard>
              <StatLabel>Categories</StatLabel>
              <StatValue>{stats.totalCategories}</StatValue>
            </StatCard>
            <StatCard>
              <StatLabel>Total Orders</StatLabel>
              <StatValue>{stats.totalOrders}</StatValue>
            </StatCard>
            <StatCard>
              <StatLabel>Revenue</StatLabel>
              <StatValue>£{stats.totalRevenue.toFixed(2)}</StatValue>
            </StatCard>
          </StatsGrid>

          <QuickActions>
            <ActionCard href="/admin/products/new">
              <ActionIcon>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="12" y1="5" x2="12" y2="19"/>
                  <line x1="5" y1="12" x2="19" y2="12"/>
                </svg>
              </ActionIcon>
              <ActionTitle>Add Product</ActionTitle>
            </ActionCard>
            <ActionCard href="/admin/categories/new">
              <ActionIcon>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="3" width="7" height="7"/>
                  <rect x="14" y="3" width="7" height="7"/>
                  <rect x="14" y="14" width="7" height="7"/>
                  <rect x="3" y="14" width="7" height="7"/>
                </svg>
              </ActionIcon>
              <ActionTitle>Add Category</ActionTitle>
            </ActionCard>
            <ActionCard href="/admin/subcategories">
              <ActionIcon>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
                  <line x1="12" y1="11" x2="12" y2="17"/>
                  <line x1="9" y1="14" x2="15" y2="14"/>
                </svg>
              </ActionIcon>
              <ActionTitle>Subcategories</ActionTitle>
            </ActionCard>
            <ActionCard href="/admin/orders">
              <ActionIcon>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
                  <line x1="3" y1="6" x2="21" y2="6"/>
                  <path d="M16 10a4 4 0 0 1-8 0"/>
                </svg>
              </ActionIcon>
              <ActionTitle>View Orders</ActionTitle>
            </ActionCard>
            <ActionCard href="/admin/home-content">
              <ActionIcon>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                  <line x1="3" y1="9" x2="21" y2="9"/>
                  <line x1="9" y1="21" x2="9" y2="9"/>
                </svg>
              </ActionIcon>
              <ActionTitle>Home Content</ActionTitle>
            </ActionCard>
          </QuickActions>

          <Section>
            <SectionTitle>Recent Orders</SectionTitle>
            <Table>
              <thead>
                <tr>
                  <Th>Order ID</Th>
                  <Th>Date</Th>
                  <Th>Status</Th>
                  <Th>Amount</Th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order.id}>
                    <Td>
                      <Link href={`/admin/orders/${order.id}`} style={{ color: '#1a1a2e', fontWeight: 500 }}>
                        {order.order_number || order.id.slice(0, 8).toUpperCase()}
                      </Link>
                    </Td>
                    <Td>{new Date(order.created_at).toLocaleDateString()}</Td>
                    <Td>
                      <StatusBadge status={order.status as any}>{statusMap[order.status]}</StatusBadge>
                    </Td>
                    <Td>£{order.total.toFixed(2)}</Td>
                  </tr>
                ))}
                {recentOrders.length === 0 && (
                  <tr>
                    <Td colSpan={4} style={{ textAlign: 'center', color: '#666666' }}>
                      No orders yet
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

export const getServerSideProps: GetServerSideProps<AdminDashboardProps> = async () => {
  // Get stats
  const [products, categories, orders] = await Promise.all([
    supabase.from('products').select('id', { count: 'exact' }),
    supabase.from('categories').select('id', { count: 'exact' }),
    supabase.from('orders').select('id, total'),
  ])

  const totalRevenue = orders.data?.reduce((sum: number, o: any) => sum + (o.total || 0), 0) || 0

  // Get recent orders
  const { data: recentOrders } = await supabase
    .from('orders')
    .select('id, order_number, status, total, created_at')
    .order('created_at', { ascending: false })
    .limit(10)

  return {
    props: {
      stats: {
        totalProducts: products.count || 0,
        totalCategories: categories.count || 0,
        totalOrders: orders.data?.length || 0,
        totalRevenue,
      },
      recentOrders: recentOrders || [],
    }
  }
}
