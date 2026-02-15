export default function AccessibilityStatement() {
  return (
    <div className="card" style={{ maxWidth: 700, margin: '0 auto' }}>
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 30, marginBottom: 8 }}>
        Accessibility Statement
      </h1>
      <p style={{ color: 'var(--clr-text-faint)', fontSize: 13, marginBottom: 24 }}>
        Last updated: 15 February 2026
      </p>

      <div className="privacy-content">
        <h3>Our commitment</h3>
        <p>
          Little Stars Babysitting is committed to making our website accessible
          to as many people as possible, regardless of ability or technology. We
          aim to meet the Web Content Accessibility Guidelines (WCAG) 2.1 at
          Level AA where possible.
        </p>

        <h3>What we've done</h3>
        <p>
          We have taken the following steps to improve accessibility on this website:
        </p>
        <p>
          The site uses semantic HTML elements for clear document structure. All
          interactive elements (buttons, links, form inputs) are keyboard
          accessible. Form fields include visible labels. Colour contrast has been
          considered for text readability in both light and dark modes. The site
          is responsive and works on mobile devices, tablets, and desktops. We
          avoid relying on colour alone to convey information — status badges
          include text labels alongside colour indicators.
        </p>

        <h3>Known limitations</h3>
        <p>
          We are aware of the following areas where accessibility could be improved:
        </p>
        <p>
          Some decorative emoji may not be announced meaningfully by screen
          readers. The calendar component may present navigation challenges for
          screen reader users — the list view provides an alternative way to browse
          availability. PDF or document downloads may not be fully accessible.
        </p>

        <h3>Browser and device support</h3>
        <p>
          This website is designed to work with modern web browsers including
          Chrome, Firefox, Safari, and Edge. The site supports both light and
          dark display modes and will follow your system preference automatically.
        </p>

        <h3>Feedback</h3>
        <p>
          We welcome feedback on the accessibility of this website. If you
          experience any difficulty using the site, or have suggestions for
          improvement, please contact us via WhatsApp using the chat button,
          or through the contact details provided in your booking confirmation.
          We will do our best to respond within 5 working days and to address
          any issues raised.
        </p>

        <h3>Enforcement</h3>
        <p>
          If you are not satisfied with our response, you can contact the
          Equality Advisory Support Service (EASS) at{' '}
          <a
            href="https://www.equalityadvisoryservice.com"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: 'var(--clr-primary)' }}
          >
            equalityadvisoryservice.com
          </a>{' '}
          or by phone on 0808 800 0082.
        </p>
      </div>
    </div>
  );
}
