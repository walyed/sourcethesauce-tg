import { GetServerSideProps } from 'next'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { styled } from 'stitches.config'
import { TelegramLayout, ProductCard } from '@/components/telegram'
import { supabase } from '@/lib/supabase'

const Header = styled('header', {
  padding: '16px',
  backgroundColor: 'var(--tg-theme-bg-color, #ffffff)',
  position: 'sticky',
  top: 0,
  zIndex: 100,
  display: 'flex',
  alignItems: 'center',
  gap: 12,
})

const BackButton = styled('button', {
  padding: 8,
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  color: 'var(--tg-theme-text-color, #000000)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
})

const Title = styled('h1', {
  fontSize: 20,
  fontWeight: 600,
  margin: 0,
  color: 'var(--tg-theme-text-color, #000000)',
  flex: 1,
})

const ProductCount = styled('span', {
  fontSize: 14,
  color: 'var(--tg-theme-hint-color, #999999)',
})

const Grid = styled('div', {
  display: 'grid',
  gridTemplateColumns: 'repeat(2, 1fr)',
  gap: 12,
  padding: '0 16px 16px',
})

const EmptyState = styled('div', {
  textAlign: 'center',
  padding: '48px 16px',
  color: 'var(--tg-theme-hint-color, #999999)',
})

interface CategoryPageProps {
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

export default function CategoryPage({ category, products }: CategoryPageProps) {
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

  // Get category
  const { data: category } = await supabase
    .from('categories')
    .select('*')
    .eq('slug', slug)
    .single()

  if (!category) {
    return {
      props: {
        category: null,
        products: [],
      }
    }
  }

  // Get products in category
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
      products: mappedProducts,
    }
  }
}
