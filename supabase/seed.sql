-- =============================================
-- SEED DATA FOR CLOTHING STORE
-- Run this in Supabase SQL Editor after schema.sql and rls-policies.sql
-- =============================================

-- =============================================
-- 1. INSERT CATEGORIES
-- =============================================
INSERT INTO categories (id, slug, name, description, is_active, sort_order) VALUES
  ('c1000000-0000-0000-0000-000000000001'::uuid, 'clothes', 'Clothes', 'All clothing items including shirts, dresses, sweaters', true, 1),
  ('c1000000-0000-0000-0000-000000000002'::uuid, 'shoes', 'Shoes', 'Footwear including sneakers, boots, and sandals', true, 2),
  ('c1000000-0000-0000-0000-000000000003'::uuid, 'accessories', 'Accessories', 'Fashion accessories including scarves, bags, and jewelry', true, 3),
  ('c1000000-0000-0000-0000-000000000004'::uuid, 'woman', 'Woman', 'Women clothing and accessories', true, 4),
  ('c1000000-0000-0000-0000-000000000005'::uuid, 'man', 'Man', 'Men clothing and accessories', true, 5),
  ('c1000000-0000-0000-0000-000000000006'::uuid, 'kids', 'Kids', 'Kids clothing and accessories', true, 6);

-- =============================================
-- 2. INSERT PRODUCTS
-- =============================================
INSERT INTO products (id, sku, name, description, price, category_id, brand, rating, is_new, is_sold_out, is_active) VALUES
  -- Product 1
  ('a1000000-0000-0000-0000-000000000001'::uuid, 'FZSHFAX', 'Faxon Canvas Low-Top Sneaker', 
   'Mussum Ipsum, cacilds vidis litro abertis. Admodum accumsan disputationi eu sit. Vide electram sadipscing et per. Per aumento de cachacis, eu reclamis. Paisis, filhis, espiritis santis. Cevadis im ampola pa arma uma pindureta.',
   400.00, 'c1000000-0000-0000-0000-000000000002'::uuid, 'shoes', 3.0, false, false, true),
  
  -- Product 2
  ('a1000000-0000-0000-0000-000000000002'::uuid, 'FZCSVI', 'Viscose-Cashmere Scarf',
   'Mussum Ipsum, cacilds vidis litro abertis. Admodum accumsan disputationi eu sit. Vide electram sadipscing et per. Per aumento de cachacis, eu reclamis. Paisis, filhis, espiritis santis. Cevadis im ampola pa arma uma pindureta.',
   547.00, 'c1000000-0000-0000-0000-000000000001'::uuid, 'clothes', 4.0, true, false, true),
  
  -- Product 3
  ('a1000000-0000-0000-0000-000000000003'::uuid, 'FZCSFP', 'Plaid Cotton Oxford Shirt',
   'Mussum Ipsum, cacilds vidis litro abertis. Admodum accumsan disputationi eu sit. Vide electram sadipscing et per. Per aumento de cachacis, eu reclamis. Paisis, filhis, espiritis santis. Cevadis im ampola pa arma uma pindureta.',
   547.00, 'c1000000-0000-0000-0000-000000000001'::uuid, 'clothes', 4.0, false, false, true),
  
  -- Product 4
  ('a1000000-0000-0000-0000-000000000004'::uuid, 'FZCSRO', 'Round neck sweater',
   'Mussum Ipsum, cacilds vidis litro abertis. Admodum accumsan disputationi eu sit. Vide electram sadipscing et per. Per aumento de cachacis, eu reclamis. Paisis, filhis, espiritis santis. Cevadis im ampola pa arma uma pindureta.',
   320.00, 'c1000000-0000-0000-0000-000000000001'::uuid, 'clothes', 4.0, false, false, true),
  
  -- Product 5
  ('a1000000-0000-0000-0000-000000000005'::uuid, 'FZCSCAN', 'Faxon Canvas Low-Top Sneaker',
   'Mussum Ipsum, cacilds vidis litro abertis. Admodum accumsan disputationi eu sit. Vide electram sadipscing et per. Per aumento de cachacis, eu reclamis. Paisis, filhis, espiritis santis. Cevadis im ampola pa arma uma pindureta.',
   320.00, 'c1000000-0000-0000-0000-000000000001'::uuid, 'clothes', 4.0, false, false, true),
  
  -- Product 6
  ('a1000000-0000-0000-0000-000000000006'::uuid, 'FZCSSA', 'Faxon Canvas Low-Top Sneaker',
   'Mussum Ipsum, cacilds vidis litro abertis. Admodum accumsan disputationi eu sit. Vide electram sadipscing et per. Per aumento de cachacis, eu reclamis. Paisis, filhis, espiritis santis. Cevadis im ampola pa arma uma pindureta.',
   320.00, 'c1000000-0000-0000-0000-000000000001'::uuid, 'clothes', 4.0, false, false, true),
  
  -- Product 7
  ('a1000000-0000-0000-0000-000000000007'::uuid, 'FZCSDS', 'Faxon Canvas Low-Top Sneaker',
   'Mussum Ipsum, cacilds vidis litro abertis. Admodum accumsan disputationi eu sit. Vide electram sadipscing et per. Per aumento de cachacis, eu reclamis. Paisis, filhis, espiritis santis. Cevadis im ampola pa arma uma pindureta.',
   320.00, 'c1000000-0000-0000-0000-000000000001'::uuid, 'clothes', 4.0, false, true, true),
  
  -- Product 8
  ('a1000000-0000-0000-0000-000000000008'::uuid, 'FZCSDP', 'Two-Tone Sleeveless Dress',
   'Mussum Ipsum, cacilds vidis litro abertis. Admodum accumsan disputationi eu sit. Vide electram sadipscing et per. Per aumento de cachacis, eu reclamis. Paisis, filhis, espiritis santis. Cevadis im ampola pa arma uma pindureta.',
   320.00, 'c1000000-0000-0000-0000-000000000001'::uuid, 'clothes', 4.0, true, false, true),
  
  -- Product 9
  ('a1000000-0000-0000-0000-000000000009'::uuid, 'FZCSPL', 'Viscose-Cashmere Scarf',
   'Mussum Ipsum, cacilds vidis litro abertis. Admodum accumsan disputationi eu sit. Vide electram sadipscing et per. Per aumento de cachacis, eu reclamis. Paisis, filhis, espiritis santis. Cevadis im ampola pa arma uma pindureta.',
   320.00, 'c1000000-0000-0000-0000-000000000001'::uuid, 'clothes', 4.0, false, false, true),
  
  -- Product 10
  ('a1000000-0000-0000-0000-00000000000a'::uuid, 'FZCSXS', 'Viscose-Cashmere Scarf',
   'Mussum Ipsum, cacilds vidis litro abertis. Admodum accumsan disputationi eu sit. Vide electram sadipscing et per. Per aumento de cachacis, eu reclamis. Paisis, filhis, espiritis santis. Cevadis im ampola pa arma uma pindureta.',
   320.00, 'c1000000-0000-0000-0000-000000000001'::uuid, 'clothes', 4.0, false, false, true),
  
  -- Product 11
  ('a1000000-0000-0000-0000-00000000000b'::uuid, 'FZCSVB', 'Round neck sweater',
   'Mussum Ipsum, cacilds vidis litro abertis. Admodum accumsan disputationi eu sit. Vide electram sadipscing et per. Per aumento de cachacis, eu reclamis. Paisis, filhis, espiritis santis. Cevadis im ampola pa arma uma pindureta.',
   320.00, 'c1000000-0000-0000-0000-000000000001'::uuid, 'clothes', 4.0, true, false, true),
  
  -- Product 12
  ('a1000000-0000-0000-0000-00000000000c'::uuid, 'FZCSJH', 'Viscose-Cashmere Scarf',
   'Mussum Ipsum, cacilds vidis litro abertis. Admodum accumsan disputationi eu sit. Vide electram sadipscing et per. Per aumento de cachacis, eu reclamis. Paisis, filhis, espiritis santis. Cevadis im ampola pa arma uma pindureta.',
   320.00, 'c1000000-0000-0000-0000-000000000001'::uuid, 'clothes', 4.0, true, false, true);

-- =============================================
-- 3. INSERT PRODUCT IMAGES
-- =============================================
INSERT INTO product_images (product_id, image_url, sort_order, is_primary) VALUES
  -- Product 1 images
  ('a1000000-0000-0000-0000-000000000001'::uuid, 'http://zwin.io/react/stoon/assets/img/arrival/1.png', 0, true),
  ('a1000000-0000-0000-0000-000000000001'::uuid, 'http://zwin.io/react/stoon/assets/img/arrival/1.png', 1, false),
  ('a1000000-0000-0000-0000-000000000001'::uuid, 'http://zwin.io/react/stoon/assets/img/arrival/1.png', 2, false),
  
  -- Product 2 images
  ('a1000000-0000-0000-0000-000000000002'::uuid, 'http://zwin.io/react/stoon/assets/img/arrival/1.png', 0, true),
  ('a1000000-0000-0000-0000-000000000002'::uuid, 'http://zwin.io/react/stoon/assets/img/arrival/1.png', 1, false),
  
  -- Product 3 images
  ('a1000000-0000-0000-0000-000000000003'::uuid, 'http://zwin.io/react/stoon/assets/img/arrival/3.png', 0, true),
  ('a1000000-0000-0000-0000-000000000003'::uuid, 'http://zwin.io/react/stoon/assets/img/arrival/3.png', 1, false),
  
  -- Product 4 images
  ('a1000000-0000-0000-0000-000000000004'::uuid, 'http://zwin.io/react/stoon/assets/img/arrival/4.png', 0, true),
  ('a1000000-0000-0000-0000-000000000004'::uuid, 'http://zwin.io/react/stoon/assets/img/arrival/4.png', 1, false),
  
  -- Product 5 images
  ('a1000000-0000-0000-0000-000000000005'::uuid, 'http://zwin.io/react/stoon/assets/img/arrival/5.png', 0, true),
  ('a1000000-0000-0000-0000-000000000005'::uuid, 'http://zwin.io/react/stoon/assets/img/arrival/5.png', 1, false),
  
  -- Product 6 images
  ('a1000000-0000-0000-0000-000000000006'::uuid, 'http://zwin.io/react/stoon/assets/img/arrival/6.png', 0, true),
  ('a1000000-0000-0000-0000-000000000006'::uuid, 'http://zwin.io/react/stoon/assets/img/arrival/6.png', 1, false),
  
  -- Product 7 images
  ('a1000000-0000-0000-0000-000000000007'::uuid, 'http://zwin.io/react/stoon/assets/img/tranding/1.png', 0, true),
  ('a1000000-0000-0000-0000-000000000007'::uuid, 'http://zwin.io/react/stoon/assets/img/tranding/1.png', 1, false),
  
  -- Product 8 images
  ('a1000000-0000-0000-0000-000000000008'::uuid, 'http://zwin.io/react/stoon/assets/img/tranding/3.png', 0, true),
  ('a1000000-0000-0000-0000-000000000008'::uuid, 'http://zwin.io/react/stoon/assets/img/tranding/3.png', 1, false),
  
  -- Product 9 images
  ('a1000000-0000-0000-0000-000000000009'::uuid, 'http://zwin.io/react/stoon/assets/img/tranding/4.png', 0, true),
  ('a1000000-0000-0000-0000-000000000009'::uuid, 'http://zwin.io/react/stoon/assets/img/tranding/4.png', 1, false),
  
  -- Product 10 images
  ('a1000000-0000-0000-0000-00000000000a'::uuid, 'http://zwin.io/react/stoon/assets/img/tranding/4.png', 0, true),
  ('a1000000-0000-0000-0000-00000000000a'::uuid, 'http://zwin.io/react/stoon/assets/img/tranding/4.png', 1, false),
  
  -- Product 11 images
  ('a1000000-0000-0000-0000-00000000000b'::uuid, 'http://zwin.io/react/stoon/assets/img/tranding/5.png', 0, true),
  ('a1000000-0000-0000-0000-00000000000b'::uuid, 'http://zwin.io/react/stoon/assets/img/tranding/5.png', 1, false),
  
  -- Product 12 images
  ('a1000000-0000-0000-0000-00000000000c'::uuid, 'http://zwin.io/react/stoon/assets/img/tranding/6.png', 0, true),
  ('a1000000-0000-0000-0000-00000000000c'::uuid, 'http://zwin.io/react/stoon/assets/img/tranding/6.png', 1, false);

-- =============================================
-- 4. INSERT PRODUCT SIZES (for all products)
-- =============================================
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
) AS s(label, stock, sort_order);

-- =============================================
-- 5. INSERT PRODUCT COLORS (for all products)
-- =============================================
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
) AS c(name, hex_value, sort_order);

-- =============================================
-- 6. INSERT PROMOTIONS (for products with discounts)
-- =============================================
INSERT INTO promotions (product_id, discount_percent, is_active) VALUES
  ('a1000000-0000-0000-0000-000000000001'::uuid, 23.00, true),  -- Product 1: 23% off
  ('a1000000-0000-0000-0000-000000000006'::uuid, 23.00, true),  -- Product 6: 23% off
  ('a1000000-0000-0000-0000-000000000007'::uuid, 23.00, true),  -- Product 7: 23% off
  ('a1000000-0000-0000-0000-000000000008'::uuid, 12.00, true);  -- Product 8: 12% off

-- =============================================
-- 7. INSERT HOME CONTENT - Above Fold Banners
-- =============================================
INSERT INTO home_content (section_type, title, subtitle, image_url, action_label, action_path, sort_order, is_active) VALUES
  ('above_fold', 'Favorite clothing', '30% OFF', 'http://zwin.io/react/stoon/assets/img/banner/11.png', 'get collection', '/c/clothes', 0, true),
  ('above_fold', 'Favorite clothing', '30% OFF', 'http://zwin.io/react/stoon/assets/img/banner/1.png', 'get collection', '/c/clothes', 1, true);

-- =============================================
-- 8. INSERT HOME CONTENT - Season Sale
-- =============================================
INSERT INTO home_content (section_type, title, description, image_url, action_label, action_path, sort_order, is_active) VALUES
  ('season_sale', 'spring sale', '30% off on selected items', 'http://zwin.io/react/stoon/assets/img/others/sales.png', 'shop the sale', '/c/clothes', 0, true);

-- =============================================
-- 9. INSERT HOME CONTENT - Collection Banners
-- =============================================
INSERT INTO home_content (section_type, title, image_url, action_label, action_path, sort_order, is_active, metadata) VALUES
  ('collection_banner', 'Woman', 'http://zwin.io/react/stoon/assets/img/collection/1.png', 'shop now', '/c/woman', 0, true, '{"collection_type": "woman"}'::jsonb),
  ('collection_banner', 'Man', 'http://zwin.io/react/stoon/assets/img/collection/2.png', 'shop now', '/c/man', 1, true, '{"collection_type": "man"}'::jsonb),
  ('collection_banner', 'Kids', 'http://zwin.io/react/stoon/assets/img/collection/3.png', 'shop now', '/c/kids', 2, true, '{"collection_type": "kids"}'::jsonb);

-- =============================================
-- 10. INSERT HOME CONTENT - Collections
-- =============================================
INSERT INTO home_content (section_type, title, image_url, action_label, action_path, sort_order, is_active) VALUES
  ('collection', 'Fashion clothing', 'http://zwin.io/react/stoon/assets/img/collection/4.png', 'shop now', '/c/clothes', 0, true),
  ('collection', 'Accessories', 'http://zwin.io/react/stoon/assets/img/collection/5.png', 'shop now', '/c/accessories', 1, true);

-- =============================================
-- 11. INSERT FEATURED PRODUCTS - Arrivals
-- =============================================
INSERT INTO featured_products (section_name, product_id, sort_order, is_active) VALUES
  ('arrivals', 'a1000000-0000-0000-0000-000000000001'::uuid, 0, true),
  ('arrivals', 'a1000000-0000-0000-0000-000000000003'::uuid, 1, true),
  ('arrivals', 'a1000000-0000-0000-0000-000000000004'::uuid, 2, true),
  ('arrivals', 'a1000000-0000-0000-0000-000000000002'::uuid, 3, true),
  ('arrivals', 'a1000000-0000-0000-0000-000000000006'::uuid, 4, true),
  ('arrivals', 'a1000000-0000-0000-0000-000000000008'::uuid, 5, true),
  ('arrivals', 'a1000000-0000-0000-0000-00000000000a'::uuid, 6, true);

-- =============================================
-- 12. INSERT FEATURED PRODUCTS - Best Sale
-- =============================================
INSERT INTO featured_products (section_name, product_id, sort_order, is_active) VALUES
  ('best_sale', 'a1000000-0000-0000-0000-000000000001'::uuid, 0, true),
  ('best_sale', 'a1000000-0000-0000-0000-000000000002'::uuid, 1, true),
  ('best_sale', 'a1000000-0000-0000-0000-000000000003'::uuid, 2, true),
  ('best_sale', 'a1000000-0000-0000-0000-000000000004'::uuid, 3, true),
  ('best_sale', 'a1000000-0000-0000-0000-000000000005'::uuid, 4, true),
  ('best_sale', 'a1000000-0000-0000-0000-000000000006'::uuid, 5, true),
  ('best_sale', 'a1000000-0000-0000-0000-000000000007'::uuid, 6, true);

-- =============================================
-- 13. INSERT FEATURED PRODUCTS - Top Rate
-- =============================================
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
  RAISE NOTICE 'Seed data inserted successfully!';
  RAISE NOTICE 'Created: 6 categories, 12 products with images, sizes, colors, and promotions';
  RAISE NOTICE 'Created: Home page content (banners, collections, featured products)';
END $$;
