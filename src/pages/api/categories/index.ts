import type { NextApiRequest, NextApiResponse } from 'next'
import { supabase } from '@/lib/supabase'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { includeProducts, activeOnly = 'true' } = req.query

    let query = supabase
      .from('categories')
      .select('*')
      .order('sort_order', { ascending: true })

    if (activeOnly === 'true') {
      query = query.eq('is_active', true)
    }

    const { data: categories, error } = await query

    if (error) {
      console.error('Categories fetch error:', error)
      return res.status(500).json({ error: 'Failed to fetch categories' })
    }

    // If includeProducts is true, fetch product counts for each category
    if (includeProducts === 'true') {
      const categoriesWithCounts = await Promise.all(
        categories.map(async (category: any) => {
          const { count } = await supabase
            .from('products')
            .select('*', { count: 'exact', head: true })
            .eq('category_id', category.id)
            .eq('is_active', true)

          return {
            ...category,
            product_count: count || 0,
          }
        })
      )

      return res.status(200).json({ categories: categoriesWithCounts })
    }

    return res.status(200).json({ categories })

  } catch (error) {
    console.error('Categories API error:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}
