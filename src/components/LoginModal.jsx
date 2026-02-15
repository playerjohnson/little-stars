import { useState } from 'react';
import { signIn, signUp } from '../lib/auth';

export default function LoginModal({ onSuccess, onClose }) {
  const [mode, setMode] = useState('login'); // 'login' or 'setup'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [setupSuccess, setSetupSuccess] = useState(false);

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

  async function handleSetup(e) {
    e?.preventDefault();
    if (!email || !password || !confirmPassword) return;

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    setError('');
    try {
      await signUp(email, password);
      setSetupSuccess(true);
    } catch (err) {
      setError(err.message || 'Setup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="card modal auth-modal" onClick={e => e.stopPropagation()}>

        {setupSuccess ? (
          <div>
            <div style={{ fontSize: 40, marginBottom: 12 }}>✅</div>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 22, marginBottom: 8 }}>
              Account Created!
            </h3>
            <p style={{ color: 'var(--clr-text-muted)', fontSize: 14, marginBottom: 8 }}>
              Check your email for a confirmation link, then come back and log in.
            </p>
            <p style={{ color: 'var(--clr-text-faint)', fontSize: 12, marginBottom: 20 }}>
              If you don't see it, check your spam folder.
            </p>
            <button className="btn btn-primary btn-sm" onClick={() => { setSetupSuccess(false); setMode('login'); setPassword(''); setConfirmPassword(''); }}>
              Go to Login
            </button>
          </div>
        ) : mode === 'login' ? (
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

            <div style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid var(--clr-border)' }}>
              <p style={{ color: 'var(--clr-text-faint)', fontSize: 12, marginBottom: 8 }}>
                First time? Set up your admin account:
              </p>
              <button
                type="button"
                className="auth-link-btn"
                onClick={() => { setMode('setup'); setError(''); setPassword(''); }}
              >
                Create Admin Account →
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleSetup}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>✨</div>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 22, marginBottom: 8 }}>
              Create Admin Account
            </h3>
            <p style={{ color: 'var(--clr-text-muted)', fontSize: 14, marginBottom: 20 }}>
              Set up your login to manage Little Stars
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
                placeholder="Min 6 characters"
                autoComplete="new-password"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Confirm Password</label>
              <input
                className="form-input"
                type="password"
                value={confirmPassword}
                onChange={e => { setConfirmPassword(e.target.value); setError(''); }}
                placeholder="Re-enter password"
                autoComplete="new-password"
              />
            </div>

            {error && <div className="field-error" style={{ marginBottom: 12 }}>{error}</div>}

            <div className="modal-buttons" style={{ flexDirection: 'column', gap: 8 }}>
              <button
                type="submit"
                className="btn btn-primary btn-full"
                disabled={!email || !password || !confirmPassword || loading}
              >
                {loading ? 'Creating account...' : 'Create Account'}
              </button>
              <button
                type="button"
                className="auth-link-btn"
                onClick={() => { setMode('login'); setError(''); setPassword(''); setConfirmPassword(''); }}
              >
                ← Back to Login
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
