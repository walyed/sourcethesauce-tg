import type { NextApiRequest, NextApiResponse } from 'next'
import { supabase } from '@/lib/supabase'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { slug } = req.query

  if (!slug || typeof slug !== 'string') {
    return res.status(400).json({ error: 'Category slug is required' })
  }

  try {
    // Fetch category
    const { data: category, error: categoryError } = await supabase
      .from('categories')
      .select('*')
      .eq('slug', slug)
      .eq('is_active', true)
      .single()

    if (categoryError) {
      if (categoryError.code === 'PGRST116') {
        return res.status(404).json({ error: 'Category not found' })
      }
      throw categoryError
    }

    // Fetch products in this category
    const {
      sortBy = 'created_at',
      sortOrder = 'desc',
      page = '1',
      limit = '12',
      minPrice,
      maxPrice,
    } = req.query

    let productsQuery = supabase
      .from('products')
      .select(`
        *,
        images:product_images(*),
        sizes:product_sizes(*),
        colors:product_colors(*),
        promotion:promotions(*)
      `, { count: 'exact' })
      .eq('category_id', category.id)
      .eq('is_active', true)

    if (minPrice) {
      productsQuery = productsQuery.gte('price', parseFloat(minPrice as string))
    }

    if (maxPrice) {
      productsQuery = productsQuery.lte('price', parseFloat(maxPrice as string))
    }

    // Apply sorting
    const validSortFields = ['price', 'name', 'created_at', 'rating']
    const sortField = validSortFields.includes(sortBy as string) ? sortBy as string : 'created_at'
    const ascending = sortOrder === 'asc'
    productsQuery = productsQuery.order(sortField, { ascending })

    // Apply pagination
    const pageNum = parseInt(page as string, 10) || 1
    const limitNum = Math.min(parseInt(limit as string, 10) || 12, 50)
    const offset = (pageNum - 1) * limitNum

    productsQuery = productsQuery.range(offset, offset + limitNum - 1)

    const { data: products, error: productsError, count } = await productsQuery

    if (productsError) {
      throw productsError
    }

    // Transform products
    const transformedProducts = products?.map((product: any) => {
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
    })

    return res.status(200).json({
      category,
      products: transformedProducts,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limitNum),
      },
    })

  } catch (error) {
    console.error('Category API error:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}
