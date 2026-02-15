export default function CancellationPolicy() {
  return (
    <div className="card" style={{ maxWidth: 700, margin: '0 auto' }}>
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 30, marginBottom: 8 }}>
        Cancellation Policy
      </h1>
      <p style={{ color: 'var(--clr-text-faint)', fontSize: 13, marginBottom: 24 }}>
        Please read before booking
      </p>

      <div className="policy-content">
        <div className="policy-tier policy-tier-green">
          <div className="policy-tier-header">
            <span className="policy-tier-icon">✅</span>
            <div>
              <h3>More than 24 hours notice</h3>
              <p className="policy-tier-result">Full refund / No charge</p>
            </div>
          </div>
          <p>Cancel with more than 24 hours notice and there's no charge at all. Life happens!</p>
        </div>

        <div className="policy-tier policy-tier-amber">
          <div className="policy-tier-header">
            <span className="policy-tier-icon">⚠️</span>
            <div>
              <h3>12–24 hours notice</h3>
              <p className="policy-tier-result">50% of the agreed rate</p>
            </div>
          </div>
          <p>Cancellations within 24 hours are charged at 50% of the agreed hourly rate for the booked duration, as I may have turned down other bookings for this slot.</p>
        </div>

        <div className="policy-tier policy-tier-red">
          <div className="policy-tier-header">
            <span className="policy-tier-icon">🚫</span>
            <div>
              <h3>Less than 12 hours / No-show</h3>
              <p className="policy-tier-result">Full charge</p>
            </div>
          </div>
          <p>Very late cancellations or no-shows are charged at the full agreed rate. This is because I've reserved this time and it's too late to fill the slot.</p>
        </div>

        <div className="policy-note">
          <h3>📝 How to Cancel</h3>
          <p>
            To cancel a booking, please contact me directly by phone or WhatsApp as soon as you know.
            The cancellation time is based on when I receive your message, not when you send it.
          </p>
        </div>

        <div className="policy-note">
          <h3>🔄 Changes & Rescheduling</h3>
          <p>
            Need to change the time or date? No problem — just let me know with at least 24 hours
            notice and I'll do my best to accommodate. Changes are subject to availability.
          </p>
        </div>

        <div className="policy-note">
          <h3>🙋 My Cancellations</h3>
          <p>
            In the rare event that I need to cancel, I'll give you as much notice as possible
            and you won't be charged anything. I understand how important reliable childcare is.
          </p>
        </div>
      </div>
    </div>
  );
}
