-- ============================================
-- Little Stars Babysitting - Supabase Setup
-- ============================================
-- Run this in your Supabase SQL Editor (Dashboard > SQL Editor)
--
-- Creates tables with bidding support: customers bid on
-- available slots, babysitter accepts the best bid.
-- ============================================

-- 1. Availability slots (managed by admin/babysitter)
CREATE TABLE IF NOT EXISTS availability (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  min_rate DECIMAL(5,2) NOT NULL DEFAULT 12.00,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Booking requests / bids (submitted by customers)
CREATE TABLE IF NOT EXISTS bookings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  availability_id UUID REFERENCES availability(id) ON DELETE SET NULL,
  date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  customer_name TEXT NOT NULL,
  customer_email TEXT,
  customer_phone TEXT,
  num_children INTEGER DEFAULT 1,
  notes TEXT,
  bid_amount DECIMAL(5,2),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'declined', 'cancelled')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes for fast lookups
CREATE INDEX IF NOT EXISTS idx_availability_date ON availability(date);
CREATE INDEX IF NOT EXISTS idx_bookings_date ON bookings(date);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_availability ON bookings(availability_id);

-- 3. Enable Row Level Security
ALTER TABLE availability ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- 4. RLS Policies
CREATE POLICY "Availability is publicly readable"
  ON availability FOR SELECT USING (true);

CREATE POLICY "Anyone can create bookings"
  ON bookings FOR INSERT WITH CHECK (true);

CREATE POLICY "Bookings are readable"
  ON bookings FOR SELECT USING (true);

CREATE POLICY "Bookings can be updated"
  ON bookings FOR UPDATE USING (true);

CREATE POLICY "Availability can be managed"
  ON availability FOR INSERT WITH CHECK (true);

CREATE POLICY "Availability can be updated"
  ON availability FOR UPDATE USING (true);

CREATE POLICY "Availability can be deleted"
  ON availability FOR DELETE USING (true);
