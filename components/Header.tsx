import Link from 'next/link';

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200/50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
            <div className="w-10 h-10 bg-gradient-to-br from-brand-blue to-brand-purple rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-xl">BP</span>
            </div>
            <span className="text-2xl font-bold text-gray-900">BPCare AI</span>
          </Link>

          {/* Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-gray-700 hover:text-brand-blue-dark font-medium transition-colors">
              Home
            </Link>
            <Link href="/articles" className="text-gray-700 hover:text-brand-blue-dark font-medium transition-colors">
              Articles
            </Link>
            <a
              href="https://apps.apple.com/app/bpcareai"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gradient-to-r from-brand-blue to-brand-purple text-white px-6 py-3 rounded-full font-semibold hover:shadow-lg transition-all duration-200"
            >
              Download App
            </a>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <a
              href="https://apps.apple.com/app/bpcareai"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gradient-to-r from-brand-blue to-brand-purple text-white px-4 py-2 rounded-full text-sm font-semibold"
            >
              Download
            </a>
          </div>
        </div>
      </nav>
    </header>
  );
}
