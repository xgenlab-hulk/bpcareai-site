'use client';

/**
 * Admin Sidebar Navigation
 * 响应式侧边栏，支持桌面端收起/展开和移动端抽屉模式
 */
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils/cn';
import {
  LayoutDashboard,
  FileText,
  Tag,
  BarChart3,
  Settings,
  LogOut,
  Clock,
  X,
} from 'lucide-react';
import { signOut } from 'next-auth/react';
import { useAdminLayout } from './AdminLayoutProvider';

const navigationItems = [
  {
    name: 'Dashboard',
    href: '/admin',
    icon: LayoutDashboard,
  },
  {
    name: 'Articles',
    href: '/admin/articles',
    icon: FileText,
  },
  {
    name: 'Planned Articles',
    href: '/admin/topics/planned',
    icon: Clock,
  },
  {
    name: 'Topics',
    href: '/admin/topics',
    icon: Tag,
  },
  {
    name: 'SEO Analytics',
    href: '/admin/seo',
    icon: BarChart3,
  },
  {
    name: 'Settings',
    href: '/admin/settings',
    icon: Settings,
  },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const { sidebarCollapsed, mobileMenuOpen, closeMobileMenu } = useAdminLayout();

  const handleSignOut = () => {
    signOut({ callbackUrl: '/auth/signin' });
  };

  const handleNavClick = () => {
    // 移动端点击导航项后关闭菜单
    if (mobileMenuOpen) {
      closeMobileMenu();
    }
  };

  return (
    <>
      {/* 移动端遮罩层 */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={closeMobileMenu}
          aria-hidden="true"
        />
      )}

      {/* 侧边栏 */}
      <aside
        className={cn(
          'flex h-full flex-col bg-gray-900 text-white transition-all duration-300',
          // 桌面端：可收起
          'hidden md:flex',
          sidebarCollapsed ? 'w-16' : 'w-64',
          // 移动端：固定抽屉
          'fixed inset-y-0 left-0 z-50 md:static',
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        )}
      >
        {/* Logo / Header */}
        <div className="flex h-16 items-center justify-center border-b border-gray-800 px-4">
          {sidebarCollapsed ? (
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 text-lg font-bold">
              B
            </div>
          ) : (
            <div className="flex items-center justify-between w-full">
              <h1 className="text-xl font-bold">BPCare AI Admin</h1>
              {/* 移动端关闭按钮 */}
              <button
                onClick={closeMobileMenu}
                className="md:hidden rounded-lg p-1 hover:bg-gray-800"
                aria-label="Close menu"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 px-2 py-4 overflow-y-auto">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');

            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={handleNavClick}
                className={cn(
                  'group flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-gray-800 text-white'
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white',
                  sidebarCollapsed && 'justify-center'
                )}
                title={sidebarCollapsed ? item.name : undefined}
              >
                <Icon
                  className={cn(
                    'h-5 w-5 flex-shrink-0',
                    isActive ? 'text-white' : 'text-gray-400 group-hover:text-white',
                    !sidebarCollapsed && 'mr-3'
                  )}
                />
                {!sidebarCollapsed && <span>{item.name}</span>}
              </Link>
            );
          })}
        </nav>

        {/* User & Sign Out */}
        <div className="border-t border-gray-800 p-4">
          {!sidebarCollapsed ? (
            <>
              <div className="mb-3 text-sm">
                <div className="font-medium">Admin User</div>
                <div className="text-xs text-gray-400">admin@bpcareai.com</div>
              </div>
              <button
                onClick={handleSignOut}
                className="flex w-full items-center rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
              >
                <LogOut className="mr-3 h-5 w-5" />
                Sign Out
              </button>
            </>
          ) : (
            <button
              onClick={handleSignOut}
              className="flex w-full items-center justify-center rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
              title="Sign Out"
            >
              <LogOut className="h-5 w-5" />
            </button>
          )}
        </div>
      </aside>
    </>
  );
}
