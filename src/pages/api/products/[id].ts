import type { NextApiRequest, NextApiResponse } from 'next'
import { supabase } from '@/lib/supabase'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { id } = req.query

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ error: 'Product ID is required' })
  }

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

    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({ error: 'Product not found' })
      }
      console.error('Product fetch error:', error)
      return res.status(500).json({ error: 'Failed to fetch product' })
    }

    // Calculate discount and final price
    const activePromotion = product.promotion?.find((p: any) => p.is_active)
    const discountPercent = activePromotion?.discount_percent || 0
    const finalPrice = discountPercent > 0 
      ? product.price * (1 - discountPercent / 100) 
      : product.price

    // Sort images and get primary
    const sortedImages = product.images?.sort((a: any, b: any) => a.sort_order - b.sort_order) || []
    const primaryImage = sortedImages.find((img: any) => img.is_primary)?.image_url || sortedImages[0]?.image_url

    // Sort sizes and colors
    const sortedSizes = product.sizes?.sort((a: any, b: any) => a.sort_order - b.sort_order) || []
    const sortedColors = product.colors?.sort((a: any, b: any) => a.sort_order - b.sort_order) || []

    const transformedProduct = {
      ...product,
      images: sortedImages,
      sizes: sortedSizes,
      colors: sortedColors,
      discount_percent: discountPercent,
      final_price: Math.round(finalPrice * 100) / 100,
      primary_image: primaryImage,
    }

    return res.status(200).json({ product: transformedProduct })

  } catch (error) {
    console.error('Product API error:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}
