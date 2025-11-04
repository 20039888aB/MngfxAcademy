const Footer = () => {
  return (
    <footer className="footer">
      <div className="container" style={{ display: 'grid', gap: '1.5rem' }}>
        <div className="footer-brand">
          <img src="/logo.svg" alt="MngFX Academy" className="footer-logo" />
          <div>
            <div>MngFX Academy</div>
            <small style={{ color: '#94a3b8' }}>Master the markets with data-driven learning.</small>
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1.5rem' }}>
          <div>
            <strong>Navigate</strong>
            <div style={{ marginTop: '0.75rem', display: 'grid', gap: '0.5rem' }}>
              <a href="/">Home</a>
              <a href="/market">Live Charts</a>
              <a href="/chat">AI Assistant</a>
            </div>
          </div>
          <div>
            <strong>Legal</strong>
            <div style={{ marginTop: '0.75rem', display: 'grid', gap: '0.5rem' }}>
              <a href="#">Privacy Policy</a>
              <a href="#">Terms of Use</a>
            </div>
          </div>
          <div>
            <strong>Connect</strong>
            <div className="social" style={{ marginTop: '0.75rem' }}>
              <a href="https://twitter.com" aria-label="Twitter" target="_blank" rel="noreferrer">🐦</a>
              <a href="https://facebook.com" aria-label="Facebook" target="_blank" rel="noreferrer">📘</a>
              <a href="mailto:hello@mngfx.academy" aria-label="Email">✉️</a>
            </div>
          </div>
        </div>
        <hr style={{ borderColor: 'rgba(148, 163, 184, 0.2)' }} />
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0.5rem',
            fontSize: '0.9rem',
            color: '#94a3b8',
            textAlign: 'center',
          }}
        >
          <span>© 2025 MngFX Academy. All rights reserved.</span>
          <span>Empowering traders with immersive education & real-time intelligence.</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

