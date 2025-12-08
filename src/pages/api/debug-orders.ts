import type { NextApiRequest, NextApiResponse } from 'next'
import { supabase } from '@/lib/supabase'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    // First, check all orders
    const { data: orders, error: ordersError } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10)

    if (ordersError) {
      return res.status(500).json({ 
        error: 'Failed to fetch orders', 
        details: ordersError 
      })
    }

    // Check order_items
    const { data: orderItems, error: itemsError } = await supabase
      .from('order_items')
      .select('*')
      .limit(10)

    // Check telegram_users
    const { data: users, error: usersError } = await supabase
      .from('telegram_users')
      .select('*')
      .limit(10)

    return res.status(200).json({
      ordersCount: orders?.length || 0,
      orders: orders,
      orderItems: orderItems,
      orderItemsError: itemsError,
      users: users,
      usersError: usersError,
    })
  } catch (error: any) {
    return res.status(500).json({ error: error.message })
  }
}
