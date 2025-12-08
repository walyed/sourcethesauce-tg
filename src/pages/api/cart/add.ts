import type { NextApiRequest, NextApiResponse } from 'next'
import { supabaseAdmin } from '@/lib/supabase'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { 
    userId, 
    sessionId, 
    telegramId,
    productId, 
    sizeId, 
    colorId, 
    quantity = 1 
  } = req.body

  if (!productId) {
    return res.status(400).json({ error: 'productId is required' })
  }

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
        .eq('telegram_id', parseInt(telegramId, 10))
        .single()

      if (profile) {
        profileId = profile.id
      } else {
        return res.status(404).json({ error: 'User not found' })
      }
    }

    // Get or create cart
    let cartId: string

    const cartQuery = supabaseAdmin.from('carts').select('id')
    
    if (profileId) {
      const { data: existingCart } = await cartQuery.eq('user_id', profileId).single()
      
      if (existingCart) {
        cartId = existingCart.id
      } else {
        const { data: newCart, error: createError } = await supabaseAdmin
          .from('carts')
          .insert({ user_id: profileId })
          .select('id')
          .single()

        if (createError) throw createError
        cartId = newCart.id
      }
    } else {
      const { data: existingCart } = await supabaseAdmin
        .from('carts')
        .select('id')
        .eq('session_id', sessionId)
        .single()
      
      if (existingCart) {
        cartId = existingCart.id
      } else {
        const { data: newCart, error: createError } = await supabaseAdmin
          .from('carts')
          .insert({ session_id: sessionId })
          .select('id')
          .single()

        if (createError) throw createError
        cartId = newCart.id
      }
    }

    // Get product price
    const { data: product, error: productError } = await supabaseAdmin
      .from('products')
      .select('price, is_active, is_sold_out')
      .eq('id', productId)
      .single()

    if (productError || !product) {
      return res.status(404).json({ error: 'Product not found' })
    }

    if (!product.is_active) {
      return res.status(400).json({ error: 'Product is not available' })
    }

    if (product.is_sold_out) {
      return res.status(400).json({ error: 'Product is sold out' })
    }

    // Check if item already exists in cart
    const { data: existingItem } = await supabaseAdmin
      .from('cart_items')
      .select('id, quantity')
      .eq('cart_id', cartId)
      .eq('product_id', productId)
      .eq('size_id', sizeId || null)
      .eq('color_id', colorId || null)
      .single()

    let cartItem

    if (existingItem) {
      // Update quantity
      const { data: updatedItem, error: updateError } = await supabaseAdmin
        .from('cart_items')
        .update({ 
          quantity: existingItem.quantity + quantity,
          updated_at: new Date().toISOString()
        })
        .eq('id', existingItem.id)
        .select()
        .single()

      if (updateError) throw updateError
      cartItem = updatedItem
    } else {
      // Insert new item
      const { data: newItem, error: insertError } = await supabaseAdmin
        .from('cart_items')
        .insert({
          cart_id: cartId,
          product_id: productId,
          size_id: sizeId || null,
          color_id: colorId || null,
          quantity,
          unit_price: product.price,
        })
        .select()
        .single()

      if (insertError) throw insertError
      cartItem = newItem
    }

    // Update cart timestamp
    await supabaseAdmin
      .from('carts')
      .update({ updated_at: new Date().toISOString() })
      .eq('id', cartId)

    return res.status(200).json({ 
      success: true,
      item: cartItem,
      message: existingItem ? 'Cart updated' : 'Item added to cart'
    })

  } catch (error) {
    console.error('Add to cart error:', error)
    return res.status(500).json({ error: 'Failed to add item to cart' })
  }
}
