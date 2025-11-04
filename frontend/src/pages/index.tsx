import Head from 'next/head';
import { useSession } from 'next-auth/react';

import Hero from '@/components/Hero';
import TradingViewEmbed from '@/components/TradingViewEmbed';
import { useRequireAuth } from '@/hooks/useRequireAuth';

const HomePage = () => {
  const status = useRequireAuth();
  const { data: session } = useSession();

  if (status === 'loading') {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span>Loading dashboard…</span>
      </div>
    );
  }

  if (status !== 'authenticated') {
    return null;
  }

  return (
    <>
      <Head>
        <title>MngFX Academy | Learn, Trade, Grow</title>
        <meta
          name="description"
          content="Forex education platform with live market data, AI mentorship, and immersive charts."
        />
      </Head>
      <Hero />

      <section className="container" style={{ paddingBottom: '4rem' }}>
        <h2 className="section-title">TradingView Pulse{session?.user?.name ? ` — Welcome back, ${session.user.name}` : ''}</h2>
        <p className="section-subtitle">
          Monitor institutional-grade charts with your favorite indicators. Switch to the Live Charts section for our
          proprietary candle stream.
        </p>
        <div className="card">
          <TradingViewEmbed symbol="FX:EURUSD" />
        </div>
      </section>
    </>
  );
};

export default HomePage;

