import type { NextApiRequest, NextApiResponse } from 'next'
import { supabaseAdmin } from '@/lib/supabase'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ error: 'Order ID is required' })
  }

  // GET - Fetch order details
  if (req.method === 'GET') {
    const { userId, telegramId } = req.query

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

      // Fetch order
      let query = supabaseAdmin
        .from('orders')
        .select(`
          *,
          items:order_items(
            *,
            product:products(
              id,
              name,
              sku,
              images:product_images(image_url, is_primary)
            )
          )
        `)
        .eq('id', id)

      // If userId/telegramId provided, verify ownership
      if (profileId) {
        query = query.eq('user_id', profileId)
      }

      const { data: order, error } = await query.single()

      if (error) {
        if (error.code === 'PGRST116') {
          return res.status(404).json({ error: 'Order not found' })
        }
        throw error
      }

      // Transform items to include product image
      const transformedOrder = {
        ...order,
        items: order.items?.map((item: any) => ({
          ...item,
          product_image: item.product?.images?.find((img: any) => img.is_primary)?.image_url 
            || item.product?.images?.[0]?.image_url,
        })),
      }

      return res.status(200).json({ order: transformedOrder })

    } catch (error) {
      console.error('Order fetch error:', error)
      return res.status(500).json({ error: 'Failed to fetch order' })
    }
  }

  // PUT - Update order status (admin only or specific updates)
  if (req.method === 'PUT') {
    const { status, paymentStatus, paymentId, trackingNumber, notes } = req.body

    try {
      const updateData: Record<string, any> = {
        updated_at: new Date().toISOString(),
      }

      if (status) {
        const validStatuses = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded']
        if (!validStatuses.includes(status)) {
          return res.status(400).json({ error: 'Invalid status' })
        }
        updateData.status = status
      }

      if (paymentStatus) {
        const validPaymentStatuses = ['pending', 'paid', 'failed', 'refunded']
        if (!validPaymentStatuses.includes(paymentStatus)) {
          return res.status(400).json({ error: 'Invalid payment status' })
        }
        updateData.payment_status = paymentStatus
      }

      if (paymentId) {
        updateData.payment_id = paymentId
      }

      if (trackingNumber) {
        updateData.tracking_number = trackingNumber
      }

      if (notes !== undefined) {
        updateData.notes = notes
      }

      const { data: order, error } = await supabaseAdmin
        .from('orders')
        .update(updateData)
        .eq('id', id)
        .select()
        .single()

      if (error) {
        if (error.code === 'PGRST116') {
          return res.status(404).json({ error: 'Order not found' })
        }
        throw error
      }

      return res.status(200).json({ 
        success: true,
        order,
        message: 'Order updated successfully' 
      })

    } catch (error) {
      console.error('Order update error:', error)
      return res.status(500).json({ error: 'Failed to update order' })
    }
  }

  return res.status(405).json({ error: 'Method not allowed' })
}
