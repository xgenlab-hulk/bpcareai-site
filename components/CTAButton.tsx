import Link from 'next/link';

interface CTAButtonProps {
  href: string;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
  external?: boolean;
}

export default function CTAButton({
  href,
  children,
  variant = 'primary',
  external = false
}: CTAButtonProps) {
  const baseClasses = "inline-flex items-center justify-center px-8 py-4 rounded-full font-semibold text-lg transition-all duration-200 hover:shadow-lg";
  const variantClasses = variant === 'primary'
    ? "bg-gradient-to-r from-brand-blue to-brand-purple text-white hover:scale-105"
    : "bg-white text-brand-blue-dark border-2 border-brand-blue hover:bg-brand-blue/5";

  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={`${baseClasses} ${variantClasses}`}
      >
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={`${baseClasses} ${variantClasses}`}>
      {children}
    </Link>
  );
}
