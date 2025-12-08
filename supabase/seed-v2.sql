-- =============================================
-- SEED DATA V2 FOR TELEGRAM MINI APP
-- Run this AFTER schema-v2.sql and rls-policies-v2.sql
-- =============================================

-- =============================================
-- 1. CATEGORIES
-- =============================================
INSERT INTO categories (id, name, slug, image_url, sort_order) VALUES
  ('ca100000-0000-0000-0000-000000000001'::uuid, 'Clothing', 'clothing', 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=400&h=400&fit=crop', 1),
  ('ca100000-0000-0000-0000-000000000002'::uuid, 'Shoes', 'shoes', 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop', 2),
  ('ca100000-0000-0000-0000-000000000003'::uuid, 'Accessories', 'accessories', 'https://images.unsplash.com/photo-1523779917675-b6ed3a42a561?w=400&h=400&fit=crop', 3),
  ('ca100000-0000-0000-0000-000000000004'::uuid, 'Women', 'women', 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400&h=400&fit=crop', 4),
  ('ca100000-0000-0000-0000-000000000005'::uuid, 'Men', 'men', 'https://images.unsplash.com/photo-1490578474895-699cd4e2cf59?w=400&h=400&fit=crop', 5)
ON CONFLICT (slug) DO NOTHING;

-- =============================================
-- 2. SUBCATEGORIES
-- =============================================
INSERT INTO subcategories (id, category_id, name, slug, sort_order) VALUES
  -- Clothing subcategories
  ('5b100000-0000-0000-0000-000000000001'::uuid, 'ca100000-0000-0000-0000-000000000001'::uuid, 'T-Shirts', 't-shirts', 1),
  ('5b100000-0000-0000-0000-000000000002'::uuid, 'ca100000-0000-0000-0000-000000000001'::uuid, 'Shirts', 'shirts', 2),
  ('5b100000-0000-0000-0000-000000000003'::uuid, 'ca100000-0000-0000-0000-000000000001'::uuid, 'Sweaters', 'sweaters', 3),
  ('5b100000-0000-0000-0000-000000000004'::uuid, 'ca100000-0000-0000-0000-000000000001'::uuid, 'Jeans', 'jeans', 4),
  ('5b100000-0000-0000-0000-000000000005'::uuid, 'ca100000-0000-0000-0000-000000000001'::uuid, 'Dresses', 'dresses', 5),
  -- Shoes subcategories
  ('5b100000-0000-0000-0000-000000000006'::uuid, 'ca100000-0000-0000-0000-000000000002'::uuid, 'Sneakers', 'sneakers', 1),
  ('5b100000-0000-0000-0000-000000000007'::uuid, 'ca100000-0000-0000-0000-000000000002'::uuid, 'Boots', 'boots', 2),
  ('5b100000-0000-0000-0000-000000000008'::uuid, 'ca100000-0000-0000-0000-000000000002'::uuid, 'Sandals', 'sandals', 3),
  -- Accessories subcategories
  ('5b100000-0000-0000-0000-000000000009'::uuid, 'ca100000-0000-0000-0000-000000000003'::uuid, 'Scarves', 'scarves', 1),
  ('5b100000-0000-0000-0000-000000000010'::uuid, 'ca100000-0000-0000-0000-000000000003'::uuid, 'Bags', 'bags', 2),
  ('5b100000-0000-0000-0000-000000000011'::uuid, 'ca100000-0000-0000-0000-000000000003'::uuid, 'Watches', 'watches', 3)
ON CONFLICT (slug) DO NOTHING;

-- =============================================
-- 3. PRODUCTS (12 products)
-- =============================================
INSERT INTO products (id, category_id, subcategory_id, name, description, price, cost_price, sku, is_active, is_featured, is_new) VALUES
  ('d0100000-0000-0000-0000-000000000001'::uuid, 'ca100000-0000-0000-0000-000000000002'::uuid, '5b100000-0000-0000-0000-000000000006'::uuid, 
   'Canvas Low-Top Sneaker', 'Premium canvas sneaker with comfortable rubber sole. Perfect for casual everyday wear.', 
   400.00, 200.00, 'SNK001', true, true, false),
  
  ('d0100000-0000-0000-0000-000000000002'::uuid, 'ca100000-0000-0000-0000-000000000003'::uuid, '5b100000-0000-0000-0000-000000000009'::uuid,
   'Cashmere Scarf', 'Luxurious blend of viscose and cashmere. Soft, warm, and stylish.',
   547.00, 250.00, 'SCF001', true, true, true),
  
  ('d0100000-0000-0000-0000-000000000003'::uuid, 'ca100000-0000-0000-0000-000000000001'::uuid, '5b100000-0000-0000-0000-000000000002'::uuid,
   'Plaid Cotton Shirt', 'Classic plaid pattern on premium cotton. Button-down collar.',
   320.00, 150.00, 'SHT001', true, false, false),
  
  ('d0100000-0000-0000-0000-000000000004'::uuid, 'ca100000-0000-0000-0000-000000000001'::uuid, '5b100000-0000-0000-0000-000000000003'::uuid,
   'Round Neck Sweater', 'Cozy round neck sweater in soft knit. Perfect for cooler days.',
   280.00, 130.00, 'SWT001', true, false, true),
  
  ('d0100000-0000-0000-0000-000000000005'::uuid, 'ca100000-0000-0000-0000-000000000002'::uuid, '5b100000-0000-0000-0000-000000000006'::uuid,
   'Slip-On Sneaker', 'Easy slip-on design with canvas upper. Casual and comfortable.',
   320.00, 160.00, 'SNK002', true, true, false),
  
  ('d0100000-0000-0000-0000-000000000006'::uuid, 'ca100000-0000-0000-0000-000000000001'::uuid, '5b100000-0000-0000-0000-000000000001'::uuid,
   'Striped Cotton T-Shirt', 'Classic striped tee in breathable cotton.',
   180.00, 80.00, 'TSH001', true, false, false),
  
  ('d0100000-0000-0000-0000-000000000007'::uuid, 'ca100000-0000-0000-0000-000000000001'::uuid, '5b100000-0000-0000-0000-000000000004'::uuid,
   'Slim Fit Jeans', 'Modern slim fit jeans in quality denim.',
   350.00, 170.00, 'JNS001', true, true, false),
  
  ('d0100000-0000-0000-0000-000000000008'::uuid, 'ca100000-0000-0000-0000-000000000001'::uuid, '5b100000-0000-0000-0000-000000000005'::uuid,
   'Sleeveless Dress', 'Elegant sleeveless dress. Perfect for special occasions.',
   450.00, 220.00, 'DRS001', true, true, true),
  
  ('d0100000-0000-0000-0000-000000000009'::uuid, 'ca100000-0000-0000-0000-000000000001'::uuid, '5b100000-0000-0000-0000-000000000003'::uuid,
   'Wool Blend Pullover', 'Warm wool blend pullover with ribbed cuffs.',
   380.00, 180.00, 'SWT002', true, false, false),
  
  ('d0100000-0000-0000-0000-000000000010'::uuid, 'ca100000-0000-0000-0000-000000000001'::uuid, '5b100000-0000-0000-0000-000000000003'::uuid,
   'Button Cardigan', 'Classic cardigan with button front.',
   320.00, 150.00, 'CRD001', true, false, true),
  
  ('d0100000-0000-0000-0000-000000000011'::uuid, 'ca100000-0000-0000-0000-000000000001'::uuid, '5b100000-0000-0000-0000-000000000001'::uuid,
   'V-Neck Basic Tee', 'Essential v-neck tee in soft cotton.',
   150.00, 60.00, 'TSH002', true, false, false),
  
  ('d0100000-0000-0000-0000-000000000012'::uuid, 'ca100000-0000-0000-0000-000000000001'::uuid, '5b100000-0000-0000-0000-000000000001'::uuid,
   'Jersey Hoodie', 'Comfortable jersey hoodie with kangaroo pocket.',
   280.00, 130.00, 'HOD001', true, true, true)
ON CONFLICT (sku) DO NOTHING;

-- =============================================
-- 4. PRODUCT IMAGES
-- =============================================
INSERT INTO product_images (product_id, url, position) VALUES
  ('d0100000-0000-0000-0000-000000000001'::uuid, 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=500&fit=crop', 0),
  ('d0100000-0000-0000-0000-000000000001'::uuid, 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=400&h=500&fit=crop', 1),
  ('d0100000-0000-0000-0000-000000000002'::uuid, 'https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?w=400&h=500&fit=crop', 0),
  ('d0100000-0000-0000-0000-000000000003'::uuid, 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400&h=500&fit=crop', 0),
  ('d0100000-0000-0000-0000-000000000004'::uuid, 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=400&h=500&fit=crop', 0),
  ('d0100000-0000-0000-0000-000000000005'::uuid, 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=400&h=500&fit=crop', 0),
  ('d0100000-0000-0000-0000-000000000006'::uuid, 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=500&fit=crop', 0),
  ('d0100000-0000-0000-0000-000000000007'::uuid, 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=500&fit=crop', 0),
  ('d0100000-0000-0000-0000-000000000008'::uuid, 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400&h=500&fit=crop', 0),
  ('d0100000-0000-0000-0000-000000000009'::uuid, 'https://images.unsplash.com/photo-1578587018452-892bacefd3f2?w=400&h=500&fit=crop', 0),
  ('d0100000-0000-0000-0000-000000000010'::uuid, 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=400&h=500&fit=crop', 0),
  ('d0100000-0000-0000-0000-000000000011'::uuid, 'https://images.unsplash.com/photo-1562157873-818bc0726f68?w=400&h=500&fit=crop', 0),
  ('d0100000-0000-0000-0000-000000000012'::uuid, 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&h=500&fit=crop', 0);

-- =============================================
-- 5. PRODUCT VARIANTS (colour + size)
-- =============================================
INSERT INTO product_variants (product_id, colour, colour_hex, size) VALUES
  -- Sneaker variants
  ('d0100000-0000-0000-0000-000000000001'::uuid, 'Red', '#ED1B4C', 'US 7'),
  ('d0100000-0000-0000-0000-000000000001'::uuid, 'Red', '#ED1B4C', 'US 8'),
  ('d0100000-0000-0000-0000-000000000001'::uuid, 'Red', '#ED1B4C', 'US 9'),
  ('d0100000-0000-0000-0000-000000000001'::uuid, 'Blue', '#005B96', 'US 7'),
  ('d0100000-0000-0000-0000-000000000001'::uuid, 'Blue', '#005B96', 'US 8'),
  ('d0100000-0000-0000-0000-000000000001'::uuid, 'Blue', '#005B96', 'US 9'),
  -- Scarf variants
  ('d0100000-0000-0000-0000-000000000002'::uuid, 'Beige', '#F5F5DC', 'One Size'),
  ('d0100000-0000-0000-0000-000000000002'::uuid, 'Gray', '#808080', 'One Size'),
  -- Shirt variants
  ('d0100000-0000-0000-0000-000000000003'::uuid, 'Navy', '#001F3F', 'S'),
  ('d0100000-0000-0000-0000-000000000003'::uuid, 'Navy', '#001F3F', 'M'),
  ('d0100000-0000-0000-0000-000000000003'::uuid, 'Navy', '#001F3F', 'L'),
  ('d0100000-0000-0000-0000-000000000003'::uuid, 'Navy', '#001F3F', 'XL'),
  -- Sweater variants
  ('d0100000-0000-0000-0000-000000000004'::uuid, 'Gray', '#808080', 'S'),
  ('d0100000-0000-0000-0000-000000000004'::uuid, 'Gray', '#808080', 'M'),
  ('d0100000-0000-0000-0000-000000000004'::uuid, 'Gray', '#808080', 'L'),
  ('d0100000-0000-0000-0000-000000000004'::uuid, 'Black', '#000000', 'M'),
  ('d0100000-0000-0000-0000-000000000004'::uuid, 'Black', '#000000', 'L'),
  -- Slip-on variants
  ('d0100000-0000-0000-0000-000000000005'::uuid, 'White', '#FFFFFF', 'US 8'),
  ('d0100000-0000-0000-0000-000000000005'::uuid, 'White', '#FFFFFF', 'US 9'),
  ('d0100000-0000-0000-0000-000000000005'::uuid, 'Black', '#000000', 'US 8'),
  ('d0100000-0000-0000-0000-000000000005'::uuid, 'Black', '#000000', 'US 9'),
  -- T-Shirt variants
  ('d0100000-0000-0000-0000-000000000006'::uuid, 'White/Blue', '#FFFFFF', 'S'),
  ('d0100000-0000-0000-0000-000000000006'::uuid, 'White/Blue', '#FFFFFF', 'M'),
  ('d0100000-0000-0000-0000-000000000006'::uuid, 'White/Blue', '#FFFFFF', 'L'),
  -- Jeans variants
  ('d0100000-0000-0000-0000-000000000007'::uuid, 'Blue', '#005B96', '30'),
  ('d0100000-0000-0000-0000-000000000007'::uuid, 'Blue', '#005B96', '32'),
  ('d0100000-0000-0000-0000-000000000007'::uuid, 'Blue', '#005B96', '34'),
  ('d0100000-0000-0000-0000-000000000007'::uuid, 'Black', '#000000', '32'),
  ('d0100000-0000-0000-0000-000000000007'::uuid, 'Black', '#000000', '34'),
  -- Dress variants
  ('d0100000-0000-0000-0000-000000000008'::uuid, 'Black', '#000000', 'S'),
  ('d0100000-0000-0000-0000-000000000008'::uuid, 'Black', '#000000', 'M'),
  ('d0100000-0000-0000-0000-000000000008'::uuid, 'Red', '#ED1B4C', 'S'),
  ('d0100000-0000-0000-0000-000000000008'::uuid, 'Red', '#ED1B4C', 'M'),
  -- Pullover variants
  ('d0100000-0000-0000-0000-000000000009'::uuid, 'Cream', '#FFFDD0', 'M'),
  ('d0100000-0000-0000-0000-000000000009'::uuid, 'Cream', '#FFFDD0', 'L'),
  -- Cardigan variants
  ('d0100000-0000-0000-0000-000000000010'::uuid, 'Beige', '#F5F5DC', 'S'),
  ('d0100000-0000-0000-0000-000000000010'::uuid, 'Beige', '#F5F5DC', 'M'),
  ('d0100000-0000-0000-0000-000000000010'::uuid, 'Beige', '#F5F5DC', 'L'),
  -- V-Neck Tee variants
  ('d0100000-0000-0000-0000-000000000011'::uuid, 'White', '#FFFFFF', 'S'),
  ('d0100000-0000-0000-0000-000000000011'::uuid, 'White', '#FFFFFF', 'M'),
  ('d0100000-0000-0000-0000-000000000011'::uuid, 'White', '#FFFFFF', 'L'),
  ('d0100000-0000-0000-0000-000000000011'::uuid, 'Black', '#000000', 'M'),
  ('d0100000-0000-0000-0000-000000000011'::uuid, 'Black', '#000000', 'L'),
  -- Hoodie variants
  ('d0100000-0000-0000-0000-000000000012'::uuid, 'Gray', '#808080', 'S'),
  ('d0100000-0000-0000-0000-000000000012'::uuid, 'Gray', '#808080', 'M'),
  ('d0100000-0000-0000-0000-000000000012'::uuid, 'Gray', '#808080', 'L'),
  ('d0100000-0000-0000-0000-000000000012'::uuid, 'Black', '#000000', 'M'),
  ('d0100000-0000-0000-0000-000000000012'::uuid, 'Black', '#000000', 'L');

-- =============================================
-- 6. HOME CONTENT
-- =============================================
INSERT INTO home_content (section_type, title, subtitle, description, image_url, action_label, action_path, sort_order) VALUES
  ('hero', 'FASHION FORWARD', 'NEW COLLECTION', 'Discover the latest trends in premium streetwear and exclusive drops', 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1920&h=800&fit=crop', 'EXPLORE COLLECTION', '/c/clothing', 0),
  ('hero', 'Summer Sale', '50% OFF', 'Limited time offer on selected items', 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1920&h=800&fit=crop', 'Shop Now', '/c/clothing', 1),
  ('banner', 'Women Collection', NULL, NULL, 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&h=400&fit=crop', 'Shop Now', '/c/women', 0),
  ('banner', 'Men Collection', NULL, NULL, 'https://images.unsplash.com/photo-1490578474895-699cd4e2cf59?w=600&h=400&fit=crop', 'Shop Now', '/c/men', 1);

-- =============================================
-- 7. FEATURED PRODUCTS
-- =============================================
INSERT INTO featured_products (section_name, product_id, sort_order) VALUES
  ('new_arrivals', 'd0100000-0000-0000-0000-000000000002'::uuid, 0),
  ('new_arrivals', 'd0100000-0000-0000-0000-000000000004'::uuid, 1),
  ('new_arrivals', 'd0100000-0000-0000-0000-000000000008'::uuid, 2),
  ('new_arrivals', 'd0100000-0000-0000-0000-000000000012'::uuid, 3),
  ('best_sellers', 'd0100000-0000-0000-0000-000000000001'::uuid, 0),
  ('best_sellers', 'd0100000-0000-0000-0000-000000000005'::uuid, 1),
  ('best_sellers', 'd0100000-0000-0000-0000-000000000007'::uuid, 2),
  ('featured', 'd0100000-0000-0000-0000-000000000001'::uuid, 0),
  ('featured', 'd0100000-0000-0000-0000-000000000002'::uuid, 1),
  ('featured', 'd0100000-0000-0000-0000-000000000005'::uuid, 2),
  ('featured', 'd0100000-0000-0000-0000-000000000007'::uuid, 3),
  ('featured', 'd0100000-0000-0000-0000-000000000008'::uuid, 4);

-- =============================================
-- SUCCESS MESSAGE
-- =============================================
DO $$
BEGIN
  RAISE NOTICE '✅ Seed data V2 inserted successfully!';
  RAISE NOTICE '📦 Created: 5 categories, 11 subcategories, 12 products';
  RAISE NOTICE '🎨 Created: Product images and variants (colour + size)';
  RAISE NOTICE '🏠 Created: Home content and featured products';
END $$;
