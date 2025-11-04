import Head from 'next/head';
import { useRouter } from 'next/router';

const errorMessages: Record<string, string> = {
  OAuthSignin: 'Error constructing an authorization URL. Please try again.',
  OAuthCallback: 'OAuth callback failed. Check provider credentials or try again later.',
  OAuthCreateAccount: 'We could not create your account. Please contact support.',
  EmailCreateAccount: 'We could not send a magic link to your email.',
  Callback: 'The sign-in callback failed. Please try again.',
  OAuthAccountNotLinked: 'That email is already linked with another provider.',
  CredentialsSignin: 'Invalid login. Double-check your details.',
  SessionRequired: 'Please sign in to continue.',
  default: 'Something went wrong while signing you in.',
};

const AuthErrorPage = () => {
  const { query, push } = useRouter();
  const error = typeof query.error === 'string' ? query.error : 'default';
  const message = errorMessages[error] ?? errorMessages.default;

  return (
    <>
      <Head>
        <title>Sign-in error — MngFX Academy</title>
      </Head>
      <div
        className="auth-page"
        style={{
          // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
          ['--auth-active-bg' as string]: 'var(--auth-bg-image-signin)',
        }}
      >
        <div className="auth-background" />
        <div className="auth-aurora auth-aurora--one" />
        <div className="auth-aurora auth-aurora--two" />

        <div className="auth-container">
          <section className="auth-card" style={{ textAlign: 'center' }}>
            <header className="auth-card-header" style={{ marginBottom: '1.5rem' }}>
              <div className="auth-logo">
                <img src="/logo.svg" alt="MngFX" width={32} height={32} />
              </div>
              <h1 className="auth-title">Sign-in error</h1>
              <p className="auth-subtitle" style={{ color: '#f87171' }}>
                {message}
              </p>
            </header>

            <button type="button" className="auth-button" onClick={() => push('/auth/signin')}>
              Back to sign in
            </button>
          </section>
        </div>
      </div>
    </>
  );
};

AuthErrorPage.disableLayout = true;

export default AuthErrorPage;

