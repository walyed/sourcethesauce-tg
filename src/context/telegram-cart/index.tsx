import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react'
import { supabase } from '@/lib/supabase'
import { useTelegramAuth } from '@/context/telegram-auth'

export interface CartItem {
  id: string
  product_id: string
  variant_id: string
  quantity: number
  product: {
    id: string
    name: string
    price: number
    sku: string
    images: Array<{ url: string; position: number }>
  }
  variant: {
    id: string
    colour: string
    colour_hex: string
    size: string
  }
}

interface LocalCartItem {
  id: string
  product_id: string
  variant_id: string
  quantity: number
}

interface CartContextType {
  items: CartItem[]
  isLoading: boolean
  totalItems: number
  totalPrice: number
  addToCart: (productId: string, variantId: string, quantity?: number) => Promise<void>
  removeFromCart: (cartItemId: string) => Promise<void>
  updateQuantity: (cartItemId: string, quantity: number) => Promise<void>
  clearCart: () => Promise<void>
  refreshCart: () => Promise<void>
}

const CartContext = createContext<CartContextType | null>(null)

const LOCAL_CART_KEY = 'sourcethesauce_cart'

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}

interface CartProviderProps {
  children: ReactNode
}

export function CartProvider({ children }: CartProviderProps) {
  const { user, telegramUser } = useTelegramAuth()
  const [items, setItems] = useState<CartItem[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Get user ID (from DB user or Telegram user)
  const userId = user?.id || null
  const telegramId = telegramUser?.id || null
  // For now, use localStorage primarily since Telegram auth may not work on desktop
  // Only use DB cart when we have a proper authenticated user ID
  const isAuthenticated = !!userId

  // Calculate totals
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)
  const totalPrice = items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0)

  // Get local cart from localStorage
  const getLocalCart = (): LocalCartItem[] => {
    if (typeof window === 'undefined') return []
    try {
      const stored = localStorage.getItem(LOCAL_CART_KEY)
      return stored ? JSON.parse(stored) : []
    } catch {
      return []
    }
  }

  // Save local cart to localStorage
  const setLocalCart = (cart: LocalCartItem[]) => {
    if (typeof window === 'undefined') return
    localStorage.setItem(LOCAL_CART_KEY, JSON.stringify(cart))
  }

  // Fetch product and variant details for local cart items
  const fetchProductDetails = async (localItems: LocalCartItem[]): Promise<CartItem[]> => {
    if (localItems.length === 0) return []

    const productIds = Array.from(new Set(localItems.map(item => item.product_id)))
    const variantIds = Array.from(new Set(localItems.map(item => item.variant_id)))

    const { data: products } = await supabase
      .from('products')
      .select('id, name, price, sku, images:product_images(url, position)')
      .in('id', productIds)

    const { data: variants } = await supabase
      .from('product_variants')
      .select('id, colour, colour_hex, size')
      .in('id', variantIds)

    return localItems.map(item => {
      const product = products?.find((p: any) => p.id === item.product_id)
      const variant = variants?.find((v: any) => v.id === item.variant_id)
      
      return {
        id: item.id,
        product_id: item.product_id,
        variant_id: item.variant_id,
        quantity: item.quantity,
        product: {
          id: product?.id || item.product_id,
          name: product?.name || 'Unknown Product',
          price: product?.price || 0,
          sku: product?.sku || '',
          images: product?.images?.sort((a: any, b: any) => a.position - b.position) || []
        },
        variant: {
          id: variant?.id || item.variant_id,
          colour: variant?.colour || '',
          colour_hex: variant?.colour_hex || '#000000',
          size: variant?.size || ''
        }
      }
    })
  }

  // Fetch cart items (from DB if authenticated, local storage otherwise)
  const refreshCart = useCallback(async () => {
    setIsLoading(true)
    try {
      if (isAuthenticated) {
        // Fetch from database
        let query = supabase
          .from('cart')
          .select(`
            id,
            product_id,
            variant_id,
            qty,
            product:products(
              id,
              name,
              price,
              sku,
              images:product_images(url, position)
            ),
            variant:product_variants(
              id,
              colour,
              colour_hex,
              size
            )
          `)

        if (userId) {
          query = query.eq('user_id', userId)
        }

        const { data, error } = await query

        if (error) {
          console.error('Error fetching cart:', error)
          setItems([])
        } else {
          const cartItems = (data || []).map((item: any) => ({
            ...item,
            quantity: item.qty, // Map qty to quantity for frontend consistency
            product: {
              ...item.product,
              images: item.product?.images?.sort((a: any, b: any) => a.position - b.position) || []
            }
          }))
          setItems(cartItems)
        }
      } else {
        // Fetch from local storage
        const localCart = getLocalCart()
        const cartItems = await fetchProductDetails(localCart)
        setItems(cartItems)
      }
    } catch (error) {
      console.error('Error fetching cart:', error)
      setItems([])
    } finally {
      setIsLoading(false)
    }
  }, [userId, isAuthenticated])

  // Load cart on mount and when user changes
  useEffect(() => {
    refreshCart()
  }, [refreshCart])

  // Add item to cart
  const addToCart = useCallback(async (productId: string, variantId: string, quantity: number = 1) => {
    try {
      if (isAuthenticated) {
        // Check if item already exists in cart
        const existingItem = items.find(
          item => item.product_id === productId && item.variant_id === variantId
        )

        if (existingItem) {
          await updateQuantity(existingItem.id, existingItem.quantity + quantity)
        } else {
          const cartItem: any = {
            product_id: productId,
            variant_id: variantId,
            qty: quantity, // Use 'qty' to match database schema
            user_id: userId, // Required field
          }

          const { error } = await supabase
            .from('cart')
            .insert(cartItem)

          if (error) {
            console.error('Error adding to cart:', error)
            return
          }

          await refreshCart()
        }
      } else {
        // Use local storage
        const localCart = getLocalCart()
        const existingIndex = localCart.findIndex(
          item => item.product_id === productId && item.variant_id === variantId
        )

        if (existingIndex >= 0) {
          localCart[existingIndex].quantity += quantity
        } else {
          localCart.push({
            id: `local_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            product_id: productId,
            variant_id: variantId,
            quantity,
          })
        }

        setLocalCart(localCart)
        await refreshCart()
      }
    } catch (error) {
      console.error('Error adding to cart:', error)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId, isAuthenticated, items, refreshCart])

  // Remove item from cart
  const removeFromCart = useCallback(async (cartItemId: string) => {
    try {
      if (isAuthenticated) {
        const { error } = await supabase
          .from('cart')
          .delete()
          .eq('id', cartItemId)

        if (error) {
          console.error('Error removing from cart:', error)
          return
        }
      } else {
        // Use local storage
        const localCart = getLocalCart().filter(item => item.id !== cartItemId)
        setLocalCart(localCart)
      }

      setItems(prev => prev.filter(item => item.id !== cartItemId))
    } catch (error) {
      console.error('Error removing from cart:', error)
    }
  }, [isAuthenticated])

  // Update item quantity
  const updateQuantity = useCallback(async (cartItemId: string, quantity: number) => {
    if (quantity <= 0) {
      await removeFromCart(cartItemId)
      return
    }

    try {
      if (isAuthenticated) {
        const { error } = await supabase
          .from('cart')
          .update({ qty: quantity }) // Use 'qty' to match database schema
          .eq('id', cartItemId)

        if (error) {
          console.error('Error updating quantity:', error)
          return
        }
      } else {
        // Use local storage
        const localCart = getLocalCart().map(item =>
          item.id === cartItemId ? { ...item, quantity } : item
        )
        setLocalCart(localCart)
      }

      setItems(prev => prev.map(item =>
        item.id === cartItemId ? { ...item, quantity } : item
      ))
    } catch (error) {
      console.error('Error updating quantity:', error)
    }
  }, [isAuthenticated, removeFromCart])

  // Clear entire cart
  const clearCart = useCallback(async () => {
    try {
      if (isAuthenticated && userId) {
        const { error } = await supabase
          .from('cart')
          .delete()
          .eq('user_id', userId)

        if (error) {
          console.error('Error clearing cart:', error)
          return
        }
      } else {
        // Clear local storage
        setLocalCart([])
      }

      setItems([])
    } catch (error) {
      console.error('Error clearing cart:', error)
    }
  }, [isAuthenticated, userId])

  return (
    <CartContext.Provider value={{
      items,
      isLoading,
      totalItems,
      totalPrice,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      refreshCart,
    }}>
      {children}
    </CartContext.Provider>
  )
}

export default CartProvider
