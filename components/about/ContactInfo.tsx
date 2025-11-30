/**
 * Contact & Company Information Section
 * Essential contact details and company info
 */
import Link from 'next/link';
import { Mail, Shield, FileText } from 'lucide-react';

export function ContactInfo() {
  return (
    <section className="bg-white px-4 py-16 md:py-20">
      <div className="mx-auto max-w-4xl">
        {/* Section Header */}
        <div className="mb-10 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Contact & Company{' '}
            <span className="bg-gradient-to-r from-brand-blue-dark to-brand-purple bg-clip-text text-transparent">
              Information
            </span>
          </h2>
        </div>

        {/* Company Info Card */}
        <div className="rounded-2xl bg-gradient-to-br from-gray-50 to-white p-8 shadow-lg border border-gray-200 mb-10">
          <div className="text-center mb-8">
            <p className="text-3xl font-bold text-gray-900 mb-2">BPCare AI</p>
            <p className="text-lg text-gray-700 mb-1">
              Independent Digital Health Education Platform
            </p>
            <p className="text-gray-600">Operated globally from Asia-Pacific</p>
          </div>

          {/* Contact Links */}
          <div className="grid gap-6 md:grid-cols-3">
            {/* Email Contact */}
            <Link
              href="mailto:contact@bpcareai.com"
              className="group flex flex-col items-center text-center p-6 rounded-xl bg-white border border-gray-200 hover:border-blue-300 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
            >
              <div className="mb-4 flex justify-center">
                <div className="rounded-full bg-blue-50 p-4 group-hover:bg-blue-100 transition-colors duration-300">
                  <Mail className="h-8 w-8 text-blue-600" />
                </div>
              </div>
              <h3 className="mb-2 font-semibold text-gray-900 text-lg">Email</h3>
              <p className="text-blue-600 group-hover:text-blue-700 group-hover:underline text-sm">
                contact@bpcareai.com
              </p>
            </Link>

            {/* Privacy */}
            <Link
              href="/privacy"
              className="group flex flex-col items-center text-center p-6 rounded-xl bg-white border border-gray-200 hover:border-green-300 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
            >
              <div className="mb-4 flex justify-center">
                <div className="rounded-full bg-green-50 p-4 group-hover:bg-green-100 transition-colors duration-300">
                  <Shield className="h-8 w-8 text-green-600" />
                </div>
              </div>
              <h3 className="mb-2 font-semibold text-gray-900 text-lg">Privacy</h3>
              <p className="text-blue-600 group-hover:text-blue-700 group-hover:underline text-sm">
                Privacy Policy
              </p>
            </Link>

            {/* Terms */}
            <Link
              href="/terms"
              className="group flex flex-col items-center text-center p-6 rounded-xl bg-white border border-gray-200 hover:border-purple-300 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
            >
              <div className="mb-4 flex justify-center">
                <div className="rounded-full bg-purple-50 p-4 group-hover:bg-purple-100 transition-colors duration-300">
                  <FileText className="h-8 w-8 text-purple-600" />
                </div>
              </div>
              <h3 className="mb-2 font-semibold text-gray-900 text-lg">Terms</h3>
              <p className="text-blue-600 group-hover:text-blue-700 group-hover:underline text-sm">
                Terms of Service
              </p>
            </Link>
          </div>
        </div>

        {/* Bottom Commitments */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="rounded-xl bg-blue-50 border border-blue-100 p-6">
            <p className="font-semibold text-gray-900 mb-2">🔒 Data Privacy Commitment</p>
            <p className="text-gray-700">We never sell your data.</p>
          </div>
          <div className="rounded-xl bg-purple-50 border border-purple-100 p-6">
            <p className="font-semibold text-gray-900 mb-2">💬 Feedback Welcome</p>
            <p className="text-gray-700">We welcome your questions and suggestions.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
