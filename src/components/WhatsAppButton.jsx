import { useState, useEffect } from 'react';

// ⬇️ SET YOUR WHATSAPP NUMBER HERE (country code + number, no spaces)
// Example for UK: '447700900000' (44 = UK, drop the leading 0)
// Leave empty '' to hide the WhatsApp button
const WHATSAPP_NUMBER = '';

const DEFAULT_MESSAGE = 'Hi! I have a question about your babysitting service 🌟';

export default function WhatsAppButton() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShow(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  if (!WHATSAPP_NUMBER || !show) return null;

  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(DEFAULT_MESSAGE)}`;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="whatsapp-fab"
      aria-label="Message on WhatsApp"
      title="Message on WhatsApp"
    >
      <svg viewBox="0 0 32 32" width="28" height="28" fill="#fff">
        <path d="M16.004 0h-.008C7.174 0 0 7.174 0 16c0 3.5 1.128 6.744 3.046 9.378L1.054 31.29l6.128-1.958C9.72 31.026 12.738 32 16.004 32 24.826 32 32 24.826 32 16S24.826 0 16.004 0zm9.314 22.594c-.392 1.1-1.936 2.014-3.164 2.28-.84.18-1.936.322-5.63-1.21-4.726-1.96-7.77-6.756-8.006-7.07-.228-.314-1.87-2.492-1.87-4.754 0-2.262 1.184-3.376 1.604-3.838.392-.428 1.03-.626 1.64-.626.198 0 .376.01.536.018.462.02.694.046 1 .77.382.906 1.316 3.168 1.432 3.398.118.232.232.536.07.848-.15.322-.278.464-.51.734-.232.27-.452.476-.684.766-.214.254-.454.524-.19.986.264.462 1.176 1.94 2.526 3.142 1.736 1.544 3.198 2.024 3.66 2.248.34.166.744.138.998-.12.322-.332.72-.882 1.124-1.426.288-.388.65-.436 1.02-.296.376.134 2.382 1.124 2.79 1.328.408.206.68.306.78.476.098.17.098.986-.294 2.086z"/>
      </svg>
    </a>
  );
}
