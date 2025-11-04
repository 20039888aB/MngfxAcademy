import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';

const slides = [
  encodeURI('/bg1 (2).jpeg'),
  encodeURI('/bg 3.jpeg'),
  encodeURI('/BMW M5 WALLPAPER 💙🖼.jpeg'),
  encodeURI('/WALL STREET WALLPAPER.jpeg'),
];

const Hero = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(id);
  }, []);

  const renderedSlides = useMemo(
    () =>
      slides.map((src, index) => (
        <div
          key={src}
          className={`hero-slide ${index === activeIndex ? 'hero-slide--active' : ''}`}
          style={{ backgroundImage: `url(${src})` }}
        />
      )),
    [activeIndex]
  );

  return (
    <section className="hero">
      <div className="hero-slideshow">{renderedSlides}</div>
      <div className="container hero-content">
        <div className="grid grid-2" style={{ alignItems: 'center', gap: '2.5rem' }}>
          <div>
            <h1 style={{ fontSize: '3rem', marginBottom: '1.5rem', lineHeight: 1.05, color: '#f8fafc' }}>
              Learn Forex with live data, AI mentorship & immersive experiences.
            </h1>
            <p style={{ fontSize: '1.05rem', color: 'rgba(226,232,240,0.88)', maxWidth: '540px', marginBottom: '2rem' }}>
              Track real-time FX markets, complete guided lessons, and chat with an AI trading coach. Voice-enabled
              conversations keep you focused on the charts.
            </p>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <Link href="/market" className="btn-primary">
                Launch Live Charts
              </Link>
              <Link
                href="/chat"
                style={{
                  borderRadius: '9999px',
                  padding: '0.75rem 1.5rem',
                  border: '1px solid rgba(255,255,255,0.5)',
                  color: '#f8fafc',
                  fontWeight: 600,
                  background: 'rgba(248, 250, 252, 0.14)',
                }}
              >
                Ask the AI Mentor
              </Link>
            </div>
            <div style={{ marginTop: '2.5rem', display: 'grid', gap: '0.75rem', color: 'rgba(226,232,240,0.88)' }}>
              <span>✅ Structured courses with live analytics personalised to you</span>
              <span>✅ OAuth via Google & Meta for frictionless onboarding</span>
              <span>✅ Voice-first AI assistant for hands-free coaching</span>
            </div>
          </div>
          <div>
            <div className="card" style={{ textAlign: 'left', background: 'rgba(15,23,42,0.78)', color: '#f8fafc' }}>
              <h3 style={{ marginBottom: '1rem' }}>Lightning-fast insight</h3>
              <p style={{ color: 'rgba(226,232,240,0.78)', marginBottom: '1.5rem' }}>
                Combine TradingView visuals with our real-time lightweight charting engine. Switch layouts, annotate, and
                capture market playbooks that sync with your learning roadmap.
              </p>
              <div
                style={{
                  width: '100%',
                  height: '260px',
                  borderRadius: '12px',
                  background:
                    'radial-gradient(circle at top left, rgba(37,99,235,0.55), transparent), radial-gradient(circle at bottom right, rgba(168,85,247,0.45), transparent)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#0f172a',
                  fontWeight: 600,
                  letterSpacing: '0.08em',
                }}
              >
                LIVE MARKET SNAPSHOT
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;

