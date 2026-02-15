import { useState, useEffect } from 'react';
import Calendar from './Calendar';
import {
  DAYS_FULL, MONTHS, TIME_SLOTS, formatTime, timeToMinutes,
} from '../lib/utils';
import { getAvailability, getBookings, createBooking } from '../lib/supabase';

const EMPTY_FORM = { name: '', email: '', phone: '', children: '1', startTime: '', endTime: '', bidAmount: '', notes: '' };

export default function BookingPage() {
  const [selectedDate, setSelectedDate] = useState(null);
  const [availability, setAvailability] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [form, setForm] = useState(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [bidError, setBidError] = useState('');

  useEffect(() => { loadData(); }, []);

  async function loadData() {
    setLoading(true);
    setError(null);
    try {
      const now = new Date();
      const start = `${now.getFullYear()}-01-01`;
      const end = `${now.getFullYear() + 1}-12-31`;
      const [avail, book] = await Promise.all([
        getAvailability(start, end),
        getBookings(start, end),
      ]);
      setAvailability(avail);
      setBookings(book);
    } catch (err) {
      setError('Unable to load data. Please check your connection.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const daySlots = availability.filter(a => a.date === selectedDate);
  const dayBookings = bookings.filter(b => b.date === selectedDate);

  // Find the minimum rate for selected date (for validation)
  const minRate = daySlots.length > 0
    ? Math.min(...daySlots.map(s => parseFloat(s.min_rate)))
    : 0;

  // Count active bids per slot
  function getBidCount(slot) {
    return dayBookings.filter(
      b => b.status === 'pending' &&
        timeToMinutes(b.start_time) < timeToMinutes(slot.end_time) &&
        timeToMinutes(b.end_time) > timeToMinutes(slot.start_time)
    ).length;
  }

  function isSlotConfirmed(slot) {
    return dayBookings.some(
      b => b.status === 'confirmed' &&
        timeToMinutes(b.start_time) < timeToMinutes(slot.end_time) &&
        timeToMinutes(b.end_time) > timeToMinutes(slot.start_time)
    );
  }

  // Find the highest current bid for a slot
  function getHighestBid(slot) {
    const bids = dayBookings.filter(
      b => (b.status === 'pending' || b.status === 'confirmed') &&
        timeToMinutes(b.start_time) < timeToMinutes(slot.end_time) &&
        timeToMinutes(b.end_time) > timeToMinutes(slot.start_time) &&
        b.bid_amount
    );
    if (bids.length === 0) return null;
    return Math.max(...bids.map(b => parseFloat(b.bid_amount)));
  }

  function validateBid() {
    const amount = parseFloat(form.bidAmount);
    if (!form.bidAmount || isNaN(amount)) {
      setBidError('Please enter a bid amount.');
      return false;
    }
    if (amount < minRate) {
      setBidError(`Minimum bid is £${minRate}/hr.`);
      return false;
    }
    setBidError('');
    return true;
  }

  const hasContact = form.email.trim() || form.phone.trim();

  async function handleSubmit() {
    if (!selectedDate || !form.name || !form.startTime || !form.endTime || !hasContact) return;
    if (!validateBid()) return;

    setSubmitting(true);
    setError(null);
    try {
      await createBooking({
        date: selectedDate,
        start_time: form.startTime,
        end_time: form.endTime,
        customer_name: form.name,
        customer_email: form.email || null,
        customer_phone: form.phone || null,
        num_children: parseInt(form.children),
        notes: form.notes || null,
        bid_amount: parseFloat(form.bidAmount),
      });
      setForm(EMPTY_FORM);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 5000);
      await loadData();
    } catch (err) {
      setError('Failed to submit bid. Please try again.');
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  }

  function update(field, value) {
    setForm(prev => ({ ...prev, [field]: value }));
    if (field === 'bidAmount') setBidError('');
  }

  // Display date
  let displayDate = '';
  if (selectedDate) {
    const [y, m, d] = selectedDate.split('-').map(Number);
    const dateObj = new Date(y, m - 1, d);
    displayDate = `${DAYS_FULL[dateObj.getDay()]}, ${d} ${MONTHS[m - 1]}`;
  }

  return (
    <div>
      <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 30, marginBottom: 24 }}>
        Book a Session
      </h2>

      {error && <div className="error-banner">{error}</div>}

      <div className="grid-2">
        {/* Calendar */}
        <div className="card">
          {loading ? (
            <div className="loading">Loading calendar...</div>
          ) : (
            <Calendar
              selectedDate={selectedDate}
              onSelectDate={setSelectedDate}
              availability={availability}
              bookings={bookings}
            />
          )}
        </div>

        {/* Booking Panel */}
        <div className="card">
          {selectedDate ? (
            <div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 18, marginBottom: 4 }}>
                {displayDate}
              </h3>

              {daySlots.length > 0 ? (
                <div>
                  <p style={{ fontSize: 13, color: 'var(--clr-text-muted)', marginBottom: 16 }}>
                    Available slots — place your bid to book:
                  </p>

                  <div style={{ marginBottom: 20 }}>
                    {daySlots.map(slot => {
                      const confirmed = isSlotConfirmed(slot);
                      const bidCount = getBidCount(slot);
                      const highBid = getHighestBid(slot);

                      return (
                        <div key={slot.id} className={`slot ${confirmed ? 'slot-booked' : 'slot-open'}`}>
                          <div>
                            <div className="slot-time">
                              {formatTime(slot.start_time)} – {formatTime(slot.end_time)}
                            </div>
                            <div className="slot-rate-from">
                              From <strong>£{slot.min_rate}</strong>/hr
                            </div>
                            {bidCount > 0 && !confirmed && (
                              <div className="slot-bid-info">
                                🔥 {bidCount} bid{bidCount > 1 ? 's' : ''} placed
                                {highBid && <> · highest £{highBid}/hr</>}
                              </div>
                            )}
                          </div>
                          <div style={{ textAlign: 'right' }}>
                            <span className={`slot-badge ${confirmed ? 'booked' : 'open'}`}>
                              {confirmed ? 'Booked' : 'Open'}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {success && (
                    <div className="success-banner">
                      <div className="emoji">🎉</div>
                      <div className="title">Bid Submitted!</div>
                      <div className="desc">You'll be notified if your bid is accepted.</div>
                    </div>
                  )}

                  <h4 style={{ fontSize: 14, fontWeight: 700, marginBottom: 12 }}>
                    Place Your Bid
                  </h4>

                  <div className="form-group">
                    <label className="form-label">Your Name *</label>
                    <input className="form-input" value={form.name}
                      onChange={e => update('name', e.target.value)} placeholder="Jane Smith" />
                  </div>

                  <div className="form-row form-row-2" style={{ marginBottom: 12 }}>
                    <div>
                      <label className="form-label">Email {!form.phone.trim() ? '*' : ''}</label>
                      <input className="form-input" value={form.email}
                        onChange={e => update('email', e.target.value)} placeholder="jane@email.com" />
                    </div>
                    <div>
                      <label className="form-label">Phone {!form.email.trim() ? '*' : ''}</label>
                      <input className="form-input" value={form.phone}
                        onChange={e => update('phone', e.target.value)} placeholder="07700 900000" />
                    </div>
                  </div>
                  {!hasContact && (
                    <div className="field-error" style={{ marginTop: -8, marginBottom: 8 }}>
                      Please provide at least an email or phone number
                    </div>
                  )}

                  <div className="form-row form-row-2" style={{ marginBottom: 12 }}>
                    <div>
                      <label className="form-label">Start Time *</label>
                      <select className="form-select" value={form.startTime}
                        onChange={e => update('startTime', e.target.value)}>
                        <option value="">Select</option>
                        {TIME_SLOTS.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="form-label">End Time *</label>
                      <select className="form-select" value={form.endTime}
                        onChange={e => update('endTime', e.target.value)}>
                        <option value="">Select</option>
                        {TIME_SLOTS.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                      </select>
                    </div>
                  </div>

                  <div className="form-row form-row-2" style={{ marginBottom: 12 }}>
                    <div>
                      <label className="form-label">Your Bid (£/hr) *</label>
                      <div className="bid-input-wrapper">
                        <span className="bid-currency">£</span>
                        <input
                          className={`form-input bid-input ${bidError ? 'input-error' : ''}`}
                          type="number"
                          step="0.50"
                          min={minRate}
                          value={form.bidAmount}
                          onChange={e => update('bidAmount', e.target.value)}
                          placeholder={`${minRate} min`}
                        />
                      </div>
                      {bidError && <div className="field-error">{bidError}</div>}
                      <div className="bid-hint">Minimum £{minRate}/hr · Higher bids are more likely to be accepted</div>
                    </div>
                    <div>
                      <label className="form-label">Children</label>
                      <select className="form-select" value={form.children}
                        onChange={e => update('children', e.target.value)}>
                        {[1, 2, 3, 4].map(n => <option key={n} value={n}>{n}</option>)}
                      </select>
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Notes</label>
                    <textarea className="form-textarea" value={form.notes}
                      onChange={e => update('notes', e.target.value)}
                      placeholder="Any special requirements..." />
                  </div>

                  <button
                    className="btn btn-primary btn-full"
                    disabled={!form.name || !form.startTime || !form.endTime || !form.bidAmount || !hasContact || submitting}
                    onClick={handleSubmit}
                  >
                    {submitting ? 'Submitting...' : `Submit Bid — £${form.bidAmount || '0'}/hr`}
                  </button>
                </div>
              ) : (
                <div className="empty-state">
                  <div className="emoji">📅</div>
                  <p>No availability on this date</p>
                  <p className="hint">Try selecting a date with a green dot.</p>
                </div>
              )}
            </div>
          ) : (
            <div className="empty-state" style={{ padding: '60px 20px' }}>
              <div className="emoji" style={{ fontSize: 48 }}>👈</div>
              <p style={{ fontSize: 16 }}>Select a date to get started</p>
              <p className="hint">Green dots indicate available dates.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
