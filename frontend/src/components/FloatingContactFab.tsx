import { useEffect, useRef, useState } from 'react';

const phoneNumber = '+254115138594';
const whatsappLink = 'https://wa.me/254115138594?text=Hi%20MngFX%20Academy';

const FloatingContactFab = () => {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    window.addEventListener('mousedown', handleClickOutside);
    return () => window.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        position: 'fixed',
        bottom: '2.5rem',
        right: '2.5rem',
        zIndex: 140,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        gap: '0.75rem',
      }}
    >
      {open && (
        <div
          style={{
            background: 'rgba(15, 23, 42, 0.96)',
            borderRadius: '20px',
            padding: '1.1rem',
            width: '240px',
            boxShadow: '0 28px 60px rgba(15, 23, 42, 0.5)',
            backdropFilter: 'blur(18px)',
            border: '1px solid rgba(37, 99, 235, 0.35)',
            display: 'grid',
            gap: '0.85rem',
          }}
        >
          <div style={{ color: '#bae6fd', fontWeight: 600, fontSize: '0.95rem' }}>Need help? Reach us instantly.</div>
          <a
            href={`tel:${phoneNumber}`}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '0.75rem 0.85rem',
              borderRadius: '14px',
              background: 'rgba(37, 99, 235, 0.2)',
              color: '#e0f2fe',
              textDecoration: 'none',
              fontWeight: 600,
            }}
          >
            📞 Call +254 115 138 594
          </a>
          <a
            href={whatsappLink}
            target="_blank"
            rel="noreferrer"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '0.75rem 0.85rem',
              borderRadius: '14px',
              background: 'rgba(34, 197, 94, 0.2)',
              color: '#bbf7d0',
              textDecoration: 'none',
              fontWeight: 600,
            }}
          >
            💬 WhatsApp
          </a>
          <a
            href="/contact"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '0.75rem 0.85rem',
              borderRadius: '14px',
              background: 'rgba(148, 163, 184, 0.18)',
              color: '#e2e8f0',
              textDecoration: 'none',
              fontWeight: 600,
            }}
            onClick={() => setOpen(false)}
          >
            ✉️ Leave an enquiry
          </a>
        </div>
      )}
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-haspopup="true"
        aria-expanded={open}
        aria-label="Toggle contact options"
        style={{
          width: '68px',
          height: '68px',
          borderRadius: '50%',
          border: 'none',
          background: 'linear-gradient(135deg, #0ea5e9, #2563eb)',
          color: '#fff',
          fontSize: '1.9rem',
          boxShadow: '0 22px 48px rgba(14, 165, 233, 0.45)',
          cursor: 'pointer',
        }}
      >
        📱
      </button>
    </div>
  );
};

export default FloatingContactFab;

