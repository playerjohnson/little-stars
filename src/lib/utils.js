export const DAYS_SHORT = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
export const DAYS_FULL = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
export const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

// Generate time slots from 7:00 AM to 9:30 PM in 30-min intervals
export const TIME_SLOTS = [];
for (let h = 7; h <= 21; h++) {
  for (let m = 0; m < 60; m += 30) {
    const hour = h > 12 ? h - 12 : h === 0 ? 12 : h;
    const ampm = h >= 12 ? 'PM' : 'AM';
    const label = `${hour}:${m === 0 ? '00' : m} ${ampm}`;
    const value = `${String(h).padStart(2, '0')}:${m === 0 ? '00' : m}:00`;
    TIME_SLOTS.push({ value, label });
  }
}

export function formatTime(timeStr) {
  if (!timeStr) return '';
  const [h, m] = timeStr.split(':').map(Number);
  const hour = h > 12 ? h - 12 : h === 0 ? 12 : h;
  const ampm = h >= 12 ? 'PM' : 'AM';
  return `${hour}:${String(m).padStart(2, '0')} ${ampm}`;
}

export function dateToKey(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

export function formatDateDisplay(dateStr) {
  const [y, m, d] = dateStr.split('-').map(Number);
  return `${d} ${MONTHS[m - 1]}`;
}

export function timeToMinutes(timeStr) {
  const [h, m] = timeStr.split(':').map(Number);
  return h * 60 + m;
}

export function getMonthDays(year, month) {
  return new Date(year, month + 1, 0).getDate();
}

export function getMonthFirstDay(year, month) {
  return new Date(year, month, 1).getDay();
}

export function getMonthRange(date) {
  const y = date.getFullYear();
  const m = date.getMonth();
  const start = `${y}-${String(m + 1).padStart(2, '0')}-01`;
  const end = `${y}-${String(m + 1).padStart(2, '0')}-${getMonthDays(y, m)}`;
  return { start, end };
}

// Admin PIN — change this to whatever you like
export const ADMIN_PIN = '1234';
