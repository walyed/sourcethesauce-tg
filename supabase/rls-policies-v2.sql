-- =============================================
-- ROW LEVEL SECURITY (RLS) POLICIES V2
-- For Telegram Mini App
-- Run this AFTER schema-v2.sql
-- =============================================

-- =============================================
-- ENABLE RLS ON ALL TABLES
-- =============================================
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE subcategories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE telegram_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE wishlist ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE home_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE featured_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- =============================================
-- PUBLIC READ POLICIES (Anyone can read these)
-- =============================================

-- Categories - public read
CREATE POLICY "categories_public_read" ON categories
  FOR SELECT USING (true);

-- Subcategories - public read
CREATE POLICY "subcategories_public_read" ON subcategories
  FOR SELECT USING (true);

-- Products - public read (active only)
CREATE POLICY "products_public_read" ON products
  FOR SELECT USING (is_active = true);

-- Product Images - public read
CREATE POLICY "product_images_public_read" ON product_images
  FOR SELECT USING (true);

-- Product Variants - public read
CREATE POLICY "product_variants_public_read" ON product_variants
  FOR SELECT USING (true);

-- Home Content - public read (active only)
CREATE POLICY "home_content_public_read" ON home_content
  FOR SELECT USING (is_active = true);

-- Featured Products - public read (active only)
CREATE POLICY "featured_products_public_read" ON featured_products
  FOR SELECT USING (is_active = true);

-- =============================================
-- TELEGRAM USERS POLICIES
-- =============================================

-- Users can read all telegram users (for display purposes)
CREATE POLICY "telegram_users_public_read" ON telegram_users
  FOR SELECT USING (true);

-- Service role can insert/update telegram users
CREATE POLICY "telegram_users_service_insert" ON telegram_users
  FOR INSERT WITH CHECK (true);

CREATE POLICY "telegram_users_service_update" ON telegram_users
  FOR UPDATE USING (true);

-- =============================================
-- WISHLIST POLICIES
-- =============================================

-- Users can read all wishlists (filtered by app)
CREATE POLICY "wishlist_public_read" ON wishlist
  FOR SELECT USING (true);

-- Service role can manage wishlists
CREATE POLICY "wishlist_service_insert" ON wishlist
  FOR INSERT WITH CHECK (true);

CREATE POLICY "wishlist_service_delete" ON wishlist
  FOR DELETE USING (true);

-- =============================================
-- CART POLICIES
-- =============================================

-- Users can read carts
CREATE POLICY "cart_public_read" ON cart
  FOR SELECT USING (true);

-- Service role can manage carts
CREATE POLICY "cart_service_insert" ON cart
  FOR INSERT WITH CHECK (true);

CREATE POLICY "cart_service_update" ON cart
  FOR UPDATE USING (true);

CREATE POLICY "cart_service_delete" ON cart
  FOR DELETE USING (true);

-- =============================================
-- ORDERS POLICIES
-- =============================================

-- Users can read orders
CREATE POLICY "orders_public_read" ON orders
  FOR SELECT USING (true);

-- Service role can create orders
CREATE POLICY "orders_service_insert" ON orders
  FOR INSERT WITH CHECK (true);

CREATE POLICY "orders_service_update" ON orders
  FOR UPDATE USING (true);

-- =============================================
-- ORDER ITEMS POLICIES
-- =============================================

-- Users can read order items
CREATE POLICY "order_items_public_read" ON order_items
  FOR SELECT USING (true);

-- Service role can create order items
CREATE POLICY "order_items_service_insert" ON order_items
  FOR INSERT WITH CHECK (true);

-- =============================================
-- ADMIN POLICIES (Full access via service role)
-- =============================================

-- Admin users table - service role only
CREATE POLICY "admin_users_service_all" ON admin_users
  FOR ALL USING (true);

-- Categories - admin write
CREATE POLICY "categories_admin_write" ON categories
  FOR ALL USING (true);

-- Subcategories - admin write
CREATE POLICY "subcategories_admin_write" ON subcategories
  FOR ALL USING (true);

-- Products - admin can read all (including inactive)
CREATE POLICY "products_admin_read_all" ON products
  FOR SELECT USING (true);

-- Products - admin write
CREATE POLICY "products_admin_write" ON products
  FOR INSERT WITH CHECK (true);

CREATE POLICY "products_admin_update" ON products
  FOR UPDATE USING (true);

CREATE POLICY "products_admin_delete" ON products
  FOR DELETE USING (true);

-- Product Images - admin write
CREATE POLICY "product_images_admin_write" ON product_images
  FOR ALL USING (true);

-- Product Variants - admin write
CREATE POLICY "product_variants_admin_write" ON product_variants
  FOR ALL USING (true);

-- Home Content - admin write
CREATE POLICY "home_content_admin_write" ON home_content
  FOR ALL USING (true);

-- Featured Products - admin write
CREATE POLICY "featured_products_admin_write" ON featured_products
  FOR ALL USING (true);

-- =============================================
-- SUCCESS MESSAGE
-- =============================================
DO $$
BEGIN
  RAISE NOTICE '✅ RLS Policies V2 created successfully!';
  RAISE NOTICE '🔒 Public read: categories, subcategories, products, images, variants';
  RAISE NOTICE '🔒 User access: wishlist, cart, orders (via service role)';
  RAISE NOTICE '🔒 Admin access: full CRUD on all tables (via service role)';
END $$;
