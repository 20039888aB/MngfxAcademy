import { useEffect, useRef, useState } from 'react';

const phoneNumber = '+254115138594';
const waLink = 'https://wa.me/254115138594?text=Hi%20MngFX%20Academy';

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
      }}
    >
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-haspopup="true"
        aria-expanded={open}
        aria-label="Contact options"
        style={{
          width: '70px',
          height: '70px',
          borderRadius: '50%',
          border: 'none',
          background: 'linear-gradient(135deg, #14b8a6, #22d3ee)',
          color: '#ecfeff',
          fontSize: '2rem',
          boxShadow: '0 26px 48px rgba(20, 184, 166, 0.45)',
          cursor: 'pointer',
        }}
      >
        📞
      </button>
      {open && (
        <div
          style={{
            position: 'absolute',
            bottom: 'calc(100% + 1.1rem)',
            right: 0,
            background: 'rgba(15, 23, 42, 0.97)',
            borderRadius: '22px',
            padding: '1.2rem',
            width: '250px',
            boxShadow: '0 30px 64px rgba(15, 23, 42, 0.5)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(20, 184, 166, 0.4)',
            display: 'grid',
            gap: '0.9rem',
          }}
        >
          <div style={{ color: '#a5f3fc', fontWeight: 600, fontSize: '0.95rem' }}>Call, chat or leave a note</div>
          <a
            href={`tel:${phoneNumber}`}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '0.7rem 0.9rem',
              borderRadius: '16px',
              background: 'rgba(15, 118, 110, 0.28)',
              color: '#f0fdfa',
              textDecoration: 'none',
              fontWeight: 600,
            }}
          >
            📱 Call +254&nbsp;115&nbsp;138&nbsp;594
          </a>
          <a
            href={waLink}
            target="_blank"
            rel="noreferrer"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '0.7rem 0.9rem',
              borderRadius: '16px',
              background: 'rgba(8, 145, 178, 0.28)',
              color: '#cffafe',
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
              padding: '0.7rem 0.9rem',
              borderRadius: '16px',
              background: 'rgba(148, 163, 184, 0.15)',
              color: '#e2e8f0',
              textDecoration: 'none',
              fontWeight: 600,
            }}
          >
            ✉️ Leave an inquiry
          </a>
        </div>
      )}
    </div>
  );
};

export default FloatingContactFab;

