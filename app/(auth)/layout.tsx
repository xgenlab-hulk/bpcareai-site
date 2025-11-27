/**
 * Auth Layout
 * Independent root layout for authentication pages
 * Does NOT include the public website Header/Footer
 * This layout replaces the root layout for all /auth/* routes
 */
import { Inter } from 'next/font/google';
import '../globals.css';
import type { Metadata } from 'next';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: {
    template: '%s | BPCare AI',
    default: 'Sign In | BPCare AI',
  },
  robots: {
    index: false,  // Never index auth pages
    follow: false,
  },
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className={`${inter.className} antialiased min-h-screen bg-gray-50`}>
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
