import type { NextApiRequest, NextApiResponse } from 'next'
import { supabaseAdmin } from '@/lib/supabase'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // GET - List addresses for user
  if (req.method === 'GET') {
    const { userId, telegramId } = req.query

    if (!userId && !telegramId) {
      return res.status(400).json({ error: 'userId or telegramId is required' })
    }

    try {
      let profileId = userId as string | undefined

      if (telegramId) {
        const { data: profile } = await supabaseAdmin
          .from('profiles')
          .select('id')
          .eq('telegram_id', parseInt(telegramId as string, 10))
          .single()

        if (profile) {
          profileId = profile.id
        } else {
          return res.status(200).json({ addresses: [] })
        }
      }

      const { data: addresses, error } = await supabaseAdmin
        .from('addresses')
        .select('*')
        .eq('user_id', profileId)
        .order('is_default', { ascending: false })
        .order('created_at', { ascending: false })

      if (error) throw error

      return res.status(200).json({ addresses: addresses || [] })

    } catch (error) {
      console.error('Addresses fetch error:', error)
      return res.status(500).json({ error: 'Failed to fetch addresses' })
    }
  }

  // POST - Create address
  if (req.method === 'POST') {
    const {
      userId,
      telegramId,
      label,
      full_name,
      phone,
      address_line1,
      address_line2,
      city,
      state,
      postal_code,
      country,
      is_default,
    } = req.body

    if (!userId && !telegramId) {
      return res.status(400).json({ error: 'userId or telegramId is required' })
    }

    if (!full_name || !address_line1 || !city || !postal_code) {
      return res.status(400).json({ error: 'Missing required fields' })
    }

    try {
      let profileId = userId as string | undefined

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

      // If this is default, unset other defaults
      if (is_default) {
        await supabaseAdmin
          .from('addresses')
          .update({ is_default: false })
          .eq('user_id', profileId)
      }

      const { data: address, error } = await supabaseAdmin
        .from('addresses')
        .insert({
          user_id: profileId,
          label: label || 'Home',
          full_name,
          phone,
          address_line1,
          address_line2,
          city,
          state,
          postal_code,
          country: country || 'UK',
          is_default: is_default || false,
        })
        .select()
        .single()

      if (error) throw error

      return res.status(201).json({ 
        success: true,
        address,
        message: 'Address created successfully' 
      })

    } catch (error) {
      console.error('Create address error:', error)
      return res.status(500).json({ error: 'Failed to create address' })
    }
  }

  // PUT - Update address
  if (req.method === 'PUT') {
    const { addressId, ...updateData } = req.body

    if (!addressId) {
      return res.status(400).json({ error: 'addressId is required' })
    }

    try {
      // If setting as default, unset other defaults
      if (updateData.is_default) {
        const { data: existingAddress } = await supabaseAdmin
          .from('addresses')
          .select('user_id')
          .eq('id', addressId)
          .single()

        if (existingAddress) {
          await supabaseAdmin
            .from('addresses')
            .update({ is_default: false })
            .eq('user_id', existingAddress.user_id)
        }
      }

      const { data: address, error } = await supabaseAdmin
        .from('addresses')
        .update({
          ...updateData,
          updated_at: new Date().toISOString(),
        })
        .eq('id', addressId)
        .select()
        .single()

      if (error) {
        if (error.code === 'PGRST116') {
          return res.status(404).json({ error: 'Address not found' })
        }
        throw error
      }

      return res.status(200).json({ 
        success: true,
        address,
        message: 'Address updated successfully' 
      })

    } catch (error) {
      console.error('Update address error:', error)
      return res.status(500).json({ error: 'Failed to update address' })
    }
  }

  // DELETE - Delete address
  if (req.method === 'DELETE') {
    const { addressId } = req.query

    if (!addressId || typeof addressId !== 'string') {
      return res.status(400).json({ error: 'addressId is required' })
    }

    try {
      const { error } = await supabaseAdmin
        .from('addresses')
        .delete()
        .eq('id', addressId)

      if (error) throw error

      return res.status(200).json({ 
        success: true,
        message: 'Address deleted successfully' 
      })

    } catch (error) {
      console.error('Delete address error:', error)
      return res.status(500).json({ error: 'Failed to delete address' })
    }
  }

  return res.status(405).json({ error: 'Method not allowed' })
}
