import { GetServerSideProps } from 'next'
import Head from 'next/head'
import Link from 'next/link'
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

const HeaderContent = styled('div', {
  flex: 1,
})

const Title = styled('h1', {
  fontSize: 18,
  fontWeight: 600,
  margin: 0,
  color: 'var(--tg-theme-text-color, #e5e7eb)',
})

const Breadcrumb = styled('div', {
  display: 'flex',
  alignItems: 'center',
  gap: 6,
  marginTop: 2,
})

const BreadcrumbLink = styled(Link, {
  fontSize: 12,
  color: '#94a3b8',
  textDecoration: 'none',
  '&:hover': {
    color: '#a5b4fc',
  },
})

const BreadcrumbSeparator = styled('span', {
  fontSize: 10,
  color: '#64748b',
})

const BreadcrumbCurrent = styled('span', {
  fontSize: 12,
  color: '#a5b4fc',
})

const ProductCount = styled('span', {
  fontSize: 14,
  color: 'var(--tg-theme-hint-color, #94a3b8)',
  whiteSpace: 'nowrap',
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

interface SubcategoryPageProps {
  subcategory: {
    id: string
    name: string
    slug: string
  } | null
  category: {
    id: string
    name: string
    slug: string
  } | null
  products: Array<{
    id: string
    sku: string
    name: string
    price: number
    is_new: boolean
    images: string[]
  }>
}

export default function SubcategoryPage({ subcategory, category, products }: SubcategoryPageProps) {
  const router = useRouter()

  if (!subcategory) {
    return (
      <TelegramLayout>
        <EmptyState>Subcategory not found</EmptyState>
      </TelegramLayout>
    )
  }

  return (
    <>
      <Head>
        <title>{subcategory.name} | Source The Sauce</title>
      </Head>
      
      <TelegramLayout>
        <Header>
          <BackButton onClick={() => router.back()}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5"/>
              <path d="M12 19l-7-7 7-7"/>
            </svg>
          </BackButton>
          <HeaderContent>
            <Title>{subcategory.name}</Title>
            {category && (
              <Breadcrumb>
                <BreadcrumbLink href="/tg/categories">Categories</BreadcrumbLink>
                <BreadcrumbSeparator>›</BreadcrumbSeparator>
                <BreadcrumbLink href={`/tg/category/${category.slug}`}>{category.name}</BreadcrumbLink>
                <BreadcrumbSeparator>›</BreadcrumbSeparator>
                <BreadcrumbCurrent>{subcategory.name}</BreadcrumbCurrent>
              </Breadcrumb>
            )}
          </HeaderContent>
          <ProductCount>{products.length} items</ProductCount>
        </Header>

        {products.length === 0 ? (
          <EmptyState>No products in this subcategory yet</EmptyState>
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

export const getServerSideProps: GetServerSideProps<SubcategoryPageProps> = async ({ params }) => {
  const slug = params?.slug as string

  // Get subcategory with its parent category
  const { data: subcategory } = await supabase
    .from('subcategories')
    .select(`
      *,
      category:categories(id, name, slug)
    `)
    .eq('slug', slug)
    .single()

  if (!subcategory) {
    return {
      props: {
        subcategory: null,
        category: null,
        products: [],
      }
    }
  }

  // Get products in this subcategory
  const { data: products } = await supabase
    .from('products')
    .select(`
      *,
      images:product_images(url, position)
    `)
    .eq('subcategory_id', subcategory.id)
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
      subcategory: {
        id: subcategory.id,
        name: subcategory.name,
        slug: subcategory.slug,
      },
      category: subcategory.category ? {
        id: subcategory.category.id,
        name: subcategory.category.name,
        slug: subcategory.category.slug,
      } : null,
      products: mappedProducts,
    }
  }
}
