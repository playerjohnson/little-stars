import { useState } from 'react';
import { ADMIN_PIN } from '../lib/utils';

export default function LoginModal({ onSuccess, onClose }) {
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);

  function handleSubmit() {
    if (pin === ADMIN_PIN) {
      onSuccess();
    } else {
      setError(true);
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="card modal" onClick={e => e.stopPropagation()}>
        <div style={{ fontSize: 40, marginBottom: 12 }}>🔐</div>
        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 22, marginBottom: 8 }}>
          Admin Login
        </h3>
        <p style={{ color: 'var(--clr-text-muted)', fontSize: 14, marginBottom: 20 }}>
          Enter your PIN to manage availability
        </p>
        <input
          type="password"
          className="form-input"
          value={pin}
          onChange={e => { setPin(e.target.value); setError(false); }}
          onKeyDown={e => e.key === 'Enter' && handleSubmit()}
          placeholder="Enter PIN"
          style={{ textAlign: 'center', fontSize: 24, letterSpacing: 8, marginBottom: 8 }}
          maxLength={6}
          autoFocus
        />
        {error && (
          <p style={{ color: 'var(--clr-danger)', fontSize: 13, margin: '4px 0 8px' }}>
            Incorrect PIN. Try again.
          </p>
        )}
        <p style={{ color: 'var(--clr-text-faint)', fontSize: 12, marginBottom: 16 }}>
          Default PIN: 1234
        </p>
        <div className="modal-buttons">
          <button className="btn btn-outline btn-sm" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary btn-sm" onClick={handleSubmit}>Login</button>
        </div>
      </div>
    </div>
  );
}
