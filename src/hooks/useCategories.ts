import { useState, useEffect, useCallback, useMemo } from 'react'
import { categoriesService, ProductFilters } from '@/services/supabase-api'

export function useCategories(includeProducts = false) {
  const [data, setData] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchCategories = async () => {
      setIsLoading(true)
      setError(null)

      try {
        const result = await categoriesService.getAll(includeProducts)
        setData(result.categories)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch categories')
      } finally {
        setIsLoading(false)
      }
    }

    fetchCategories()
  }, [includeProducts])

  return {
    categories: data,
    isLoading,
    error,
  }
}

export function useCategory(slug: string | null, filters: Omit<ProductFilters, 'category'> = {}) {
  const [data, setData] = useState<{ category: any; products: any[]; pagination: any } | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Memoize filters to avoid unnecessary re-renders
  const filtersKey = useMemo(() => JSON.stringify(filters), [filters])

  const fetchCategory = useCallback(async () => {
    if (!slug) return

    setIsLoading(true)
    setError(null)

    try {
      // Parse filtersKey back to object to satisfy dependency requirements
      const parsedFilters = JSON.parse(filtersKey) as Omit<ProductFilters, 'category'>
      const result = await categoriesService.getBySlug(slug, parsedFilters)
      setData(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch category')
    } finally {
      setIsLoading(false)
    }
  }, [slug, filtersKey])

  useEffect(() => {
    fetchCategory()
  }, [fetchCategory])

  return {
    category: data?.category,
    products: data?.products || [],
    pagination: data?.pagination,
    isLoading,
    error,
    refetch: fetchCategory,
  }
}
