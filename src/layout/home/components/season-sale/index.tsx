import { Box, Button, Container, Typography } from '@/components'
import Image from 'next/image'
import * as Styles from './styles'
import { SeasonSaleProps } from './types'

export function SeasonSale (props: SeasonSaleProps) {
  const { data } = props

  // Return null if no data
  if (!data) return null

  return (
    <Container size="lg">
      <Styles.Container>
        <Styles.Content>
          <Styles.Title>{data.title}</Styles.Title>
          <Styles.Description>{data.description}</Styles.Description>
          <Box marginTop={2}>
            <Button as="a" href={data.action.path}>{data.action.label}</Button>
          </Box>
        </Styles.Content>
        <Styles.Figure>
          <Image src={data.image} alt={data.title} fill/>
        </Styles.Figure>
      </Styles.Container>
    </Container>
  )
}