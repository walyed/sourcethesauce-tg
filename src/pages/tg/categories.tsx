import { GetServerSideProps } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { styled } from 'stitches.config'
import { TelegramLayout } from '@/components/telegram'
import { supabase } from '@/lib/supabase'

const Container = styled('div', {
  minHeight: '100vh',
  backgroundColor: 'var(--tg-theme-secondary-bg-color, #f5f5f5)',
})

const Header = styled('header', {
  padding: '12px 16px',
  backgroundColor: 'var(--tg-theme-bg-color, #ffffff)',
  display: 'flex',
  alignItems: 'center',
  gap: 12,
  position: 'sticky',
  top: 0,
  zIndex: 100,
})

const BackButton = styled('button', {
  width: 36,
  height: 36,
  borderRadius: 10,
  backgroundColor: 'var(--tg-theme-secondary-bg-color, #f5f5f5)',
  border: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  color: 'var(--tg-theme-text-color, #000)',
  
  '&:active': {
    transform: 'scale(0.95)',
  }
})

const Title = styled('h1', {
  fontSize: 18,
  fontWeight: 700,
  margin: 0,
  color: 'var(--tg-theme-text-color, #000000)',
})

const Content = styled('div', {
  padding: 16,
})

const Grid = styled('div', {
  display: 'grid',
  gridTemplateColumns: 'repeat(2, 1fr)',
  gap: 12,
})

const CategoryCard = styled(Link, {
  display: 'block',
  position: 'relative',
  aspectRatio: '1',
  borderRadius: 16,
  overflow: 'hidden',
  textDecoration: 'none',
  boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
  
  '&:active': {
    transform: 'scale(0.98)',
  }
})

const CardOverlay = styled('div', {
  position: 'absolute',
  inset: 0,
  background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 60%)',
  display: 'flex',
  alignItems: 'flex-end',
  padding: 14,
})

const CardName = styled('span', {
  color: '#ffffff',
  fontSize: 14,
  fontWeight: 700,
})

interface CategoriesPageProps {
  categories: Array<{
    id: string
    name: string
    slug: string
    image_url: string
    product_count?: number
  }>
}

export default function CategoriesPage({ categories }: CategoriesPageProps) {
  const router = useRouter()
  
  return (
    <>
      <Head>
        <title>Categories | Source The Sauce</title>
      </Head>
      
      <TelegramLayout>
        <Container>
          <Header>
            <BackButton onClick={() => router.back()}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 18l-6-6 6-6"/>
              </svg>
            </BackButton>
            <Title>All Categories</Title>
          </Header>

          <Content>
            <Grid>
              {categories.map((category) => (
                <CategoryCard key={category.id} href={`/tg/category/${category.slug}`}>
                  <Image
                    src={category.image_url || 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=400&fit=crop'}
                    alt={category.name}
                    fill
                    style={{ objectFit: 'cover' }}
                    sizes="(max-width: 768px) 50vw, 33vw"
                  />
                  <CardOverlay>
                    <CardName>{category.name}</CardName>
                  </CardOverlay>
                </CategoryCard>
              ))}
            </Grid>
          </Content>
        </Container>
      </TelegramLayout>
    </>
  )
}

export const getServerSideProps: GetServerSideProps<CategoriesPageProps> = async () => {
  const { data: categories } = await supabase
    .from('categories')
    .select('*')
    .order('sort_order', { ascending: true })

  return {
    props: {
      categories: categories || [],
    }
  }
}
