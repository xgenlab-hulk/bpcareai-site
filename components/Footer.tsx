import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border-t border-slate-700/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-10">
          {/* Brand & Disclaimer */}
          <div className="col-span-1 md:col-span-2">
            {/* Brand */}
            <div className="flex items-center space-x-2.5 mb-3">
              <Image
                src="/AppIcon.png"
                alt="BPCare AI"
                width={36}
                height={36}
                className="rounded-xl"
              />
              <span className="text-xl font-bold text-white">BPCare AI</span>
            </div>

            {/* Description */}
            <p className="text-slate-300 leading-relaxed max-w-md text-sm mb-5">
              Understanding your blood pressure and heart health, one reading at a time.
            </p>

            {/* Medical Disclaimer */}
            <div className="max-w-md mb-4">
              <p className="text-xs font-semibold text-slate-500 mb-1.5">Medical Disclaimer</p>
              <p className="text-xs text-slate-500 leading-relaxed">
                For informational purposes only. Not a medical device.
                Always consult your healthcare provider for medical advice.
              </p>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-white text-sm mb-3">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-slate-300 hover:text-cyan-400 transition-colors duration-200 text-sm inline-flex items-center group">
                  <span className="group-hover:translate-x-0.5 transition-transform duration-200">Home</span>
                </Link>
              </li>
              <li>
                <Link href="/articles" className="text-slate-300 hover:text-cyan-400 transition-colors duration-200 text-sm inline-flex items-center group">
                  <span className="group-hover:translate-x-0.5 transition-transform duration-200">Articles</span>
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-slate-300 hover:text-cyan-400 transition-colors duration-200 text-sm inline-flex items-center group">
                  <span className="group-hover:translate-x-0.5 transition-transform duration-200">About</span>
                </Link>
              </li>
            </ul>

            {/* Copyright */}
            <p className="text-slate-500 text-xs mt-6">
              © {currentYear} BPCare AI. All rights reserved.
            </p>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-semibold text-white text-sm mb-3">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/privacy" className="text-slate-300 hover:text-cyan-400 transition-colors duration-200 text-sm inline-flex items-center group">
                  <span className="group-hover:translate-x-0.5 transition-transform duration-200">Privacy Policy</span>
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-slate-300 hover:text-cyan-400 transition-colors duration-200 text-sm inline-flex items-center group">
                  <span className="group-hover:translate-x-0.5 transition-transform duration-200">Terms of Use</span>
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-slate-300 hover:text-cyan-400 transition-colors duration-200 text-sm inline-flex items-center group">
                  <span className="group-hover:translate-x-0.5 transition-transform duration-200">Contact</span>
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
