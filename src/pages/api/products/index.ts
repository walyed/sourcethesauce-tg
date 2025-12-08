import type { NextApiRequest, NextApiResponse } from 'next'
import { supabase } from '@/lib/supabase'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const {
      category,
      search,
      minPrice,
      maxPrice,
      brand,
      isNew,
      isFeatured,
      sortBy = 'created_at',
      sortOrder = 'desc',
      page = '1',
      limit = '12',
    } = req.query

    // Build the query
    let query = supabase
      .from('products')
      .select(`
        *,
        category:categories(*),
        images:product_images(*),
        sizes:product_sizes(*),
        colors:product_colors(*),
        promotion:promotions(*)
      `, { count: 'exact' })
      .eq('is_active', true)

    // Apply filters
    if (category) {
      // Get category by slug
      const { data: categoryData } = await supabase
        .from('categories')
        .select('id')
        .eq('slug', category as string)
        .single()
      
      if (categoryData) {
        query = query.eq('category_id', categoryData.id)
      }
    }

    if (search) {
      query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%,sku.ilike.%${search}%`)
    }

    if (minPrice) {
      query = query.gte('price', parseFloat(minPrice as string))
    }

    if (maxPrice) {
      query = query.lte('price', parseFloat(maxPrice as string))
    }

    if (brand) {
      query = query.eq('brand', brand as string)
    }

    if (isNew === 'true') {
      query = query.eq('is_new', true)
    }

    if (isFeatured === 'true') {
      query = query.eq('is_featured', true)
    }

    // Apply sorting
    const validSortFields = ['price', 'name', 'created_at', 'rating']
    const sortField = validSortFields.includes(sortBy as string) ? sortBy as string : 'created_at'
    const ascending = sortOrder === 'asc'
    query = query.order(sortField, { ascending })

    // Apply pagination
    const pageNum = parseInt(page as string, 10) || 1
    const limitNum = Math.min(parseInt(limit as string, 10) || 12, 50) // Max 50 items per page
    const offset = (pageNum - 1) * limitNum

    query = query.range(offset, offset + limitNum - 1)

    // Execute query
    const { data: products, error, count } = await query

    if (error) {
      console.error('Products fetch error:', error)
      return res.status(500).json({ error: 'Failed to fetch products' })
    }

    // Transform products to include calculated fields
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
      products: transformedProducts,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limitNum),
      },
    })

  } catch (error) {
    console.error('Products API error:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}
