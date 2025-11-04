import Head from 'next/head';
import { useEffect, useMemo, useState } from 'react';

import { todayForexSlides } from '@/data/todayForexSlides';
import { useRequireAuth } from '@/hooks/useRequireAuth';

const TodayForexSpecialPage = () => {
  const status = useRequireAuth();
  const [index, setIndex] = useState(0);
  const [animating, setAnimating] = useState(false);

  const activeSlide = useMemo(() => todayForexSlides[index], [index]);

  const handleNext = () => {
    if (animating) return;
    setAnimating(true);
    setIndex((prev) => (prev + 1) % todayForexSlides.length);
  };

  const handlePrev = () => {
    if (animating) return;
    setAnimating(true);
    setIndex((prev) => (prev - 1 + todayForexSlides.length) % todayForexSlides.length);
  };

  useEffect(() => {
    if (!animating) return;
    const timeout = setTimeout(() => setAnimating(false), 320);
    return () => clearTimeout(timeout);
  }, [animating]);

  if (status === 'loading') {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span>Preparing Today Forex Special…</span>
      </div>
    );
  }

  if (status !== 'authenticated') {
    return null;
  }

  return (
    <>
      <Head>
        <title>Today Forex Special | MngFX Academy</title>
      </Head>
      <section
        style={{
          minHeight: '80vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          overflow: 'hidden',
          borderRadius: '32px',
          padding: '3rem 1.5rem',
          background: '#0f172a',
        }}
      >
        <img
          key={activeSlide.id}
          src={activeSlide.background}
          alt={activeSlide.title}
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            filter: 'blur(6px) brightness(0.55)',
            transform: animating ? 'scale(1.05)' : 'scale(1.02)',
            transition: 'all 0.35s ease',
          }}
        />
        <div
          style={{
            position: 'relative',
            zIndex: 2,
            width: '100%',
            maxWidth: '940px',
            color: '#f8fafc',
            background: 'rgba(15, 23, 42, 0.72)',
            borderRadius: '28px',
            padding: '2.8rem',
            boxShadow: '0 35px 60px rgba(15, 23, 42, 0.4)',
            backdropFilter: 'blur(18px)',
            WebkitBackdropFilter: 'blur(18px)',
            border: '1px solid rgba(148,163,184,0.25)',
            transition: 'transform 0.35s ease',
            transform: animating ? 'translateX(12px)' : 'translateX(0px)',
          }}
        >
          <header style={{ marginBottom: '1.75rem' }}>
            <p style={{ letterSpacing: '0.28em', fontSize: '0.75rem', color: 'rgba(148,163,184,0.7)', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
              Today Forex Special — Supply & Demand Liquidity Playbook
            </p>
            <h1 style={{ margin: 0, fontSize: '2.4rem', lineHeight: 1.15 }}>{activeSlide.title}</h1>
            {activeSlide.subtitle && (
              <p style={{ marginTop: '0.65rem', color: 'rgba(226,232,240,0.85)' }}>{activeSlide.subtitle}</p>
            )}
          </header>
          <ul style={{ display: 'grid', gap: '0.75rem', margin: 0, padding: 0, listStyle: 'none' }}>
            {activeSlide.bullets.map((item, idx) => (
              <li key={idx} style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                <span style={{ fontSize: '1.2rem', color: '#38bdf8', marginTop: '0.1rem' }}>•</span>
                <span style={{ color: 'rgba(226,232,240,0.92)' }}>{item}</span>
              </li>
            ))}
          </ul>

          {activeSlide.references && (
            <div style={{ marginTop: '1.75rem', display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
              {activeSlide.references.map((ref) => (
                <a
                  key={ref.url}
                  href={ref.url}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    padding: '0.55rem 0.95rem',
                    borderRadius: '999px',
                    border: '1px solid rgba(148,163,184,0.3)',
                    color: '#38bdf8',
                    fontSize: '0.85rem',
                  }}
                >
                  {ref.label}
                </a>
              ))}
            </div>
          )}

          <footer style={{ marginTop: '2.2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ color: 'rgba(148,163,184,0.85)' }}>
              Slide {index + 1} of {todayForexSlides.length}
            </div>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button
                type="button"
                onClick={handlePrev}
                className="btn-primary"
                style={{ padding: '0.6rem 1.3rem' }}
              >
                ← Prev
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="btn-primary"
                style={{ padding: '0.6rem 1.3rem' }}
              >
                Next →
              </button>
            </div>
          </footer>
        </div>
      </section>
    </>
  );
};

TodayForexSpecialPage.disableLayout = false;

export default TodayForexSpecialPage;

