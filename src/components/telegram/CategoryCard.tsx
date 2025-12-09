import Link from 'next/link'
import Image from 'next/image'
import { styled } from 'stitches.config'

const Card = styled(Link, {
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'stretch',
  textDecoration: 'none',
  gap: 8,
  transform: 'translateZ(0)',
  WebkitTapHighlightColor: 'transparent',

  '&:active': {
    transform: 'scale(0.96) translateZ(0)',
  },
})

const ImageWrapper = styled('div', {
  position: 'relative',
  width: '100%',
  aspectRatio: '1',
  borderRadius: 18,
  overflow: 'hidden',
  backgroundColor: 'var(--tg-theme-secondary-bg-color, #020617)',
  boxShadow: '0 12px 28px rgba(15,23,42,0.6)',
  border: '1px solid rgba(148,163,184,0.45)',
})

const ImageOverlay = styled('div', {
  position: 'absolute',
  inset: 0,
  background:
    'linear-gradient(to top, rgba(15,23,42,0.92), rgba(15,23,42,0.35), transparent)',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'flex-end',
  padding: 10,
})

const NameRow = styled('div', {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 8,
})

const Name = styled('span', {
  color: '#f9fafb',
  fontSize: 12,
  fontWeight: 700,
  textAlign: 'left',
  lineHeight: 1.3,
  maxWidth: '100%',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
})

const Count = styled('span', {
  fontSize: 10,
  fontWeight: 600,
  color: 'rgba(148,163,184,0.95)',
  whiteSpace: 'nowrap',
})

const TapHint = styled('span', {
  marginTop: 2,
  fontSize: 10,
  color: 'rgba(148,163,184,0.95)',
})

const Badge = styled('span', {
  position: 'absolute',
  top: 8,
  left: 8,
  borderRadius: 999,
  padding: '3px 8px',
  fontSize: 10,
  fontWeight: 700,
  textTransform: 'uppercase',
  letterSpacing: '0.06em',
  background:
    'linear-gradient(135deg, rgba(94,234,212,0.95), rgba(59,130,246,0.95))',
  color: '#020617',
  boxShadow: '0 8px 18px rgba(15,23,42,0.9)',
})

// Props

export interface CategoryCardProps {
  slug: string
  name: string
  image: string
  itemCount?: number
  badge?: string
}

export function CategoryCard({ slug, name, image, itemCount, badge }: CategoryCardProps) {
  const safeImage =
    image ||
    'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=400&fit=crop'

  return (
    <Card href={`/tg/category/${slug}`} aria-label={name}>
      <ImageWrapper>
        <Image
          src={safeImage}
          alt={name}
          fill
          style={{ objectFit: 'cover' }}
          sizes="(max-width: 768px) 33vw, 25vw"
        />
        <ImageOverlay>
          <NameRow>
            <Name>{name}</Name>
            {typeof itemCount === 'number' && itemCount >= 0 && (
              <Count>
                {itemCount} item{itemCount === 1 ? '' : 's'}
              </Count>
            )}
          </NameRow>
          <TapHint>Tap to browse</TapHint>
        </ImageOverlay>
        {badge && <Badge>{badge}</Badge>}
      </ImageWrapper>
    </Card>
  )
}

// Pill style variant for horizontal lists

const PillCard = styled(Link, {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 10,
  padding: '7px 14px 7px 7px',
  borderRadius: 999,
  background:
    'linear-gradient(135deg, rgba(15,23,42,0.96), rgba(15,23,42,0.94))',
  boxShadow: '0 12px 30px rgba(15,23,42,0.85)',
  textDecoration: 'none',
  flexShrink: 0,
  border: '1px solid rgba(148,163,184,0.5)',
  transform: 'translateZ(0)',
  WebkitTapHighlightColor: 'transparent',

  '&:active': {
    transform: 'scale(0.97) translateZ(0)',
  },
})

const PillImage = styled('div', {
  position: 'relative',
  width: 34,
  height: 34,
  borderRadius: '50%',
  overflow: 'hidden',
  backgroundColor: 'var(--tg-theme-secondary-bg-color, #020617)',
  boxShadow: '0 6px 16px rgba(15,23,42,0.9)',
})

const PillTextWrap = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  minWidth: 0,
})

const PillName = styled('span', {
  fontSize: 12,
  fontWeight: 600,
  color: '#e5e7eb',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
})

const PillMeta = styled('span', {
  fontSize: 10,
  color: 'rgba(148,163,184,0.95)',
})

const PillChevron = styled('span', {
  marginLeft: 4,
  fontSize: 12,
  color: 'rgba(148,163,184,0.9)',
})

interface CategoryPillProps extends CategoryCardProps {
  compactMeta?: boolean
}

export function CategoryPill({ slug, name, image, itemCount, badge, compactMeta }: CategoryPillProps) {
  const safeImage =
    image ||
    'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=200&h=200&fit=crop'

  return (
    <PillCard href={`/tg/category/${slug}`} aria-label={name}>
      <PillImage>
        <Image
          src={safeImage}
          alt={name}
          fill
          style={{ objectFit: 'cover' }}
          sizes="36px"
        />
      </PillImage>
      <PillTextWrap>
        <PillName>{name}</PillName>
        <PillMeta>
          {typeof itemCount === 'number' && itemCount >= 0
            ? compactMeta
              ? `${itemCount} item${itemCount === 1 ? '' : 's'}`
              : `${itemCount} item${itemCount === 1 ? '' : 's'} · Tap to view`
            : 'Tap to view'}
        </PillMeta>
      </PillTextWrap>
      <PillChevron>›</PillChevron>
      {badge && (
        <Badge
          style={{
            position: 'static',
            marginLeft: 6,
            fontSize: 9,
            padding: '2px 6px',
          }}
        >
          {badge}
        </Badge>
      )}
    </PillCard>
  )
}

export default CategoryCard
