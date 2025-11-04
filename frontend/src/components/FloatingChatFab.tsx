import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

const FloatingChatFab = () => {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || router.pathname === '/chat') {
    return null;
  }

  return (
    <button
      type="button"
      onClick={() => router.push('/chat')}
      aria-label="Open AI assistant"
      style={{
        position: 'fixed',
        bottom: '2.5rem',
        right: '2.5rem',
        width: '64px',
        height: '64px',
        borderRadius: '50%',
        border: 'none',
        background: 'linear-gradient(135deg, #2563eb, #7c3aed)',
        color: '#fff',
        fontSize: '1.75rem',
        boxShadow: '0 18px 40px rgba(37, 99, 235, 0.45)',
        cursor: 'pointer',
        zIndex: 120,
      }}
    >
      🤖
    </button>
  );
};

export default FloatingChatFab;

