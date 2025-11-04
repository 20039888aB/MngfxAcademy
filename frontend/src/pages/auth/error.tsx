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
    <div className="container" style={{ padding: '6rem 0' }}>
      <div className="card" style={{ maxWidth: 480, margin: '0 auto', textAlign: 'center' }}>
        <h1 style={{ marginBottom: '1rem' }}>Sign-in Error</h1>
        <p style={{ marginBottom: '2rem', color: '#dc2626' }}>{message}</p>
        <button className="btn-primary" onClick={() => push('/auth/signin')}>
          Back to Sign in
        </button>
      </div>
    </div>
  );
};

export default AuthErrorPage;

