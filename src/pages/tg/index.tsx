import { GetServerSideProps } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import { styled } from 'stitches.config'
import { TelegramLayout, ProductCard, CategoryCard } from '@/components/telegram'
import { supabase } from '@/lib/supabase'
import { useCart } from '@/context/telegram-cart'

// ============ STYLED COMPONENTS ============

const Container = styled('div', {
  paddingBottom: 20,
})

const Header = styled('header', {
  padding: '12px 16px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  backgroundColor: 'var(--tg-theme-bg-color, #ffffff)',
  position: 'sticky',
  top: 0,
  zIndex: 100,
})

const LogoContainer = styled('div', {
  display: 'flex',
  alignItems: 'center',
  gap: 10,
})

const LogoIcon = styled('div', {
  width: 32,
  height: 32,
  borderRadius: 8,
  background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: '#ffffff',
  fontSize: 14,
  fontWeight: 800,
})

const Logo = styled('span', {
  fontSize: 17,
  fontWeight: 700,
  color: 'var(--tg-theme-text-color, #000000)',
})

const HeaderActions = styled('div', {
  display: 'flex',
  alignItems: 'center',
  gap: 8,
})

const IconButton = styled('button', {
  position: 'relative',
  width: 40,
  height: 40,
  borderRadius: 12,
  backgroundColor: 'var(--tg-theme-secondary-bg-color, #f5f5f5)',
  border: 'none',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: 'var(--tg-theme-text-color, #000000)',
  transition: 'all 0.2s ease',
  
  '&:active': {
    transform: 'scale(0.95)',
  }
})

const CartBadge = styled('span', {
  position: 'absolute',
  top: -2,
  right: -2,
  width: 18,
  height: 18,
  borderRadius: '50%',
  backgroundColor: '#ef4444',
  color: '#ffffff',
  fontSize: 10,
  fontWeight: 700,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
})

const HeroBanner = styled('div', {
  position: 'relative',
  margin: '8px 16px 20px',
  borderRadius: 20,
  overflow: 'hidden',
  aspectRatio: '16/9',
  boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
})

const HeroContent = styled('div', {
  position: 'absolute',
  inset: 0,
  padding: 20,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'flex-end',
  background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0) 100%)',
})

const HeroTag = styled('span', {
  display: 'inline-block',
  padding: '4px 12px',
  borderRadius: 100,
  backgroundColor: 'rgba(255,255,255,0.2)',
  backdropFilter: 'blur(8px)',
  color: '#ffffff',
  fontSize: 11,
  fontWeight: 600,
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
  marginBottom: 8,
  width: 'fit-content',
})

const HeroTitle = styled('h1', {
  fontSize: 22,
  fontWeight: 700,
  margin: 0,
  marginBottom: 4,
  color: '#ffffff',
})

const HeroSubtitle = styled('p', {
  fontSize: 13,
  margin: 0,
  color: 'rgba(255,255,255,0.85)',
})

const Section = styled('section', {
  marginBottom: 24,
})

const SectionHeader = styled('div', {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '0 16px',
  marginBottom: 14,
})

const SectionTitle = styled('h2', {
  fontSize: 17,
  fontWeight: 700,
  margin: 0,
  color: 'var(--tg-theme-text-color, #000000)',
})

const SeeAllLink = styled(Link, {
  fontSize: 13,
  fontWeight: 600,
  color: 'var(--tg-theme-link-color, #6366f1)',
  textDecoration: 'none',
  display: 'flex',
  alignItems: 'center',
  gap: 4,
})

const CategoriesScroll = styled('div', {
  display: 'flex',
  gap: 12,
  padding: '0 16px',
  overflowX: 'auto',
  scrollbarWidth: 'none',
  msOverflowStyle: 'none',
  
  '&::-webkit-scrollbar': {
    display: 'none',
  }
})

const CategoryItem = styled(Link, {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: 8,
  textDecoration: 'none',
  flexShrink: 0,
  
  '&:active': {
    transform: 'scale(0.95)',
  }
})

const CategoryImage = styled('div', {
  position: 'relative',
  width: 64,
  height: 64,
  borderRadius: 16,
  overflow: 'hidden',
  backgroundColor: 'var(--tg-theme-secondary-bg-color, #f5f5f5)',
  boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
})

const CategoryName = styled('span', {
  fontSize: 11,
  fontWeight: 600,
  color: 'var(--tg-theme-text-color, #000000)',
  textAlign: 'center',
  maxWidth: 70,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
})

const ProductsGrid = styled('div', {
  display: 'grid',
  gridTemplateColumns: 'repeat(2, 1fr)',
  gap: 12,
  padding: '0 16px',
})

const EmptyState = styled('div', {
  textAlign: 'center',
  padding: '40px 20px',
  color: 'var(--tg-theme-hint-color, #999)',
})

// ============ COMPONENT ============

interface TelegramHomeProps {
  hero: {
    title: string
    subtitle: string
    image: string
  } | null
  categories: Array<{
    id: string
    name: string
    slug: string
    image_url: string
  }>
  newArrivals: Array<{
    id: string
    sku: string
    name: string
    price: number
    is_new: boolean
    images: string[]
  }>
  featured: Array<{
    id: string
    sku: string
    name: string
    price: number
    is_new: boolean
    images: string[]
  }>
}

export default function TelegramHome({ hero, categories, newArrivals, featured }: TelegramHomeProps) {
  const { totalItems } = useCart()

  return (
    <>
      <Head>
        <title>Source The Sauce | Shop</title>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
      </Head>
      
      <TelegramLayout>
        <Container>
          <Header>
            <LogoContainer>
              <LogoIcon>SS</LogoIcon>
              <Logo>Source The Sauce</Logo>
            </LogoContainer>
            <HeaderActions>
              <IconButton as={Link} href="/tg/cart">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
                  <line x1="3" y1="6" x2="21" y2="6"/>
                  <path d="M16 10a4 4 0 0 1-8 0"/>
                </svg>
                {totalItems > 0 && <CartBadge>{totalItems}</CartBadge>}
              </IconButton>
            </HeaderActions>
          </Header>

          {hero && hero.image && (
            <HeroBanner>
              <Image
                src={hero.image}
                alt={hero.title}
                fill
                style={{ objectFit: 'cover' }}
                priority
              />
              <HeroContent>
                <HeroTag>New Collection</HeroTag>
                <HeroTitle>{hero.title}</HeroTitle>
                <HeroSubtitle>{hero.subtitle}</HeroSubtitle>
              </HeroContent>
            </HeroBanner>
          )}

          {/* Categories - Horizontal Scroll */}
          {categories.length > 0 && (
            <Section>
              <SectionHeader>
                <SectionTitle>Categories</SectionTitle>
                <SeeAllLink href="/tg/categories">
                  See All
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M9 18l6-6-6-6"/>
                  </svg>
                </SeeAllLink>
              </SectionHeader>
              <CategoriesScroll>
                {categories.map((category) => (
                  <CategoryItem key={category.id} href={`/tg/category/${category.slug}`}>
                    <CategoryImage>
                      <Image
                        src={category.image_url || 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=200&h=200&fit=crop'}
                        alt={category.name}
                        fill
                        style={{ objectFit: 'cover' }}
                        sizes="64px"
                      />
                    </CategoryImage>
                    <CategoryName>{category.name}</CategoryName>
                  </CategoryItem>
                ))}
              </CategoriesScroll>
            </Section>
          )}

          {/* New Arrivals */}
          {newArrivals.length > 0 && (
            <Section>
              <SectionHeader>
                <SectionTitle>🔥 New Arrivals</SectionTitle>
                <SeeAllLink href="/tg/category/new">
                  See All
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M9 18l6-6-6-6"/>
                  </svg>
                </SeeAllLink>
              </SectionHeader>
              <ProductsGrid>
                {newArrivals.slice(0, 4).map((product) => (
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
              </ProductsGrid>
            </Section>
          )}

          {/* Featured Products */}
          {featured.length > 0 && (
            <Section>
              <SectionHeader>
                <SectionTitle>✨ Featured</SectionTitle>
                <SeeAllLink href="/tg/category/featured">
                  See All
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M9 18l6-6-6-6"/>
                  </svg>
                </SeeAllLink>
              </SectionHeader>
              <ProductsGrid>
                {featured.slice(0, 4).map((product) => (
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
              </ProductsGrid>
            </Section>
          )}

          {/* Empty State */}
          {newArrivals.length === 0 && featured.length === 0 && (
            <EmptyState>
              <p>No products available yet.</p>
              <p>Check back soon!</p>
            </EmptyState>
          )}
        </Container>
      </TelegramLayout>
    </>
  )
}

export const getServerSideProps: GetServerSideProps<TelegramHomeProps> = async () => {
  try {
    // Fetch hero content
    const { data: heroData } = await supabase
      .from('home_content')
      .select('*')
      .eq('section_type', 'hero')
      .order('sort_order', { ascending: true })
      .limit(1)

    const hero = heroData?.[0] ? {
      title: heroData[0].title || '',
      subtitle: heroData[0].subtitle || '',
      image: heroData[0].image_url || '',
    } : null

    // Fetch categories
    const { data: categories } = await supabase
      .from('categories')
      .select('*')
      .order('sort_order', { ascending: true })

    // Fetch new arrivals (products with is_new = true)
    const { data: newProducts } = await supabase
      .from('products')
      .select(`
        *,
        images:product_images(url, position)
      `)
      .eq('is_active', true)
      .eq('is_new', true)
      .order('created_at', { ascending: false })
      .limit(4)

    // Fetch featured products
    const { data: featuredProducts } = await supabase
      .from('featured_products')
      .select(`
        *,
        product:products(
          *,
          images:product_images(url, position)
        )
      `)
      .eq('section_name', 'featured')
      .order('sort_order', { ascending: true })
      .limit(4)

    const mapProduct = (p: any) => ({
      id: p.id,
      sku: p.sku || p.id,
      name: p.name,
      price: p.price,
      is_new: p.is_new,
      images: p.images?.sort((a: any, b: any) => a.position - b.position).map((img: any) => img.url) || [],
    })

    return {
      props: {
        hero,
        categories: categories || [],
        newArrivals: newProducts?.map(mapProduct) || [],
        featured: featuredProducts?.map((fp: any) => mapProduct(fp.product)).filter(Boolean) || [],
      }
    }
  } catch (error) {
    console.error('Error fetching home data:', error)
    return {
      props: {
        hero: null,
        categories: [],
        newArrivals: [],
        featured: [],
      }
    }
  }
}
