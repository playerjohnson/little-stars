-- ============================================
-- Little Stars Babysitting - Supabase Setup
-- ============================================
-- Run this in your Supabase SQL Editor (Dashboard > SQL Editor)
-- 
-- This creates the tables, indexes, and Row Level Security
-- policies needed for the babysitting booking app.
-- ============================================

-- 1. Availability slots (managed by admin/babysitter)
CREATE TABLE IF NOT EXISTS availability (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  hourly_rate DECIMAL(5,2) NOT NULL DEFAULT 12.00,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Booking requests (submitted by customers)
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
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'declined', 'cancelled')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes for fast lookups
CREATE INDEX IF NOT EXISTS idx_availability_date ON availability(date);
CREATE INDEX IF NOT EXISTS idx_bookings_date ON bookings(date);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);

-- 3. Enable Row Level Security
ALTER TABLE availability ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- 4. RLS Policies
-- Everyone can READ availability (public calendar)
CREATE POLICY "Availability is publicly readable"
  ON availability FOR SELECT
  USING (true);

-- Everyone can INSERT bookings (customers submit requests)
CREATE POLICY "Anyone can create bookings"
  ON bookings FOR INSERT
  WITH CHECK (true);

-- Everyone can READ bookings (we filter in the app for admin)
-- In production you'd want auth here, but for a simple PIN-protected
-- admin panel this keeps things simple.
CREATE POLICY "Bookings are readable"
  ON bookings FOR SELECT
  USING (true);

-- Everyone can UPDATE bookings (admin confirms/declines)
-- Again, in production you'd lock this down with auth
CREATE POLICY "Bookings can be updated"
  ON bookings FOR UPDATE
  USING (true);

-- Admin can manage availability (insert/update/delete)
CREATE POLICY "Availability can be managed"
  ON availability FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Availability can be updated"
  ON availability FOR UPDATE
  USING (true);

CREATE POLICY "Availability can be deleted"
  ON availability FOR DELETE
  USING (true);
