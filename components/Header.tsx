'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200/50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14 md:h-16">
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

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-sm text-gray-700 hover:text-brand-blue-dark font-medium transition-colors">
              Home
            </Link>
            <Link href="/articles" className="text-sm text-gray-700 hover:text-brand-blue-dark font-medium transition-colors">
              Articles
            </Link>
            <Link href="/about" className="text-sm text-gray-700 hover:text-brand-blue-dark font-medium transition-colors">
              About
            </Link>
            <Link href="/contact" className="text-sm text-gray-700 hover:text-brand-blue-dark font-medium transition-colors">
              Contact
            </Link>
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
                className="text-sm text-gray-700 hover:text-brand-blue-dark font-medium py-2 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                href="/articles"
                className="text-sm text-gray-700 hover:text-brand-blue-dark font-medium py-2 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Articles
              </Link>
              <Link
                href="/about"
                className="text-sm text-gray-700 hover:text-brand-blue-dark font-medium py-2 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </Link>
              <Link
                href="/contact"
                className="text-sm text-gray-700 hover:text-brand-blue-dark font-medium py-2 transition-colors"
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
