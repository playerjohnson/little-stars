import { useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Header from './components/Header';
import Home from './components/Home';
import BookingPage from './components/BookingPage';
import AdminDashboard from './components/AdminDashboard';
import LoginModal from './components/LoginModal';
import './styles/global.css';

export default function App() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const navigate = useNavigate();

  function handleLoginSuccess() {
    setIsAdmin(true);
    setShowLogin(false);
    navigate('/admin');
  }

  function handleLogout() {
    setIsAdmin(false);
    navigate('/');
  }

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
              isAdmin
                ? <AdminDashboard onLogout={handleLogout} />
                : <Home />
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
