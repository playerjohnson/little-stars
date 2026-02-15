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
import Guides from './components/Guides';
import TermsConditions from './components/TermsConditions';
import SafeguardingPolicy from './components/SafeguardingPolicy';
import AccessibilityStatement from './components/AccessibilityStatement';
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
  const location = useLocation();

  usePageTracking();

  // SEO: Dynamic page titles
  useEffect(() => {
    const titles = {
      '/': 'Little Stars — Trusted Babysitting in Peterborough',
      '/book': 'Book Naomi — Babysitting in Peterborough | Little Stars',
      '/my-bookings': 'My Bookings | Little Stars',
      '/about': 'Meet Naomi — Your Peterborough Babysitter | Little Stars',
      '/guides': 'Booking Guides & Help | Little Stars',
      '/terms': 'Terms & Conditions | Little Stars',
      '/cancellation': 'Cancellation Policy | Little Stars',
      '/privacy': 'Privacy Policy | Little Stars',
      '/safeguarding': 'Safeguarding Policy | Little Stars',
      '/accessibility': 'Accessibility Statement | Little Stars',
      '/admin': 'Admin Dashboard | Little Stars',
    };
    document.title = titles[location.pathname] || 'Little Stars — Trusted Babysitting in Peterborough';
  }, [location.pathname]);

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
          <Route path="/guides" element={<Guides />} />
          <Route path="/terms" element={<TermsConditions />} />
          <Route path="/safeguarding" element={<SafeguardingPolicy />} />
          <Route path="/accessibility" element={<AccessibilityStatement />} />
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
        <p>Little Stars · Babysitting by Naomi · Peterborough © {new Date().getFullYear()}</p>
        <div className="footer-links">
          <Link to="/about">About</Link>
          <Link to="/guides">Help & Guides</Link>
          <Link to="/terms">Terms & Conditions</Link>
          <Link to="/cancellation">Cancellation Policy</Link>
          <Link to="/safeguarding">Safeguarding</Link>
          <Link to="/privacy">Privacy Policy</Link>
          <Link to="/accessibility">Accessibility</Link>
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
