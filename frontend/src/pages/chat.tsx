import Head from 'next/head';

import ChatBot from '@/components/ChatBot';

const ChatPage = () => {
  return (
    <>
      <Head>
        <title>AI Trading Mentor | MngFX Academy</title>
      </Head>
      <section style={{ padding: '2rem 0 4rem' }}>
        <h1 className="section-title">Voice-enabled AI Coach</h1>
        <p className="section-subtitle">
          Ask about strategy, risk management, or request a lesson summary. Responses run through our Django rule-based
          assistant for now; we can upgrade to vector search + LLM when you are ready.
        </p>
        <ChatBot />
      </section>
    </>
  );
};

export default ChatPage;

