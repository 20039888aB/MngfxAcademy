import Head from 'next/head';

import Hero from '@/components/Hero';
import TradingViewEmbed from '@/components/TradingViewEmbed';

const HomePage = () => {
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
        <h2 className="section-title">TradingView Pulse</h2>
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

