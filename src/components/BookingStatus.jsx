import { useState } from 'react';
import { getBookingsByEmail, cancelBooking } from '../lib/supabase';
import { formatTime, MONTHS, timeToMinutes } from '../lib/utils';

function getCancellationTier(booking) {
  // Calculate hours until booking starts
  const [y, m, d] = booking.date.split('-').map(Number);
  const [hh, mm] = booking.start_time.split(':').map(Number);
  const bookingStart = new Date(y, m - 1, d, hh, mm);
  const now = new Date();
  const hoursUntil = (bookingStart - now) / (1000 * 60 * 60);

  // Calculate duration in hours
  const durationMins = timeToMinutes(booking.end_time) - timeToMinutes(booking.start_time);
  const durationHours = durationMins / 60;
  const hourlyRate = parseFloat(booking.bid_amount) || 0;
  const totalValue = hourlyRate * durationHours;

  if (hoursUntil > 24) {
    return {
      tier: 'free',
      label: 'More than 24 hours notice',
      icon: '✅',
      color: 'var(--clr-success)',
      message: 'No cancellation charge applies. You\'re cancelling with plenty of notice.',
      fee: 0,
      totalValue,
      durationHours,
      hoursUntil: Math.round(hoursUntil),
    };
  } else if (hoursUntil >= 12) {
    const fee = Math.round(totalValue * 0.5 * 100) / 100;
    return {
      tier: '50%',
      label: '12–24 hours notice',
      icon: '⚠️',
      color: 'var(--clr-warning)',
      message: 'A 50% cancellation charge applies as the booking is within 24 hours.',
      fee,
      totalValue,
      durationHours,
      hoursUntil: Math.round(hoursUntil),
    };
  } else {
    return {
      tier: 'full',
      label: 'Less than 12 hours notice',
      icon: '🚫',
      color: 'var(--clr-danger)',
      message: 'The full booking amount applies as a cancellation charge. It\'s too late to fill this slot.',
      fee: Math.round(totalValue * 100) / 100,
      totalValue,
      durationHours,
      hoursUntil: Math.max(0, Math.round(hoursUntil)),
    };
  }
}

export default function BookingStatus() {
  const [email, setEmail] = useState('');
  const [bookings, setBookings] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [cancelModal, setCancelModal] = useState(null); // { booking, tier } or null
  const [cancelling, setCancelling] = useState(false);
  const [cancelSuccess, setCancelSuccess] = useState(null); // booking id

  async function handleSearch(e) {
    e?.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    setError('');
    try {
      const results = await getBookingsByEmail(email.trim());
      setBookings(results);
    } catch (err) {
      setError('Unable to check bookings. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  function handleCancelClick(booking) {
    if (booking.status === 'pending') {
      // Pending bids — cancel freely, but confirm
      setCancelModal({
        booking,
        tier: {
          tier: 'free',
          label: 'Withdraw Bid',
          icon: '👋',
          color: 'var(--clr-text-muted)',
          message: 'Your bid hasn\'t been confirmed yet, so there\'s no cancellation charge. You can always place a new bid later.',
          fee: 0,
          isPending: true,
        },
      });
    } else if (booking.status === 'confirmed') {
      // Confirmed — apply cancellation policy
      const tier = getCancellationTier(booking);
      setCancelModal({ booking, tier });
    }
  }

  async function handleConfirmCancel() {
    if (!cancelModal) return;
    setCancelling(true);
    try {
      const { booking, tier } = cancelModal;
      await cancelBooking(booking.id, {
        tier: tier.tier,
        fee: tier.fee,
        cancelledAt: new Date().toISOString(),
      });
      setCancelSuccess(booking.id);
      setCancelModal(null);
      // Refresh bookings
      const results = await getBookingsByEmail(email.trim());
      setBookings(results);
      setTimeout(() => setCancelSuccess(null), 5000);
    } catch (err) {
      setError('Failed to cancel booking. Please try again.');
      console.error(err);
    } finally {
      setCancelling(false);
    }
  }

  function statusInfo(status) {
    switch (status) {
      case 'pending': return { label: 'Pending', emoji: '⏳', color: 'var(--clr-warning)', desc: 'Your bid is being reviewed.' };
      case 'confirmed': return { label: 'Confirmed', emoji: '✅', color: 'var(--clr-success)', desc: 'Your booking is confirmed!' };
      case 'declined': return { label: 'Declined', emoji: '❌', color: 'var(--clr-danger)', desc: 'Another bid was accepted.' };
      case 'cancelled': return { label: 'Cancelled', emoji: '🚫', color: 'var(--clr-text-faint)', desc: '' };
      default: return { label: status, emoji: '❓', color: 'var(--clr-text-muted)', desc: '' };
    }
  }

  function canCancel(booking) {
    return booking.status === 'pending' || booking.status === 'confirmed';
  }

  function isInPast(booking) {
    const [y, m, d] = booking.date.split('-').map(Number);
    const [hh, mm] = booking.end_time.split(':').map(Number);
    return new Date(y, m - 1, d, hh, mm) < new Date();
  }

  return (
    <div>
      <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 30, marginBottom: 8 }}>
        Check Booking Status
      </h2>
      <p style={{ color: 'var(--clr-text-muted)', fontSize: 14, marginBottom: 24 }}>
        Enter the email address you used when placing your bid.
      </p>

      <div className="card" style={{ maxWidth: 500 }}>
        <form onSubmit={handleSearch}>
          <div className="form-group">
            <label className="form-label">Your Email</label>
            <input
              className="form-input"
              type="email"
              value={email}
              onChange={e => { setEmail(e.target.value); setError(''); }}
              placeholder="jane@email.com"
            />
          </div>
          {error && <div className="field-error" style={{ marginBottom: 12 }}>{error}</div>}
          <button
            type="submit"
            className="btn btn-primary btn-full"
            disabled={!email.trim() || loading}
          >
            {loading ? 'Checking...' : 'Check My Bookings'}
          </button>
        </form>
      </div>

      {cancelSuccess && (
        <div className="success-banner" style={{ marginTop: 16 }}>
          <div className="emoji">✅</div>
          <div className="title">Booking Cancelled</div>
          <div className="desc">Your cancellation has been processed.</div>
        </div>
      )}

      {bookings !== null && (
        <div style={{ marginTop: 24 }}>
          {bookings.length === 0 ? (
            <div className="card empty-state">
              <div className="emoji">🔍</div>
              <p>No bookings found for this email</p>
              <p className="hint">Make sure you're using the same email you booked with.</p>
            </div>
          ) : (
            <div>
              <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 12 }}>
                Found {bookings.length} booking{bookings.length !== 1 ? 's' : ''}
              </h3>
              {bookings.map(b => {
                const info = statusInfo(b.status);
                const [y, m, d] = b.date.split('-').map(Number);
                const past = isInPast(b);
                const showCancel = canCancel(b) && !past;

                return (
                  <div key={b.id} className="card status-card">
                    <div className="status-card-header">
                      <div>
                        <div style={{ fontWeight: 700, fontSize: 15 }}>
                          {d} {MONTHS[m - 1]} {y}
                        </div>
                        <div style={{ fontSize: 13, color: 'var(--clr-text-muted)' }}>
                          {formatTime(b.start_time)} – {formatTime(b.end_time)} · {b.num_children} child{b.num_children > 1 ? 'ren' : ''}
                        </div>
                        {b.bid_amount && (
                          <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--clr-success)', marginTop: 4 }}>
                            Bid: £{b.bid_amount}/hr
                          </div>
                        )}
                      </div>
                      <div className="status-badge-large" style={{ color: info.color }}>
                        <span style={{ fontSize: 24 }}>{info.emoji}</span>
                        <div style={{ fontSize: 13, fontWeight: 700 }}>{info.label}</div>
                      </div>
                    </div>

                    <div style={{ fontSize: 13, color: 'var(--clr-text-muted)', marginTop: 8 }}>
                      {info.desc}
                    </div>

                    {/* Cancellation info for already-cancelled bookings */}
                    {b.status === 'cancelled' && (
                      <div className={`cancel-info-badge ${b.cancellation_tier === 'admin' ? 'cancel-info-admin' : ''}`}>
                        {b.cancellation_tier === 'admin' ? (
                          <>
                            <div style={{ fontWeight: 600, color: 'var(--clr-danger)', marginBottom: 4 }}>
                              ⚠️ Cancelled by babysitter
                            </div>
                            {b.admin_cancel_reason && (
                              <div style={{ fontStyle: 'italic', marginBottom: 4 }}>
                                "{b.admin_cancel_reason}"
                              </div>
                            )}
                            <div style={{ fontSize: 11, color: 'var(--clr-text-faint)' }}>
                              No charge applies · Please rebook for another date
                            </div>
                          </>
                        ) : b.cancellation_tier ? (
                          b.cancellation_fee > 0 ? (
                            <span>Cancellation fee: <strong>£{parseFloat(b.cancellation_fee).toFixed(2)}</strong> ({b.cancellation_tier})</span>
                          ) : (
                            <span>Cancelled by you — no charge</span>
                          )
                        ) : (
                          <span>This booking was cancelled.</span>
                        )}
                      </div>
                    )}

                    {/* Cancel button */}
                    {showCancel && (
                      <button
                        className="btn btn-danger-outline btn-sm"
                        style={{ marginTop: 12, width: '100%' }}
                        onClick={() => handleCancelClick(b)}
                      >
                        {b.status === 'pending' ? 'Withdraw Bid' : 'Cancel Booking'}
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ─── Cancellation Modal ─── */}
      {cancelModal && (
        <div className="modal-overlay" onClick={() => !cancelling && setCancelModal(null)}>
          <div className="modal cancel-modal" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => !cancelling && setCancelModal(null)}>×</button>

            <div className="cancel-modal-header">
              <span style={{ fontSize: 36 }}>{cancelModal.tier.icon}</span>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 22, marginTop: 8 }}>
                {cancelModal.tier.isPending ? 'Withdraw Bid?' : 'Cancel Booking?'}
              </h3>
            </div>

            {/* Booking summary */}
            <div className="cancel-booking-summary">
              <div style={{ fontWeight: 700 }}>
                {(() => {
                  const [y, m, d] = cancelModal.booking.date.split('-').map(Number);
                  return `${d} ${MONTHS[m - 1]} ${y}`;
                })()}
              </div>
              <div style={{ fontSize: 13, color: 'var(--clr-text-muted)' }}>
                {formatTime(cancelModal.booking.start_time)} – {formatTime(cancelModal.booking.end_time)}
                {cancelModal.booking.bid_amount && ` · £${cancelModal.booking.bid_amount}/hr`}
              </div>
            </div>

            {/* Policy tier */}
            {!cancelModal.tier.isPending && (
              <div
                className="cancel-policy-tier"
                style={{ borderLeftColor: cancelModal.tier.color }}
              >
                <div className="cancel-policy-label" style={{ color: cancelModal.tier.color }}>
                  {cancelModal.tier.label}
                </div>
                <div className="cancel-policy-hours">
                  {cancelModal.tier.hoursUntil > 0
                    ? `Your booking starts in approximately ${cancelModal.tier.hoursUntil} hours`
                    : 'Your booking starts very soon'}
                </div>
              </div>
            )}

            <p className="cancel-message">{cancelModal.tier.message}</p>

            {/* Fee breakdown */}
            {!cancelModal.tier.isPending && cancelModal.tier.fee > 0 && (
              <div className="cancel-fee-box">
                <div className="cancel-fee-row">
                  <span>Booking value</span>
                  <span>£{cancelModal.tier.totalValue.toFixed(2)}</span>
                </div>
                <div className="cancel-fee-row">
                  <span>Cancellation charge ({cancelModal.tier.tier === '50%' ? '50%' : '100%'})</span>
                  <span style={{ fontWeight: 700, color: 'var(--clr-danger)' }}>
                    £{cancelModal.tier.fee.toFixed(2)}
                  </span>
                </div>
              </div>
            )}

            {!cancelModal.tier.isPending && cancelModal.tier.fee === 0 && (
              <div className="cancel-fee-box cancel-fee-free">
                <div className="cancel-fee-row">
                  <span>Cancellation charge</span>
                  <span style={{ fontWeight: 700, color: 'var(--clr-success)' }}>£0.00 — Free</span>
                </div>
              </div>
            )}

            {/* Action buttons */}
            <div className="cancel-actions">
              <button
                className="btn btn-danger-outline btn-full"
                onClick={handleConfirmCancel}
                disabled={cancelling}
              >
                {cancelling
                  ? 'Cancelling...'
                  : cancelModal.tier.isPending
                    ? 'Yes, Withdraw My Bid'
                    : cancelModal.tier.fee > 0
                      ? `Accept & Cancel (£${cancelModal.tier.fee.toFixed(2)} charge)`
                      : 'Yes, Cancel Booking'}
              </button>
              <button
                className="btn btn-outline btn-full"
                onClick={() => setCancelModal(null)}
                disabled={cancelling}
              >
                Keep My Booking
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
