import Link from 'next/link';
import DownloadButton from '@/components/DownloadButton';

interface CTAButtonProps {
  href: string;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'accent';
  external?: boolean;
  size?: 'default' | 'large';
  animated?: boolean;
  className?: string;
  /** 埋点用的位置标识；指向 App Store 时必填，否则无法区分入口 */
  ctaPosition?: string;
}

export default function CTAButton({
  href,
  children,
  variant = 'primary',
  external = false,
  size = 'default',
  animated = false,
  className = '',
  ctaPosition = 'cta_button',
}: CTAButtonProps) {
  const sizeClasses = size === 'large'
    ? 'px-6 py-4 text-base sm:px-10 sm:py-5 sm:text-xl min-h-[48px]'
    : 'px-6 py-3.5 text-base sm:px-8 sm:py-4 sm:text-lg min-h-[44px]';

  const baseClasses = `inline-flex items-center justify-center rounded-full font-semibold transition-all duration-200 hover:shadow-lg whitespace-nowrap ${sizeClasses}`;

  const variantClasses = {
    primary: 'bg-gray-900 text-white hover:bg-gray-800 hover:scale-105',
    secondary: 'bg-white text-brand-blue-dark border-2 border-brand-blue hover:bg-brand-blue/5',
    accent: 'bg-gradient-to-r from-red-500 to-red-600 text-white hover:scale-105 hover:from-red-600 hover:to-red-700',
  };

  const animationClass = animated ? 'animate-pulse-glow' : '';

  const combinedClasses = `${baseClasses} ${variantClasses[variant]} ${animationClass} ${className}`;

  // 指向 App Store 的外链一律走 DownloadButton：
  // 桌面端弹二维码、安卓提示不支持、iOS 直跳，并统一带上 campaign token。
  // 在这里统一拦截，好过在 5 个首页组件里各改一遍（漏一个就是一个无归因入口）。
  if (external && href.includes('apps.apple.com')) {
    return (
      <DownloadButton position={ctaPosition} className={combinedClasses}>
        {children}
      </DownloadButton>
    );
  }

  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={combinedClasses}
      >
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={combinedClasses}>
      {children}
    </Link>
  );
}
