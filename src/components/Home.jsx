import { Link } from 'react-router-dom';
import Reviews from './Reviews';

const FEATURES = [
  { icon: '🏠', title: 'In Your Home', desc: 'All sessions take place at your home — your children stay in their own environment' },
  { icon: '🕐', title: 'Flexible Hours', desc: 'Morning, afternoon, and evening slots available to fit your schedule' },
  { icon: '💝', title: 'Experienced Care', desc: 'DBS checked, first aid trained, with years of childcare experience' },
  { icon: '📱', title: 'Easy Booking', desc: 'Pick a date, place your bid, and get a quick response' },
];

const STEPS = [
  { step: '1', label: 'Check Calendar', desc: 'Green dots show available dates' },
  { step: '2', label: 'Place a Bid', desc: 'Choose a slot and offer your hourly rate' },
  { step: '3', label: 'Get Confirmed', desc: 'Best bid wins — you\'ll know quickly!' },
];

export default function Home() {
  return (
    <div>
      {/* Hero */}
      <div className="hero">
        <span className="hero-star">⭐</span>
        <h1>Little Stars<br />Babysitting</h1>
        <p>
          Trusted in-home childcare in Peterborough with flexible scheduling.
          I come to you so your children stay comfortable. Browse available dates,
          place your bid, and secure the slot that works for your family.
        </p>
        <div className="hero-buttons">
          <Link to="/book" className="btn btn-primary">Book Now</Link>
          <Link to="/about" className="btn btn-outline">About Me</Link>
        </div>
      </div>

      {/* Features */}
      <div className="features-grid">
        {FEATURES.map(f => (
          <div key={f.title} className="card feature-card">
            <div className="feature-icon">{f.icon}</div>
            <h3>{f.title}</h3>
            <p>{f.desc}</p>
          </div>
        ))}
      </div>

      {/* How It Works */}
      <div className="how-it-works">
        <h2 className="section-title">How It Works</h2>
        <div className="steps-grid">
          {STEPS.map(s => (
            <div key={s.step} className="step-card">
              <div className="step-number">{s.step}</div>
              <h3>{s.label}</h3>
              <p>{s.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Reviews */}
      <Reviews />

      {/* CTA */}
      <div className="cta-section">
        <h2>Ready to Book?</h2>
        <p>Check my availability and secure your slot today.</p>
        <div className="hero-buttons">
          <Link to="/book" className="btn btn-primary">View Calendar</Link>
          <Link to="/status" className="btn btn-outline">Check Booking Status</Link>
        </div>
        <Link to="/guides" className="cta-help-link">📖 New here? Read our booking guides</Link>
      </div>
    </div>
  );
}
