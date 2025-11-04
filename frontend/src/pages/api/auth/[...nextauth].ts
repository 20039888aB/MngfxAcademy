import axios from 'axios';
import NextAuth from 'next-auth';
import FacebookProvider from 'next-auth/providers/facebook';
import GoogleProvider from 'next-auth/providers/google';

if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
  console.warn('Missing Google OAuth credentials. Set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET.');
}

if (!process.env.FACEBOOK_CLIENT_ID || !process.env.FACEBOOK_CLIENT_SECRET) {
  console.warn('Missing Facebook OAuth credentials. Set FACEBOOK_CLIENT_ID and FACEBOOK_CLIENT_SECRET.');
}

const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
const nextAuthSecret = process.env.NEXTAUTH_SECRET || 'development-secret-change-me';

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? '',
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID ?? '',
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET ?? '',
    }),
  ],
  session: { strategy: 'jwt' },
  callbacks: {
    async signIn({ user, account }) {
      if (!account) return false;

      try {
        if (!apiBase) {
          console.error('API base URL is not configured. Set NEXT_PUBLIC_API_URL.');
          return false;
        }

        if (!account.access_token) {
          console.warn(`No access token returned from provider ${account.provider}.`);
        }

        const { data } = await axios.post(
          `${apiBase}/api/auth/social-exchange/`,
          {
            provider: account.provider,
            access_token: account.access_token,
            profile: {
              name: user.name,
              email: user.email,
              picture: user.image,
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
      }
      return session;
    },
  },
  secret: nextAuthSecret,
});

export default handler;

