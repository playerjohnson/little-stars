import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Reviews from './Reviews';
import { getVisibleReviews } from '../lib/supabase';

const FEATURES = [
  { icon: '🏠', title: 'In Your Home', desc: 'I come to you — your little ones stay in their own environment, happy and comfortable' },
  { icon: '🕐', title: 'Flexible Hours', desc: 'Morning, afternoon, and evening slots available to fit around your life' },
  { icon: '💝', title: 'Safe & Experienced', desc: 'DBS checked, paediatric first aid trained, with years of hands-on childcare experience' },
  { icon: '📱', title: 'Easy Booking', desc: 'Pick a date, choose your budget, and I\'ll get back to you within a few hours' },
];

const STEPS = [
  { step: '1', label: 'Check the Calendar', desc: 'Green dots show the dates I\'m available' },
  { step: '2', label: 'Place Your Bid', desc: 'Choose a slot and offer what suits your budget — from £12/hr' },
  { step: '3', label: 'Get Confirmed', desc: 'I\'ll review your bid and confirm — most are accepted!' },
];

export default function Home() {
  const [reviewStats, setReviewStats] = useState(null);

  useEffect(() => {
    getVisibleReviews().then(reviews => {
      if (reviews && reviews.length > 0) {
        const avg = (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1);
        setReviewStats({ count: reviews.length, avg });
      }
    }).catch(() => {});
  }, []);

  return (
    <div>
      {/* Hero */}
      <div className="hero">
        <span className="hero-star">⭐</span>
        <h1>Hi, I'm Naomi!</h1>
        <p>
          I'm a Peterborough babysitter who comes to your home so your little ones
          stay happy and comfortable. Browse my available dates, pick what suits
          your budget, and I'll take care of the rest.
        </p>
        {reviewStats && (
          <p className="hero-trust">
            Trusted by Peterborough families · ⭐ {reviewStats.avg} from {reviewStats.count} review{reviewStats.count !== 1 ? 's' : ''}
          </p>
        )}
        <div className="hero-buttons">
          <Link to="/book" className="btn btn-primary">Book Naomi</Link>
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
        <p>Check my available dates and secure your slot — I'd love to look after your little ones.</p>
        <div className="hero-buttons">
          <Link to="/book" className="btn btn-primary">View Calendar</Link>
          <Link to="/status" className="btn btn-outline">Check Booking Status</Link>
        </div>
        <Link to="/guides" className="cta-help-link">📖 New here? Read the booking guides</Link>
      </div>
    </div>
  );
}
