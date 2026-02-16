import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Calendar from './Calendar';
import {
  DAYS_FULL, MONTHS, TIME_SLOTS, formatTime, timeToMinutes,
} from '../lib/utils';
import { getAvailability, getBookings, createBooking, getReferralByCode, incrementReferralUsage } from '../lib/supabase';

const SAVED_KEY = 'littlestars-customer';

function loadSavedCustomer() {
  try {
    return JSON.parse(localStorage.getItem(SAVED_KEY)) || {};
  } catch { return {}; }
}

const EMPTY_FORM = { name: '', email: '', phone: '', children: '1', startTime: '', endTime: '', bidAmount: '', notes: '', referralCode: '' };

export default function BookingPage() {
  const saved = loadSavedCustomer();
  const [selectedDate, setSelectedDate] = useState(null);
  const [availability, setAvailability] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState('calendar');

  const [form, setForm] = useState({
    ...EMPTY_FORM,
    name: saved.name || '',
    email: saved.email || '',
    phone: saved.phone || '',
    children: saved.children || '1',
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [bidError, setBidError] = useState('');
  const [referralValid, setReferralValid] = useState(null);
  const [referralDiscount, setReferralDiscount] = useState(0);
  const [termsAccepted, setTermsAccepted] = useState(false);

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
  const minRate = daySlots.length > 0 ? Math.min(...daySlots.map(s => parseFloat(s.min_rate))) : 0;
  const hasContact = form.email.trim() || form.phone.trim();

  // ─── Slot analysis helpers ──────────────────────────

  function getSlotBids(slot) {
    return dayBookings.filter(
      b => timeToMinutes(b.start_time) < timeToMinutes(slot.end_time) &&
        timeToMinutes(b.end_time) > timeToMinutes(slot.start_time)
    );
  }

  function getBidCount(slot) {
    return getSlotBids(slot).filter(b => b.status === 'pending').length;
  }

  function isSlotConfirmed(slot) {
    return getSlotBids(slot).some(b => b.status === 'confirmed');
  }

  function getHighestBid(slot) {
    const bids = getSlotBids(slot).filter(
      b => (b.status === 'pending' || b.status === 'confirmed') && b.bid_amount
    );
    if (bids.length === 0) return null;
    return Math.max(...bids.map(b => parseFloat(b.bid_amount)));
  }

  function getHighestPendingBid(slot) {
    const bids = getSlotBids(slot).filter(b => b.status === 'pending' && b.bid_amount);
    if (bids.length === 0) return null;
    return Math.max(...bids.map(b => parseFloat(b.bid_amount)));
  }

  // ─── Check if the whole date is fully booked ───────

  const allSlotsConfirmed = daySlots.length > 0 && daySlots.every(s => isSlotConfirmed(s));

  // ─── Time range filtering ──────────────────────────
  // Only show times within the available slot window(s)
  // Disable times that fall within confirmed bookings

  function getAvailableTimeRange() {
    if (daySlots.length === 0) return { earliest: null, latest: null };
    const earliest = Math.min(...daySlots.map(s => timeToMinutes(s.start_time)));
    const latest = Math.max(...daySlots.map(s => timeToMinutes(s.end_time)));
    return { earliest, latest };
  }

  function getConfirmedRanges() {
    return dayBookings
      .filter(b => b.status === 'confirmed')
      .map(b => ({ start: timeToMinutes(b.start_time), end: timeToMinutes(b.end_time) }));
  }

  function isTimeInConfirmedRange(mins, isEndTime = false) {
    const confirmed = getConfirmedRanges();
    return confirmed.some(r => {
      if (isEndTime) return mins > r.start && mins <= r.end;
      return mins >= r.start && mins < r.end;
    });
  }

  const { earliest: slotStart, latest: slotEnd } = getAvailableTimeRange();

  const startTimeOptions = TIME_SLOTS.filter(t => {
    if (slotStart === null) return true;
    const mins = timeToMinutes(t.value);
    return mins >= slotStart && mins < slotEnd;
  }).map(t => ({
    ...t,
    booked: isTimeInConfirmedRange(timeToMinutes(t.value), false),
  }));

  const endTimeOptions = TIME_SLOTS.filter(t => {
    if (slotStart === null) return true;
    const mins = timeToMinutes(t.value);
    const afterStart = form.startTime ? mins > timeToMinutes(form.startTime) : true;
    return mins > slotStart && mins <= slotEnd && afterStart;
  }).map(t => ({
    ...t,
    booked: isTimeInConfirmedRange(timeToMinutes(t.value), true),
  }));

  // ─── Minimum bid calculation ───────────────────────
  // Must be higher than the current highest pending bid, or the min_rate

  function getMinBidAmount() {
    // Find which slot the current form time overlaps with
    const overlappingSlot = daySlots.find(s => {
      if (!form.startTime || !form.endTime) return false;
      return timeToMinutes(form.startTime) < timeToMinutes(s.end_time) &&
        timeToMinutes(form.endTime) > timeToMinutes(s.start_time);
    });

    if (!overlappingSlot) return minRate;

    const highBid = getHighestPendingBid(overlappingSlot);
    const slotMin = parseFloat(overlappingSlot.min_rate);

    if (highBid !== null) {
      // Must bid higher than current highest — round up to next 0.50
      return Math.ceil((highBid + 0.5) * 2) / 2;
    }
    return slotMin;
  }

  const effectiveMinBid = getMinBidAmount();

  // ─── Validation ────────────────────────────────────

  function validateBid() {
    const amount = parseFloat(form.bidAmount);
    if (!form.bidAmount || isNaN(amount)) { setBidError('Please enter a bid amount.'); return false; }
    if (amount < effectiveMinBid) {
      setBidError(`Minimum bid is £${effectiveMinBid.toFixed(2)}/hr.`);
      return false;
    }
    setBidError('');
    return true;
  }

  async function checkReferralCode() {
    if (!form.referralCode.trim()) { setReferralValid(null); setReferralDiscount(0); return; }
    try {
      const ref = await getReferralByCode(form.referralCode.trim());
      if (ref) { setReferralValid(true); setReferralDiscount(ref.discount_percent); }
      else { setReferralValid(false); setReferralDiscount(0); }
    } catch { setReferralValid(false); setReferralDiscount(0); }
  }

  async function handleSubmit() {
    if (!selectedDate || !form.name || !form.startTime || !form.endTime || !hasContact || !termsAccepted) return;
    if (allSlotsConfirmed) return;
    if (!validateBid()) return;

    setSubmitting(true);
    setError(null);
    try {
      localStorage.setItem(SAVED_KEY, JSON.stringify({
        name: form.name, email: form.email, phone: form.phone, children: form.children,
      }));

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
        referral_code: form.referralCode.trim().toUpperCase() || null,
        terms_accepted_at: new Date().toISOString(),
      });

      if (referralValid && form.referralCode.trim()) {
        await incrementReferralUsage(form.referralCode.trim()).catch(() => {});
      }

      setForm(prev => ({ ...prev, startTime: '', endTime: '', bidAmount: '', notes: '', referralCode: '' }));
      setReferralValid(null);
      setReferralDiscount(0);
      setTermsAccepted(false);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 15000);
      await loadData();
    } catch (err) {
      setError('Failed to submit request. Please try again.');
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  }

  function update(field, value) {
    setForm(prev => ({ ...prev, [field]: value }));
    if (field === 'bidAmount') setBidError('');
    // Reset end time if start time changes
    if (field === 'startTime') setForm(prev => ({ ...prev, startTime: value, endTime: '' }));
  }

  // ─── List view helpers ─────────────────────────────

  function getUpcomingSlots() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return availability
      .filter(a => new Date(a.date) >= today)
      .slice(0, 21);
  }

  function isSlotBookedByDate(slot) {
    return bookings.some(
      b => b.date === slot.date &&
        b.status === 'confirmed' &&
        timeToMinutes(b.start_time) < timeToMinutes(slot.end_time) &&
        timeToMinutes(b.end_time) > timeToMinutes(slot.start_time)
    );
  }

  function getSlotBidCountByDate(slot) {
    return bookings.filter(
      b => b.date === slot.date &&
        b.status === 'pending' &&
        timeToMinutes(b.start_time) < timeToMinutes(slot.end_time) &&
        timeToMinutes(b.end_time) > timeToMinutes(slot.start_time)
    ).length;
  }

  let displayDate = '';
  if (selectedDate) {
    const [y, m, d] = selectedDate.split('-').map(Number);
    const dateObj = new Date(y, m - 1, d);
    displayDate = `${DAYS_FULL[dateObj.getDay()]}, ${d} ${MONTHS[m - 1]}`;
  }

  return (
    <div>
      <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 30, marginBottom: 24 }}>
        Book Naomi
      </h2>

      {error && <div className="error-banner">{error}</div>}

      <div className="view-toggle">
        <button className={`view-toggle-btn ${viewMode === 'calendar' ? 'active' : ''}`}
          onClick={() => setViewMode('calendar')}>📅 Calendar</button>
        <button className={`view-toggle-btn ${viewMode === 'list' ? 'active' : ''}`}
          onClick={() => setViewMode('list')}>📋 List View</button>
      </div>

      <div className="grid-2">
        {/* ─── Left: Calendar or List ─── */}
        <div className="card">
          {loading ? (
            <div className="loading">Loading...</div>
          ) : viewMode === 'calendar' ? (
            <Calendar
              selectedDate={selectedDate}
              onSelectDate={setSelectedDate}
              availability={availability}
              bookings={bookings}
            />
          ) : (
            <div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 18, marginBottom: 16 }}>
                Upcoming Availability
              </h3>
              {getUpcomingSlots().length === 0 ? (
                <div className="empty-state">
                  <div className="emoji">📅</div>
                  <p>I'm fully booked right now — check back soon!</p>
                </div>
              ) : (
                getUpcomingSlots().map(slot => {
                  const [y, m, d] = slot.date.split('-').map(Number);
                  const dateObj = new Date(y, m - 1, d);
                  const isSelected = slot.date === selectedDate;
                  const booked = isSlotBookedByDate(slot);
                  const bidCount = getSlotBidCountByDate(slot);

                  return (
                    <div
                      key={slot.id}
                      className={`list-slot ${isSelected ? 'list-slot-selected' : ''} ${booked ? 'list-slot-booked' : ''}`}
                      onClick={() => !booked && setSelectedDate(slot.date)}
                      style={booked ? { cursor: 'default', opacity: 0.6 } : {}}
                    >
                      <div className="list-slot-date">
                        <div className="list-slot-day">{d}</div>
                        <div className="list-slot-month">{MONTHS[m - 1].slice(0, 3)}</div>
                        <div className="list-slot-weekday">{DAYS_FULL[dateObj.getDay()].slice(0, 3)}</div>
                      </div>
                      <div className="list-slot-details">
                        <div className="list-slot-time">
                          {formatTime(slot.start_time)} – {formatTime(slot.end_time)}
                        </div>
                        <div className="list-slot-rate">From £{slot.min_rate}/hr</div>
                        {booked && (
                          <div className="list-slot-status-booked">✅ Booked</div>
                        )}
                        {!booked && bidCount > 0 && (
                          <div className="list-slot-status-bids">🔥 {bidCount} request{bidCount > 1 ? 's' : ''}</div>
                        )}
                      </div>
                      <div className="list-slot-action">
                        {booked ? (
                          <span className="slot-badge booked">Booked</span>
                        ) : (
                          'Select →'
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}
        </div>

        {/* ─── Right: Slot Info + Booking Form ─── */}
        <div className="card">
          {selectedDate ? (
            <div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 18, marginBottom: 4 }}>
                {displayDate}
              </h3>

              {daySlots.length > 0 ? (
                <div>
                  <p style={{ fontSize: 13, color: 'var(--clr-text-muted)', marginBottom: 16 }}>
                    {allSlotsConfirmed
                      ? 'All slots on this date are booked.'
                      : 'Available slots — place your bid to book:'}
                  </p>

                  {/* Slot cards with bid info */}
                  <div style={{ marginBottom: 20 }}>
                    {daySlots.map(slot => {
                      const confirmed = isSlotConfirmed(slot);
                      const bidCount = getBidCount(slot);
                      const highBid = getHighestBid(slot);
                      const bids = getSlotBids(slot);
                      const pendingBids = bids.filter(b => b.status === 'pending');

                      return (
                        <div key={slot.id} className={`slot ${confirmed ? 'slot-booked' : 'slot-open'}`}>
                          <div style={{ flex: 1 }}>
                            <div className="slot-time">{formatTime(slot.start_time)} – {formatTime(slot.end_time)}</div>
                            <div className="slot-rate-from">From <strong>£{slot.min_rate}</strong>/hr</div>

                            {confirmed && (
                              <div className="slot-confirmed-info">
                                ✅ This slot has been booked
                              </div>
                            )}

                            {!confirmed && bidCount > 0 && (
                              <div className="slot-bid-info">
                                🔥 {bidCount} request{bidCount > 1 ? 's' : ''}
                                {highBid && <> · highest £{highBid}/hr</>}
                              </div>
                            )}

                            {/* Show existing pending bids */}
                            {!confirmed && pendingBids.length > 0 && (
                              <div className="slot-bids-list">
                                {pendingBids
                                  .sort((a, b) => parseFloat(b.bid_amount) - parseFloat(a.bid_amount))
                                  .map((bid, i) => (
                                    <div key={bid.id} className="slot-bid-item">
                                      <span className="slot-bid-rank">#{i + 1}</span>
                                      <span className="slot-bid-amount">£{bid.bid_amount}/hr</span>
                                      <span className="slot-bid-time">
                                        {formatTime(bid.start_time)}–{formatTime(bid.end_time)}
                                      </span>
                                    </div>
                                  ))}
                              </div>
                            )}
                          </div>
                          <span className={`slot-badge ${confirmed ? 'booked' : 'open'}`}>
                            {confirmed ? 'Booked' : 'Open'}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  {success && (
                    <div className="success-banner">
                      <div className="emoji">🎉</div>
                      <div className="title">Booking Request Sent!</div>
                      <div className="desc">I'll review your request and get back to you within a few hours.</div>
                      <div style={{ marginTop: 8, fontSize: 12, color: 'var(--clr-text-muted)' }}>
                        Check <Link to="/status" style={{ color: 'var(--clr-primary)' }}>My Bookings</Link> anytime to see the status.
                      </div>
                    </div>
                  )}

                  {/* ─── Booking form (hidden if all slots confirmed) ─── */}
                  {allSlotsConfirmed ? (
                    <div className="empty-state" style={{ padding: '30px 20px' }}>
                      <div className="emoji">🎉</div>
                      <p>All slots on this date are booked</p>
                      <p className="hint">Try another date — green dots show available days.</p>
                    </div>
                  ) : (
                    <>
                      <h4 style={{ fontSize: 14, fontWeight: 700, marginBottom: 4 }}>Choose Your Rate</h4>
                      <p style={{ fontSize: 12, color: 'var(--clr-text-muted)', marginBottom: 12, lineHeight: 1.5 }}>
                        Pick what suits your budget — from £{minRate}/hr. Most requests are accepted!{' '}
                        <Link to="/guides" style={{ color: 'var(--clr-primary)', textDecoration: 'underline' }}>How does it work?</Link>
                      </p>

                      {saved.name && (
                        <div className="repeat-booking-note">
                          👋 Welcome back, {saved.name}! Your details have been filled in.
                        </div>
                      )}

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
                            {startTimeOptions.map(t => (
                              <option key={t.value} value={t.value} disabled={t.booked}>
                                {t.label}{t.booked ? ' (Booked)' : ''}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="form-label">End Time *</label>
                          <select className="form-select" value={form.endTime}
                            onChange={e => update('endTime', e.target.value)}>
                            <option value="">Select</option>
                            {endTimeOptions.map(t => (
                              <option key={t.value} value={t.value} disabled={t.booked}>
                                {t.label}{t.booked ? ' (Booked)' : ''}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div className="form-row form-row-2" style={{ marginBottom: 12 }}>
                        <div>
                          <label className="form-label">Your Rate (£/hr) *</label>
                          <div className="bid-input-wrapper">
                            <span className="bid-currency">£</span>
                            <input
                              className={`form-input bid-input ${bidError ? 'input-error' : ''}`}
                              type="number" step="0.50" min={effectiveMinBid}
                              value={form.bidAmount}
                              onChange={e => update('bidAmount', e.target.value)}
                              placeholder={`${effectiveMinBid.toFixed(2)} min`}
                            />
                          </div>
                          {bidError && <div className="field-error">{bidError}</div>}
                          <div className="bid-hint">
                            {effectiveMinBid > minRate
                              ? `Someone else has requested this slot · Minimum £${effectiveMinBid.toFixed(2)}/hr`
                              : `Minimum £${minRate}/hr · Higher rates are more likely to be confirmed`}
                          </div>
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
                        <label className="form-label">Referral Code</label>
                        <div style={{ display: 'flex', gap: 8 }}>
                          <input className="form-input" value={form.referralCode}
                            onChange={e => { update('referralCode', e.target.value); setReferralValid(null); }}
                            placeholder="e.g. FRIEND10"
                            style={{ flex: 1, textTransform: 'uppercase' }} />
                          <button className="btn btn-outline btn-sm" onClick={checkReferralCode}
                            disabled={!form.referralCode.trim()} type="button">Apply</button>
                        </div>
                        {referralValid === true && (
                          <div className="referral-success">✅ Code applied! {referralDiscount}% discount</div>
                        )}
                        {referralValid === false && (
                          <div className="field-error">Invalid or expired referral code</div>
                        )}
                      </div>

                      <div className="form-group">
                        <label className="form-label">Notes</label>
                        <textarea className="form-textarea" value={form.notes}
                          onChange={e => update('notes', e.target.value)}
                          placeholder="Any special requirements..." />
                      </div>

                      {/* Terms & Conditions */}
                      <div className="terms-checkbox">
                        <label className="terms-label">
                          <input
                            type="checkbox"
                            checked={termsAccepted}
                            onChange={e => setTermsAccepted(e.target.checked)}
                            className="terms-input"
                          />
                          <span>
                            I agree to the{' '}
                            <Link to="/terms" target="_blank" className="terms-link">
                              Terms &amp; Conditions
                            </Link>
                          </span>
                        </label>
                      </div>

                      <button
                        className="btn btn-primary btn-full"
                        disabled={!form.name || !form.startTime || !form.endTime || !form.bidAmount || !hasContact || !termsAccepted || submitting}
                        onClick={handleSubmit}
                      >
                        {submitting ? 'Sending...' : `Request Booking — £${form.bidAmount || '0'}/hr`}
                      </button>
                    </>
                  )}
                </div>
              ) : (
                <div className="empty-state">
                  <div className="emoji">📅</div>
                  <p>I'm not available on this date — try another!</p>
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
