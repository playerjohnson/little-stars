import { createClient } from '@supabase/supabase-js';

// Replace these with your Supabase project credentials
// Found in: Supabase Dashboard > Settings > API
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ─── Availability API ────────────────────────────────────────

export async function getAvailability(startDate, endDate) {
  const { data, error } = await supabase
    .from('availability')
    .select('*')
    .gte('date', startDate)
    .lte('date', endDate)
    .eq('is_active', true)
    .order('date')
    .order('start_time');

  if (error) throw error;
  return data;
}

export async function addAvailabilitySlot(slot) {
  const { data, error } = await supabase
    .from('availability')
    .insert([slot])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function removeAvailabilitySlot(id) {
  const { error } = await supabase
    .from('availability')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

// ─── Bookings API ────────────────────────────────────────────

export async function getBookings(startDate, endDate) {
  const { data, error } = await supabase
    .from('bookings')
    .select('*')
    .gte('date', startDate)
    .lte('date', endDate)
    .order('date')
    .order('start_time');

  if (error) throw error;
  return data;
}

export async function getAllBookings() {
  const { data, error } = await supabase
    .from('bookings')
    .select('*')
    .order('date', { ascending: false })
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

export async function createBooking(booking) {
  const { data, error } = await supabase
    .from('bookings')
    .insert([booking])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateBookingStatus(id, status) {
  const { data, error } = await supabase
    .from('bookings')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}
