import { useState, useEffect, useCallback, useMemo } from 'react'
import { productsService, ProductFilters } from '@/services/supabase-api'

interface UseProductsOptions extends ProductFilters {
  enabled?: boolean
}

export function useProducts(options: UseProductsOptions = {}) {
  const { enabled = true, ...filters } = options
  const [data, setData] = useState<{ products: any[]; pagination: any } | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Memoize filters to avoid unnecessary re-renders
  const filtersKey = useMemo(() => JSON.stringify(filters), [filters])

  const fetchProducts = useCallback(async () => {
    if (!enabled) return

    setIsLoading(true)
    setError(null)

    try {
      // Parse filtersKey back to object to satisfy dependency requirements
      const parsedFilters = JSON.parse(filtersKey) as ProductFilters
      const result = await productsService.getAll(parsedFilters)
      setData(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch products')
    } finally {
      setIsLoading(false)
    }
  }, [enabled, filtersKey])

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  return {
    products: data?.products || [],
    pagination: data?.pagination,
    isLoading,
    error,
    refetch: fetchProducts,
  }
}

export function useProduct(id: string | null) {
  const [data, setData] = useState<any | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return

    const fetchProduct = async () => {
      setIsLoading(true)
      setError(null)

      try {
        const result = await productsService.getById(id)
        setData(result.product)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch product')
      } finally {
        setIsLoading(false)
      }
    }

    fetchProduct()
  }, [id])

  return {
    product: data,
    isLoading,
    error,
  }
}

export function useFeaturedProducts(section?: string) {
  const [data, setData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchFeatured = async () => {
      setIsLoading(true)
      setError(null)

      try {
        const result = await productsService.getFeatured(section)
        setData(section ? result.products : result.featured)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch featured products')
      } finally {
        setIsLoading(false)
      }
    }

    fetchFeatured()
  }, [section])

  return {
    featured: data,
    isLoading,
    error,
  }
}

export function useProductSearch(query: string, limit = 10) {
  const [data, setData] = useState<{ products: any[]; categories: any[] } | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!query || query.length < 2) {
      setData(null)
      return
    }

    const searchProducts = async () => {
      setIsLoading(true)
      setError(null)

      try {
        const result = await productsService.search(query, limit)
        setData(result)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Search failed')
      } finally {
        setIsLoading(false)
      }
    }

    // Debounce search
    const timeoutId = setTimeout(searchProducts, 300)
    return () => clearTimeout(timeoutId)
  }, [query, limit])

  return {
    results: data,
    isLoading,
    error,
  }
}
