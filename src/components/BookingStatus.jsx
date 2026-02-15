import { useState } from 'react';
import { getBookingsByEmail } from '../lib/supabase';
import { formatTime, MONTHS } from '../lib/utils';

export default function BookingStatus() {
  const [email, setEmail] = useState('');
  const [bookings, setBookings] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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

  function statusInfo(status) {
    switch (status) {
      case 'pending': return { label: 'Pending', emoji: '⏳', color: 'var(--clr-warning)', desc: 'Your bid is being reviewed.' };
      case 'confirmed': return { label: 'Confirmed', emoji: '✅', color: 'var(--clr-success)', desc: 'Your booking is confirmed!' };
      case 'declined': return { label: 'Declined', emoji: '❌', color: 'var(--clr-danger)', desc: 'Another bid was accepted.' };
      case 'cancelled': return { label: 'Cancelled', emoji: '🚫', color: 'var(--clr-text-faint)', desc: 'This booking was cancelled.' };
      default: return { label: status, emoji: '❓', color: 'var(--clr-text-muted)', desc: '' };
    }
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
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
