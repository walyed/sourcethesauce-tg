-- =============================================
-- TELEGRAM AUTHENTICATION MIGRATION
-- Run this in Supabase SQL Editor to add Telegram user support
-- =============================================

-- =============================================
-- 1. MODIFY PROFILES TABLE TO SUPPORT TELEGRAM USERS
-- =============================================

-- Add Telegram-specific columns to profiles
ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS telegram_id BIGINT UNIQUE,
  ADD COLUMN IF NOT EXISTS telegram_username VARCHAR(255),
  ADD COLUMN IF NOT EXISTS telegram_first_name VARCHAR(255),
  ADD COLUMN IF NOT EXISTS telegram_last_name VARCHAR(255),
  ADD COLUMN IF NOT EXISTS telegram_photo_url TEXT,
  ADD COLUMN IF NOT EXISTS telegram_language_code VARCHAR(10),
  ADD COLUMN IF NOT EXISTS telegram_is_premium BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS auth_provider VARCHAR(50) DEFAULT 'supabase', -- 'supabase', 'telegram'
  ADD COLUMN IF NOT EXISTS last_seen_at TIMESTAMP WITH TIME ZONE;

-- Make the id column nullable for Telegram-only users (who don't have Supabase auth)
-- We need to drop the foreign key constraint first
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_id_fkey;

-- Change the id to be auto-generated for Telegram users
ALTER TABLE profiles ALTER COLUMN id SET DEFAULT uuid_generate_v4();

-- Create index for Telegram ID lookups
CREATE INDEX IF NOT EXISTS idx_profiles_telegram_id ON profiles(telegram_id);

-- =============================================
-- 2. UPDATE OTHER TABLES TO SUPPORT TELEGRAM USERS
-- =============================================

-- Update addresses table to reference profiles instead of auth.users
ALTER TABLE addresses DROP CONSTRAINT IF EXISTS addresses_user_id_fkey;
ALTER TABLE addresses ADD CONSTRAINT addresses_user_id_fkey 
  FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE;

-- Update carts table
ALTER TABLE carts DROP CONSTRAINT IF EXISTS carts_user_id_fkey;
ALTER TABLE carts ADD CONSTRAINT carts_user_id_fkey 
  FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE;

-- Update orders table
ALTER TABLE orders DROP CONSTRAINT IF EXISTS orders_user_id_fkey;
ALTER TABLE orders ADD CONSTRAINT orders_user_id_fkey 
  FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE SET NULL;

-- Update wishlists table
ALTER TABLE wishlists DROP CONSTRAINT IF EXISTS wishlists_user_id_fkey;
ALTER TABLE wishlists ADD CONSTRAINT wishlists_user_id_fkey 
  FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE;

-- Update reviews table
ALTER TABLE reviews DROP CONSTRAINT IF EXISTS reviews_user_id_fkey;
ALTER TABLE reviews ADD CONSTRAINT reviews_user_id_fkey 
  FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE;

-- =============================================
-- 3. CREATE FUNCTION TO UPSERT TELEGRAM USER
-- =============================================
CREATE OR REPLACE FUNCTION upsert_telegram_user(
  p_telegram_id BIGINT,
  p_username VARCHAR(255) DEFAULT NULL,
  p_first_name VARCHAR(255) DEFAULT NULL,
  p_last_name VARCHAR(255) DEFAULT NULL,
  p_photo_url TEXT DEFAULT NULL,
  p_language_code VARCHAR(10) DEFAULT NULL,
  p_is_premium BOOLEAN DEFAULT false
)
RETURNS profiles AS $$
DECLARE
  v_profile profiles;
BEGIN
  -- Try to update existing user
  UPDATE profiles SET
    telegram_username = COALESCE(p_username, telegram_username),
    telegram_first_name = COALESCE(p_first_name, telegram_first_name),
    telegram_last_name = COALESCE(p_last_name, telegram_last_name),
    telegram_photo_url = COALESCE(p_photo_url, telegram_photo_url),
    telegram_language_code = COALESCE(p_language_code, telegram_language_code),
    telegram_is_premium = p_is_premium,
    full_name = COALESCE(p_first_name || ' ' || COALESCE(p_last_name, ''), full_name),
    avatar_url = COALESCE(p_photo_url, avatar_url),
    last_seen_at = NOW(),
    updated_at = NOW()
  WHERE telegram_id = p_telegram_id
  RETURNING * INTO v_profile;
  
  -- If no rows updated, insert new user
  IF NOT FOUND THEN
    INSERT INTO profiles (
      telegram_id,
      telegram_username,
      telegram_first_name,
      telegram_last_name,
      telegram_photo_url,
      telegram_language_code,
      telegram_is_premium,
      full_name,
      avatar_url,
      auth_provider,
      role,
      last_seen_at
    ) VALUES (
      p_telegram_id,
      p_username,
      p_first_name,
      p_last_name,
      p_photo_url,
      p_language_code,
      p_is_premium,
      TRIM(COALESCE(p_first_name, '') || ' ' || COALESCE(p_last_name, '')),
      p_photo_url,
      'telegram',
      'customer',
      NOW()
    )
    RETURNING * INTO v_profile;
  END IF;
  
  RETURN v_profile;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================
-- 4. CREATE FUNCTION TO GET USER BY TELEGRAM ID
-- =============================================
CREATE OR REPLACE FUNCTION get_user_by_telegram_id(p_telegram_id BIGINT)
RETURNS profiles AS $$
  SELECT * FROM profiles WHERE telegram_id = p_telegram_id;
$$ LANGUAGE sql SECURITY DEFINER;

-- =============================================
-- 5. CREATE FUNCTION TO GET OR CREATE CART FOR TELEGRAM USER
-- =============================================
CREATE OR REPLACE FUNCTION get_or_create_telegram_cart(p_telegram_id BIGINT)
RETURNS carts AS $$
DECLARE
  v_user_id UUID;
  v_cart carts;
BEGIN
  -- Get user ID from telegram_id
  SELECT id INTO v_user_id FROM profiles WHERE telegram_id = p_telegram_id;
  
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'User with telegram_id % not found', p_telegram_id;
  END IF;
  
  -- Try to get existing cart
  SELECT * INTO v_cart FROM carts WHERE user_id = v_user_id;
  
  -- If no cart exists, create one
  IF NOT FOUND THEN
    INSERT INTO carts (user_id)
    VALUES (v_user_id)
    RETURNING * INTO v_cart;
  END IF;
  
  RETURN v_cart;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================
-- 6. UPDATE RLS POLICIES FOR TELEGRAM USERS
-- =============================================

-- Drop existing policies
DROP POLICY IF EXISTS "profiles_public_read" ON profiles;
DROP POLICY IF EXISTS "profiles_self_update" ON profiles;

-- New policies for profiles (allow service role to manage all)
CREATE POLICY "profiles_public_read" ON profiles
  FOR SELECT USING (true);

CREATE POLICY "profiles_self_update" ON profiles
  FOR UPDATE USING (
    -- Supabase auth users can update their own profile
    (auth.uid() = id) OR
    -- Service role can update any profile (for Telegram auth)
    (auth.role() = 'service_role')
  );

CREATE POLICY "profiles_service_insert" ON profiles
  FOR INSERT WITH CHECK (
    -- Service role can insert profiles (for Telegram users)
    (auth.role() = 'service_role') OR
    -- Supabase auth trigger can insert
    (auth.uid() = id)
  );

-- Update cart policies to work with profile-based user_id
DROP POLICY IF EXISTS "carts_user_access" ON carts;
DROP POLICY IF EXISTS "carts_guest_access" ON carts;

CREATE POLICY "carts_user_access" ON carts
  FOR ALL USING (
    user_id IN (SELECT id FROM profiles WHERE telegram_id IS NOT NULL) OR
    user_id = auth.uid() OR
    session_id IS NOT NULL
  );

-- Update orders policies
DROP POLICY IF EXISTS "orders_user_read" ON orders;
DROP POLICY IF EXISTS "orders_user_create" ON orders;

CREATE POLICY "orders_user_read" ON orders
  FOR SELECT USING (
    user_id IN (SELECT id FROM profiles WHERE telegram_id IS NOT NULL) OR
    user_id = auth.uid() OR
    auth.role() = 'service_role'
  );

CREATE POLICY "orders_service_create" ON orders
  FOR INSERT WITH CHECK (
    auth.role() = 'service_role' OR
    user_id = auth.uid()
  );

-- =============================================
-- SUCCESS MESSAGE
-- =============================================
DO $$
BEGIN
  RAISE NOTICE 'Telegram authentication migration completed successfully!';
  RAISE NOTICE 'Added: telegram_id, telegram_username, telegram_first_name, telegram_last_name columns';
  RAISE NOTICE 'Added: upsert_telegram_user and get_user_by_telegram_id functions';
  RAISE NOTICE 'Updated: RLS policies to support Telegram users';
END $$;
