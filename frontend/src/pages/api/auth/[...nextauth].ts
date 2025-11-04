import axios from 'axios';
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import FacebookProvider from 'next-auth/providers/facebook';
import GoogleProvider from 'next-auth/providers/google';

const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
const nextAuthSecret = process.env.NEXTAUTH_SECRET || 'development-secret-change-me';

if (!process.env.NEXTAUTH_SECRET) {
  process.env.NEXTAUTH_SECRET = nextAuthSecret;
}

const providers = [] as any[];

if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  providers.push(
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    })
  );
} else {
  console.warn('Google OAuth disabled – missing GOOGLE_CLIENT_ID/GOOGLE_CLIENT_SECRET');
}

if (process.env.FACEBOOK_CLIENT_ID && process.env.FACEBOOK_CLIENT_SECRET) {
  providers.push(
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
    })
  );
} else {
  console.warn('Facebook/Instagram OAuth disabled – missing FACEBOOK_CLIENT_ID/FACEBOOK_CLIENT_SECRET');
}

providers.push(
  CredentialsProvider({
    name: 'Email Login (Dev)',
    credentials: {
      email: { label: 'Email', type: 'email', placeholder: 'you@example.com' },
      name: { label: 'Name', type: 'text', placeholder: 'Trader Jane' },
    },
    async authorize(credentials) {
      if (!credentials?.email) {
        return null;
      }

      return {
        id: credentials.email,
        email: credentials.email,
        name: credentials.name || credentials.email.split('@')[0],
      };
    },
  })
);

const handler = NextAuth({
  providers,
  session: { strategy: 'jwt' },
  callbacks: {
    async signIn({ user, account }) {
      if (!account) return false;

      try {
        if (!apiBase) {
          throw new Error('API base URL is not configured.');
        }

        const { data } = await axios.post(
          `${apiBase}/api/auth/social-exchange/`,
          {
            provider: account.provider,
            access_token: account.access_token ?? null,
            profile: {
              name: user?.name,
              email: user?.email,
              picture: user?.image,
            },
          },
          { withCredentials: true }
        );

        (account as any).djangoTokens = data;
        return true;
      } catch (error) {
        console.error('JWT exchange failed', error);
        return false;
      }
    },
    async jwt({ token, account }) {
      if (account && (account as any).djangoTokens) {
        token.djangoTokens = (account as any).djangoTokens;
      }
      return token;
    },
    async session({ session, token }) {
      if (token.djangoTokens) {
        session.djangoTokens = token.djangoTokens;
        session.user = {
          ...session.user,
          ...(token.djangoTokens.user || {}),
        };
      }
      return session;
    },
  },
  secret: nextAuthSecret,
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  debug: process.env.NODE_ENV !== 'production',
});

export default handler;

