import { useState } from 'react';
import { Link } from 'react-router-dom';

const GUIDES = [
  {
    id: 'how-to-book',
    icon: '📅',
    title: 'How to Book a Session',
    summary: 'A step-by-step guide to finding a date and placing your first bid.',
    sections: [
      {
        heading: 'Step 1: Browse Available Dates',
        content: `Head to the **Book Now** page. You'll see a calendar with green dots on dates that have availability. You can also switch to **List View** to see all upcoming slots in one go — this is handy if you're flexible on dates.`,
      },
      {
        heading: 'Step 2: Pick a Date',
        content: `Click on a date with a green dot. The right-hand panel will show the available time slots for that day, including the minimum hourly rate and how many bids have already been placed.`,
      },
      {
        heading: 'Step 3: Fill in Your Details',
        content: `Enter your name and at least one contact method (email or phone). If you've booked before, your details will be remembered automatically — look for the "Welcome back" message!`,
      },
      {
        heading: 'Step 4: Choose Your Times',
        content: `Select your preferred start and end time from the dropdowns. These only show times within the available window, so you can't accidentally pick an invalid time. Any times that are already booked will appear greyed out.`,
      },
      {
        heading: 'Step 5: Place Your Bid',
        content: `Enter how much you'd like to pay per hour. There's a minimum rate, and if others have already bid, you'll need to bid higher than the current top bid. Higher bids are more likely to be accepted!`,
      },
      {
        heading: 'Step 6: Submit & Wait',
        content: `Hit **Submit Bid** and you're done! You'll see a confirmation message. Your bid will be reviewed, and you'll be contacted once a decision is made. You can check your bid status anytime on the **My Bookings** page.`,
      },
    ],
  },
  {
    id: 'bidding',
    icon: '💷',
    title: 'How Does Bidding Work?',
    summary: 'Understand the bidding system and how to give yourself the best chance.',
    sections: [
      {
        heading: 'Why Bidding?',
        content: `Instead of fixed prices, Little Stars uses a bidding system. This keeps things fair — you choose what you're happy to pay, and the best offer for each slot gets confirmed. It means flexible pricing that works for everyone.`,
      },
      {
        heading: 'The Minimum Rate',
        content: `Each available slot has a minimum hourly rate (e.g. "From £12/hr"). You can't bid below this amount. Think of it as the starting price.`,
      },
      {
        heading: 'Competing Bids',
        content: `If other people have already bid on the same slot, you'll see how many bids there are and the current highest bid. Your bid must be higher than the existing top bid to be considered. The slot cards show a ranked list of all current bids so you know exactly where you stand.`,
      },
      {
        heading: 'When Is a Bid Accepted?',
        content: `Bids are reviewed manually. The highest bid for each time slot is the most likely to be accepted, but other factors like timing and flexibility may also be considered. Once a bid is accepted, all other overlapping bids for that time are automatically declined.`,
      },
      {
        heading: 'Tips for Success',
        content: `Bid early to get in first. Be flexible with your times — if you can do a slightly different window, you might avoid competition. And of course, a higher bid always helps! You can also check back to see if new slots have been added.`,
      },
    ],
  },
  {
    id: 'check-status',
    icon: '🔍',
    title: 'Checking Your Booking Status',
    summary: 'How to see if your bid has been accepted, declined, or is still pending.',
    sections: [
      {
        heading: 'Go to My Bookings',
        content: `Click **My Bookings** in the top menu (or the footer). You'll see a simple form asking for your email address.`,
      },
      {
        heading: 'Enter Your Email',
        content: `Type in the same email address you used when placing your bid, then click **Check My Bookings**. Make sure it matches exactly — the search is based on your email.`,
      },
      {
        heading: 'Understanding the Statuses',
        content: `Each booking will show one of these statuses:\n\n⏳ **Pending** — Your bid is being reviewed. Sit tight!\n\n✅ **Confirmed** — Great news, your booking is confirmed!\n\n❌ **Declined** — Another bid was accepted for this slot. Try bidding on a different date or time.\n\n🚫 **Cancelled** — This booking was cancelled.`,
      },
      {
        heading: 'No Results?',
        content: `If no bookings appear, double-check you're using the correct email. If you booked with a phone number only (no email), your bookings won't appear in the search — reach out via WhatsApp instead.`,
      },
    ],
  },
  {
    id: 'referrals',
    icon: '🎟️',
    title: 'Using a Referral Code',
    summary: 'Got a code from a friend? Here\'s how to use it for a discount.',
    sections: [
      {
        heading: 'What Are Referral Codes?',
        content: `Referral codes are special discount codes shared by existing customers. If a friend or family member has used Little Stars before, they may have a code to share with you.`,
      },
      {
        heading: 'How to Apply a Code',
        content: `When placing your bid on the booking page, you'll see a **Referral Code** field near the bottom of the form. Type in the code (it's not case-sensitive) and click **Apply**. If the code is valid, you'll see a green confirmation with the discount percentage.`,
      },
      {
        heading: 'When Does the Discount Apply?',
        content: `The referral code is recorded with your booking. The discount is applied to the final agreed rate once your bid is accepted. It's a percentage off your hourly rate.`,
      },
    ],
  },
  {
    id: 'calendar-tips',
    icon: '💡',
    title: 'Tips for Using the Calendar',
    summary: 'Get the most out of the booking calendar with these handy tips.',
    sections: [
      {
        heading: 'Green & Orange Dots',
        content: `On the calendar, **green dots** mean there's availability on that date. **Orange dots** mean there are existing bookings (bids) on that date. A date can have both — meaning some slots are available and some have bids.`,
      },
      {
        heading: 'Calendar vs List View',
        content: `Use **Calendar View** when you have specific dates in mind. Use **List View** when you're flexible and want to see everything that's coming up at a glance. List view also shows you which slots are already booked and how many bids each slot has.`,
      },
      {
        heading: 'Navigating Months',
        content: `Use the arrow buttons at the top of the calendar to move between months. Dates in the past are greyed out and can't be selected.`,
      },
      {
        heading: 'Booked Slots',
        content: `If a date's slots are all confirmed, the booking form will tell you and suggest trying another date. In list view, booked slots appear greyed out so you can skip straight to available ones.`,
      },
    ],
  },
  {
    id: 'cancellation',
    icon: '📋',
    title: 'Cancellation & Changes',
    summary: 'What happens if you need to cancel or change your booking.',
    sections: [
      {
        heading: 'Cancellation Policy Overview',
        content: `Little Stars has a fair, tiered cancellation policy:\n\n✅ **More than 24 hours notice** — No charge at all\n\n⚠️ **12–24 hours notice** — 50% of the agreed rate\n\n🚫 **Less than 12 hours / No-show** — Full charge`,
      },
      {
        heading: 'How to Cancel',
        content: `To cancel, get in touch directly via WhatsApp or phone as soon as you know. The cancellation time is based on when the message is received, so don't leave it to the last minute. You can find the WhatsApp button in the bottom-right corner of the site.`,
      },
      {
        heading: 'Changing Your Booking',
        content: `Need a different time or date? Just reach out with at least 24 hours' notice and the booking can usually be rescheduled, subject to availability. There's no charge for changes made in good time.`,
      },
      {
        heading: 'Full Policy',
        content: `For full details, visit the **Cancellation Policy** page linked in the footer of every page.`,
      },
    ],
  },
];

function renderMarkdown(text) {
  // Split by line breaks first
  const lines = text.split('\n');
  const elements = [];
  lines.forEach((line, li) => {
    // Split by bold markers **text**
    const parts = line.split(/\*\*(.*?)\*\*/g);
    parts.forEach((part, pi) => {
      if (pi % 2 === 1) {
        elements.push(<strong key={`${li}-${pi}`}>{part}</strong>);
      } else if (part) {
        elements.push(part);
      }
    });
    if (li < lines.length - 1) {
      elements.push(<br key={`br-${li}`} />);
    }
  });
  return elements;
}

export default function Guides() {
  const [openGuide, setOpenGuide] = useState(null);

  return (
    <div>
      <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 30, marginBottom: 8 }}>
        How to Use Little Stars
      </h2>
      <p style={{ color: 'var(--clr-text-muted)', fontSize: 14, marginBottom: 32 }}>
        Everything you need to know about booking, bidding, and managing your sessions.
      </p>

      {!openGuide ? (
        <div className="guides-grid">
          {GUIDES.map(guide => (
            <button
              key={guide.id}
              className="card guide-card"
              onClick={() => setOpenGuide(guide.id)}
            >
              <div className="guide-card-icon">{guide.icon}</div>
              <h3 className="guide-card-title">{guide.title}</h3>
              <p className="guide-card-summary">{guide.summary}</p>
              <span className="guide-card-link">Read guide →</span>
            </button>
          ))}
        </div>
      ) : (
        <div>
          <button
            className="guide-back-btn"
            onClick={() => setOpenGuide(null)}
          >
            ← Back to all guides
          </button>

          {(() => {
            const guide = GUIDES.find(g => g.id === openGuide);
            if (!guide) return null;

            return (
              <div className="guide-article card">
                <div className="guide-article-header">
                  <span className="guide-article-icon">{guide.icon}</span>
                  <h2 className="guide-article-title">{guide.title}</h2>
                </div>

                {guide.sections.map((section, i) => (
                  <div key={i} className="guide-section">
                    <div className="guide-section-number">{i + 1}</div>
                    <div className="guide-section-content">
                      <h3 className="guide-section-heading">{section.heading}</h3>
                      <p className="guide-section-text">
                        {renderMarkdown(section.content)}
                      </p>
                    </div>
                  </div>
                ))}

                <div className="guide-article-cta">
                  <p>Ready to get started?</p>
                  <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
                    <Link to="/book" className="btn btn-primary">Book Now</Link>
                    <Link to="/status" className="btn btn-outline">Check Booking Status</Link>
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
}
