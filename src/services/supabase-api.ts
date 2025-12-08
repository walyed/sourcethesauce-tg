// API Service Layer for Supabase Backend
// All API calls go through these services

const API_BASE = '/api'

// Helper function for API calls
async function fetchAPI<T>(
  endpoint: string, 
  options?: RequestInit
): Promise<T> {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    ...options,
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.error || 'API request failed')
  }

  return data
}

// ============================================
// PRODUCTS SERVICE
// ============================================
export interface ProductFilters {
  category?: string
  search?: string
  minPrice?: number
  maxPrice?: number
  brand?: string
  isNew?: boolean
  isFeatured?: boolean
  sortBy?: 'price' | 'name' | 'created_at' | 'rating'
  sortOrder?: 'asc' | 'desc'
  page?: number
  limit?: number
}

export const productsService = {
  // Get all products with filters
  async getAll(filters: ProductFilters = {}) {
    const params = new URLSearchParams()
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, String(value))
      }
    })
    return fetchAPI<{ products: any[]; pagination: any }>(`/products?${params}`)
  },

  // Get single product
  async getById(id: string) {
    return fetchAPI<{ product: any }>(`/products/${id}`)
  },

  // Get featured products
  async getFeatured(section?: string) {
    const params = section ? `?section=${section}` : ''
    return fetchAPI<{ featured?: any; products?: any[] }>(`/products/featured${params}`)
  },

  // Search products
  async search(query: string, limit = 10) {
    return fetchAPI<{ products: any[]; categories: any[] }>(`/search?q=${encodeURIComponent(query)}&limit=${limit}`)
  },
}

// ============================================
// CATEGORIES SERVICE
// ============================================
export const categoriesService = {
  // Get all categories
  async getAll(includeProducts = false) {
    const params = includeProducts ? '?includeProducts=true' : ''
    return fetchAPI<{ categories: any[] }>(`/categories${params}`)
  },

  // Get category by slug with products
  async getBySlug(slug: string, filters: Omit<ProductFilters, 'category'> = {}) {
    const params = new URLSearchParams()
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, String(value))
      }
    })
    const queryString = params.toString() ? `?${params}` : ''
    return fetchAPI<{ category: any; products: any[]; pagination: any }>(`/categories/${slug}${queryString}`)
  },
}

// ============================================
// HOME SERVICE
// ============================================
export const homeService = {
  // Get all home page content
  async getContent() {
    return fetchAPI<{
      aboveFold: any[]
      seasonSale: any
      collectionBanners: any[]
      collections: any[]
      categories: any[]
      featured: Record<string, any[]>
    }>('/home')
  },
}

// ============================================
// CART SERVICE
// ============================================
export interface CartIdentifier {
  userId?: string
  sessionId?: string
  telegramId?: number
}

export interface AddToCartParams extends CartIdentifier {
  productId: string
  sizeId?: string
  colorId?: string
  quantity?: number
}

export const cartService = {
  // Get cart
  async get(identifier: CartIdentifier) {
    const params = new URLSearchParams()
    if (identifier.userId) params.append('userId', identifier.userId)
    if (identifier.sessionId) params.append('sessionId', identifier.sessionId)
    if (identifier.telegramId) params.append('telegramId', String(identifier.telegramId))
    
    return fetchAPI<{ cart: any; items: any[]; totals: any }>(`/cart?${params}`)
  },

  // Add item to cart
  async addItem(params: AddToCartParams) {
    return fetchAPI<{ success: boolean; item: any; message: string }>('/cart/add', {
      method: 'POST',
      body: JSON.stringify(params),
    })
  },

  // Update item quantity
  async updateItem(itemId: string, quantity: number) {
    return fetchAPI<{ success: boolean; item: any; message: string }>('/cart/update', {
      method: 'PUT',
      body: JSON.stringify({ itemId, quantity }),
    })
  },

  // Remove item from cart
  async removeItem(itemId: string) {
    return fetchAPI<{ success: boolean; message: string }>(`/cart/remove?itemId=${itemId}`, {
      method: 'DELETE',
    })
  },

  // Clear cart
  async clear(identifier: CartIdentifier) {
    const params = new URLSearchParams()
    if (identifier.userId) params.append('userId', identifier.userId)
    if (identifier.sessionId) params.append('sessionId', identifier.sessionId)
    if (identifier.telegramId) params.append('telegramId', String(identifier.telegramId))
    
    return fetchAPI<{ success: boolean; message: string }>(`/cart/clear?${params}`, {
      method: 'DELETE',
    })
  },
}

// ============================================
// ORDERS SERVICE
// ============================================
export interface CreateOrderParams {
  userId?: string
  telegramId?: number
  sessionId?: string
  shippingAddress: {
    full_name: string
    phone?: string
    address_line1: string
    address_line2?: string
    city: string
    state?: string
    postal_code: string
    country?: string
  }
  billingAddress?: {
    full_name: string
    phone?: string
    address_line1: string
    address_line2?: string
    city: string
    state?: string
    postal_code: string
    country?: string
  }
  paymentMethod?: string
  notes?: string
}

export const ordersService = {
  // Get user orders
  async getAll(identifier: CartIdentifier, page = 1, limit = 10) {
    const params = new URLSearchParams()
    if (identifier.userId) params.append('userId', identifier.userId)
    if (identifier.telegramId) params.append('telegramId', String(identifier.telegramId))
    params.append('page', String(page))
    params.append('limit', String(limit))
    
    return fetchAPI<{ orders: any[]; pagination: any }>(`/orders?${params}`)
  },

  // Get single order
  async getById(id: string, identifier?: CartIdentifier) {
    const params = new URLSearchParams()
    if (identifier?.userId) params.append('userId', identifier.userId)
    if (identifier?.telegramId) params.append('telegramId', String(identifier.telegramId))
    const queryString = params.toString() ? `?${params}` : ''
    
    return fetchAPI<{ order: any }>(`/orders/${id}${queryString}`)
  },

  // Create order
  async create(params: CreateOrderParams) {
    return fetchAPI<{ success: boolean; order: any; message: string }>('/orders', {
      method: 'POST',
      body: JSON.stringify(params),
    })
  },
}

// ============================================
// ADDRESSES SERVICE
// ============================================
export interface AddressParams {
  userId?: string
  telegramId?: number
  label?: string
  full_name: string
  phone?: string
  address_line1: string
  address_line2?: string
  city: string
  state?: string
  postal_code: string
  country?: string
  is_default?: boolean
}

export const addressesService = {
  // Get user addresses
  async getAll(identifier: CartIdentifier) {
    const params = new URLSearchParams()
    if (identifier.userId) params.append('userId', identifier.userId)
    if (identifier.telegramId) params.append('telegramId', String(identifier.telegramId))
    
    return fetchAPI<{ addresses: any[] }>(`/addresses?${params}`)
  },

  // Create address
  async create(params: AddressParams) {
    return fetchAPI<{ success: boolean; address: any; message: string }>('/addresses', {
      method: 'POST',
      body: JSON.stringify(params),
    })
  },

  // Update address
  async update(addressId: string, params: Partial<AddressParams>) {
    return fetchAPI<{ success: boolean; address: any; message: string }>('/addresses', {
      method: 'PUT',
      body: JSON.stringify({ addressId, ...params }),
    })
  },

  // Delete address
  async delete(addressId: string) {
    return fetchAPI<{ success: boolean; message: string }>(`/addresses?addressId=${addressId}`, {
      method: 'DELETE',
    })
  },
}

// ============================================
// AUTH SERVICE
// ============================================
export const authService = {
  // Authenticate with Telegram
  async telegramAuth(initData: string) {
    return fetchAPI<{ user: any; isNewUser: boolean }>('/auth/telegram', {
      method: 'POST',
      body: JSON.stringify({ initData }),
    })
  },

  // Get profile
  async getProfile(userId?: string, telegramId?: number) {
    const params = new URLSearchParams()
    if (userId) params.append('userId', userId)
    if (telegramId) params.append('telegramId', String(telegramId))
    
    return fetchAPI<{ user: any }>(`/auth/profile?${params}`)
  },

  // Update profile
  async updateProfile(userId: string, data: Record<string, any>) {
    return fetchAPI<{ user: any }>('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify({ userId, ...data }),
    })
  },
}

// Export all services
export const api = {
  products: productsService,
  categories: categoriesService,
  home: homeService,
  cart: cartService,
  orders: ordersService,
  addresses: addressesService,
  auth: authService,
}

export default api
