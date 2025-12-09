import { GetServerSideProps } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import { useMemo, useState } from 'react'
import { styled } from 'stitches.config'
import { TelegramLayout, ProductCard } from '@/components/telegram'
import { supabase } from '@/lib/supabase'
import { useCart } from '@/context/telegram-cart'

// ============ STYLED COMPONENTS ============

const Container = styled('div', {
  minHeight: '100vh',
  paddingBottom: 76, // extra space for bottom bar
  background:
    'radial-gradient(circle at top, rgba(99,102,241,0.12) 0, transparent 55%), radial-gradient(circle at bottom, rgba(15,23,42,0.9) 0, #020617 70%)',
})

const Header = styled('header', {
  padding: '12px 16px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  backgroundColor: 'color-mix(in srgb, var(--tg-theme-bg-color, #020617) 80%, #000000 20%)',
  position: 'sticky',
  top: 0,
  zIndex: 100,
  borderBottom: '1px solid rgba(148,163,184,0.25)',
  backdropFilter: 'blur(10px)',
})

const LogoContainer = styled('div', {
  display: 'flex',
  alignItems: 'center',
  gap: 10,
})

const LogoIcon = styled('div', {
  width: 32,
  height: 32,
  borderRadius: 999,
  background:
    'conic-gradient(from 140deg, #22c55e, #6366f1, #ec4899, #22c55e)',
  padding: 2,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',

  '&::before': {
    content: '',
    position: 'absolute',
    inset: -8,
    borderRadius: 999,
    background:
      'radial-gradient(circle at top, rgba(94,234,212,0.25), transparent 60%)',
    zIndex: -1,
  },
})

const LogoInner = styled('div', {
  width: '100%',
  height: '100%',
  borderRadius: 999,
  background: '#020617',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: '#e5e7eb',
  fontSize: 12,
  fontWeight: 800,
  letterSpacing: 1,
})

const LogoTextWrap = styled('div', {
  display: 'flex',
  flexDirection: 'column',
})

const Logo = styled('span', {
  fontSize: 16,
  fontWeight: 700,
  color: 'var(--tg-theme-text-color, #e5e7eb)',
})

const LogoSub = styled('span', {
  fontSize: 11,
  color: 'rgba(148,163,184,0.95)',
})

const HeaderActions = styled('div', {
  display: 'flex',
  alignItems: 'center',
  gap: 8,
})

const IconButton = styled('button', {
  position: 'relative',
  width: 38,
  height: 38,
  borderRadius: 12,
  backgroundColor: 'rgba(15,23,42,0.85)',
  border: '1px solid rgba(148,163,184,0.4)',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: '#e5e7eb',
  transition: 'transform 0.12s ease, box-shadow 0.12s ease, background-color 0.12s ease',

  '&:active': {
    transform: 'scale(0.94)',
    boxShadow: '0 0 0 1px rgba(94,234,212,0.4)',
    backgroundColor: 'rgba(15,23,42,1)',
  },
})

const CartBadge = styled('span', {
  position: 'absolute',
  top: -3,
  right: -3,
  minWidth: 18,
  height: 18,
  padding: '0 4px',
  borderRadius: 999,
  backgroundColor: '#ef4444',
  color: '#ffffff',
  fontSize: 10,
  fontWeight: 700,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  boxShadow: '0 0 0 1px #020617',
})

const HeroBanner = styled('div', {
  position: 'relative',
  margin: '10px 16px 16px',
  borderRadius: 22,
  overflow: 'hidden',
  aspectRatio: '16/9',
  boxShadow: '0 12px 40px rgba(15,23,42,0.75)',
  border: '1px solid rgba(148,163,184,0.4)',
})

const HeroContent = styled('div', {
  position: 'absolute',
  inset: 0,
  padding: 18,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'flex-end',
  background:
    'linear-gradient(to top, rgba(15,23,42,0.95) 0%, rgba(15,23,42,0.55) 40%, transparent 100%)',
})

const HeroTagRow = styled('div', {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: 8,
})

const HeroTag = styled('span', {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 6,
  padding: '4px 10px',
  borderRadius: 999,
  backgroundColor: 'rgba(15,23,42,0.85)',
  border: '1px solid rgba(148,163,184,0.7)',
  color: '#e5e7eb',
  fontSize: 10,
  fontWeight: 600,
  textTransform: 'uppercase',
  letterSpacing: '0.11em',
})

const HeroPill = styled('span', {
  fontSize: 10,
  color: 'rgba(148,163,184,0.9)',
})

const HeroTitle = styled('h1', {
  fontSize: 22,
  fontWeight: 800,
  margin: 0,
  marginBottom: 4,
  color: '#f9fafb',
})

const HeroSubtitle = styled('p', {
  fontSize: 13,
  margin: 0,
  color: 'rgba(209,213,219,0.96)',
})

// Search

const SearchWrapper = styled('div', {
  padding: '0 16px 18px',
})

const SearchField = styled('div', {
  display: 'flex',
  alignItems: 'center',
  gap: 8,
  padding: '8px 10px',
  borderRadius: 999,
  backgroundColor: 'rgba(15,23,42,0.9)',
  border: '1px solid rgba(148,163,184,0.5)',
})

const SearchIcon = styled('div', {
  width: 18,
  height: 18,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: 'rgba(148,163,184,0.95)',
})

const SearchInput = styled('input', {
  flex: 1,
  border: 'none',
  outline: 'none',
  background: 'transparent',
  color: '#e5e7eb',
  fontSize: 13,

  '&::placeholder': {
    color: 'rgba(148,163,184,0.9)',
  },
})

const Section = styled('section', {
  marginBottom: 22,
})

const SectionHeader = styled('div', {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '0 16px',
  marginBottom: 12,
})

const SectionTitle = styled('h2', {
  fontSize: 16,
  fontWeight: 700,
  margin: 0,
  color: '#e5e7eb',
})

const SectionHint = styled('span', {
  fontSize: 11,
  color: 'rgba(148,163,184,0.95)',
})

const SeeAllLink = styled(Link, {
  fontSize: 12,
  fontWeight: 600,
  color: '#a5b4fc',
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
  },
})

const CategoryItem = styled(Link, {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: 8,
  textDecoration: 'none',
  flexShrink: 0,
  transform: 'translateZ(0)',
  transition: 'transform 0.12s ease, box-shadow 0.12s ease',

  '&:active': {
    transform: 'scale(0.95) translateZ(0)',
  },
})

const CategoryImage = styled('div', {
  position: 'relative',
  width: 66,
  height: 66,
  borderRadius: 16,
  overflow: 'hidden',
  backgroundColor: 'rgba(15,23,42,0.9)',
  boxShadow: '0 10px 25px rgba(15,23,42,0.8)',
  border: '1px solid rgba(148,163,184,0.6)',
})

const CategoryName = styled('span', {
  fontSize: 11,
  fontWeight: 600,
  color: 'rgba(226,232,240,0.98)',
  textAlign: 'center',
  maxWidth: 70,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
})

const ProductsGrid = styled('div', {
  display: 'grid',
  gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
  gap: 12,
  padding: '0 16px',
})

const EmptyState = styled('div', {
  textAlign: 'center',
  padding: '40px 20px',
  color: 'rgba(148,163,184,0.95)',
  fontSize: 13,
})

// Bottom mini-cart

const BottomBar = styled('div', {
  position: 'fixed',
  left: 0,
  right: 0,
  bottom: 0,
  padding: '8px 10px 10px',
  zIndex: 120,
  background:
    'linear-gradient(to top, rgba(15,23,42,0.97), rgba(15,23,42,0.9))',
  borderTop: '1px solid rgba(148,163,184,0.4)',
  backdropFilter: 'blur(10px)',
})

const BottomBarInner = styled('div', {
  maxWidth: 480,
  margin: '0 auto',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 10,
})

const BottomBarText = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  fontSize: 12,
  color: 'rgba(226,232,240,0.98)',
})

const BottomBarLine = styled('span', {
  '&:last-child': {
    fontSize: 11,
    color: 'rgba(148,163,184,0.95)',
  },
})

const BottomBarButton = styled(Link, {
  padding: '9px 14px',
  borderRadius: 999,
  background:
    'linear-gradient(135deg, #22c55e, #4ade80)',
  color: '#022c22',
  fontSize: 13,
  fontWeight: 700,
  textDecoration: 'none',
  display: 'flex',
  alignItems: 'center',
  gap: 6,
  boxShadow: '0 10px 25px rgba(22,163,74,0.55)',

  '&:active': {
    transform: 'scale(0.96)',
  },
})

// ============ TYPES ============

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

// ============ COMPONENT ============

export default function TelegramHome({
  hero,
  categories,
  newArrivals,
  featured,
}: TelegramHomeProps) {
  const { totalItems } = useCart()
  const [searchTerm, setSearchTerm] = useState('')

  const allProducts = useMemo(
    () => [...newArrivals, ...featured],
    [newArrivals, featured]
  )

  const filteredProducts = useMemo(() => {
    const term = searchTerm.trim().toLowerCase()
    if (!term) return []
    return allProducts.filter((p) => {
      const name = p.name?.toLowerCase() ?? ''
      const sku = p.sku?.toLowerCase() ?? ''
      return name.includes(term) || sku.includes(term)
    })
  }, [allProducts, searchTerm])

  const hasSearchResults = searchTerm.trim().length > 0 && filteredProducts.length > 0
  const isSearching = searchTerm.trim().length > 0

  return (
    <>
      <Head>
        <title>Source The Sauce | Shop</title>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"
        />
      </Head>

      <TelegramLayout>
        <Container>
          <Header>
            <LogoContainer>
              <LogoIcon>
                <LogoInner>SS</LogoInner>
              </LogoIcon>
              <LogoTextWrap>
                <Logo>Source The Sauce</Logo>
                <LogoSub>Telegram exclusive drops</LogoSub>
              </LogoTextWrap>
            </LogoContainer>
            <HeaderActions>
              <IconButton as={Link} href="/tg/cart">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <path d="M16 10a4 4 0 0 1-8 0" />
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
                <HeroTagRow>
                  <HeroTag>
                    <span>NEW DROP</span>
                  </HeroTag>
                  <HeroPill>Tap to explore the sauce</HeroPill>
                </HeroTagRow>
                <HeroTitle>{hero.title}</HeroTitle>
                <HeroSubtitle>{hero.subtitle}</HeroSubtitle>
              </HeroContent>
            </HeroBanner>
          )}

          {/* Search */}
          <SearchWrapper>
            <SearchField>
              <SearchIcon>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="11" cy="11" r="7" />
                  <line x1="16.5" y1="16.5" x2="21" y2="21" />
                </svg>
              </SearchIcon>
              <SearchInput
                placeholder="Search products or SKU…"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </SearchField>
          </SearchWrapper>

          {/* Search Results */}
          {isSearching && (
            <Section>
              <SectionHeader>
                <div>
                  <SectionTitle>Search results</SectionTitle>
                  <SectionHint>
                    {hasSearchResults
                      ? `${filteredProducts.length} item${filteredProducts.length > 1 ? 's' : ''} found`
                      : 'No matches in current drop'}
                  </SectionHint>
                </div>
              </SectionHeader>
              {hasSearchResults ? (
                <ProductsGrid>
                  {filteredProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      id={product.id}
                      sku={product.sku}
                      name={product.name}
                      price={product.price}
                      image={
                        product.images[0] ||
                        'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=500&fit=crop'
                      }
                      isNew={product.is_new}
                    />
                  ))}
                </ProductsGrid>
              ) : (
                <EmptyState>
                  <p>No products match that search.</p>
                </EmptyState>
              )}
            </Section>
          )}

          {/* Categories - Horizontal Scroll */}
          {categories.length > 0 && (
            <Section>
              <SectionHeader>
                <div>
                  <SectionTitle>Categories</SectionTitle>
                  <SectionHint>Browse by vibe</SectionHint>
                </div>
                <SeeAllLink href="/tg/categories">
                  See All
                  <svg
                    width="15"
                    height="15"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.4"
                  >
                    <path d="M9 18l6-6-6-6" />
                  </svg>
                </SeeAllLink>
              </SectionHeader>
              <CategoriesScroll>
                {categories.map((category) => (
                  <CategoryItem
                    key={category.id}
                    href={`/tg/category/${category.slug}`}
                  >
                    <CategoryImage>
                      <Image
                        src={
                          category.image_url ||
                          'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=200&h=200&fit=crop'
                        }
                        alt={category.name}
                        fill
                        style={{ objectFit: 'cover' }}
                        sizes="66px"
                      />
                    </CategoryImage>
                    <CategoryName>{category.name}</CategoryName>
                  </CategoryItem>
                ))}
              </CategoriesScroll>
            </Section>
          )}

          {/* New Arrivals */}
          {!isSearching && newArrivals.length > 0 && (
            <Section>
              <SectionHeader>
                <div>
                  <SectionTitle>🔥 New Arrivals</SectionTitle>
                  <SectionHint>Fresh off the rack</SectionHint>
                </div>
                <SeeAllLink href="/tg/category/new">
                  See All
                  <svg
                    width="15"
                    height="15"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.4"
                  >
                    <path d="M9 18l6-6-6-6" />
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
                    image={
                      product.images[0] ||
                      'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=500&fit=crop'
                    }
                    isNew={product.is_new}
                  />
                ))}
              </ProductsGrid>
            </Section>
          )}

          {/* Featured Products */}
          {!isSearching && featured.length > 0 && (
            <Section>
              <SectionHeader>
                <div>
                  <SectionTitle>✨ Featured</SectionTitle>
                  <SectionHint>Curated sauce picks</SectionHint>
                </div>
                <SeeAllLink href="/tg/category/featured">
                  See All
                  <svg
                    width="15"
                    height="15"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.4"
                  >
                    <path d="M9 18l6-6-6-6" />
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
                    image={
                      product.images[0] ||
                      'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=500&fit=crop'
                    }
                    isNew={product.is_new}
                  />
                ))}
              </ProductsGrid>
            </Section>
          )}

          {/* Empty State */}
          {!isSearching && newArrivals.length === 0 && featured.length === 0 && (
            <EmptyState>
              <p>No products available yet.</p>
              <p>Check back soon!</p>
            </EmptyState>
          )}

          {/* Bottom mini-cart */}
          {totalItems > 0 && (
            <BottomBar>
              <BottomBarInner>
                <BottomBarText>
                  <BottomBarLine>
                    {totalItems} item{totalItems > 1 ? 's' : ''} in your bag
                  </BottomBarLine>
                  <BottomBarLine>Ready when you are.</BottomBarLine>
                </BottomBarText>
                <BottomBarButton href="/tg/cart">
                  View cart
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M9 18l6-6-6-6" />
                  </svg>
                </BottomBarButton>
              </BottomBarInner>
            </BottomBar>
          )}
        </Container>
      </TelegramLayout>
    </>
  )
}

// ============ DATA FETCHING (UNCHANGED DB SHAPE) ============

export const getServerSideProps: GetServerSideProps<TelegramHomeProps> = async () => {
  try {
    // Fetch hero content
    const { data: heroData } = await supabase
      .from('home_content')
      .select('*')
      .eq('section_type', 'hero')
      .order('sort_order', { ascending: true })
      .limit(1)

    const hero = heroData?.[0]
      ? {
          title: heroData[0].title || '',
          subtitle: heroData[0].subtitle || '',
          image: heroData[0].image_url || '',
        }
      : null

    // Fetch categories
    const { data: categories } = await supabase
      .from('categories')
      .select('*')
      .order('sort_order', { ascending: true })

    // Fetch new arrivals (products with is_new = true)
    const { data: newProducts } = await supabase
      .from('products')
      .select(
        `
        *,
        images:product_images(url, position)
      `
      )
      .eq('is_active', true)
      .eq('is_new', true)
      .order('created_at', { ascending: false })
      .limit(4)

    // Fetch featured products
    const { data: featuredProducts } = await supabase
      .from('featured_products')
      .select(
        `
        *,
        product:products(
          *,
          images:product_images(url, position)
        )
      `
      )
      .eq('section_name', 'featured')
      .order('sort_order', { ascending: true })
      .limit(4)

    const mapProduct = (p: any) => ({
      id: p.id,
      sku: p.sku || p.id,
      name: p.name,
      price: p.price,
      is_new: p.is_new,
      images:
        p.images?.sort((a: any, b: any) => a.position - b.position).map((img: any) => img.url) ||
        [],
    })

    return {
      props: {
        hero,
        categories: categories || [],
        newArrivals: newProducts?.map(mapProduct) || [],
        featured:
          featuredProducts
            ?.map((fp: any) => (fp.product ? mapProduct(fp.product) : null))
            .filter(Boolean) || [],
      },
    }
  } catch (error) {
    console.error('Error fetching home data:', error)
    return {
      props: {
        hero: null,
        categories: [],
        newArrivals: [],
        featured: [],
      },
    }
  }
}
