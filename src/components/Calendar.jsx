import { useState, useEffect, useCallback } from 'react';
import { DAYS_SHORT, MONTHS, dateToKey, getMonthDays, getMonthFirstDay, getMonthRange } from '../lib/utils';
import { getAvailability, getBookings } from '../lib/supabase';

export default function Calendar({ selectedDate, onSelectDate, availability, bookings, isAdmin }) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const today = new Date();
  const todayKey = dateToKey(today);

  const daysInMonth = getMonthDays(currentMonth.getFullYear(), currentMonth.getMonth());
  const firstDay = getMonthFirstDay(currentMonth.getFullYear(), currentMonth.getMonth());

  const prevMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  const nextMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));

  // Build lookup sets for quick checking
  const availDates = new Set((availability || []).map(a => a.date));
  const bookedDates = new Set((bookings || []).filter(b => b.status === 'confirmed').map(b => b.date));

  const days = [];
  for (let i = 0; i < firstDay; i++) {
    days.push(<div key={`e-${i}`} />);
  }

  for (let d = 1; d <= daysInMonth; d++) {
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), d);
    const key = dateToKey(date);
    const hasAvail = availDates.has(key);
    const hasBooking = bookedDates.has(key);
    const isToday = key === todayKey;
    const isSelected = selectedDate === key;
    const isPast = date < new Date(today.getFullYear(), today.getMonth(), today.getDate());

    const classes = [
      'calendar-day',
      isToday && 'today',
      isSelected && 'selected',
    ].filter(Boolean).join(' ');

    days.push(
      <button
        key={d}
        className={classes}
        onClick={() => !isPast && onSelectDate(key)}
        disabled={isPast && !isAdmin}
      >
        {d}
        {hasAvail && <span className="calendar-dot avail" />}
        {hasBooking && <span className="calendar-dot booked" />}
      </button>
    );
  }

  return (
    <div>
      <div className="calendar-nav">
        <button onClick={prevMonth}>‹</button>
        <h3>{MONTHS[currentMonth.getMonth()]} {currentMonth.getFullYear()}</h3>
        <button onClick={nextMonth}>›</button>
      </div>
      <div className="calendar-grid">
        {DAYS_SHORT.map(d => (
          <div key={d} className="calendar-header">{d}</div>
        ))}
        {days}
      </div>
      <div className="calendar-legend">
        <span><span className="legend-dot" style={{ background: 'var(--clr-success)' }} /> Available</span>
        <span><span className="legend-dot" style={{ background: 'var(--clr-warning)' }} /> Booked</span>
      </div>
    </div>
  );
}
