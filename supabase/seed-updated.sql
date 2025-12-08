-- =============================================
-- UPDATED SEED DATA FOR CLOTHING STORE
-- Run this in Supabase SQL Editor after schema.sql and rls-policies.sql
-- Uses placeholder images since original host is down
-- =============================================

-- Clear existing data (optional - uncomment if needed)
-- TRUNCATE TABLE featured_products, home_content, promotions, product_colors, product_sizes, product_images, products, categories CASCADE;

-- =============================================
-- 1. INSERT CATEGORIES
-- =============================================
INSERT INTO categories (id, slug, name, description, is_active, sort_order) VALUES
  ('c1000000-0000-0000-0000-000000000001'::uuid, 'clothes', 'Clothes', 'All clothing items including shirts, dresses, sweaters', true, 1),
  ('c1000000-0000-0000-0000-000000000002'::uuid, 'shoes', 'Shoes', 'Footwear including sneakers, boots, and sandals', true, 2),
  ('c1000000-0000-0000-0000-000000000003'::uuid, 'accessories', 'Accessories', 'Fashion accessories including scarves, bags, and jewelry', true, 3),
  ('c1000000-0000-0000-0000-000000000004'::uuid, 'woman', 'Woman', 'Women clothing and accessories', true, 4),
  ('c1000000-0000-0000-0000-000000000005'::uuid, 'man', 'Man', 'Men clothing and accessories', true, 5),
  ('c1000000-0000-0000-0000-000000000006'::uuid, 'kids', 'Kids', 'Kids clothing and accessories', true, 6)
ON CONFLICT (id) DO UPDATE SET
  slug = EXCLUDED.slug,
  name = EXCLUDED.name,
  description = EXCLUDED.description;

-- =============================================
-- 2. INSERT PRODUCTS
-- =============================================
INSERT INTO products (id, sku, name, description, price, category_id, brand, rating, is_new, is_sold_out, is_active) VALUES
  ('a1000000-0000-0000-0000-000000000001'::uuid, 'FZSHFAX', 'Faxon Canvas Low-Top Sneaker', 
   'Premium canvas sneaker with comfortable rubber sole. Perfect for casual everyday wear.',
   400.00, 'c1000000-0000-0000-0000-000000000002'::uuid, 'shoes', 3.0, false, false, true),
  
  ('a1000000-0000-0000-0000-000000000002'::uuid, 'FZCSVI', 'Viscose-Cashmere Scarf',
   'Luxurious blend of viscose and cashmere. Soft, warm, and stylish for any season.',
   547.00, 'c1000000-0000-0000-0000-000000000001'::uuid, 'clothes', 4.0, true, false, true),
  
  ('a1000000-0000-0000-0000-000000000003'::uuid, 'FZCSFP', 'Plaid Cotton Oxford Shirt',
   'Classic plaid pattern on premium cotton. Button-down collar with comfortable fit.',
   547.00, 'c1000000-0000-0000-0000-000000000001'::uuid, 'clothes', 4.0, false, false, true),
  
  ('a1000000-0000-0000-0000-000000000004'::uuid, 'FZCSRO', 'Round Neck Sweater',
   'Cozy round neck sweater in soft knit. Perfect layering piece for cooler days.',
   320.00, 'c1000000-0000-0000-0000-000000000001'::uuid, 'clothes', 4.0, false, false, true),
  
  ('a1000000-0000-0000-0000-000000000005'::uuid, 'FZCSCAN', 'Canvas Slip-On Sneaker',
   'Easy slip-on design with canvas upper. Casual and comfortable for everyday.',
   320.00, 'c1000000-0000-0000-0000-000000000002'::uuid, 'shoes', 4.0, false, false, true),
  
  ('a1000000-0000-0000-0000-000000000006'::uuid, 'FZCSSA', 'Striped Cotton T-Shirt',
   'Classic striped tee in breathable cotton. Versatile wardrobe essential.',
   320.00, 'c1000000-0000-0000-0000-000000000001'::uuid, 'clothes', 4.0, false, false, true),
  
  ('a1000000-0000-0000-0000-000000000007'::uuid, 'FZCSDS', 'Denim Slim Jeans',
   'Modern slim fit jeans in quality denim. Comfortable stretch with classic look.',
   320.00, 'c1000000-0000-0000-0000-000000000001'::uuid, 'clothes', 4.0, false, true, true),
  
  ('a1000000-0000-0000-0000-000000000008'::uuid, 'FZCSDP', 'Two-Tone Sleeveless Dress',
   'Elegant sleeveless dress with two-tone design. Perfect for special occasions.',
   320.00, 'c1000000-0000-0000-0000-000000000001'::uuid, 'clothes', 4.0, true, false, true),
  
  ('a1000000-0000-0000-0000-000000000009'::uuid, 'FZCSPL', 'Wool Blend Pullover',
   'Warm wool blend pullover with ribbed cuffs. Cozy comfort for winter.',
   320.00, 'c1000000-0000-0000-0000-000000000001'::uuid, 'clothes', 4.0, false, false, true),
  
  ('a1000000-0000-0000-0000-00000000000a'::uuid, 'FZCSXS', 'Extra Soft Cardigan',
   'Ultra-soft cardigan with button front. Layer in style and comfort.',
   320.00, 'c1000000-0000-0000-0000-000000000001'::uuid, 'clothes', 4.0, false, false, true),
  
  ('a1000000-0000-0000-0000-00000000000b'::uuid, 'FZCSVB', 'V-Neck Basic Tee',
   'Essential v-neck tee in soft cotton. Available in multiple colors.',
   320.00, 'c1000000-0000-0000-0000-000000000001'::uuid, 'clothes', 4.0, true, false, true),
  
  ('a1000000-0000-0000-0000-00000000000c'::uuid, 'FZCSJH', 'Jersey Hoodie',
   'Comfortable jersey hoodie with kangaroo pocket. Casual style for any day.',
   320.00, 'c1000000-0000-0000-0000-000000000001'::uuid, 'clothes', 4.0, true, false, true)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price = EXCLUDED.price;

-- =============================================
-- 3. INSERT PRODUCT IMAGES (using placeholder images)
-- =============================================
DELETE FROM product_images WHERE product_id IN (
  SELECT id FROM products WHERE sku LIKE 'FZ%'
);

INSERT INTO product_images (product_id, image_url, sort_order, is_primary) VALUES
  -- Product 1 - Sneaker
  ('a1000000-0000-0000-0000-000000000001'::uuid, 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=500&fit=crop', 0, true),
  ('a1000000-0000-0000-0000-000000000001'::uuid, 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=400&h=500&fit=crop', 1, false),
  
  -- Product 2 - Scarf
  ('a1000000-0000-0000-0000-000000000002'::uuid, 'https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?w=400&h=500&fit=crop', 0, true),
  ('a1000000-0000-0000-0000-000000000002'::uuid, 'https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=400&h=500&fit=crop', 1, false),
  
  -- Product 3 - Shirt
  ('a1000000-0000-0000-0000-000000000003'::uuid, 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400&h=500&fit=crop', 0, true),
  ('a1000000-0000-0000-0000-000000000003'::uuid, 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=400&h=500&fit=crop', 1, false),
  
  -- Product 4 - Sweater
  ('a1000000-0000-0000-0000-000000000004'::uuid, 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=400&h=500&fit=crop', 0, true),
  ('a1000000-0000-0000-0000-000000000004'::uuid, 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=400&h=500&fit=crop', 1, false),
  
  -- Product 5 - Slip-on
  ('a1000000-0000-0000-0000-000000000005'::uuid, 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=400&h=500&fit=crop', 0, true),
  ('a1000000-0000-0000-0000-000000000005'::uuid, 'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=400&h=500&fit=crop', 1, false),
  
  -- Product 6 - T-Shirt
  ('a1000000-0000-0000-0000-000000000006'::uuid, 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=500&fit=crop', 0, true),
  ('a1000000-0000-0000-0000-000000000006'::uuid, 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=400&h=500&fit=crop', 1, false),
  
  -- Product 7 - Jeans
  ('a1000000-0000-0000-0000-000000000007'::uuid, 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=500&fit=crop', 0, true),
  ('a1000000-0000-0000-0000-000000000007'::uuid, 'https://images.unsplash.com/photo-1604176354204-9268737828e4?w=400&h=500&fit=crop', 1, false),
  
  -- Product 8 - Dress
  ('a1000000-0000-0000-0000-000000000008'::uuid, 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400&h=500&fit=crop', 0, true),
  ('a1000000-0000-0000-0000-000000000008'::uuid, 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=400&h=500&fit=crop', 1, false),
  
  -- Product 9 - Pullover
  ('a1000000-0000-0000-0000-000000000009'::uuid, 'https://images.unsplash.com/photo-1578587018452-892bacefd3f2?w=400&h=500&fit=crop', 0, true),
  ('a1000000-0000-0000-0000-000000000009'::uuid, 'https://images.unsplash.com/photo-1614975059251-992f11792571?w=400&h=500&fit=crop', 1, false),
  
  -- Product 10 - Cardigan
  ('a1000000-0000-0000-0000-00000000000a'::uuid, 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=400&h=500&fit=crop', 0, true),
  ('a1000000-0000-0000-0000-00000000000a'::uuid, 'https://images.unsplash.com/photo-1608234808654-2a8875faa7fd?w=400&h=500&fit=crop', 1, false),
  
  -- Product 11 - V-Neck Tee
  ('a1000000-0000-0000-0000-00000000000b'::uuid, 'https://images.unsplash.com/photo-1562157873-818bc0726f68?w=400&h=500&fit=crop', 0, true),
  ('a1000000-0000-0000-0000-00000000000b'::uuid, 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=400&h=500&fit=crop', 1, false),
  
  -- Product 12 - Hoodie
  ('a1000000-0000-0000-0000-00000000000c'::uuid, 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&h=500&fit=crop', 0, true),
  ('a1000000-0000-0000-0000-00000000000c'::uuid, 'https://images.unsplash.com/photo-1509942774463-acf339cf87d5?w=400&h=500&fit=crop', 1, false);

-- =============================================
-- 4. INSERT PRODUCT SIZES
-- =============================================
DELETE FROM product_sizes WHERE product_id IN (
  SELECT id FROM products WHERE sku LIKE 'FZ%'
);

INSERT INTO product_sizes (product_id, label, stock_quantity, is_available, sort_order)
SELECT 
  p.id,
  s.label,
  s.stock,
  true,
  s.sort_order
FROM products p
CROSS JOIN (
  VALUES 
    ('S', 10, 0),
    ('M', 20, 1),
    ('L', 15, 2),
    ('XL', 8, 3)
) AS s(label, stock, sort_order)
WHERE p.sku LIKE 'FZ%';

-- =============================================
-- 5. INSERT PRODUCT COLORS
-- =============================================
DELETE FROM product_colors WHERE product_id IN (
  SELECT id FROM products WHERE sku LIKE 'FZ%'
);

INSERT INTO product_colors (product_id, name, hex_value, is_available, sort_order)
SELECT 
  p.id,
  c.name,
  c.hex_value,
  true,
  c.sort_order
FROM products p
CROSS JOIN (
  VALUES 
    ('Blue', '#005B96', 0),
    ('Red', '#ED1B4C', 1),
    ('Cyan', '#2AB7CA', 2),
    ('Yellow', '#FED766', 3),
    ('Light Gray', '#E6E6EA', 4)
) AS c(name, hex_value, sort_order)
WHERE p.sku LIKE 'FZ%';

-- =============================================
-- 6. INSERT PROMOTIONS
-- =============================================
DELETE FROM promotions WHERE product_id IN (
  SELECT id FROM products WHERE sku LIKE 'FZ%'
);

INSERT INTO promotions (product_id, discount_percent, is_active) VALUES
  ('a1000000-0000-0000-0000-000000000001'::uuid, 23.00, true),
  ('a1000000-0000-0000-0000-000000000006'::uuid, 23.00, true),
  ('a1000000-0000-0000-0000-000000000007'::uuid, 23.00, true),
  ('a1000000-0000-0000-0000-000000000008'::uuid, 12.00, true);

-- =============================================
-- 7. INSERT HOME CONTENT - Above Fold Banners
-- =============================================
DELETE FROM home_content;

INSERT INTO home_content (section_type, title, subtitle, image_url, action_label, action_path, sort_order, is_active) VALUES
  ('above_fold', 'Favorite Clothing', '30% OFF', 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1920&h=800&fit=crop', 'get collection', '/c/clothes', 0, true),
  ('above_fold', 'New Season Arrivals', 'SHOP NOW', 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1920&h=800&fit=crop', 'get collection', '/c/clothes', 1, true);

-- =============================================
-- 8. INSERT HOME CONTENT - Season Sale
-- =============================================
INSERT INTO home_content (section_type, title, subtitle, description, image_url, action_label, action_path, sort_order, is_active) VALUES
  ('season_sale', 'Spring Sale', '30% OFF', '30% off on selected items', 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800&h=600&fit=crop', 'shop the sale', '/c/clothes', 0, true);

-- =============================================
-- 9. INSERT HOME CONTENT - Collection Banners
-- =============================================
INSERT INTO home_content (section_type, title, image_url, action_label, action_path, sort_order, is_active, metadata) VALUES
  ('collection_banner', 'Woman', 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&h=400&fit=crop', 'shop now', '/c/woman', 0, true, '{"collection_type": "woman"}'::jsonb),
  ('collection_banner', 'Man', 'https://images.unsplash.com/photo-1490578474895-699cd4e2cf59?w=600&h=400&fit=crop', 'shop now', '/c/man', 1, true, '{"collection_type": "man"}'::jsonb),
  ('collection_banner', 'Kids', 'https://images.unsplash.com/photo-1503919545889-aef636e10ad4?w=600&h=400&fit=crop', 'shop now', '/c/kids', 2, true, '{"collection_type": "kids"}'::jsonb);

-- =============================================
-- 10. INSERT HOME CONTENT - Collections
-- =============================================
INSERT INTO home_content (section_type, title, image_url, action_label, action_path, sort_order, is_active) VALUES
  ('collection', 'Fashion Clothing', 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=600&h=400&fit=crop', 'shop now', '/c/clothes', 0, true),
  ('collection', 'Accessories', 'https://images.unsplash.com/photo-1523779917675-b6ed3a42a561?w=600&h=400&fit=crop', 'shop now', '/c/accessories', 1, true),
  ('collection', 'New Arrivals', 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=400&fit=crop', 'shop now', '/c/clothes', 2, true),
  ('collection', 'Best Sellers', 'https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?w=600&h=400&fit=crop', 'shop now', '/c/clothes', 3, true);

-- =============================================
-- 11. INSERT FEATURED PRODUCTS
-- =============================================
DELETE FROM featured_products;

-- Arrivals
INSERT INTO featured_products (section_name, product_id, sort_order, is_active) VALUES
  ('arrivals', 'a1000000-0000-0000-0000-000000000001'::uuid, 0, true),
  ('arrivals', 'a1000000-0000-0000-0000-000000000003'::uuid, 1, true),
  ('arrivals', 'a1000000-0000-0000-0000-000000000004'::uuid, 2, true),
  ('arrivals', 'a1000000-0000-0000-0000-000000000002'::uuid, 3, true),
  ('arrivals', 'a1000000-0000-0000-0000-000000000006'::uuid, 4, true),
  ('arrivals', 'a1000000-0000-0000-0000-000000000008'::uuid, 5, true),
  ('arrivals', 'a1000000-0000-0000-0000-00000000000a'::uuid, 6, true);

-- Best Sale
INSERT INTO featured_products (section_name, product_id, sort_order, is_active) VALUES
  ('best_sale', 'a1000000-0000-0000-0000-000000000001'::uuid, 0, true),
  ('best_sale', 'a1000000-0000-0000-0000-000000000002'::uuid, 1, true),
  ('best_sale', 'a1000000-0000-0000-0000-000000000003'::uuid, 2, true),
  ('best_sale', 'a1000000-0000-0000-0000-000000000004'::uuid, 3, true),
  ('best_sale', 'a1000000-0000-0000-0000-000000000005'::uuid, 4, true),
  ('best_sale', 'a1000000-0000-0000-0000-000000000006'::uuid, 5, true),
  ('best_sale', 'a1000000-0000-0000-0000-000000000007'::uuid, 6, true);

-- Top Rate
INSERT INTO featured_products (section_name, product_id, sort_order, is_active) VALUES
  ('top_rate', 'a1000000-0000-0000-0000-000000000001'::uuid, 0, true),
  ('top_rate', 'a1000000-0000-0000-0000-000000000002'::uuid, 1, true),
  ('top_rate', 'a1000000-0000-0000-0000-000000000003'::uuid, 2, true),
  ('top_rate', 'a1000000-0000-0000-0000-000000000004'::uuid, 3, true),
  ('top_rate', 'a1000000-0000-0000-0000-000000000005'::uuid, 4, true);

-- =============================================
-- SUCCESS MESSAGE
-- =============================================
DO $$
BEGIN
  RAISE NOTICE '✅ Seed data inserted successfully!';
  RAISE NOTICE '📦 Created: 6 categories, 12 products with images, sizes, colors, and promotions';
  RAISE NOTICE '🏠 Created: Home page content (banners, collections, featured products)';
  RAISE NOTICE '🖼️ Using Unsplash images (free, reliable hosting)';
END $$;
