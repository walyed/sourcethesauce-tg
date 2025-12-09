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

const CategoryImage = styled('div', {
  position: 'relative',
  width: 48,
  height: 48,
  borderRadius: 8,
  overflow: 'hidden',
  backgroundColor: '#f5f5f5',
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

interface Category {
  id: string
  name: string
  slug: string
  image_url: string | null
  sort_order: number
  productCount: number
}

interface CategoriesPageProps {
  categories: Category[]
}

export default function CategoriesPage({ categories: initialCategories }: CategoriesPageProps) {
  const router = useRouter()
  const [categories, setCategories] = useState(initialCategories)
  const [deleting, setDeleting] = useState<string | null>(null)

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this category? Products in this category will be unassigned.')) return
    
    setDeleting(id)
    try {
      // Unassign products
      await supabase.from('products').update({ category_id: null }).eq('category_id', id)
      
      // Delete subcategories
      await supabase.from('subcategories').delete().eq('category_id', id)
      
      // Delete category
      const { error } = await supabase.from('categories').delete().eq('id', id)
      
      if (error) throw error
      
      setCategories(prev => prev.filter(c => c.id !== id))
    } catch (error) {
      console.error('Error deleting category:', error)
      alert('Failed to delete category')
    } finally {
      setDeleting(null)
    }
  }

  return (
    <>
      <Head>
        <title>Categories | Admin Dashboard</title>
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
            <Title>Categories</Title>
            <AddButton href="/admin/categories/new">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="12" y1="5" x2="12" y2="19"/>
                <line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
              Add Category
            </AddButton>
          </PageHeader>

          <Section>
            <Table>
              <thead>
                <tr>
                  <Th>Image</Th>
                  <Th>Name</Th>
                  <Th>Slug</Th>
                  <Th>Products</Th>
                  <Th>Order</Th>
                  <Th>Actions</Th>
                </tr>
              </thead>
              <tbody>
                {categories.map((category) => (
                  <tr key={category.id}>
                    <Td>
                      <CategoryImage>
                        {category.image_url && (
                          <Image
                            src={category.image_url}
                            alt={category.name}
                            fill
                            style={{ objectFit: 'cover' }}
                          />
                        )}
                      </CategoryImage>
                    </Td>
                    <Td style={{ fontWeight: 500 }}>{category.name}</Td>
                    <Td style={{ color: '#666666' }}>{category.slug}</Td>
                    <Td>{category.productCount}</Td>
                    <Td>{category.sort_order}</Td>
                    <Td>
                      <ActionButton
                        variant="edit"
                        onClick={() => router.push(`/admin/categories/${category.id}`)}
                      >
                        Edit
                      </ActionButton>
                      <ActionButton
                        variant="delete"
                        onClick={() => handleDelete(category.id)}
                        disabled={deleting === category.id}
                      >
                        {deleting === category.id ? '...' : 'Delete'}
                      </ActionButton>
                    </Td>
                  </tr>
                ))}
                {categories.length === 0 && (
                  <tr>
                    <Td colSpan={6} style={{ textAlign: 'center', color: '#666666', padding: 48 }}>
                      No categories yet. <Link href="/admin/categories/new" style={{ color: '#1976d2' }}>Add your first category</Link>
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

export const getServerSideProps: GetServerSideProps<CategoriesPageProps> = async () => {
  const { data: categories } = await supabase
    .from('categories')
    .select('*')
    .order('sort_order')

  // Get product counts
  const categoriesWithCounts = await Promise.all(
    (categories || []).map(async (cat: any) => {
      const { count } = await supabase
        .from('products')
        .select('id', { count: 'exact' })
        .eq('category_id', cat.id)
      
      return {
        ...cat,
        productCount: count || 0,
      }
    })
  )

  return {
    props: {
      categories: categoriesWithCounts,
    }
  }
}
