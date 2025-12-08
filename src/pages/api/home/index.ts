import type { NextApiRequest, NextApiResponse } from 'next'
import { supabase } from '@/lib/supabase'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    // Fetch above fold banners
    const { data: aboveFold, error: aboveFoldError } = await supabase
      .from('home_content')
      .select('*')
      .eq('section_type', 'above_fold')
      .eq('is_active', true)
      .order('sort_order', { ascending: true })

    if (aboveFoldError) {
      console.error('Error fetching above_fold:', aboveFoldError)
    }

    // Fetch season sale
    const { data: seasonSaleData, error: seasonSaleError } = await supabase
      .from('home_content')
      .select('*')
      .eq('section_type', 'season_sale')
      .eq('is_active', true)
      .limit(1)

    if (seasonSaleError) {
      console.error('Error fetching season_sale:', seasonSaleError)
    }

    const seasonSale = seasonSaleData?.[0] || null

    // Fetch collection banners (woman, man, kids)
    const { data: collectionBanners, error: collectionBannersError } = await supabase
      .from('home_content')
      .select('*')
      .eq('section_type', 'collection_banner')
      .eq('is_active', true)
      .order('sort_order', { ascending: true })

    if (collectionBannersError) {
      console.error('Error fetching collection_banner:', collectionBannersError)
    }

    // Fetch collections
    const { data: collections, error: collectionsError } = await supabase
      .from('home_content')
      .select('*')
      .eq('section_type', 'collection')
      .eq('is_active', true)
      .order('sort_order', { ascending: true })

    if (collectionsError) {
      console.error('Error fetching collections:', collectionsError)
    }

    // Fetch all featured products with their product details
    const { data: featuredProducts, error: featuredError } = await supabase
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
      .eq('is_active', true)
      .order('sort_order', { ascending: true })

    if (featuredError) {
      console.error('Error fetching featured products:', featuredError)
    }

    // Helper function to map product to expected format
    const mapProduct = (fp: any) => {
      const product = fp.product
      if (!product) return null

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
        sizes: product.sizes?.map((s: any) => ({
          label: s.label,
          value: s.stock_quantity
        })) || [],
        colors: product.colors?.map((c: any) => ({
          color: c.hex_value,
          value: c.hex_value
        })) || [],
        images: product.images
          ?.sort((a: any, b: any) => a.sort_order - b.sort_order)
          .map((img: any) => img.image_url) || [],
      }
    }

    // Filter and map products by section
    const arrivals = featuredProducts
      ?.filter((fp: any) => fp.section_name === 'arrivals')
      .map(mapProduct)
      .filter(Boolean) || []

    // Build trending sections
    const tranding = [
      {
        id: 1,
        title: 'Best Sale',
        products: featuredProducts
          ?.filter((fp: any) => fp.section_name === 'best_sale')
          .map(mapProduct)
          .filter(Boolean) || []
      },
      {
        id: 2,
        title: 'Top Rate',
        products: featuredProducts
          ?.filter((fp: any) => fp.section_name === 'top_rate')
          .map(mapProduct)
          .filter(Boolean) || []
      }
    ]

    // Transform above_fold to expected format
    const transformedAboveFold = aboveFold?.map((item: any) => ({
      title: item.title,
      sub_title: item.subtitle,
      image: item.image_url,
      action: {
        label: item.action_label || 'get collection',
        path: item.action_path || ''
      }
    })) || []

    // Transform collection_banners to expected format
    const transformedCollectionBanners = collectionBanners?.map((item: any) => ({
      image: item.image_url,
      collection_type: item.metadata?.collection_type || item.title?.toLowerCase()
    })) || []

    // Transform collections to expected format
    const transformedCollections = collections?.map((item: any) => ({
      id: item.id,
      title: item.title,
      action: {
        label: item.action_label || 'shop now',
        path: item.action_path || ''
      },
      image: item.image_url
    })) || []

    // Transform season_sale to expected format
    const transformedSeasonSale = seasonSale ? {
      title: seasonSale.title,
      description: seasonSale.description || seasonSale.subtitle,
      image: seasonSale.image_url,
      action: {
        label: seasonSale.action_label || 'shop the sale',
        path: seasonSale.action_path || ''
      }
    } : null

    return res.status(200).json({
      above_fold: transformedAboveFold,
      tranding,
      collection_banner: transformedCollectionBanners,
      arrivals,
      season_sale: transformedSeasonSale,
      collections: transformedCollections,
    })

  } catch (error) {
    console.error('Home content API error:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}
