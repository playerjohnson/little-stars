import { useState, useEffect } from 'react';
import Calendar from './Calendar';
import ChangePassword from './ChangePassword';
import NotificationBell from './NotificationBell';
import {
  MONTHS, TIME_SLOTS, formatTime,
} from '../lib/utils';
import {
  getAvailability, getBookings, getAllBookings,
  addAvailabilitySlot, removeAvailabilitySlot,
  updateBookingStatus, acceptBid,
  getAllReviews, addReview, toggleReviewVisibility, deleteReview,
  getAllReferrals, addReferral, toggleReferral,
} from '../lib/supabase';

export default function AdminDashboard({ user, onLogout }) {
  const [tab, setTab] = useState('bids'); // bids | reviews | referrals | settings
  const [selectedDate, setSelectedDate] = useState(null);
  const [availability, setAvailability] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [allBookings, setAllBookings] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [referrals, setReferrals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [slotForm, setSlotForm] = useState({ startTime: '09:00:00', endTime: '17:00:00', rate: '12' });
  const [adding, setAdding] = useState(false);
  const [filter, setFilter] = useState('all');

  // Review form
  const [reviewForm, setReviewForm] = useState({ name: '', rating: '5', text: '' });
  const [addingReview, setAddingReview] = useState(false);

  // Referral form
  const [refForm, setRefForm] = useState({ code: '', name: '', email: '', discount: '10' });
  const [addingRef, setAddingRef] = useState(false);

  useEffect(() => { loadData(); }, []);

  async function loadData() {
    setLoading(true);
    setError(null);
    try {
      const now = new Date();
      const start = `${now.getFullYear()}-01-01`;
      const end = `${now.getFullYear() + 1}-12-31`;
      const [avail, book, all, revs, refs] = await Promise.all([
        getAvailability(start, end),
        getBookings(start, end),
        getAllBookings(),
        getAllReviews().catch(() => []),
        getAllReferrals().catch(() => []),
      ]);
      setAvailability(avail);
      setBookings(book);
      setAllBookings(all);
      setReviews(revs);
      setReferrals(refs);
    } catch (err) {
      setError('Unable to load data.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  // ─── Availability handlers ──────────────────
  async function handleAddSlot() {
    if (!selectedDate) return;
    setAdding(true);
    try {
      await addAvailabilitySlot({ date: selectedDate, start_time: slotForm.startTime, end_time: slotForm.endTime, min_rate: parseFloat(slotForm.rate) });
      await loadData();
    } catch (err) { setError('Failed to add slot.'); } finally { setAdding(false); }
  }

  async function handleRemoveSlot(id) {
    try { await removeAvailabilitySlot(id); await loadData(); } catch { setError('Failed to remove slot.'); }
  }

  async function handleAcceptBid(booking) {
    try { await acceptBid(booking); await loadData(); } catch { setError('Failed to accept bid.'); }
  }

  async function handleDeclineBid(id) {
    try { await updateBookingStatus(id, 'declined'); await loadData(); } catch { setError('Failed to decline bid.'); }
  }

  // ─── Review handlers ──────────────────────
  async function handleAddReview(e) {
    e?.preventDefault();
    if (!reviewForm.name || !reviewForm.text) return;
    setAddingReview(true);
    try {
      await addReview({ parent_name: reviewForm.name, rating: parseInt(reviewForm.rating), review_text: reviewForm.text });
      setReviewForm({ name: '', rating: '5', text: '' });
      await loadData();
    } catch { setError('Failed to add review.'); } finally { setAddingReview(false); }
  }

  async function handleToggleReview(id, visible) {
    try { await toggleReviewVisibility(id, visible); await loadData(); } catch { setError('Failed to update review.'); }
  }

  async function handleDeleteReview(id) {
    try { await deleteReview(id); await loadData(); } catch { setError('Failed to delete review.'); }
  }

  // ─── Referral handlers ────────────────────
  async function handleAddReferral(e) {
    e?.preventDefault();
    if (!refForm.code || !refForm.name) return;
    setAddingRef(true);
    try {
      await addReferral({
        referral_code: refForm.code.toUpperCase().replace(/\s/g, ''),
        referrer_name: refForm.name,
        referrer_email: refForm.email || null,
        discount_percent: parseInt(refForm.discount),
      });
      setRefForm({ code: '', name: '', email: '', discount: '10' });
      await loadData();
    } catch (err) {
      setError(err.message?.includes('duplicate') ? 'That code already exists.' : 'Failed to create referral.');
    } finally { setAddingRef(false); }
  }

  async function handleToggleReferral(id, active) {
    try { await toggleReferral(id, active); await loadData(); } catch { setError('Failed to update referral.'); }
  }

  // ─── Computed ──────────────────────────────
  const daySlots = availability.filter(a => a.date === selectedDate);
  const pendingCount = allBookings.filter(b => b.status === 'pending').length;
  const confirmedCount = allBookings.filter(b => b.status === 'confirmed').length;
  const availDayCount = new Set(availability.map(a => a.date)).size;
  const totalEarnings = allBookings.filter(b => b.status === 'confirmed' && b.bid_amount).reduce((s, b) => s + parseFloat(b.bid_amount), 0);
  const filteredBookings = filter === 'all' ? allBookings : allBookings.filter(b => b.status === filter);
  const groupedBookings = {};
  filteredBookings.forEach(b => { if (!groupedBookings[b.date]) groupedBookings[b.date] = []; groupedBookings[b.date].push(b); });

  let displayDate = '';
  if (selectedDate) { const [y, m, d] = selectedDate.split('-').map(Number); displayDate = `${d} ${MONTHS[m - 1]}`; }

  function isHighestBid(booking) {
    const peers = allBookings.filter(b => b.date === booking.date && b.status === 'pending' && b.bid_amount);
    if (peers.length <= 1) return false;
    return parseFloat(booking.bid_amount) === Math.max(...peers.map(b => parseFloat(b.bid_amount)));
  }

  const TABS = [
    { id: 'bids', label: 'Bids', badge: pendingCount },
    { id: 'reviews', label: 'Reviews', badge: reviews.length },
    { id: 'referrals', label: 'Referrals', badge: referrals.length },
    { id: 'settings', label: 'Settings', badge: 0 },
  ];

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 30 }}>Dashboard</h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <NotificationBell />
          <button className="btn btn-outline btn-sm" onClick={onLogout}>Logout</button>
        </div>
      </div>

      {user && <div className="admin-user-bar">Signed in as <strong>{user.email}</strong></div>}
      {error && <div className="error-banner">{error}</div>}

      {/* Stats */}
      <div className="stats-grid stats-grid-4">
        <div className="card stat-card"><div className="stat-value" style={{ color: 'var(--clr-success)' }}>{availDayCount}</div><div className="stat-label">Available Days</div></div>
        <div className="card stat-card"><div className="stat-value" style={{ color: 'var(--clr-warning)' }}>{pendingCount}</div><div className="stat-label">Pending Bids</div></div>
        <div className="card stat-card"><div className="stat-value" style={{ color: 'var(--clr-primary)' }}>{confirmedCount}</div><div className="stat-label">Confirmed</div></div>
        <div className="card stat-card"><div className="stat-value" style={{ color: 'var(--clr-success)' }}>£{totalEarnings.toFixed(0)}</div><div className="stat-label">Bid Value</div></div>
      </div>

      {/* Admin Tabs */}
      <div className="admin-tabs">
        {TABS.map(t => (
          <button key={t.id} className={`admin-tab ${tab === t.id ? 'active' : ''}`} onClick={() => setTab(t.id)}>
            {t.label}
            {t.badge > 0 && <span className="filter-badge">{t.badge}</span>}
          </button>
        ))}
      </div>

      {/* ─── BIDS TAB ─── */}
      {tab === 'bids' && (
        <div className="grid-2">
          <div>
            <div className="card">
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 18, marginBottom: 16 }}>Manage Availability</h3>
              {loading ? <div className="loading">Loading...</div> : (
                <Calendar selectedDate={selectedDate} onSelectDate={setSelectedDate} availability={availability} bookings={bookings} isAdmin />
              )}
            </div>
            {selectedDate && (
              <div className="card" style={{ marginTop: 16 }}>
                <h4 style={{ fontSize: 15, fontWeight: 700, marginBottom: 12 }}>Add Slot — {displayDate}</h4>
                <div className="form-row form-row-3" style={{ marginBottom: 12 }}>
                  <div><label className="form-label">From</label><select className="form-select" value={slotForm.startTime} onChange={e => setSlotForm({ ...slotForm, startTime: e.target.value })}>{TIME_SLOTS.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}</select></div>
                  <div><label className="form-label">To</label><select className="form-select" value={slotForm.endTime} onChange={e => setSlotForm({ ...slotForm, endTime: e.target.value })}>{TIME_SLOTS.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}</select></div>
                  <div><label className="form-label">Min £/hr</label><input className="form-input" type="number" value={slotForm.rate} onChange={e => setSlotForm({ ...slotForm, rate: e.target.value })} /></div>
                </div>
                <button className="btn btn-primary btn-full" onClick={handleAddSlot} disabled={adding}>{adding ? 'Adding...' : 'Add Availability Slot'}</button>
                {daySlots.length > 0 && (
                  <div style={{ marginTop: 16 }}>
                    <label className="form-label">Current Slots</label>
                    {daySlots.map(slot => (
                      <div key={slot.id} className="admin-slot">
                        <span style={{ fontWeight: 600, fontSize: 14 }}>{formatTime(slot.start_time)} – {formatTime(slot.end_time)} · from £{slot.min_rate}/hr</span>
                        <button className="admin-slot-remove" onClick={() => handleRemoveSlot(slot.id)}>×</button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="card">
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 18, marginBottom: 16 }}>Bids & Bookings</h3>
            <div className="bid-filters">
              {['all', 'pending', 'confirmed', 'declined'].map(f => (
                <button key={f} className={`bid-filter-btn ${filter === f ? 'active' : ''}`} onClick={() => setFilter(f)}>
                  {f.charAt(0).toUpperCase() + f.slice(1)}
                  {f === 'pending' && pendingCount > 0 && <span className="filter-badge">{pendingCount}</span>}
                </button>
              ))}
            </div>

            {filteredBookings.length === 0 ? (
              <div className="empty-state"><div className="emoji">📭</div><p>No {filter === 'all' ? 'bids' : filter + ' bids'} yet</p></div>
            ) : (
              Object.entries(groupedBookings).sort(([a], [b]) => a.localeCompare(b)).map(([dateStr, dateBids]) => {
                const [y, m, d] = dateStr.split('-').map(Number);
                return (
                  <div key={dateStr} style={{ marginBottom: 16 }}>
                    <div className="date-group-header">📅 {d} {MONTHS[m - 1]} {y}</div>
                    {dateBids.map(booking => {
                      const highest = isHighestBid(booking);
                      return (
                        <div key={booking.id} className={`booking-card ${highest && booking.status === 'pending' ? 'booking-card-highlight' : ''}`}>
                          <div className="booking-card-header">
                            <div style={{ flex: 1 }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                                <span style={{ fontWeight: 700, fontSize: 15 }}>{booking.customer_name}</span>
                                {highest && booking.status === 'pending' && <span className="highest-bid-tag">⭐ Highest</span>}
                              </div>
                              <div className="bid-amount-display">£{booking.bid_amount || '—'}<span>/hr</span></div>
                              <div style={{ fontSize: 13, color: 'var(--clr-text-muted)', marginTop: 4 }}>
                                {formatTime(booking.start_time)} – {formatTime(booking.end_time)} · {booking.num_children} child{booking.num_children > 1 ? 'ren' : ''}
                              </div>
                              {booking.customer_phone && <div style={{ fontSize: 12, color: 'var(--clr-text-faint)', marginTop: 2 }}>📞 {booking.customer_phone}</div>}
                              {booking.customer_email && <div style={{ fontSize: 12, color: 'var(--clr-text-faint)' }}>✉️ {booking.customer_email}</div>}
                              {booking.referral_code && <div style={{ fontSize: 12, color: 'var(--clr-primary)', marginTop: 2 }}>🎟️ Referral: {booking.referral_code}</div>}
                              {booking.notes && <div style={{ fontSize: 12, color: 'var(--clr-text-muted)', marginTop: 4, fontStyle: 'italic' }}>"{booking.notes}"</div>}
                            </div>
                            <span className={`booking-status ${booking.status}`}>{booking.status}</span>
                          </div>
                          {booking.status === 'pending' && (
                            <>
                              <div className="booking-actions">
                                <button className="btn btn-success btn-sm" style={{ flex: 1 }} onClick={() => handleAcceptBid(booking)}>✓ Accept Bid</button>
                                <button className="btn btn-danger-outline btn-sm" style={{ flex: 1 }} onClick={() => handleDeclineBid(booking.id)}>✗ Decline</button>
                              </div>
                              <div className="accept-note">Accepting will auto-decline other overlapping bids</div>
                            </>
                          )}
                        </div>
                      );
                    })}
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* ─── REVIEWS TAB ─── */}
      {tab === 'reviews' && (
        <div className="grid-2">
          <div className="card">
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 18, marginBottom: 16 }}>Add Review</h3>
            <form onSubmit={handleAddReview}>
              <div className="form-group">
                <label className="form-label">Parent Name</label>
                <input className="form-input" value={reviewForm.name} onChange={e => setReviewForm({ ...reviewForm, name: e.target.value })} placeholder="Sarah M." />
              </div>
              <div className="form-group">
                <label className="form-label">Rating</label>
                <div className="star-select">
                  {[1, 2, 3, 4, 5].map(n => (
                    <button type="button" key={n} className={`star-btn ${n <= reviewForm.rating ? 'active' : ''}`}
                      onClick={() => setReviewForm({ ...reviewForm, rating: String(n) })}>★</button>
                  ))}
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Review Text</label>
                <textarea className="form-textarea" value={reviewForm.text} onChange={e => setReviewForm({ ...reviewForm, text: e.target.value })} placeholder="What did the parent say?" />
              </div>
              <button type="submit" className="btn btn-primary btn-full" disabled={!reviewForm.name || !reviewForm.text || addingReview}>
                {addingReview ? 'Adding...' : 'Add Review'}
              </button>
            </form>
          </div>

          <div className="card">
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 18, marginBottom: 16 }}>All Reviews ({reviews.length})</h3>
            {reviews.length === 0 ? (
              <div className="empty-state"><div className="emoji">⭐</div><p>No reviews yet</p><p className="hint">Add reviews from happy parents!</p></div>
            ) : reviews.map(r => (
              <div key={r.id} className={`review-admin-card ${!r.is_visible ? 'review-hidden' : ''}`}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 14 }}>{r.parent_name}</div>
                    <div className="review-stars" style={{ fontSize: 14 }}>{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</div>
                    <p style={{ fontSize: 13, color: 'var(--clr-text-muted)', marginTop: 4 }}>"{r.review_text}"</p>
                  </div>
                  <div style={{ display: 'flex', gap: 4, flexShrink: 0 }}>
                    <button className="btn btn-outline btn-xs" onClick={() => handleToggleReview(r.id, !r.is_visible)}>
                      {r.is_visible ? '👁️ Hide' : '👁️ Show'}
                    </button>
                    <button className="btn btn-danger-outline btn-xs" onClick={() => handleDeleteReview(r.id)}>🗑️</button>
                  </div>
                </div>
                {!r.is_visible && <div className="review-hidden-label">Hidden from customers</div>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ─── REFERRALS TAB ─── */}
      {tab === 'referrals' && (
        <div className="grid-2">
          <div className="card">
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 18, marginBottom: 16 }}>Create Referral Code</h3>
            <form onSubmit={handleAddReferral}>
              <div className="form-group">
                <label className="form-label">Referral Code</label>
                <input className="form-input" value={refForm.code} onChange={e => setRefForm({ ...refForm, code: e.target.value.toUpperCase() })}
                  placeholder="e.g. FRIEND10" style={{ textTransform: 'uppercase' }} />
              </div>
              <div className="form-row form-row-2" style={{ marginBottom: 12 }}>
                <div>
                  <label className="form-label">Referrer Name</label>
                  <input className="form-input" value={refForm.name} onChange={e => setRefForm({ ...refForm, name: e.target.value })} placeholder="Sarah M." />
                </div>
                <div>
                  <label className="form-label">Discount %</label>
                  <input className="form-input" type="number" min="1" max="50" value={refForm.discount} onChange={e => setRefForm({ ...refForm, discount: e.target.value })} />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Email (optional)</label>
                <input className="form-input" value={refForm.email} onChange={e => setRefForm({ ...refForm, email: e.target.value })} placeholder="sarah@email.com" />
              </div>
              <button type="submit" className="btn btn-primary btn-full" disabled={!refForm.code || !refForm.name || addingRef}>
                {addingRef ? 'Creating...' : 'Create Code'}
              </button>
            </form>
          </div>

          <div className="card">
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 18, marginBottom: 16 }}>Active Codes ({referrals.length})</h3>
            {referrals.length === 0 ? (
              <div className="empty-state"><div className="emoji">🎟️</div><p>No referral codes yet</p><p className="hint">Create codes for parents to share!</p></div>
            ) : referrals.map(r => (
              <div key={r.id} className={`referral-card ${!r.is_active ? 'referral-inactive' : ''}`}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div className="referral-code-display">{r.referral_code}</div>
                    <div style={{ fontSize: 13, color: 'var(--clr-text-muted)' }}>
                      {r.referrer_name} · {r.discount_percent}% off · Used {r.times_used}x
                    </div>
                  </div>
                  <button className={`btn btn-sm ${r.is_active ? 'btn-danger-outline' : 'btn-success'}`}
                    onClick={() => handleToggleReferral(r.id, !r.is_active)}>
                    {r.is_active ? 'Disable' : 'Enable'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ─── SETTINGS TAB ─── */}
      {tab === 'settings' && (
        <div style={{ maxWidth: 500 }}>
          <ChangePassword />
          <div className="card">
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 18, marginBottom: 16 }}>WhatsApp Button</h3>
            <p style={{ fontSize: 13, color: 'var(--clr-text-muted)', marginBottom: 12 }}>
              To enable the WhatsApp button on the site, edit <code>src/components/WhatsAppButton.jsx</code> and set your number in the <code>WHATSAPP_NUMBER</code> constant. Format: country code + number without leading 0 (e.g. <code>447700900000</code>).
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
