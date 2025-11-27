/**
 * NextAuth.js v5 Configuration
 * Provides authentication for the admin panel using credentials (username/password)
 */
import type { NextAuthConfig } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

export const authConfig: NextAuthConfig = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: 'Username', type: 'text', placeholder: 'Username' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        // Validate credentials against environment variables
        if (
          credentials?.username === process.env.ADMIN_USERNAME &&
          credentials?.password === process.env.ADMIN_PASSWORD
        ) {
          // Return user object
          return {
            id: '1',
            name: process.env.ADMIN_USERNAME,
            email: 'admin@bpcareai.com',
          };
        }

        // Invalid credentials
        return null;
      },
    }),
  ],
  pages: {
    signIn: '/auth/signin',  // Custom sign-in page
  },
  session: {
    strategy: 'jwt',
    maxAge: 24 * 60 * 60,  // 24 hours
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnAdmin = nextUrl.pathname.startsWith('/admin');

      if (isOnAdmin) {
        if (isLoggedIn) return true;
        return false; // Redirect unauthenticated users to login page
      }

      return true; // Allow access to public routes
    },
  },
};
