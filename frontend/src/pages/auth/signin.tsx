import { getProviders, signIn } from 'next-auth/react';
import { FormEvent, useEffect, useState } from 'react';

type ProviderRecord = Awaited<ReturnType<typeof getProviders>>;

const SignInPage = () => {
  const [providers, setProviders] = useState<ProviderRecord>(null);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');

  useEffect(() => {
    getProviders().then(setProviders).catch(() => setProviders(null));
  }, []);

  const providerList = providers ? Object.values(providers) : [];
  const credentialsProvider = providerList.find((provider) => provider.id === 'credentials');

  const handleCredentialsLogin = async (event: FormEvent) => {
    event.preventDefault();
    if (!email) return;

    await signIn('credentials', {
      email,
      name,
      callbackUrl: '/',
    });
  };

  return (
    <div className="container" style={{ padding: '6rem 0' }}>
      <div className="card" style={{ maxWidth: 520, margin: '0 auto' }}>
        <h1 style={{ marginBottom: '1rem' }}>Sign in to MngFX Academy</h1>
        <p style={{ marginBottom: '2rem', color: '#64748b' }}>
          Choose a provider below. For local testing you can use the development email option.
        </p>

        {credentialsProvider && (
          <form onSubmit={handleCredentialsLogin} style={{ marginBottom: '2rem', display: 'grid', gap: '0.75rem' }}>
            <label>
              <span style={{ display: 'block', marginBottom: '0.25rem' }}>Email</span>
              <input
                type="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  borderRadius: '12px',
                  border: '1px solid rgba(148, 163, 184, 0.35)',
                  background: 'rgba(255, 255, 255, 0.95)',
                }}
              />
            </label>
            <label>
              <span style={{ display: 'block', marginBottom: '0.25rem' }}>Name</span>
              <input
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  borderRadius: '12px',
                  border: '1px solid rgba(148, 163, 184, 0.35)',
                  background: 'rgba(255, 255, 255, 0.95)',
                }}
              />
            </label>
            <button type="submit" className="btn-primary" style={{ width: '100%' }}>
              Continue with Email (Dev)
            </button>
          </form>
        )}

        {providerList
          .filter((provider) => provider.id !== 'credentials')
          .map((provider) => (
            <button
              key={provider.id}
              onClick={() => signIn(provider.id)}
              className="btn-primary"
              style={{ width: '100%', marginBottom: '0.75rem' }}
            >
              Continue with {provider.name}
            </button>
          ))}
      </div>
    </div>
  );
};

export default SignInPage;

