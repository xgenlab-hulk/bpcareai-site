'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (path: string) => {
    if (path === '/#faqs') {
      // FAQs never highlights (acts as a quick navigation link)
      return false;
    }
    return pathname === path;
  };

  const getLinkClass = (path: string) => {
    const baseClass = "text-base font-medium transition-colors";
    return isActive(path)
      ? `${baseClass} text-brand-blue-dark font-semibold`
      : `${baseClass} text-gray-600 hover:text-brand-blue-dark`;
  };

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200/50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14 sm:h-16 md:h-18">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 sm:space-x-3 hover:opacity-80 transition-opacity">
            <Image
              src="/AppIcon.png"
              alt="BPCare AI"
              width={36}
              height={36}
              className="rounded-xl md:w-10 md:h-10"
            />
            <span className="text-lg md:text-xl font-bold text-gray-900">BPCare AI</span>
          </Link>

          {/* Desktop Navigation - Centered */}
          <div className="hidden md:flex items-center justify-center flex-1 mx-8">
            <div className="flex items-center space-x-10">
              <Link href="/" className={getLinkClass('/')}>
                Home
              </Link>
              <Link href="/articles" className={getLinkClass('/articles')}>
                Articles
              </Link>
              <Link href="/#faqs" className={getLinkClass('/#faqs')}>
                FAQs
              </Link>
              <Link href="/about" className={getLinkClass('/about')}>
                About
              </Link>
              <Link href="/contact" className={getLinkClass('/contact')}>
                Contact
              </Link>
            </div>
          </div>

          {/* Download Button */}
          <div className="hidden md:block">
            <a
              href="https://apps.apple.com/us/app/bpcare-ai-heart-rate-monitor/id6748299186"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gradient-to-r from-brand-blue to-brand-purple text-white text-sm px-5 py-2.5 rounded-full font-semibold hover:shadow-lg transition-all duration-200"
            >
              Download App
            </a>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <svg className="w-6 h-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile Navigation Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-100 py-4 animate-fade-in-up">
            <div className="flex flex-col space-y-3">
              <Link
                href="/"
                className={`py-2 transition-colors ${
                  isActive('/')
                    ? 'text-brand-blue-dark font-semibold text-base'
                    : 'text-gray-600 hover:text-brand-blue-dark font-medium text-base'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                href="/articles"
                className={`py-2 transition-colors ${
                  isActive('/articles')
                    ? 'text-brand-blue-dark font-semibold text-base'
                    : 'text-gray-600 hover:text-brand-blue-dark font-medium text-base'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Articles
              </Link>
              <Link
                href="/#faqs"
                className="text-gray-600 hover:text-brand-blue-dark font-medium text-base py-2 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                FAQs
              </Link>
              <Link
                href="/about"
                className={`py-2 transition-colors ${
                  isActive('/about')
                    ? 'text-brand-blue-dark font-semibold text-base'
                    : 'text-gray-600 hover:text-brand-blue-dark font-medium text-base'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </Link>
              <Link
                href="/contact"
                className={`py-2 transition-colors ${
                  isActive('/contact')
                    ? 'text-brand-blue-dark font-semibold text-base'
                    : 'text-gray-600 hover:text-brand-blue-dark font-medium text-base'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </Link>
              <a
                href="https://apps.apple.com/us/app/bpcare-ai-heart-rate-monitor/id6748299186"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gradient-to-r from-brand-blue to-brand-purple text-white text-sm px-5 py-2.5 rounded-full font-semibold text-center hover:shadow-lg transition-all duration-200"
              >
                Download App
              </a>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
