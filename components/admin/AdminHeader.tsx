'use client';

/**
 * Admin Header
 * 顶部栏，包含汉堡菜单按钮（移动端）
 */
import { Menu } from 'lucide-react';
import { useAdminLayout } from './AdminLayoutProvider';

export function AdminHeader() {
  const { toggleMobileMenu } = useAdminLayout();

  return (
    <header className="bg-white shadow-sm">
      <div className="flex h-16 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-3">
          {/* 移动端汉堡菜单按钮 */}
          <button
            onClick={toggleMobileMenu}
            className="md:hidden rounded-lg p-2 hover:bg-gray-100 transition-colors"
            aria-label="Open menu"
          >
            <Menu className="h-6 w-6 text-gray-700" />
          </button>

          <h2 className="text-lg font-semibold text-gray-800">Admin Panel</h2>
        </div>

        <div className="hidden md:block text-sm text-gray-500">
          {new Date().toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </div>
      </div>
    </header>
  );
}
