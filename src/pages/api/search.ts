import type { NextApiRequest, NextApiResponse } from 'next'
import { supabase } from '@/lib/supabase'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { q, limit = '10' } = req.query

  if (!q || typeof q !== 'string' || q.length < 2) {
    return res.status(400).json({ error: 'Search query must be at least 2 characters' })
  }

  try {
    const limitNum = Math.min(parseInt(limit as string, 10) || 10, 20)
    
    // Search products
    const { data: products, error } = await supabase
      .from('products')
      .select(`
        id,
        sku,
        name,
        price,
        images:product_images(image_url, is_primary),
        promotion:promotions(discount_percent, is_active)
      `)
      .eq('is_active', true)
      .or(`name.ilike.%${q}%,description.ilike.%${q}%,sku.ilike.%${q}%`)
      .limit(limitNum)

    if (error) {
      throw error
    }

    // Transform results
    const results = products?.map((product: any) => {
      const activePromotion = product.promotion?.find((p: any) => p.is_active)
      const discountPercent = activePromotion?.discount_percent || 0
      const finalPrice = discountPercent > 0 
        ? product.price * (1 - discountPercent / 100) 
        : product.price

      return {
        id: product.id,
        sku: product.sku,
        name: product.name,
        price: product.price,
        discount_percent: discountPercent,
        final_price: Math.round(finalPrice * 100) / 100,
        image: product.images?.find((img: any) => img.is_primary)?.image_url || product.images?.[0]?.image_url,
      }
    }) || []

    // Also search categories
    const { data: categories } = await supabase
      .from('categories')
      .select('id, slug, name')
      .eq('is_active', true)
      .ilike('name', `%${q}%`)
      .limit(5)

    return res.status(200).json({
      products: results,
      categories: categories || [],
      query: q,
    })

  } catch (error) {
    console.error('Search API error:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}
