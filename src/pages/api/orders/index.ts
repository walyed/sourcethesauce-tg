import type { NextApiRequest, NextApiResponse } from 'next'
import { supabaseAdmin } from '@/lib/supabase'

// Generate order number
function generateOrderNumber(): string {
  const timestamp = Date.now().toString(36).toUpperCase()
  const random = Math.random().toString(36).substring(2, 6).toUpperCase()
  return `ORD-${timestamp}-${random}`
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // GET - List orders for user
  if (req.method === 'GET') {
    const { userId, telegramId, page = '1', limit = '10' } = req.query

    if (!userId && !telegramId) {
      return res.status(400).json({ error: 'userId or telegramId is required' })
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
        } else {
          return res.status(200).json({ orders: [], pagination: { total: 0 } })
        }
      }

      const pageNum = parseInt(page as string, 10) || 1
      const limitNum = Math.min(parseInt(limit as string, 10) || 10, 50)
      const offset = (pageNum - 1) * limitNum

      const { data: orders, error, count } = await supabaseAdmin
        .from('orders')
        .select(`
          *,
          items:order_items(
            *,
            product:products(id, name, sku)
          )
        `, { count: 'exact' })
        .eq('user_id', profileId)
        .order('created_at', { ascending: false })
        .range(offset, offset + limitNum - 1)

      if (error) throw error

      return res.status(200).json({
        orders: orders || [],
        pagination: {
          page: pageNum,
          limit: limitNum,
          total: count || 0,
          totalPages: Math.ceil((count || 0) / limitNum),
        },
      })

    } catch (error) {
      console.error('Orders fetch error:', error)
      return res.status(500).json({ error: 'Failed to fetch orders' })
    }
  }

  // POST - Create order
  if (req.method === 'POST') {
    const {
      userId,
      telegramId,
      sessionId,
      shippingAddress,
      billingAddress,
      paymentMethod,
      notes,
    } = req.body

    if (!userId && !telegramId && !sessionId) {
      return res.status(400).json({ error: 'userId, telegramId, or sessionId is required' })
    }

    if (!shippingAddress) {
      return res.status(400).json({ error: 'shippingAddress is required' })
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

      // Get cart
      let cartQuery = supabaseAdmin
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
              promotion:promotions(discount_percent, is_active)
            ),
            size:product_sizes(id, label),
            color:product_colors(id, name, hex_value)
          )
        `)

      if (profileId) {
        cartQuery = cartQuery.eq('user_id', profileId)
      } else if (sessionId) {
        cartQuery = cartQuery.eq('session_id', sessionId)
      }

      const { data: cart, error: cartError } = await cartQuery.single()

      if (cartError || !cart || !cart.items || cart.items.length === 0) {
        return res.status(400).json({ error: 'Cart is empty' })
      }

      // Calculate totals
      let subtotal = 0
      let discountAmount = 0

      const orderItems = cart.items.map((item: any) => {
        const product = item.product
        const activePromotion = product?.promotion?.find((p: any) => p.is_active)
        const discountPercent = activePromotion?.discount_percent || 0
        const originalPrice = product.price
        const finalPrice = discountPercent > 0 
          ? originalPrice * (1 - discountPercent / 100) 
          : originalPrice

        subtotal += originalPrice * item.quantity
        discountAmount += (originalPrice - finalPrice) * item.quantity

        return {
          product_id: item.product_id,
          size_id: item.size_id,
          color_id: item.color_id,
          product_name: product.name,
          product_sku: product.sku,
          size_label: item.size?.label,
          color_name: item.color?.name,
          color_hex: item.color?.hex_value,
          quantity: item.quantity,
          unit_price: originalPrice,
          discount_percent: discountPercent,
          line_total: Math.round(finalPrice * item.quantity * 100) / 100,
        }
      })

      const shippingCost = 10.00 // Fixed shipping for now
      const taxAmount = 0 // Can be calculated based on location
      const total = subtotal - discountAmount + shippingCost + taxAmount

      // Create order
      const { data: order, error: orderError } = await supabaseAdmin
        .from('orders')
        .insert({
          order_number: generateOrderNumber(),
          user_id: profileId || null,
          status: 'pending',
          payment_status: 'pending',
          payment_method: paymentMethod || null,
          subtotal: Math.round(subtotal * 100) / 100,
          discount_amount: Math.round(discountAmount * 100) / 100,
          shipping_cost: shippingCost,
          tax_amount: taxAmount,
          total: Math.round(total * 100) / 100,
          currency: 'GBP',
          shipping_name: shippingAddress.full_name,
          shipping_phone: shippingAddress.phone,
          shipping_address_line1: shippingAddress.address_line1,
          shipping_address_line2: shippingAddress.address_line2 || null,
          shipping_city: shippingAddress.city,
          shipping_state: shippingAddress.state || null,
          shipping_postal_code: shippingAddress.postal_code,
          shipping_country: shippingAddress.country || 'UK',
          billing_name: billingAddress?.full_name || shippingAddress.full_name,
          billing_phone: billingAddress?.phone || shippingAddress.phone,
          billing_address_line1: billingAddress?.address_line1 || shippingAddress.address_line1,
          billing_address_line2: billingAddress?.address_line2 || shippingAddress.address_line2 || null,
          billing_city: billingAddress?.city || shippingAddress.city,
          billing_state: billingAddress?.state || shippingAddress.state || null,
          billing_postal_code: billingAddress?.postal_code || shippingAddress.postal_code,
          billing_country: billingAddress?.country || shippingAddress.country || 'UK',
          notes: notes || null,
        })
        .select()
        .single()

      if (orderError) throw orderError

      // Create order items
      const orderItemsData = orderItems.map((item: any) => ({
        order_id: order.id,
        ...item,
      }))

      const { error: itemsError } = await supabaseAdmin
        .from('order_items')
        .insert(orderItemsData)

      if (itemsError) throw itemsError

      // Clear cart
      await supabaseAdmin
        .from('cart_items')
        .delete()
        .eq('cart_id', cart.id)

      return res.status(201).json({
        success: true,
        order: {
          ...order,
          items: orderItems,
        },
        message: 'Order created successfully',
      })

    } catch (error) {
      console.error('Create order error:', error)
      return res.status(500).json({ error: 'Failed to create order' })
    }
  }

  return res.status(405).json({ error: 'Method not allowed' })
}
