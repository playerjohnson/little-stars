import { CookiePreferenceLink } from './CookieConsent';

export default function PrivacyPolicy() {
  return (
    <div className="card" style={{ maxWidth: 700, margin: '0 auto' }}>
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 30, marginBottom: 8 }}>
        Privacy Policy
      </h1>
      <p style={{ color: 'var(--clr-text-faint)', fontSize: 13, marginBottom: 24 }}>
        Last updated: 15 February 2026
      </p>

      <div className="privacy-content">
        <h3>Who we are</h3>
        <p>
          Little Stars Babysitting is a personal babysitting service. This website allows
          customers to view availability and submit booking requests.
        </p>

        <h3>What data we collect</h3>
        <p>When you submit a booking request, we collect:</p>
        <p>
          Your name, email address and/or phone number, preferred time slot, number of children,
          and any notes you provide. This information is used solely to process your booking
          request and contact you about your booking.
        </p>

        <h3>How we store your data</h3>
        <p>
          Your booking data is stored securely using Supabase, a hosted database platform with
          encryption at rest and in transit. We retain booking data for as long as necessary to
          provide our service. You can request deletion of your data at any time by contacting us.
        </p>

        <h3>Cookies and analytics</h3>
        <p>
          We use Google Analytics (GA4) to understand how visitors use our site. This service
          uses cookies to collect anonymous usage data such as pages visited, time spent on
          pages, and general geographic location.
        </p>
        <p>
          Analytics cookies are only set if you consent via our cookie banner. We use IP
          anonymisation, so your full IP address is never stored by Google Analytics.
        </p>
        <p>
          <strong>Cookies we use:</strong>
        </p>
        <p>
          <strong>_ga</strong> — Distinguishes unique users. Expires after 2 years.
          <br />
          <strong>_ga_*</strong> — Maintains session state. Expires after 2 years.
          <br />
          <strong>littlestars-cookie-consent</strong> — Stores your cookie preference. Local storage, no expiry.
        </p>
        <p>
          You can change your cookie preferences at any time: <CookiePreferenceLink />
        </p>

        <h3>Third parties</h3>
        <p>
          We do not sell or share your personal data with third parties. Data is only processed
          by Supabase (database hosting) and Google Analytics (anonymous usage statistics, only
          with your consent).
        </p>

        <h3>Your rights</h3>
        <p>
          Under UK GDPR, you have the right to access, correct, or delete your personal data.
          You also have the right to withdraw consent for analytics cookies at any time.
          To exercise any of these rights, please contact us through the details provided
          in your booking confirmation.
        </p>

        <h3>Children's privacy</h3>
        <p>
          Our booking service is intended for use by parents and guardians. We do not knowingly
          collect personal data from children under 13.
        </p>
      </div>
    </div>
  );
}
