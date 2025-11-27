/**
 * NextAuth.js v5 Configuration
 * Central authentication configuration - required by NextAuth v5
 *
 * This file MUST be in the root directory
 * All auth-related exports come from here
 */
import NextAuth from 'next-auth';
import { authConfig } from '@/lib/auth/config';

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);

// Export GET and POST handlers for the API route
export const { GET, POST } = handlers;
