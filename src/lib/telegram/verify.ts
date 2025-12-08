import crypto from 'crypto'
import type { TelegramUser } from './types'

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN!

/**
 * Verify Telegram Web App init data
 * This should be called on the server side to validate the data came from Telegram
 */
export function verifyTelegramWebAppData(initData: string): boolean {
  if (!initData || !BOT_TOKEN) {
    return false
  }

  try {
    const urlParams = new URLSearchParams(initData)
    const hash = urlParams.get('hash')
    
    if (!hash) {
      return false
    }

    // Remove hash from the data
    urlParams.delete('hash')
    
    // Sort parameters alphabetically and create data-check-string
    const dataCheckString = Array.from(urlParams.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, value]) => `${key}=${value}`)
      .join('\n')

    // Create secret key from bot token
    const secretKey = crypto
      .createHmac('sha256', 'WebAppData')
      .update(BOT_TOKEN)
      .digest()

    // Calculate hash - convert Buffer to Uint8Array for compatibility
    const calculatedHash = crypto
      .createHmac('sha256', new Uint8Array(secretKey))
      .update(dataCheckString)
      .digest('hex')

    return calculatedHash === hash
  } catch (error) {
    console.error('Error verifying Telegram data:', error)
    return false
  }
}

/**
 * Parse user data from init data string
 */
export function parseTelegramInitData(initData: string): {
  user?: TelegramUser
  queryId?: string
  authDate: number
  hash: string
} | null {
  try {
    const urlParams = new URLSearchParams(initData)
    const userStr = urlParams.get('user')
    const queryId = urlParams.get('query_id') || undefined
    const authDate = parseInt(urlParams.get('auth_date') || '0', 10)
    const hash = urlParams.get('hash') || ''

    let user: TelegramUser | undefined
    if (userStr) {
      user = JSON.parse(userStr)
    }

    return { user, queryId, authDate, hash }
  } catch (error) {
    console.error('Error parsing Telegram init data:', error)
    return null
  }
}

/**
 * Check if auth data is not expired (within 24 hours by default)
 */
export function isTelegramAuthValid(authDate: number, maxAgeSeconds = 86400): boolean {
  const now = Math.floor(Date.now() / 1000)
  return now - authDate <= maxAgeSeconds
}
