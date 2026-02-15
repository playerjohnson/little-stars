import { useState, useEffect } from 'react';
import Calendar from './Calendar';
import ChangePassword from './ChangePassword';
import {
  MONTHS, TIME_SLOTS, formatTime, DAYS_FULL,
} from '../lib/utils';
import {
  getAvailability, getBookings, getAllBookings,
  addAvailabilitySlot, removeAvailabilitySlot,
  updateBookingStatus, acceptBid,
} from '../lib/supabase';

export default function AdminDashboard({ user, onLogout }) {
  const [selectedDate, setSelectedDate] = useState(null);
  const [availability, setAvailability] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [allBookings, setAllBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [slotForm, setSlotForm] = useState({ startTime: '09:00:00', endTime: '17:00:00', rate: '12' });
  const [adding, setAdding] = useState(false);
  const [filter, setFilter] = useState('all');

  useEffect(() => { loadData(); }, []);

  async function loadData() {
    setLoading(true);
    setError(null);
    try {
      const now = new Date();
      const start = `${now.getFullYear()}-01-01`;
      const end = `${now.getFullYear() + 1}-12-31`;
      const [avail, book, all] = await Promise.all([
        getAvailability(start, end),
        getBookings(start, end),
        getAllBookings(),
      ]);
      setAvailability(avail);
      setBookings(book);
      setAllBookings(all);
    } catch (err) {
      setError('Unable to load data. Check Supabase configuration.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleAddSlot() {
    if (!selectedDate) return;
    setAdding(true);
    try {
      await addAvailabilitySlot({
        date: selectedDate,
        start_time: slotForm.startTime,
        end_time: slotForm.endTime,
        min_rate: parseFloat(slotForm.rate),
      });
      await loadData();
    } catch (err) {
      setError('Failed to add slot.');
      console.error(err);
    } finally {
      setAdding(false);
    }
  }

  async function handleRemoveSlot(id) {
    try {
      await removeAvailabilitySlot(id);
      await loadData();
    } catch (err) {
      setError('Failed to remove slot.');
      console.error(err);
    }
  }

  async function handleAcceptBid(booking) {
    try {
      await acceptBid(booking);
      await loadData();
    } catch (err) {
      setError('Failed to accept bid.');
      console.error(err);
    }
  }

  async function handleDeclineBid(id) {
    try {
      await updateBookingStatus(id, 'declined');
      await loadData();
    } catch (err) {
      setError('Failed to decline bid.');
      console.error(err);
    }
  }

  const daySlots = availability.filter(a => a.date === selectedDate);
  const pendingCount = allBookings.filter(b => b.status === 'pending').length;
  const confirmedCount = allBookings.filter(b => b.status === 'confirmed').length;
  const availDayCount = new Set(availability.map(a => a.date)).size;
  const totalEarnings = allBookings
    .filter(b => b.status === 'confirmed' && b.bid_amount)
    .reduce((sum, b) => sum + parseFloat(b.bid_amount), 0);

  const filteredBookings = filter === 'all'
    ? allBookings
    : allBookings.filter(b => b.status === filter);

  const groupedBookings = {};
  filteredBookings.forEach(b => {
    if (!groupedBookings[b.date]) groupedBookings[b.date] = [];
    groupedBookings[b.date].push(b);
  });

  let displayDate = '';
  if (selectedDate) {
    const [y, m, d] = selectedDate.split('-').map(Number);
    displayDate = `${d} ${MONTHS[m - 1]}`;
  }

  function isHighestBid(booking) {
    const peers = allBookings.filter(
      b => b.date === booking.date && b.status === 'pending' && b.bid_amount
    );
    if (peers.length <= 1) return false;
    const maxBid = Math.max(...peers.map(b => parseFloat(b.bid_amount)));
    return parseFloat(booking.bid_amount) === maxBid;
  }

  return (
    <div>
      {/* Header bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 30 }}>Dashboard</h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <ChangePassword />
          <button className="btn btn-outline btn-sm" onClick={onLogout}>Logout</button>
        </div>
      </div>

      {/* Logged in as */}
      {user && (
        <div className="admin-user-bar">
          Signed in as <strong>{user.email}</strong>
        </div>
      )}

      {error && <div className="error-banner">{error}</div>}

      {/* Stats */}
      <div className="stats-grid stats-grid-4">
        <div className="card stat-card">
          <div className="stat-value" style={{ color: 'var(--clr-success)' }}>{availDayCount}</div>
          <div className="stat-label">Available Days</div>
        </div>
        <div className="card stat-card">
          <div className="stat-value" style={{ color: 'var(--clr-warning)' }}>{pendingCount}</div>
          <div className="stat-label">Pending Bids</div>
        </div>
        <div className="card stat-card">
          <div className="stat-value" style={{ color: 'var(--clr-primary)' }}>{confirmedCount}</div>
          <div className="stat-label">Confirmed</div>
        </div>
        <div className="card stat-card">
          <div className="stat-value" style={{ color: 'var(--clr-success)' }}>£{totalEarnings.toFixed(0)}</div>
          <div className="stat-label">Bid Value</div>
        </div>
      </div>

      <div className="grid-2">
        {/* Calendar + Slot Management */}
        <div>
          <div className="card">
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 18, marginBottom: 16 }}>
              Manage Availability
            </h3>
            {loading ? (
              <div className="loading">Loading...</div>
            ) : (
              <Calendar
                selectedDate={selectedDate}
                onSelectDate={setSelectedDate}
                availability={availability}
                bookings={bookings}
                isAdmin
              />
            )}
          </div>

          {selectedDate && (
            <div className="card" style={{ marginTop: 16 }}>
              <h4 style={{ fontSize: 15, fontWeight: 700, marginBottom: 12 }}>
                Add Slot — {displayDate}
              </h4>
              <div className="form-row form-row-3" style={{ marginBottom: 12 }}>
                <div>
                  <label className="form-label">From</label>
                  <select className="form-select" value={slotForm.startTime}
                    onChange={e => setSlotForm({ ...slotForm, startTime: e.target.value })}>
                    {TIME_SLOTS.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="form-label">To</label>
                  <select className="form-select" value={slotForm.endTime}
                    onChange={e => setSlotForm({ ...slotForm, endTime: e.target.value })}>
                    {TIME_SLOTS.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="form-label">Min £/hr</label>
                  <input className="form-input" type="number" value={slotForm.rate}
                    onChange={e => setSlotForm({ ...slotForm, rate: e.target.value })} />
                </div>
              </div>
              <button className="btn btn-primary btn-full" onClick={handleAddSlot} disabled={adding}>
                {adding ? 'Adding...' : 'Add Availability Slot'}
              </button>

              {daySlots.length > 0 && (
                <div style={{ marginTop: 16 }}>
                  <label className="form-label">Current Slots</label>
                  {daySlots.map(slot => (
                    <div key={slot.id} className="admin-slot">
                      <span style={{ fontWeight: 600, fontSize: 14 }}>
                        {formatTime(slot.start_time)} – {formatTime(slot.end_time)} · from £{slot.min_rate}/hr
                      </span>
                      <button className="admin-slot-remove" onClick={() => handleRemoveSlot(slot.id)}>×</button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Bids List */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 18 }}>
              Bids & Bookings
            </h3>
          </div>

          <div className="bid-filters">
            {['all', 'pending', 'confirmed', 'declined'].map(f => (
              <button
                key={f}
                className={`bid-filter-btn ${filter === f ? 'active' : ''}`}
                onClick={() => setFilter(f)}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
                {f === 'pending' && pendingCount > 0 && (
                  <span className="filter-badge">{pendingCount}</span>
                )}
              </button>
            ))}
          </div>

          {filteredBookings.length === 0 ? (
            <div className="empty-state">
              <div className="emoji">📭</div>
              <p>No {filter === 'all' ? 'bids' : filter + ' bids'} yet</p>
              <p className="hint">Bids will appear here when customers submit them.</p>
            </div>
          ) : (
            Object.entries(groupedBookings)
              .sort(([a], [b]) => a.localeCompare(b))
              .map(([dateStr, dateBids]) => {
                const [y, m, d] = dateStr.split('-').map(Number);
                return (
                  <div key={dateStr} style={{ marginBottom: 16 }}>
                    <div className="date-group-header">
                      📅 {d} {MONTHS[m - 1]} {y}
                    </div>
                    {dateBids.map(booking => {
                      const highest = isHighestBid(booking);
                      return (
                        <div key={booking.id} className={`booking-card ${highest && booking.status === 'pending' ? 'booking-card-highlight' : ''}`}>
                          <div className="booking-card-header">
                            <div style={{ flex: 1 }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                                <span style={{ fontWeight: 700, fontSize: 15 }}>{booking.customer_name}</span>
                                {highest && booking.status === 'pending' && (
                                  <span className="highest-bid-tag">⭐ Highest</span>
                                )}
                              </div>
                              <div className="bid-amount-display">
                                £{booking.bid_amount || '—'}<span>/hr</span>
                              </div>
                              <div style={{ fontSize: 13, color: 'var(--clr-text-muted)', marginTop: 4 }}>
                                {formatTime(booking.start_time)} – {formatTime(booking.end_time)}
                                {' · '}{booking.num_children} child{booking.num_children > 1 ? 'ren' : ''}
                              </div>
                              {booking.customer_phone && (
                                <div style={{ fontSize: 12, color: 'var(--clr-text-faint)', marginTop: 2 }}>📞 {booking.customer_phone}</div>
                              )}
                              {booking.customer_email && (
                                <div style={{ fontSize: 12, color: 'var(--clr-text-faint)' }}>✉️ {booking.customer_email}</div>
                              )}
                              {booking.notes && (
                                <div style={{ fontSize: 12, color: 'var(--clr-text-muted)', marginTop: 4, fontStyle: 'italic' }}>
                                  "{booking.notes}"
                                </div>
                              )}
                            </div>
                            <span className={`booking-status ${booking.status}`}>{booking.status}</span>
                          </div>
                          {booking.status === 'pending' && (
                            <div className="booking-actions">
                              <button className="btn btn-success btn-sm" style={{ flex: 1 }}
                                onClick={() => handleAcceptBid(booking)}>
                                ✓ Accept Bid
                              </button>
                              <button className="btn btn-danger-outline btn-sm" style={{ flex: 1 }}
                                onClick={() => handleDeclineBid(booking.id)}>
                                ✗ Decline
                              </button>
                            </div>
                          )}
                          {booking.status === 'pending' && (
                            <div className="accept-note">
                              Accepting will auto-decline other overlapping bids
                            </div>
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
    </div>
  );
}
