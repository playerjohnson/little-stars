import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://jgvlpxbfvqavhkotggwj.supabase.co';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpndmxweGJmdnFhdmhrb3RnZ3dqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzExNjQ0MzgsImV4cCI6MjA4Njc0MDQzOH0.RVQ_AREtwnBDQsxr_BSneCC7i0-d9APakAvYwjBLOGA';

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

// ─── Bookings / Bids API ─────────────────────────────────────

export async function getBookings(startDate, endDate) {
  const { data, error } = await supabase
    .from('bookings')
    .select('*')
    .gte('date', startDate)
    .lte('date', endDate)
    .order('date')
    .order('bid_amount', { ascending: false });

  if (error) throw error;
  return data;
}

export async function getAllBookings() {
  const { data, error } = await supabase
    .from('bookings')
    .select('*')
    .order('date', { ascending: false })
    .order('bid_amount', { ascending: false });

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

/**
 * Accept a bid: confirm it and auto-decline all other pending bids
 * that overlap the same time window on the same date.
 */
export async function acceptBid(bid) {
  const { data: accepted, error: acceptError } = await supabase
    .from('bookings')
    .update({ status: 'confirmed', updated_at: new Date().toISOString() })
    .eq('id', bid.id)
    .select()
    .single();

  if (acceptError) throw acceptError;

  // Decline other pending bids on the same date with overlapping times
  const { error: declineError } = await supabase
    .from('bookings')
    .update({ status: 'declined', updated_at: new Date().toISOString() })
    .eq('date', bid.date)
    .eq('status', 'pending')
    .neq('id', bid.id)
    .lt('start_time', bid.end_time)
    .gt('end_time', bid.start_time);

  if (declineError) throw declineError;

  return accepted;
}
