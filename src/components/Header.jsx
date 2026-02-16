import { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';

export default function Header({ isAdmin, onLoginClick, onLogout }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  // Close menu on navigation
  useEffect(() => { setMenuOpen(false); }, [location.pathname]);

  return (
    <header className="header">
      <div className="header-inner">
        <NavLink to="/" className="logo">
          <span className="logo-star">⭐</span>
          <span className="logo-text">Little Stars</span>
          <span className="logo-sub">Babysitting by Naomi</span>
        </NavLink>

        <button
          className={`hamburger ${menuOpen ? 'open' : ''}`}
          onClick={() => setMenuOpen(v => !v)}
          aria-label="Toggle menu"
        >
          <span /><span /><span />
        </button>

        <nav className={`nav ${menuOpen ? 'nav-open' : ''}`}>
          <NavLink to="/" end>Home</NavLink>
          <NavLink to="/book">Book Naomi</NavLink>
          <NavLink to="/about">About</NavLink>
          <NavLink to="/status">My Bookings</NavLink>
          {isAdmin ? (
            <NavLink to="/admin">Dashboard</NavLink>
          ) : (
            <button className="nav-login" onClick={onLoginClick}>Login</button>
          )}
        </nav>
      </div>
    </header>
  );
}
