import Link from 'next/link'
import Image from 'next/image'
import { styled } from 'stitches.config'

const Card = styled(Link, {
  display: 'block',
  backgroundColor: 'var(--tg-theme-bg-color, #ffffff)',
  borderRadius: 14,
  overflow: 'hidden',
  textDecoration: 'none',
  color: 'inherit',
  boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
  transition: 'transform 0.2s ease',
  
  '&:active': {
    transform: 'scale(0.98)',
  }
})

const ImageContainer = styled('div', {
  position: 'relative',
  aspectRatio: '4/5',
  backgroundColor: 'var(--tg-theme-secondary-bg-color, #f5f5f5)',
  overflow: 'hidden',
})

const Badge = styled('span', {
  position: 'absolute',
  top: 8,
  left: 8,
  padding: '4px 10px',
  borderRadius: 100,
  fontSize: 9,
  fontWeight: 700,
  letterSpacing: '0.5px',
  textTransform: 'uppercase',
  zIndex: 1,
  
  variants: {
    type: {
      new: {
        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
        color: '#ffffff',
      },
      sale: {
        background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
        color: '#ffffff',
      },
      hot: {
        background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
        color: '#ffffff',
      }
    }
  }
})

const Info = styled('div', {
  padding: '10px 12px',
})

const Name = styled('h3', {
  fontSize: 12,
  fontWeight: 600,
  margin: 0,
  marginBottom: 6,
  color: 'var(--tg-theme-text-color, #000000)',
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
  fontWeight: 700,
  color: 'var(--tg-theme-text-color, #000000)',
})

const OldPrice = styled('span', {
  fontSize: 11,
  color: 'var(--tg-theme-hint-color, #999999)',
  textDecoration: 'line-through',
})

const DiscountBadge = styled('span', {
  fontSize: 9,
  fontWeight: 700,
  color: '#ef4444',
  backgroundColor: '#fef2f2',
  padding: '2px 5px',
  borderRadius: 4,
  marginLeft: 'auto',
})

interface ProductCardProps {
  id: string
  sku: string
  name: string
  price: number
  oldPrice?: number
  image: string
  isNew?: boolean
  isSale?: boolean
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
}: ProductCardProps) {
  const discount = oldPrice ? Math.round((1 - price / oldPrice) * 100) : 0

  return (
    <Card href={`/tg/product/${id}/${sku}`}>
      <ImageContainer>
        <Image
          src={image}
          alt={name}
          fill
          style={{ objectFit: 'cover' }}
          sizes="(max-width: 768px) 50vw, 33vw"
        />
        {isNew && <Badge type="new">New</Badge>}
        {isSale && !isNew && <Badge type="sale">Sale</Badge>}
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
  borderRadius: 12,
  overflow: 'hidden',
  textDecoration: 'none',
  color: 'inherit',
  boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
  
  '&:active': {
    transform: 'scale(0.98)',
  }
})

const CompactImageContainer = styled('div', {
  position: 'relative',
  aspectRatio: '1',
  backgroundColor: 'var(--tg-theme-secondary-bg-color, #f5f5f5)',
})

const CompactInfo = styled('div', {
  padding: '8px 10px',
})

const CompactName = styled('h3', {
  fontSize: 11,
  fontWeight: 500,
  margin: 0,
  marginBottom: 3,
  color: 'var(--tg-theme-text-color, #000000)',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
})

const CompactPrice = styled('span', {
  fontSize: 12,
  fontWeight: 700,
  color: 'var(--tg-theme-text-color, #000000)',
})

interface ProductCardCompactProps {
  id: string
  sku: string
  name: string
  price: number
  image: string
}

export function ProductCardCompact({
  id,
  sku,
  name,
  price,
  image,
}: ProductCardCompactProps) {
  return (
    <CompactCard href={`/tg/product/${id}/${sku}`}>
      <CompactImageContainer>
        <Image
          src={image}
          alt={name}
          fill
          style={{ objectFit: 'cover' }}
          sizes="130px"
        />
      </CompactImageContainer>
      <CompactInfo>
        <CompactName>{name}</CompactName>
        <CompactPrice>£{price.toFixed(2)}</CompactPrice>
      </CompactInfo>
    </CompactCard>
  )
}

export default ProductCard
