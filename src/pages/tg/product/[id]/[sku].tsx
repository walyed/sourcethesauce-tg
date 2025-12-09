import { GetServerSideProps } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { useState, useEffect, useMemo, useCallback, useRef, TouchEvent } from 'react'
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
  minHeight: '100vh',
  paddingBottom: 120,
  background:
    'radial-gradient(circle at top, rgba(99,102,241,0.18) 0, transparent 55%), radial-gradient(circle at bottom, rgba(15,23,42,0.96) 0, #020617 70%)',
})

const ImageShell = styled('div', {
  position: 'relative',
  aspectRatio: '4/5',
  background:
    'radial-gradient(circle at top, rgba(15,23,42,0.9), #020617)',
  overflow: 'hidden',
  boxShadow: '0 20px 45px rgba(15,23,42,0.85)',
  borderBottom: '1px solid rgba(148,163,184,0.45)',
  touchAction: 'pan-y pinch-zoom',
})

const ImageSlider = styled('div', {
  display: 'flex',
  height: '100%',
  transition: 'transform 0.3s ease-out',
})

const ImageSlide = styled('div', {
  position: 'relative',
  minWidth: '100%',
  height: '100%',
})

const GalleryNav = styled('button', {
  position: 'absolute',
  top: '50%',
  transform: 'translateY(-50%)',
  width: 36,
  height: 36,
  borderRadius: 999,
  backgroundColor: 'rgba(15,23,42,0.8)',
  border: '1px solid rgba(148,163,184,0.4)',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 10,
  color: '#e5e7eb',
  transition: 'all 0.15s ease',
  opacity: 0.8,

  '&:hover': {
    opacity: 1,
    backgroundColor: 'rgba(15,23,42,0.95)',
  },

  '&:active': {
    transform: 'translateY(-50%) scale(0.94)',
  },

  '& svg': {
    width: 18,
    height: 18,
  },

  variants: {
    side: {
      left: {
        left: 12,
      },
      right: {
        right: 12,
      },
    },
  },
})

const ThumbnailStrip = styled('div', {
  display: 'flex',
  gap: 8,
  padding: '12px 16px',
  backgroundColor: 'rgba(15,23,42,0.95)',
  overflowX: 'auto',
  scrollBehavior: 'smooth',
  '&::-webkit-scrollbar': {
    display: 'none',
  },
})

const Thumbnail = styled('button', {
  flexShrink: 0,
  width: 56,
  height: 56,
  borderRadius: 10,
  overflow: 'hidden',
  border: '2px solid transparent',
  padding: 0,
  cursor: 'pointer',
  transition: 'all 0.18s ease',
  position: 'relative',
  opacity: 0.6,

  '&:active': {
    transform: 'scale(0.95)',
  },

  variants: {
    active: {
      true: {
        border: '2px solid #a5b4fc',
        opacity: 1,
        boxShadow: '0 0 12px rgba(165,180,252,0.4)',
      },
    },
  },
})

const ImageCounter = styled('div', {
  position: 'absolute',
  bottom: 16,
  right: 16,
  padding: '6px 12px',
  borderRadius: 999,
  backgroundColor: 'rgba(15,23,42,0.85)',
  border: '1px solid rgba(148,163,184,0.4)',
  fontSize: 12,
  fontWeight: 600,
  color: '#e5e7eb',
  zIndex: 5,
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
  width: 38,
  height: 38,
  borderRadius: 999,
  backgroundColor: 'rgba(15,23,42,0.9)',
  border: '1px solid rgba(148,163,184,0.6)',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  boxShadow: '0 8px 24px rgba(15,23,42,0.85)',
  transition: 'transform 0.15s ease, box-shadow 0.15s ease, background-color 0.15s ease',
  color: '#e5e7eb',

  '&:active': {
    transform: 'scale(0.94)',
    boxShadow: '0 0 0 1px rgba(94,234,212,0.5)',
    backgroundColor: 'rgba(15,23,42,1)',
  },

  '& svg': {
    width: 20,
    height: 20,
  },
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

const ImageDot = styled('button', {
  width: 6,
  height: 6,
  borderRadius: 999,
  border: 'none',
  padding: 0,
  backgroundColor: 'rgba(148,163,184,0.4)',
  transition: 'all 0.18s ease',
  cursor: 'pointer',

  variants: {
    active: {
      true: {
        width: 18,
        borderRadius: 999,
        backgroundColor: '#e5e7eb',
      },
    },
  },
})

const Content = styled('div', {
  padding: '20px 16px 32px',
  background:
    'linear-gradient(to bottom, rgba(15,23,42,0.98), #020617)',
  borderTopLeftRadius: 22,
  borderTopRightRadius: 22,
  marginTop: -18,
  position: 'relative',
  zIndex: 2,
  animation: `${fadeIn} 0.25s ease`,
  borderTop: '1px solid rgba(148,163,184,0.5)',
})

const PriceRow = styled('div', {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginBottom: 8,
})

const PriceTextWrap = styled('div', {
  display: 'flex',
  alignItems: 'baseline',
  gap: 8,
})

const Price = styled('div', {
  fontSize: 24,
  fontWeight: 800,
  background:
    'linear-gradient(135deg, #22c55e 0%, #4ade80 30%, #a5b4fc 100%)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
})

const OldPrice = styled('span', {
  fontSize: 14,
  color: 'rgba(148,163,184,0.9)',
  textDecoration: 'line-through',
})

const DiscountBadge = styled('span', {
  padding: '4px 10px',
  borderRadius: 999,
  background:
    'linear-gradient(135deg, #ef4444 0%, #b91c1c 100%)',
  color: '#fef2f2',
  fontSize: 11,
  fontWeight: 700,
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
})

const Name = styled('h1', {
  fontSize: 18,
  fontWeight: 700,
  margin: '6px 0 10px',
  color: '#e5e7eb',
  lineHeight: 1.35,
})

const MetaRow = styled('div', {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginBottom: 16,
})

const RatingRow = styled('div', {
  display: 'flex',
  alignItems: 'center',
  gap: 8,
})

const Stars = styled('div', {
  display: 'flex',
  gap: 2,
  color: '#fbbf24',
})

const RatingText = styled('span', {
  fontSize: 12,
  color: 'rgba(148,163,184,0.95)',
})

const MicroMeta = styled('span', {
  fontSize: 11,
  color: 'rgba(148,163,184,0.9)',
})

const Description = styled('p', {
  fontSize: 13,
  lineHeight: 1.7,
  color: 'rgba(148,163,184,0.98)',
  margin: '0 0 18px',
})

const Divider = styled('div', {
  height: 1,
  background:
    'linear-gradient(to right, transparent, rgba(148,163,184,0.4), transparent)',
  margin: '18px 0',
})

const OptionsSection = styled('div', {
  marginBottom: 18,
})

const OptionHeader = styled('div', {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: 10,
})

const OptionLabel = styled('h3', {
  fontSize: 12,
  fontWeight: 700,
  margin: 0,
  color: '#e5e7eb',
  textTransform: 'uppercase',
  letterSpacing: '0.12em',
})

const SelectedValue = styled('span', {
  fontSize: 12,
  color: '#a5b4fc',
  fontWeight: 600,
})

const ColorOptions = styled('div', {
  display: 'flex',
  gap: 10,
})

const ColorButton = styled('button', {
  width: 34,
  height: 34,
  borderRadius: 999,
  border: '2px solid transparent',
  cursor: 'pointer',
  transition: 'all 0.2s ease',
  boxShadow: '0 6px 14px rgba(15,23,42,0.9)',
  padding: 0,
  position: 'relative',

  '&::after': {
    content: '',
    position: 'absolute',
    inset: -4,
    borderRadius: 999,
    border: '1px solid transparent',
    pointerEvents: 'none',
  },

  '&:active': {
    transform: 'scale(0.95)',
  },

  variants: {
    selected: {
      true: {
        borderColor: '#e5e7eb',
        '&::after': {
          borderColor: 'rgba(94,234,212,0.55)',
        },
      },
    },
  },
})

const SizeOptions = styled('div', {
  display: 'flex',
  flexWrap: 'wrap',
  gap: 8,
})

const SizeButton = styled('button', {
  padding: '8px 16px',
  borderRadius: 999,
  border: '1px solid rgba(148,163,184,0.6)',
  background:
    'radial-gradient(circle at top left, rgba(30,64,175,0.3), rgba(15,23,42,0.96))',
  cursor: 'pointer',
  fontSize: 13,
  fontWeight: 600,
  color: '#e5e7eb',
  transition: 'all 0.18s ease',
  minWidth: 52,

  '&:active': {
    transform: 'scale(0.96)',
  },

  variants: {
    selected: {
      true: {
        background:
          'linear-gradient(135deg, #6366f1, #8b5cf6)',
        borderColor: 'transparent',
        boxShadow: '0 10px 24px rgba(79,70,229,0.6)',
      },
    },
  },
})

const BottomBar = styled('div', {
  position: 'fixed',
  left: 0,
  right: 0,
  bottom: 0,
  padding: '8px 10px 10px',
  background:
    'linear-gradient(to top, rgba(15,23,42,0.98), rgba(15,23,42,0.93))',
  borderTop: '1px solid rgba(148,163,184,0.5)',
  backdropFilter: 'blur(10px)',
  zIndex: 120,
})

const BottomInner = styled('div', {
  maxWidth: 480,
  margin: '0 auto',
  display: 'flex',
  alignItems: 'center',
  gap: 10,
})

const QuantityControl = styled('div', {
  display: 'flex',
  alignItems: 'center',
  gap: 10,
  backgroundColor: 'rgba(15,23,42,0.95)',
  borderRadius: 999,
  padding: '6px 10px',
  border: '1px solid rgba(148,163,184,0.7)',
})

const QtyButton = styled('button', {
  width: 28,
  height: 28,
  borderRadius: 999,
  border: 'none',
  backgroundColor: '#020617',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontWeight: 700,
  fontSize: 18,
  color: '#e5e7eb',
  boxShadow: '0 4px 10px rgba(15,23,42,0.8)',

  '&:active': {
    transform: 'scale(0.94)',
  },

  '&:disabled': {
    opacity: 0.4,
  },
})

const QtyValue = styled('span', {
  fontSize: 14,
  fontWeight: 700,
  minWidth: 24,
  textAlign: 'center',
  color: '#e5e7eb',
})

const AddToCartButton = styled('button', {
  flex: 1,
  padding: '12px 18px',
  borderRadius: 999,
  border: 'none',
  background:
    'linear-gradient(135deg, #22c55e, #4ade80)',
  color: '#022c22',
  fontSize: 14,
  fontWeight: 800,
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 8,
  boxShadow: '0 12px 30px rgba(22,163,74,0.7)',
  transition: 'transform 0.15s ease, box-shadow 0.15s ease',

  '&:active': {
    transform: 'scale(0.97)',
  },

  '&:disabled': {
    opacity: 0.6,
    cursor: 'not-allowed',
    boxShadow: '0 4px 12px rgba(30,64,175,0.4)',
  },
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
  
  // Touch/swipe state for image gallery
  const touchStartX = useRef<number>(0)
  const touchEndX = useRef<number>(0)
  const thumbnailRef = useRef<HTMLDivElement>(null)

  const handleTouchStart = (e: TouchEvent<HTMLDivElement>) => {
    touchStartX.current = e.targetTouches[0].clientX
  }

  const handleTouchMove = (e: TouchEvent<HTMLDivElement>) => {
    touchEndX.current = e.targetTouches[0].clientX
  }

  const handleTouchEnd = () => {
    if (!product) return
    const diff = touchStartX.current - touchEndX.current
    const threshold = 50 // Minimum swipe distance

    if (diff > threshold && currentImageIndex < product.images.length - 1) {
      // Swipe left - next image
      setCurrentImageIndex(prev => prev + 1)
      lightImpact()
    } else if (diff < -threshold && currentImageIndex > 0) {
      // Swipe right - previous image
      setCurrentImageIndex(prev => prev - 1)
      lightImpact()
    }
  }

  const goToImage = (index: number) => {
    setCurrentImageIndex(index)
    lightImpact()
    // Scroll thumbnail into view
    if (thumbnailRef.current) {
      const thumbnail = thumbnailRef.current.children[index] as HTMLElement
      if (thumbnail) {
        thumbnail.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })
      }
    }
  }

  const nextImage = () => {
    if (product && currentImageIndex < product.images.length - 1) {
      goToImage(currentImageIndex + 1)
    }
  }

  const prevImage = () => {
    if (currentImageIndex > 0) {
      goToImage(currentImageIndex - 1)
    }
  }

  const colors = useMemo(() => {
    return (
      product?.variants.reduce((acc, v) => {
        if (!acc.find((c) => c.colour === v.colour)) {
          acc.push({ colour: v.colour, colour_hex: v.colour_hex })
        }
        return acc
      }, [] as Array<{ colour: string; colour_hex: string }>) || []
    )
  }, [product?.variants])

  const sizes = useMemo(() => {
    return (
      product?.variants
        .filter((v) => !selectedColor || v.colour === selectedColor)
        .reduce((acc, v) => {
          if (!acc.includes(v.size)) acc.push(v.size)
          return acc
        }, [] as string[]) || []
    )
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

  const selectedVariant = useMemo(() => {
    return product?.variants.find(
      (v) => v.colour === selectedColor && v.size === selectedSize,
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

  useEffect(() => {
    const webApp = getTelegramWebApp()
    if (webApp && product && selectedVariant) {
      webApp.MainButton.setParams({
        text: isAddingToCart
          ? 'Adding...'
          : `Add to Cart - £${product.price.toFixed(2)}`,
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
        <Container
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div style={{ textAlign: 'center', padding: 40, color: '#e5e7eb' }}>
            <div style={{ fontSize: 42, marginBottom: 12 }}>😕</div>
            <div
              style={{
                fontSize: 17,
                fontWeight: 600,
                marginBottom: 6,
              }}
            >
              Product not found
            </div>
            <div
              style={{
                fontSize: 13,
                color: 'rgba(148,163,184,0.95)',
              }}
            >
              This item may no longer be available
            </div>
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
          <ImageShell
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <Header>
              <IconButton onClick={() => router.back()}>
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                >
                  <path d="M19 12H5" />
                  <path d="M12 19l-7-7 7-7" />
                </svg>
              </IconButton>
              <IconButton onClick={handleToggleWishlist}>
                <svg
                  viewBox="0 0 24 24"
                  fill={isInWishlist(product.id) ? '#f97373' : 'none'}
                  stroke={isInWishlist(product.id) ? '#f97373' : 'currentColor'}
                  strokeWidth="2"
                >
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
              </IconButton>
            </Header>

            <ImageSlider style={{ transform: `translateX(-${currentImageIndex * 100}%)` }}>
              {product.images.map((img, idx) => (
                <ImageSlide key={idx}>
                  <Image
                    src={img}
                    alt={`${product.name} - Image ${idx + 1}`}
                    fill
                    style={{ objectFit: 'cover' }}
                    priority={idx === 0}
                  />
                </ImageSlide>
              ))}
            </ImageSlider>

            {/* Navigation arrows */}
            {product.images.length > 1 && (
              <>
                {currentImageIndex > 0 && (
                  <GalleryNav side="left" onClick={prevImage}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                      <path d="M15 18l-6-6 6-6" />
                    </svg>
                  </GalleryNav>
                )}
                {currentImageIndex < product.images.length - 1 && (
                  <GalleryNav side="right" onClick={nextImage}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                      <path d="M9 18l6-6-6-6" />
                    </svg>
                  </GalleryNav>
                )}
              </>
            )}

            {/* Image counter */}
            {product.images.length > 1 && (
              <ImageCounter>
                {currentImageIndex + 1} / {product.images.length}
              </ImageCounter>
            )}
          </ImageShell>

          {/* Thumbnail strip */}
          {product.images.length > 1 && (
            <ThumbnailStrip ref={thumbnailRef}>
              {product.images.map((img, idx) => (
                <Thumbnail
                  key={idx}
                  active={idx === currentImageIndex}
                  onClick={() => goToImage(idx)}
                >
                  <Image
                    src={img}
                    alt={`Thumbnail ${idx + 1}`}
                    fill
                    style={{ objectFit: 'cover' }}
                  />
                </Thumbnail>
              ))}
            </ThumbnailStrip>
          )}

          <Content>
            <PriceRow>
              <PriceTextWrap>
                <Price>£{product.price.toFixed(2)}</Price>
                {product.originalPrice && (
                  <OldPrice>£{product.originalPrice.toFixed(2)}</OldPrice>
                )}
              </PriceTextWrap>
              {discountPercent > 0 && (
                <DiscountBadge>-{discountPercent}%</DiscountBadge>
              )}
            </PriceRow>

            <Name>{product.name}</Name>

            <MetaRow>
              <RatingRow>
                <Stars>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg
                      key={star}
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                  ))}
                </Stars>
                <RatingText>4.8 (128 reviews)</RatingText>
              </RatingRow>
              <MicroMeta>Ships in 1–3 days</MicroMeta>
            </MetaRow>

            <Description>
              {product.description ||
                'Premium quality piece from Source The Sauce. Curated for style, fit, and comfort.'}
            </Description>

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
          <BottomInner>
            <QuantityControl>
              <QtyButton
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                disabled={quantity <= 1}
              >
                −
              </QtyButton>
              <QtyValue>{quantity}</QtyValue>
              <QtyButton onClick={() => setQuantity((q) => q + 1)}>+</QtyButton>
            </QuantityControl>
            <AddToCartButton
              onClick={handleAddToCart}
              disabled={isAddingToCart || !selectedVariant}
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 0 1-8 0" />
              </svg>
              {isAddingToCart
                ? 'Adding...'
                : `Add · £${(product.price * quantity).toFixed(2)}`}
            </AddToCartButton>
          </BottomInner>
        </BottomBar>
      </TelegramLayout>
    </>
  )
}

export const getServerSideProps: GetServerSideProps<ProductPageProps> = async ({
  params,
}) => {
  const id = params?.id as string

  const { data: product } = await supabase
    .from('products')
    .select(
      `
      *,
      images:product_images(url, position),
      variants:product_variants(id, colour, colour_hex, size)
    `,
    )
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
        images:
          product.images
            ?.sort((a: any, b: any) => a.position - b.position)
            .map((img: any) => img.url) || [],
        variants: product.variants || [],
      },
    },
  }
}
