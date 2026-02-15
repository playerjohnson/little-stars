import { useState, useEffect } from 'react';

const GA_ID = 'G-GSVNXL004D';
const CONSENT_KEY = 'littlestars-cookie-consent';

/**
 * Load GA4 script dynamically — only called after user accepts cookies.
 */
function loadGA() {
  if (document.getElementById('ga-script')) return;

  const script = document.createElement('script');
  script.id = 'ga-script';
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
  document.head.appendChild(script);

  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }
  window.gtag = gtag;
  gtag('js', new Date());
  gtag('config', GA_ID, { anonymize_ip: true });
}

/**
 * Remove GA cookies and scripts if user declines.
 */
function removeGA() {
  // Remove GA cookies
  const cookies = document.cookie.split(';');
  for (const cookie of cookies) {
    const name = cookie.split('=')[0].trim();
    if (name.startsWith('_ga') || name.startsWith('_gid') || name.startsWith('_gat')) {
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=.github.io`;
    }
  }

  // Remove GA script
  const script = document.getElementById('ga-script');
  if (script) script.remove();

  window.dataLayer = [];
}

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem(CONSENT_KEY);
    if (consent === 'accepted') {
      loadGA();
    } else if (consent === 'declined') {
      removeGA();
    } else {
      // No choice made yet — show banner after short delay
      const timer = setTimeout(() => setVisible(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  function handleAccept() {
    localStorage.setItem(CONSENT_KEY, 'accepted');
    loadGA();
    setVisible(false);
  }

  function handleDecline() {
    localStorage.setItem(CONSENT_KEY, 'declined');
    removeGA();
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="cookie-overlay">
      <div className="cookie-banner">
        <div className="cookie-icon">🍪</div>
        <div className="cookie-content">
          <h4 className="cookie-title">We use cookies</h4>
          <p className="cookie-text">
            We use analytics cookies to understand how you use our site and improve your experience.
            {showDetails && (
              <span className="cookie-details">
                {' '}We use Google Analytics to collect anonymous usage data such as pages visited and
                time on site. No personal data is shared with third parties. You can change your
                preference at any time from the footer.
              </span>
            )}
          </p>
          {!showDetails && (
            <button className="cookie-learn-more" onClick={() => setShowDetails(true)}>
              Learn more
            </button>
          )}
        </div>
        <div className="cookie-actions">
          <button className="btn btn-primary btn-sm cookie-accept" onClick={handleAccept}>
            Accept
          </button>
          <button className="btn btn-outline btn-sm cookie-decline" onClick={handleDecline}>
            Decline
          </button>
        </div>
      </div>
    </div>
  );
}

/**
 * Small link component for the footer to let users change their cookie preference.
 */
export function CookiePreferenceLink() {
  function handleReset() {
    localStorage.removeItem(CONSENT_KEY);
    removeGA();
    window.location.reload();
  }

  return (
    <button className="cookie-pref-link" onClick={handleReset}>
      Cookie Settings
    </button>
  );
}
