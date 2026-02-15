import { useState } from 'react';
import { signIn } from '../lib/auth';

export default function LoginModal({ onSuccess, onClose }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleLogin(e) {
    e?.preventDefault();
    if (!email || !password) return;
    setLoading(true);
    setError('');
    try {
      const data = await signIn(email, password);
      onSuccess(data.user);
    } catch (err) {
      setError(
        err.message === 'Invalid login credentials'
          ? 'Incorrect email or password.'
          : err.message || 'Login failed. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="card modal auth-modal" onClick={e => e.stopPropagation()}>
        <form onSubmit={handleLogin}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>🔐</div>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 22, marginBottom: 8 }}>
            Admin Login
          </h3>
          <p style={{ color: 'var(--clr-text-muted)', fontSize: 14, marginBottom: 20 }}>
            Sign in to manage your availability and bookings
          </p>

          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              className="form-input"
              type="email"
              value={email}
              onChange={e => { setEmail(e.target.value); setError(''); }}
              placeholder="you@email.com"
              autoFocus
              autoComplete="email"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              className="form-input"
              type="password"
              value={password}
              onChange={e => { setPassword(e.target.value); setError(''); }}
              placeholder="Enter password"
              autoComplete="current-password"
            />
          </div>

          {error && <div className="field-error" style={{ marginBottom: 12 }}>{error}</div>}

          <div className="modal-buttons" style={{ flexDirection: 'column', gap: 8 }}>
            <button
              type="submit"
              className="btn btn-primary btn-full"
              disabled={!email || !password || loading}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
            <button type="button" className="btn btn-outline btn-full btn-sm" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
