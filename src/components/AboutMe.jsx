import { Link } from 'react-router-dom';
import Reviews from './Reviews';

export default function AboutMe() {
  return (
    <div>
      <div className="about-hero card">
        <div className="about-avatar">⭐</div>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 30, marginBottom: 8 }}>
          Meet Naomi
        </h1>
        <p className="about-tagline">
          Hi! I'm Naomi, your local Peterborough babysitter. I love looking after little ones
          and making sure they have the best time while you're away.
        </p>
      </div>

      <div className="about-grid">
        <div className="card">
          <h3 className="about-section-title">👋 A Bit About Me</h3>
          <p className="about-text">
            I've been babysitting for families across Peterborough for years, and
            I genuinely love what I do. I come to your home so your little ones can
            stay in a familiar, comfortable environment — no upheaval, no stress.
            I'm patient, reliable, and I always make sure children feel safe, happy,
            and entertained. Whether it's a date night, a work commitment, or just
            some well-deserved time for yourself — I've got you covered.
          </p>
        </div>

        <div className="card">
          <h3 className="about-section-title">🎨 What Your Little Ones Can Expect</h3>
          <p className="about-text">
            Every session is different because every child is different! Here are some
            of the things I love doing:
          </p>
          <div className="about-badges">
            <div className="about-badge">
              <span className="about-badge-icon">🎨</span>
              <div>
                <div className="about-badge-title">Arts & Crafts</div>
                <div className="about-badge-desc">Painting, drawing, collages, and messy play</div>
              </div>
            </div>
            <div className="about-badge">
              <span className="about-badge-icon">🗺️</span>
              <div>
                <div className="about-badge-title">Treasure Hunts</div>
                <div className="about-badge-desc">Indoor and outdoor adventures around the house and garden</div>
              </div>
            </div>
            <div className="about-badge">
              <span className="about-badge-icon">📚</span>
              <div>
                <div className="about-badge-title">Stories & Bedtime</div>
                <div className="about-badge-desc">Favourite books, made-up stories, and calm wind-down routines</div>
              </div>
            </div>
            <div className="about-badge">
              <span className="about-badge-icon">🏃</span>
              <div>
                <div className="about-badge-title">Games & Outdoor Play</div>
                <div className="about-badge-desc">Board games, garden games, and imaginative play</div>
              </div>
            </div>
            <div className="about-badge">
              <span className="about-badge-icon">🧁</span>
              <div>
                <div className="about-badge-title">Simple Cooking</div>
                <div className="about-badge-desc">Baking, decorating, and making easy snacks together</div>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <h3 className="about-section-title">📋 Qualifications & Safety</h3>
          <div className="about-badges">
            <div className="about-badge">
              <span className="about-badge-icon">🏠</span>
              <div>
                <div className="about-badge-title">In-Home Service</div>
                <div className="about-badge-desc">All sessions at your home</div>
              </div>
            </div>
            <div className="about-badge">
              <span className="about-badge-icon">🏥</span>
              <div>
                <div className="about-badge-title">First Aid Trained</div>
                <div className="about-badge-desc">Paediatric first aid certified</div>
              </div>
            </div>
            <div className="about-badge">
              <span className="about-badge-icon">✅</span>
              <div>
                <div className="about-badge-title">DBS Checked</div>
                <div className="about-badge-desc">Enhanced disclosure available on request</div>
              </div>
            </div>
            <div className="about-badge">
              <span className="about-badge-icon">🕐</span>
              <div>
                <div className="about-badge-title">Experienced</div>
                <div className="about-badge-desc">Regular babysitting for families across Peterborough</div>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <h3 className="about-section-title">💷 Pricing</h3>
          <p className="about-text">
            My rates start from <strong>£12/hr</strong>. I use a simple bidding system —
            you choose what works for your budget (at or above the minimum) and I'll
            confirm within a few hours. Most bids are accepted! It keeps things fair
            and flexible for everyone.
          </p>
          <Link to="/book" className="btn btn-primary btn-sm" style={{ marginTop: 12 }}>
            View Available Dates →
          </Link>
        </div>

        <div className="card">
          <h3 className="about-section-title">📞 Get in Touch</h3>
          <p className="about-text">
            Got a question before booking? Drop me a message on WhatsApp or submit
            a booking request through the calendar. I usually get back to you within
            a couple of hours.
          </p>
        </div>
      </div>

      <Reviews />
    </div>
  );
}
