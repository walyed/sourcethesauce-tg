import { Container, Typography } from '@/components'
import { ProductItem } from '@/layout/home/components/product-item'
import * as Styles from './styles'
import { CategoryProps } from './types'

export function CategoryLayout (props: CategoryProps) {
  const { data } = props
  const { category, products } = data || {}

  if (!category) {
    return (
      <Styles.Container>
        <Container size="md">
          <Typography size="lg" color="heading">Category not found</Typography>
        </Container>
      </Styles.Container>
    )
  }

  return (
    <Styles.Container>
      <Container size="md">
        <Styles.Header>
          <Typography as="h1" size="xlg" color="heading" fontWeight="600">
            {category.name}
          </Typography>
          {category.description && (
            <Typography size="md" color="text">
              {category.description}
            </Typography>
          )}
          <Typography size="sm" color="text">
            {products?.length || 0} products
          </Typography>
        </Styles.Header>
        
        <Styles.ProductGrid>
          {products?.map((product: any) => (
            <ProductItem key={product.id} data={product} />
          ))}
        </Styles.ProductGrid>

        {(!products || products.length === 0) && (
          <Styles.EmptyState>
            <Typography size="md" color="text">
              No products found in this category.
            </Typography>
          </Styles.EmptyState>
        )}
      </Container>
    </Styles.Container>
  )
}