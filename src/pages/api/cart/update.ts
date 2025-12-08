import type { NextApiRequest, NextApiResponse } from 'next'
import { supabaseAdmin } from '@/lib/supabase'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'PUT') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { itemId, quantity } = req.body

  if (!itemId) {
    return res.status(400).json({ error: 'itemId is required' })
  }

  if (typeof quantity !== 'number' || quantity < 0) {
    return res.status(400).json({ error: 'Valid quantity is required' })
  }

  try {
    // If quantity is 0, delete the item
    if (quantity === 0) {
      const { error: deleteError } = await supabaseAdmin
        .from('cart_items')
        .delete()
        .eq('id', itemId)

      if (deleteError) throw deleteError

      return res.status(200).json({ 
        success: true, 
        message: 'Item removed from cart' 
      })
    }

    // Update quantity
    const { data: updatedItem, error: updateError } = await supabaseAdmin
      .from('cart_items')
      .update({ 
        quantity,
        updated_at: new Date().toISOString()
      })
      .eq('id', itemId)
      .select(`
        *,
        product:products(
          id,
          name,
          price,
          images:product_images(image_url, is_primary),
          promotion:promotions(discount_percent, is_active)
        )
      `)
      .single()

    if (updateError) {
      if (updateError.code === 'PGRST116') {
        return res.status(404).json({ error: 'Cart item not found' })
      }
      throw updateError
    }

    // Update cart timestamp
    await supabaseAdmin
      .from('carts')
      .update({ updated_at: new Date().toISOString() })
      .eq('id', updatedItem.cart_id)

    // Calculate line total
    const product = updatedItem.product
    const activePromotion = product?.promotion?.find((p: any) => p.is_active)
    const discountPercent = activePromotion?.discount_percent || 0
    const finalPrice = discountPercent > 0 
      ? product.price * (1 - discountPercent / 100) 
      : product.price

    return res.status(200).json({ 
      success: true,
      item: {
        ...updatedItem,
        line_total: Math.round(finalPrice * quantity * 100) / 100,
      },
      message: 'Cart updated'
    })

  } catch (error) {
    console.error('Update cart error:', error)
    return res.status(500).json({ error: 'Failed to update cart' })
  }
}
