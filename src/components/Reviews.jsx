import { useState, useEffect } from 'react';
import { getVisibleReviews } from '../lib/supabase';

function Stars({ rating }) {
  return (
    <span className="review-stars">
      {[1, 2, 3, 4, 5].map(i => (
        <span key={i} className={i <= rating ? 'star-filled' : 'star-empty'}>★</span>
      ))}
    </span>
  );
}

export default function Reviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getVisibleReviews()
      .then(setReviews)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading || reviews.length === 0) return null;

  const avg = (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1);

  return (
    <section className="reviews-section">
      <h2 className="section-title">What Parents Say</h2>
      <div className="reviews-summary">
        <span className="reviews-avg">{avg}</span>
        <Stars rating={Math.round(avg)} />
        <span className="reviews-count">from {reviews.length} review{reviews.length !== 1 ? 's' : ''}</span>
      </div>
      <div className="reviews-grid">
        {reviews.slice(0, 6).map(r => (
          <div key={r.id} className="review-card card">
            <Stars rating={r.rating} />
            <p className="review-text">"{r.review_text}"</p>
            <div className="review-author">— {r.parent_name}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
