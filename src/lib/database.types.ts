// Database types for Supabase
// These types match the database schema

export interface Category {
  id: string
  slug: string
  name: string
  description: string | null
  image_url: string | null
  parent_id: string | null
  is_active: boolean
  sort_order: number
  created_at: string
  updated_at: string
}

export interface Product {
  id: string
  sku: string
  name: string
  description: string | null
  price: number
  compare_at_price: number | null
  cost_price: number | null
  category_id: string | null
  brand: string | null
  rating: number
  rating_count: number
  is_new: boolean
  is_featured: boolean
  is_sold_out: boolean
  is_active: boolean
  meta_title: string | null
  meta_description: string | null
  tags: string[] | null
  created_at: string
  updated_at: string
  // Relations (when joined)
  category?: Category
  images?: ProductImage[]
  sizes?: ProductSize[]
  colors?: ProductColor[]
  promotion?: Promotion
}

export interface ProductImage {
  id: string
  product_id: string
  image_url: string
  alt_text: string | null
  sort_order: number
  is_primary: boolean
  created_at: string
}

export interface ProductSize {
  id: string
  product_id: string
  label: string
  stock_quantity: number
  is_available: boolean
  sort_order: number
  created_at: string
}

export interface ProductColor {
  id: string
  product_id: string
  name: string | null
  hex_value: string
  image_url: string | null
  is_available: boolean
  sort_order: number
  created_at: string
}

export interface Promotion {
  id: string
  product_id: string
  discount_percent: number
  start_date: string
  end_date: string | null
  is_active: boolean
  created_at: string
}

export interface Profile {
  id: string
  email: string | null
  full_name: string | null
  phone: string | null
  avatar_url: string | null
  role: 'customer' | 'admin' | 'staff'
  // Telegram fields
  telegram_id: number | null
  telegram_username: string | null
  telegram_first_name: string | null
  telegram_last_name: string | null
  telegram_photo_url: string | null
  telegram_language_code: string | null
  telegram_is_premium: boolean
  auth_provider: 'supabase' | 'telegram'
  last_seen_at: string | null
  created_at: string
  updated_at: string
}

export interface Address {
  id: string
  user_id: string
  label: string
  full_name: string
  phone: string | null
  address_line1: string
  address_line2: string | null
  city: string
  state: string | null
  postal_code: string
  country: string
  is_default: boolean
  created_at: string
  updated_at: string
}

export interface Cart {
  id: string
  user_id: string | null
  session_id: string | null
  created_at: string
  updated_at: string
  items?: CartItem[]
}

export interface CartItem {
  id: string
  cart_id: string
  product_id: string
  size_id: string | null
  color_id: string | null
  quantity: number
  unit_price: number
  created_at: string
  updated_at: string
  // Relations (when joined)
  product?: Product
  size?: ProductSize
  color?: ProductColor
}

export type OrderStatus = 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded'
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded'

export interface Order {
  id: string
  order_number: string
  user_id: string | null
  status: OrderStatus
  payment_status: PaymentStatus
  payment_method: string | null
  payment_id: string | null
  
  subtotal: number
  discount_amount: number
  shipping_amount: number
  tax_amount: number
  total_amount: number
  
  // Shipping address
  shipping_name: string | null
  shipping_phone: string | null
  shipping_address_line1: string | null
  shipping_address_line2: string | null
  shipping_city: string | null
  shipping_state: string | null
  shipping_postal_code: string | null
  shipping_country: string | null
  
  // Billing address
  billing_name: string | null
  billing_phone: string | null
  billing_address_line1: string | null
  billing_address_line2: string | null
  billing_city: string | null
  billing_state: string | null
  billing_postal_code: string | null
  billing_country: string | null
  
  notes: string | null
  shipped_at: string | null
  delivered_at: string | null
  cancelled_at: string | null
  created_at: string
  updated_at: string
  
  // Relations
  items?: OrderItem[]
  user?: Profile
}

export interface OrderItem {
  id: string
  order_id: string
  product_id: string | null
  product_name: string
  product_sku: string | null
  product_image: string | null
  size_label: string | null
  color_name: string | null
  color_hex: string | null
  quantity: number
  unit_price: number
  discount_percent: number
  total_price: number
  created_at: string
}

export interface Wishlist {
  id: string
  user_id: string
  product_id: string
  created_at: string
  product?: Product
}

export interface Review {
  id: string
  product_id: string
  user_id: string
  order_id: string | null
  rating: number
  title: string | null
  comment: string | null
  is_verified_purchase: boolean
  is_approved: boolean
  created_at: string
  updated_at: string
  user?: Profile
}

export interface HomeContent {
  id: string
  section_type: 'above_fold' | 'season_sale' | 'collection_banner'
  title: string | null
  subtitle: string | null
  description: string | null
  image_url: string | null
  action_label: string | null
  action_path: string | null
  sort_order: number
  is_active: boolean
  metadata: Record<string, any> | null
  created_at: string
  updated_at: string
}

export interface FeaturedProduct {
  id: string
  section_name: string
  product_id: string
  sort_order: number
  is_active: boolean
  created_at: string
  product?: Product
}

// API Response Types
export interface PaginatedResponse<T> {
  data: T[]
  count: number
  page: number
  pageSize: number
  totalPages: number
}

export interface ProductWithDetails extends Omit<Product, 'category' | 'promotion'> {
  images: ProductImage[]
  sizes: ProductSize[]
  colors: ProductColor[]
  promotion: Promotion | null
  category: Category | null
}

// Input Types for Creating/Updating
export interface CreateProductInput {
  sku: string
  name: string
  description?: string
  price: number
  compare_at_price?: number
  category_id?: string
  brand?: string
  is_new?: boolean
  is_featured?: boolean
  tags?: string[]
}

export interface UpdateProductInput extends Partial<CreateProductInput> {
  is_sold_out?: boolean
  is_active?: boolean
}

export interface CreateOrderInput {
  items: {
    product_id: string
    size_id?: string
    color_id?: string
    quantity: number
  }[]
  shipping_address_id?: string
  billing_address_id?: string
  payment_method: string
  notes?: string
}

export interface AddToCartInput {
  product_id: string
  size_id?: string
  color_id?: string
  quantity: number
}
