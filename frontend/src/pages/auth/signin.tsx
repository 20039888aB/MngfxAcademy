import Head from 'next/head';
import { getProviders, signIn } from 'next-auth/react';
import { ChangeEvent, FormEvent, useEffect, useMemo, useRef, useState } from 'react';

type ProviderRecord = Awaited<ReturnType<typeof getProviders>>;

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

type ToastState = { message: string; type?: 'success' | 'error' } | null;

const ParticlesBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const DPR = Math.min(window.devicePixelRatio || 1, 2);
    const resize = () => {
      canvas.width = Math.floor(canvas.clientWidth * DPR);
      canvas.height = Math.floor(canvas.clientHeight * DPR);
    };

    resize();
    const particles = Array.from({ length: 60 }).map(() => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 2 + 0.6,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
    }));

    let frame = 0;
    const step = () => {
      frame = requestAnimationFrame(step);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = 'rgba(255,255,255,0.75)';
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      });
    };

    window.addEventListener('resize', resize);
    step();

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="auth-particles" />;
};

const SettingsPanel = ({ background, onApply, onReset }: { background: string; onApply: (url: string) => void; onReset: () => void }) => {
  const [value, setValue] = useState(background);

  useEffect(() => {
    setValue(background);
  }, [background]);

  return (
    <div className="auth-settings">
      <input value={value} onChange={(event) => setValue(event.target.value)} placeholder="Background image URL" />
      <button type="button" onClick={() => value && onApply(value)}>
        Apply
      </button>
      <button type="button" onClick={onReset}>
        Reset
      </button>
    </div>
  );
};

const SignInPage = () => {
  const [providers, setProviders] = useState<ProviderRecord>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<ToastState>(null);
  const [background, setBackground] = useState(() => (typeof window !== 'undefined' ? localStorage.getItem('mngfx-auth-bg') : null));

  useEffect(() => {
    getProviders().then(setProviders).catch(() => setProviders(null));
  }, []);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 2500);
    return () => clearTimeout(timer);
  }, [toast]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const saved = localStorage.getItem('mngfx-auth-bg');
    if (saved) {
      setBackground(saved);
    }
  }, []);

  const providerList = providers ? Object.values(providers) : [];
  const credentialsProvider = providerList.find((provider) => provider.id === 'credentials');

  const handleCredentialsLogin = async (event: FormEvent) => {
    event.preventDefault();
    if (!EMAIL_REGEX.test(email)) {
      setToast({ message: 'Enter a valid email address', type: 'error' });
      return;
    }
    if (!password) {
      setToast({ message: 'Enter your password', type: 'error' });
      return;
    }

    setLoading(true);
    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,
      callbackUrl: '/',
    });
    setLoading(false);

    if (result?.error) {
      setToast({ message: result.error, type: 'error' });
      return;
    }

    if (remember && typeof window !== 'undefined') {
      localStorage.setItem('mngfx-auth-remember', email);
    }

    if (result?.ok) {
      window.location.href = result.url || '/';
    }
  };

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const saved = localStorage.getItem('mngfx-auth-remember');
    if (saved) {
      setEmail(saved);
      setRemember(true);
    }
  }, []);

  const handleBackgroundApply = (url: string) => {
    if (typeof window === 'undefined') return;
    localStorage.setItem('mngfx-auth-bg', url);
    setBackground(url);
  };

  const handleBackgroundReset = () => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem('mngfx-auth-bg');
    setBackground(null);
  };

  const floatingEmailClass = useMemo(() => ['auth-label', email && 'auth-label--active'].filter(Boolean).join(' '), [email]);
  const floatingPasswordClass = useMemo(() => ['auth-label', password && 'auth-label--active'].filter(Boolean).join(' '), [password]);

  return (
    <>
      <Head>
        <title>Sign in — MngFX Academy</title>
      </Head>
      <div
        className="auth-page"
        style={{
          // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
          ['--auth-active-bg' as string]: background ? `url(${background})` : 'var(--auth-bg-image-signin)',
        }}
      >
        <div className="auth-background" />
        <ParticlesBackground />
        <div className="auth-aurora auth-aurora--one" />
        <div className="auth-aurora auth-aurora--two" />

        <div className="auth-container">
          <section className="auth-card">
            <header className="auth-card-header">
              <div className="auth-logo">
                <img src="/logo.svg" alt="MngFX" width={32} height={32} />
              </div>
              <h1 className="auth-title">Welcome back</h1>
              <p className="auth-subtitle">Sign in to continue learning</p>
            </header>

            {credentialsProvider && (
              <form className="auth-form" onSubmit={handleCredentialsLogin}>
                <div className="auth-field">
                  <label className={floatingEmailClass}>Email</label>
                  <input
                    className="auth-input"
                    type="email"
                    value={email}
                    onChange={(event: ChangeEvent<HTMLInputElement>) => setEmail(event.target.value)}
                    autoComplete="email"
                  />
                </div>
                <div className="auth-field">
                  <label className={floatingPasswordClass}>Password</label>
                  <input
                    className="auth-input"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(event: ChangeEvent<HTMLInputElement>) => setPassword(event.target.value)}
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    className="auth-toggle"
                    onClick={() => setShowPassword((prev) => !prev)}
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? 'Hide' : 'Show'}
                  </button>
                </div>

                <div className="auth-remember">
                  <label>
                    <input
                      className="auth-checkbox"
                      type="checkbox"
                      checked={remember}
                      onChange={(event) => setRemember(event.target.checked)}
                    />{' '}
                    Remember me
                  </label>
                  <a className="auth-link" href="#">
                    Forgot password?
                  </a>
                </div>

                <button className="auth-button" type="submit" disabled={loading}>
                  {loading ? 'Signing in…' : 'Sign in'}
                </button>
              </form>
            )}

            {providerList.filter((provider) => provider.id !== 'credentials').length > 0 && (
              <>
                <div className="auth-divider">or continue with</div>
                <div className="auth-socials">
                  {providerList
                    .filter((provider) => provider.id !== 'credentials')
                    .map((provider) => (
                      <button
                        type="button"
                        key={provider.id}
                        className="auth-social-button"
                        onClick={() => signIn(provider.id, { callbackUrl: '/' })}
                      >
                        {provider.name}
                      </button>
                    ))}
                </div>
              </>
            )}

            <p className="auth-switch">
              No account? <a href="/auth/signup">Create one</a>
            </p>
          </section>
        </div>

        <SettingsPanel
          background={background || ''}
          onApply={handleBackgroundApply}
          onReset={handleBackgroundReset}
        />

        <div className={`auth-toast ${toast ? 'auth-toast--visible' : ''}`}>
          {toast?.message}
        </div>
      </div>
    </>
  );
};

SignInPage.disableLayout = true;

export default SignInPage;

