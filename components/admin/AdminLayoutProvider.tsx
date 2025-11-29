'use client';

/**
 * Admin Layout Provider
 * 管理后台布局状态：侧边栏展开/收起、移动端菜单
 */
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface AdminLayoutContextType {
  sidebarCollapsed: boolean;
  mobileMenuOpen: boolean;
  toggleSidebar: () => void;
  toggleMobileMenu: () => void;
  closeMobileMenu: () => void;
}

const AdminLayoutContext = createContext<AdminLayoutContextType | undefined>(undefined);

export function AdminLayoutProvider({ children }: { children: ReactNode }) {
  // 桌面端侧边栏收起状态（从 localStorage 读取）
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // 移动端菜单打开状态
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // 从 localStorage 恢复状态
  useEffect(() => {
    const saved = localStorage.getItem('admin-sidebar-collapsed');
    if (saved !== null) {
      setSidebarCollapsed(saved === 'true');
    }
  }, []);

  // 切换桌面端侧边栏
  const toggleSidebar = () => {
    setSidebarCollapsed((prev) => {
      const newValue = !prev;
      localStorage.setItem('admin-sidebar-collapsed', String(newValue));
      return newValue;
    });
  };

  // 切换移动端菜单
  const toggleMobileMenu = () => {
    setMobileMenuOpen((prev) => !prev);
  };

  // 关闭移动端菜单
  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  // 监听 ESC 键关闭移动菜单
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && mobileMenuOpen) {
        closeMobileMenu();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [mobileMenuOpen]);

  // 移动菜单打开时禁止 body 滚动
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  return (
    <AdminLayoutContext.Provider
      value={{
        sidebarCollapsed,
        mobileMenuOpen,
        toggleSidebar,
        toggleMobileMenu,
        closeMobileMenu,
      }}
    >
      {children}
    </AdminLayoutContext.Provider>
  );
}

export function useAdminLayout() {
  const context = useContext(AdminLayoutContext);
  if (context === undefined) {
    throw new Error('useAdminLayout must be used within AdminLayoutProvider');
  }
  return context;
}
