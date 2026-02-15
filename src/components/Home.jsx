import { useNavigate } from 'react-router-dom';

const FEATURES = [
  { icon: '🕐', title: 'Flexible Hours', desc: 'Morning, afternoon, and evening slots available to fit your schedule' },
  { icon: '💝', title: 'Experienced Care', desc: 'Trained in first aid with years of childcare experience' },
  { icon: '📱', title: 'Easy Booking', desc: 'Pick a date, choose a time slot, and book in seconds' },
  { icon: '💷', title: 'Fair Rates', desc: 'Transparent hourly pricing with no hidden fees' },
];

const STEPS = [
  { step: '1', label: 'Check Calendar', desc: 'Green dots show available dates' },
  { step: '2', label: 'Pick a Slot', desc: 'Choose a time that works for you' },
  { step: '3', label: 'Book & Confirm', desc: 'Fill in your details and you\'re set!' },
];

export default function Home() {
  const navigate = useNavigate();

  return (
    <div>
      <div className="hero">
        <div className="hero-emoji">👶✨</div>
        <h1>Caring, Reliable<br />Babysitting</h1>
        <p>
          Trusted childcare with flexible scheduling. Check my availability
          and book a session that works for your family.
        </p>
        <div className="hero-buttons">
          <button className="btn btn-primary" onClick={() => navigate('/book')}>
            Book a Session →
          </button>
          <button className="btn btn-outline" onClick={() => navigate('/book')}>
            View Availability
          </button>
        </div>
      </div>

      <div className="features-grid">
        {FEATURES.map((f, i) => (
          <div key={i} className="card feature-card">
            <div className="feature-icon">{f.icon}</div>
            <h3>{f.title}</h3>
            <p>{f.desc}</p>
          </div>
        ))}
      </div>

      <div className="card" style={{ padding: 36, textAlign: 'center' }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 28, marginBottom: 24 }}>
          How It Works
        </h2>
        <div className="steps">
          {STEPS.map((s, i) => (
            <div key={i} className="step">
              <div className="step-number">{s.step}</div>
              <div className="step-title">{s.label}</div>
              <div className="step-desc">{s.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
