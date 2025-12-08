import { GetServerSideProps } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { useRouter } from 'next/router'
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

const AddButton = styled(Link, {
  padding: '12px 24px',
  backgroundColor: '#1a1a2e',
  color: '#ffffff',
  borderRadius: 8,
  textDecoration: 'none',
  fontSize: 14,
  fontWeight: 600,
  display: 'flex',
  alignItems: 'center',
  gap: 8,
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

const ProductImage = styled('div', {
  position: 'relative',
  width: 48,
  height: 48,
  borderRadius: 8,
  overflow: 'hidden',
  backgroundColor: '#f5f5f5',
})

const Badge = styled('span', {
  display: 'inline-block',
  padding: '4px 8px',
  borderRadius: 4,
  fontSize: 12,
  fontWeight: 500,
  
  variants: {
    variant: {
      active: {
        backgroundColor: '#e8f5e9',
        color: '#2e7d32',
      },
      inactive: {
        backgroundColor: '#ffebee',
        color: '#c62828',
      },
      new: {
        backgroundColor: '#e3f2fd',
        color: '#1976d2',
      }
    }
  }
})

const ActionButton = styled('button', {
  padding: '8px 12px',
  border: 'none',
  borderRadius: 4,
  cursor: 'pointer',
  fontSize: 14,
  marginRight: 8,
  
  variants: {
    variant: {
      edit: {
        backgroundColor: '#e3f2fd',
        color: '#1976d2',
      },
      delete: {
        backgroundColor: '#ffebee',
        color: '#c62828',
      }
    }
  }
})

interface Product {
  id: string
  name: string
  sku: string
  price: number
  cost_price: number
  is_active: boolean
  is_new: boolean
  category: { name: string } | null
  images: Array<{ url: string; position: number }>
  variants: Array<{ id: string }>
}

interface ProductsPageProps {
  products: Product[]
}

export default function ProductsPage({ products: initialProducts }: ProductsPageProps) {
  const router = useRouter()
  const [products, setProducts] = useState(initialProducts)
  const [deleting, setDeleting] = useState<string | null>(null)

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return
    
    setDeleting(id)
    try {
      // Delete related records first
      await supabase.from('product_images').delete().eq('product_id', id)
      await supabase.from('product_variants').delete().eq('product_id', id)
      await supabase.from('cart').delete().eq('product_id', id)
      await supabase.from('wishlist').delete().eq('product_id', id)
      
      // Delete product
      const { error } = await supabase.from('products').delete().eq('id', id)
      
      if (error) throw error
      
      setProducts(prev => prev.filter(p => p.id !== id))
    } catch (error) {
      console.error('Error deleting product:', error)
      alert('Failed to delete product')
    } finally {
      setDeleting(null)
    }
  }

  return (
    <>
      <Head>
        <title>Products | Admin Dashboard</title>
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
            <Title>Products</Title>
            <AddButton href="/admin/products/new">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="12" y1="5" x2="12" y2="19"/>
                <line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
              Add Product
            </AddButton>
          </PageHeader>

          <Section>
            <Table>
              <thead>
                <tr>
                  <Th>Image</Th>
                  <Th>Name</Th>
                  <Th>SKU</Th>
                  <Th>Category</Th>
                  <Th>Price</Th>
                  <Th>Cost</Th>
                  <Th>Variants</Th>
                  <Th>Status</Th>
                  <Th>Actions</Th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id}>
                    <Td>
                      <ProductImage>
                        {product.images[0] && (
                          <Image
                            src={product.images[0].url}
                            alt={product.name}
                            fill
                            style={{ objectFit: 'cover' }}
                          />
                        )}
                      </ProductImage>
                    </Td>
                    <Td>
                      <div style={{ fontWeight: 500 }}>{product.name}</div>
                      {product.is_new && <Badge variant="new" style={{ marginTop: 4 }}>NEW</Badge>}
                    </Td>
                    <Td>{product.sku}</Td>
                    <Td>{product.category?.name || '-'}</Td>
                    <Td>£{product.price.toFixed(2)}</Td>
                    <Td>£{(product.cost_price || 0).toFixed(2)}</Td>
                    <Td>{product.variants.length}</Td>
                    <Td>
                      <Badge variant={product.is_active ? 'active' : 'inactive'}>
                        {product.is_active ? 'Active' : 'Inactive'}
                      </Badge>
                    </Td>
                    <Td>
                      <ActionButton
                        variant="edit"
                        onClick={() => router.push(`/admin/products/${product.id}`)}
                      >
                        Edit
                      </ActionButton>
                      <ActionButton
                        variant="delete"
                        onClick={() => handleDelete(product.id)}
                        disabled={deleting === product.id}
                      >
                        {deleting === product.id ? '...' : 'Delete'}
                      </ActionButton>
                    </Td>
                  </tr>
                ))}
                {products.length === 0 && (
                  <tr>
                    <Td colSpan={9} style={{ textAlign: 'center', color: '#666666', padding: 48 }}>
                      No products yet. <Link href="/admin/products/new" style={{ color: '#1976d2' }}>Add your first product</Link>
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

export const getServerSideProps: GetServerSideProps<ProductsPageProps> = async () => {
  const { data: products } = await supabase
    .from('products')
    .select(`
      id,
      name,
      sku,
      price,
      cost_price,
      is_active,
      is_new,
      category:categories(name),
      images:product_images(url, position),
      variants:product_variants(id)
    `)
    .order('created_at', { ascending: false })

  const mappedProducts = (products || []).map((p: any) => ({
    id: p.id,
    name: p.name,
    sku: p.sku,
    price: p.price,
    cost_price: p.cost_price,
    is_active: p.is_active,
    is_new: p.is_new,
    category: Array.isArray(p.category) ? p.category[0] || null : p.category,
    images: (p.images || []).sort((a: any, b: any) => a.position - b.position),
    variants: p.variants || [],
  }))

  return {
    props: {
      products: mappedProducts,
    }
  }
}
