import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://jgvlpxbfvqavhkotggwj.supabase.co';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpndmxweGJmdnFhdmhrb3RnZ3dqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzExNjQ0MzgsImV4cCI6MjA4Njc0MDQzOH0.RVQ_AREtwnBDQsxr_BSneCC7i0-d9APakAvYwjBLOGA';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ─── Availability ────────────────────────────────────────────

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
    .from('availability').insert([slot]).select().single();
  if (error) throw error;
  return data;
}

export async function removeAvailabilitySlot(id) {
  const { error } = await supabase.from('availability').delete().eq('id', id);
  if (error) throw error;
}

// ─── Bookings / Bids ────────────────────────────────────────

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
    .from('bookings').insert([booking]).select().single();
  if (error) throw error;
  return data;
}

export async function updateBookingStatus(id, status) {
  const { data, error } = await supabase
    .from('bookings')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', id).select().single();
  if (error) throw error;
  return data;
}

export async function acceptBid(bid) {
  const { data: accepted, error: acceptError } = await supabase
    .from('bookings')
    .update({ status: 'confirmed', updated_at: new Date().toISOString() })
    .eq('id', bid.id).select().single();
  if (acceptError) throw acceptError;

  await supabase
    .from('bookings')
    .update({ status: 'declined', updated_at: new Date().toISOString() })
    .eq('date', bid.date)
    .eq('status', 'pending')
    .neq('id', bid.id)
    .lt('start_time', bid.end_time)
    .gt('end_time', bid.start_time);

  return accepted;
}

export async function getBookingsByEmail(email) {
  const { data, error } = await supabase
    .from('bookings')
    .select('*')
    .ilike('customer_email', email)
    .order('date', { ascending: false });
  if (error) throw error;
  return data;
}

export async function cancelBooking(id, { tier, fee, cancelledAt }) {
  const { data, error } = await supabase
    .from('bookings')
    .update({
      status: 'cancelled',
      cancellation_tier: tier,
      cancellation_fee: fee,
      cancelled_at: cancelledAt,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function adminCancelBooking(id, reason) {
  const { data, error } = await supabase
    .from('bookings')
    .update({
      status: 'cancelled',
      cancellation_tier: 'admin',
      cancellation_fee: 0,
      cancelled_at: new Date().toISOString(),
      admin_cancel_reason: reason,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

// ─── Reviews ─────────────────────────────────────────────────

export async function getVisibleReviews() {
  const { data, error } = await supabase
    .from('reviews')
    .select('*')
    .eq('is_visible', true)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}

export async function getAllReviews() {
  const { data, error } = await supabase
    .from('reviews')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}

export async function addReview(review) {
  const { data, error } = await supabase
    .from('reviews').insert([review]).select().single();
  if (error) throw error;
  return data;
}

export async function toggleReviewVisibility(id, isVisible) {
  const { error } = await supabase
    .from('reviews').update({ is_visible: isVisible }).eq('id', id);
  if (error) throw error;
}

export async function deleteReview(id) {
  const { error } = await supabase.from('reviews').delete().eq('id', id);
  if (error) throw error;
}

// ─── Referrals ───────────────────────────────────────────────

export async function getReferralByCode(code) {
  const { data, error } = await supabase
    .from('referrals')
    .select('*')
    .eq('referral_code', code.toUpperCase())
    .eq('is_active', true)
    .single();
  if (error && error.code !== 'PGRST116') throw error;
  return data;
}

export async function getAllReferrals() {
  const { data, error } = await supabase
    .from('referrals')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}

export async function addReferral(referral) {
  const { data, error } = await supabase
    .from('referrals').insert([referral]).select().single();
  if (error) throw error;
  return data;
}

export async function incrementReferralUsage(code) {
  const ref = await getReferralByCode(code);
  if (!ref) return;
  await supabase
    .from('referrals')
    .update({ times_used: ref.times_used + 1 })
    .eq('id', ref.id);
}

export async function toggleReferral(id, isActive) {
  const { error } = await supabase
    .from('referrals').update({ is_active: isActive }).eq('id', id);
  if (error) throw error;
}

// ─── Notifications (polling new bids) ────────────────────────

export async function getNewBidsSince(since) {
  const { data, error } = await supabase
    .from('bookings')
    .select('*')
    .eq('status', 'pending')
    .gt('created_at', since)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}
