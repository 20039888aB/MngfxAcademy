import Head from 'next/head';
import { FormEvent, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';

import { useRequireAuth } from '@/hooks/useRequireAuth';

const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

type SearchResult = {
  title: string;
  snippet: string;
  url: string;
  icon?: string | null;
};

const MngBrowserPage = () => {
  const status = useRequireAuth();
  const { data: session } = useSession();
  const router = useRouter();
  const token = session?.djangoTokens?.access;

  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [lastQuery, setLastQuery] = useState<string | null>(null);
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  const [aiPrompt, setAiPrompt] = useState('');
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [aiLoading, setAiLoading] = useState(false);

  const searchContext = useMemo(() => {
    if (!results.length) return '';
    return results
      .slice(0, 5)
      .map((item, idx) => `${idx + 1}. ${item.title} — ${item.snippet}`)
      .join('\n');
  }, [results]);

  const handleSearch = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!query.trim()) {
      setSearchError('Enter a topic or phrase to explore.');
      return;
    }
    if (!token) {
      setSearchError('Your session expired. Please sign in again.');
      return;
    }

    setSearching(true);
    setSearchError(null);
    setAiResponse(null);

    try {
      const response = await fetch(`${apiBase}/api/browser/search/?q=${encodeURIComponent(query.trim())}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error('Search failed');
      }
      const data = await response.json();
      setResults(data.results || []);
      setLastQuery(data.query || query);
    } catch (error) {
      console.error(error);
      setSearchError('Search service is currently unavailable. Please try again shortly.');
      setResults([]);
    } finally {
      setSearching(false);
    }
  };

  const handleAskAi = async () => {
    if (!aiPrompt.trim()) {
      setAiResponse('Ask a question first, then I will help.');
      return;
    }

    setAiLoading(true);
    setAiResponse(null);
    const payload = {
      message:
        aiPrompt.trim() +
        (searchContext
          ? `\n\nContext gathered from web search:\n${searchContext}`
          : ''),
    };

    try {
      const response = await fetch(`${apiBase}/api/chatbot/query/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      setAiResponse(data.reply || 'The assistant did not provide a reply.');
    } catch (error) {
      console.error(error);
      setAiResponse('Unable to reach the assistant. Please try again later.');
    } finally {
      setAiLoading(false);
    }
  };

  if (status === 'loading') {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span>Launching Mng Browser…</span>
      </div>
    );
  }

  if (status !== 'authenticated') {
    return null;
  }

  return (
    <>
      <Head>
        <title>Mng Browser | MngFX Academy</title>
      </Head>
      <section className="container" style={{ paddingTop: '2rem', paddingBottom: '4rem', maxWidth: '1100px' }}>
        <header style={{ display: 'grid', gap: '0.75rem', marginBottom: '2.5rem' }}>
          <h1 className="section-title" style={{ marginBottom: 0 }}>
            Mng Browser
          </h1>
          <p className="section-subtitle" style={{ maxWidth: '720px' }}>
            Search trusted sources, gather market intelligence, and loop your findings into the MngFX assistant for fast
            follow-up questions.
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', alignItems: 'center' }}>
            <span style={{ color: '#64748b' }}>Need to switch accounts?</span>
            <button
              type="button"
              onClick={() => router.push('/auth/signin')}
              className="btn-primary"
              style={{ padding: '0.45rem 1rem' }}
            >
              Sign in with email
            </button>
          </div>
        </header>

        <div className="card" style={{ padding: '2rem', display: 'grid', gap: '2rem' }}>
          <form onSubmit={handleSearch} style={{ display: 'grid', gap: '1rem' }}>
            <label style={{ display: 'grid', gap: '0.5rem' }}>
              <span style={{ fontWeight: 600 }}>Search the web</span>
              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Type a market, concept, indicator, or macro theme"
                  className="auth-input"
                  style={{ flex: 1, minWidth: '240px' }}
                />
                <button className="btn-primary" type="submit" disabled={searching}>
                  {searching ? 'Searching…' : 'Search'}
                </button>
              </div>
            </label>
            {searchError && <span style={{ color: '#f87171', fontSize: '0.9rem' }}>{searchError}</span>}
          </form>

          {results.length > 0 ? (
            <div style={{ display: 'grid', gap: '1rem' }}>
              <div style={{ color: '#94a3b8', fontSize: '0.9rem' }}>
                Showing {results.length} insight{results.length === 1 ? '' : 's'} for
                <strong> {lastQuery}</strong>
              </div>
              <div style={{ display: 'grid', gap: '1rem' }}>
                {results.map((item) => (
                  <article
                    key={`${item.url}-${item.title}`}
                    style={{
                      padding: '1.25rem',
                      borderRadius: '18px',
                      background: 'rgba(15, 23, 42, 0.65)',
                      border: '1px solid rgba(148, 163, 184, 0.25)',
                      boxShadow: '0 18px 40px rgba(15, 23, 42, 0.25)',
                    }}
                  >
                    <a href={item.url} target="_blank" rel="noreferrer" style={{ textDecoration: 'none' }}>
                      <h3 style={{ margin: 0, color: '#38bdf8' }}>{item.title}</h3>
                    </a>
                    <p style={{ marginTop: '0.45rem', color: '#e2e8f0', lineHeight: 1.5 }}>{item.snippet}</p>
                    <a href={item.url} target="_blank" rel="noreferrer" style={{ color: '#94a3b8', fontSize: '0.85rem' }}>
                      {item.url}
                    </a>
                  </article>
                ))}
              </div>
            </div>
          ) : (
            <div style={{ color: '#94a3b8', fontSize: '0.95rem' }}>
              Start with a keyword like “London session breakout strategy” or “price action liquidity sweep” to gather curated
              references.
            </div>
          )}
        </div>

        <div className="card" style={{ marginTop: '2rem', padding: '2rem', display: 'grid', gap: '1.25rem' }}>
          <div>
            <h2 style={{ margin: 0 }}>Ask the MngFX assistant</h2>
            <p style={{ color: '#94a3b8', marginTop: '0.4rem' }}>
              Blend live references with your AI tutor. The assistant will incorporate the latest search snippets when available.
            </p>
          </div>
          <textarea
            value={aiPrompt}
            onChange={(event) => setAiPrompt(event.target.value)}
            placeholder="e.g. Summarise the key liquidity concepts from the results above"
            className="auth-input"
            style={{ minHeight: '140px' }}
          />
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <button className="btn-primary" type="button" onClick={handleAskAi} disabled={aiLoading}>
              {aiLoading ? 'Asking…' : 'Ask the assistant'}
            </button>
            {aiResponse && <span style={{ color: '#38bdf8', fontSize: '0.9rem' }}>Response ready below.</span>}
          </div>
          {aiResponse && (
            <div
              style={{
                padding: '1.5rem',
                borderRadius: '18px',
                background: 'rgba(15, 118, 110, 0.18)',
                color: '#ecfeff',
                lineHeight: 1.6,
              }}
            >
              {aiResponse}
            </div>
          )}
        </div>
      </section>
    </>
  );
};

MngBrowserPage.disableLayout = false;

export default MngBrowserPage;

