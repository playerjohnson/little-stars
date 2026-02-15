# Little Stars - Babysitting Booking Website

A modern babysitting booking app built with **React** + **Supabase**, hosted free on **GitHub Pages**.

Customers browse available dates on a calendar and submit booking requests. The babysitter logs in with a PIN to manage availability and approve/decline bookings.

## Features

- Public calendar with availability indicators
- Booking form with contact details, time selection, and notes
- PIN-protected admin dashboard
- Availability slot management (add/remove per date)
- Booking approval workflow (confirm/decline)
- Stats overview (available days, total bookings, pending)
- Mobile responsive
- Free hosting (GitHub Pages + Supabase free tier)

## Tech Stack

- **Frontend**: React 19, Vite, React Router (HashRouter)
- **Backend**: Supabase (PostgreSQL + auto-generated REST API)
- **Hosting**: GitHub Pages
- **Deploy**: gh-pages npm package

## Quick Start

### 1. Set Up Supabase

1. Create a free account at [supabase.com](https://supabase.com)
2. Create a new project
3. Go to SQL Editor and run the contents of `supabase-setup.sql`
4. Go to Settings > API and copy your Project URL and anon public key

### 2. Configure

Create a `.env` file in the project root:

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### 3. Run Locally

```bash
npm install
npm run dev
```

### 4. Deploy to GitHub Pages

```bash
npm run deploy
```

Site will be live at: `https://yourusername.github.io/little-stars/`

Environment variables are baked in at build time, so `.env` must be present when deploying.

## Admin Access

Default PIN: `1234` (change in `src/lib/utils.js`)

## Customisation

- Branding: `Header.jsx` and `Home.jsx`
- Time slots: `utils.js` (7 AM - 9:30 PM default)
- Currency: search and replace the pound sign
- Colours: CSS custom properties in `global.css`

## License

MIT
