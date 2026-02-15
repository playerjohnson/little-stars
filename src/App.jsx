import { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation, Link } from 'react-router-dom';
import Header from './components/Header';
import Home from './components/Home';
import BookingPage from './components/BookingPage';
import BookingStatus from './components/BookingStatus';
import AboutMe from './components/AboutMe';
import AdminDashboard from './components/AdminDashboard';
import LoginModal from './components/LoginModal';
import PrivacyPolicy from './components/PrivacyPolicy';
import CancellationPolicy from './components/CancellationPolicy';
import CookieConsent, { CookiePreferenceLink } from './components/CookieConsent';
import WhatsAppButton from './components/WhatsAppButton';
import { getCurrentUser, onAuthStateChange, signOut } from './lib/auth';
import './styles/global.css';

function usePageTracking() {
  const location = useLocation();
  useEffect(() => {
    if (window.gtag) {
      window.gtag('config', 'G-GSVNXL004D', { page_path: location.pathname + location.hash });
    }
  }, [location]);
}

export default function App() {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [showLogin, setShowLogin] = useState(false);
  const navigate = useNavigate();

  usePageTracking();

  useEffect(() => {
    getCurrentUser().then(u => { setUser(u); setAuthLoading(false); });
    const unsubscribe = onAuthStateChange((u, event) => {
      setUser(u);
      if (event === 'SIGNED_OUT') navigate('/');
    });
    return unsubscribe;
  }, []);

  function handleLoginSuccess(u) { setUser(u); setShowLogin(false); navigate('/admin'); }
  async function handleLogout() {
    try { await signOut(); setUser(null); navigate('/'); } catch (err) { console.error(err); }
  }

  const isAdmin = !!user;

  return (
    <>
      <Header isAdmin={isAdmin} onLoginClick={() => setShowLogin(true)} onLogout={handleLogout} />

      <div className="page-container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/book" element={<BookingPage />} />
          <Route path="/about" element={<AboutMe />} />
          <Route path="/status" element={<BookingStatus />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/cancellation" element={<CancellationPolicy />} />
          <Route path="/admin" element={
            authLoading ? <div className="loading">Checking login...</div>
              : isAdmin ? <AdminDashboard user={user} onLogout={handleLogout} />
              : <Home />
          } />
        </Routes>
      </div>

      <footer className="footer">
        <p>Little Stars Babysitting © {new Date().getFullYear()} · Made with 💛</p>
        <div className="footer-links">
          <Link to="/about">About</Link>
          <Link to="/cancellation">Cancellation Policy</Link>
          <Link to="/privacy">Privacy Policy</Link>
          <CookiePreferenceLink />
        </div>
      </footer>

      <WhatsAppButton />
      <CookieConsent />

      {showLogin && (
        <LoginModal onSuccess={handleLoginSuccess} onClose={() => setShowLogin(false)} />
      )}
    </>
  );
}
