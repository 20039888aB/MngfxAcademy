import Head from 'next/head';

import LiveChart from '@/components/LiveChart';

const MarketPage = () => {
  return (
    <>
      <Head>
        <title>Live FX Charts | MngFX Academy</title>
      </Head>
      <section style={{ padding: '2rem 0 4rem' }}>
        <h1 className="section-title">EUR/USD Lightweight Candles</h1>
        <p className="section-subtitle">Streaming synthetic ticks from the Django backend via Channels.</p>
        <div className="card">
          <LiveChart symbol="EURUSD" />
        </div>
      </section>
      <section style={{ paddingBottom: '4rem' }}>
        <div className="card">
          <h2 style={{ marginTop: 0 }}>How it works</h2>
          <p style={{ color: '#64748b' }}>
            We publish high-frequency demo ticks through a Django management command, broadcast them with Channels, and
            convert them into one-minute candles. Replace that publisher with your broker feed to go live.
          </p>
        </div>
      </section>
    </>
  );
};

export default MarketPage;

