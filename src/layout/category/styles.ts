import { styled } from 'stitches.config'

export const Container = styled('main', {
  padding: '2rem 0',
  minHeight: '100vh',
})

export const Header = styled('div', {
  marginBottom: '2rem',
  display: 'flex',
  flexDirection: 'column',
  gap: '0.5rem',
})

export const ProductGrid = styled('div', {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
  gap: '1.5rem',
})

export const EmptyState = styled('div', {
  textAlign: 'center',
  padding: '4rem 2rem',
})