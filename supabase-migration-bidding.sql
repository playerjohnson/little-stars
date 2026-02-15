-- ============================================
-- Little Stars — Bidding Feature Migration
-- ============================================
-- Run this in Supabase SQL Editor (Dashboard > SQL Editor)
--
-- Adds bidding support: customers bid on slots,
-- babysitter accepts the best bid.
-- ============================================

-- Add bid_amount to bookings (the customer's offered hourly rate)
ALTER TABLE bookings
  ADD COLUMN IF NOT EXISTS bid_amount DECIMAL(5,2);

-- Add an index for quick bid lookups per availability slot
CREATE INDEX IF NOT EXISTS idx_bookings_availability ON bookings(availability_id);

-- Rename hourly_rate to min_rate for clarity (it's the starting price)
-- We'll do this as add + copy + drop to be safe
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'availability' AND column_name = 'hourly_rate'
  ) AND NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'availability' AND column_name = 'min_rate'
  ) THEN
    ALTER TABLE availability ADD COLUMN min_rate DECIMAL(5,2);
    UPDATE availability SET min_rate = hourly_rate;
    ALTER TABLE availability DROP COLUMN hourly_rate;
    ALTER TABLE availability ALTER COLUMN min_rate SET DEFAULT 12.00;
    ALTER TABLE availability ALTER COLUMN min_rate SET NOT NULL;
  END IF;
END $$;
