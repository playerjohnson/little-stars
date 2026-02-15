import { useNavigate, useLocation } from 'react-router-dom';

export default function Header({ isAdmin, onLoginClick, onLogout }) {
  const navigate = useNavigate();
  const location = useLocation();
  const path = location.pathname;

  return (
    <header className="header">
      <div className="header-inner">
        <a className="logo" onClick={() => navigate('/')}>
          <div className="logo-icon">🌟</div>
          <div className="logo-text">
            <h1>Little Stars</h1>
            <span>Babysitting Services</span>
          </div>
        </a>

        <nav className="nav-pills">
          <button
            className={`nav-pill ${path === '/' ? 'active' : ''}`}
            onClick={() => navigate('/')}
          >
            Home
          </button>
          <button
            className={`nav-pill ${path === '/book' ? 'active' : ''}`}
            onClick={() => navigate('/book')}
          >
            Book Now
          </button>
          <button
            className={`nav-pill ${path === '/admin' ? 'active' : ''}`}
            onClick={() => {
              if (isAdmin) navigate('/admin');
              else onLoginClick();
            }}
          >
            {isAdmin ? 'Dashboard' : 'Login'}
          </button>
        </nav>
      </div>
    </header>
  );
}
