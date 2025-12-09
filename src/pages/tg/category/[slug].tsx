import { GetServerSideProps } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { styled } from 'stitches.config'
import { TelegramLayout, ProductCard } from '@/components/telegram'
import { supabase } from '@/lib/supabase'

const Header = styled('header', {
  padding: '16px',
  backgroundColor: 'var(--tg-theme-bg-color, #0f172a)',
  position: 'sticky',
  top: 0,
  zIndex: 100,
  display: 'flex',
  alignItems: 'center',
  gap: 12,
  borderBottom: '1px solid rgba(148,163,184,0.2)',
})

const BackButton = styled('button', {
  padding: 8,
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  color: 'var(--tg-theme-text-color, #e5e7eb)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
})

const Title = styled('h1', {
  fontSize: 20,
  fontWeight: 600,
  margin: 0,
  color: 'var(--tg-theme-text-color, #e5e7eb)',
  flex: 1,
})

const ProductCount = styled('span', {
  fontSize: 14,
  color: 'var(--tg-theme-hint-color, #94a3b8)',
})

const SubcategoriesSection = styled('div', {
  padding: '16px',
  backgroundColor: 'rgba(15,23,42,0.6)',
  borderBottom: '1px solid rgba(148,163,184,0.15)',
})

const SectionTitle = styled('h2', {
  fontSize: 14,
  fontWeight: 600,
  color: '#94a3b8',
  margin: '0 0 12px',
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
})

const SubcategoryList = styled('div', {
  display: 'flex',
  gap: 10,
  overflowX: 'auto',
  paddingBottom: 4,
  '&::-webkit-scrollbar': { display: 'none' },
})

const SubcategoryCard = styled(Link, {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: 8,
  textDecoration: 'none',
  minWidth: 80,
  padding: '8px 4px',
  borderRadius: 12,
  transition: 'background 0.15s',
  '&:active': {
    background: 'rgba(148,163,184,0.1)',
  },
})

const SubcategoryImage = styled('div', {
  width: 60,
  height: 60,
  borderRadius: 12,
  overflow: 'hidden',
  backgroundColor: 'rgba(148,163,184,0.1)',
  position: 'relative',
  border: '1px solid rgba(148,163,184,0.2)',
})

const SubcategoryName = styled('span', {
  fontSize: 12,
  fontWeight: 500,
  color: '#e5e7eb',
  textAlign: 'center',
  maxWidth: 80,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
})

const SubcategoryCount = styled('span', {
  fontSize: 10,
  color: '#94a3b8',
})

const Grid = styled('div', {
  display: 'grid',
  gridTemplateColumns: 'repeat(2, 1fr)',
  gap: 12,
  padding: '16px',
})

const EmptyState = styled('div', {
  textAlign: 'center',
  padding: '48px 16px',
  color: 'var(--tg-theme-hint-color, #94a3b8)',
})

interface Subcategory {
  id: string
  name: string
  slug: string
  image_url: string | null
  product_count: number
}

interface CategoryPageProps {
  category: {
    id: string
    name: string
    slug: string
  } | null
  subcategories: Subcategory[]
  products: Array<{
    id: string
    sku: string
    name: string
    price: number
    is_new: boolean
    images: string[]
  }>
}

export default function CategoryPage({ category, subcategories, products }: CategoryPageProps) {
  const router = useRouter()

  if (!category) {
    return (
      <TelegramLayout>
        <EmptyState>Category not found</EmptyState>
      </TelegramLayout>
    )
  }

  return (
    <>
      <Head>
        <title>{category.name} | Source The Sauce</title>
      </Head>
      
      <TelegramLayout>
        <Header>
          <BackButton onClick={() => router.back()}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5"/>
              <path d="M12 19l-7-7 7-7"/>
            </svg>
          </BackButton>
          <Title>{category.name}</Title>
          <ProductCount>{products.length} items</ProductCount>
        </Header>

        {/* Subcategories */}
        {subcategories.length > 0 && (
          <SubcategoriesSection>
            <SectionTitle>Browse by Type</SectionTitle>
            <SubcategoryList>
              {subcategories.map((sub) => (
                <SubcategoryCard key={sub.id} href={`/tg/subcategory/${sub.slug}`}>
                  <SubcategoryImage>
                    {sub.image_url ? (
                      <Image
                        src={sub.image_url}
                        alt={sub.name}
                        fill
                        style={{ objectFit: 'cover' }}
                      />
                    ) : (
                      <div style={{ 
                        width: '100%', 
                        height: '100%', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        fontSize: 24 
                      }}>
                        📦
                      </div>
                    )}
                  </SubcategoryImage>
                  <SubcategoryName>{sub.name}</SubcategoryName>
                  <SubcategoryCount>{sub.product_count} items</SubcategoryCount>
                </SubcategoryCard>
              ))}
            </SubcategoryList>
          </SubcategoriesSection>
        )}

        {products.length === 0 ? (
          <EmptyState>No products in this category yet</EmptyState>
        ) : (
          <Grid>
            {products.map((product) => (
              <ProductCard
                key={product.id}
                id={product.id}
                sku={product.sku}
                name={product.name}
                price={product.price}
                image={product.images[0] || 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=500&fit=crop'}
                isNew={product.is_new}
              />
            ))}
          </Grid>
        )}
      </TelegramLayout>
    </>
  )
}

export const getServerSideProps: GetServerSideProps<CategoryPageProps> = async ({ params }) => {
  const slug = params?.slug as string

  // First, try to get as a category
  const { data: category } = await supabase
    .from('categories')
    .select('*')
    .eq('slug', slug)
    .single()

  // If not found as category, check if it's a subcategory and redirect
  if (!category) {
    const { data: subcategory } = await supabase
      .from('subcategories')
      .select('slug')
      .eq('slug', slug)
      .single()
    
    if (subcategory) {
      // Redirect to subcategory page
      return {
        redirect: {
          destination: `/tg/subcategory/${slug}`,
          permanent: false,
        }
      }
    }

    return {
      props: {
        category: null,
        subcategories: [],
        products: [],
      }
    }
  }

  // Get subcategories with product counts
  const { data: subcategoriesData } = await supabase
    .from('subcategories')
    .select('*')
    .eq('category_id', category.id)
    .eq('is_active', true)
    .order('sort_order', { ascending: true })

  // Get product count for each subcategory
  const subcategoriesWithCounts = await Promise.all(
    (subcategoriesData || []).map(async (sub: any) => {
      const { count } = await supabase
        .from('products')
        .select('id', { count: 'exact' })
        .eq('subcategory_id', sub.id)
        .eq('is_active', true)
      
      return {
        id: sub.id,
        name: sub.name,
        slug: sub.slug,
        image_url: sub.image_url,
        product_count: count || 0,
      }
    })
  )

  // Get ALL products in this category (including products from all subcategories)
  const { data: products } = await supabase
    .from('products')
    .select(`
      *,
      images:product_images(url, position)
    `)
    .eq('category_id', category.id)
    .eq('is_active', true)
    .order('created_at', { ascending: false })

  const mappedProducts = products?.map((p: any) => ({
    id: p.id,
    sku: p.sku || p.id,
    name: p.name,
    price: p.price,
    is_new: p.is_new,
    images: p.images?.sort((a: any, b: any) => a.position - b.position).map((img: any) => img.url) || [],
  })) || []

  return {
    props: {
      category: {
        id: category.id,
        name: category.name,
        slug: category.slug,
      },
      subcategories: subcategoriesWithCounts,
      products: mappedProducts,
    }
  }
}
