import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react'
import { supabase } from '@/lib/supabase'
import { useTelegramAuth } from '@/context/telegram-auth'

export interface WishlistItem {
  id: string
  product_id: string
  product: {
    id: string
    name: string
    price: number
    sku: string
    is_new: boolean
    images: Array<{ url: string; position: number }>
  }
}

interface WishlistContextType {
  items: WishlistItem[]
  isLoading: boolean
  isInWishlist: (productId: string) => boolean
  addToWishlist: (productId: string) => Promise<void>
  removeFromWishlist: (productId: string) => Promise<void>
  toggleWishlist: (productId: string) => Promise<void>
  refreshWishlist: () => Promise<void>
}

const WishlistContext = createContext<WishlistContextType | null>(null)

export function useWishlist() {
  const context = useContext(WishlistContext)
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider')
  }
  return context
}

interface WishlistProviderProps {
  children: ReactNode
}

export function WishlistProvider({ children }: WishlistProviderProps) {
  const { user, telegramUser } = useTelegramAuth()
  const [items, setItems] = useState<WishlistItem[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const userId = user?.id || null
  const telegramId = telegramUser?.id || null

  // Fetch wishlist items
  const refreshWishlist = useCallback(async () => {
    if (!userId && !telegramId) {
      setItems([])
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    try {
      let query = supabase
        .from('wishlist')
        .select(`
          id,
          product_id,
          product:products(
            id,
            name,
            price,
            sku,
            is_new,
            images:product_images(url, position)
          )
        `)

      if (userId) {
        query = query.eq('user_id', userId)
      } else if (telegramId) {
        query = query.eq('telegram_id', telegramId)
      }

      const { data, error } = await query

      if (error) {
        console.error('Error fetching wishlist:', error)
        setItems([])
      } else {
        const wishlistItems = (data || []).map((item: any) => ({
          ...item,
          product: {
            ...item.product,
            images: item.product?.images?.sort((a: any, b: any) => a.position - b.position) || []
          }
        }))
        setItems(wishlistItems)
      }
    } catch (error) {
      console.error('Error fetching wishlist:', error)
      setItems([])
    } finally {
      setIsLoading(false)
    }
  }, [userId, telegramId])

  useEffect(() => {
    refreshWishlist()
  }, [refreshWishlist])

  // Check if product is in wishlist
  const isInWishlist = useCallback((productId: string) => {
    return items.some(item => item.product_id === productId)
  }, [items])

  // Add to wishlist
  const addToWishlist = useCallback(async (productId: string) => {
    if (!userId && !telegramId) {
      console.error('User not authenticated')
      return
    }

    if (isInWishlist(productId)) return

    try {
      const wishlistItem: any = {
        product_id: productId,
      }

      if (userId) {
        wishlistItem.user_id = userId
      }
      if (telegramId) {
        wishlistItem.telegram_id = telegramId
      }

      const { error } = await supabase
        .from('wishlist')
        .insert(wishlistItem)

      if (error) {
        console.error('Error adding to wishlist:', error)
        return
      }

      await refreshWishlist()
    } catch (error) {
      console.error('Error adding to wishlist:', error)
    }
  }, [userId, telegramId, isInWishlist, refreshWishlist])

  // Remove from wishlist
  const removeFromWishlist = useCallback(async (productId: string) => {
    if (!userId && !telegramId) return

    try {
      let query = supabase
        .from('wishlist')
        .delete()
        .eq('product_id', productId)

      if (userId) {
        query = query.eq('user_id', userId)
      } else if (telegramId) {
        query = query.eq('telegram_id', telegramId)
      }

      const { error } = await query

      if (error) {
        console.error('Error removing from wishlist:', error)
        return
      }

      setItems(prev => prev.filter(item => item.product_id !== productId))
    } catch (error) {
      console.error('Error removing from wishlist:', error)
    }
  }, [userId, telegramId])

  // Toggle wishlist
  const toggleWishlist = useCallback(async (productId: string) => {
    if (isInWishlist(productId)) {
      await removeFromWishlist(productId)
    } else {
      await addToWishlist(productId)
    }
  }, [isInWishlist, addToWishlist, removeFromWishlist])

  return (
    <WishlistContext.Provider value={{
      items,
      isLoading,
      isInWishlist,
      addToWishlist,
      removeFromWishlist,
      toggleWishlist,
      refreshWishlist,
    }}>
      {children}
    </WishlistContext.Provider>
  )
}

export default WishlistProvider
