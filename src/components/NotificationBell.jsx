import { useState, useEffect, useRef } from 'react';
import { getNewBidsSince } from '../lib/supabase';
import { formatTime, MONTHS } from '../lib/utils';

export default function NotificationBell() {
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);
  const [lastCheck, setLastCheck] = useState(() => new Date().toISOString());
  const intervalRef = useRef(null);

  useEffect(() => {
    // Poll every 30 seconds for new bids
    function poll() {
      getNewBidsSince(lastCheck)
        .then(bids => {
          if (bids.length > 0) {
            setNotifications(prev => {
              const existingIds = new Set(prev.map(n => n.id));
              const newOnes = bids.filter(b => !existingIds.has(b.id));
              return [...newOnes, ...prev].slice(0, 20);
            });
          }
        })
        .catch(console.error);
    }

    poll();
    intervalRef.current = setInterval(poll, 30000);
    return () => clearInterval(intervalRef.current);
  }, [lastCheck]);

  function handleOpen() {
    setOpen(!open);
  }

  function handleClear() {
    setNotifications([]);
    setLastCheck(new Date().toISOString());
    setOpen(false);
  }

  const count = notifications.length;

  return (
    <div className="notif-wrapper">
      <button className="notif-bell" onClick={handleOpen}>
        🔔
        {count > 0 && <span className="notif-badge">{count > 9 ? '9+' : count}</span>}
      </button>

      {open && (
        <div className="notif-dropdown">
          <div className="notif-header">
            <span style={{ fontWeight: 700, fontSize: 14 }}>New Bids</span>
            {count > 0 && (
              <button className="notif-clear" onClick={handleClear}>Clear all</button>
            )}
          </div>
          {count === 0 ? (
            <div className="notif-empty">No new bids</div>
          ) : (
            <div className="notif-list">
              {notifications.map(n => {
                const [y, m, d] = n.date.split('-').map(Number);
                return (
                  <div key={n.id} className="notif-item">
                    <div className="notif-item-title">
                      <strong>{n.customer_name}</strong> bid <strong>£{n.bid_amount}/hr</strong>
                    </div>
                    <div className="notif-item-desc">
                      {d} {MONTHS[m - 1]} · {formatTime(n.start_time)}–{formatTime(n.end_time)} · {n.num_children} child{n.num_children > 1 ? 'ren' : ''}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
