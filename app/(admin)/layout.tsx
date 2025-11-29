/**
 * Admin Layout
 * 响应式后台布局，支持桌面端可收起侧边栏和移动端抽屉
 */
import { Inter } from 'next/font/google';
import '../globals.css';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { AdminLayoutProvider } from '@/components/admin/AdminLayoutProvider';
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
    index: false, // Never index admin pages
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
          <AdminLayoutProvider>
            <div className="flex h-screen overflow-hidden bg-gray-100">
              {/* Sidebar - 响应式侧边栏 */}
              <AdminSidebar />

              {/* Main Content Area */}
              <div className="flex flex-1 flex-col overflow-hidden">
                {/* Top Bar - 包含菜单控制按钮 */}
                <AdminHeader />

                {/* Page Content */}
                <main className="flex-1 overflow-y-auto p-4 md:p-6">
                  {children}
                </main>
              </div>
            </div>
          </AdminLayoutProvider>
        </SessionProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
