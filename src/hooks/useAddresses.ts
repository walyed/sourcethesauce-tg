import { useState, useEffect, useCallback } from 'react'
import { addressesService, AddressParams, CartIdentifier } from '@/services/supabase-api'
import { useTelegramAuth } from '@/context/telegram-auth'

export function useAddresses() {
  const { user } = useTelegramAuth()
  const [addresses, setAddresses] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchAddresses = useCallback(async () => {
    if (!user?.id) return

    setIsLoading(true)
    setError(null)

    try {
      const identifier: CartIdentifier = { userId: user.id }
      if (user.telegram_id) {
        identifier.telegramId = user.telegram_id
      }
      
      const result = await addressesService.getAll(identifier)
      setAddresses(result.addresses)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch addresses')
    } finally {
      setIsLoading(false)
    }
  }, [user?.id, user?.telegram_id])

  useEffect(() => {
    fetchAddresses()
  }, [fetchAddresses])

  const addAddress = useCallback(async (params: Omit<AddressParams, 'userId' | 'telegramId'>) => {
    if (!user?.id) {
      setError('Please sign in to add an address')
      return null
    }

    try {
      const result = await addressesService.create({
        ...params,
        userId: user.id,
        telegramId: user.telegram_id || undefined,
      })
      
      // Refetch addresses
      await fetchAddresses()
      return result.address
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add address')
      return null
    }
  }, [user?.id, user?.telegram_id, fetchAddresses])

  const updateAddress = useCallback(async (addressId: string, params: Partial<AddressParams>) => {
    try {
      const result = await addressesService.update(addressId, params)
      
      // Refetch addresses
      await fetchAddresses()
      return result.address
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update address')
      return null
    }
  }, [fetchAddresses])

  const deleteAddress = useCallback(async (addressId: string) => {
    try {
      await addressesService.delete(addressId)
      
      // Update local state
      setAddresses(prev => prev.filter(a => a.id !== addressId))
      return true
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete address')
      return false
    }
  }, [])

  const defaultAddress = addresses.find(a => a.is_default)

  return {
    addresses,
    defaultAddress,
    isLoading,
    error,
    refetch: fetchAddresses,
    addAddress,
    updateAddress,
    deleteAddress,
  }
}
