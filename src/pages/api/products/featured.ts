import type { NextApiRequest, NextApiResponse } from 'next'
import { supabase } from '@/lib/supabase'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { section } = req.query

  try {
    // If specific section requested
    if (section && typeof section === 'string') {
      const { data: featuredProducts, error } = await supabase
        .from('featured_products')
        .select(`
          *,
          product:products(
            *,
            images:product_images(*),
            sizes:product_sizes(*),
            colors:product_colors(*),
            promotion:promotions(*)
          )
        `)
        .eq('section_name', section)
        .eq('is_active', true)
        .order('sort_order', { ascending: true })

      if (error) {
        throw error
      }

      // Transform products
      const products = featuredProducts?.map((fp: any) => {
        const product = fp.product
        if (!product) return null

        const activePromotion = product.promotion?.find((p: any) => p.is_active)
        const discountPercent = activePromotion?.discount_percent || 0
        const finalPrice = discountPercent > 0 
          ? product.price * (1 - discountPercent / 100) 
          : product.price

        return {
          ...product,
          discount_percent: discountPercent,
          final_price: Math.round(finalPrice * 100) / 100,
          primary_image: product.images?.find((img: any) => img.is_primary)?.image_url || product.images?.[0]?.image_url,
        }
      }).filter(Boolean)

      return res.status(200).json({ 
        section,
        products 
      })
    }

    // Fetch all featured sections
    const sections = ['arrivals', 'best_sale', 'top_rate']
    const featuredData: Record<string, any[]> = {}

    for (const sectionName of sections) {
      const { data: featuredProducts } = await supabase
        .from('featured_products')
        .select(`
          *,
          product:products(
            *,
            images:product_images(*),
            promotion:promotions(*)
          )
        `)
        .eq('section_name', sectionName)
        .eq('is_active', true)
        .order('sort_order', { ascending: true })
        .limit(8)

      featuredData[sectionName] = featuredProducts?.map((fp: any) => {
        const product = fp.product
        if (!product) return null

        const activePromotion = product.promotion?.find((p: any) => p.is_active)
        const discountPercent = activePromotion?.discount_percent || 0
        const finalPrice = discountPercent > 0 
          ? product.price * (1 - discountPercent / 100) 
          : product.price

        return {
          ...product,
          discount_percent: discountPercent,
          final_price: Math.round(finalPrice * 100) / 100,
          primary_image: product.images?.find((img: any) => img.is_primary)?.image_url || product.images?.[0]?.image_url,
        }
      }).filter(Boolean) || []
    }

    return res.status(200).json({ featured: featuredData })

  } catch (error) {
    console.error('Featured products API error:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}
