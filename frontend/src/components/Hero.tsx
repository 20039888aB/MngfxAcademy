import Link from 'next/link';

const Hero = () => {
  return (
    <section className="hero">
      <div className="container hero-content">
        <div className="grid grid-2" style={{ alignItems: 'center', gap: '2.5rem' }}>
          <div>
            <h1 style={{ fontSize: '3rem', marginBottom: '1.5rem', lineHeight: 1.1 }}>
              Learn Forex with live data, AI mentorship & immersive experiences.
            </h1>
            <p style={{ fontSize: '1.1rem', color: '#475569', maxWidth: '540px', marginBottom: '2rem' }}>
              Track real-time FX markets, complete guided lessons, and chat with an AI trading coach. Voice-enabled conversations keep you focused on the charts.
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
                  border: '1px solid rgba(37, 99, 235, 0.3)',
                  color: '#2563eb',
                  fontWeight: 600,
                  background: 'rgba(37, 99, 235, 0.08)',
                }}
              >
                Ask the AI Mentor
              </Link>
            </div>
            <div style={{ marginTop: '2.5rem', display: 'grid', gap: '0.75rem', color: '#64748b' }}>
              <span>✅ Structured courses with progress tracking (coming next sprint)</span>
              <span>✅ OAuth via Google & Meta (Instagram) for frictionless onboarding</span>
              <span>✅ Voice-first AI assistant for hands-free coaching</span>
            </div>
          </div>
          <div>
            <div className="card" style={{ textAlign: 'center' }}>
              <h3 style={{ marginBottom: '1rem' }}>Lightning-fast insight</h3>
              <p style={{ color: '#64748b', marginBottom: '1.5rem' }}>
                Combine TradingView visuals with our real-time lightweight charting engine for the best of both worlds.
              </p>
              <div
                style={{
                  width: '100%',
                  height: '260px',
                  borderRadius: '12px',
                  background: 'radial-gradient(circle at top left, rgba(37,99,235,0.45), transparent), radial-gradient(circle at bottom right, rgba(14,165,233,0.35), transparent)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#1e293b',
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

