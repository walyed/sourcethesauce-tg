import type { NextApiRequest, NextApiResponse } from 'next'
import { supabaseAdmin } from '@/lib/supabase'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // GET - Fetch cart
  if (req.method === 'GET') {
    const { userId, sessionId, telegramId } = req.query

    if (!userId && !sessionId && !telegramId) {
      return res.status(400).json({ error: 'userId, sessionId, or telegramId is required' })
    }

    try {
      let profileId = userId as string | undefined

      // If telegramId provided, get the profile ID
      if (telegramId) {
        const { data: profile } = await supabaseAdmin
          .from('profiles')
          .select('id')
          .eq('telegram_id', parseInt(telegramId as string, 10))
          .single()

        if (profile) {
          profileId = profile.id
        }
      }

      // Build query
      let query = supabaseAdmin
        .from('carts')
        .select(`
          *,
          items:cart_items(
            *,
            product:products(
              id,
              sku,
              name,
              price,
              is_sold_out,
              images:product_images(image_url, is_primary),
              promotion:promotions(discount_percent, is_active)
            ),
            size:product_sizes(id, label),
            color:product_colors(id, name, hex_value)
          )
        `)

      if (profileId) {
        query = query.eq('user_id', profileId)
      } else if (sessionId) {
        query = query.eq('session_id', sessionId)
      }

      const { data: cart, error } = await query.single()

      if (error && error.code !== 'PGRST116') {
        throw error
      }

      if (!cart) {
        return res.status(200).json({ 
          cart: null,
          items: [],
          totals: { subtotal: 0, discount: 0, total: 0, itemCount: 0 }
        })
      }

      // Transform cart items
      const items = cart.items?.map((item: any) => {
        const product = item.product
        const activePromotion = product?.promotion?.find((p: any) => p.is_active)
        const discountPercent = activePromotion?.discount_percent || 0
        const finalPrice = discountPercent > 0 
          ? product.price * (1 - discountPercent / 100) 
          : product.price

        return {
          id: item.id,
          product_id: item.product_id,
          quantity: item.quantity,
          unit_price: item.unit_price,
          product: {
            id: product.id,
            sku: product.sku,
            name: product.name,
            price: product.price,
            final_price: Math.round(finalPrice * 100) / 100,
            discount_percent: discountPercent,
            is_sold_out: product.is_sold_out,
            image: product.images?.find((img: any) => img.is_primary)?.image_url || product.images?.[0]?.image_url,
          },
          size: item.size,
          color: item.color,
          line_total: Math.round(finalPrice * item.quantity * 100) / 100,
        }
      }) || []

      // Calculate totals
      const subtotal = items.reduce((sum: number, item: any) => sum + (item.product.price * item.quantity), 0)
      const total = items.reduce((sum: number, item: any) => sum + item.line_total, 0)
      const discount = subtotal - total
      const itemCount = items.reduce((sum: number, item: any) => sum + item.quantity, 0)

      return res.status(200).json({
        cart: {
          id: cart.id,
          user_id: cart.user_id,
          session_id: cart.session_id,
        },
        items,
        totals: {
          subtotal: Math.round(subtotal * 100) / 100,
          discount: Math.round(discount * 100) / 100,
          total: Math.round(total * 100) / 100,
          itemCount,
        }
      })

    } catch (error) {
      console.error('Cart fetch error:', error)
      return res.status(500).json({ error: 'Failed to fetch cart' })
    }
  }

  return res.status(405).json({ error: 'Method not allowed' })
}
