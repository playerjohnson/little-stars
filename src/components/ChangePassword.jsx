import { useState } from 'react';
import { updatePassword } from '../lib/auth';

export default function ChangePassword() {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  async function handleSubmit(e) {
    e?.preventDefault();

    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }
    if (!/[A-Z]/.test(newPassword) || !/[a-z]/.test(newPassword) || !/[0-9]/.test(newPassword)) {
      setError('Password must include uppercase, lowercase, and a number.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    setError('');
    try {
      await updatePassword(newPassword);
      setSuccess(true);
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => { setSuccess(false); setOpen(false); }, 3000);
    } catch (err) {
      setError(err.message || 'Failed to update password.');
    } finally {
      setLoading(false);
    }
  }

  if (!open) {
    return (
      <button
        className="btn btn-outline btn-sm"
        onClick={() => setOpen(true)}
        style={{ marginRight: 8 }}
      >
        🔑 Change Password
      </button>
    );
  }

  return (
    <div className="card" style={{ marginBottom: 24 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 18 }}>Change Password</h3>
        <button
          className="admin-slot-remove"
          onClick={() => { setOpen(false); setError(''); setNewPassword(''); setConfirmPassword(''); }}
          style={{ fontSize: 22 }}
        >
          ×
        </button>
      </div>

      {success ? (
        <div className="success-banner">
          <div className="emoji">🔒</div>
          <div className="title">Password Updated!</div>
          <div className="desc">Your new password is now active.</div>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="form-row form-row-2" style={{ marginBottom: 12 }}>
            <div>
              <label className="form-label">New Password</label>
              <input
                className="form-input"
                type="password"
                value={newPassword}
                onChange={e => { setNewPassword(e.target.value); setError(''); }}
                placeholder="Min 6 characters"
                autoComplete="new-password"
              />
            </div>
            <div>
              <label className="form-label">Confirm</label>
              <input
                className="form-input"
                type="password"
                value={confirmPassword}
                onChange={e => { setConfirmPassword(e.target.value); setError(''); }}
                placeholder="Re-enter password"
                autoComplete="new-password"
              />
            </div>
          </div>

          {error && <div className="field-error" style={{ marginBottom: 12 }}>{error}</div>}

          <button
            type="submit"
            className="btn btn-primary btn-sm"
            disabled={!newPassword || !confirmPassword || loading}
          >
            {loading ? 'Updating...' : 'Update Password'}
          </button>
        </form>
      )}
    </div>
  );
}
