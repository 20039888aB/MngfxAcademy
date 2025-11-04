import Link from 'next/link';
import { useRouter } from 'next/router';
import { signIn, signOut, useSession } from 'next-auth/react';
import { useEffect, useRef, useState } from 'react';

import ThemeToggle from './ThemeToggle';

const Header = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);
  const contactRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (contactRef.current && !contactRef.current.contains(event.target as Node)) {
        setContactOpen(false);
      }
    };

    window.addEventListener('mousedown', handleClickOutside);
    return () => window.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isActive = (path: string) => router.pathname === path;

  return (
    <header
      style={{
        position: 'fixed',
        top: 0,
        width: '100%',
        zIndex: 100,
        backdropFilter: 'blur(16px)',
        borderBottom: '1px solid rgba(148, 163, 184, 0.12)',
      }}
    >
      <div
        className="container"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '1.1rem 1.5rem',
        }}
      >
        <Link href="/">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontWeight: 700 }}>
            <img src="/MngFx%20Academy%20logo.png" alt="MngFX" width={44} height={44} style={{ borderRadius: '12px' }} />
            <span>MngFX Academy</span>
          </div>
        </Link>

        <nav
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1.2rem',
            flexWrap: 'wrap',
            justifyContent: 'center',
          }}
        >
          <Link href="/" className={isActive('/') ? 'nav-active' : ''}>
            Home
          </Link>
          {status === 'authenticated' && (
            <>
              <Link href="/market" className={isActive('/market') ? 'nav-active' : ''}>
                Live Charts
              </Link>
              <Link href="/resources" className={isActive('/resources') ? 'nav-active' : ''}>
                Resources
              </Link>
              <Link href="/analytics" className={isActive('/analytics') ? 'nav-active' : ''}>
                Analytics
              </Link>
              <Link href="/today-forex-special" className={isActive('/today-forex-special') ? 'nav-active' : ''}>
                Today FX Special
              </Link>
              <Link href="/profile" className={isActive('/profile') ? 'nav-active' : ''}>
                Profile
              </Link>
              <div ref={contactRef} style={{ position: 'relative' }}>
                <button
                  type="button"
                  onClick={() => setContactOpen((prev) => !prev)}
                  aria-haspopup="true"
                  aria-expanded={contactOpen}
                  aria-label="Contact options"
                  style={{
                    background: 'rgba(59, 130, 246, 0.18)',
                    border: '1px solid rgba(59, 130, 246, 0.4)',
                    color: '#2563eb',
                    padding: '0.55rem 0.85rem',
                    borderRadius: '999px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.45rem',
                    cursor: 'pointer',
                    minWidth: '48px',
                  }}
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                  >
                    <path
                      d="M5.5 3.5C5.5 3.22386 5.72386 3 6 3H9.1C9.32559 3 9.51947 3.14926 9.57639 3.36754L10.8764 8.36754C10.9399 8.61618 10.8122 8.87322 10.5764 8.97361L8.57071 9.82353C9.48054 12.2774 11.7226 14.5195 14.1765 15.4293L15.0264 13.4236C15.1268 13.1878 15.3838 13.0601 15.6325 13.1236L20.6325 14.4236C20.8507 14.4805 21 14.6744 21 14.9V18C21 18.2761 20.7761 18.5 20.5 18.5H18C11.3726 18.5 5.5 12.6274 5.5 6V3.5Z"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>Contact</span>
                </button>
                {contactOpen && (
                  <div
                    style={{
                      position: 'absolute',
                      top: 'calc(100% + 0.5rem)',
                      right: 0,
                      width: '220px',
                      background: 'rgba(15, 23, 42, 0.92)',
                      borderRadius: '18px',
                      padding: '1rem',
                      boxShadow: '0 25px 50px rgba(15, 23, 42, 0.35)',
                      backdropFilter: 'blur(18px)',
                      border: '1px solid rgba(59, 130, 246, 0.35)',
                      display: 'grid',
                      gap: '0.75rem',
                      zIndex: 30,
                    }}
                  >
                    <a href="tel:+254115138594" style={{ color: '#e0f2fe', textDecoration: 'none' }}>
                      📞 Call +254&nbsp;115&nbsp;138&nbsp;594
                    </a>
                    <a
                      href="https://wa.me/254115138594?text=Hi%20MngFX%20Academy"
                      target="_blank"
                      rel="noreferrer"
                      style={{ color: '#e0f2fe', textDecoration: 'none' }}
                    >
                      💬 WhatsApp Chat
                    </a>
                    <Link href="/contact" style={{ color: '#38bdf8', textDecoration: 'none' }}>
                      ✉️ Leave a review
                    </Link>
                  </div>
                )}
              </div>
            </>
          )}
        </nav>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
          <ThemeToggle />
          {mounted && (
            <button
              className="btn-primary"
              style={{ padding: '0.5rem 1.2rem', fontSize: '0.95rem' }}
              onClick={() => (status === 'authenticated' ? signOut() : signIn())}
            >
              {status === 'authenticated' ? 'Sign out' : 'Sign in'}
            </button>
          )}
          {status === 'authenticated' && session?.user?.name && (
            <span style={{ fontSize: '0.9rem', color: '#64748b' }}>{session.user.name}</span>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;

