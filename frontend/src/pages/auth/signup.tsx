import Head from 'next/head';
import { signIn } from 'next-auth/react';
import { ChangeEvent, FormEvent, useEffect, useMemo, useRef, useState } from 'react';

type ToastState = { message: string; type?: 'success' | 'error' } | null;

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

const scorePassword = (pw: string) => {
  let score = 0;
  if (!pw) return 0;
  const letters: Record<string, number> = {};
  for (let i = 0; i < pw.length; i += 1) {
    letters[pw[i]] = (letters[pw[i]] || 0) + 1;
    score += 5.0 / letters[pw[i]];
  }
  const variations = {
    digits: /\d/.test(pw),
    lower: /[a-z]/.test(pw),
    upper: /[A-Z]/.test(pw),
    nonWords: /[^\w]/.test(pw),
  };
  let variationCount = 0;
  Object.keys(variations).forEach((key) => {
    variationCount += variations[key as keyof typeof variations] ? 1 : 0;
  });
  score += (variationCount - 1) * 10;
  return Math.min(100, Math.floor(score));
};

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
    const particles = Array.from({ length: 70 }).map(() => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 2 + 0.7,
      vx: (Math.random() - 0.5) * 0.28,
      vy: (Math.random() - 0.5) * 0.28,
    }));

    let frame = 0;
    const step = () => {
      frame = requestAnimationFrame(step);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = 'rgba(255,255,255,0.7)';
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

const SignUpPage = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [toast, setToast] = useState<ToastState>(null);
  const [loading, setLoading] = useState(false);
  const [background, setBackground] = useState(() => (typeof window !== 'undefined' ? localStorage.getItem('mngfx-auth-bg-signup') : null));

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 2500);
    return () => clearTimeout(timer);
  }, [toast]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const saved = localStorage.getItem('mngfx-auth-bg-signup');
    if (saved) {
      setBackground(saved);
    }
  }, []);

  const strengthScore = scorePassword(password);
  const strengthBars = useMemo(() => {
    if (strengthScore > 75) return { filled: 4, color: '#22c55e', label: 'Strong' };
    if (strengthScore > 50) return { filled: 3, color: '#eab308', label: 'Good' };
    if (strengthScore > 25) return { filled: 2, color: '#f97316', label: 'Weak' };
    if (strengthScore > 0) return { filled: 1, color: '#ef4444', label: 'Very weak' };
    return { filled: 0, color: 'rgba(255,255,255,0.3)', label: '—' };
  }, [strengthScore]);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      setToast({ message: 'Please complete all fields', type: 'error' });
      return;
    }
    if (!EMAIL_REGEX.test(email)) {
      setToast({ message: 'Enter a valid email address', type: 'error' });
      return;
    }
    if (password.length < 8) {
      setToast({ message: 'Password must be at least 8 characters', type: 'error' });
      return;
    }
    if (password !== confirmPassword) {
      setToast({ message: "Passwords don't match", type: 'error' });
      return;
    }
    if (!acceptTerms) {
      setToast({ message: 'Please accept the terms', type: 'error' });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${apiBase}/api/auth/register/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          first_name: firstName,
          last_name: lastName,
          email,
          password,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.error || 'Registration failed');
      }

      setToast({ message: 'Account created! Logging you in…', type: 'success' });

      const result = await signIn('credentials', {
        redirect: false,
        email,
        password,
        callbackUrl: '/',
      });

      if (result?.error) {
        setToast({ message: result.error, type: 'error' });
      } else if (result?.ok) {
        window.location.href = result.url || '/';
      }
    } catch (error: any) {
      setToast({ message: error?.message || 'Registration failed', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleBackgroundApply = (url: string) => {
    if (typeof window === 'undefined') return;
    localStorage.setItem('mngfx-auth-bg-signup', url);
    setBackground(url);
  };

  const handleBackgroundReset = () => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem('mngfx-auth-bg-signup');
    setBackground(null);
  };

  const floatingClass = (active: boolean) => ['auth-label', active && 'auth-label--active'].filter(Boolean).join(' ');

  return (
    <>
      <Head>
        <title>Create account — MngFX Academy</title>
      </Head>
      <div
        className="auth-page"
        style={{
          // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
          ['--auth-active-bg' as string]: background ? `url(${background})` : 'var(--auth-bg-image-signup)',
        }}
      >
        <div className="auth-background" />
        <ParticlesBackground />
        <div className="auth-aurora auth-aurora--one" />
        <div className="auth-aurora auth-aurora--two" />

        <div className="auth-container">
          <section className="auth-card" style={{ maxWidth: 640 }}>
            <header className="auth-card-header">
              <div className="auth-logo">
                <img src="/logo.svg" alt="MngFX" width={32} height={32} />
              </div>
              <h1 className="auth-title">Create your account</h1>
              <p className="auth-subtitle">Start your journey with tailored FX education</p>
            </header>

            <form className="auth-form auth-grid-two" onSubmit={handleSubmit}>
              <div className="auth-field">
                <label className={floatingClass(Boolean(firstName))}>First name</label>
                <input
                  className="auth-input"
                  value={firstName}
                  onChange={(event: ChangeEvent<HTMLInputElement>) => setFirstName(event.target.value)}
                  autoComplete="given-name"
                />
              </div>
              <div className="auth-field">
                <label className={floatingClass(Boolean(lastName))}>Last name</label>
                <input
                  className="auth-input"
                  value={lastName}
                  onChange={(event: ChangeEvent<HTMLInputElement>) => setLastName(event.target.value)}
                  autoComplete="family-name"
                />
              </div>
              <div className="auth-field" style={{ gridColumn: 'span 2' }}>
                <label className={floatingClass(Boolean(email))}>Email</label>
                <input
                  className="auth-input"
                  type="email"
                  value={email}
                  onChange={(event: ChangeEvent<HTMLInputElement>) => setEmail(event.target.value)}
                  autoComplete="email"
                />
              </div>
              <div className="auth-field" style={{ gridColumn: 'span 2' }}>
                <label className={floatingClass(Boolean(password))}>Password</label>
                <input
                  className="auth-input"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(event: ChangeEvent<HTMLInputElement>) => setPassword(event.target.value)}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  className="auth-toggle"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
                <div className="auth-strength">
                  {Array.from({ length: 4 }).map((_, index) => (
                    <div
                      // eslint-disable-next-line react/no-array-index-key
                      key={index}
                      className="auth-strength-bar"
                      style={{ background: index < strengthBars.filled ? strengthBars.color : undefined }}
                    />
                  ))}
                </div>
                <p className="auth-strength-text">Strength: {strengthBars.label}</p>
              </div>
              <div className="auth-field" style={{ gridColumn: 'span 2' }}>
                <label className={floatingClass(Boolean(confirmPassword))}>Confirm password</label>
                <input
                  className="auth-input"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(event: ChangeEvent<HTMLInputElement>) => setConfirmPassword(event.target.value)}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  className="auth-toggle"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                  aria-label="Toggle confirm password visibility"
                >
                  {showConfirmPassword ? 'Hide' : 'Show'}
                </button>
              </div>
              <div style={{ gridColumn: 'span 2' }}>
                <label className="auth-remember">
                  <span>
                    <input
                      className="auth-checkbox"
                      type="checkbox"
                      checked={acceptTerms}
                      onChange={(event) => setAcceptTerms(event.target.checked)}
                    />{' '}
                    I agree to the Terms
                  </span>
                </label>
              </div>
              <div style={{ gridColumn: 'span 2' }}>
                <button className="auth-button" type="submit" disabled={loading}>
                  {loading ? 'Creating account…' : 'Create account'}
                </button>
              </div>
            </form>

            <p className="auth-switch">
              Already have an account? <a href="/auth/signin">Sign in</a>
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

SignUpPage.disableLayout = true;

export default SignUpPage;

