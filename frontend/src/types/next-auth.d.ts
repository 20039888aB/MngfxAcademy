import NextAuth, { DefaultSession } from 'next-auth';
import { JWT } from 'next-auth/jwt';

declare module 'next-auth' {
  interface Session {
    djangoTokens?: {
      access: string;
      refresh: string;
      user: {
        id: number;
        email: string;
        name: string;
        provider: string;
      };
    };
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    djangoTokens?: {
      access: string;
      refresh: string;
      user: {
        id: number;
        email: string;
        name: string;
        provider: string;
      };
    };
  }
}

