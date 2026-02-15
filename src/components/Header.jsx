import { NavLink } from 'react-router-dom';

export default function Header({ isAdmin, onLoginClick, onLogout }) {
  return (
    <header className="header">
      <div className="header-inner">
        <NavLink to="/" className="logo">
          <span className="logo-star">⭐</span>
          <span className="logo-text">Little Stars</span>
          <span className="logo-sub">Babysitting by Naomi</span>
        </NavLink>

        <nav className="nav">
          <NavLink to="/" end>Home</NavLink>
          <NavLink to="/book">Book Now</NavLink>
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
