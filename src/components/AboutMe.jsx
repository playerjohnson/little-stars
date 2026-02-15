import { Link } from 'react-router-dom';
import Reviews from './Reviews';

export default function AboutMe() {
  return (
    <div>
      <div className="about-hero card">
        <div className="about-avatar">⭐</div>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 30, marginBottom: 8 }}>
          About Me
        </h1>
        <p className="about-tagline">
          Hi! I'm your local Peterborough babysitter, and I love looking after little ones.
        </p>
      </div>

      <div className="about-grid">
        <div className="card">
          <h3 className="about-section-title">👋 A Bit About Me</h3>
          <p className="about-text">
            I'm a friendly, reliable babysitter with a real passion for childcare.
            I come to your home so your children can stay in a familiar, comfortable
            environment. I love keeping children entertained with creative activities,
            games, and storytelling. Every child is different, and I always make sure
            they feel safe, happy, and have lots of fun!
          </p>
        </div>

        <div className="card">
          <h3 className="about-section-title">📋 Qualifications & Experience</h3>
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
                <div className="about-badge-desc">Enhanced disclosure available</div>
              </div>
            </div>
            <div className="about-badge">
              <span className="about-badge-icon">🕐</span>
              <div>
                <div className="about-badge-title">Experienced</div>
                <div className="about-badge-desc">Regular babysitting for local families</div>
              </div>
            </div>
            <div className="about-badge">
              <span className="about-badge-icon">🎨</span>
              <div>
                <div className="about-badge-title">Activity Focused</div>
                <div className="about-badge-desc">Crafts, games, stories & outdoor play</div>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <h3 className="about-section-title">💷 Pricing</h3>
          <p className="about-text">
            My rates start from <strong>£12/hr</strong> and I use a bidding system —
            you choose what you'd like to pay (at or above the minimum) and I'll
            confirm the best offer. This keeps things fair and flexible for everyone.
          </p>
          <Link to="/book" className="btn btn-primary btn-sm" style={{ marginTop: 12 }}>
            View Available Dates →
          </Link>
        </div>

        <div className="card">
          <h3 className="about-section-title">📞 Get in Touch</h3>
          <p className="about-text">
            Got a question before booking? Feel free to reach out via WhatsApp
            or submit a booking request through the calendar. I usually respond
            within a few hours.
          </p>
        </div>
      </div>

      <Reviews />
    </div>
  );
}
