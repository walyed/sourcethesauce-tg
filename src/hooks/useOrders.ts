import { useState, useEffect, useCallback } from 'react'
import { ordersService, CreateOrderParams, CartIdentifier } from '@/services/supabase-api'
import { useTelegramAuth } from '@/context/telegram-auth'

export function useOrders(page = 1, limit = 10) {
  const { user } = useTelegramAuth()
  const [data, setData] = useState<{ orders: any[]; pagination: any } | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchOrders = useCallback(async () => {
    if (!user?.id) return

    setIsLoading(true)
    setError(null)

    try {
      const identifier: CartIdentifier = { userId: user.id }
      if (user.telegram_id) {
        identifier.telegramId = user.telegram_id
      }
      
      const result = await ordersService.getAll(identifier, page, limit)
      setData(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch orders')
    } finally {
      setIsLoading(false)
    }
  }, [user?.id, user?.telegram_id, page, limit])

  useEffect(() => {
    fetchOrders()
  }, [fetchOrders])

  return {
    orders: data?.orders || [],
    pagination: data?.pagination,
    isLoading,
    error,
    refetch: fetchOrders,
  }
}

export function useOrder(id: string | null) {
  const { user } = useTelegramAuth()
  const [data, setData] = useState<any | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return

    const fetchOrder = async () => {
      setIsLoading(true)
      setError(null)

      try {
        const identifier: CartIdentifier | undefined = user?.id 
          ? { userId: user.id, telegramId: user.telegram_id || undefined }
          : undefined
        
        const result = await ordersService.getById(id, identifier)
        setData(result.order)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch order')
      } finally {
        setIsLoading(false)
      }
    }

    fetchOrder()
  }, [id, user?.id, user?.telegram_id])

  return {
    order: data,
    isLoading,
    error,
  }
}

export function useCreateOrder() {
  const { user } = useTelegramAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const createOrder = useCallback(async (
    shippingAddress: CreateOrderParams['shippingAddress'],
    options?: {
      billingAddress?: CreateOrderParams['billingAddress']
      paymentMethod?: string
      notes?: string
    }
  ) => {
    if (!user?.id) {
      setError('Please sign in to place an order')
      return null
    }

    setIsLoading(true)
    setError(null)

    try {
      const params: CreateOrderParams = {
        userId: user.id,
        telegramId: user.telegram_id || undefined,
        shippingAddress,
        billingAddress: options?.billingAddress,
        paymentMethod: options?.paymentMethod,
        notes: options?.notes,
      }

      const result = await ordersService.create(params)
      return result.order
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to create order'
      setError(message)
      return null
    } finally {
      setIsLoading(false)
    }
  }, [user?.id, user?.telegram_id])

  return {
    createOrder,
    isLoading,
    error,
  }
}
