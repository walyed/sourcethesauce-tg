import type { NextApiRequest, NextApiResponse } from 'next'
import { supabaseAdmin } from '@/lib/supabase'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'DELETE') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

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

    // Find cart
    let cartQuery = supabaseAdmin.from('carts').select('id')
    
    if (profileId) {
      cartQuery = cartQuery.eq('user_id', profileId)
    } else if (sessionId) {
      cartQuery = cartQuery.eq('session_id', sessionId)
    }

    const { data: cart } = await cartQuery.single()

    if (!cart) {
      return res.status(404).json({ error: 'Cart not found' })
    }

    // Delete all items in the cart
    const { error: deleteError } = await supabaseAdmin
      .from('cart_items')
      .delete()
      .eq('cart_id', cart.id)

    if (deleteError) throw deleteError

    // Update cart timestamp
    await supabaseAdmin
      .from('carts')
      .update({ updated_at: new Date().toISOString() })
      .eq('id', cart.id)

    return res.status(200).json({ 
      success: true, 
      message: 'Cart cleared' 
    })

  } catch (error) {
    console.error('Clear cart error:', error)
    return res.status(500).json({ error: 'Failed to clear cart' })
  }
}
