import type { NextApiRequest, NextApiResponse } from 'next'
import { supabaseAdmin } from '@/lib/supabase'
import { verifyTelegramWebAppData, parseTelegramInitData, isTelegramAuthValid } from '@/lib/telegram/verify'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { initData } = req.body

    if (!initData) {
      return res.status(400).json({ error: 'Missing initData' })
    }

    // Verify the data came from Telegram (skip in development if no bot token)
    const botToken = process.env.TELEGRAM_BOT_TOKEN
    if (botToken) {
      const isValid = verifyTelegramWebAppData(initData)
      if (!isValid) {
        return res.status(401).json({ error: 'Invalid Telegram data' })
      }
    }

    // Parse the init data
    const parsed = parseTelegramInitData(initData)
    if (!parsed || !parsed.user) {
      return res.status(400).json({ error: 'Could not parse user data' })
    }

    // Check if auth is not expired (24 hours)
    if (!isTelegramAuthValid(parsed.authDate)) {
      return res.status(401).json({ error: 'Authentication expired' })
    }

    const telegramUser = parsed.user

    // Upsert user in database using the function we created
    const { data: profile, error: dbError } = await supabaseAdmin.rpc('upsert_telegram_user', {
      p_telegram_id: telegramUser.id,
      p_username: telegramUser.username || null,
      p_first_name: telegramUser.first_name,
      p_last_name: telegramUser.last_name || null,
      p_photo_url: telegramUser.photo_url || null,
      p_language_code: telegramUser.language_code || null,
      p_is_premium: telegramUser.is_premium || false,
    })

    if (dbError) {
      console.error('Database error:', dbError)
      
      // Fallback: try direct insert/update if function doesn't exist
      const { data: existingProfile } = await supabaseAdmin
        .from('profiles')
        .select('*')
        .eq('telegram_id', telegramUser.id)
        .single()

      if (existingProfile) {
        // Update existing profile
        const { data: updatedProfile, error: updateError } = await supabaseAdmin
          .from('profiles')
          .update({
            telegram_username: telegramUser.username,
            telegram_first_name: telegramUser.first_name,
            telegram_last_name: telegramUser.last_name,
            telegram_photo_url: telegramUser.photo_url,
            telegram_language_code: telegramUser.language_code,
            telegram_is_premium: telegramUser.is_premium || false,
            full_name: `${telegramUser.first_name} ${telegramUser.last_name || ''}`.trim(),
            avatar_url: telegramUser.photo_url,
            last_seen_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })
          .eq('telegram_id', telegramUser.id)
          .select()
          .single()

        if (updateError) {
          console.error('Update error:', updateError)
          return res.status(500).json({ error: 'Failed to update user profile' })
        }

        return res.status(200).json({ 
          user: updatedProfile,
          isNewUser: false,
        })
      } else {
        // Insert new profile
        const { data: newProfile, error: insertError } = await supabaseAdmin
          .from('profiles')
          .insert({
            telegram_id: telegramUser.id,
            telegram_username: telegramUser.username,
            telegram_first_name: telegramUser.first_name,
            telegram_last_name: telegramUser.last_name,
            telegram_photo_url: telegramUser.photo_url,
            telegram_language_code: telegramUser.language_code,
            telegram_is_premium: telegramUser.is_premium || false,
            full_name: `${telegramUser.first_name} ${telegramUser.last_name || ''}`.trim(),
            avatar_url: telegramUser.photo_url,
            auth_provider: 'telegram',
            role: 'customer',
            last_seen_at: new Date().toISOString(),
          })
          .select()
          .single()

        if (insertError) {
          console.error('Insert error:', insertError)
          return res.status(500).json({ error: 'Failed to create user profile' })
        }

        return res.status(201).json({ 
          user: newProfile,
          isNewUser: true,
        })
      }
    }

    return res.status(200).json({ 
      user: profile,
      isNewUser: false, // The function handles upsert, we don't know if new
    })

  } catch (error) {
    console.error('Telegram auth error:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}
