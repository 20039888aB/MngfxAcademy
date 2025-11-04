import Head from 'next/head';
import { FormEvent, useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';

import { useRequireAuth } from '@/hooks/useRequireAuth';

const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

type FormState = {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  rating: number;
};

const defaultState: FormState = {
  name: '',
  email: '',
  phone: '',
  subject: '',
  message: '',
  rating: 5,
};

const ContactPage = () => {
  const status = useRequireAuth();
  const { data: session } = useSession();
  const [form, setForm] = useState<FormState>({
    ...defaultState,
    name: session?.user?.name || '',
    email: session?.user?.email || '',
  });
  useEffect(() => {
    setForm((prev) => ({
      ...prev,
      name: session?.user?.name || '',
      email: session?.user?.email || '',
    }));
  }, [session]);
  const [sending, setSending] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const token = session?.djangoTokens?.access;

  if (status === 'loading') {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span>Loading contact tools…</span>
      </div>
    );
  }

  if (status !== 'authenticated') {
    return null;
  }

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: name === 'rating' ? Number(value) : value }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSending(true);
    setFeedback(null);
    try {
      const response = await fetch(`${apiBase}/api/feedback/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(form),
      });
      if (!response.ok) {
        throw new Error('Failed to submit your message.');
      }
      setFeedback('Thanks for sharing! We will review your message shortly.');
      setForm({ ...defaultState, name: session?.user?.name || '', email: session?.user?.email || '' });
    } catch (error: any) {
      setFeedback(error.message || 'Something went wrong. Please try again.');
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      <Head>
        <title>Contact & Reviews | MngFX Academy</title>
      </Head>
      <section className="container" style={{ paddingTop: '2rem', paddingBottom: '4rem', maxWidth: '960px' }}>
        <h1 className="section-title">Let&apos;s connect</h1>
        <p className="section-subtitle" style={{ marginBottom: '2rem' }}>
          Share your wins, request coaching, or drop feedback. We aim to reply within one trading session.
        </p>

        <div className="grid" style={{ gap: '2rem' }}>
          <div className="card" style={{ padding: '2rem', display: 'grid', gap: '1.25rem' }}>
            <div>
              <h2 style={{ margin: 0 }}>Direct lines</h2>
              <p style={{ color: '#64748b', marginTop: '0.75rem' }}>
                Call or message us anytime on WhatsApp. We&apos;re aligned with the London and New York sessions.
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginTop: '1rem' }}>
                <a className="btn-primary" href="tel:+254115138594">
                  Call +254&nbsp;115&nbsp;138&nbsp;594
                </a>
                <a className="btn-primary" href="https://wa.me/254115138594?text=Hi%20MngFX%20Academy" target="_blank" rel="noreferrer">
                  WhatsApp us
                </a>
              </div>
            </div>

            <div>
              <h2 style={{ marginBottom: '0.5rem' }}>Send a review</h2>
              <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1rem' }}>
                <div className="grid" style={{ gap: '1rem', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
                  <label style={{ display: 'grid', gap: '0.35rem' }}>
                    <span style={{ fontWeight: 600 }}>Name</span>
                    <input name="name" value={form.name} onChange={handleChange} required className="auth-input" />
                  </label>
                  <label style={{ display: 'grid', gap: '0.35rem' }}>
                    <span style={{ fontWeight: 600 }}>Email</span>
                    <input name="email" type="email" value={form.email} onChange={handleChange} required className="auth-input" />
                  </label>
                  <label style={{ display: 'grid', gap: '0.35rem' }}>
                    <span style={{ fontWeight: 600 }}>Phone</span>
                    <input name="phone" value={form.phone} onChange={handleChange} placeholder="Optional" className="auth-input" />
                  </label>
                  <label style={{ display: 'grid', gap: '0.35rem' }}>
                    <span style={{ fontWeight: 600 }}>Rating</span>
                    <input
                      name="rating"
                      type="number"
                      min={1}
                      max={10}
                      value={form.rating}
                      onChange={handleChange}
                      className="auth-input"
                    />
                  </label>
                </div>
                <label style={{ display: 'grid', gap: '0.35rem' }}>
                  <span style={{ fontWeight: 600 }}>Subject</span>
                  <input
                    name="subject"
                    value={form.subject}
                    onChange={handleChange}
                    placeholder="What do you want to talk about?"
                    className="auth-input"
                  />
                </label>
                <label style={{ display: 'grid', gap: '0.35rem' }}>
                  <span style={{ fontWeight: 600 }}>Message</span>
                  <textarea
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    required
                    placeholder="Share feedback, wins, or areas you want us to focus on."
                    style={{ minHeight: '180px' }}
                    className="auth-input"
                  />
                </label>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                  <button className="btn-primary" type="submit" disabled={sending}>
                    {sending ? 'Sending…' : 'Submit review'}
                  </button>
                  {feedback && <span style={{ color: '#64748b' }}>{feedback}</span>}
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

ContactPage.disableLayout = false;

export default ContactPage;

