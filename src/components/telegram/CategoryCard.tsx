import Link from 'next/link'
import Image from 'next/image'
import { styled } from 'stitches.config'

const Card = styled(Link, {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  textDecoration: 'none',
  gap: 8,
  
  '&:active': {
    transform: 'scale(0.95)',
  }
})

const ImageWrapper = styled('div', {
  position: 'relative',
  width: '100%',
  aspectRatio: '1',
  borderRadius: 16,
  overflow: 'hidden',
  boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
  backgroundColor: 'var(--tg-theme-secondary-bg-color, #f5f5f5)',
})

const Name = styled('span', {
  color: 'var(--tg-theme-text-color, #000000)',
  fontSize: 11,
  fontWeight: 600,
  textAlign: 'center',
  lineHeight: 1.3,
  maxWidth: '100%',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
})

interface CategoryCardProps {
  slug: string
  name: string
  image: string
}

export function CategoryCard({ slug, name, image }: CategoryCardProps) {
  return (
    <Card href={`/tg/category/${slug}`}>
      <ImageWrapper>
        <Image
          src={image}
          alt={name}
          fill
          style={{ objectFit: 'cover' }}
          sizes="(max-width: 768px) 33vw, 25vw"
        />
      </ImageWrapper>
      <Name>{name}</Name>
    </Card>
  )
}

// Pill style variant for horizontal lists
const PillCard = styled(Link, {
  display: 'flex',
  alignItems: 'center',
  gap: 10,
  padding: '8px 14px 8px 8px',
  borderRadius: 100,
  backgroundColor: 'var(--tg-theme-bg-color, #ffffff)',
  boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
  textDecoration: 'none',
  flexShrink: 0,
  
  '&:active': {
    transform: 'scale(0.98)',
  }
})

const PillImage = styled('div', {
  position: 'relative',
  width: 36,
  height: 36,
  borderRadius: '50%',
  overflow: 'hidden',
  backgroundColor: 'var(--tg-theme-secondary-bg-color, #f5f5f5)',
})

const PillName = styled('span', {
  fontSize: 13,
  fontWeight: 600,
  color: 'var(--tg-theme-text-color, #000000)',
  whiteSpace: 'nowrap',
})

export function CategoryPill({ slug, name, image }: CategoryCardProps) {
  return (
    <PillCard href={`/tg/category/${slug}`}>
      <PillImage>
        <Image
          src={image}
          alt={name}
          fill
          style={{ objectFit: 'cover' }}
          sizes="36px"
        />
      </PillImage>
      <PillName>{name}</PillName>
    </PillCard>
  )
}

export default CategoryCard
