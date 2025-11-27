/**
 * Sign In Page
 * Authentication page for admin panel access
 * Route: /auth/signin
 */
import { Suspense } from 'react';
import { SignInForm } from '@/components/admin/SignInForm';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sign In | BPCare AI Admin',
  description: 'Sign in to access the BPCare AI admin panel',
  robots: {
    index: false,  // Don't index admin pages
    follow: false,
  },
};

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Suspense fallback={<div>Loading...</div>}>
        <SignInForm />
      </Suspense>
    </div>
  );
}
