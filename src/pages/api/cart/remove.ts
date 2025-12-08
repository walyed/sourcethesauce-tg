import type { NextApiRequest, NextApiResponse } from 'next'
import { supabaseAdmin } from '@/lib/supabase'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'DELETE') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { itemId } = req.query

  if (!itemId || typeof itemId !== 'string') {
    return res.status(400).json({ error: 'itemId is required' })
  }

  try {
    // Get cart_id before deleting for updating timestamp
    const { data: item } = await supabaseAdmin
      .from('cart_items')
      .select('cart_id')
      .eq('id', itemId)
      .single()

    if (!item) {
      return res.status(404).json({ error: 'Cart item not found' })
    }

    // Delete the item
    const { error: deleteError } = await supabaseAdmin
      .from('cart_items')
      .delete()
      .eq('id', itemId)

    if (deleteError) throw deleteError

    // Update cart timestamp
    await supabaseAdmin
      .from('carts')
      .update({ updated_at: new Date().toISOString() })
      .eq('id', item.cart_id)

    return res.status(200).json({ 
      success: true, 
      message: 'Item removed from cart' 
    })

  } catch (error) {
    console.error('Remove from cart error:', error)
    return res.status(500).json({ error: 'Failed to remove item from cart' })
  }
}
