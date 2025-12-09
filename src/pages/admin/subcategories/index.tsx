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
  '&:hover': { opacity: 1 },
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

const FilterBar = styled('div', {
  display: 'flex',
  gap: 16,
  marginBottom: 20,
  alignItems: 'center',
})

const FilterSelect = styled('select', {
  padding: '10px 16px',
  border: '1px solid #ddd',
  borderRadius: 8,
  fontSize: 14,
  backgroundColor: '#fff',
  cursor: 'pointer',
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

const CategoryBadge = styled('span', {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 6,
  padding: '4px 12px',
  backgroundColor: '#e8f5e9',
  borderRadius: 100,
  fontSize: 12,
  fontWeight: 500,
  color: '#2e7d32',
})

const SubcategoryImage = styled('div', {
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

const EmptyState = styled('div', {
  textAlign: 'center',
  padding: 48,
  color: '#666666',
})

interface Category {
  id: string
  name: string
}

interface Subcategory {
  id: string
  name: string
  slug: string
  image_url: string | null
  sort_order: number
  category_id: string
  category: Category
  productCount: number
}

interface SubcategoriesPageProps {
  subcategories: Subcategory[]
  categories: Category[]
}

export default function SubcategoriesPage({ 
  subcategories: initialSubcategories, 
  categories 
}: SubcategoriesPageProps) {
  const router = useRouter()
  const [subcategories, setSubcategories] = useState(initialSubcategories)
  const [deleting, setDeleting] = useState<string | null>(null)
  const [filterCategory, setFilterCategory] = useState<string>('all')

  const filteredSubcategories = filterCategory === 'all'
    ? subcategories
    : subcategories.filter(s => s.category_id === filterCategory)

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this subcategory? Products in this subcategory will be unassigned.')) return
    
    setDeleting(id)
    try {
      // Unassign products
      await supabase.from('products').update({ subcategory_id: null }).eq('subcategory_id', id)
      
      // Delete subcategory
      const { error } = await supabase.from('subcategories').delete().eq('id', id)
      
      if (error) throw error
      
      setSubcategories(prev => prev.filter(s => s.id !== id))
    } catch (error) {
      console.error('Error deleting subcategory:', error)
      alert('Failed to delete subcategory')
    } finally {
      setDeleting(null)
    }
  }

  return (
    <>
      <Head>
        <title>Subcategories | Admin Dashboard</title>
      </Head>
      
      <Container>
        <Header>
          <Logo>Admin Dashboard</Logo>
          <Nav>
            <NavLink href="/admin">Dashboard</NavLink>
            <NavLink href="/admin/products">Products</NavLink>
            <NavLink href="/admin/categories">Categories</NavLink>
            <NavLink href="/admin/subcategories" style={{ opacity: 1 }}>Subcategories</NavLink>
            <NavLink href="/admin/orders">Orders</NavLink>
          </Nav>
        </Header>

        <Main>
          <PageHeader>
            <Title>Subcategories</Title>
            <AddButton href="/admin/subcategories/new">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="12" y1="5" x2="12" y2="19"/>
                <line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
              Add Subcategory
            </AddButton>
          </PageHeader>

          <Section>
            <FilterBar>
              <label style={{ fontWeight: 500, fontSize: 14 }}>Filter by Category:</label>
              <FilterSelect 
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
              >
                <option value="all">All Categories</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </FilterSelect>
              <span style={{ color: '#666', fontSize: 14 }}>
                Showing {filteredSubcategories.length} subcategories
              </span>
            </FilterBar>

            <Table>
              <thead>
                <tr>
                  <Th>Image</Th>
                  <Th>Name</Th>
                  <Th>Slug</Th>
                  <Th>Category</Th>
                  <Th>Products</Th>
                  <Th>Order</Th>
                  <Th>Actions</Th>
                </tr>
              </thead>
              <tbody>
                {filteredSubcategories.map((subcategory) => (
                  <tr key={subcategory.id}>
                    <Td>
                      <SubcategoryImage>
                        {subcategory.image_url && (
                          <Image
                            src={subcategory.image_url}
                            alt={subcategory.name}
                            fill
                            style={{ objectFit: 'cover' }}
                          />
                        )}
                      </SubcategoryImage>
                    </Td>
                    <Td style={{ fontWeight: 500 }}>{subcategory.name}</Td>
                    <Td style={{ color: '#666666' }}>{subcategory.slug}</Td>
                    <Td>
                      <CategoryBadge>
                        {subcategory.category?.name || 'Unknown'}
                      </CategoryBadge>
                    </Td>
                    <Td>{subcategory.productCount}</Td>
                    <Td>{subcategory.sort_order}</Td>
                    <Td>
                      <ActionButton
                        variant="edit"
                        onClick={() => router.push(`/admin/subcategories/${subcategory.id}`)}
                      >
                        Edit
                      </ActionButton>
                      <ActionButton
                        variant="delete"
                        onClick={() => handleDelete(subcategory.id)}
                        disabled={deleting === subcategory.id}
                      >
                        {deleting === subcategory.id ? '...' : 'Delete'}
                      </ActionButton>
                    </Td>
                  </tr>
                ))}
                {filteredSubcategories.length === 0 && (
                  <tr>
                    <Td colSpan={7}>
                      <EmptyState>
                        No subcategories yet. <Link href="/admin/subcategories/new" style={{ color: '#1976d2' }}>Add your first subcategory</Link>
                      </EmptyState>
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

export const getServerSideProps: GetServerSideProps<SubcategoriesPageProps> = async () => {
  // Get all categories
  const { data: categories } = await supabase
    .from('categories')
    .select('id, name')
    .order('sort_order')

  // Get all subcategories with their parent category
  const { data: subcategories } = await supabase
    .from('subcategories')
    .select(`
      *,
      category:categories(id, name)
    `)
    .order('sort_order')

  // Get product counts for each subcategory
  const subcategoriesWithCounts = await Promise.all(
    (subcategories || []).map(async (sub: any) => {
      const { count } = await supabase
        .from('products')
        .select('id', { count: 'exact' })
        .eq('subcategory_id', sub.id)
      
      return {
        ...sub,
        productCount: count || 0,
      }
    })
  )

  return {
    props: {
      subcategories: subcategoriesWithCounts,
      categories: categories || [],
    }
  }
}
