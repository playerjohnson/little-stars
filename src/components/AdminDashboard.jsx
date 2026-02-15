import { useState, useEffect } from 'react';
import Calendar from './Calendar';
import {
  MONTHS, TIME_SLOTS, formatTime, formatDateDisplay, DAYS_FULL,
} from '../lib/utils';
import {
  getAvailability, getBookings, getAllBookings,
  addAvailabilitySlot, removeAvailabilitySlot, updateBookingStatus,
} from '../lib/supabase';

export default function AdminDashboard({ onLogout }) {
  const [selectedDate, setSelectedDate] = useState(null);
  const [availability, setAvailability] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [allBookings, setAllBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [slotForm, setSlotForm] = useState({ startTime: '09:00:00', endTime: '17:00:00', rate: '12' });
  const [adding, setAdding] = useState(false);

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
        hourly_rate: parseFloat(slotForm.rate),
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

  async function handleStatusUpdate(id, status) {
    try {
      await updateBookingStatus(id, status);
      await loadData();
    } catch (err) {
      setError('Failed to update booking.');
      console.error(err);
    }
  }

  const daySlots = availability.filter(a => a.date === selectedDate);
  const pendingCount = allBookings.filter(b => b.status === 'pending').length;
  const availDayCount = new Set(availability.map(a => a.date)).size;

  let displayDate = '';
  if (selectedDate) {
    const [y, m, d] = selectedDate.split('-').map(Number);
    const dateObj = new Date(y, m - 1, d);
    displayDate = `${d} ${MONTHS[m - 1]}`;
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 30 }}>Dashboard</h2>
        <button className="btn btn-outline btn-sm" onClick={onLogout}>Logout</button>
      </div>

      {error && <div className="error-banner">{error}</div>}

      {/* Stats */}
      <div className="stats-grid">
        <div className="card stat-card">
          <div className="stat-value" style={{ color: 'var(--clr-success)' }}>{availDayCount}</div>
          <div className="stat-label">Available Days</div>
        </div>
        <div className="card stat-card">
          <div className="stat-value" style={{ color: 'var(--clr-warning)' }}>{allBookings.length}</div>
          <div className="stat-label">Total Bookings</div>
        </div>
        <div className="card stat-card">
          <div className="stat-value" style={{ color: 'var(--clr-primary)' }}>{pendingCount}</div>
          <div className="stat-label">Pending</div>
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
                  <label className="form-label">£/hour</label>
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
                        {formatTime(slot.start_time)} – {formatTime(slot.end_time)} · £{slot.hourly_rate}/hr
                      </span>
                      <button className="admin-slot-remove" onClick={() => handleRemoveSlot(slot.id)}>×</button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Bookings List */}
        <div className="card">
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 18, marginBottom: 16 }}>
            Booking Requests
          </h3>

          {allBookings.length === 0 ? (
            <div className="empty-state">
              <div className="emoji">📭</div>
              <p>No bookings yet</p>
              <p className="hint">Bookings will appear here when customers submit them.</p>
            </div>
          ) : (
            allBookings.map(booking => {
              const [y, m, d] = booking.date.split('-').map(Number);
              return (
                <div key={booking.id} className="booking-card">
                  <div className="booking-card-header">
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 15 }}>{booking.customer_name}</div>
                      <div style={{ fontSize: 13, color: 'var(--clr-text-muted)' }}>
                        {d} {MONTHS[m - 1]} · {formatTime(booking.start_time)} – {formatTime(booking.end_time)}
                      </div>
                      {booking.customer_phone && (
                        <div style={{ fontSize: 12, color: 'var(--clr-text-faint)' }}>📞 {booking.customer_phone}</div>
                      )}
                      {booking.customer_email && (
                        <div style={{ fontSize: 12, color: 'var(--clr-text-faint)' }}>✉️ {booking.customer_email}</div>
                      )}
                      {booking.notes && (
                        <div style={{ fontSize: 12, color: 'var(--clr-text-muted)', marginTop: 4, fontStyle: 'italic' }}>
                          "{booking.notes}"
                        </div>
                      )}
                      <div style={{ fontSize: 12, color: 'var(--clr-text-faint)', marginTop: 2 }}>
                        {booking.num_children} child{booking.num_children > 1 ? 'ren' : ''}
                      </div>
                    </div>
                    <span className={`booking-status ${booking.status}`}>{booking.status}</span>
                  </div>

                  {booking.status === 'pending' && (
                    <div className="booking-actions">
                      <button className="btn btn-success btn-sm" style={{ flex: 1 }}
                        onClick={() => handleStatusUpdate(booking.id, 'confirmed')}>
                        ✓ Confirm
                      </button>
                      <button className="btn btn-danger-outline btn-sm" style={{ flex: 1 }}
                        onClick={() => handleStatusUpdate(booking.id, 'declined')}>
                        ✗ Decline
                      </button>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
