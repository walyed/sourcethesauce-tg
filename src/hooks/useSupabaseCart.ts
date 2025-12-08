import { useState, useEffect, useCallback } from 'react'
import { cartService, CartIdentifier, AddToCartParams } from '@/services/supabase-api'
import { useTelegramAuth } from '@/context/telegram-auth'
import { v4 as uuidv4 } from 'uuid'

// Session ID for guest users
function getSessionId(): string {
  if (typeof window === 'undefined') return ''
  
  let sessionId = localStorage.getItem('cart_session_id')
  if (!sessionId) {
    sessionId = uuidv4()
    localStorage.setItem('cart_session_id', sessionId)
  }
  return sessionId
}

export interface CartItem {
  id: string
  product_id: string
  quantity: number
  unit_price: number
  product: {
    id: string
    sku: string
    name: string
    price: number
    final_price: number
    discount_percent: number
    is_sold_out: boolean
    image: string
  }
  size: { id: string; label: string } | null
  color: { id: string; name: string; hex_value: string } | null
  line_total: number
}

export interface CartTotals {
  subtotal: number
  discount: number
  total: number
  itemCount: number
}

export function useSupabaseCart() {
  const { user, isAuthenticated } = useTelegramAuth()
  const [items, setItems] = useState<CartItem[]>([])
  const [totals, setTotals] = useState<CartTotals>({ subtotal: 0, discount: 0, total: 0, itemCount: 0 })
  const [cartId, setCartId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Get cart identifier
  const getIdentifier = useCallback((): CartIdentifier => {
    if (isAuthenticated && user) {
      return {
        userId: user.id,
        telegramId: user.telegram_id || undefined,
      }
    }
    return { sessionId: getSessionId() }
  }, [isAuthenticated, user])

  // Fetch cart
  const fetchCart = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      const result = await cartService.get(getIdentifier())
      setItems(result.items || [])
      setTotals(result.totals || { subtotal: 0, discount: 0, total: 0, itemCount: 0 })
      setCartId(result.cart?.id || null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch cart')
    } finally {
      setIsLoading(false)
    }
  }, [getIdentifier])

  // Fetch cart on mount and when user changes
  useEffect(() => {
    fetchCart()
  }, [fetchCart])

  // Add item to cart
  const addItem = useCallback(async (
    productId: string,
    options?: { sizeId?: string; colorId?: string; quantity?: number }
  ) => {
    setError(null)

    try {
      const params: AddToCartParams = {
        ...getIdentifier(),
        productId,
        sizeId: options?.sizeId,
        colorId: options?.colorId,
        quantity: options?.quantity || 1,
      }

      await cartService.addItem(params)
      await fetchCart() // Refresh cart
      return true
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add item to cart')
      return false
    }
  }, [getIdentifier, fetchCart])

  // Update item quantity
  const updateQuantity = useCallback(async (itemId: string, quantity: number) => {
    setError(null)

    try {
      if (quantity <= 0) {
        await cartService.removeItem(itemId)
      } else {
        await cartService.updateItem(itemId, quantity)
      }
      await fetchCart() // Refresh cart
      return true
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update cart')
      return false
    }
  }, [fetchCart])

  // Increment item quantity
  const incrementItem = useCallback(async (itemId: string) => {
    const item = items.find(i => i.id === itemId)
    if (item) {
      return updateQuantity(itemId, item.quantity + 1)
    }
    return false
  }, [items, updateQuantity])

  // Decrement item quantity
  const decrementItem = useCallback(async (itemId: string) => {
    const item = items.find(i => i.id === itemId)
    if (item) {
      return updateQuantity(itemId, item.quantity - 1)
    }
    return false
  }, [items, updateQuantity])

  // Remove item from cart
  const removeItem = useCallback(async (itemId: string) => {
    setError(null)

    try {
      await cartService.removeItem(itemId)
      await fetchCart() // Refresh cart
      return true
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to remove item')
      return false
    }
  }, [fetchCart])

  // Clear cart
  const clearCart = useCallback(async () => {
    setError(null)

    try {
      await cartService.clear(getIdentifier())
      setItems([])
      setTotals({ subtotal: 0, discount: 0, total: 0, itemCount: 0 })
      return true
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to clear cart')
      return false
    }
  }, [getIdentifier])

  return {
    items,
    totals,
    cartId,
    isLoading,
    error,
    isEmpty: items.length === 0,
    itemCount: totals.itemCount,
    // Actions
    addItem,
    updateQuantity,
    incrementItem,
    decrementItem,
    removeItem,
    clearCart,
    refetch: fetchCart,
  }
}

export default useSupabaseCart
