import Link from 'next/link';
import { useRouter } from 'next/router';
import { signIn, signOut, useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';

import ThemeToggle from './ThemeToggle';

const Header = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
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
            <img src="/logo.svg" alt="MngFX" width={40} height={40} />
            <span>MngFX Academy</span>
          </div>
        </Link>

        <nav style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <Link href="/" className={isActive('/') ? 'nav-active' : ''}>
            Home
          </Link>
          <Link href="/market" className={isActive('/market') ? 'nav-active' : ''}>
            Live Charts
          </Link>
          <Link href="/chat" className={isActive('/chat') ? 'nav-active' : ''}>
            AI Assistant
          </Link>
        </nav>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
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
        </div>
      </div>
    </header>
  );
};

export default Header;

