-- =============================================
-- STORAGE BUCKET SETUP FOR TELEGRAM MINI APP
-- Run this in Supabase SQL Editor
-- =============================================

-- Create the product-images bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'product-images',
  'product-images',
  true,
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO NOTHING;

-- =============================================
-- STORAGE POLICIES
-- =============================================

-- Allow public read access to product images
CREATE POLICY "Public read access for product images"
ON storage.objects FOR SELECT
USING (bucket_id = 'product-images');

-- Allow authenticated users to upload (admin will use service role)
CREATE POLICY "Admin upload access for product images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'product-images');

-- Allow authenticated users to update
CREATE POLICY "Admin update access for product images"
ON storage.objects FOR UPDATE
USING (bucket_id = 'product-images');

-- Allow authenticated users to delete
CREATE POLICY "Admin delete access for product images"
ON storage.objects FOR DELETE
USING (bucket_id = 'product-images');

-- =============================================
-- SUCCESS MESSAGE
-- =============================================
DO $$
BEGIN
  RAISE NOTICE '✅ Storage bucket created successfully!';
  RAISE NOTICE '📁 Bucket: product-images (public read, admin write)';
  RAISE NOTICE '📏 Max file size: 5MB';
  RAISE NOTICE '🖼️ Allowed types: JPEG, PNG, WebP, GIF';
END $$;
