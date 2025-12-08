import React, { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react'
import { getTelegramWebApp, getTelegramUser, getTelegramInitData, isTelegramWebApp } from '@/lib/telegram'
import type { TelegramUser } from '@/lib/telegram'

// Profile type that matches database
interface UserProfile {
  id: string
  email: string | null
  full_name: string | null
  phone: string | null
  avatar_url: string | null
  role: 'customer' | 'admin' | 'staff'
  telegram_id: number | null
  telegram_username: string | null
  telegram_first_name: string | null
  telegram_last_name: string | null
  telegram_photo_url: string | null
  telegram_language_code: string | null
  telegram_is_premium: boolean
  auth_provider: 'supabase' | 'telegram'
  created_at: string
  updated_at: string
}

interface TelegramAuthContextType {
  // User state
  user: UserProfile | null
  telegramUser: TelegramUser | null
  isLoading: boolean
  isAuthenticated: boolean
  isTelegram: boolean
  error: string | null
  
  // Actions
  authenticate: () => Promise<UserProfile | null>
  logout: () => void
  updateProfile: (data: Partial<UserProfile>) => Promise<UserProfile | null>
  refreshProfile: () => Promise<void>
}

const TelegramAuthContext = createContext<TelegramAuthContextType | null>(null)

export function useTelegramAuth() {
  const context = useContext(TelegramAuthContext)
  if (!context) {
    throw new Error('useTelegramAuth must be used within TelegramAuthProvider')
  }
  return context
}

interface TelegramAuthProviderProps {
  children: ReactNode
  autoAuthenticate?: boolean
}

export function TelegramAuthProvider({ 
  children, 
  autoAuthenticate = true 
}: TelegramAuthProviderProps) {
  const [user, setUser] = useState<UserProfile | null>(null)
  const [telegramUser, setTelegramUser] = useState<TelegramUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isTelegram, setIsTelegram] = useState(false)

  // Authenticate with backend
  const authenticate = useCallback(async (): Promise<UserProfile | null> => {
    setIsLoading(true)
    setError(null)

    try {
      const initData = getTelegramInitData()
      
      if (!initData) {
        setError('Not running in Telegram Web App')
        setIsLoading(false)
        return null
      }

      const response = await fetch('/api/auth/telegram', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ initData }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Authentication failed')
      }

      setUser(data.user)
      
      // Store user ID in localStorage for persistence
      if (data.user?.id) {
        localStorage.setItem('telegram_user_id', data.user.id)
      }

      return data.user
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Authentication failed'
      setError(message)
      console.error('Telegram auth error:', err)
      return null
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Refresh profile from backend
  const refreshProfile = useCallback(async () => {
    if (!user?.id) return

    try {
      const response = await fetch(`/api/auth/profile?userId=${user.id}`)
      const data = await response.json()

      if (response.ok && data.user) {
        setUser(data.user)
      }
    } catch (err) {
      console.error('Failed to refresh profile:', err)
    }
  }, [user?.id])

  // Update user profile
  const updateProfile = useCallback(async (data: Partial<UserProfile>): Promise<UserProfile | null> => {
    if (!user?.id) {
      setError('No user to update')
      return null
    }

    try {
      const response = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          userId: user.id, 
          ...data 
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to update profile')
      }

      setUser(result.user)
      return result.user
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update profile'
      setError(message)
      return null
    }
  }, [user?.id])

  // Logout
  const logout = useCallback(() => {
    setUser(null)
    setTelegramUser(null)
    localStorage.removeItem('telegram_user_id')
  }, [])

  // Initialize on mount
  useEffect(() => {
    const init = async () => {
      // Check if running in Telegram
      const inTelegram = isTelegramWebApp()
      setIsTelegram(inTelegram)

      if (inTelegram) {
        // Get Telegram user data
        const tgUser = getTelegramUser()
        setTelegramUser(tgUser)

        // Tell Telegram we're ready and configure the Mini App
        const webApp = getTelegramWebApp()
        if (webApp) {
          webApp.ready()
          
          // Expand to full screen
          webApp.expand()
          
          // Enable closing confirmation to prevent accidental closes
          webApp.enableClosingConfirmation()
          
          // Set theme colors to match Telegram
          if (webApp.themeParams) {
            const bgColor = webApp.themeParams.bg_color || '#ffffff'
            const headerColor = webApp.themeParams.secondary_bg_color || webApp.themeParams.bg_color || '#ffffff'
            webApp.setBackgroundColor(bgColor)
            webApp.setHeaderColor(headerColor)
          }
        }

        // Auto authenticate if enabled
        if (autoAuthenticate && tgUser) {
          await authenticate()
        } else {
          setIsLoading(false)
        }
      } else {
        // Not in Telegram, check for stored user ID
        const storedUserId = localStorage.getItem('telegram_user_id')
        if (storedUserId) {
          // Try to fetch profile
          try {
            const response = await fetch(`/api/auth/profile?userId=${storedUserId}`)
            const data = await response.json()
            if (response.ok && data.user) {
              setUser(data.user)
            }
          } catch (err) {
            console.error('Failed to restore session:', err)
          }
        }
        setIsLoading(false)
      }
    }

    init()
  }, [autoAuthenticate, authenticate])

  const value: TelegramAuthContextType = {
    user,
    telegramUser,
    isLoading,
    isAuthenticated: !!user,
    isTelegram,
    error,
    authenticate,
    logout,
    updateProfile,
    refreshProfile,
  }

  return (
    <TelegramAuthContext.Provider value={value}>
      {children}
    </TelegramAuthContext.Provider>
  )
}

export default TelegramAuthProvider
