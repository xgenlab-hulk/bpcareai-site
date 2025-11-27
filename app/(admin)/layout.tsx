/**
 * Admin Layout
 * Independent root layout for admin pages
 * Does NOT include the public website Header/Footer
 * This layout replaces the root layout for all /admin/* routes
 */
import { Inter } from 'next/font/google';
import '../globals.css';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { SessionProvider } from '@/components/providers/SessionProvider';
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
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
    template: '%s | BPCare AI Admin',
    default: 'Admin Panel | BPCare AI',
  },
  robots: {
    index: false,  // Never index admin pages
    follow: false,
  },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Server-side authentication check
  const session = await auth();

  if (!session) {
    redirect('/auth/signin');
  }

  return (
    <html lang="en" className={inter.variable}>
      <body className={`${inter.className} antialiased`}>
        <SessionProvider>
          <div className="flex h-screen overflow-hidden bg-gray-100">
            {/* Sidebar */}
            <AdminSidebar />

            {/* Main Content Area */}
            <div className="flex flex-1 flex-col overflow-hidden">
              {/* Top Bar */}
              <header className="bg-white shadow-sm">
                <div className="flex h-16 items-center justify-between px-6">
                  <h2 className="text-lg font-semibold text-gray-800">
                    Admin Panel
                  </h2>
                  <div className="text-sm text-gray-500">
                    {new Date().toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </div>
                </div>
              </header>

              {/* Page Content */}
              <main className="flex-1 overflow-y-auto p-6">
                {children}
              </main>
            </div>
          </div>
        </SessionProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
