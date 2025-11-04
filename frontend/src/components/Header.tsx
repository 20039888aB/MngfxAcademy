import Link from 'next/link';
import { useRouter } from 'next/router';
import { signIn, signOut, useSession } from 'next-auth/react';
import { useEffect, useRef, useState } from 'react';

import ThemeToggle from './ThemeToggle';

const Header = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const [materialsOpen, setMaterialsOpen] = useState(false);
  const materialsRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
      if (materialsRef.current && !materialsRef.current.contains(event.target as Node)) {
        setMaterialsOpen(false);
      }
    };

    window.addEventListener('mousedown', handleClickOutside);
    return () => window.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    setMaterialsOpen(false);
    setMenuOpen(false);
  }, [router.pathname]);

  const isActive = (path: string) => router.pathname === path;
  const identitySource = (session?.user?.name || '').trim() || session?.user?.email || 'FX';
  const initials = identitySource
    .split(/[\s@._-]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join('') || 'FX';
  const learningRoutes = ['/resources', '/today-forex-special', '/mng-browser'];
  const isMaterialsActive = learningRoutes.includes(router.pathname);

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
              <div ref={materialsRef} style={{ position: 'relative' }}>
                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false);
                    setMaterialsOpen((prev) => !prev);
                  }}
                  aria-haspopup="true"
                  aria-expanded={materialsOpen}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.45rem',
                    padding: '0.45rem 0.9rem',
                    borderRadius: '999px',
                    border: '1px solid rgba(59, 130, 246, 0.35)',
                    background: isMaterialsActive || materialsOpen ? 'rgba(59, 130, 246, 0.18)' : 'rgba(15, 23, 42, 0.35)',
                    color: '#e2e8f0',
                    fontWeight: 600,
                    cursor: 'pointer',
                    minWidth: '56px',
                  }}
                >
                  <span>Learning Materials</span>
                  <span style={{ display: 'inline-block', transform: materialsOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}>
                    ▾
                  </span>
                </button>
                {materialsOpen && (
                  <div
                    style={{
                      position: 'absolute',
                      top: 'calc(100% + 0.6rem)',
                      right: 0,
                      width: '250px',
                      background: 'rgba(15, 23, 42, 0.96)',
                      borderRadius: '18px',
                      padding: '1rem',
                      boxShadow: '0 24px 48px rgba(15, 23, 42, 0.45)',
                      border: '1px solid rgba(59, 130, 246, 0.4)',
                      backdropFilter: 'blur(18px)',
                      display: 'grid',
                      gap: '0.65rem',
                      zIndex: 50,
                    }}
                  >
                    <Link
                      href="/resources"
                      onClick={() => setMaterialsOpen(false)}
                      style={{
                        padding: '0.65rem 0.75rem',
                        borderRadius: '12px',
                        background: 'rgba(59, 130, 246, 0.18)',
                        color: '#bfdbfe',
                        textDecoration: 'none',
                        fontWeight: 600,
                      }}
                    >
                      Resources Library
                    </Link>
                    <Link
                      href="/today-forex-special"
                      onClick={() => setMaterialsOpen(false)}
                      style={{
                        padding: '0.65rem 0.75rem',
                        borderRadius: '12px',
                        background: 'rgba(148, 163, 184, 0.12)',
                        color: '#e2e8f0',
                        textDecoration: 'none',
                        fontWeight: 600,
                      }}
                    >
                      Study Guide: Notes & Insights
                    </Link>
                    <Link
                      href="/mng-browser"
                      onClick={() => setMaterialsOpen(false)}
                      style={{
                        padding: '0.65rem 0.75rem',
                        borderRadius: '12px',
                        background: 'rgba(34, 197, 94, 0.14)',
                        color: '#bbf7d0',
                        textDecoration: 'none',
                        fontWeight: 600,
                      }}
                    >
                      Mng Browser
                    </Link>
                  </div>
                )}
              </div>
              <Link href="/analytics" className={isActive('/analytics') ? 'nav-active' : ''}>
                Analytics
              </Link>
            </>
          )}
        </nav>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
          <ThemeToggle />
          {status === 'authenticated' ? (
            <div ref={menuRef} style={{ position: 'relative' }}>
              <button
                type="button"
                onClick={() => setMenuOpen((prev) => !prev)}
                aria-haspopup="true"
                aria-expanded={menuOpen}
                aria-label="Account menu"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.65rem',
                  background: 'rgba(15, 23, 42, 0.55)',
                  border: '1px solid rgba(148, 163, 184, 0.3)',
                  padding: '0.45rem 0.85rem',
                  borderRadius: '999px',
                  color: '#e2e8f0',
                  cursor: 'pointer',
                  minWidth: '56px',
                }}
              >
                <span
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: 'rgba(59, 130, 246, 0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 600,
                  }}
                >
                  {initials}
                </span>
                <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>{session?.user?.name || 'Account'}</span>
                <span style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                  <span style={{ width: '14px', height: '2px', background: '#e2e8f0', borderRadius: '999px' }} />
                  <span style={{ width: '14px', height: '2px', background: '#e2e8f0', borderRadius: '999px' }} />
                  <span style={{ width: '14px', height: '2px', background: '#e2e8f0', borderRadius: '999px' }} />
                </span>
              </button>
              {menuOpen && (
                <div
                  style={{
                    position: 'absolute',
                    top: 'calc(100% + 0.75rem)',
                    right: 0,
                    width: '260px',
                    background: 'rgba(15, 23, 42, 0.96)',
                    borderRadius: '20px',
                    padding: '1.25rem',
                    boxShadow: '0 28px 60px rgba(15, 23, 42, 0.45)',
                    backdropFilter: 'blur(18px)',
                    border: '1px solid rgba(59, 130, 246, 0.4)',
                    display: 'grid',
                    gap: '1rem',
                    zIndex: 60,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                    <span
                      style={{
                        width: '52px',
                        height: '52px',
                        borderRadius: '50%',
                        background: 'rgba(59, 130, 246, 0.2)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 700,
                        fontSize: '1.1rem',
                      }}
                    >
                      {initials}
                    </span>
                    <div>
                      <strong style={{ display: 'block', color: '#e2e8f0' }}>{session?.user?.name || 'Trader'}</strong>
                      <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>{session?.user?.email}</span>
                    </div>
                  </div>
                  <div style={{ display: 'grid', gap: '0.65rem' }}>
                    <Link
                      href="/profile"
                      style={{
                        display: 'block',
                        padding: '0.65rem 0.85rem',
                        borderRadius: '12px',
                        background: 'rgba(59, 130, 246, 0.15)',
                        color: '#38bdf8',
                        textDecoration: 'none',
                        fontWeight: 600,
                      }}
                      onClick={() => setMenuOpen(false)}
                    >
                      Manage profile
                    </Link>
                    <Link
                      href="/analytics"
                      style={{
                        display: 'block',
                        padding: '0.65rem 0.85rem',
                        borderRadius: '12px',
                        background: 'rgba(148, 163, 184, 0.12)',
                        color: '#e2e8f0',
                        textDecoration: 'none',
                        fontWeight: 500,
                      }}
                      onClick={() => setMenuOpen(false)}
                    >
                      View analytics
                    </Link>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setMenuOpen(false);
                      signOut();
                    }}
                    style={{
                      padding: '0.65rem 0.85rem',
                      borderRadius: '12px',
                      background: 'linear-gradient(135deg, #f87171, #ef4444)',
                      color: '#fff',
                      border: 'none',
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    Sign out
                  </button>
                </div>
              )}
            </div>
          ) : (
            mounted && (
              <button
                className="btn-primary"
                style={{ padding: '0.5rem 1.2rem', fontSize: '0.95rem' }}
                onClick={() => signIn()}
              >
                Sign in
              </button>
            )
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;

