import { Head } from "@/components"
import { ProductLayout } from "@/layout/product"
import { ProductPageProps } from "@/layout/product/types"
import { GetServerSideProps, InferGetServerSidePropsType } from "next"
import { supabase } from '@/lib/supabase'

export const getServerSideProps: GetServerSideProps<ProductPageProps> = async (context) => {
  const { id } = context.query

  // Fetch product with all related data from Supabase
  const { data: product, error } = await supabase
    .from('products')
    .select(`
      *,
      category:categories(*),
      images:product_images(*),
      sizes:product_sizes(*),
      colors:product_colors(*),
      promotion:promotions(*)
    `)
    .eq('id', id)
    .eq('is_active', true)
    .single()

  if (error || !product) {
    return { notFound: true }
  }

  // Transform to expected format
  const activePromotion = product.promotion?.find((p: any) => p.is_active)
  const discountValue = activePromotion?.discount_percent 
    ? activePromotion.discount_percent / 100 
    : 0

  const transformedProduct = {
    id: product.id,
    sku: product.sku,
    name: product.name,
    description: product.description,
    brand: product.brand,
    price: product.price,
    rate: product.rating,
    is_new: product.is_new,
    is_sold_out: product.is_sold_out,
    promotion: {
      value: discountValue,
      end_date: activePromotion?.end_date || ''
    },
    sizes: product.sizes
      ?.sort((a: any, b: any) => a.sort_order - b.sort_order)
      .map((s: any) => ({
        label: s.label,
        value: s.stock_quantity
      })) || [],
    colors: product.colors
      ?.sort((a: any, b: any) => a.sort_order - b.sort_order)
      .map((c: any) => ({
        color: c.hex_value,
        value: c.hex_value
      })) || [],
    images: product.images
      ?.sort((a: any, b: any) => a.position - b.position)
      .map((img: any) => img.url) || [],
  }

  return {
    props: {
      data: transformedProduct as any
    }
  }
}

export default function ProductPage (props: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const { data } = props

  return (
    <>
      <Head 
        title={`${data.name} | Floreza`}
        description={data.description}
      />
      <ProductLayout {...props} />
    </>
  )
}