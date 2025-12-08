import { Head } from "@/components";
import { CategoryLayout } from "@/layout/category";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { supabase } from '@/lib/supabase'

interface CategoryPageProps {
  category: any
  products: any[]
}

export const getServerSideProps: GetServerSideProps<CategoryPageProps> = async (context) => {
  const { slug } = context.query

  // Fetch category
  const { data: category } = await supabase
    .from('categories')
    .select('*')
    .eq('slug', slug)
    .eq('is_active', true)
    .single()

  if (!category) {
    return { notFound: true }
  }

  // Fetch products in this category
  const { data: products } = await supabase
    .from('products')
    .select(`
      *,
      images:product_images(*),
      sizes:product_sizes(*),
      colors:product_colors(*),
      promotion:promotions(*)
    `)
    .eq('category_id', category.id)
    .eq('is_active', true)
    .order('created_at', { ascending: false })

  // Transform products to expected format
  const transformedProducts = products?.map((product: any) => {
    const activePromotion = product.promotion?.find((p: any) => p.is_active)
    const discountValue = activePromotion?.discount_percent 
      ? activePromotion.discount_percent / 100 
      : 0

    return {
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
  }) || []

  return {
    props: {
      category,
      products: transformedProducts
    }
  }
}

export default function CategoryPage (props: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const { category, products } = props

  return (
    <>
      <Head 
        title={`${category?.name || 'Category'} | Floreza`}
        description={category?.description || ''}
      />
      <CategoryLayout data={{ category, products }} />
    </>
  )
}