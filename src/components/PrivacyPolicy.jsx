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
        <h3>1. Data Controller</h3>
        <p>
          The data controller for this website is:
        </p>
        <p>
          <strong>Naomi Johnson</strong>
          <br />
          Trading as Little Stars Babysitting
          <br />
          Peterborough, United Kingdom
          <br />
          Email:{' '}
          <a href="mailto:naomiejohnson05@gmail.com" style={{ color: 'var(--clr-primary)' }}>
            naomiejohnson05@gmail.com
          </a>
        </p>
        <p>
          For any questions about how your data is handled, or to exercise any of
          your rights under data protection law, please contact the above email
          address.
        </p>

        <h3>2. What data we collect</h3>
        <p>
          When you submit a booking request through this website, we collect the
          following personal data:
        </p>
        <p>
          Your name, email address and/or phone number, preferred date and time
          slot, number of children, bid amount, any referral code used, any notes
          you provide, and whether you accepted the Terms &amp; Conditions
          (including the timestamp of acceptance).
        </p>
        <p>
          When you use the website, we may also collect anonymous usage data
          (pages visited, time on site, general geographic area) through Google
          Analytics, but only if you consent via the cookie banner.
        </p>

        <h3>3. Lawful basis for processing</h3>
        <p>
          Under UK GDPR (Article 6), we process your personal data on the
          following legal bases:
        </p>
        <p>
          <strong>Booking data (name, contact details, bid details):</strong>{' '}
          Performance of a contract (Article 6(1)(b)). We need this information
          to process your booking request and, if your bid is accepted, to
          fulfil the babysitting service.
        </p>
        <p>
          <strong>Analytics cookies:</strong>{' '}
          Consent (Article 6(1)(a)). Analytics data is only collected if you
          opt in via the cookie banner. You can withdraw consent at any time.
        </p>
        <p>
          <strong>Cancellation records:</strong>{' '}
          Legitimate interests (Article 6(1)(f)). We retain cancellation details
          to manage our service, apply our cancellation policy fairly, and
          resolve any disputes.
        </p>

        <h3>4. How we use your data</h3>
        <p>
          We use your personal data to: process and manage your booking requests,
          contact you about the status of your bid (accepted, declined, or
          pending), provide the babysitting service, apply referral code discounts,
          process cancellations in accordance with our cancellation policy, and
          improve the website based on anonymous usage patterns (with your consent).
        </p>

        <h3>5. How we store your data</h3>
        <p>
          Your booking data is stored securely using Supabase, a hosted database
          platform that provides encryption at rest and in transit. Supabase's
          infrastructure is hosted on Amazon Web Services (AWS).
        </p>

        <h3>6. International transfers</h3>
        <p>
          Supabase may process data on servers located outside the United Kingdom,
          including in the European Economic Area and the United States. Where
          data is transferred outside the UK, it is protected by appropriate
          safeguards including Standard Contractual Clauses (SCCs) and, where
          applicable, UK adequacy decisions under the Data Protection Act 2018.
        </p>
        <p>
          Google Analytics data may be processed by Google in the United States.
          Google relies on Standard Contractual Clauses for international
          transfers. For more information, see{' '}
          <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer"
            style={{ color: 'var(--clr-primary)' }}>
            Google's Privacy Policy
          </a>.
        </p>

        <h3>7. Data retention</h3>
        <p>
          We retain your personal data for the following periods:
        </p>
        <p>
          <strong>Confirmed bookings:</strong> 2 years after the date of the
          booking, for service records and in case of any disputes.
          <br />
          <strong>Pending bids (not accepted):</strong> 6 months after the
          date of the bid, then deleted.
          <br />
          <strong>Declined bids:</strong> 6 months after the date of the
          bid, then deleted.
          <br />
          <strong>Cancelled bookings:</strong> 12 months after cancellation,
          for cancellation policy records.
          <br />
          <strong>Analytics data:</strong> Subject to Google Analytics' default
          retention period of 14 months. We do not retain any personally
          identifiable analytics data.
          <br />
          <strong>Cookie consent preference:</strong> Stored in your browser's
          local storage with no set expiry. You can clear this at any time
          through your browser settings.
        </p>
        <p>
          You can request deletion of your data at any time by contacting us
          at the email address above. We will action your request within 30 days.
        </p>

        <h3>8. Cookies and analytics</h3>
        <p>
          We use Google Analytics (GA4) to understand how visitors use our site.
          This service uses cookies to collect anonymous usage data such as pages
          visited, time spent on pages, and general geographic location.
        </p>
        <p>
          Analytics cookies are only set if you consent via our cookie banner. We
          use IP anonymisation, so your full IP address is never stored by Google
          Analytics.
        </p>
        <p>
          <strong>Cookies we use:</strong>
        </p>
        <p>
          <strong>_ga</strong> — Distinguishes unique users. Expires after 2 years.
          <br />
          <strong>_ga_*</strong> — Maintains session state. Expires after 2 years.
          <br />
          <strong>littlestars-cookie-consent</strong> — Stores your cookie
          preference. Local storage, no expiry.
          <br />
          <strong>littlestars-customer</strong> — Stores your name, email, and
          phone locally to save you re-entering details on repeat bookings.
          Local storage, no expiry. You can clear this through your browser
          settings.
        </p>
        <p>
          You can change your cookie preferences at any time: <CookiePreferenceLink />
        </p>

        <h3>9. Third parties</h3>
        <p>
          We do not sell, rent, or share your personal data with third parties
          for marketing purposes. Your data is only processed by the following
          third-party services in order to operate this website:
        </p>
        <p>
          <strong>Supabase</strong> — Database hosting and authentication.
          Supabase's privacy policy:{' '}
          <a href="https://supabase.com/privacy" target="_blank" rel="noopener noreferrer"
            style={{ color: 'var(--clr-primary)' }}>
            supabase.com/privacy
          </a>
          <br />
          <strong>Google Analytics</strong> — Anonymous website usage statistics
          (only with your consent). Google's privacy policy:{' '}
          <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer"
            style={{ color: 'var(--clr-primary)' }}>
            policies.google.com/privacy
          </a>
          <br />
          <strong>GitHub Pages</strong> — Website hosting. GitHub's privacy
          policy:{' '}
          <a href="https://docs.github.com/en/site-policy/privacy-policies/github-general-privacy-statement" target="_blank" rel="noopener noreferrer"
            style={{ color: 'var(--clr-primary)' }}>
            docs.github.com
          </a>
        </p>

        <h3>10. Automated decision-making</h3>
        <p>
          The bidding system on this website automatically ranks bids by amount.
          However, the final decision to accept or decline a bid is always made
          manually by the Service Provider. No fully automated decisions with
          legal or similarly significant effects are made about you.
        </p>

        <h3>11. Your rights</h3>
        <p>
          Under the UK GDPR and Data Protection Act 2018, you have the following
          rights:
        </p>
        <p>
          <strong>Right of access</strong> — You can request a copy of the
          personal data we hold about you.
          <br />
          <strong>Right to rectification</strong> — You can ask us to correct
          any inaccurate or incomplete data.
          <br />
          <strong>Right to erasure</strong> — You can ask us to delete your
          personal data where there is no compelling reason for us to continue
          processing it.
          <br />
          <strong>Right to restrict processing</strong> — You can ask us to
          suspend processing of your data in certain circumstances.
          <br />
          <strong>Right to data portability</strong> — You can request your data
          in a structured, commonly used, machine-readable format.
          <br />
          <strong>Right to withdraw consent</strong> — Where processing is based
          on consent (e.g., analytics cookies), you can withdraw consent at any
          time without affecting the lawfulness of prior processing.
          <br />
          <strong>Right to object</strong> — You can object to processing based
          on legitimate interests.
        </p>
        <p>
          To exercise any of these rights, please email{' '}
          <a href="mailto:naomiejohnson05@gmail.com" style={{ color: 'var(--clr-primary)' }}>
            naomiejohnson05@gmail.com
          </a>
          . We will respond to your request within <strong>30 days</strong>.
          If we need more time (up to a further 60 days for complex requests),
          we will inform you within the initial 30-day period.
        </p>

        <h3>12. Complaints</h3>
        <p>
          If you are unhappy with how we have handled your personal data, you
          have the right to lodge a complaint with the Information Commissioner's
          Office (ICO):
        </p>
        <p>
          Information Commissioner's Office
          <br />
          Wycliffe House, Water Lane, Wilmslow, Cheshire, SK9 5AF
          <br />
          Telephone: 0303 123 1113
          <br />
          Website:{' '}
          <a href="https://ico.org.uk" target="_blank" rel="noopener noreferrer"
            style={{ color: 'var(--clr-primary)' }}>
            ico.org.uk
          </a>
        </p>

        <h3>13. Children's privacy</h3>
        <p>
          Our booking service is intended for use by parents and legal guardians.
          We do not knowingly collect personal data directly from children under
          13. If you believe a child under 13 has provided us with personal data,
          please contact us and we will delete it promptly.
        </p>

        <h3>14. Changes to this policy</h3>
        <p>
          We may update this Privacy Policy from time to time. The "Last updated"
          date at the top of this page will be revised when changes are made.
          We encourage you to review this page periodically. Material changes
          will be communicated to existing customers where possible.
        </p>
      </div>
    </div>
  );
}
