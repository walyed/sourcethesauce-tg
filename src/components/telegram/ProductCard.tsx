import Link from 'next/link'
import Image from 'next/image'
import { styled } from 'stitches.config'

const Card = styled(Link, {
  display: 'block',
  backgroundColor: 'var(--tg-theme-bg-color, #ffffff)',
  borderRadius: 16,
  overflow: 'hidden',
  textDecoration: 'none',
  color: 'inherit',
  boxShadow: '0 10px 26px rgba(15,23,42,0.18)',
  border: '1px solid rgba(148,163,184,0.35)',
  transform: 'translateZ(0)',
  WebkitTapHighlightColor: 'transparent',
  transition: 'transform 0.16s ease, box-shadow 0.16s ease, border-color 0.16s ease',

  '&:active': {
    transform: 'scale(0.97) translateZ(0)',
    boxShadow: '0 4px 16px rgba(15,23,42,0.45)',
    borderColor: 'rgba(129,140,248,0.8)',
  },
})

const ImageContainer = styled('div', {
  position: 'relative',
  aspectRatio: '4/5',
  backgroundColor: 'var(--tg-theme-secondary-bg-color, #020617)',
  overflow: 'hidden',
})

const ImageOverlay = styled('div', {
  position: 'absolute',
  inset: 'auto 0 0 0',
  padding: '8px 10px',
  background:
    'linear-gradient(to top, rgba(15,23,42,0.96), rgba(15,23,42,0.45), transparent)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 8,
})

const SkuText = styled('span', {
  fontSize: 9,
  fontWeight: 600,
  color: 'rgba(209,213,219,0.96)',
  textTransform: 'uppercase',
  letterSpacing: '0.08em',
})

const QuickTag = styled('span', {
  fontSize: 9,
  fontWeight: 600,
  color: 'rgba(248,250,252,0.98)',
  padding: '3px 7px',
  borderRadius: 999,
  backgroundColor: 'rgba(15,23,42,0.75)',
})

const Badge = styled('span', {
  position: 'absolute',
  top: 8,
  left: 8,
  padding: '4px 10px',
  borderRadius: 999,
  fontSize: 9,
  fontWeight: 700,
  letterSpacing: '0.5px',
  textTransform: 'uppercase',
  zIndex: 1,

  variants: {
    type: {
      new: {
        background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
        color: '#022c22',
        boxShadow: '0 6px 16px rgba(22,163,74,0.55)',
      },
      sale: {
        background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
        color: '#fef2f2',
        boxShadow: '0 6px 16px rgba(220,38,38,0.55)',
      },
      hot: {
        background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
        color: '#fff7ed',
        boxShadow: '0 6px 16px rgba(234,88,12,0.55)',
      },
    },
  },
})

const Info = styled('div', {
  padding: '10px 12px 11px',
})

const Name = styled('h3', {
  fontSize: 12,
  fontWeight: 600,
  margin: 0,
  marginBottom: 6,
  color: 'var(--tg-theme-text-color, #020617)',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  display: '-webkit-box',
  WebkitLineClamp: 2,
  WebkitBoxOrient: 'vertical',
  lineHeight: 1.4,
  minHeight: '34px',
})

const PriceRow = styled('div', {
  display: 'flex',
  alignItems: 'center',
  gap: 6,
})

const CurrentPrice = styled('span', {
  fontSize: 14,
  fontWeight: 800,
  background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
})

const OldPrice = styled('span', {
  fontSize: 11,
  color: 'var(--tg-theme-hint-color, #9ca3af)',
  textDecoration: 'line-through',
})

const DiscountBadge = styled('span', {
  fontSize: 9,
  fontWeight: 700,
  color: '#b91c1c',
  backgroundColor: '#fee2e2',
  padding: '2px 5px',
  borderRadius: 4,
  marginLeft: 'auto',
})

const MetaRow = styled('div', {
  marginTop: 4,
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  fontSize: 10,
  color: 'var(--tg-theme-hint-color, #9ca3af)',
})

const InCartPill = styled('span', {
  padding: '2px 7px',
  borderRadius: 999,
  backgroundColor: 'rgba(59,130,246,0.08)',
  color: '#2563eb',
  fontWeight: 600,
})

const LowStockText = styled('span', {
  fontWeight: 600,
  color: '#b91c1c',
})

// Props for main card

export interface ProductCardProps {
  id: string
  sku: string
  name: string
  price: number
  oldPrice?: number
  image: string
  isNew?: boolean
  isSale?: boolean
  /** Optional “hot” flag, e.g. best seller */
  isHot?: boolean
  /** Optional: show how many are already in cart */
  inCartQty?: number
  /** Optional: “Low stock”, “Last 1”, etc */
  lowStockLabel?: string
}

export function ProductCard({
  id,
  sku,
  name,
  price,
  oldPrice,
  image,
  isNew,
  isSale,
  isHot,
  inCartQty,
  lowStockLabel,
}: ProductCardProps) {
  const discount = oldPrice ? Math.round((1 - price / oldPrice) * 100) : 0

  // Prioritise badge: New > Sale > Hot
  let badgeType: 'new' | 'sale' | 'hot' | undefined
  let badgeLabel: string | undefined

  if (isNew) {
    badgeType = 'new'
    badgeLabel = 'New'
  } else if (isSale && discount > 0) {
    badgeType = 'sale'
    badgeLabel = 'Sale'
  } else if (isHot) {
    badgeType = 'hot'
    badgeLabel = 'Hot'
  }

  const safeImage =
    image ||
    'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&h=750&fit=crop'

  return (
    <Card href={`/tg/product/${id}/${sku}`} aria-label={name}>
      <ImageContainer>
        <Image
          src={safeImage}
          alt={name}
          fill
          style={{ objectFit: 'cover' }}
          sizes="(max-width: 768px) 50vw, 33vw"
        />
        {badgeType && badgeLabel && <Badge type={badgeType}>{badgeLabel}</Badge>}
        <ImageOverlay>
          <SkuText>{sku}</SkuText>
          <QuickTag>View details</QuickTag>
        </ImageOverlay>
      </ImageContainer>

      <Info>
        <Name>{name}</Name>
        <PriceRow>
          <CurrentPrice>£{price.toFixed(2)}</CurrentPrice>
          {oldPrice && oldPrice > price && (
            <OldPrice>£{oldPrice.toFixed(2)}</OldPrice>
          )}
          {discount > 0 && <DiscountBadge>-{discount}%</DiscountBadge>}
        </PriceRow>

        {(inCartQty && inCartQty > 0) || lowStockLabel ? (
          <MetaRow>
            {inCartQty && inCartQty > 0 ? (
              <InCartPill>
                In bag · {inCartQty}
              </InCartPill>
            ) : (
              <span />
            )}
            {lowStockLabel && <LowStockText>{lowStockLabel}</LowStockText>}
          </MetaRow>
        ) : null}
      </Info>
    </Card>
  )
}

// Compact variant for horizontal scrolling lists

const CompactCard = styled(Link, {
  display: 'block',
  width: 130,
  flexShrink: 0,
  backgroundColor: 'var(--tg-theme-bg-color, #ffffff)',
  borderRadius: 14,
  overflow: 'hidden',
  textDecoration: 'none',
  color: 'inherit',
  boxShadow: '0 8px 20px rgba(15,23,42,0.22)',
  border: '1px solid rgba(148,163,184,0.3)',
  transform: 'translateZ(0)',
  WebkitTapHighlightColor: 'transparent',
  transition: 'transform 0.16s ease, box-shadow 0.16s ease, border-color 0.16s ease',

  '&:active': {
    transform: 'scale(0.97) translateZ(0)',
    boxShadow: '0 4px 14px rgba(15,23,42,0.5)',
    borderColor: 'rgba(129,140,248,0.8)',
  },
})

const CompactImageContainer = styled('div', {
  position: 'relative',
  aspectRatio: '1',
  backgroundColor: 'var(--tg-theme-secondary-bg-color, #020617)',
})

const CompactBadge = styled('span', {
  position: 'absolute',
  top: 6,
  left: 6,
  padding: '3px 7px',
  borderRadius: 999,
  fontSize: 8,
  fontWeight: 700,
  letterSpacing: '0.05em',
  textTransform: 'uppercase',
  background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
  color: '#f9fafb',
})

const CompactInfo = styled('div', {
  padding: '8px 10px 9px',
})

const CompactName = styled('h3', {
  fontSize: 11,
  fontWeight: 500,
  margin: 0,
  marginBottom: 3,
  color: 'var(--tg-theme-text-color, #020617)',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
})

const CompactPriceRow = styled('div', {
  display: 'flex',
  alignItems: 'center',
  gap: 4,
})

const CompactPrice = styled('span', {
  fontSize: 12,
  fontWeight: 700,
  color: 'var(--tg-theme-text-color, #020617)',
})

const CompactOldPrice = styled('span', {
  fontSize: 9,
  color: 'var(--tg-theme-hint-color, #9ca3af)',
  textDecoration: 'line-through',
})

export interface ProductCardCompactProps {
  id: string
  sku: string
  name: string
  price: number
  image: string
  oldPrice?: number
  isNew?: boolean
}

export function ProductCardCompact({
  id,
  sku,
  name,
  price,
  image,
  oldPrice,
  isNew,
}: ProductCardCompactProps) {
  const hasDiscount = !!(oldPrice && oldPrice > price)
  const safeImage =
    image ||
    'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=400&fit=crop'

  return (
    <CompactCard href={`/tg/product/${id}/${sku}`} aria-label={name}>
      <CompactImageContainer>
        <Image
          src={safeImage}
          alt={name}
          fill
          style={{ objectFit: 'cover' }}
          sizes="130px"
        />
        {isNew && <CompactBadge>New</CompactBadge>}
      </CompactImageContainer>
      <CompactInfo>
        <CompactName>{name}</CompactName>
        <CompactPriceRow>
          <CompactPrice>£{price.toFixed(2)}</CompactPrice>
          {hasDiscount && oldPrice && (
            <CompactOldPrice>£{oldPrice.toFixed(2)}</CompactOldPrice>
          )}
        </CompactPriceRow>
      </CompactInfo>
    </CompactCard>
  )
}

export default ProductCard
