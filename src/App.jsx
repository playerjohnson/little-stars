import { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Header from './components/Header';
import Home from './components/Home';
import BookingPage from './components/BookingPage';
import AdminDashboard from './components/AdminDashboard';
import LoginModal from './components/LoginModal';
import { getCurrentUser, onAuthStateChange, signOut } from './lib/auth';
import './styles/global.css';

export default function App() {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [showLogin, setShowLogin] = useState(false);
  const navigate = useNavigate();

  // Check for existing session on mount + listen for changes
  useEffect(() => {
    getCurrentUser().then(u => {
      setUser(u);
      setAuthLoading(false);
    });

    const unsubscribe = onAuthStateChange((u, event) => {
      setUser(u);
      if (event === 'SIGNED_OUT') {
        navigate('/');
      }
    });

    return unsubscribe;
  }, []);

  function handleLoginSuccess(u) {
    setUser(u);
    setShowLogin(false);
    navigate('/admin');
  }

  async function handleLogout() {
    try {
      await signOut();
      setUser(null);
      navigate('/');
    } catch (err) {
      console.error('Logout failed:', err);
    }
  }

  const isAdmin = !!user;

  return (
    <>
      <Header
        isAdmin={isAdmin}
        onLoginClick={() => setShowLogin(true)}
        onLogout={handleLogout}
      />

      <div className="page-container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/book" element={<BookingPage />} />
          <Route
            path="/admin"
            element={
              authLoading ? (
                <div className="loading">Checking login...</div>
              ) : isAdmin ? (
                <AdminDashboard user={user} onLogout={handleLogout} />
              ) : (
                <Home />
              )
            }
          />
        </Routes>
      </div>

      <footer className="footer">
        <p>Little Stars Babysitting © {new Date().getFullYear()} · Made with 💛</p>
      </footer>

      {showLogin && (
        <LoginModal
          onSuccess={handleLoginSuccess}
          onClose={() => setShowLogin(false)}
        />
      )}
    </>
  );
}
