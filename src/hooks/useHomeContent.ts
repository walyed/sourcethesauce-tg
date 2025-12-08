import { useState, useEffect } from 'react'
import { homeService } from '@/services/supabase-api'

export function useHomeContent() {
  const [data, setData] = useState<{
    aboveFold: any[]
    seasonSale: any
    collectionBanners: any[]
    collections: any[]
    categories: any[]
    featured: Record<string, any[]>
  } | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchHomeContent = async () => {
      setIsLoading(true)
      setError(null)

      try {
        const result = await homeService.getContent()
        setData(result)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch home content')
      } finally {
        setIsLoading(false)
      }
    }

    fetchHomeContent()
  }, [])

  return {
    aboveFold: data?.aboveFold || [],
    seasonSale: data?.seasonSale,
    collectionBanners: data?.collectionBanners || [],
    collections: data?.collections || [],
    categories: data?.categories || [],
    featured: data?.featured || {},
    isLoading,
    error,
  }
}
