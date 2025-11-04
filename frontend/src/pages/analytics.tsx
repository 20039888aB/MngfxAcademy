import Head from 'next/head';
import { FormEvent, useMemo, useState } from 'react';
import { useSession } from 'next-auth/react';
import useSWR from 'swr';

import { useRequireAuth } from '@/hooks/useRequireAuth';

const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

const fetcher = async (url: string, token: string) => {
  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) {
    throw new Error('Unable to load progress data');
  }
  return response.json();
};

const AnalyticsPage = () => {
  const status = useRequireAuth();
  const { data: session } = useSession();
  const token = session?.djangoTokens?.access;
  const { data, mutate, error } = useSWR(
    token ? [`${apiBase}/api/auth/progress/summary/`, token] : null,
    ([url, authToken]) => fetcher(url, authToken as string)
  );
  const [saving, setSaving] = useState(false);
  const [formState, setFormState] = useState({
    courses_completed: 0,
    lessons_completed: 0,
    quizzes_passed: 0,
    win_rate: 0,
  });

  if (status === 'loading') {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span>Loading analytics…</span>
      </div>
    );
  }

  if (status !== 'authenticated') {
    return null;
  }

  const latest = data?.latest;
  const history = data?.history || [];

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!token) return;
    setSaving(true);
    try {
      const response = await fetch(`${apiBase}/api/auth/progress/`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formState),
      });
      if (!response.ok) {
        throw new Error('Unable to save progress');
      }
      setFormState({ courses_completed: 0, lessons_completed: 0, quizzes_passed: 0, win_rate: 0 });
      await mutate();
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const chartMax = useMemo(() => {
    if (!history.length) return 1;
    return Math.max(...history.map((item: any) => Number(item.win_rate) || 0), 1);
  }, [history]);

  return (
    <>
      <Head>
        <title>Progress analytics | MngFX Academy</title>
      </Head>
      <section className="container" style={{ paddingTop: '2rem', paddingBottom: '4rem', maxWidth: '1080px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
          <div>
            <h1 className="section-title" style={{ marginBottom: '0.25rem' }}>
              Track your progress
            </h1>
            <p className="section-subtitle" style={{ marginBottom: 0 }}>
              Log completions and monitor your momentum across courses, lessons and simulations.
            </p>
          </div>
          <a href="#progress-form" className="btn-primary">
            Track your progress here
          </a>
        </div>

        <div className="grid" style={{ gap: '2rem', marginTop: '2.5rem' }}>
          <div className="card" style={{ display: 'grid', gap: '1.5rem' }}>
            <h2 style={{ marginTop: 0 }}>Latest snapshot</h2>
            {error && <p style={{ color: '#ef4444' }}>Failed to load analytics.</p>}
            {latest ? (
              <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))' }}>
                <SummaryTile label="Courses completed" value={latest.courses_completed} />
                <SummaryTile label="Lessons completed" value={latest.lessons_completed} />
                <SummaryTile label="Quizzes passed" value={latest.quizzes_passed} />
                <SummaryTile label="Win rate" value={`${latest.win_rate}%`} />
              </div>
            ) : (
              <p style={{ color: '#64748b' }}>No analytics logged yet. Add your first snapshot below.</p>
            )}
          </div>

          <div className="card">
            <h2 style={{ marginTop: 0 }}>Win rate timeline</h2>
            {history.length === 0 ? (
              <p style={{ color: '#64748b' }}>Progress entries will appear here once you start tracking.</p>
            ) : (
              <div style={{ height: '240px', display: 'flex', alignItems: 'flex-end', gap: '0.8rem' }}>
                {history
                  .slice()
                  .reverse()
                  .map((snapshot: any) => {
                    const height = (Number(snapshot.win_rate) / chartMax) * 100;
                    return (
                      <div key={snapshot.id} style={{ flex: 1, textAlign: 'center' }}>
                        <div
                          style={{
                            height: `${height || 8}%`,
                            minHeight: '8%',
                            background: 'linear-gradient(180deg, #38bdf8, #6366f1)',
                            borderRadius: '12px 12px 4px 4px',
                          }}
                        />
                        <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                          {new Date(snapshot.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    );
                  })}
              </div>
            )}
          </div>

          <div className="card" id="progress-form">
            <h2 style={{ marginTop: 0 }}>Log a snapshot</h2>
            <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
              <NumberField
                label="Courses completed"
                name="courses_completed"
                value={formState.courses_completed}
                onChange={(value) => setFormState((prev) => ({ ...prev, courses_completed: value }))}
              />
              <NumberField
                label="Lessons completed"
                name="lessons_completed"
                value={formState.lessons_completed}
                onChange={(value) => setFormState((prev) => ({ ...prev, lessons_completed: value }))}
              />
              <NumberField
                label="Quizzes passed"
                name="quizzes_passed"
                value={formState.quizzes_passed}
                onChange={(value) => setFormState((prev) => ({ ...prev, quizzes_passed: value }))}
              />
              <NumberField
                label="Win rate (%)"
                name="win_rate"
                value={formState.win_rate}
                onChange={(value) => setFormState((prev) => ({ ...prev, win_rate: value }))}
                step="0.1"
              />
              <div style={{ gridColumn: '1 / -1' }}>
                <button className="btn-primary" type="submit" disabled={saving}>
                  {saving ? 'Saving…' : 'Save snapshot'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </>
  );
};

const SummaryTile = ({ label, value }: { label: string; value: number | string }) => (
  <div
    style={{
      padding: '1.2rem',
      borderRadius: '18px',
      background: 'rgba(248, 250, 252, 0.75)',
      boxShadow: '0 22px 40px rgba(15,23,42,0.1)',
    }}
  >
    <p style={{ margin: 0, color: '#64748b', fontSize: '0.85rem' }}>{label}</p>
    <p style={{ margin: '0.5rem 0 0', fontWeight: 700, fontSize: '1.75rem' }}>{value}</p>
  </div>
);

const NumberField = ({
  label,
  name,
  value,
  onChange,
  step = '1',
}: {
  label: string;
  name: string;
  value: number;
  onChange: (value: number) => void;
  step?: string;
}) => (
  <label style={{ display: 'grid', gap: '0.5rem' }}>
    <span style={{ fontWeight: 600 }}>{label}</span>
    <input
      type="number"
      name={name}
      value={value}
      step={step}
      min={0}
      onChange={(event) => onChange(Number(event.target.value))}
      className="auth-input"
      style={{ width: '100%' }}
      required
    />
  </label>
);

AnalyticsPage.disableLayout = false;

export default AnalyticsPage;

