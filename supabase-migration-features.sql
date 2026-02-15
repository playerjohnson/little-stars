-- ============================================
-- Little Stars — Feature Pack Migration
-- ============================================
-- Run in Supabase SQL Editor
-- Adds: reviews, referrals, notification support
-- ============================================

-- 1. Reviews (admin-managed testimonials)
CREATE TABLE IF NOT EXISTS reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  parent_name TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  review_text TEXT NOT NULL,
  is_visible BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Reviews are publicly readable" ON reviews FOR SELECT USING (true);
CREATE POLICY "Reviews can be inserted" ON reviews FOR INSERT WITH CHECK (true);
CREATE POLICY "Reviews can be updated" ON reviews FOR UPDATE USING (true);
CREATE POLICY "Reviews can be deleted" ON reviews FOR DELETE USING (true);

-- 2. Referrals tracking
CREATE TABLE IF NOT EXISTS referrals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  referral_code TEXT UNIQUE NOT NULL,
  referrer_name TEXT NOT NULL,
  referrer_email TEXT,
  times_used INTEGER DEFAULT 0,
  discount_percent INTEGER DEFAULT 10,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE referrals ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Referrals are publicly readable" ON referrals FOR SELECT USING (true);
CREATE POLICY "Referrals can be inserted" ON referrals FOR INSERT WITH CHECK (true);
CREATE POLICY "Referrals can be updated" ON referrals FOR UPDATE USING (true);

-- 3. Add referral_code to bookings
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS referral_code TEXT;

-- 4. Indexes
CREATE INDEX IF NOT EXISTS idx_reviews_visible ON reviews(is_visible);
CREATE INDEX IF NOT EXISTS idx_referrals_code ON referrals(referral_code);
