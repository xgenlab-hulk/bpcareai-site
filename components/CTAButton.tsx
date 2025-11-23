import Link from 'next/link';

interface CTAButtonProps {
  href: string;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'accent';
  external?: boolean;
  size?: 'default' | 'large';
  animated?: boolean;
  className?: string;
}

export default function CTAButton({
  href,
  children,
  variant = 'primary',
  external = false,
  size = 'default',
  animated = false,
  className = '',
}: CTAButtonProps) {
  const sizeClasses = size === 'large'
    ? 'px-10 py-5 text-xl'
    : 'px-8 py-4 text-lg';

  const baseClasses = `inline-flex items-center justify-center rounded-full font-semibold transition-all duration-200 hover:shadow-lg whitespace-nowrap ${sizeClasses}`;

  const variantClasses = {
    primary: 'bg-gradient-to-r from-brand-blue to-brand-purple text-white hover:scale-105',
    secondary: 'bg-white text-brand-blue-dark border-2 border-brand-blue hover:bg-brand-blue/5',
    accent: 'bg-gradient-to-r from-red-500 to-red-600 text-white hover:scale-105 hover:from-red-600 hover:to-red-700',
  };

  const animationClass = animated ? 'animate-pulse-glow' : '';

  const combinedClasses = `${baseClasses} ${variantClasses[variant]} ${animationClass} ${className}`;

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
