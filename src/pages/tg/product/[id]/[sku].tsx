import { GetServerSideProps } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { useState, useEffect, useMemo, useCallback } from 'react'
import { styled, keyframes } from 'stitches.config'
import { TelegramLayout } from '@/components/telegram'
import { supabase } from '@/lib/supabase'
import { getTelegramWebApp } from '@/lib/telegram/types'
import { useCart } from '@/context/telegram-cart'
import { useWishlist } from '@/context/telegram-wishlist'
import { successNotification, lightImpact } from '@/lib/telegram/haptics'

const fadeIn = keyframes({
  '0%': { opacity: 0, transform: 'translateY(10px)' },
  '100%': { opacity: 1, transform: 'translateY(0)' },
})

const Container = styled('div', {
  paddingBottom: 120,
  backgroundColor: 'var(--tg-theme-secondary-bg-color, #f8f9fa)',
  minHeight: '100vh',
})

const Header = styled('header', {
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  padding: '12px 16px',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  zIndex: 10,
})

const IconButton = styled('button', {
  width: 42,
  height: 42,
  borderRadius: '50%',
  backgroundColor: 'rgba(255,255,255,0.95)',
  border: 'none',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  boxShadow: '0 2px 12px rgba(0,0,0,0.12)',
  transition: 'all 0.2s ease',
  
  '&:active': {
    transform: 'scale(0.95)',
  },
  
  '& svg': {
    width: 22,
    height: 22,
  },
})

const ImageGallery = styled('div', {
  position: 'relative',
  aspectRatio: '4/5',
  backgroundColor: '#f0f0f0',
  overflow: 'hidden',
})

const ImageIndicators = styled('div', {
  position: 'absolute',
  bottom: 16,
  left: '50%',
  transform: 'translateX(-50%)',
  display: 'flex',
  gap: 6,
  zIndex: 5,
})

const ImageDot = styled('div', {
  width: 6,
  height: 6,
  borderRadius: '50%',
  backgroundColor: 'rgba(255,255,255,0.5)',
  transition: 'all 0.2s ease',
  
  variants: {
    active: {
      true: {
        width: 20,
        borderRadius: 3,
        backgroundColor: '#ffffff',
      }
    }
  }
})

const Content = styled('div', {
  padding: '20px 16px',
  backgroundColor: 'var(--tg-theme-bg-color, #ffffff)',
  borderTopLeftRadius: 24,
  borderTopRightRadius: 24,
  marginTop: -20,
  position: 'relative',
  zIndex: 2,
  animation: `${fadeIn} 0.3s ease`,
})

const PriceRow = styled('div', {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginBottom: 8,
})

const Price = styled('div', {
  fontSize: 26,
  fontWeight: 800,
  background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
})

const OldPrice = styled('span', {
  fontSize: 16,
  color: 'var(--tg-theme-hint-color, #999)',
  textDecoration: 'line-through',
  marginLeft: 10,
})

const DiscountBadge = styled('span', {
  padding: '4px 10px',
  borderRadius: 20,
  background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
  color: '#ffffff',
  fontSize: 12,
  fontWeight: 700,
})

const Name = styled('h1', {
  fontSize: 20,
  fontWeight: 700,
  margin: 0,
  marginBottom: 12,
  color: 'var(--tg-theme-text-color, #000000)',
  lineHeight: 1.3,
})

const RatingRow = styled('div', {
  display: 'flex',
  alignItems: 'center',
  gap: 8,
  marginBottom: 16,
})

const Stars = styled('div', {
  display: 'flex',
  gap: 2,
  color: '#fbbf24',
})

const RatingText = styled('span', {
  fontSize: 13,
  color: 'var(--tg-theme-hint-color, #666)',
})

const Description = styled('p', {
  fontSize: 14,
  lineHeight: 1.7,
  color: 'var(--tg-theme-hint-color, #666666)',
  margin: 0,
  marginBottom: 24,
})

const Divider = styled('div', {
  height: 1,
  backgroundColor: 'var(--tg-theme-hint-color, #e5e5e5)',
  opacity: 0.3,
  margin: '20px 0',
})

const OptionsSection = styled('div', {
  marginBottom: 20,
})

const OptionHeader = styled('div', {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: 12,
})

const OptionLabel = styled('h3', {
  fontSize: 14,
  fontWeight: 700,
  margin: 0,
  color: 'var(--tg-theme-text-color, #000000)',
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
})

const SelectedValue = styled('span', {
  fontSize: 13,
  color: '#6366f1',
  fontWeight: 600,
})

const ColorOptions = styled('div', {
  display: 'flex',
  gap: 10,
})

const ColorButton = styled('button', {
  width: 38,
  height: 38,
  borderRadius: '50%',
  border: '3px solid transparent',
  cursor: 'pointer',
  transition: 'all 0.2s ease',
  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  
  '&:active': {
    transform: 'scale(0.95)',
  },
  
  variants: {
    selected: {
      true: {
        borderColor: '#6366f1',
        boxShadow: '0 0 0 2px rgba(99, 102, 241, 0.3)',
      }
    }
  }
})

const SizeOptions = styled('div', {
  display: 'flex',
  flexWrap: 'wrap',
  gap: 10,
})

const SizeButton = styled('button', {
  padding: '12px 22px',
  borderRadius: 12,
  border: '2px solid var(--tg-theme-hint-color, #e5e5e5)',
  backgroundColor: 'var(--tg-theme-bg-color, #ffffff)',
  cursor: 'pointer',
  fontSize: 14,
  fontWeight: 600,
  transition: 'all 0.2s ease',
  color: 'var(--tg-theme-text-color, #000000)',
  
  '&:active': {
    transform: 'scale(0.97)',
  },
  
  variants: {
    selected: {
      true: {
        background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
        color: '#ffffff',
        borderColor: 'transparent',
        boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)',
      }
    }
  }
})

const BottomBar = styled('div', {
  position: 'fixed',
  bottom: 0,
  left: 0,
  right: 0,
  backgroundColor: 'var(--tg-theme-bg-color, #ffffff)',
  padding: '12px 16px',
  paddingBottom: 'max(12px, env(safe-area-inset-bottom))',
  boxShadow: '0 -4px 20px rgba(0,0,0,0.08)',
  zIndex: 100,
  display: 'flex',
  gap: 12,
  alignItems: 'center',
})

const QuantityControl = styled('div', {
  display: 'flex',
  alignItems: 'center',
  gap: 12,
  backgroundColor: 'var(--tg-theme-secondary-bg-color, #f5f5f5)',
  borderRadius: 12,
  padding: '8px 12px',
})

const QtyButton = styled('button', {
  width: 32,
  height: 32,
  borderRadius: 8,
  border: 'none',
  backgroundColor: '#ffffff',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontWeight: 700,
  fontSize: 18,
  color: 'var(--tg-theme-text-color, #000)',
  boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
  
  '&:active': {
    transform: 'scale(0.95)',
  },
  
  '&:disabled': {
    opacity: 0.4,
  }
})

const QtyValue = styled('span', {
  fontSize: 16,
  fontWeight: 700,
  minWidth: 24,
  textAlign: 'center',
})

const AddToCartButton = styled('button', {
  flex: 1,
  padding: '14px 24px',
  borderRadius: 14,
  border: 'none',
  background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
  color: '#ffffff',
  fontSize: 15,
  fontWeight: 700,
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 8,
  boxShadow: '0 4px 14px rgba(99, 102, 241, 0.35)',
  transition: 'all 0.2s ease',
  
  '&:active': {
    transform: 'scale(0.98)',
  },
  
  '&:disabled': {
    opacity: 0.6,
    cursor: 'not-allowed',
  }
})

interface ProductPageProps {
  product: {
    id: string
    sku: string
    name: string
    description: string
    price: number
    originalPrice?: number
    images: string[]
    variants: Array<{
      id: string
      colour: string
      colour_hex: string
      size: string
    }>
  } | null
}

export default function ProductPage({ product }: ProductPageProps) {
  const router = useRouter()
  const [selectedColor, setSelectedColor] = useState<string>('')
  const [selectedSize, setSelectedSize] = useState<string>('')
  const [quantity, setQuantity] = useState(1)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  // Get unique colors and sizes
  const colors = useMemo(() => {
    return product?.variants.reduce((acc, v) => {
      if (!acc.find(c => c.colour === v.colour)) {
        acc.push({ colour: v.colour, colour_hex: v.colour_hex })
      }
      return acc
    }, [] as Array<{ colour: string; colour_hex: string }>) || []
  }, [product?.variants])

  const sizes = useMemo(() => {
    return product?.variants
      .filter(v => !selectedColor || v.colour === selectedColor)
      .reduce((acc, v) => {
        if (!acc.includes(v.size)) acc.push(v.size)
        return acc
      }, [] as string[]) || []
  }, [product?.variants, selectedColor])

  useEffect(() => {
    if (colors.length > 0 && !selectedColor) {
      setSelectedColor(colors[0].colour)
    }
  }, [colors, selectedColor])

  useEffect(() => {
    if (sizes.length > 0 && !sizes.includes(selectedSize)) {
      setSelectedSize(sizes[0])
    }
  }, [sizes, selectedSize])

  const { addToCart } = useCart()
  const { isInWishlist, toggleWishlist } = useWishlist()
  const [isAddingToCart, setIsAddingToCart] = useState(false)

  // Get selected variant
  const selectedVariant = useMemo(() => {
    return product?.variants.find(
      v => v.colour === selectedColor && v.size === selectedSize
    )
  }, [product?.variants, selectedColor, selectedSize])

  const handleAddToCart = useCallback(async () => {
    if (!product || !selectedVariant || isAddingToCart) return
    
    setIsAddingToCart(true)
    try {
      await addToCart(product.id, selectedVariant.id, quantity)
      successNotification()
      const webApp = getTelegramWebApp()
      webApp?.showAlert(`Added ${quantity}x ${product.name} to cart!`)
    } catch (error) {
      console.error('Error adding to cart:', error)
    } finally {
      setIsAddingToCart(false)
    }
  }, [product, selectedVariant, addToCart, isAddingToCart, quantity])

  const handleToggleWishlist = useCallback(async () => {
    if (!product) return
    lightImpact()
    await toggleWishlist(product.id)
  }, [product, toggleWishlist])

  // Setup Telegram MainButton
  useEffect(() => {
    const webApp = getTelegramWebApp()
    if (webApp && product && selectedVariant) {
      webApp.MainButton.setParams({
        text: isAddingToCart ? 'Adding...' : `Add to Cart - £${product.price.toFixed(2)}`,
        is_visible: true,
        is_active: !isAddingToCart,
      })
      
      webApp.MainButton.onClick(handleAddToCart)
      
      return () => {
        webApp.MainButton.offClick(handleAddToCart)
        webApp.MainButton.hide()
      }
    }
  }, [product, selectedVariant, isAddingToCart, handleAddToCart])

  if (!product) {
    return (
      <TelegramLayout showNav={false}>
        <Container style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ textAlign: 'center', padding: 40 }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>😕</div>
            <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 8 }}>Product not found</div>
            <div style={{ fontSize: 14, color: '#666' }}>This item may no longer be available</div>
          </div>
        </Container>
      </TelegramLayout>
    )
  }

  const discountPercent = product.originalPrice 
    ? Math.round((1 - product.price / product.originalPrice) * 100) 
    : 0

  return (
    <>
      <Head>
        <title>{product.name} | Source The Sauce</title>
      </Head>
      
      <TelegramLayout showNav={false}>
        <Container>
          <ImageGallery>
            <Header>
              <IconButton onClick={() => router.back()}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <path d="M19 12H5"/>
                  <path d="M12 19l-7-7 7-7"/>
                </svg>
              </IconButton>
              <IconButton onClick={handleToggleWishlist}>
                <svg 
                  viewBox="0 0 24 24" 
                  fill={isInWishlist(product.id) ? '#ef4444' : 'none'} 
                  stroke={isInWishlist(product.id) ? '#ef4444' : 'currentColor'} 
                  strokeWidth="2"
                >
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                </svg>
              </IconButton>
            </Header>
            {product.images[currentImageIndex] && (
              <Image
                src={product.images[currentImageIndex]}
                alt={product.name}
                fill
                style={{ objectFit: 'cover' }}
                priority
              />
            )}
            {product.images.length > 1 && (
              <ImageIndicators>
                {product.images.map((_, idx) => (
                  <ImageDot 
                    key={idx} 
                    active={idx === currentImageIndex}
                    onClick={() => setCurrentImageIndex(idx)}
                  />
                ))}
              </ImageIndicators>
            )}
          </ImageGallery>

          <Content>
            <PriceRow>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <Price>£{product.price.toFixed(2)}</Price>
                {product.originalPrice && (
                  <OldPrice>£{product.originalPrice.toFixed(2)}</OldPrice>
                )}
              </div>
              {discountPercent > 0 && (
                <DiscountBadge>-{discountPercent}%</DiscountBadge>
              )}
            </PriceRow>
            
            <Name>{product.name}</Name>
            
            <RatingRow>
              <Stars>
                {[1,2,3,4,5].map(star => (
                  <svg key={star} width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                ))}
              </Stars>
              <RatingText>4.8 (128 reviews)</RatingText>
            </RatingRow>
            
            <Description>{product.description || 'Premium quality product from Source The Sauce. Carefully curated for style and comfort.'}</Description>

            <Divider />

            {colors.length > 0 && (
              <OptionsSection>
                <OptionHeader>
                  <OptionLabel>Color</OptionLabel>
                  <SelectedValue>{selectedColor}</SelectedValue>
                </OptionHeader>
                <ColorOptions>
                  {colors.map((color) => (
                    <ColorButton
                      key={color.colour}
                      selected={selectedColor === color.colour}
                      onClick={() => {
                        lightImpact()
                        setSelectedColor(color.colour)
                      }}
                      style={{ backgroundColor: color.colour_hex }}
                      title={color.colour}
                    />
                  ))}
                </ColorOptions>
              </OptionsSection>
            )}

            {sizes.length > 0 && (
              <OptionsSection>
                <OptionHeader>
                  <OptionLabel>Size</OptionLabel>
                  <SelectedValue>{selectedSize}</SelectedValue>
                </OptionHeader>
                <SizeOptions>
                  {sizes.map((size) => (
                    <SizeButton
                      key={size}
                      selected={selectedSize === size}
                      onClick={() => {
                        lightImpact()
                        setSelectedSize(size)
                      }}
                    >
                      {size}
                    </SizeButton>
                  ))}
                </SizeOptions>
              </OptionsSection>
            )}
          </Content>
        </Container>

        <BottomBar>
          <QuantityControl>
            <QtyButton 
              onClick={() => setQuantity(q => Math.max(1, q - 1))}
              disabled={quantity <= 1}
            >
              −
            </QtyButton>
            <QtyValue>{quantity}</QtyValue>
            <QtyButton onClick={() => setQuantity(q => q + 1)}>
              +
            </QtyButton>
          </QuantityControl>
          <AddToCartButton onClick={handleAddToCart} disabled={isAddingToCart || !selectedVariant}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
              <line x1="3" y1="6" x2="21" y2="6"/>
              <path d="M16 10a4 4 0 0 1-8 0"/>
            </svg>
            {isAddingToCart ? 'Adding...' : `Add · £${(product.price * quantity).toFixed(2)}`}
          </AddToCartButton>
        </BottomBar>
      </TelegramLayout>
    </>
  )
}

export const getServerSideProps: GetServerSideProps<ProductPageProps> = async ({ params }) => {
  const id = params?.id as string

  const { data: product } = await supabase
    .from('products')
    .select(`
      *,
      images:product_images(url, position),
      variants:product_variants(id, colour, colour_hex, size)
    `)
    .eq('id', id)
    .eq('is_active', true)
    .single()

  if (!product) {
    return { props: { product: null } }
  }

  return {
    props: {
      product: {
        id: product.id,
        sku: product.sku || product.id,
        name: product.name,
        description: product.description || '',
        price: product.price,
        images: product.images?.sort((a: any, b: any) => a.position - b.position).map((img: any) => img.url) || [],
        variants: product.variants || [],
      }
    }
  }
}
