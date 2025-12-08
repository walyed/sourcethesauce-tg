import { NextApiRequest, NextApiResponse } from "next";
import { supabase } from '@/lib/supabase'

export default async function handler (req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' })

  const { id } = req.query

  try {
    // Fetch product with all related data
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
      return res.status(404).json({ error: 'Product not found' })
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
        ?.sort((a: any, b: any) => a.sort_order - b.sort_order)
        .map((img: any) => img.image_url) || [],
    }

    return res.status(200).json(transformedProduct)
  } catch (error) {
    console.error('Product API error:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}