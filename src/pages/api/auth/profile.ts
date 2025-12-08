import type { NextApiRequest, NextApiResponse } from 'next'
import { supabaseAdmin } from '@/lib/supabase'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // GET - Fetch profile
  if (req.method === 'GET') {
    const { userId, telegramId } = req.query

    if (!userId && !telegramId) {
      return res.status(400).json({ error: 'Missing userId or telegramId' })
    }

    try {
      let query = supabaseAdmin.from('profiles').select('*')

      if (userId) {
        query = query.eq('id', userId as string)
      } else if (telegramId) {
        query = query.eq('telegram_id', parseInt(telegramId as string, 10))
      }

      const { data: profile, error } = await query.single()

      if (error) {
        if (error.code === 'PGRST116') {
          return res.status(404).json({ error: 'User not found' })
        }
        throw error
      }

      return res.status(200).json({ user: profile })
    } catch (error) {
      console.error('Profile fetch error:', error)
      return res.status(500).json({ error: 'Failed to fetch profile' })
    }
  }

  // PUT - Update profile
  if (req.method === 'PUT') {
    const { userId, ...updateData } = req.body

    if (!userId) {
      return res.status(400).json({ error: 'Missing userId' })
    }

    // Only allow updating certain fields
    const allowedFields = [
      'email',
      'full_name',
      'phone',
      'avatar_url',
    ]

    const filteredData: Record<string, any> = {}
    for (const field of allowedFields) {
      if (updateData[field] !== undefined) {
        filteredData[field] = updateData[field]
      }
    }

    if (Object.keys(filteredData).length === 0) {
      return res.status(400).json({ error: 'No valid fields to update' })
    }

    filteredData.updated_at = new Date().toISOString()

    try {
      const { data: profile, error } = await supabaseAdmin
        .from('profiles')
        .update(filteredData)
        .eq('id', userId)
        .select()
        .single()

      if (error) {
        if (error.code === 'PGRST116') {
          return res.status(404).json({ error: 'User not found' })
        }
        throw error
      }

      return res.status(200).json({ user: profile })
    } catch (error) {
      console.error('Profile update error:', error)
      return res.status(500).json({ error: 'Failed to update profile' })
    }
  }

  return res.status(405).json({ error: 'Method not allowed' })
}
