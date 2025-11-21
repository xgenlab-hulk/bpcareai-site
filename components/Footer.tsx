import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-br from-gray-50 to-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-brand-blue to-brand-purple rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-xl">BP</span>
              </div>
              <span className="text-2xl font-bold text-gray-900">BPCare AI</span>
            </div>
            <p className="text-gray-600 leading-relaxed max-w-md text-lg">
              Understanding your blood pressure and heart health, one reading at a time.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4 text-lg">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/" className="text-gray-600 hover:text-brand-blue-dark transition-colors text-base">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/articles" className="text-gray-600 hover:text-brand-blue-dark transition-colors text-base">
                  Articles
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4 text-lg">Legal</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/privacy" className="text-gray-600 hover:text-brand-blue-dark transition-colors text-base">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-gray-600 hover:text-brand-blue-dark transition-colors text-base">
                  Terms of Use
                </Link>
              </li>
              <li>
                <a href="mailto:mariememe0624@gmail.com" className="text-gray-600 hover:text-brand-blue-dark transition-colors text-base">
                  Contact
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-8 border-t border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-600 text-base">
              © {currentYear} BPCare AI. All rights reserved.
            </p>
            <p className="text-gray-500 text-sm text-center">
              This app is for informational purposes only and not a substitute for professional medical advice.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
